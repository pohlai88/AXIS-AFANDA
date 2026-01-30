/**
 * API client for tasks
 * Uses centralized types with Zod validation
 */

import { apiClient } from './client';
import {
  Task,
  TaskSchema,
  TaskListSchema,
  CreateTaskData,
  CreateTaskSchema,
  UpdateTaskData,
  UpdateTaskSchema,
  BulkUpdateTasksData,
  BulkUpdateTasksSchema,
  TaskFilters,
  TaskFiltersSchema,
  TaskStats,
  TaskStatsSchema,
  MagicTodoPrompt,
  MagicTodoPromptSchema,
  MagicTodoResponse,
  MagicTodoResponseSchema,
} from '@/app/lib/types';
import { z } from 'zod';

// ============================================================================
// Response Wrappers
// ============================================================================

const TaskResponseSchema = z.object({
  data: TaskSchema,
});

const TaskListResponseSchema = z.object({
  data: TaskListSchema,
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }).optional(),
});

const TaskStatsResponseSchema = z.object({
  data: TaskStatsSchema,
});

const BulkOperationResponseSchema = z.object({
  success: z.boolean(),
  updated: z.number(),
  failed: z.number(),
  errors: z.array(z.object({
    taskId: z.string(),
    error: z.string(),
  })).optional(),
});

// ============================================================================
// Helper: Build Query String
// ============================================================================

function buildQueryString(filters?: TaskFilters): string {
  if (!filters) return '';

  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.assignedTo) params.append('assignedTo', filters.assignedTo);
  if (filters.source) params.append('source', filters.source);
  if (filters.sourceId) params.append('sourceId', filters.sourceId);
  if (filters.tags) filters.tags.forEach(tag => params.append('tags', tag));
  if (filters.dueDateFrom) params.append('dueDateFrom', filters.dueDateFrom.toISOString());
  if (filters.dueDateTo) params.append('dueDateTo', filters.dueDateTo.toISOString());
  if (filters.overdue !== undefined) params.append('overdue', filters.overdue.toString());

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Get list of tasks with optional filters
 */
export async function getTasks(filters?: TaskFilters): Promise<Task[]> {
  // Validate filters if provided
  if (filters) {
    TaskFiltersSchema.parse(filters);
  }

  const queryString = buildQueryString(filters);
  const response = await apiClient.get(`/tasks${queryString}`, TaskListResponseSchema);
  return response.data;
}

/**
 * Get a single task by ID
 */
export async function getTask(id: string): Promise<Task> {
  const response = await apiClient.get(`/tasks/${id}`, TaskResponseSchema);
  return response.data;
}

/**
 * Create a new task
 */
export async function createTask(data: CreateTaskData): Promise<Task> {
  // Validate input data
  CreateTaskSchema.parse(data);

  const response = await apiClient.post('/tasks', data, TaskResponseSchema);
  return response.data;
}

/**
 * Update an existing task
 */
export async function updateTask(id: string, data: UpdateTaskData): Promise<Task> {
  // Validate input data
  UpdateTaskSchema.parse(data);

  const response = await apiClient.patch(`/tasks/${id}`, data, TaskResponseSchema);
  return response.data;
}

/**
 * Delete a task
 */
export async function deleteTask(id: string): Promise<void> {
  await apiClient.delete(`/tasks/${id}`);
}

// ============================================================================
// Bulk Operations
// ============================================================================

/**
 * Update multiple tasks at once
 */
export async function bulkUpdateTasks(data: BulkUpdateTasksData): Promise<{ updated: number; failed: number }> {
  // Validate input data
  BulkUpdateTasksSchema.parse(data);

  const response = await apiClient.patch('/tasks/bulk', data, BulkOperationResponseSchema);
  return { updated: response.updated, failed: response.failed };
}

/**
 * Delete multiple tasks at once
 */
export async function bulkDeleteTasks(taskIds: string[]): Promise<{ deleted: number; failed: number }> {
  const response = await apiClient.post(
    '/tasks/bulk-delete',
    { taskIds },
    BulkOperationResponseSchema
  );
  return { deleted: response.updated, failed: response.failed };
}

// ============================================================================
// Domain-Specific Operations
// ============================================================================

/**
 * Mark a task as completed
 */
export async function completeTask(id: string): Promise<Task> {
  const response = await apiClient.patch(
    `/tasks/${id}`,
    {
      status: 'completed',
      completedAt: new Date(),
    },
    TaskResponseSchema
  );
  return response.data;
}

/**
 * Reopen a completed task
 */
export async function reopenTask(id: string): Promise<Task> {
  const response = await apiClient.patch(
    `/tasks/${id}`,
    {
      status: 'todo',
      completedAt: null,
    },
    TaskResponseSchema
  );
  return response.data;
}

/**
 * Assign a task to a user
 */
export async function assignTask(id: string, userId: string): Promise<Task> {
  const response = await apiClient.patch(
    `/tasks/${id}`,
    { assignedTo: userId },
    TaskResponseSchema
  );
  return response.data;
}

/**
 * Add a subtask to a task
 */
export async function addSubtask(id: string, title: string): Promise<Task> {
  const response = await apiClient.post(
    `/tasks/${id}/subtasks`,
    { title },
    TaskResponseSchema
  );
  return response.data;
}

/**
 * Toggle subtask completion
 */
export async function toggleSubtask(taskId: string, subtaskId: string): Promise<Task> {
  const response = await apiClient.patch(
    `/tasks/${taskId}/subtasks/${subtaskId}/toggle`,
    {},
    TaskResponseSchema
  );
  return response.data;
}

// ============================================================================
// MagicToDo AI Generation
// ============================================================================

/**
 * Generate tasks from context using AI (MagicToDo)
 */
export async function generateTasksFromContext(prompt: MagicTodoPrompt): Promise<MagicTodoResponse> {
  // Validate input data
  MagicTodoPromptSchema.parse(prompt);

  const response = await apiClient.post(
    '/tasks/magic-todo',
    prompt,
    z.object({ data: MagicTodoResponseSchema })
  );
  return response.data;
}

/**
 * Create tasks from MagicToDo generated suggestions
 */
export async function createTasksFromMagicTodo(
  tasks: CreateTaskData[],
  sourceId: string
): Promise<Task[]> {
  // Validate each task
  tasks.forEach(task => CreateTaskSchema.parse(task));

  const response = await apiClient.post(
    '/tasks/bulk-create',
    { tasks, sourceId },
    TaskListResponseSchema
  );
  return response.data;
}

// ============================================================================
// Statistics
// ============================================================================

/**
 * Get task statistics
 */
export async function getTaskStats(filters?: Pick<TaskFilters, 'assignedTo' | 'source'>): Promise<TaskStats> {
  const queryString = buildQueryString(filters);
  const response = await apiClient.get(`/tasks/stats${queryString}`, TaskStatsResponseSchema);
  return response.data;
}

// ============================================================================
// Exports
// ============================================================================

export type {
  Task,
  CreateTaskData,
  UpdateTaskData,
  TaskFilters,
  TaskStats,
  MagicTodoPrompt,
  MagicTodoResponse,
};
