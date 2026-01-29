'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ApprovalStats {
  pending: number;
  approved: number;
  rejected: number;
  urgent: number;
  totalToday: number;
  avgResponseTime?: string; // e.g., "2.5 hours"
  approvalRate?: number; // percentage
  trends?: {
    pending?: number; // percentage change
    approved?: number;
    rejected?: number;
  };
}

interface ApprovalStatsCardsProps {
  stats: ApprovalStats;
  loading?: boolean;
}

export function ApprovalStatsCards({ stats, loading }: ApprovalStatsCardsProps) {
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
      title: 'Pending',
      value: stats.pending,
      icon: Clock,
      description: 'Awaiting decision',
      trend: stats.trends?.pending,
      className: 'border-pending-bd bg-pending-bg/5',
      iconClassName: 'text-pending-fg',
    },
    {
      title: 'Approved',
      value: stats.approved,
      icon: CheckCircle2,
      description: 'Approved today',
      trend: stats.trends?.approved,
      className: 'border-approve-bd bg-approve-bg/5',
      iconClassName: 'text-approve-fg',
    },
    {
      title: 'Rejected',
      value: stats.rejected,
      icon: XCircle,
      description: 'Rejected today',
      trend: stats.trends?.rejected,
      className: 'border-reject-bd bg-reject-bg/5',
      iconClassName: 'text-reject-fg',
    },
    {
      title: 'Urgent',
      value: stats.urgent,
      icon: AlertTriangle,
      description: 'Require immediate attention',
      className: 'border-destructive bg-destructive/5',
      iconClassName: 'text-destructive',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          const hasTrend = card.trend !== undefined && card.trend !== 0;
          const trendUp = card.trend && card.trend > 0;

          return (
            <Card key={card.title} className={cn('transition-all hover:shadow-md', card.className)}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                <Icon className={cn('h-4 w-4', card.iconClassName)} />
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <div className="text-2xl font-bold">{card.value}</div>
                  {hasTrend && (
                    <Badge
                      variant="secondary"
                      className={cn(
                        'gap-1 text-xs',
                        trendUp ? 'bg-kpi-up-bg text-kpi-up-fg' : 'bg-kpi-down-bg text-kpi-down-fg'
                      )}
                    >
                      {trendUp ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {Math.abs(card.trend!)}%
                    </Badge>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional metrics */}
      {(stats.avgResponseTime || stats.approvalRate !== undefined) && (
        <div className="grid gap-4 md:grid-cols-2">
          {stats.avgResponseTime && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.avgResponseTime}</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Time to first decision
                </p>
              </CardContent>
            </Card>
          )}

          {stats.approvalRate !== undefined && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Approval Rate</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.approvalRate}%</div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Of all decisions made
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
