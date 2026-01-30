'use client';

/**
 * Hook for real-time task updates via SSE
 * 
 * Subscribes to task events and provides typed updates for creation, assignments,
 * status changes, completions, and subtask updates.
 */

import { useEffect } from 'react';
import { useSSEMulti } from './use-sse';
import { toast } from 'sonner';

export interface TaskUpdateData {
  taskId?: string;
  taskTitle?: string;
  taskDescription?: string;
  status?: 'todo' | 'in_progress' | 'in_review' | 'blocked' | 'completed' | 'cancelled';
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  assignedTo?: string;
  assignedToName?: string;
  assignedBy?: string;
  assignedByName?: string;
  dueDate?: string;
  source?: 'manual' | 'approval' | 'meeting' | 'conversation' | 'magic_todo';
  subtaskTitle?: string;
  subtaskId?: string;
  completedSubtasks?: number;
  totalSubtasks?: number;
  commentText?: string;
}

export interface TaskUpdate {
  taskId: string;
  type:
  | 'task_created'
  | 'task_updated'
  | 'task_assigned'
  | 'task_unassigned'
  | 'task_status_changed'
  | 'task_completed'
  | 'task_reopened'
  | 'task_deleted'
  | 'subtask_added'
  | 'subtask_completed'
  | 'subtask_deleted'
  | 'task_commented'
  | 'task_due_soon';
  data: TaskUpdateData;
  timestamp: Date;
}

export interface UseTaskUpdatesOptions {
  enabled?: boolean;
  showToasts?: boolean;
  onUpdate?: (update: TaskUpdate) => void;
}

/**
 * Subscribe to updates for all tasks (e.g., for the main task list)
 */
export function useTaskUpdates(options: UseTaskUpdatesOptions = {}) {
  const { enabled = true, showToasts = true, onUpdate } = options;

  const sseUrl = '/api/v1/tasks/updates';

  const eventTypes = [
    'task_created',
    'task_updated',
    'task_assigned',
    'task_unassigned',
    'task_status_changed',
    'task_completed',
    'task_reopened',
    'task_deleted',
    'subtask_added',
    'subtask_completed',
    'subtask_deleted',
    'task_commented',
    'task_due_soon',
  ];

  const { events, isConnected, error } = useSSEMulti(
    sseUrl,
    eventTypes,
    {
      enabled,
      onOpen: () => {
        console.log('[Task Updates] Connected');
      },
      onError: (err) => {
        console.error('[Task Updates] Error:', err);
        if (showToasts) {
          toast.error('Lost connection to task updates', {
            description: 'Attempting to reconnect...',
          });
        }
      },
    }
  );

  // Handle incoming events
  useEffect(() => {
    events.forEach((event, eventType) => {
      const data = event.data as TaskUpdateData;
      const update: TaskUpdate = {
        taskId: data.taskId || '',
        type: eventType as TaskUpdate['type'],
        data,
        timestamp: event.timestamp,
      };

      // Show toast notifications for important events
      if (showToasts) {
        switch (eventType) {
          case 'task_created':
            toast.info(`New task: ${data.taskTitle || 'Untitled'}`, {
              icon: '📝',
              description: data.source === 'magic_todo' ? '🪄 Created by MagicToDo' : `by ${data.assignedByName || 'Unknown'}`,
              action: {
                label: 'View',
                onClick: () => {
                  window.location.href = `/app/tasks/${data.taskId}`;
                },
              },
            });
            break;
          case 'task_assigned':
            toast.success('Task assigned to you', {
              icon: '👤',
              description: data.taskTitle,
              action: {
                label: 'View',
                onClick: () => {
                  window.location.href = `/app/tasks/${data.taskId}`;
                },
              },
            });
            break;
          case 'task_completed':
            toast.success('Task completed!', {
              icon: '✅',
              description: data.taskTitle,
            });
            break;
          case 'task_due_soon':
            toast.warning('Task due soon', {
              icon: '⏰',
              description: data.taskTitle,
              action: {
                label: 'View',
                onClick: () => {
                  window.location.href = `/app/tasks/${data.taskId}`;
                },
              },
            });
            break;
          case 'subtask_added':
            toast.info('New subtask added', {
              icon: '✅',
              description: data.subtaskTitle,
            });
            break;
          case 'subtask_completed':
            const progress = data.completedSubtasks && data.totalSubtasks
              ? `${data.completedSubtasks}/${data.totalSubtasks}`
              : '';
            toast.success('Subtask completed', {
              icon: '✅',
              description: progress ? `Progress: ${progress}` : data.subtaskTitle,
            });
            break;
          case 'task_status_changed':
            if (data.status === 'blocked') {
              toast.warning('Task blocked', {
                icon: '🚫',
                description: data.taskTitle,
              });
            }
            break;
        }
      }

      // Call custom handler
      onUpdate?.(update);
    });
  }, [events, showToasts, onUpdate]);

  return {
    isConnected,
    error,
    updates: Array.from(events.values()),
  };
}
