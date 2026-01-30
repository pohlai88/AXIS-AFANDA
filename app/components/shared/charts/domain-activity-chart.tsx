'use client';

import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface DomainActivityData {
  period: string;
  value: number;
  change?: number;
}

export interface DomainActivityChartProps {
  data: DomainActivityData[];
  title: string;
  description?: string;
  metric: string;
  color?: string;
  className?: string;
  showTrend?: boolean;
  period?: 'daily' | 'weekly' | 'monthly';
}

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function DomainActivityChart({
  data,
  title,
  description,
  metric,
  color = 'hsl(var(--primary))',
  className,
  showTrend = true,
  period = 'daily',
}: DomainActivityChartProps) {
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      fill: color,
    }));
  }, [data, color]);

  const trend = useMemo(() => {
    if (data.length < 2) return null;
    const recent = data.slice(-3).reduce((sum, item) => sum + item.value, 0) / 3;
    const previous = data.slice(-6, -3).reduce((sum, item) => sum + item.value, 0) / 3;
    return ((recent - previous) / previous) * 100;
  }, [data]);

  const formatPeriodLabel = (period: string) => {
    if (period === 'daily') return period.slice(0, 3);
    return period;
  };

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {showTrend && trend !== null && (
            <div className={cn(
              'flex items-center gap-1 text-xs',
              trend > 0 ? 'text-kpi-up-fg' : trend < 0 ? 'text-kpi-down-fg' : 'text-muted-foreground'
            )}>
              <span>
                {trend > 0 ? '↑' : trend < 0 ? '↓' : '→'}
              </span>
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={processedData}>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                className="stroke-muted/30"
              />
              <XAxis
                dataKey="period"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={formatPeriodLabel}
                className="text-xs text-muted-foreground"
              />
              <YAxis
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="text-xs text-muted-foreground"
              />
              <ChartTooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-muted-foreground">
                              {data.period}
                            </span>
                            <span className="text-xs font-medium">
                              {data.value.toLocaleString()}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {metric}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="value"
                fill={color}
                radius={[4, 4, 0, 0]}
                className="transition-all hover:opacity-80"
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
