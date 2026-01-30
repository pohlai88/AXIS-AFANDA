'use client';

/**
 * Tasks Store
 * State management for tasks with Zustand
 */

import { create } from 'zustand';
import {
  Task,
  TaskFilters,
  TaskStats,
  CreateTaskData,
  UpdateTaskData,
  BulkUpdateTasksData,
} from '@/app/lib/types';
import * as tasksApi from '@/app/lib/api/tasks';

// ============================================================================
// Store State Interface
// ============================================================================

interface TasksState {
  // Data
  tasks: Task[];
  selectedTask: Task | null;
  selectedTasks: string[]; // IDs for multi-select
  stats: TaskStats | null;
  filters: TaskFilters;

  // UI State
  loading: boolean;
  error: string | null;

  // Actions - Fetching
  fetchTasks: (filters?: TaskFilters) => Promise<void>;
  fetchTask: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;

  // Actions - CRUD
  createTask: (data: CreateTaskData) => Promise<Task>;
  updateTask: (id: string, data: UpdateTaskData) => Promise<Task>;
  deleteTask: (id: string) => Promise<void>;

  // Actions - Bulk Operations
  bulkUpdateTasks: (data: BulkUpdateTasksData) => Promise<{ updated: number; failed: number }>;
  bulkDeleteTasks: (taskIds: string[]) => Promise<{ deleted: number; failed: number }>;

  // Actions - Domain-specific
  completeTask: (id: string) => Promise<Task>;
  reopenTask: (id: string) => Promise<Task>;
  assignTask: (id: string, userId: string) => Promise<Task>;
  addSubtask: (id: string, title: string) => Promise<Task>;
  toggleSubtask: (taskId: string, subtaskId: string) => Promise<Task>;

  // Actions - Selection
  selectTask: (task: Task | null) => void;
  toggleTaskSelection: (taskId: string) => void;
  selectMultipleTasks: (taskIds: string[]) => void;
  clearSelection: () => void;
  selectAll: () => void;

  // Actions - State Management
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTaskInStore: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  setFilters: (filters: TaskFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// ============================================================================
// Store Implementation
// ============================================================================

export const useTasksStore = create<TasksState>((set, get) => ({
  // Initial State
  tasks: [],
  selectedTask: null,
  selectedTasks: [],
  stats: null,
  filters: {},
  loading: false,
  error: null,

  // Fetch tasks with filters
  fetchTasks: async (filters) => {
    set({ loading: true, error: null });
    try {
      const tasks = await tasksApi.getTasks(filters);
      set({ tasks, loading: false });
      if (filters) {
        set({ filters });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tasks';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Fetch single task
  fetchTask: async (id) => {
    set({ loading: true, error: null });
    try {
      const task = await tasksApi.getTask(id);
      set({ selectedTask: task, loading: false });

      // Update in list if exists
      const { tasks } = get();
      const index = tasks.findIndex((t) => t.id === id);
      if (index !== -1) {
        const updatedTasks = [...tasks];
        updatedTasks[index] = task;
        set({ tasks: updatedTasks });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch task';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Fetch statistics
  fetchStats: async () => {
    try {
      const stats = await tasksApi.getTaskStats();
      set({ stats });
    } catch (error) {
      console.error('Failed to fetch task stats:', error);
      // Don't set error state for stats failures
    }
  },

  // Create new task
  createTask: async (data) => {
    set({ loading: true, error: null });
    try {
      const task = await tasksApi.createTask(data);
      set((state) => ({
        tasks: [task, ...state.tasks],
        selectedTask: task,
        loading: false,
      }));
      return task;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create task';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Update task
  updateTask: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const task = await tasksApi.updateTask(id, data);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? task : t)),
        selectedTask: state.selectedTask?.id === id ? task : state.selectedTask,
        loading: false,
      }));
      return task;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update task';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      await tasksApi.deleteTask(id);
      set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
        selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
        selectedTasks: state.selectedTasks.filter((taskId) => taskId !== id),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Bulk update tasks
  bulkUpdateTasks: async (data) => {
    set({ loading: true, error: null });
    try {
      const result = await tasksApi.bulkUpdateTasks(data);

      // Refetch tasks to get updated data
      const { filters } = get();
      await get().fetchTasks(filters);

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to bulk update tasks';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Bulk delete tasks
  bulkDeleteTasks: async (taskIds) => {
    set({ loading: true, error: null });
    try {
      const result = await tasksApi.bulkDeleteTasks(taskIds);
      set((state) => ({
        tasks: state.tasks.filter((t) => !taskIds.includes(t.id)),
        selectedTasks: [],
        loading: false,
      }));
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to bulk delete tasks';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Complete task
  completeTask: async (id) => {
    try {
      const task = await tasksApi.completeTask(id);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? task : t)),
        selectedTask: state.selectedTask?.id === id ? task : state.selectedTask,
      }));
      return task;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete task';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Reopen task
  reopenTask: async (id) => {
    try {
      const task = await tasksApi.reopenTask(id);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? task : t)),
        selectedTask: state.selectedTask?.id === id ? task : state.selectedTask,
      }));
      return task;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to reopen task';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Assign task
  assignTask: async (id, userId) => {
    try {
      const task = await tasksApi.assignTask(id, userId);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? task : t)),
        selectedTask: state.selectedTask?.id === id ? task : state.selectedTask,
      }));
      return task;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to assign task';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Add subtask
  addSubtask: async (id, title) => {
    try {
      const task = await tasksApi.addSubtask(id, title);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === id ? task : t)),
        selectedTask: state.selectedTask?.id === id ? task : state.selectedTask,
      }));
      return task;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add subtask';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Toggle subtask
  toggleSubtask: async (taskId, subtaskId) => {
    try {
      const task = await tasksApi.toggleSubtask(taskId, subtaskId);
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === taskId ? task : t)),
        selectedTask: state.selectedTask?.id === taskId ? task : state.selectedTask,
      }));
      return task;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle subtask';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Selection management
  selectTask: (task) => set({ selectedTask: task }),

  toggleTaskSelection: (taskId) =>
    set((state) => ({
      selectedTasks: state.selectedTasks.includes(taskId)
        ? state.selectedTasks.filter((id) => id !== taskId)
        : [...state.selectedTasks, taskId],
    })),

  selectMultipleTasks: (taskIds) => set({ selectedTasks: taskIds }),

  clearSelection: () => set({ selectedTasks: [] }),

  selectAll: () =>
    set((state) => ({
      selectedTasks: state.tasks.map((t) => t.id),
    })),

  // State management
  setTasks: (tasks) => set({ tasks }),

  addTask: (task) =>
    set((state) => ({
      tasks: [task, ...state.tasks],
    })),

  updateTaskInStore: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      selectedTask:
        state.selectedTask?.id === id
          ? { ...state.selectedTask, ...updates }
          : state.selectedTask,
    })),

  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
      selectedTasks: state.selectedTasks.filter((taskId) => taskId !== id),
    })),

  setFilters: (filters) => set({ filters }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      tasks: [],
      selectedTask: null,
      selectedTasks: [],
      stats: null,
      filters: {},
      loading: false,
      error: null,
    }),
}));
