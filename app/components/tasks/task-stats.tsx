'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  Clock,
  Calendar,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TaskStats {
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
  totalToday: number;
}

interface TaskStatsCardsProps {
  stats: TaskStats;
  loading?: boolean;
}

export function TaskStatsCards({ stats, loading }: TaskStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-4 w-4 rounded bg-muted" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 rounded bg-muted" />
              <div className="mt-2 h-3 w-32 rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'To Do',
      value: stats.todo,
      icon: Clock,
      description: 'Pending tasks',
      className: 'border-pending-bd bg-pending-bg/5',
      iconClassName: 'text-pending-fg',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: AlertTriangle,
      description: 'Active tasks',
      className: 'border-changes-bd bg-changes-bg',
      iconClassName: 'text-changes-fg',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle2,
      description: 'Finished today',
      className: 'border-approve-bd bg-approve-bg/5',
      iconClassName: 'text-approve-fg',
    },
    {
      title: 'Overdue',
      value: stats.overdue,
      icon: AlertTriangle,
      description: 'Past due date',
      className: 'border-destructive bg-destructive/5',
      iconClassName: 'text-destructive',
    },
    {
      title: 'Due Today',
      value: stats.totalToday,
      icon: Calendar,
      description: 'Tasks due today',
      className: 'border-status-warn-bd bg-status-warn-bg',
      iconClassName: 'text-status-warn-fg',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title} className={cn('transition-all hover:shadow-md', card.className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={cn('h-4 w-4', card.iconClassName)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
