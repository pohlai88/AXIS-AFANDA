'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileImage, Users, Eye, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface WhiteboardStats {
  total: number;
  my: number;
  shared: number;
  activeToday: number;
}

interface WhiteboardStatsCardsProps {
  stats: WhiteboardStats;
  loading?: boolean;
}

export function WhiteboardStatsCards({ stats, loading }: WhiteboardStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
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
      title: 'Total',
      value: stats.total,
      icon: FileImage,
      description: 'All whiteboards',
      className: 'border-primary/20 bg-primary/5',
      iconClassName: 'text-primary',
    },
    {
      title: 'My Boards',
      value: stats.my,
      icon: Users,
      description: 'Created by me',
      className: 'border-changes-bd bg-changes-bg',
      iconClassName: 'text-changes-fg',
    },
    {
      title: 'Shared',
      value: stats.shared,
      icon: Eye,
      description: 'Collaborative',
      className: 'border-approve-bd bg-approve-bg',
      iconClassName: 'text-approve-fg',
    },
    {
      title: 'Active Today',
      value: stats.activeToday,
      icon: Calendar,
      description: 'Recent activity',
      className: stats.activeToday > 0
        ? 'border-status-warn-bd bg-status-warn-bg'
        : 'border-muted bg-muted/20',
      iconClassName: stats.activeToday > 0 ? 'text-status-warn-fg' : 'text-muted-foreground',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
