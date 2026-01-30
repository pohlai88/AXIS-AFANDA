'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface StatCard {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ComponentType<any>;
  iconClassName?: string;
  className?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
}

export interface StatCardsProps {
  stats: StatCard[];
  loading?: boolean;
  columns?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

export function StatCards({
  stats,
  loading = false,
  columns = 4,
  className
}: StatCardsProps) {
  if (loading) {
    return (
      <div className={cn('grid gap-4', `md:grid-cols-${Math.min(columns, 2)} lg:grid-cols-${columns}`, className)}>
        {Array.from({ length: columns }).map((_, i) => (
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

  return (
    <div className={cn('grid gap-4', `md:grid-cols-${Math.min(columns, 2)} lg:grid-cols-${columns}`, className)}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <Card
            key={`${stat.title}-${index}`}
            className={cn('transition-all hover:shadow-md', stat.className)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {Icon && (
                <Icon className={cn('h-4 w-4', stat.iconClassName)} />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.description && (
                <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
              )}
              {stat.trend && (
                <div className="flex items-center gap-1 mt-2">
                  {stat.trend.direction === 'up' ? (
                    <span className="text-xs text-kpi-up-fg">↑</span>
                  ) : (
                    <span className="text-xs text-kpi-down-fg">↓</span>
                  )}
                  <span className="text-xs text-muted-foreground">{stat.trend.value}</span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

export interface StatCardProps {
  stat: StatCard;
  loading?: boolean;
  className?: string;
}

export function StatCard({ stat, loading = false, className }: StatCardProps) {
  if (loading) {
    return (
      <Card className={cn('animate-pulse', className)}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-4 w-4 rounded bg-muted" />
        </CardHeader>
        <CardContent>
          <div className="h-8 w-16 rounded bg-muted" />
          <div className="mt-2 h-3 w-32 rounded bg-muted" />
        </CardContent>
      </Card>
    );
  }

  const Icon = stat.icon;

  return (
    <Card className={cn('transition-all hover:shadow-md', stat.className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        {Icon && (
          <Icon className={cn('h-4 w-4', stat.iconClassName)} />
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{stat.value}</div>
        {stat.description && (
          <p className="mt-1 text-xs text-muted-foreground">{stat.description}</p>
        )}
        {stat.trend && (
          <div className="flex items-center gap-1 mt-2">
            {stat.trend.direction === 'up' ? (
              <span className="text-xs text-kpi-up-fg">↑</span>
            ) : (
              <span className="text-xs text-kpi-down-fg">↓</span>
            )}
            <span className="text-xs text-muted-foreground">{stat.trend.value}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
