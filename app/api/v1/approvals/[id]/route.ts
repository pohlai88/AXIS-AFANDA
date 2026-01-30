/**
 * Single Approval API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { getAuthUser } from '@/app/lib/middleware/nextjs-auth';
import { NotFoundError, ValidationError } from '@/app/lib/validation/errors';
import { createErrorResponse, validateRequestBody } from '@/app/lib/validation/nextjs-errors';
import { updateApprovalSchema } from '@/app/lib/validation/validation';
import { APPROVAL_STATUS } from '@/app/lib/constants';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ============================================================================
// GET /api/v1/approvals/[id] - Get approval by ID
// ============================================================================

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const { id } = await context.params;

    const [approval] = await db
      .select()
      .from(schema.approvals)
      .where(
        and(
          eq(schema.approvals.id, id),
          eq(schema.approvals.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!approval) {
      throw new NotFoundError('Approval', id);
    }

    return NextResponse.json({ data: approval });
  } catch (error) {
    return createErrorResponse(error);
  }
}

// ============================================================================
// PATCH /api/v1/approvals/[id] - Update approval (approve/reject)
// ============================================================================

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const { id } = await context.params;
    const input = await validateRequestBody(request, updateApprovalSchema);

    // Fetch existing approval
    const [existing] = await db
      .select()
      .from(schema.approvals)
      .where(
        and(
          eq(schema.approvals.id, id),
          eq(schema.approvals.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundError('Approval', id);
    }

    // Validate status transition
    if (input.status) {
      if (existing.status === APPROVAL_STATUS.APPROVED || existing.status === APPROVAL_STATUS.REJECTED) {
        throw new ValidationError('Cannot modify an already processed approval');
      }
      if (existing.status !== APPROVAL_STATUS.SUBMITTED) {
        throw new ValidationError('Can only approve/reject submitted approvals');
      }
    }

    // Update approval
    const updateData: Record<string, unknown> = {
      ...input,
      updatedAt: new Date(),
    };

    if (input.status === APPROVAL_STATUS.APPROVED) {
      updateData.approvedBy = user.id;
      updateData.approvedByName = user.name;
      updateData.approvedAt = new Date();
    } else if (input.status === APPROVAL_STATUS.REJECTED) {
      updateData.approvedBy = user.id;
      updateData.approvedByName = user.name;
      updateData.rejectedAt = new Date();
    }

    const [approval] = await db
      .update(schema.approvals)
      .set(updateData)
      .where(eq(schema.approvals.id, id))
      .returning();

    // Create activity log
    if (input.status) {
      await db.insert(schema.activities).values({
        tenantId,
        userId: user.id,
        type: `approval_${input.status}`,
        source: 'orchestrator',
        title: `Approval ${input.status}`,
        description: `${user.name} ${input.status} the approval request`,
        data: { approvalId: approval.id, decision: input.decision },
      });
    }

    return NextResponse.json({ data: approval });
  } catch (error) {
    return createErrorResponse(error);
  }
}

// ============================================================================
// DELETE /api/v1/approvals/[id] - Delete approval (only drafts)
// ============================================================================

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const { id } = await context.params;

    const [existing] = await db
      .select()
      .from(schema.approvals)
      .where(
        and(
          eq(schema.approvals.id, id),
          eq(schema.approvals.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundError('Approval', id);
    }

    if (existing.status !== 'draft') {
      throw new ValidationError('Can only delete draft approvals');
    }

    await db.delete(schema.approvals).where(eq(schema.approvals.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
