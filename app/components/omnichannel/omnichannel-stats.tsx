'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Users, AlertTriangle, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OmnichannelStats {
  open: number;
  assigned: number;
  urgent: number;
  avgResponseTime: number; // in minutes
}

interface OmnichannelStatsCardsProps {
  stats: OmnichannelStats;
  loading?: boolean;
}

export function OmnichannelStatsCards({ stats, loading }: OmnichannelStatsCardsProps) {
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

  const formatResponseTime = (minutes: number) => {
    if (minutes < 60) {
      return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const cards = [
    {
      title: 'Open',
      value: stats.open,
      icon: MessageCircle,
      description: 'Active conversations',
      className: 'border-changes-bd bg-changes-bg',
      iconClassName: 'text-changes-fg',
    },
    {
      title: 'Assigned',
      value: stats.assigned,
      icon: Users,
      description: 'Being handled',
      className: 'border-approve-bd bg-approve-bg',
      iconClassName: 'text-approve-fg',
    },
    {
      title: 'Urgent',
      value: stats.urgent,
      icon: AlertTriangle,
      description: 'Need attention',
      className: stats.urgent > 0
        ? 'border-reject-bd bg-reject-bg'
        : 'border-muted bg-muted/20',
      iconClassName: stats.urgent > 0 ? 'text-reject-fg' : 'text-muted-foreground',
    },
    {
      title: 'Avg Response',
      value: formatResponseTime(stats.avgResponseTime),
      icon: Clock,
      description: 'Response time',
      className: stats.avgResponseTime <= 30
        ? 'border-approve-bd bg-approve-bg'
        : stats.avgResponseTime <= 60
          ? 'border-status-warn-bd bg-status-warn-bg'
          : 'border-reject-bd bg-reject-bg',
      iconClassName: stats.avgResponseTime <= 30
        ? 'text-approve-fg'
        : stats.avgResponseTime <= 60
          ? 'text-status-warn-fg'
          : 'text-reject-fg',
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
