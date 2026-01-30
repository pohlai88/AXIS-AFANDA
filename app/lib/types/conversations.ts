/**
 * Conversations Domain Types (Inbox & Omnichannel)
 * Centralized types with Zod validation
 */

import { z } from 'zod';
import { BaseEntitySchema } from './common';

// ============================================================================
// Conversation Status
// ============================================================================

export const ConversationStatusSchema = z.enum(['open', 'pending', 'snoozed', 'resolved']);
export type ConversationStatus = z.infer<typeof ConversationStatusSchema>;

// ============================================================================
// Message Type
// ============================================================================

export const MessageTypeSchema = z.enum([
  'incoming',
  'outgoing',
  'activity',
  'template',
  'private_note',
]);
export type MessageType = z.infer<typeof MessageTypeSchema>;

// ============================================================================
// Sender Type
// ============================================================================

export const SenderTypeSchema = z.enum(['contact', 'agent', 'bot', 'system']);
export type SenderType = z.infer<typeof SenderTypeSchema>;

// ============================================================================
// Channel Type (Omnichannel)
// ============================================================================

export const ChannelTypeSchema = z.enum([
  'email',
  'whatsapp',
  'facebook',
  'instagram',
  'line',
  'wechat',
  'tiktok',
  'website',
  'sms',
  'twitter',
  'telegram',
]);
export type ChannelType = z.infer<typeof ChannelTypeSchema>;

// ============================================================================
// Priority
// ============================================================================

export const ConversationPrioritySchema = z.enum(['none', 'low', 'medium', 'high', 'urgent']);
export type ConversationPriority = z.infer<typeof ConversationPrioritySchema>;

// ============================================================================
// Message Attachment
// ============================================================================

export const MessageAttachmentSchema = z.object({
  id: z.number(),
  messageId: z.number(),
  fileType: z.string(),
  accountId: z.number(),
  extension: z.string().optional(),
  dataUrl: z.string().url(),
  thumbUrl: z.string().url().optional(),
  fileSize: z.number().optional(),
});

export type MessageAttachment = z.infer<typeof MessageAttachmentSchema>;

// ============================================================================
// Message
// ============================================================================

export const MessageSchema = z.object({
  id: z.string(),
  conversationId: z.string(),
  chatwootId: z.number(),
  content: z.string(),
  messageType: MessageTypeSchema,
  senderType: SenderTypeSchema,
  senderId: z.number(),
  senderName: z.string().optional(),
  private: z.boolean().default(false),
  attachments: z.array(MessageAttachmentSchema).optional(),
  contentAttributes: z.record(z.unknown()).optional(),
  sourceId: z.string().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
});

export type Message = z.infer<typeof MessageSchema>;
export const MessageListSchema = z.array(MessageSchema);

// ============================================================================
// Contact
// ============================================================================

export const ContactSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  avatar: z.string().url().optional(),
  identifier: z.string().optional(),
  customAttributes: z.record(z.unknown()).optional(),
  lastActivityAt: z.coerce.date().optional(),
});

export type Contact = z.infer<typeof ContactSchema>;

// ============================================================================
// Conversation (Base)
// ============================================================================

export const ConversationBaseSchema = BaseEntitySchema.extend({
  chatwootId: z.number(),
  status: ConversationStatusSchema,
  priority: ConversationPrioritySchema.optional(),
  contactId: z.number().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().optional(),
  assigneeId: z.number().optional(),
  assigneeName: z.string().optional(),
  teamId: z.number().optional(),
  teamName: z.string().optional(),
  labels: z.array(z.string()).default([]),
  unreadCount: z.number().default(0),
  lastMessageAt: z.coerce.date().optional(),
  snoozedUntil: z.coerce.date().optional(),
  customAttributes: z.record(z.unknown()).optional(),
});

// ============================================================================
// Inbox Conversation (Internal)
// ============================================================================

export const InboxConversationSchema = ConversationBaseSchema.extend({
  type: z.literal('internal'),
  isGroup: z.boolean().default(false),
  participants: z.array(z.string()).default([]),
  groupName: z.string().optional(),
  groupAvatar: z.string().url().optional(),
});

export type InboxConversation = z.infer<typeof InboxConversationSchema>;

// ============================================================================
// Omnichannel Conversation (External/Customer)
// ============================================================================

export const OmnichannelConversationSchema = ConversationBaseSchema.extend({
  type: z.literal('external'),
  channelType: ChannelTypeSchema,
  channelIdentifier: z.string(), // e.g., phone number, FB page ID
  channelMetadata: z.record(z.unknown()).optional(),
  unifiedContactId: z.string().optional(), // Unified customer profile ID
  firstResponseSLA: z.number().optional(), // minutes
  resolutionSLA: z.number().optional(), // minutes
  firstResponseAt: z.coerce.date().optional(),
  resolvedAt: z.coerce.date().optional(),
  slaBreach: z.boolean().default(false),
});

export type OmnichannelConversation = z.infer<typeof OmnichannelConversationSchema>;

// ============================================================================
// Unified Conversation (Union type)
// ============================================================================

export const ConversationSchema = z.union([InboxConversationSchema, OmnichannelConversationSchema]);
export type Conversation = z.infer<typeof ConversationSchema>;
export const ConversationListSchema = z.array(ConversationSchema);

// ============================================================================
// Create/Update Schemas
// ============================================================================

export const CreateConversationSchema = z.object({
  type: z.enum(['internal', 'external']),
  contactEmail: z.string().email().optional(),
  contactName: z.string().optional(),
  isGroup: z.boolean().optional(),
  participants: z.array(z.string()).optional(),
  groupName: z.string().optional(),
  initialMessage: z.string().optional(),
});

export type CreateConversationData = z.infer<typeof CreateConversationSchema>;

export const UpdateConversationSchema = z.object({
  status: ConversationStatusSchema.optional(),
  priority: ConversationPrioritySchema.optional(),
  assigneeId: z.number().optional(),
  teamId: z.number().optional(),
  labels: z.array(z.string()).optional(),
  snoozedUntil: z.coerce.date().optional(),
});

export type UpdateConversationData = z.infer<typeof UpdateConversationSchema>;

export const SendMessageSchema = z.object({
  content: z.string().min(1),
  messageType: MessageTypeSchema.default('outgoing'),
  private: z.boolean().default(false),
  attachments: z.array(z.string()).optional(), // File IDs
});

export type SendMessageData = z.infer<typeof SendMessageSchema>;

export const EscalateConversationSchema = z.object({
  reason: z.string().min(10),
  priority: ConversationPrioritySchema.default('high'),
  escalateTo: z.string().optional(), // User or team ID
  notes: z.string().optional(),
});

export type EscalateConversationData = z.infer<typeof EscalateConversationSchema>;

// ============================================================================
// Conversation Filters
// ============================================================================

export const ConversationFiltersSchema = z.object({
  search: z.string().optional(),
  type: z.enum(['internal', 'external']).optional(),
  status: ConversationStatusSchema.optional(),
  priority: ConversationPrioritySchema.optional(),
  assigneeId: z.number().optional(),
  teamId: z.number().optional(),
  channelType: ChannelTypeSchema.optional(),
  labels: z.array(z.string()).optional(),
  unreadOnly: z.boolean().optional(),
  isGroup: z.boolean().optional(),
  slaBreach: z.boolean().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export type ConversationFilters = z.infer<typeof ConversationFiltersSchema>;

// ============================================================================
// Conversation Statistics
// ============================================================================

export const ConversationStatsSchema = z.object({
  total: z.number(),
  open: z.number(),
  pending: z.number(),
  resolved: z.number(),
  unread: z.number(),
  assigned: z.number(),
  urgent: z.number(),
  slaBreach: z.number().optional(),
  avgResponseTime: z.number().optional(), // in minutes
  avgResolutionTime: z.number().optional(), // in minutes
});

export type ConversationStats = z.infer<typeof ConversationStatsSchema>;

// ============================================================================
// Channel Configuration (Omnichannel Setup)
// ============================================================================

export const ChannelConfigSchema = z.object({
  id: z.string(),
  channelType: ChannelTypeSchema,
  name: z.string(),
  enabled: z.boolean().default(true),
  credentials: z.record(z.unknown()), // API keys, tokens, etc.
  webhookUrl: z.string().url().optional(),
  settings: z.record(z.unknown()).optional(),
  connectedAt: z.coerce.date().optional(),
  lastSyncAt: z.coerce.date().optional(),
  status: z.enum(['active', 'error', 'disconnected']).default('disconnected'),
  errorMessage: z.string().optional(),
});

export type ChannelConfig = z.infer<typeof ChannelConfigSchema>;
export const ChannelConfigListSchema = z.array(ChannelConfigSchema);
