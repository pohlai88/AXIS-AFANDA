/**
 * Consultations/Meetings Domain Types
 * Centralized types with Zod validation
 */

import { z } from 'zod';
import { BaseEntitySchema, UserSchema, AttachmentSchema } from './common';

// ============================================================================
// Meeting Types
// ============================================================================

export const MeetingTypeSchema = z.enum(['video', 'audio', 'physical', 'hybrid']);
export type MeetingType = z.infer<typeof MeetingTypeSchema>;

export const MeetingStatusSchema = z.enum([
  'scheduled',
  'in_progress',
  'completed',
  'cancelled',
]);
export type MeetingStatus = z.infer<typeof MeetingStatusSchema>;

// ============================================================================
// Participant
// ============================================================================

export const ParticipantSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar: z.string().optional(),
  email: z.string().email().optional(),
  role: z.string().optional(),
  joined: z.boolean().default(false),
  joinedAt: z.coerce.date().optional(),
  leftAt: z.coerce.date().optional(),
});

export type Participant = z.infer<typeof ParticipantSchema>;
export const ParticipantListSchema = z.array(ParticipantSchema);

// ============================================================================
// Meeting Minutes
// ============================================================================

export const MeetingMinutesSchema = z.object({
  id: z.string(),
  meetingId: z.string(),
  attendance: z.array(z.string()),
  agendaItemsDiscussed: z.array(z.string()),
  decisions: z.array(z.string()),
  actionItems: z.array(z.string()),
  outcome: z.string(),
  notes: z.string().optional(),
  completedBy: z.string(),
  completedAt: z.coerce.date(),
});

export type MeetingMinutes = z.infer<typeof MeetingMinutesSchema>;

// ============================================================================
// Meeting
// ============================================================================

export const MeetingSchema = BaseEntitySchema.extend({
  caseId: z.string(),
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  type: MeetingTypeSchema,
  status: MeetingStatusSchema,
  scheduledStart: z.coerce.date(),
  scheduledEnd: z.coerce.date(),
  actualStart: z.coerce.date().optional(),
  actualEnd: z.coerce.date().optional(),
  duration: z.number().optional(), // in minutes
  location: z.string().optional(),
  meetingUrl: z.string().url().optional(),
  organizerId: z.string(),
  participants: ParticipantListSchema,
  agendaItems: z.array(z.string()).default([]),
  minutesCompleted: z.boolean().default(false),
  minutesData: MeetingMinutesSchema.nullable().optional(),
  attachments: z.array(AttachmentSchema).default([]),
  tags: z.array(z.string()).default([]),
});

export type Meeting = z.infer<typeof MeetingSchema>;
export const MeetingListSchema = z.array(MeetingSchema);

// ============================================================================
// Create/Update Schemas
// ============================================================================

export const CreateMeetingSchema = MeetingSchema.omit({
  id: true,
  tenantId: true,
  caseId: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  minutesCompleted: true,
  minutesData: true,
}).extend({
  participants: z.array(z.string()), // Just IDs for creation
});

export type CreateMeetingData = z.infer<typeof CreateMeetingSchema>;

export const UpdateMeetingSchema = CreateMeetingSchema.partial();
export type UpdateMeetingData = z.infer<typeof UpdateMeetingSchema>;

export const CompleteMeetingMinutesSchema = z.object({
  attendance: z.array(z.string()).min(1),
  agendaItemsDiscussed: z.array(z.string()).min(1),
  decisions: z.array(z.string()),
  actionItems: z.array(z.string()),
  outcome: z.string().min(10),
  notes: z.string().optional(),
});

export type CompleteMeetingMinutesData = z.infer<typeof CompleteMeetingMinutesSchema>;

// ============================================================================
// Meeting Filters
// ============================================================================

export const MeetingFiltersSchema = z.object({
  search: z.string().optional(),
  status: MeetingStatusSchema.optional(),
  type: MeetingTypeSchema.optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  organizerId: z.string().optional(),
  participantId: z.string().optional(),
  caseId: z.string().optional(),
  needsMinutes: z.boolean().optional(),
});

export type MeetingFilters = z.infer<typeof MeetingFiltersSchema>;

// ============================================================================
// Meeting Statistics
// ============================================================================

export const MeetingStatsSchema = z.object({
  needsMinutes: z.number(),
  thisWeek: z.number(),
  completed: z.number(),
  todayDuration: z.number(), // total minutes today
  upcoming: z.number().optional(),
  inProgress: z.number().optional(),
});

export type MeetingStats = z.infer<typeof MeetingStatsSchema>;

// ============================================================================
// Heatmap Data
// ============================================================================

export const HeatmapDaySchema = z.object({
  date: z.string(), // YYYY-MM-DD
  count: z.number(),
  level: z.number().min(0).max(4), // 0-4 for color intensity
});

export type HeatmapDay = z.infer<typeof HeatmapDaySchema>;
export const HeatmapDataSchema = z.array(HeatmapDaySchema);

// ============================================================================
// Meeting Update Events (SSE)
// ============================================================================

export const MeetingUpdateTypeSchema = z.enum([
  'participant_joined',
  'participant_left',
  'minutes_completed',
  'status_changed',
  'task_created',
  'meeting_created',
  'meeting_updated',
  'meeting_deleted',
  'meeting_started',
  'meeting_completed',
]);

export type MeetingUpdateType = z.infer<typeof MeetingUpdateTypeSchema>;

export const MeetingUpdateDataSchema = z.object({
  userName: z.string().optional(),
  userId: z.string().optional(),
  newStatus: z.string().optional(),
  taskTitle: z.string().optional(),
  meetingId: z.string().optional(),
  meetingTitle: z.string().optional(),
  scheduledStart: z.string().optional(),
});

export type MeetingUpdateData = z.infer<typeof MeetingUpdateDataSchema>;

export const MeetingUpdateSchema = z.object({
  meetingId: z.string(),
  type: MeetingUpdateTypeSchema,
  data: MeetingUpdateDataSchema,
  timestamp: z.coerce.date(),
});

export type MeetingUpdate = z.infer<typeof MeetingUpdateSchema>;
