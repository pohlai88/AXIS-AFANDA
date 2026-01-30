/**
 * Whiteboards Domain Types
 * Centralized types with Zod validation
 */

import { z } from 'zod';
import { BaseEntitySchema, UserSchema, LabelSchema, CommentSchema } from './common';

// ============================================================================
// Whiteboard Visibility
// ============================================================================

export const WhiteboardVisibilitySchema = z.enum(['private', 'team', 'public']);
export type WhiteboardVisibility = z.infer<typeof WhiteboardVisibilitySchema>;

// ============================================================================
// Whiteboard Background
// ============================================================================

export const WhiteboardBackgroundSchema = z.enum([
  'default-grid',
  'horizontal-lines',
  'square-grid',
  'dots',
  'none',
]);
export type WhiteboardBackground = z.infer<typeof WhiteboardBackgroundSchema>;

// ============================================================================
// Whiteboard Collaborator
// ============================================================================

export const WhiteboardCollaboratorSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  role: z.enum(['owner', 'editor', 'viewer']),
  isActive: z.boolean().default(false), // Currently viewing/editing
  lastSeen: z.coerce.date().optional(),
});

export type WhiteboardCollaborator = z.infer<typeof WhiteboardCollaboratorSchema>;
export const WhiteboardCollaboratorListSchema = z.array(WhiteboardCollaboratorSchema);

// ============================================================================
// Whiteboard Snapshot
// ============================================================================

export const WhiteboardSnapshotSchema = z.object({
  id: z.string(),
  whiteboardId: z.string(),
  name: z.string(),
  description: z.string().optional(),
  thumbnailUrl: z.string().url().optional(),
  data: z.string(), // Serialized tldraw data
  createdBy: z.string(),
  createdAt: z.coerce.date(),
});

export type WhiteboardSnapshot = z.infer<typeof WhiteboardSnapshotSchema>;
export const WhiteboardSnapshotListSchema = z.array(WhiteboardSnapshotSchema);

// ============================================================================
// Whiteboard
// ============================================================================

export const WhiteboardSchema = BaseEntitySchema.extend({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  visibility: WhiteboardVisibilitySchema.default('private'),
  background: WhiteboardBackgroundSchema.default('default-grid'),
  data: z.string().optional(), // Serialized tldraw data
  thumbnailUrl: z.string().url().optional(),
  collaborators: WhiteboardCollaboratorListSchema.default([]),
  tags: z.array(LabelSchema).default([]),
  commentCount: z.number().default(0),
  comments: z.array(CommentSchema).default([]),
  snapshots: z.array(z.string()).default([]), // Snapshot IDs
  isTemplate: z.boolean().default(false),
  templateCategory: z.string().optional(),
  lastEditedBy: z.string().optional(),
  lastEditedAt: z.coerce.date().optional(),
});

export type Whiteboard = z.infer<typeof WhiteboardSchema>;
export const WhiteboardListSchema = z.array(WhiteboardSchema);

// ============================================================================
// Create/Update Schemas
// ============================================================================

export const CreateWhiteboardSchema = WhiteboardSchema.omit({
  id: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  commentCount: true,
  comments: true,
  snapshots: true,
  lastEditedBy: true,
  lastEditedAt: true,
}).extend({
  collaborators: z.array(z.string()).optional(), // Just user IDs for creation
  tags: z.array(z.string()).optional(), // Just tag IDs for creation
});

export type CreateWhiteboardData = z.infer<typeof CreateWhiteboardSchema>;

export const UpdateWhiteboardSchema = CreateWhiteboardSchema.partial();
export type UpdateWhiteboardData = z.infer<typeof UpdateWhiteboardSchema>;

export const CreateSnapshotSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export type CreateSnapshotData = z.infer<typeof CreateSnapshotSchema>;

// ============================================================================
// Whiteboard Filters
// ============================================================================

export const WhiteboardFiltersSchema = z.object({
  search: z.string().optional(),
  visibility: WhiteboardVisibilitySchema.optional(),
  tags: z.array(z.string()).optional(),
  collaboratorId: z.string().optional(),
  isTemplate: z.boolean().optional(),
  templateCategory: z.string().optional(),
});

export type WhiteboardFilters = z.infer<typeof WhiteboardFiltersSchema>;

// ============================================================================
// Whiteboard View Types
// ============================================================================

export const WhiteboardViewSchema = z.enum(['all', 'my', 'shared', 'templates']);
export type WhiteboardView = z.infer<typeof WhiteboardViewSchema>;

// ============================================================================
// Real-time Collaboration Events
// ============================================================================

export const WhiteboardEventTypeSchema = z.enum([
  'user_joined',
  'user_left',
  'content_updated',
  'cursor_moved',
  'selection_changed',
  'comment_added',
]);

export type WhiteboardEventType = z.infer<typeof WhiteboardEventTypeSchema>;

export const WhiteboardEventSchema = z.object({
  type: WhiteboardEventTypeSchema,
  whiteboardId: z.string(),
  userId: z.string(),
  userName: z.string().optional(),
  data: z.unknown(),
  timestamp: z.coerce.date(),
});

export type WhiteboardEvent = z.infer<typeof WhiteboardEventSchema>;
