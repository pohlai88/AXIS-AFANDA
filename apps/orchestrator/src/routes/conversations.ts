import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db, schema } from '../db/client';
import { eq, and, desc, like, or, inArray, sql } from 'drizzle-orm';
import { getTenantId } from '../middleware/tenant';
import { getAuthUser } from '../middleware/auth';
import { NotFoundError } from '../lib/errors';
import { createChatwootClient } from '../services/chatwoot';
import {
  conversationFiltersSchema,
  paginationSchema,
  sendMessageSchema,
  updateConversationSchema,
} from '../lib/validation';

export const conversationsRouter = new Hono();

// ============================================================================
// GET /conversations - List conversations
// ============================================================================
conversationsRouter.get(
  '/',
  zValidator('query', paginationSchema.merge(conversationFiltersSchema)),
  async (c) => {
    const tenantId = getTenantId(c);
    const { 
      page, 
      limit, 
      status, 
      priority, 
      assigneeId, 
      teamId, 
      labels, 
      search,
      hasEscalation,
      unreadOnly,
      dateFrom,
      dateTo,
      sortBy = 'lastMessage',
      sortOrder = 'desc',
    } = c.req.valid('query');

    // Build where conditions
    const conditions = [eq(schema.conversations.tenantId, tenantId)];

    if (status) {
      conditions.push(eq(schema.conversations.status, status));
    }
    if (priority) {
      conditions.push(eq(schema.conversations.priority, priority));
    }
    if (assigneeId) {
      conditions.push(eq(schema.conversations.assigneeId, assigneeId));
    }
    if (teamId) {
      conditions.push(eq(schema.conversations.teamId, teamId));
    }
    if (search) {
      conditions.push(
        or(
          like(schema.conversations.contactName, `%${search}%`),
          like(schema.conversations.contactEmail, `%${search}%`)
        )!
      );
    }
    if (unreadOnly) {
      conditions.push(sql`${schema.conversations.unreadCount} > 0`);
    }
    if (dateFrom) {
      conditions.push(sql`${schema.conversations.createdAt} >= ${dateFrom}`);
    }
    if (dateTo) {
      conditions.push(sql`${schema.conversations.createdAt} <= ${dateTo}`);
    }

    // Handle label filtering (JSONB contains)
    if (labels && labels.length > 0) {
      conditions.push(sql`${schema.conversations.labels} @> ${JSON.stringify(labels)}`);
    }

    // Build base query
    let query = db
      .select()
      .from(schema.conversations)
      .where(and(...conditions));

    // Handle escalation filter (join with approvals)
    if (hasEscalation) {
      query = db
        .select({
          id: schema.conversations.id,
          tenantId: schema.conversations.tenantId,
          chatwootId: schema.conversations.chatwootId,
          chatwootAccountId: schema.conversations.chatwootAccountId,
          status: schema.conversations.status,
          priority: schema.conversations.priority,
          inboxId: schema.conversations.inboxId,
          contactId: schema.conversations.contactId,
          contactName: schema.conversations.contactName,
          contactEmail: schema.conversations.contactEmail,
          assigneeId: schema.conversations.assigneeId,
          assigneeName: schema.conversations.assigneeName,
          teamId: schema.conversations.teamId,
          teamName: schema.conversations.teamName,
          labels: schema.conversations.labels,
          customAttributes: schema.conversations.customAttributes,
          lastMessageAt: schema.conversations.lastMessageAt,
          unreadCount: schema.conversations.unreadCount,
          metadata: schema.conversations.metadata,
          createdAt: schema.conversations.createdAt,
          updatedAt: schema.conversations.updatedAt,
        })
        .from(schema.conversations)
        .innerJoin(
          schema.approvals,
          and(
            eq(schema.approvals.conversationId, schema.conversations.id),
            eq(schema.approvals.status, 'submitted')
          )
        )
        .where(and(...conditions)) as any;
    }

    // Apply sorting
    const orderColumn = {
      lastMessage: schema.conversations.lastMessageAt,
      priority: schema.conversations.priority,
      created: schema.conversations.createdAt,
      unread: schema.conversations.unreadCount,
    }[sortBy];

    const orderFn = sortOrder === 'asc' ? sql`${orderColumn} ASC` : sql`${orderColumn} DESC`;

    // Fetch conversations with pagination
    const conversations = await query
      .orderBy(orderFn)
      .limit(limit)
      .offset((page - 1) * limit);

    // Count total for pagination
    const countResult = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(schema.conversations)
      .where(and(...conditions));

    const total = Number(countResult[0]?.count) || 0;
    const totalPages = Math.ceil(total / limit);

    return c.json({
      data: conversations,
      meta: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  }
);

// ============================================================================
// GET /conversations/:id - Get conversation by ID
// ============================================================================
conversationsRouter.get('/:id', async (c) => {
  const tenantId = getTenantId(c);
  const id = c.req.param('id');

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

  return c.json({ data: conversation });
});

// ============================================================================
// GET /conversations/:id/messages - Get messages for conversation
// ============================================================================
conversationsRouter.get('/:id/messages', async (c) => {
  const tenantId = getTenantId(c);
  const id = c.req.param('id');

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

  return c.json({ data: messages });
});

// ============================================================================
// POST /conversations/:id/messages - Send message
// ============================================================================
conversationsRouter.post(
  '/:id/messages',
  zValidator('json', sendMessageSchema),
  async (c) => {
    const tenantId = getTenantId(c);
    const user = getAuthUser(c);
    const id = c.req.param('id');
    const input = c.req.valid('json');

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

    // Send message via Chatwoot API
    const chatwootClient = createChatwootClient();
    const chatwootMessage = await chatwootClient.sendMessage(
      conversation.chatwootId,
      input.content,
      {
        private: input.private,
      }
    );

    // Store message locally
    const [message] = await db
      .insert(schema.messages)
      .values({
        conversationId: id,
        chatwootId: chatwootMessage.id,
        content: chatwootMessage.content,
        messageType: chatwootMessage.message_type,
        senderType: chatwootMessage.sender?.type || 'agent',
        senderId: chatwootMessage.sender?.id || 0,
        senderName: chatwootMessage.sender?.name,
        private: chatwootMessage.private || false,
        attachments: chatwootMessage.attachments,
        contentAttributes: chatwootMessage.content_attributes,
      })
      .returning();

    // Update conversation last message time
    await db
      .update(schema.conversations)
      .set({ lastMessageAt: new Date() })
      .where(eq(schema.conversations.id, id));

    return c.json({ data: message }, 201);
  }
);

// ============================================================================
// PATCH /conversations/:id - Update conversation
// ============================================================================
conversationsRouter.patch(
  '/:id',
  zValidator('json', updateConversationSchema),
  async (c) => {
    const tenantId = getTenantId(c);
    const user = getAuthUser(c);
    const id = c.req.param('id');
    const input = c.req.valid('json');

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

    // Update via Chatwoot API
    const chatwootClient = createChatwootClient();
    await chatwootClient.updateConversation(existing.chatwootId, input);

    // Update locally
    const [conversation] = await db
      .update(schema.conversations)
      .set({
        ...input,
        updatedAt: new Date(),
      })
      .where(eq(schema.conversations.id, id))
      .returning();

    // Create activity log
    await db.insert(schema.activities).values({
      tenantId,
      userId: user.id,
      type: 'conversation_updated',
      source: 'orchestrator',
      title: 'Conversation updated',
      description: `${user.name} updated conversation`,
      data: { conversationId: id, changes: input },
    });

    return c.json({ data: conversation });
  }
);

// ============================================================================
// POST /conversations/:id/escalate - Escalate conversation
// ============================================================================
conversationsRouter.post('/:id/escalate', async (c) => {
  const tenantId = getTenantId(c);
  const user = getAuthUser(c);
  const id = c.req.param('id');

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

  // Create approval
  const [approval] = await db
    .insert(schema.approvals)
    .values({
      tenantId,
      conversationId: id,
      type: 'escalation',
      status: 'submitted',
      requestedBy: user.id,
      requestedByName: user.name,
      reason: 'Escalated from conversation',
      submittedAt: new Date(),
    })
    .returning();

  // Create activity log
  await db.insert(schema.activities).values({
    tenantId,
    userId: user.id,
    type: 'conversation_escalated',
    source: 'orchestrator',
    title: 'Conversation escalated',
    description: `${user.name} escalated conversation to approval`,
    data: { conversationId: id, approvalId: approval.id },
  });

  return c.json({ data: approval }, 201);
});
