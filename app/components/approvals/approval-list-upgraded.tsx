'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  MoreVertical,
  Eye,
  FileText,
  MessageSquare,
} from 'lucide-react';
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

export function ApprovalListUpgraded({
  approvals,
  loading,
  onApprove,
  onReject,
  onView,
}: ApprovalListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-64" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </Card>
        ))}
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

        return (
          <Card key={approval.id} className="transition-shadow hover:shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {approval.requestedByName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{approval.title}</h3>
                      <Badge variant="outline" className="text-xs">
                        {approval.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusVariant} className="text-xs">
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {statusLabel}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  {approval.purpose && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {approval.purpose}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{approval.requestedByName || 'Unknown'}</span>
                    <span>
                      {formatDistanceToNow(new Date(approval.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
