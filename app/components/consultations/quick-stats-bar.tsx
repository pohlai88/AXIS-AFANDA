'use client';

import { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, Calendar, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { isToday } from 'date-fns';
import type { Meeting, MeetingStats } from './types';

interface QuickStatsBarProps {
  meetings: Meeting[];
}

export function QuickStatsBar({ meetings }: QuickStatsBarProps) {
  const stats = useMemo((): MeetingStats => {
    const needsMinutes = meetings.filter(
      (m) => m.status === 'completed' && !m.minutesCompleted
    ).length;

    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const thisWeek = meetings.filter((m) => m.scheduledStart >= weekStart).length;

    const quarterStart = new Date(now);
    quarterStart.setMonth(Math.floor(quarterStart.getMonth() / 3) * 3, 1);
    quarterStart.setHours(0, 0, 0, 0);

    const completedThisQuarter = meetings.filter(
      (m) =>
        m.status === 'completed' &&
        m.minutesCompleted &&
        m.scheduledStart >= quarterStart
    ).length;

    const todayDuration = meetings
      .filter((m) => isToday(m.scheduledStart))
      .reduce((sum, m) => sum + m.duration, 0);

    return { needsMinutes, thisWeek, completedThisQuarter, todayDuration };
  }, [meetings]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Needs Minutes (Urgent) */}
      <Card
        className={cn(
          'card-glow-lux transition-all duration-lux-base',
          stats.needsMinutes > 0 && 'border-[hsl(var(--danger))] bg-[hsl(var(--danger))]/5'
        )}
        data-interactive={stats.needsMinutes > 0 ? 'true' : undefined}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Needs Minutes</p>
              <p className="text-3xl font-bold text-[hsl(var(--danger))]">
                {stats.needsMinutes}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[hsl(var(--danger))]/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-[hsl(var(--danger))]" />
            </div>
          </div>
          {stats.needsMinutes > 0 && (
            <p className="text-xs text-[hsl(var(--danger))] mt-2">⚠️ Action required</p>
          )}
        </CardContent>
      </Card>

      {/* This Week */}
      <Card className="card-glow-lux bg-lux-surface transition-all duration-lux-base" data-interactive="true">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">This Week</p>
              <p className="text-3xl font-bold text-foreground">{stats.thisWeek}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed This Quarter */}
      <Card className="card-glow-lux bg-lux-surface transition-all duration-lux-base" data-interactive="true">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Complete This Q</p>
              <p className="text-3xl font-bold text-[hsl(var(--success))]">
                {stats.completedThisQuarter}
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-[hsl(var(--success))]/10 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-[hsl(var(--success))]" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3 text-[hsl(var(--success))]" />
            <p className="text-xs text-[hsl(var(--success))]">+12% vs last Q</p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Duration */}
      <Card className="card-glow-lux bg-lux-surface transition-all duration-lux-base" data-interactive="true">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Today</p>
              <p className="text-3xl font-bold text-foreground">
                {Math.floor(stats.todayDuration / 60)}h {stats.todayDuration % 60}m
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
