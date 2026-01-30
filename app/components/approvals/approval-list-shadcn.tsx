'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  MoreVertical,
  Eye,
  MessageSquare,
  FileText,
  ExternalLink,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Approval } from '@/app/lib/stores/approvals-store';
import { NoApprovalsState } from '@/app/components/common/empty-states';

interface ApprovalListProps {
  approvals: Approval[];
  loading?: boolean;
  onApprove?: (approval: Approval) => void;
  onReject?: (approval: Approval) => void;
  onView?: (approval: Approval) => void;
}

// shadcn best practice: Use semantic variant mapping instead of hardcoded classes
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

// shadcn best practice: Use semantic color mapping
const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case 'urgent':
      return 'text-reject-fg';
    case 'high':
      return 'text-status-warn-fg';
    case 'medium':
      return 'text-changes-fg';
    default:
      return 'text-muted-foreground';
  }
};

export function ApprovalListShadcn({
  approvals,
  loading,
  onApprove,
  onReject,
  onView,
}: ApprovalListProps) {
  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Loading approvals...</p>
        </div>
      </div>
    );
  }

  if (approvals.length === 0) {
    return <NoApprovalsState />;
  }

  return (
    <div className="space-y-4">
      {approvals.map((approval) => {
        const StatusIcon = getStatusIcon(approval.status);
        const statusVariant = getStatusVariant(approval.status);
        const statusLabel = getStatusLabel(approval.status);
        const priorityColor = getPriorityColor(approval.priority);

        return (
          <Card key={approval.id} className="transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-base truncate">{approval.title}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {approval.type}
                    </Badge>
                    {approval.priority && (
                      <AlertTriangle className={cn('h-4 w-4', priorityColor)} />
                    )}
                  </div>

                  {approval.purpose && (
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {approval.purpose}
                    </p>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {approval.requestedByName?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <span>{approval.requestedByName || 'Unknown'}</span>
                    </div>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(approval.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={statusVariant} className="text-xs">
                    <StatusIcon className="mr-1 h-3 w-3" />
                    {statusLabel}
                  </Badge>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
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
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Add Comment
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Source
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </CardHeader>
          </Card>
        );
      })}
    </div>
  );
}
