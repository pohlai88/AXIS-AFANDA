/**
 * Approvals Bulk Operations API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { getAuthUser } from '@/app/lib/middleware/nextjs-auth';
import { NotFoundError, ValidationError } from '@/app/lib/validation/errors';
import { createErrorResponse, validateRequestBody } from '@/app/lib/validation/nextjs-errors';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ============================================================================
// Validation Schemas
// ============================================================================

const bulkStatusUpdateSchema = z.object({
  approvalIds: z.array(z.string()).min(1),
  status: z.enum(['approved', 'rejected']),
  decision: z.string().optional(),
});

const bulkDeleteSchema = z.object({
  approvalIds: z.array(z.string()).min(1),
});

// ============================================================================
// PATCH /api/v1/approvals/bulk - Bulk approve/reject
// ============================================================================

export async function PATCH(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const { approvalIds, status, decision } = await validateRequestBody(
      request,
      bulkStatusUpdateSchema
    );

    const existing = await db
      .select()
      .from(schema.approvals)
      .where(and(inArray(schema.approvals.id, approvalIds), eq(schema.approvals.tenantId, tenantId)));

    if (existing.length !== approvalIds.length) {
      throw new NotFoundError('Some approvals');
    }

    // Ensure all approvals are in a valid state for processing
    const invalid = existing.filter((a) => a.status !== 'submitted');
    if (invalid.length > 0) {
      throw new ValidationError('All approvals must be submitted and unprocessed');
    }

    const now = new Date();
    const updateData: Record<string, unknown> = {
      status,
      decision,
      updatedAt: now,
      approvedBy: user.id,
      approvedByName: user.name,
    };

    if (status === 'approved') {
      updateData.approvedAt = now;
      updateData.rejectedAt = null;
    } else {
      updateData.rejectedAt = now;
      updateData.approvedAt = null;
    }

    const updatedApprovals = await db
      .update(schema.approvals)
      .set(updateData)
      .where(and(inArray(schema.approvals.id, approvalIds), eq(schema.approvals.tenantId, tenantId)))
      .returning();

    // Activity logs (one per approval)
    await db.insert(schema.activities).values(
      approvalIds.map((approvalId) => ({
        tenantId,
        userId: user.id,
        type: `approval_${status}`,
        source: 'orchestrator',
        title: `Approval ${status}`,
        description: `${user.name} ${status} ${approvalIds.length > 1 ? 'an approval request' : 'the approval request'}`,
        data: { approvalId, decision },
      }))
    );

    return NextResponse.json({ data: updatedApprovals });
  } catch (error) {
    return createErrorResponse(error);
  }
}

// ============================================================================
// DELETE /api/v1/approvals/bulk - Bulk delete (drafts only)
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const { approvalIds } = await validateRequestBody(request, bulkDeleteSchema);

    const existing = await db
      .select()
      .from(schema.approvals)
      .where(and(inArray(schema.approvals.id, approvalIds), eq(schema.approvals.tenantId, tenantId)));

    if (existing.length !== approvalIds.length) {
      throw new NotFoundError('Some approvals');
    }

    const nonDrafts = existing.filter((a) => a.status !== 'draft');
    if (nonDrafts.length > 0) {
      throw new ValidationError('Can only bulk delete draft approvals');
    }

    await db
      .delete(schema.approvals)
      .where(and(inArray(schema.approvals.id, approvalIds), eq(schema.approvals.tenantId, tenantId)));

    return NextResponse.json({ success: true, deleted: approvalIds.length });
  } catch (error) {
    return createErrorResponse(error);
  }
}

