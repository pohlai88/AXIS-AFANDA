/**
 * Conversation Escalation API Route
 * Migrated from orchestrator - creates approval workflows
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { getAuthUser } from '@/app/lib/middleware/nextjs-auth';
import { NotFoundError } from '@/app/lib/validation/errors';
import { createErrorResponse, validateRequestBody } from '@/app/lib/validation/nextjs-errors';
import { z } from 'zod';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const escalateSchema = z.object({
  type: z.enum(['ceo_approval', 'escalation', 'consultation_room']).default('escalation'),
  reason: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

// ============================================================================
// POST /api/v1/conversations/[id]/escalate - Escalate conversation
// ============================================================================

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const { id: conversationId } = await context.params;
    const input = await validateRequestBody(request, escalateSchema);

    // Verify conversation exists
    const [conversation] = await db
      .select()
      .from(schema.conversations)
      .where(
        and(
          eq(schema.conversations.id, conversationId),
          eq(schema.conversations.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!conversation) {
      throw new NotFoundError('Conversation', conversationId);
    }

    // Create approval
    const [approval] = await db
      .insert(schema.approvals)
      .values({
        tenantId,
        conversationId,
        type: input.type,
        status: 'submitted',
        requestedBy: user.id,
        requestedByName: user.name,
        reason: input.reason,
        metadata: input.metadata,
        submittedAt: new Date(),
      })
      .returning();

    // Create activity log
    await db.insert(schema.activities).values({
      tenantId,
      userId: user.id,
      type: 'approval_created',
      source: 'orchestrator',
      title: `Conversation escalated`,
      description: `${user.name} escalated conversation to ${input.type}`,
      data: { approvalId: approval.id, conversationId, type: input.type },
    });

    // Update conversation status to pending (waiting for approval)
    await db
      .update(schema.conversations)
      .set({ status: 'pending', updatedAt: new Date() })
      .where(eq(schema.conversations.id, conversationId));

    return NextResponse.json({
      data: approval,
      message: 'Conversation escalated successfully',
    }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
