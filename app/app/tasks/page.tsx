'use client';

import { useState, useEffect, useCallback } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TasksDataTable } from '@/app/components/tasks/tasks-data-table';
import { TaskStatsCards, type TaskStats } from '@/app/components/tasks/task-stats';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { toast } from 'sonner';
import { useTasksStore } from '@/app/lib/stores/tasks-store';
import { useTaskUpdates } from '@/app/hooks/use-task-updates';
import { ConnectionStatusIndicator } from '@/app/components/common/connection-status-indicator';
import { TableSkeleton } from '@/app/components/common/skeletons';
import type { Task } from '@/app/components/magic-todo/types';

// Generate mock data with stable timestamps
const generateMockTasks = (): Task[] => {
  const now = Date.now();
  return [
    {
      id: '1',
      title: 'Review Q1 budget proposal',
      description: 'Check financial projections and approve allocation',
      status: 'todo',
      priority: 'high',
      dueDate: new Date(now + 2 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'approval',
      sourceId: 'apr-123',
      assignedTo: 'user-1',
      assignedBy: 'user-2',
      tags: ['finance', 'urgent'],
    },
    {
      id: '2',
      title: 'Follow up on customer inquiry #456',
      description: 'Customer asked about enterprise pricing',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(now + 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'omnichannel',
      sourceId: 'conv-456',
      assignedTo: 'user-1',
      tags: ['sales', 'customer'],
    },
    {
      id: '3',
      title: 'Prepare meeting agenda for product sync',
      description: 'Include roadmap updates and Q2 priorities',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date(now + 3 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'consultation',
      sourceId: 'meet-789',
      assignedTo: 'user-1',
      tags: ['meeting', 'product'],
    },
    {
      id: '4',
      title: 'Update team documentation',
      description: 'Add new onboarding procedures',
      status: 'in_progress',
      priority: 'low',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'manual',
      assignedTo: 'user-1',
      tags: ['docs'],
    },
    {
      id: '5',
      title: 'Code review: Feature X PR',
      description: 'Review pull request #234',
      status: 'todo',
      priority: 'high',
      dueDate: new Date(now - 4 * 60 * 60 * 1000),
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'manual',
      assignedTo: 'user-1',
      tags: ['engineering', 'review'],
    },
  ];
};

const MOCK_TASKS = generateMockTasks();

export default function TasksPage() {
  // Use Zustand store for state management
  const {
    tasks: storeTasks,
    loading,
    fetchTasks: fetchTasksFromStore,
    fetchStats,
    deleteTask: deleteTaskFromStore
  } = useTasksStore();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [stats, setStats] = useState<TaskStats>({
    todo: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    totalToday: 0,
  });

  // Use store data, fallback to mock for development if empty
  const tasks = storeTasks.length > 0 ? storeTasks : MOCK_TASKS;

  // Real-time updates via SSE
  const { isConnected, error } = useTaskUpdates({
    enabled: true,
    showToasts: true,
    onUpdate: (update) => {
      console.log('Task update:', update);
      // Refresh tasks list when updates received
      fetchTasksFromStore().catch(console.error);
    },
  });

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasksFromStore().catch(console.error);
    fetchStats().catch(console.error);
  }, [fetchTasksFromStore, fetchStats]);

  // Calculate stats from current tasks
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todo = tasks.filter((t) => t.status === 'todo').length;
    const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const overdue = tasks.filter(
      (t) =>
        t.dueDate &&
        new Date(t.dueDate) < today &&
        t.status !== 'completed' &&
        t.status !== 'cancelled'
    ).length;
    const totalToday = tasks.filter(
      (t) =>
        t.dueDate &&
        new Date(t.dueDate).toDateString() === today.toDateString() &&
        t.status !== 'completed' &&
        t.status !== 'cancelled'
    ).length;

    setStats({
      todo,
      inProgress,
      completed,
      overdue,
      totalToday,
    });
  }, [tasks]);

  const fetchTasks = useCallback(async () => {
    try {
      await fetchTasksFromStore();
      toast.success('Tasks refreshed');
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load tasks');
    }
  }, [fetchTasksFromStore]);

  const handleTaskDelete = async (taskId: string) => {
    try {
      await deleteTaskFromStore(taskId);
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
      toast.success('Task deleted');
    } catch (error) {
      console.error('Failed to delete task:', error);
      toast.error('Failed to delete task');
    }
  };

  const handleView = (task: Task) => {
    setSelectedTask(task);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-blue-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Tasks</h1>
              <p className="text-sm text-muted-foreground">
                Manage your tasks and action items
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ConnectionStatusIndicator
              isConnected={isConnected}
              error={error}
              showLabel
              className="hidden sm:flex"
            />
            <Button onClick={fetchTasks} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-[var(--layout-container-max)] space-y-6">
          {/* Stats */}
          <TaskStatsCards stats={stats} loading={loading} />

          {/* Data Table */}
          {loading && tasks.length === 0 ? (
            <TableSkeleton rows={8} columns={6} showCheckbox showActions />
          ) : (
            <TasksDataTable
              data={tasks}
              onView={handleView}
              onDelete={handleTaskDelete}
            />
          )}
        </div>
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Task Details</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedTask && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">{selectedTask.title}</h3>
                  {selectedTask.description && (
                    <p className="text-sm text-muted-foreground">{selectedTask.description}</p>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <p className="text-sm text-muted-foreground capitalize">{selectedTask.status.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Priority</p>
                    <p className="text-sm text-muted-foreground capitalize">{selectedTask.priority}</p>
                  </div>
                  {selectedTask.dueDate && (
                    <div>
                      <p className="text-sm font-medium">Due Date</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(selectedTask.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {selectedTask.tags && selectedTask.tags.length > 0 && (
                    <div>
                      <p className="text-sm font-medium">Tags</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {selectedTask.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-1 bg-muted rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
