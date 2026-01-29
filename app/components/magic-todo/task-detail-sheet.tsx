'use client';

import { useState } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Calendar as CalendarIcon,
  ExternalLink,
  Trash2,
  Plus,
  X,
  CheckCircle2,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Task, Subtask } from './types';

interface TaskDetailSheetProps {
  task: Task;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
}

export function TaskDetailSheet({
  task,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: TaskDetailSheetProps) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [newSubtask, setNewSubtask] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleSave = () => {
    onUpdate(task.id, {
      title,
      description,
      updatedAt: new Date(),
    });
  };

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return;
    const subtask: Subtask = {
      id: crypto.randomUUID(),
      title: newSubtask,
      completed: false,
      createdAt: new Date(),
    };
    onUpdate(task.id, {
      subtasks: [...(task.subtasks || []), subtask],
    });
    setNewSubtask('');
  };

  const handleToggleSubtask = (subtaskId: string) => {
    const updated = task.subtasks?.map((s) =>
      s.id === subtaskId ? { ...s, completed: !s.completed } : s
    );
    onUpdate(task.id, { subtasks: updated });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    const updated = task.subtasks?.filter((s) => s.id !== subtaskId);
    onUpdate(task.id, { subtasks: updated });
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    const tags = [...(task.tags || []), newTag.trim()];
    onUpdate(task.id, { tags });
    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    const tags = task.tags?.filter((t) => t !== tag);
    onUpdate(task.id, { tags });
  };

  const handleDelete = () => {
    onDelete(task.id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[540px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Task Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleSave}
              placeholder="Task title"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSave}
              placeholder="Add details..."
              rows={4}
            />
          </div>

          <Separator />

          {/* Properties */}
          <div className="grid gap-4">
            {/* Status */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="status">Status</Label>
              <Select
                value={task.status}
                onValueChange={(value) =>
                  onUpdate(task.id, { status: value as Task['status'] })
                }
              >
                <SelectTrigger id="status" className="col-span-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={task.priority}
                onValueChange={(value) =>
                  onUpdate(task.id, { priority: value as Task['priority'] })
                }
              >
                <SelectTrigger id="priority" className="col-span-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">🔥 Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Due date */}
            <div className="grid grid-cols-3 items-center gap-4">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'col-span-2 justify-start text-left font-normal',
                      !task.dueDate && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={task.dueDate ? new Date(task.dueDate) : undefined}
                    onSelect={(date) => onUpdate(task.id, { dueDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator />

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1.5">
              {task.tags?.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <Button onClick={handleAddTag} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Subtasks */}
          <div className="space-y-2">
            <Label>Subtasks</Label>
            <div className="space-y-1.5">
              {task.subtasks?.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2 group">
                  <button
                    onClick={() => handleToggleSubtask(subtask.id)}
                    className={cn(
                      'flex h-4 w-4 shrink-0 items-center justify-center rounded border-2 transition-all',
                      subtask.completed
                        ? 'border-green-600 bg-green-600 text-white'
                        : 'border-muted-foreground/30 hover:border-primary'
                    )}
                  >
                    {subtask.completed && <CheckCircle2 className="h-3 w-3" />}
                  </button>
                  <span
                    className={cn(
                      'flex-1 text-sm',
                      subtask.completed && 'line-through text-muted-foreground'
                    )}
                  >
                    {subtask.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    onClick={() => handleDeleteSubtask(subtask.id)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add subtask..."
                value={newSubtask}
                onChange={(e) => setNewSubtask(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
              />
              <Button onClick={handleAddSubtask} size="sm">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Separator />

          {/* Source */}
          {task.sourceId && (
            <div className="space-y-2">
              <Label>Source</Label>
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href={`/app/${task.source}/${task.sourceId}`}>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Go to {task.source}
                </a>
              </Button>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>Created {format(new Date(task.createdAt), 'PPP p')}</p>
            <p>Updated {format(new Date(task.updatedAt), 'PPP p')}</p>
            {task.completedAt && (
              <p>Completed {format(new Date(task.completedAt), 'PPP p')}</p>
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleDelete}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Task
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
