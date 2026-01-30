/**
 * Conversations Bulk Operations API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { NotFoundError } from '@/app/lib/validation/errors';
import { createErrorResponse, validateRequestBody } from '@/app/lib/validation/nextjs-errors';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ============================================================================
// Validation Schemas
// ============================================================================

const bulkUpdateSchema = z.object({
  conversationIds: z.array(z.string()).min(1),
  updates: z.object({
    status: z.enum(['open', 'resolved', 'pending', 'snoozed']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    assigneeId: z.number().int().nullable().optional(),
    assigneeName: z.string().nullable().optional(),
    teamId: z.number().int().nullable().optional(),
    teamName: z.string().nullable().optional(),
    labels: z.array(z.string()).nullable().optional(),
    unreadCount: z.number().int().min(0).optional(),
  }),
  labelsOp: z
    .object({
      op: z.enum(['add', 'remove', 'set']),
      labels: z.array(z.string()).min(1),
    })
    .optional(),
});

const bulkDeleteSchema = z.object({
  conversationIds: z.array(z.string()).min(1),
});

// ============================================================================
// PATCH /api/v1/conversations/bulk - Bulk update conversations
// ============================================================================

export async function PATCH(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const { conversationIds, updates, labelsOp } = await validateRequestBody(request, bulkUpdateSchema);

    const existing = await db
      .select()
      .from(schema.conversations)
      .where(and(inArray(schema.conversations.id, conversationIds), eq(schema.conversations.tenantId, tenantId)));

    if (existing.length !== conversationIds.length) {
      throw new NotFoundError('Some conversations');
    }

    const now = new Date();

    // Fast path: uniform update across all conversations.
    if (!labelsOp) {
      const updated = await db
        .update(schema.conversations)
        .set({
          ...updates,
          updatedAt: now,
        })
        .where(and(inArray(schema.conversations.id, conversationIds), eq(schema.conversations.tenantId, tenantId)))
        .returning();

      return NextResponse.json({ data: updated });
    }

    // Labels op path: compute per-conversation labels.
    const updatedRows: typeof existing = [];
    for (const conv of existing) {
      const currentLabels = Array.isArray(conv.labels) ? conv.labels : [];
      let nextLabels = currentLabels;
      if (labelsOp.op === 'set') {
        nextLabels = labelsOp.labels;
      } else if (labelsOp.op === 'add') {
        nextLabels = Array.from(new Set([...currentLabels, ...labelsOp.labels]));
      } else if (labelsOp.op === 'remove') {
        const toRemove = new Set(labelsOp.labels);
        nextLabels = currentLabels.filter((l) => !toRemove.has(l));
      }

      const [updated] = await db
        .update(schema.conversations)
        .set({
          ...updates,
          labels: nextLabels,
          updatedAt: now,
        })
        .where(and(eq(schema.conversations.id, conv.id), eq(schema.conversations.tenantId, tenantId)))
        .returning();

      if (updated) updatedRows.push(updated);
    }

    return NextResponse.json({ data: updatedRows });
  } catch (error) {
    return createErrorResponse(error);
  }
}

// ============================================================================
// DELETE /api/v1/conversations/bulk - Bulk delete conversations
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const { conversationIds } = await validateRequestBody(request, bulkDeleteSchema);

    const existing = await db
      .select({ id: schema.conversations.id })
      .from(schema.conversations)
      .where(and(inArray(schema.conversations.id, conversationIds), eq(schema.conversations.tenantId, tenantId)));

    if (existing.length !== conversationIds.length) {
      throw new NotFoundError('Some conversations');
    }

    await db
      .delete(schema.conversations)
      .where(and(inArray(schema.conversations.id, conversationIds), eq(schema.conversations.tenantId, tenantId)));

    return NextResponse.json({ success: true, deleted: conversationIds.length });
  } catch (error) {
    return createErrorResponse(error);
  }
}

