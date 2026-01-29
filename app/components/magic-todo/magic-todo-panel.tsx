'use client';

import { useState, useEffect } from 'react';
import {
  Sparkles,
  Inbox,
  Calendar,
  CalendarClock,
  CheckCircle2,
  Plus,
  Search,
  Filter,
  SortAsc,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { TaskCard } from './task-card';
import { QuickCapture } from './quick-capture';
import { TaskDetailSheet } from './task-detail-sheet';
import type { Task } from './types';

interface MagicTodoPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onCountChange: (count: number) => void;
}

// Mock data - replace with actual API
const MOCK_TASKS: Task[] = [
  {
    id: '1',
    title: 'Review Q1 budget proposal',
    description: 'Check financial projections and approve allocation',
    status: 'todo',
    priority: 'high',
    dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours
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
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
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
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
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
    dueDate: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
    createdAt: new Date(),
    updatedAt: new Date(),
    source: 'manual',
    assignedTo: 'user-1',
    tags: ['engineering', 'review'],
  },
];

export function MagicTodoPanel({
  isOpen,
  onClose,
  onCountChange,
}: MagicTodoPanelProps) {
  const [tasks, setTasks] = useState<Task[]>(MOCK_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('inbox');
  const [showQuickCapture, setShowQuickCapture] = useState(false);

  // Update pending count
  useEffect(() => {
    const pending = tasks.filter((t) => t.status === 'todo').length;
    onCountChange(pending);
  }, [tasks, onCountChange]);

  // Filter tasks based on active tab
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (
        !task.title.toLowerCase().includes(query) &&
        !task.description?.toLowerCase().includes(query) &&
        !task.tags?.some((tag) => tag.toLowerCase().includes(query))
      ) {
        return false;
      }
    }

    // Tab filter
    switch (activeTab) {
      case 'inbox':
        return task.status === 'todo';
      case 'today':
        if (!task.dueDate) return false;
        const today = new Date();
        const dueDate = new Date(task.dueDate);
        return (
          dueDate.toDateString() === today.toDateString() && task.status !== 'completed'
        );
      case 'upcoming':
        if (!task.dueDate) return false;
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return new Date(task.dueDate) > tomorrow && task.status !== 'completed';
      case 'completed':
        return task.status === 'completed';
      default:
        return true;
    }
  });

  const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    );
  };

  const handleTaskDelete = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
    if (selectedTask?.id === taskId) {
      setSelectedTask(null);
    }
  };

  const handleQuickCreate = (title: string) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title,
      status: 'todo',
      priority: 'medium',
      createdAt: new Date(),
      updatedAt: new Date(),
      source: 'manual',
      assignedTo: 'user-1',
    };
    setTasks((prev) => [newTask, ...prev]);
    setShowQuickCapture(false);
  };

  // Get counts for badges
  const inboxCount = tasks.filter((t) => t.status === 'todo').length;
  const todayCount = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'completed') return false;
    return new Date(t.dueDate).toDateString() === new Date().toDateString();
  }).length;
  const upcomingCount = tasks.filter((t) => {
    if (!t.dueDate || t.status === 'completed') return false;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(t.dueDate) > tomorrow;
  }).length;

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={cn(
          'fixed right-0 top-0 z-50 h-screen w-[400px] border-l bg-background shadow-2xl',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-600 to-blue-600">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">MagicTodo</h2>
                  <p className="text-xs text-muted-foreground">
                    {inboxCount} pending tasks
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick capture */}
            <div className="mt-3">
              {showQuickCapture ? (
                <QuickCapture
                  onSubmit={handleQuickCreate}
                  onCancel={() => setShowQuickCapture(false)}
                />
              ) : (
                <Button
                  variant="outline"
                  className="w-full justify-start text-muted-foreground"
                  onClick={() => setShowQuickCapture(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Quick add task...
                </Button>
              )}
            </div>

            {/* Search */}
            <div className="relative mt-3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <div className="border-b px-4">
              <TabsList className="w-full grid grid-cols-4 h-auto p-1">
                <TabsTrigger value="inbox" className="flex flex-col gap-1 py-2">
                  <Inbox className="h-4 w-4" />
                  <span className="text-xs">Inbox</span>
                  {inboxCount > 0 && (
                    <Badge variant="secondary" className="h-4 min-w-[16px] text-[10px] px-1">
                      {inboxCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="today" className="flex flex-col gap-1 py-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs">Today</span>
                  {todayCount > 0 && (
                    <Badge variant="secondary" className="h-4 min-w-[16px] text-[10px] px-1">
                      {todayCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="upcoming" className="flex flex-col gap-1 py-2">
                  <CalendarClock className="h-4 w-4" />
                  <span className="text-xs">Later</span>
                  {upcomingCount > 0 && (
                    <Badge variant="secondary" className="h-4 min-w-[16px] text-[10px] px-1">
                      {upcomingCount}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed" className="flex flex-col gap-1 py-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-xs">Done</span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Task list */}
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {filteredTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <CheckCircle2 className="h-12 w-12 text-muted-foreground/50 mb-3" />
                    <p className="text-sm font-medium text-muted-foreground">
                      {searchQuery
                        ? 'No tasks found'
                        : activeTab === 'completed'
                          ? 'No completed tasks'
                          : 'All clear!'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {searchQuery
                        ? 'Try a different search'
                        : activeTab === 'completed'
                          ? 'Complete tasks to see them here'
                          : 'You have no pending tasks'}
                    </p>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onUpdate={handleTaskUpdate}
                      onDelete={handleTaskDelete}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))
                )}
              </div>
            </ScrollArea>
          </Tabs>
        </div>
      </div>

      {/* Task detail sheet */}
      {selectedTask && (
        <TaskDetailSheet
          task={selectedTask}
          open={!!selectedTask}
          onOpenChange={(open) => !open && setSelectedTask(null)}
          onUpdate={handleTaskUpdate}
          onDelete={handleTaskDelete}
        />
      )}
    </>
  );
}
