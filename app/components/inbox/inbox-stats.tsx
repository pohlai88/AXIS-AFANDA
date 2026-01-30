'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Mail, MailOpen, Users2, Calendar, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface InboxStats {
  unread: number;
  direct: number;
  groups: number;
  today: number;
}

interface InboxStatsCardsProps {
  stats: InboxStats;
  loading?: boolean;
}

export function InboxStatsCards({ stats, loading }: InboxStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
              <Skeleton className="mt-2 h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: 'Unread',
      value: stats.unread,
      icon: Mail,
      description: 'Messages to read',
      className: stats.unread > 0
        ? 'border-status-warn-bd bg-status-warn-bg'
        : 'border-muted bg-muted/20',
      iconClassName: stats.unread > 0 ? 'text-status-warn-fg' : 'text-muted-foreground',
    },
    {
      title: 'Direct',
      value: stats.direct,
      icon: MailOpen,
      description: '1-on-1 conversations',
      className: 'border-changes-bd bg-changes-bg',
      iconClassName: 'text-changes-fg',
    },
    {
      title: 'Groups',
      value: stats.groups,
      icon: Users2,
      description: 'Group conversations',
      className: 'border-primary/20 bg-primary/5',
      iconClassName: 'text-primary',
    },
    {
      title: 'Today',
      value: stats.today,
      icon: Calendar,
      description: 'Messages today',
      className: 'border-approve-bd bg-approve-bg',
      iconClassName: 'text-approve-fg',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <Card
            key={card.title}
            className={cn(
              // Card already has luxury shadow + hover glow; keep transitions token-driven
              'transition-[transform,box-shadow] duration-(--ax-motion-base)',
              card.className
            )}
          >
            <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <Icon className={cn('h-4 w-4', card.iconClassName)} />
            </CardHeader>
            <CardContent className="flex flex-col gap-1">
              <div className="text-2xl font-bold tabular-nums leading-none">{card.value}</div>
              {/* Keep description block same height so all 4 cards align */}
              <p className="min-h-8 text-xs leading-snug text-muted-foreground line-clamp-2">
                {card.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
