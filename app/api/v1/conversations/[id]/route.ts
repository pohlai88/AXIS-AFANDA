/**
 * Single Conversation API Route
 * Migrated from orchestrator - full database-backed implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { NotFoundError } from '@/app/lib/validation/errors';
import { createErrorResponse, validateRequestBody } from '@/app/lib/validation/nextjs-errors';
import { updateConversationSchema } from '@/app/lib/validation/validation';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ============================================================================
// GET /api/v1/conversations/[id] - Get conversation by ID
// ============================================================================

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const { id } = await context.params;

    const [conversation] = await db
      .select()
      .from(schema.conversations)
      .where(
        and(
          eq(schema.conversations.id, id),
          eq(schema.conversations.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!conversation) {
      throw new NotFoundError('Conversation', id);
    }

    return NextResponse.json({ data: conversation });
  } catch (error) {
    return createErrorResponse(error);
  }
}

// ============================================================================
// PATCH /api/v1/conversations/[id] - Update conversation
// ============================================================================

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const { id } = await context.params;
    const input = await validateRequestBody(request, updateConversationSchema);

    // Verify conversation exists
    const [existing] = await db
      .select()
      .from(schema.conversations)
      .where(
        and(
          eq(schema.conversations.id, id),
          eq(schema.conversations.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundError('Conversation', id);
    }

    // Update conversation locally
    const [updated] = await db
      .update(schema.conversations)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(schema.conversations.id, id))
      .returning();

    // TODO: Also update in Chatwoot if needed
    // const chatwootClient = createChatwootClient();
    // await chatwootClient.updateConversation(existing.chatwootId, input);

    return NextResponse.json({ data: updated });
  } catch (error) {
    return createErrorResponse(error);
  }
}
