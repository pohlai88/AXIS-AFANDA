import { pgTable, text, integer, timestamp, jsonb, boolean, index } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// ============================================================================
// Tenants (mirrored from Keycloak later)
// ============================================================================
export const tenants = pgTable('tenants', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'individual', 'team', 'org'
  keycloakRealmId: text('keycloak_realm_id'),
  keycloakGroupId: text('keycloak_group_id'),
  parentId: text('parent_id'),

  // Chatwoot integration (supports both shared and dedicated accounts)
  chatwootInboxId: integer('chatwoot_inbox_id'), // For shared account (Option 1)
  chatwootApiUrl: text('chatwoot_api_url'), // For dedicated account (Option 2)
  chatwootApiToken: text('chatwoot_api_token'), // For dedicated account (encrypted)
  chatwootAccountId: integer('chatwoot_account_id'), // For dedicated account

  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// ============================================================================
// Conversations (synced from Chatwoot)
// ============================================================================
export const conversations = pgTable('conversations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  chatwootId: integer('chatwoot_id').unique().notNull(),
  chatwootAccountId: integer('chatwoot_account_id').notNull(),
  status: text('status').notNull(), // 'open', 'resolved', 'pending', 'snoozed'
  priority: text('priority'), // 'low', 'medium', 'high', 'urgent'
  inboxId: integer('inbox_id').notNull(),
  contactId: integer('contact_id').notNull(),
  contactName: text('contact_name'),
  contactEmail: text('contact_email'),
  assigneeId: integer('assignee_id'),
  assigneeName: text('assignee_name'),
  teamId: integer('team_id'),
  teamName: text('team_name'),
  labels: jsonb('labels').$type<string[]>(),
  customAttributes: jsonb('custom_attributes'),
  lastMessageAt: timestamp('last_message_at'),
  unreadCount: integer('unread_count').default(0).notNull(),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tenantIdx: index('conversations_tenant_idx').on(table.tenantId),
  chatwootIdx: index('conversations_chatwoot_idx').on(table.chatwootId),
  statusIdx: index('conversations_status_idx').on(table.status),
  assigneeIdx: index('conversations_assignee_idx').on(table.assigneeId),
}));

// ============================================================================
// Messages (synced from Chatwoot)
// ============================================================================
export const messages = pgTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  conversationId: text('conversation_id').notNull().references(() => conversations.id, { onDelete: 'cascade' }),
  chatwootId: integer('chatwoot_id').unique().notNull(),
  content: text('content').notNull(),
  messageType: text('message_type').notNull(), // 'incoming', 'outgoing'
  senderType: text('sender_type').notNull(), // 'contact', 'agent', 'bot'
  senderId: integer('sender_id').notNull(),
  senderName: text('sender_name'),
  private: boolean('private').default(false).notNull(),
  attachments: jsonb('attachments').$type<Array<{
    id: number;
    file_type: string;
    file_url: string;
    file_name: string;
  }>>(),
  contentAttributes: jsonb('content_attributes'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  conversationIdx: index('messages_conversation_idx').on(table.conversationId),
  chatwootIdx: index('messages_chatwoot_idx').on(table.chatwootId),
  createdIdx: index('messages_created_idx').on(table.createdAt),
}));

// ============================================================================
// Approvals (orchestrator-owned)
// ============================================================================
export const approvals = pgTable('approvals', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  conversationId: text('conversation_id').references(() => conversations.id, { onDelete: 'set null' }),
  type: text('type').notNull(), // 'ceo_approval', 'escalation', 'consultation_room'
  status: text('status').notNull(), // 'draft', 'submitted', 'approved', 'rejected'
  requestedBy: text('requested_by').notNull(),
  requestedByName: text('requested_by_name'),
  approvedBy: text('approved_by'),
  approvedByName: text('approved_by_name'),
  reason: text('reason'),
  decision: text('decision'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  submittedAt: timestamp('submitted_at'),
  approvedAt: timestamp('approved_at'),
  rejectedAt: timestamp('rejected_at'),
}, (table) => ({
  tenantIdx: index('approvals_tenant_idx').on(table.tenantId),
  statusIdx: index('approvals_status_idx').on(table.status),
  typeIdx: index('approvals_type_idx').on(table.type),
  conversationIdx: index('approvals_conversation_idx').on(table.conversationId),
}));

// ============================================================================
// Activity Timeline (aggregated events)
// ============================================================================
export const activities = pgTable('activities', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),
  userId: text('user_id'),
  type: text('type').notNull(), // 'conversation_created', 'message_created', 'approval_created', etc.
  source: text('source').notNull(), // 'chatwoot', 'orchestrator', 'matrix', 'jitsi'
  title: text('title').notNull(),
  description: text('description'),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  tenantTimeIdx: index('activities_tenant_time_idx').on(table.tenantId, table.createdAt),
  typeIdx: index('activities_type_idx').on(table.type),
  userIdx: index('activities_user_idx').on(table.userId),
}));

// ============================================================================
// Webhook Events (for audit/replay)
// ============================================================================
export const webhookEvents = pgTable('webhook_events', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  source: text('source').notNull(), // 'chatwoot', 'matrix', 'keycloak'
  eventType: text('event_type').notNull(),
  payload: jsonb('payload').notNull(),
  processed: boolean('processed').default(false).notNull(),
  error: text('error'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  processedAt: timestamp('processed_at'),
}, (table) => ({
  processedIdx: index('webhook_events_processed_idx').on(table.processed, table.createdAt),
  sourceIdx: index('webhook_events_source_idx').on(table.source),
}));

// ============================================================================
// Type exports for use in application
// ============================================================================
export type Tenant = typeof tenants.$inferSelect;
export type NewTenant = typeof tenants.$inferInsert;

export type Conversation = typeof conversations.$inferSelect;
export type NewConversation = typeof conversations.$inferInsert;

export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;

export type Approval = typeof approvals.$inferSelect;
export type NewApproval = typeof approvals.$inferInsert;

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

export type WebhookEvent = typeof webhookEvents.$inferSelect;
export type NewWebhookEvent = typeof webhookEvents.$inferInsert;
