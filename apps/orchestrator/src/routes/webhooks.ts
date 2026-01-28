import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db, schema } from '../db/client';
import { eq } from 'drizzle-orm';
import { chatwootWebhookSchema } from '../lib/validation';

export const webhooksRouter = new Hono();

// ============================================================================
// POST /webhooks/chatwoot - Receive Chatwoot webhooks
// ============================================================================
webhooksRouter.post(
  '/chatwoot',
  zValidator('json', chatwootWebhookSchema),
  async (c) => {
    const payload = c.req.valid('json');

    console.log('Received Chatwoot webhook:', payload.event);

    // Store webhook event for audit/replay
    const [webhookEvent] = await db
      .insert(schema.webhookEvents)
      .values({
        source: 'chatwoot',
        eventType: payload.event,
        payload: payload as any,
        processed: false,
      })
      .returning();

    try {
      // Process webhook based on event type
      switch (payload.event) {
        case 'conversation_created':
          await handleConversationCreated(payload);
          break;
        case 'conversation_updated':
          await handleConversationUpdated(payload);
          break;
        case 'conversation_status_changed':
          await handleConversationStatusChanged(payload);
          break;
        case 'message_created':
          await handleMessageCreated(payload);
          break;
        case 'message_updated':
          await handleMessageUpdated(payload);
          break;
        case 'webwidget_triggered':
          await handleWebwidgetTriggered(payload);
          break;
        case 'contact_created':
          await handleContactCreated(payload);
          break;
        case 'contact_updated':
          await handleContactUpdated(payload);
          break;
        case 'conversation_typing_on':
        case 'conversation_typing_off':
          await handleTypingStatus(payload);
          break;
        default:
          console.log('Unhandled webhook event:', payload.event);
      }

      // Mark webhook as processed
      await db
        .update(schema.webhookEvents)
        .set({
          processed: true,
          processedAt: new Date(),
        })
        .where(eq(schema.webhookEvents.id, webhookEvent.id));

      return c.json({ success: true, eventId: webhookEvent.id });
    } catch (error) {
      console.error('Error processing webhook:', error);

      // Store error
      await db
        .update(schema.webhookEvents)
        .set({
          error: error instanceof Error ? error.message : 'Unknown error',
        })
        .where(eq(schema.webhookEvents.id, webhookEvent.id));

      return c.json({ success: false, error: 'Failed to process webhook' }, 500);
    }
  }
);

// ============================================================================
// Webhook handlers
// ============================================================================
async function handleConversationCreated(payload: any) {
  const conversation = payload.conversation;
  if (!conversation) return;

  // Map inbox ID to tenant (Option 1: Shared Account)
  const tenantId = await getTenantIdFromInbox(conversation.inbox_id);

  // Check if conversation already exists
  const [existing] = await db
    .select()
    .from(schema.conversations)
    .where(eq(schema.conversations.chatwootId, conversation.id))
    .limit(1);

  if (existing) {
    console.log('Conversation already exists:', conversation.id);
    return;
  }

  // Create conversation
  await db.insert(schema.conversations).values({
    tenantId,
    chatwootId: conversation.id,
    chatwootAccountId: conversation.account_id,
    status: conversation.status,
    priority: conversation.priority,
    inboxId: conversation.inbox_id,
    contactId: conversation.contact?.id || 0,
    contactName: conversation.contact?.name,
    contactEmail: conversation.contact?.email,
    assigneeId: conversation.assignee?.id,
    assigneeName: conversation.assignee?.name,
    teamId: conversation.team?.id,
    teamName: conversation.team?.name,
    labels: conversation.labels,
    customAttributes: conversation.custom_attributes,
    lastMessageAt: conversation.last_activity_at ? new Date(conversation.last_activity_at * 1000) : new Date(),
    unreadCount: conversation.unread_count || 0,
  });

  // Create activity
  await db.insert(schema.activities).values({
    tenantId,
    type: 'conversation_created',
    source: 'chatwoot',
    title: 'New conversation',
    description: `Conversation from ${conversation.contact?.name || 'Unknown'}`,
    data: { chatwootId: conversation.id },
  });

  console.log('Created conversation:', conversation.id);
}

async function handleConversationUpdated(payload: any) {
  const conversation = payload.conversation;
  if (!conversation) return;

  // Update existing conversation
  await db
    .update(schema.conversations)
    .set({
      status: conversation.status,
      priority: conversation.priority,
      assigneeId: conversation.assignee?.id,
      assigneeName: conversation.assignee?.name,
      teamId: conversation.team?.id,
      teamName: conversation.team?.name,
      labels: conversation.labels,
      customAttributes: conversation.custom_attributes,
      unreadCount: conversation.unread_count || 0,
      updatedAt: new Date(),
    })
    .where(eq(schema.conversations.chatwootId, conversation.id));

  console.log('Updated conversation:', conversation.id);
}

async function handleConversationStatusChanged(payload: any) {
  const conversation = payload.conversation;
  if (!conversation) return;

  await db
    .update(schema.conversations)
    .set({
      status: conversation.status,
      updatedAt: new Date(),
    })
    .where(eq(schema.conversations.chatwootId, conversation.id));

  console.log('Status changed for conversation:', conversation.id);
}

async function handleMessageCreated(payload: any) {
  const message = payload.message;
  if (!message) return;

  // Find conversation
  const [conversation] = await db
    .select()
    .from(schema.conversations)
    .where(eq(schema.conversations.chatwootId, message.conversation_id))
    .limit(1);

  if (!conversation) {
    console.log('Conversation not found for message:', message.conversation_id);
    return;
  }

  // Check if message already exists
  const [existing] = await db
    .select()
    .from(schema.messages)
    .where(eq(schema.messages.chatwootId, message.id))
    .limit(1);

  if (existing) {
    console.log('Message already exists:', message.id);
    return;
  }

  // Create message
  await db.insert(schema.messages).values({
    conversationId: conversation.id,
    chatwootId: message.id,
    content: message.content,
    messageType: message.message_type,
    senderType: message.sender?.type || 'contact',
    senderId: message.sender?.id || 0,
    senderName: message.sender?.name,
    private: message.private || false,
    attachments: message.attachments,
    contentAttributes: message.content_attributes,
  });

  // Update conversation last message time
  await db
    .update(schema.conversations)
    .set({ lastMessageAt: new Date() })
    .where(eq(schema.conversations.id, conversation.id));

  // Create activity
  await db.insert(schema.activities).values({
    tenantId: conversation.tenantId,
    type: 'message_created',
    source: 'chatwoot',
    title: 'New message',
    description: `Message from ${message.sender?.name || 'Unknown'}`,
    data: { chatwootId: message.id, conversationId: conversation.id },
  });

  console.log('Created message:', message.id);
}

async function handleMessageUpdated(payload: any) {
  const message = payload.message;
  if (!message) return;

  await db
    .update(schema.messages)
    .set({
      content: message.content,
      contentAttributes: message.content_attributes,
    })
    .where(eq(schema.messages.chatwootId, message.id));

  console.log('Updated message:', message.id);
}

async function handleWebwidgetTriggered(payload: any) {
  const webwidget = payload.webwidget;
  if (!webwidget) return;

  // TODO: Map Chatwoot account_id to tenant_id
  const tenantId = 'mock-tenant-id';

  // Create activity for widget opened
  await db.insert(schema.activities).values({
    tenantId,
    type: 'webwidget_opened',
    source: 'chatwoot',
    title: 'Live chat widget opened',
    description: `User opened chat widget`,
    data: { webwidget },
  });

  console.log('Webwidget triggered:', webwidget);
}

async function handleContactCreated(payload: any) {
  const contact = payload.contact;
  if (!contact) return;

  // TODO: Map Chatwoot account_id to tenant_id
  const tenantId = 'mock-tenant-id';

  // Create activity for new contact
  await db.insert(schema.activities).values({
    tenantId,
    type: 'contact_created',
    source: 'chatwoot',
    title: 'New contact created',
    description: `Contact ${contact.name || contact.email} was created`,
    data: { contactId: contact.id, contact },
  });

  console.log('Contact created:', contact.id);
}

async function handleContactUpdated(payload: any) {
  const contact = payload.contact;
  if (!contact) return;

  // TODO: Map Chatwoot account_id to tenant_id
  const tenantId = 'mock-tenant-id';

  // Create activity for contact update
  await db.insert(schema.activities).values({
    tenantId,
    type: 'contact_updated',
    source: 'chatwoot',
    title: 'Contact updated',
    description: `Contact ${contact.name || contact.email} was updated`,
    data: { contactId: contact.id, contact },
  });

  console.log('Contact updated:', contact.id);
}

async function handleTypingStatus(payload: any) {
  const conversation = payload.conversation;
  const user = payload.user;
  if (!conversation || !user) return;

  // Find conversation to get tenant ID
  const [dbConversation] = await db
    .select()
    .from(schema.conversations)
    .where(eq(schema.conversations.chatwootId, conversation.id))
    .limit(1);

  if (!dbConversation) {
    console.log('Conversation not found for typing status:', conversation.id);
    return;
  }

  const isTyping = payload.event === 'conversation_typing_on';

  // Create activity for typing status
  await db.insert(schema.activities).values({
    tenantId: dbConversation.tenantId,
    type: isTyping ? 'typing_started' : 'typing_stopped',
    source: 'chatwoot',
    title: isTyping ? 'User started typing' : 'User stopped typing',
    description: `${user.name || 'User'} ${isTyping ? 'started' : 'stopped'} typing`,
    data: {
      conversationId: conversation.id,
      userId: user.id,
      isTyping
    },
  });

  console.log(`Typing ${isTyping ? 'started' : 'stopped'} in conversation:`, conversation.id);
}

// ============================================================================
// Helper functions for tenant mapping
// ============================================================================

/**
 * Map Chatwoot inbox ID to tenant ID (Option 1: Shared Account)
 */
async function getTenantIdFromInbox(inboxId: number | undefined): Promise<string> {
  if (!inboxId) {
    console.warn('⚠️  No inbox ID provided, using fallback tenant');
    return 'mock-tenant-id';
  }

  const tenant = await db.query.tenants.findFirst({
    where: eq(schema.tenants.chatwootInboxId, inboxId),
  });

  if (tenant) {
    console.log(`✅ Mapped inbox ${inboxId} → tenant ${tenant.name} (${tenant.id})`);
    return tenant.id;
  }

  console.warn(`⚠️  No tenant found for inbox ${inboxId}, using fallback`);
  return 'mock-tenant-id';
}

/**
 * Map Chatwoot account ID to tenant ID (Option 2: Dedicated Account)
 * Falls back to Option 1 if no dedicated account found
 */
async function getTenantIdFromAccount(accountId: number | undefined): Promise<string> {
  if (!accountId) {
    console.warn('⚠️  No account ID provided, using fallback tenant');
    return 'mock-tenant-id';
  }

  // Try Option 2 first (dedicated account)
  const tenant = await db.query.tenants.findFirst({
    where: eq(schema.tenants.chatwootAccountId, accountId),
  });

  if (tenant) {
    console.log(`✅ Mapped account ${accountId} → tenant ${tenant.name} (${tenant.id})`);
    return tenant.id;
  }

  // Fall back to mock tenant
  console.warn(`⚠️  No tenant found for account ${accountId}, using fallback`);
  return 'mock-tenant-id';
}
