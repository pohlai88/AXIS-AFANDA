'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { DomainActivityChart } from '../charts/domain-activity-chart';
import { DomainDistributionChart } from '../charts/domain-distribution-chart';
import { StatCards } from '../stats/stat-cards';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  Users,
  MessageSquare,
  FileText,
  Calendar,
  Activity,
  Download,
  RefreshCw,
} from 'lucide-react';

export interface DomainData {
  name: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
}

export interface TimeSeriesData {
  period: string;
  value: number;
  change?: number;
}

export interface DomainDashboardProps {
  title: string;
  domain: 'approvals' | 'inbox' | 'omnichannel' | 'whiteboards' | 'teams';
  stats: Array<{
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
  }>;
  activityData: TimeSeriesData[];
  distributionData: DomainData[];
  timeRange?: '7d' | '30d' | '90d' | '1y';
  onTimeRangeChange?: (range: string) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  className?: string;
}

const chartConfig = {
  value: {
    label: 'Value',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

const DOMAIN_COLORS = {
  approvals: 'hsl(var(--chart-1))',
  inbox: 'hsl(var(--chart-2))',
  omnichannel: 'hsl(var(--chart-3))',
  whiteboards: 'hsl(var(--chart-4))',
  teams: 'hsl(var(--chart-5))',
};

export function DomainDashboard({
  title,
  domain,
  stats,
  activityData,
  distributionData,
  timeRange = '30d',
  onTimeRangeChange,
  onRefresh,
  onExport,
  className,
}: DomainDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const domainColor = DOMAIN_COLORS[domain as keyof typeof DOMAIN_COLORS];

  const processedDistributionData = distributionData.map(item => ({
    ...item,
    color: item.color || domainColor,
  }));

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time analytics and insights
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={onTimeRangeChange}>
            <SelectTrigger className="w-30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatCards stats={stats} columns={4} />

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Activity Chart */}
            <DomainActivityChart
              data={activityData}
              title="Activity Trend"
              description={`${domain} activity over time`}
              metric="activities"
              color={domainColor}
              className="lg:col-span-2"
            />

            {/* Distribution */}
            <DomainDistributionChart
              data={processedDistributionData}
              title="Status Distribution"
              description="Breakdown by status"
              metric="items"
              className="lg:col-span-1"
            />
          </div>

          {/* Performance Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {distributionData.slice(0, 3).map((item, index) => (
                  <div key={item.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{item.value}</span>
                      {item.trend && (
                        <Badge
                          variant={item.trend === 'up' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {item.trend === 'up' ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <DomainActivityChart
            data={activityData}
            title="Detailed Activity Analysis"
            description="Comprehensive activity tracking"
            metric="activities"
            color={domainColor}
            showTrend={true}
          />

          {/* Additional Activity Insights */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Peak Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {activityData
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 3)
                    .map((item, index) => (
                      <div key={item.period} className="flex items-center justify-between">
                        <span className="text-sm">{item.period}</span>
                        <span className="text-sm font-medium">{item.value}</span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-2xl font-bold text-approve-fg">+12.5%</div>
                  <p className="text-xs text-muted-foreground">vs last period</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <DomainDistributionChart
            data={processedDistributionData}
            title="Complete Distribution Analysis"
            description="Full breakdown by category"
            metric="items"
            showLegend={true}
            showPercentages={true}
          />

          {/* Distribution Insights */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Distribution Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {processedDistributionData.map((item) => (
                  <div key={item.name} className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ backgroundColor: item.color + '20' }}>
                      <span className="text-lg font-bold" style={{ color: item.color }}>
                        {item.percentage?.toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-sm font-medium">{item.name}</div>
                    <div className="text-xs text-muted-foreground">{item.value} items</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
