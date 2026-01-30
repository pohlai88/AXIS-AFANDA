/**
 * Common Types - Shared across all domains
 * All types include Zod schemas for runtime validation
 */

import { z } from 'zod';

// ============================================================================
// User & Identity
// ============================================================================

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  role: z.string().optional(),
});

export type User = z.infer<typeof UserSchema>;

// ============================================================================
// Tenant
// ============================================================================

export const TenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  logo: z.string().optional(),
  settings: z.record(z.unknown()).optional(),
});

export type Tenant = z.infer<typeof TenantSchema>;

// ============================================================================
// Attachments
// ============================================================================

export const AttachmentSchema = z.object({
  id: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string().url(),
  hash: z.string().optional(),
  uploadedBy: z.string().optional(),
  uploadedAt: z.coerce.date().optional(),
});

export type Attachment = z.infer<typeof AttachmentSchema>;

export const AttachmentListSchema = z.array(AttachmentSchema);

// ============================================================================
// Labels & Tags
// ============================================================================

export const LabelSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
  description: z.string().optional(),
});

export type Label = z.infer<typeof LabelSchema>;

export const LabelListSchema = z.array(LabelSchema);

// ============================================================================
// Comments
// ============================================================================

export const CommentSchema = z.object({
  id: z.string(),
  content: z.string(),
  author: UserSchema,
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date().optional(),
  parentId: z.string().optional(), // For threading
  isPinned: z.boolean().optional(),
  mentions: z.array(UserSchema).optional(),
  reactions: z.record(z.number()).optional(), // { "👍": 5, "❤️": 3 }
});

export type Comment = z.infer<typeof CommentSchema>;

export const CommentListSchema = z.array(CommentSchema);

// ============================================================================
// Mentions
// ============================================================================

export const MentionSchema = z.object({
  id: z.string(),
  type: z.enum(['user', 'team', 'role']),
  name: z.string(),
  actorId: z.string(),
});

export type Mention = z.infer<typeof MentionSchema>;

export const MentionListSchema = z.array(MentionSchema);

// ============================================================================
// Timestamps
// ============================================================================

export const TimestampsSchema = z.object({
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable().optional(),
});

export type Timestamps = z.infer<typeof TimestampsSchema>;

// ============================================================================
// Base Entity (for entities with common fields)
// ============================================================================

export const BaseEntitySchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  createdBy: z.string().optional(),
  updatedBy: z.string().optional(),
});

export type BaseEntity = z.infer<typeof BaseEntitySchema>;

// ============================================================================
// Pagination
// ============================================================================

export const PaginationParamsSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

export type PaginationParams = z.infer<typeof PaginationParamsSchema>;

export const PaginationMetaSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

export type PaginationMeta = z.infer<typeof PaginationMetaSchema>;

// ============================================================================
// Filters (Base)
// ============================================================================

export const BaseFiltersSchema = z.object({
  search: z.string().optional(),
  status: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  createdBy: z.string().optional(),
  labels: z.array(z.string()).optional(),
});

export type BaseFilters = z.infer<typeof BaseFiltersSchema>;

// ============================================================================
// Status Types (Common)
// ============================================================================

export const StatusSchema = z.enum([
  'active',
  'inactive',
  'pending',
  'completed',
  'cancelled',
  'archived',
]);

export type Status = z.infer<typeof StatusSchema>;

// ============================================================================
// Priority Types (Common)
// ============================================================================

export const PrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);

export type Priority = z.infer<typeof PrioritySchema>;

// ============================================================================
// Contact Information
// ============================================================================

export const ContactInfoSchema = z.object({
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  timezone: z.string().optional(),
});

export type ContactInfo = z.infer<typeof ContactInfoSchema>;

// ============================================================================
// Metadata (Generic key-value store)
// ============================================================================

export const MetadataSchema = z.record(z.unknown());

export type Metadata = z.infer<typeof MetadataSchema>;
