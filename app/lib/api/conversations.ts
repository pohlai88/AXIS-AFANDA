/**
 * API client for conversations
 */

import { apiClient } from './client';
import { z } from 'zod';

// ============================================================================
// Schemas
// ============================================================================
const conversationSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  chatwootId: z.number(),
  status: z.string(),
  priority: z.string().optional().nullable(),
  contactName: z.string().optional().nullable(),
  contactEmail: z.string().optional().nullable(),
  assigneeId: z.number().optional().nullable(),
  assigneeName: z.string().optional().nullable(),
  teamId: z.number().optional().nullable(),
  teamName: z.string().optional().nullable(),
  labels: z.array(z.string()).optional().nullable(),
  unreadCount: z.number(),
  lastMessageAt: z.string().optional().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  // Omnichannel fields
  channelType: z.string().optional().nullable(),
  channelIdentifier: z.string().optional().nullable(),
  unifiedContactId: z.string().optional().nullable(),
  channelMetadata: z.record(z.string(), z.any()).optional().nullable(),
});

const messageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  chatwootId: z.number(),
  content: z.string(),
  messageType: z.string(),
  senderType: z.string(),
  senderId: z.number(),
  senderName: z.string().optional(),
  private: z.boolean(),
  attachments: z.array(z.any()).nullable().optional().transform((val) => val ?? []),
  createdAt: z.string(),
});

const paginatedConversationsSchema = z.object({
  data: z.array(conversationSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number().catch(0), // Default to 0 if invalid
    totalPages: z.number().catch(1), // Default to 1 if invalid
  }),
});

const paginatedMessagesSchema = z.object({
  data: z.array(messageSchema),
});

// ============================================================================
// API Functions
// ============================================================================

export interface ConversationFilters {
  status?: string;
  priority?: string;
  assigneeId?: number | string;
  teamId?: number;
  labels?: string[];
  search?: string;
  hasEscalation?: boolean;
  unreadOnly?: boolean;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: string;
  channelType?: string; // Omnichannel filter
  page?: number;
  limit?: number;
}

export async function getConversations(filters?: ConversationFilters) {
  const params = new URLSearchParams();

  if (filters?.status) params.append('status', filters.status);
  if (filters?.priority) params.append('priority', filters.priority);
  if (filters?.assigneeId) params.append('assigneeId', filters.assigneeId.toString());
  if (filters?.teamId) params.append('teamId', filters.teamId.toString());
  if (filters?.labels && filters.labels.length > 0) {
    filters.labels.forEach(label => params.append('labels', label));
  }
  if (filters?.search) params.append('search', filters.search);
  if (filters?.hasEscalation) params.append('hasEscalation', 'true');
  if (filters?.unreadOnly) params.append('unreadOnly', 'true');
  if (filters?.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString());
  if (filters?.dateTo) params.append('dateTo', filters.dateTo.toISOString());
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
  if (filters?.channelType) params.append('channelType', filters.channelType);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  return apiClient.get(`/conversations?${params}`, paginatedConversationsSchema);
}

export async function getConversation(id: string) {
  return apiClient.get(`/conversations/${id}`, z.object({ data: conversationSchema }));
}

export async function getMessages(conversationId: string) {
  return apiClient.get(`/conversations/${conversationId}/messages`, paginatedMessagesSchema);
}

export async function sendMessage(conversationId: string, content: string, isPrivate = false) {
  return apiClient.post(
    `/conversations/${conversationId}/messages`,
    { content, private: isPrivate },
    z.object({ data: messageSchema })
  );
}

export async function updateConversation(
  conversationId: string,
  updates: {
    status?: string;
    priority?: string;
    assigneeId?: number;
    teamId?: number;
    labels?: string[];
  }
) {
  return apiClient.patch(
    `/conversations/${conversationId}`,
    updates,
    z.object({ data: conversationSchema })
  );
}

export async function escalateConversation(conversationId: string) {
  return apiClient.post(
    `/conversations/${conversationId}/escalate`,
    {},
    z.object({ data: z.any() })
  );
}
