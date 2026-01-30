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
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { DomainActivityChart } from '@/components/shared/charts/domain-activity-chart';
import { DomainDistributionChart } from '@/components/shared/charts/domain-distribution-chart';
import { StatCards } from '@/components/shared/stats/stat-cards';
import { ApprovalListShadcn } from './approval-list-shadcn';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Download,
  RefreshCw,
  Filter,
} from 'lucide-react';

interface Approval {
  id: string;
  title: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled';
  type: string;
  priority?: string;
  requestedByName?: string;
  createdAt: string;
  purpose?: string;
}

interface ApprovalsDashboardProps {
  approvals: Approval[];
  loading?: boolean;
  onApprove?: (approval: Approval) => void;
  onReject?: (approval: Approval) => void;
  onView?: (approval: Approval) => void;
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

export function ApprovalsDashboardShadcn({
  approvals,
  loading,
  onApprove,
  onReject,
  onView,
  onRefresh,
  onExport,
  className,
}: ApprovalsDashboardProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  // shadcn best practice: Use semantic data processing
  const stats = [
    {
      title: 'Total Approvals',
      value: approvals.length,
      description: 'All approval requests',
      icon: FileText,
      iconClassName: 'text-changes-fg',
      className: 'border-changes-bd',
    },
    {
      title: 'Pending',
      value: approvals.filter(a => a.status === 'submitted').length,
      description: 'Awaiting decision',
      icon: Clock,
      iconClassName: 'text-pending-fg',
      className: 'border-pending-bd',
      trend: {
        value: '+12%',
        direction: 'up' as const,
      },
    },
    {
      title: 'Approved',
      value: approvals.filter(a => a.status === 'approved').length,
      description: 'Successfully approved',
      icon: CheckCircle2,
      iconClassName: 'text-approve-fg',
      className: 'border-approve-bd',
    },
    {
      title: 'Rejected',
      value: approvals.filter(a => a.status === 'rejected').length,
      description: 'Not approved',
      icon: XCircle,
      iconClassName: 'text-reject-fg',
      className: 'border-reject-bd',
    },
  ];

  // shadcn best practice: Use semantic data transformation
  const activityData = [
    { period: 'Mon', value: 12 },
    { period: 'Tue', value: 19 },
    { period: 'Wed', value: 15 },
    { period: 'Thu', value: 25 },
    { period: 'Fri', value: 22 },
    { period: 'Sat', value: 8 },
    { period: 'Sun', value: 5 },
  ];

  const distributionData = [
    { name: 'Pending', value: approvals.filter(a => a.status === 'submitted').length },
    { name: 'Approved', value: approvals.filter(a => a.status === 'approved').length },
    { name: 'Rejected', value: approvals.filter(a => a.status === 'rejected').length },
    { name: 'Draft', value: approvals.filter(a => a.status === 'draft').length },
    { name: 'Cancelled', value: approvals.filter(a => a.status === 'cancelled').length },
  ];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Approvals Dashboard</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time approval analytics and management
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
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
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="approvals">All Approvals</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Activity Chart */}
            <DomainActivityChart
              data={activityData}
              title="Approval Activity"
              description="Approvals over time"
              metric="approvals"
              color="hsl(var(--primary))"
            />

            {/* Distribution */}
            <DomainDistributionChart
              data={distributionData}
              title="Status Distribution"
              description="Breakdown by status"
              metric="approvals"
            />
          </div>

          {/* Recent Approvals */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium">Recent Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {approvals.slice(0, 5).map((approval) => (
                  <div key={approval.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                      <div>
                        <p className="font-medium text-sm">{approval.title}</p>
                        <p className="text-xs text-muted-foreground">{approval.requestedByName}</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {approval.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Detailed Activity */}
            <DomainActivityChart
              data={activityData}
              title="Detailed Activity Analysis"
              description="Comprehensive approval tracking"
              metric="approvals"
              color="hsl(var(--primary))"
              showTrend={true}
            />

            {/* Performance Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium">Performance Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Average Processing Time</span>
                    <span className="text-sm font-medium">2.5 days</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Approval Rate</span>
                    <span className="text-sm font-medium text-approve-fg">78%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Pending Queue</span>
                    <span className="text-sm font-medium text-status-warn-fg">12</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Weekly Volume</span>
                    <span className="text-sm font-medium">45</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Complete Distribution */}
          <DomainDistributionChart
            data={distributionData}
            title="Complete Distribution Analysis"
            description="Full breakdown by category"
            metric="approvals"
            showLegend={true}
            showPercentages={true}
          />
        </TabsContent>

        <TabsContent value="approvals" className="space-y-4">
          <ApprovalListShadcn
            approvals={approvals}
            loading={loading}
            onApprove={onApprove}
            onReject={onReject}
            onView={onView}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
