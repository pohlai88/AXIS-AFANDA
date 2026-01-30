/**
 * Tasks Domain Types
 * Centralized types with Zod validation
 */

import { z } from 'zod';
import { BaseEntitySchema, UserSchema, PrioritySchema, AttachmentSchema, CommentSchema } from './common';

// ============================================================================
// Task Status
// ============================================================================

export const TaskStatusSchema = z.enum(['todo', 'in_progress', 'completed', 'cancelled']);
export type TaskStatus = z.infer<typeof TaskStatusSchema>;

// ============================================================================
// Task Source
// ============================================================================

export const TaskSourceSchema = z.enum([
  'manual',
  'approval',
  'omnichannel',
  'consultation',
  'whiteboard',
  'magic_todo',
]);
export type TaskSource = z.infer<typeof TaskSourceSchema>;

// ============================================================================
// Subtask
// ============================================================================

export const SubtaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  completed: z.boolean().default(false),
  completedAt: z.coerce.date().optional(),
});

export type Subtask = z.infer<typeof SubtaskSchema>;
export const SubtaskListSchema = z.array(SubtaskSchema);

// ============================================================================
// Task
// ============================================================================

export const TaskSchema = BaseEntitySchema.extend({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  status: TaskStatusSchema,
  priority: PrioritySchema,
  dueDate: z.coerce.date().optional(),
  completedAt: z.coerce.date().optional(),
  assignedTo: z.string().optional(),
  assignedToUser: UserSchema.optional(),
  source: TaskSourceSchema.default('manual'),
  sourceId: z.string().optional(), // ID of the originating entity (approval, meeting, etc.)
  tags: z.array(z.string()).default([]),
  subtasks: SubtaskListSchema.default([]),
  attachments: z.array(AttachmentSchema).default([]),
  comments: z.array(CommentSchema).default([]),
  estimatedHours: z.number().optional(),
  actualHours: z.number().optional(),
});

export type Task = z.infer<typeof TaskSchema>;
export const TaskListSchema = z.array(TaskSchema);

// ============================================================================
// Create/Update Schemas
// ============================================================================

export const CreateTaskSchema = TaskSchema.omit({
  id: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  completedAt: true,
  assignedToUser: true,
  comments: true,
}).extend({
  subtasks: z.array(z.string()).optional(), // Just titles for creation
});

export type CreateTaskData = z.infer<typeof CreateTaskSchema>;

export const UpdateTaskSchema = CreateTaskSchema.partial();
export type UpdateTaskData = z.infer<typeof UpdateTaskSchema>;

export const BulkUpdateTasksSchema = z.object({
  taskIds: z.array(z.string()).min(1),
  updates: UpdateTaskSchema,
});

export type BulkUpdateTasksData = z.infer<typeof BulkUpdateTasksSchema>;

// ============================================================================
// Task Filters
// ============================================================================

export const TaskFiltersSchema = z.object({
  search: z.string().optional(),
  status: TaskStatusSchema.optional(),
  priority: PrioritySchema.optional(),
  assignedTo: z.string().optional(),
  source: TaskSourceSchema.optional(),
  sourceId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  dueDateFrom: z.coerce.date().optional(),
  dueDateTo: z.coerce.date().optional(),
  overdue: z.boolean().optional(),
});

export type TaskFilters = z.infer<typeof TaskFiltersSchema>;

// ============================================================================
// Task Statistics
// ============================================================================

export const TaskStatsSchema = z.object({
  todo: z.number(),
  inProgress: z.number(),
  completed: z.number(),
  overdue: z.number(),
  totalToday: z.number(),
  dueThisWeek: z.number().optional(),
  completedThisWeek: z.number().optional(),
});

export type TaskStats = z.infer<typeof TaskStatsSchema>;

// ============================================================================
// MagicToDo AI Generation
// ============================================================================

export const MagicTodoPromptSchema = z.object({
  context: z.string().min(10), // Meeting summary, approval description, etc.
  entityType: z.enum(['meeting', 'approval', 'conversation']),
  entityId: z.string(),
  additionalNotes: z.string().optional(),
});

export type MagicTodoPrompt = z.infer<typeof MagicTodoPromptSchema>;

export const GeneratedTaskSchema = z.object({
  title: z.string(),
  description: z.string(),
  priority: PrioritySchema,
  estimatedHours: z.number().optional(),
  suggestedAssignee: z.string().optional(),
  tags: z.array(z.string()).default([]),
});

export type GeneratedTask = z.infer<typeof GeneratedTaskSchema>;

export const MagicTodoResponseSchema = z.object({
  tasks: z.array(GeneratedTaskSchema),
  reasoning: z.string().optional(),
});

export type MagicTodoResponse = z.infer<typeof MagicTodoResponseSchema>;
