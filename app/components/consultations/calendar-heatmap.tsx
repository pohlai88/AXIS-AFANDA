'use client';

import { useMemo } from 'react';
import { format, parseISO } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Meeting, HeatmapDay } from './types';

interface CalendarHeatmapProps {
  meetings: Meeting[];
}

function getHeatIntensity(count: number): string {
  if (count === 0) return 'bg-muted hover:bg-muted/80';
  if (count <= 2) return 'bg-primary/30 hover:bg-primary/40';
  if (count <= 4) return 'bg-primary/60 hover:bg-primary/70';
  return 'bg-primary hover:bg-primary/90';
}

export function CalendarHeatmap({ meetings }: CalendarHeatmapProps) {
  const heatmapData = useMemo((): HeatmapDay[] => {
    const data: HeatmapDay[] = [];
    const startDate = new Date();
    startDate.setDate(1); // Start of current month

    // Generate 35 days (5 weeks)
    for (let i = 0; i < 35; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = format(date, 'yyyy-MM-dd');

      const count = meetings.filter(
        (m) => format(m.scheduledStart, 'yyyy-MM-dd') === dateKey
      ).length;

      data.push({ date: dateKey, count });
    }

    return data;
  }, [meetings]);

  return (
    <Card className="bg-lux-surface shadow-lux">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Meeting Activity</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-muted" />
              <span>0-1</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-primary/30" />
              <span>2-3</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-primary/60" />
              <span>4-5</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-primary" />
              <span>6+</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="grid grid-cols-7 gap-2">
            {heatmapData.map((day) => (
              <Tooltip key={day.date}>
                <TooltipTrigger asChild>
                  <button
                    className={cn(
                      'aspect-square rounded-md transition-all duration-lux-base hover:scale-110 hover:ring-2 hover:ring-primary',
                      getHeatIntensity(day.count)
                    )}
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-semibold">{format(parseISO(day.date), 'PP')}</p>
                  <p className="text-sm">
                    {day.count} meeting{day.count !== 1 ? 's' : ''}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
