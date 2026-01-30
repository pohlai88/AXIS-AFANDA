'use client';

import { useMemo } from 'react';
import { Pie, PieChart, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import {
  ChartContainer,
  type ChartConfig,
} from '@/components/ui/chart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export interface DistributionData {
  name: string;
  value: number;
  color?: string;
  percentage?: number;
}

export interface DomainDistributionChartProps {
  data: DistributionData[];
  title: string;
  description?: string;
  metric: string;
  totalValue?: number;
  className?: string;
  showLegend?: boolean;
  showPercentages?: boolean;
}

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const DEFAULT_COLORS = [
  'hsl(var(--primary))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
];

// Move tooltip component outside render
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-lg border bg-background p-2 shadow-sm">
        <div className="grid gap-2">
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <span className="text-sm font-medium">{data.name}</span>
          </div>
          <div className="text-xs text-muted-foreground">
            {data.value.toLocaleString()} {data.metric || 'items'}
          </div>
          {data.showPercentages && (
            <div className="text-xs text-muted-foreground">
              {data.percentage?.toFixed(1)}%
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function DomainDistributionChart({
  data,
  title,
  description,
  metric,
  totalValue,
  className,
  showLegend = true,
  showPercentages = true,
}: DomainDistributionChartProps) {
  const processedData = useMemo(() => {
    const total = totalValue || data.reduce((sum, item) => sum + item.value, 0);
    return data.map((item, index) => ({
      ...item,
      color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
      percentage: (item.value / total) * 100,
      showPercentages,
      metric,
    }));
  }, [data, totalValue, showPercentages, metric]);

  const renderCustomLabel = (entry: any) => {
    if (!showPercentages) return null;
    return `${entry.percentage.toFixed(0)}%`;
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
          {totalValue && (
            <Badge variant="secondary" className="text-xs">
              {totalValue.toLocaleString()} {metric}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={processedData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomLabel}
                outerRadius={80}
                fill="hsl(var(--primary))"
                dataKey="value"
              >
                {processedData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    className="transition-all hover:opacity-80"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>

        {showLegend && (
          <div className="mt-4 space-y-2">
            {processedData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{item.value.toLocaleString()}</span>
                  {showPercentages && (
                    <span className="text-xs text-muted-foreground">
                      ({item.percentage.toFixed(1)}%)
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
