import { pgTable, text, timestamp, integer, jsonb, boolean, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from './schema';
import { createId } from '@paralleldrive/cuid2';

// ============================================================================
// Enums
// ============================================================================

export const taskStatusEnum = pgEnum('task_status', ['todo', 'in_progress', 'completed', 'cancelled']);
export const taskPriorityEnum = pgEnum('task_priority', ['low', 'medium', 'high', 'urgent']);
export const taskSourceEnum = pgEnum('task_source', ['manual', 'approval', 'omnichannel', 'consultation', 'whiteboard', 'magic_todo']);

// ============================================================================
// Tasks Table
// ============================================================================

export const tasks = pgTable('tasks', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Basic info
  title: text('title').notNull(),
  description: text('description'),
  status: taskStatusEnum('status').notNull().default('todo'),
  priority: taskPriorityEnum('priority').notNull().default('medium'),

  // Assignment
  assignedTo: text('assigned_to'), // User ID
  assignedToName: text('assigned_to_name'),
  createdBy: text('created_by').notNull(),
  createdByName: text('created_by_name'),

  // Timing
  dueDate: timestamp('due_date'),
  completedAt: timestamp('completed_at'),
  estimatedHours: integer('estimated_hours'),
  actualHours: integer('actual_hours'),

  // Source tracking
  source: taskSourceEnum('source').notNull().default('manual'),
  sourceId: text('source_id'), // ID of the originating entity

  // Content
  tags: jsonb('tags').$type<string[]>().default([]),
  subtasks: jsonb('subtasks').$type<Array<{
    id: string;
    title: string;
    completed: boolean;
    completedAt?: string;
  }>>().default([]),
  attachments: jsonb('attachments').$type<Array<{
    id: string;
    filename: string;
    url: string;
    mimeType: string;
    size: number;
  }>>().default([]),

  // Metadata
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  tenantIdx: index('tasks_tenant_idx').on(table.tenantId),
  statusIdx: index('tasks_status_idx').on(table.status),
  assignedIdx: index('tasks_assigned_idx').on(table.assignedTo),
  dueDateIdx: index('tasks_due_date_idx').on(table.dueDate),
}));

// ============================================================================
// Task Comments Table
// ============================================================================

export const taskComments = pgTable('task_comments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  userName: text('user_name'),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  taskIdx: index('task_comments_task_idx').on(table.taskId),
}));

// ============================================================================
// Relations
// ============================================================================

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [tasks.tenantId],
    references: [tenants.id],
  }),
  comments: many(taskComments),
}));

export const taskCommentsRelations = relations(taskComments, ({ one }) => ({
  task: one(tasks, {
    fields: [taskComments.taskId],
    references: [tasks.id],
  }),
}));
