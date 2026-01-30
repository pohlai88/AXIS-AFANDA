'use client';

import { useState } from 'react';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
  Download,
  RefreshCw,
  MoreHorizontal,
  Eye,
  Archive,
  BarChart3,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Approval } from '@/app/lib/stores/approvals-store';

interface ApprovalsDashboardPremiumProps {
  approvals: Approval[];
  loading?: boolean;
  onApprove?: (approval: Approval) => void;
  onReject?: (approval: Approval) => void;
  onView?: (approval: Approval) => void;
  onRefresh?: () => void;
  onExport?: () => void;
  className?: string;
}

// shadcn premium: Use semantic status mapping with proper variants
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'draft':
      return 'secondary';
    case 'submitted':
      return 'default';
    case 'approved':
      return 'secondary';
    case 'rejected':
      return 'destructive';
    case 'cancelled':
      return 'secondary';
    default:
      return 'secondary';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'draft':
      return FileText;
    case 'submitted':
      return Clock;
    case 'approved':
      return CheckCircle2;
    case 'rejected':
      return XCircle;
    case 'cancelled':
      return FileText;
    default:
      return Clock;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'draft':
      return 'Draft';
    case 'submitted':
      return 'Pending';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};

export function ApprovalsDashboardPremium({
  approvals,
  onApprove,
  onReject,
  onView,
  onRefresh,
  onExport,
}: ApprovalsDashboardPremiumProps) {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    {
      title: 'Total Approvals',
      value: approvals.length,
      description: 'All approval requests',
      icon: FileText,
      trend: {
        value: '+12.5%',
        direction: 'up' as const,
      },
    },
    {
      title: 'Pending',
      value: approvals.filter(a => a.status === 'submitted').length,
      description: 'Awaiting decision',
      icon: Clock,
      trend: {
        value: '+8.2%',
        direction: 'up' as const,
      },
    },
    {
      title: 'Approved',
      value: approvals.filter(a => a.status === 'approved').length,
      description: 'Successfully approved',
      icon: CheckCircle2,
      trend: {
        value: '+15.3%',
        direction: 'up' as const,
      },
    },
    {
      title: 'Rejected',
      value: approvals.filter(a => a.status === 'rejected').length,
      description: 'Not approved',
      icon: XCircle,
      trend: {
        value: '-5.1%',
        direction: 'down' as const,
      },
    },
  ];

  // shadcn premium: Advanced table data (unused - can be removed if not needed)
  // const tableData = approvals.map((approval, index) => ({
  //   id: approval.id,
  //   title: approval.title,
  //   status: approval.status,
  //   type: approval.type,
  //   requester: approval.requestedByName || 'Unknown',
  //   createdAt: approval.createdAt,
  //   priority: index % 3 === 0 ? 'high' : index % 3 === 1 ? 'medium' : 'low',
  // }));

  return (
    <SidebarProvider>
      <SidebarInset>
        {/* shadcn premium: Professional header with breadcrumbs */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Approvals</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
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
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* shadcn premium: High-quality section cards with gradients */}
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="@container/card">
                  <CardHeader>
                    <CardDescription>{stat.title}</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      {stat.value}
                    </CardTitle>
                    <CardAction>
                      <Badge variant="outline">
                        {stat.trend.direction === 'up' ? (
                          <TrendingUp className="size-4" />
                        ) : (
                          <TrendingDown className="size-4" />
                        )}
                        {stat.trend.value}
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      {stat.trend.direction === 'up' ? (
                        <>
                          Trending up this period <TrendingUp className="size-4" />
                        </>
                      ) : (
                        <>
                          Trending down this period <TrendingDown className="size-4" />
                        </>
                      )}
                    </div>
                    <div className="text-muted-foreground">{stat.description}</div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* shadcn premium: Advanced tabs with professional layout */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="approvals">All Approvals</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {/* shadcn premium: Professional card with actions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Approval Activity
                    </CardTitle>
                    <CardDescription>Recent approval trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">This Week</span>
                        <span className="text-sm font-medium">42 approvals</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Last Week</span>
                        <span className="text-sm font-medium">38 approvals</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Growth Rate</span>
                        <span className="text-sm font-medium text-kpi-up-fg">+10.5%</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      View Detailed Analytics
                    </Button>
                  </CardFooter>
                </Card>

                {/* shadcn premium: Status distribution card */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Status Distribution
                    </CardTitle>
                    <CardDescription>Breakdown by approval status</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {[
                        { status: 'submitted', count: approvals.filter(a => a.status === 'submitted').length },
                        { status: 'approved', count: approvals.filter(a => a.status === 'approved').length },
                        { status: 'rejected', count: approvals.filter(a => a.status === 'rejected').length },
                        { status: 'draft', count: approvals.filter(a => a.status === 'draft').length },
                      ].map((item) => {
                        const StatusIcon = getStatusIcon(item.status);
                        const statusVariant = getStatusVariant(item.status);
                        const statusLabel = getStatusLabel(item.status);

                        return (
                          <div key={item.status} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <StatusIcon className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{statusLabel}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">{item.count}</span>
                              <Badge variant={statusVariant} className="text-xs">
                                {item.count}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm" className="w-full">
                      Export Report
                    </Button>
                  </CardFooter>
                </Card>
              </div>

              {/* shadcn premium: Recent approvals table */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Approvals</CardTitle>
                  <CardDescription>Latest approval requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="w-12">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvals.slice(0, 5).map((approval) => {
                        const StatusIcon = getStatusIcon(approval.status);
                        const statusVariant = getStatusVariant(approval.status);
                        const statusLabel = getStatusLabel(approval.status);

                        return (
                          <TableRow key={approval.id}>
                            <TableCell className="font-medium">{approval.title}</TableCell>
                            <TableCell>
                              <Badge variant={statusVariant} className="text-xs">
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {statusLabel}
                              </Badge>
                            </TableCell>
                            <TableCell>{approval.requestedByName || 'Unknown'}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDistanceToNow(new Date(approval.createdAt), { addSuffix: true })}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => onView?.(approval)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  {approval.status === 'submitted' && (
                                    <>
                                      <DropdownMenuItem onClick={() => onApprove?.(approval)}>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => onReject?.(approval)}>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Metrics</CardTitle>
                    <CardDescription>Key performance indicators</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Average Processing Time</span>
                        <span className="text-sm font-medium">2.5 days</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Approval Rate</span>
                        <span className="text-sm font-medium text-approve-fg">78%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Pending Queue</span>
                        <span className="text-sm font-medium text-status-warn-fg">12</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Weekly Volume</span>
                        <span className="text-sm font-medium">45</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Approval Trends</CardTitle>
                    <CardDescription>Historical approval patterns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Monthly Growth</span>
                        <Badge variant="outline" className="text-approve-fg">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          +15.3%
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Peak Activity</span>
                        <span className="text-sm font-medium">Tuesday 2PM</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Avg. Daily Volume</span>
                        <span className="text-sm font-medium">6.4 approvals</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="approvals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>All Approvals</CardTitle>
                  <CardDescription>Complete list of approval requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Requester</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-12">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvals.map((approval) => {
                        const StatusIcon = getStatusIcon(approval.status);
                        const statusVariant = getStatusVariant(approval.status);
                        const statusLabel = getStatusLabel(approval.status);

                        return (
                          <TableRow key={approval.id}>
                            <TableCell className="font-medium">{approval.title}</TableCell>
                            <TableCell>
                              <Badge variant={statusVariant} className="text-xs">
                                <StatusIcon className="mr-1 h-3 w-3" />
                                {statusLabel}
                              </Badge>
                            </TableCell>
                            <TableCell>{approval.type}</TableCell>
                            <TableCell>{approval.requestedByName || 'Unknown'}</TableCell>
                            <TableCell className="text-muted-foreground">
                              {formatDistanceToNow(new Date(approval.createdAt), { addSuffix: true })}
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => onView?.(approval)}>
                                    <Eye className="mr-2 h-4 w-4" />
                                    View Details
                                  </DropdownMenuItem>
                                  {approval.status === 'submitted' && (
                                    <>
                                      <DropdownMenuItem onClick={() => onApprove?.(approval)}>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Approve
                                      </DropdownMenuItem>
                                      <DropdownMenuItem onClick={() => onReject?.(approval)}>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Reject
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
