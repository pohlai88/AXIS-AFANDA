/**
 * Activity Domain Types
 * Centralized types with Zod validation
 */

import { z } from 'zod';

// ============================================================================
// Activity Type
// ============================================================================

export const ActivityTypeSchema = z.enum([
  'approval',
  'meeting',
  'message',
  'task',
  'team',
  'whiteboard',
  'system',
]);

export type ActivityType = z.infer<typeof ActivityTypeSchema>;

// ============================================================================
// Activity Item
// ============================================================================

export const ActivityItemSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  type: ActivityTypeSchema,
  title: z.string(),
  description: z.string().optional(),
  actor: z.string().optional(), // User name
  actorId: z.string().optional(), // User ID
  source: z.string(), // Domain that generated the activity
  sourceId: z.string().optional(), // ID of the source entity
  timestamp: z.coerce.date(),
  createdAt: z.coerce.date(),
  metadata: z.record(z.unknown()).optional(),
  url: z.string().optional(), // Link to the relevant page
  read: z.boolean().default(false),
});

export type ActivityItem = z.infer<typeof ActivityItemSchema>;
export const ActivityListSchema = z.array(ActivityItemSchema);

// ============================================================================
// Create Activity Schema
// ============================================================================

export const CreateActivitySchema = ActivityItemSchema.omit({
  id: true,
  createdAt: true,
  read: true,
});

export type CreateActivityData = z.infer<typeof CreateActivitySchema>;

// ============================================================================
// Activity Filters
// ============================================================================

export const ActivityFiltersSchema = z.object({
  type: ActivityTypeSchema.optional(),
  actorId: z.string().optional(),
  source: z.string().optional(),
  sourceId: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  read: z.boolean().optional(),
  limit: z.number().positive().max(100).default(50),
});

export type ActivityFilters = z.infer<typeof ActivityFiltersSchema>;

// ============================================================================
// Activity Event (SSE)
// ============================================================================

export const ActivityEventSchema = z.object({
  type: z.literal('activity'),
  data: ActivityItemSchema,
  timestamp: z.coerce.date(),
});

export type ActivityEvent = z.infer<typeof ActivityEventSchema>;

// ============================================================================
// Heartbeat Event (SSE)
// ============================================================================

export const HeartbeatEventSchema = z.object({
  type: z.literal('heartbeat'),
  data: z.object({
    timestamp: z.string(),
  }),
  timestamp: z.coerce.date(),
});

export type HeartbeatEvent = z.infer<typeof HeartbeatEventSchema>;
