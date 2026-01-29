'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  Circle,
  AlertCircle,
  MoreHorizontal,
  ExternalLink,
  Trash2,
  Calendar,
  Flag,
  MessageSquare,
  CheckSquare,
  Mail,
  Video,
  Pencil,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { format, isPast, isToday } from 'date-fns';
import type { Task } from './types';

interface TaskCardProps {
  task: Task;
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  onDelete: (taskId: string) => void;
  onClick: () => void;
}

const SOURCE_ICONS = {
  manual: Circle,
  approval: CheckSquare,
  omnichannel: Mail,
  consultation: Video,
  whiteboard: Pencil,
};

const SOURCE_LABELS = {
  manual: 'Manual',
  approval: 'Approval',
  omnichannel: 'Customer',
  consultation: 'Meeting',
  whiteboard: 'Whiteboard',
};

const PRIORITY_COLORS = {
  urgent: 'bg-red-500/10 text-red-600 border-red-500/20',
  high: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  medium: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  low: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

export function TaskCard({ task, onUpdate, onDelete, onClick }: TaskCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(task.id, {
      status: task.status === 'completed' ? 'todo' : 'completed',
      completedAt: task.status === 'completed' ? undefined : new Date(),
    });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  const SourceIcon = SOURCE_ICONS[task.source];
  const isOverdue = task.dueDate && isPast(new Date(task.dueDate)) && task.status !== 'completed';
  const isDueToday = task.dueDate && isToday(new Date(task.dueDate));

  return (
    <Card
      className={cn(
        'group cursor-pointer transition-all hover:shadow-md',
        task.status === 'completed' && 'opacity-60'
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <button
            onClick={handleToggleComplete}
            className={cn(
              'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
              task.status === 'completed'
                ? 'border-green-600 bg-green-600 text-white'
                : 'border-muted-foreground/30 hover:border-primary'
            )}
          >
            {task.status === 'completed' && <CheckCircle2 className="h-4 w-4" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-1.5">
            {/* Title */}
            <div className="flex items-start justify-between gap-2">
              <p
                className={cn(
                  'text-sm font-medium leading-tight',
                  task.status === 'completed' && 'line-through text-muted-foreground'
                )}
              >
                {task.title}
              </p>

              {/* More menu */}
              {isHovered && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={onClick}>
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open details
                    </DropdownMenuItem>
                    {task.sourceId && (
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Go to source
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Description */}
            {task.description && (
              <p className="text-xs text-muted-foreground line-clamp-1">
                {task.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              {/* Priority */}
              {task.priority !== 'medium' && (
                <Badge variant="outline" className={cn('h-5 text-[10px]', PRIORITY_COLORS[task.priority])}>
                  <Flag className="mr-1 h-2.5 w-2.5" />
                  {task.priority}
                </Badge>
              )}

              {/* Due date */}
              {task.dueDate && (
                <Badge
                  variant="outline"
                  className={cn(
                    'h-5 text-[10px]',
                    isOverdue
                      ? 'border-red-500/20 bg-red-500/10 text-red-600'
                      : isDueToday
                        ? 'border-orange-500/20 bg-orange-500/10 text-orange-600'
                        : 'border-muted bg-muted/50'
                  )}
                >
                  {isOverdue ? (
                    <AlertCircle className="mr-1 h-2.5 w-2.5" />
                  ) : (
                    <Calendar className="mr-1 h-2.5 w-2.5" />
                  )}
                  {isToday(new Date(task.dueDate))
                    ? 'Today'
                    : format(new Date(task.dueDate), 'MMM d')}
                </Badge>
              )}

              {/* Source */}
              <Badge variant="outline" className="h-5 text-[10px] border-muted bg-muted/50">
                <SourceIcon className="mr-1 h-2.5 w-2.5" />
                {SOURCE_LABELS[task.source]}
              </Badge>

              {/* Tags */}
              {task.tags?.slice(0, 2).map((tag) => (
                <Badge key={tag} variant="outline" className="h-5 text-[10px] border-muted bg-muted/50">
                  {tag}
                </Badge>
              ))}
              {task.tags && task.tags.length > 2 && (
                <span className="text-muted-foreground">+{task.tags.length - 2}</span>
              )}

              {/* Subtasks */}
              {task.subtasks && task.subtasks.length > 0 && (
                <Badge variant="outline" className="h-5 text-[10px] border-muted bg-muted/50">
                  <CheckCircle2 className="mr-1 h-2.5 w-2.5" />
                  {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
                </Badge>
              )}

              {/* Comments */}
              {task.comments && task.comments.length > 0 && (
                <Badge variant="outline" className="h-5 text-[10px] border-muted bg-muted/50">
                  <MessageSquare className="mr-1 h-2.5 w-2.5" />
                  {task.comments.length}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
