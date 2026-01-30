/**
 * Conversation Messages API Route
 * Migrated from orchestrator - full database-backed implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { getAuthUser } from '@/app/lib/middleware/nextjs-auth';
import { NotFoundError } from '@/app/lib/validation/errors';
import { createErrorResponse, validateRequestBody } from '@/app/lib/validation/nextjs-errors';
import { sendMessageSchema } from '@/app/lib/validation/validation';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ============================================================================
// GET /api/v1/conversations/[id]/messages - Get messages for conversation
// ============================================================================

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const { id } = await context.params;

    // Verify conversation exists and belongs to tenant
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

    // Fetch messages
    const messages = await db
      .select()
      .from(schema.messages)
      .where(eq(schema.messages.conversationId, id))
      .orderBy(schema.messages.createdAt);

    return NextResponse.json({ data: messages });
  } catch (error) {
    return createErrorResponse(error);
  }
}

// ============================================================================
// POST /api/v1/conversations/[id]/messages - Send message
// ============================================================================

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const { id } = await context.params;
    const input = await validateRequestBody(request, sendMessageSchema);

    // Verify conversation exists
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

    // TODO: Send message via Chatwoot API
    // const chatwootClient = createChatwootClient();
    // const chatwootMessage = await chatwootClient.sendMessage(
    //   conversation.chatwootId,
    //   input.content,
    //   { private: input.private }
    // );

    // For now, store message directly (in production, this would come from Chatwoot webhook)
    // Note: DB `messages.senderId` is an integer (Chatwoot-style). Our auth user id is a string,
    // so we store `0` for now and rely on `senderName` for display.
    const [message] = await db
      .insert(schema.messages)
      .values({
        conversationId: id,
        chatwootId: Math.floor(Math.random() * 1000000), // TODO: Use real Chatwoot ID
        content: input.content,
        messageType: input.messageType || 'outgoing',
        senderType: 'agent',
        senderId: 0,
        senderName: user.name,
        private: input.private,
        attachments: [],
      })
      .returning();

    // Update conversation last message time
    await db
      .update(schema.conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(schema.conversations.id, id));

    return NextResponse.json({ data: message }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
