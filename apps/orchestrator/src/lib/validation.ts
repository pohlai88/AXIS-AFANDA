import { z } from 'zod';

// ============================================================================
// Common schemas
// ============================================================================
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export const tenantIdSchema = z.object({
  tenantId: z.string().min(1),
});

// ============================================================================
// Approval schemas
// ============================================================================
export const createApprovalSchema = z.object({
  conversationId: z.string().optional(),
  type: z.enum(['ceo_approval', 'escalation', 'consultation_room']),
  reason: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const updateApprovalSchema = z.object({
  status: z.enum(['approved', 'rejected']).optional(),
  decision: z.string().optional(),
  metadata: z.record(z.any()).optional(),
});

export const approvalFiltersSchema = z.object({
  status: z.enum(['draft', 'submitted', 'approved', 'rejected']).optional(),
  type: z.enum(['ceo_approval', 'escalation', 'consultation_room']).optional(),
  conversationId: z.string().optional(),
});

// ============================================================================
// Conversation schemas
// ============================================================================
export const conversationFiltersSchema = z.object({
  status: z.enum(['open', 'resolved', 'pending', 'snoozed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigneeId: z.coerce.number().int().optional(),
  teamId: z.coerce.number().int().optional(),
  labels: z.array(z.string()).optional(),
  search: z.string().optional(),
  hasEscalation: z.coerce.boolean().optional(), // Filter conversations with active escalations
  unreadOnly: z.coerce.boolean().optional(), // Filter conversations with unread messages
  dateFrom: z.coerce.date().optional(), // Filter by date range
  dateTo: z.coerce.date().optional(),
  sortBy: z.enum(['lastMessage', 'priority', 'created', 'unread']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export const sendMessageSchema = z.object({
  content: z.string().min(1),
  private: z.boolean().default(false),
  messageType: z.enum(['incoming', 'outgoing']).default('outgoing'),
});

export const updateConversationSchema = z.object({
  status: z.enum(['open', 'resolved', 'pending', 'snoozed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigneeId: z.number().int().optional(),
  teamId: z.number().int().optional(),
  labels: z.array(z.string()).optional(),
});

// ============================================================================
// Webhook schemas
// ============================================================================
export const chatwootWebhookSchema = z.object({
  event: z.string(),
  account: z.object({
    id: z.number(),
    name: z.string(),
  }).optional(),
  conversation: z.any().optional(),
  message: z.any().optional(),
  contact: z.any().optional(),
});

// ============================================================================
// Activity schemas
// ============================================================================
export const activityFiltersSchema = z.object({
  type: z.string().optional(),
  source: z.enum(['chatwoot', 'orchestrator', 'matrix', 'jitsi']).optional(),
  userId: z.string().optional(),
  since: z.coerce.date().optional(),
});

// ============================================================================
// Type exports
// ============================================================================
export type PaginationParams = z.infer<typeof paginationSchema>;
export type CreateApprovalInput = z.infer<typeof createApprovalSchema>;
export type UpdateApprovalInput = z.infer<typeof updateApprovalSchema>;
export type ApprovalFilters = z.infer<typeof approvalFiltersSchema>;
export type ConversationFilters = z.infer<typeof conversationFiltersSchema>;
export type SendMessageInput = z.infer<typeof sendMessageSchema>;
export type UpdateConversationInput = z.infer<typeof updateConversationSchema>;
export type ChatwootWebhookPayload = z.infer<typeof chatwootWebhookSchema>;
export type ActivityFilters = z.infer<typeof activityFiltersSchema>;
