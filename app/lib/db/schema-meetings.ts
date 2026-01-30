import { pgTable, text, timestamp, integer, jsonb, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from './schema';

// Enums
export const meetingTypeEnum = pgEnum('meeting_type', ['video', 'physical', 'phone']);
export const meetingStatusEnum = pgEnum('meeting_status', ['scheduled', 'in_progress', 'completed', 'cancelled']);
export const caseStatusEnum = pgEnum('case_status', ['open', 'in_progress', 'waiting', 'resolved', 'closed']);
export const todoTypeEnum = pgEnum('todo_type', ['self', 'assigned', 'department', 'approval']);
export const todoPriorityEnum = pgEnum('todo_priority', ['low', 'medium', 'high', 'urgent']);
export const todoStatusEnum = pgEnum('todo_status', ['not_started', 'in_progress', 'completed', 'cancelled']);
export const caseEventTypeEnum = pgEnum('case_event_type', ['inquiry', 'discussion', 'meeting', 'task', 'approval', 'note']);
export const caseEventSourceEnum = pgEnum('case_event_source', ['omnichannel', 'inbox', 'consultation', 'approval', 'manual']);

// Meetings/Consultations table
export const meetings = pgTable('meetings', {
  id: text('id').primaryKey(),
  caseId: text('case_id').notNull(), // Links to case trail
  tenantId: text('tenant_id').notNull().references(() => tenants.id),

  // Basic info
  title: text('title').notNull(),
  description: text('description'),
  type: meetingTypeEnum('type').notNull(),

  // Timing
  scheduledStart: timestamp('scheduled_start').notNull(),
  scheduledEnd: timestamp('scheduled_end').notNull(),
  actualStart: timestamp('actual_start'),
  actualEnd: timestamp('actual_end'),
  duration: integer('duration').notNull(), // in minutes

  // Participants
  organizerId: text('organizer_id').notNull(),
  participantIds: jsonb('participant_ids').notNull().$type<string[]>(),

  // Location
  locationType: text('location_type').notNull(), // 'jitsi' | 'physical' | 'phone'
  locationDetails: jsonb('location_details').$type<{
    jitsiRoomId?: string;
    address?: string;
    phoneNumber?: string;
  }>(),

  // Status
  status: meetingStatusEnum('status').notNull().default('scheduled'),

  // Minutes (mandatory)
  minutesCompleted: boolean('minutes_completed').notNull().default(false),
  minutesData: jsonb('minutes_data').$type<{
    discussion: string;
    decisions: string[];
    actionItems: string[];
    completedAt: string;
    completedBy: string;
  }>(),

  // Metadata
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// MagicToDo Tasks table
export const magicTodos = pgTable('magic_todos', {
  id: text('id').primaryKey(),
  caseId: text('case_id').notNull(), // Links to case trail
  meetingId: text('meeting_id').notNull().references(() => meetings.id),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),

  // Task info
  title: text('title').notNull(),
  description: text('description'),
  type: todoTypeEnum('type').notNull(),

  // Assignment
  assignedTo: text('assigned_to'), // User ID
  assignedToDepartment: text('assigned_to_department'), // Department ID
  createdBy: text('created_by').notNull(),

  // Priority & timing
  priority: todoPriorityEnum('priority').notNull().default('medium'),
  dueDate: timestamp('due_date').notNull(),
  reminderDate: timestamp('reminder_date'),

  // Status
  status: todoStatusEnum('status').notNull().default('not-started'),
  completedAt: timestamp('completed_at'),

  // Approval link (if type === 'approval')
  approvalId: text('approval_id'),
  approvalStatus: text('approval_status'), // 'pending' | 'approved' | 'rejected'

  // Watchers
  watcherIds: jsonb('watcher_ids').notNull().$type<string[]>().default([]),

  // Metadata
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Case Trail table
export const caseTrails = pgTable('case_trails', {
  id: text('id').primaryKey(), // CASE-2024-001
  tenantId: text('tenant_id').notNull().references(() => tenants.id),

  // Basic info
  title: text('title').notNull(),
  description: text('description'),
  category: text('category'),

  // Status
  status: caseStatusEnum('status').notNull().default('open'),

  // Linked entities
  linkedConversationIds: jsonb('linked_conversation_ids').notNull().$type<string[]>().default([]),
  linkedMeetingIds: jsonb('linked_meeting_ids').notNull().$type<string[]>().default([]),
  linkedTaskIds: jsonb('linked_task_ids').notNull().$type<string[]>().default([]),
  linkedApprovalIds: jsonb('linked_approval_ids').notNull().$type<string[]>().default([]),
  linkedWhiteboardIds: jsonb('linked_whiteboard_ids').notNull().$type<string[]>().default([]),

  // Participants
  participantIds: jsonb('participant_ids').notNull().$type<string[]>().default([]),
  watcherIds: jsonb('watcher_ids').notNull().$type<string[]>().default([]),

  // Metadata
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  resolvedAt: timestamp('resolved_at'),
});

// Case Events table (for timeline)
export const caseEvents = pgTable('case_events', {
  id: text('id').primaryKey(),
  caseId: text('case_id').notNull().references(() => caseTrails.id),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),

  // Event info
  type: caseEventTypeEnum('type').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  source: caseEventSourceEnum('source').notNull(),
  sourceId: text('source_id').notNull(), // ID of the source entity
  description: text('description').notNull(),
  userId: text('user_id').notNull(),
  metadata: jsonb('metadata').$type<Record<string, any>>(),

  // Metadata
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Relations
export const meetingsRelations = relations(meetings, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [meetings.tenantId],
    references: [tenants.id],
  }),
  case: one(caseTrails, {
    fields: [meetings.caseId],
    references: [caseTrails.id],
  }),
  todos: many(magicTodos),
}));

export const magicTodosRelations = relations(magicTodos, ({ one }) => ({
  tenant: one(tenants, {
    fields: [magicTodos.tenantId],
    references: [tenants.id],
  }),
  meeting: one(meetings, {
    fields: [magicTodos.meetingId],
    references: [meetings.id],
  }),
  case: one(caseTrails, {
    fields: [magicTodos.caseId],
    references: [caseTrails.id],
  }),
}));

export const caseTrailsRelations = relations(caseTrails, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [caseTrails.tenantId],
    references: [tenants.id],
  }),
  events: many(caseEvents),
  meetings: many(meetings),
  todos: many(magicTodos),
}));

export const caseEventsRelations = relations(caseEvents, ({ one }) => ({
  tenant: one(tenants, {
    fields: [caseEvents.tenantId],
    references: [tenants.id],
  }),
  case: one(caseTrails, {
    fields: [caseEvents.caseId],
    references: [caseTrails.id],
  }),
}));
