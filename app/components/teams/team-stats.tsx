'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Lock, Globe, UserPlus, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface TeamStats {
  total: number;
  members: number;
  public: number;
  private: number;
}

interface TeamStatsCardsProps {
  stats: TeamStats;
  loading?: boolean;
}

export function TeamStatsCards({ stats, loading }: TeamStatsCardsProps) {
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
      icon: Users,
      description: 'All teams',
      className: 'border-changes-bd bg-changes-bg',
      iconClassName: 'text-changes-fg',
    },
    {
      title: 'Members',
      value: stats.members,
      icon: UserPlus,
      description: 'Total members',
      className: 'border-approve-bd bg-approve-bg',
      iconClassName: 'text-approve-fg',
    },
    {
      title: 'Public',
      value: stats.public,
      icon: Globe,
      description: 'Open to all',
      className: 'border-primary/20 bg-primary/5',
      iconClassName: 'text-primary',
    },
    {
      title: 'Private',
      value: stats.private,
      icon: Lock,
      description: 'Restricted access',
      className: 'border-status-warn-bd bg-status-warn-bg',
      iconClassName: 'text-status-warn-fg',
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
