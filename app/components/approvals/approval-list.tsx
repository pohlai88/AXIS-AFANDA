'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
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
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Approval } from '@/app/lib/stores/approvals-store';

interface ApprovalListProps {
  approvals: Approval[];
  loading?: boolean;
  onApprove?: (approval: Approval) => void;
  onReject?: (approval: Approval) => void;
  onView?: (approval: Approval) => void;
}

// Status badge variants
const STATUS_CONFIG = {
  draft: {
    variant: 'secondary' as const,
    icon: FileText,
    label: 'Draft',
    className: 'bg-status-draft-bg text-status-draft-fg border-status-draft-bd',
  },
  submitted: {
    variant: 'default' as const,
    icon: Clock,
    label: 'Pending',
    className: 'bg-pending-bg text-pending-fg border-pending-bd',
  },
  approved: {
    variant: 'secondary' as const,
    icon: CheckCircle2,
    label: 'Approved',
    className: 'bg-approve-bg text-approve-fg border-approve-bd',
  },
  rejected: {
    variant: 'destructive' as const,
    icon: XCircle,
    label: 'Rejected',
    className: 'bg-reject-bg text-reject-fg border-reject-bd',
  },
};

// Type labels
const TYPE_LABELS: Record<string, string> = {
  ceo_approval: 'CEO Approval',
  consultation_room: 'Consultation Room',
  budget_approval: 'Budget Approval',
  access_request: 'Access Request',
};

// Priority config
const PRIORITY_CONFIG = {
  low: { label: 'Low', className: 'text-muted-foreground', icon: undefined },
  medium: { label: 'Medium', className: 'text-blue-600', icon: undefined },
  high: { label: 'High', className: 'text-orange-600', icon: undefined },
  urgent: { label: 'Urgent', className: 'text-red-600', icon: AlertTriangle },
};

export function ApprovalList({
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
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No approvals</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No approval requests match your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {approvals.map((approval) => {
        const statusConfig = STATUS_CONFIG[approval.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.submitted;
        const StatusIcon = statusConfig.icon;
        const priority = approval.metadata?.priority as keyof typeof PRIORITY_CONFIG | undefined;
        const priorityConfig = priority ? PRIORITY_CONFIG[priority] : null;
        const PriorityIcon = priorityConfig?.icon;

        return (
          <Card key={approval.id} className="group relative overflow-hidden p-6 transition-all hover:shadow-lg">
            {/* Priority indicator stripe */}
            {priority && ['high', 'urgent'].includes(priority) && (
              <div className={cn(
                'absolute left-0 top-0 h-full w-1',
                priority === 'urgent' ? 'bg-red-500' : 'bg-orange-500'
              )} />
            )}

            <div className="flex items-start justify-between gap-4">
              {/* Left: Main content */}
              <div className="flex-1 space-y-3">
                {/* Header: Status, Type, Priority */}
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={cn('gap-1.5', statusConfig.className)}>
                    <StatusIcon className="h-3.5 w-3.5" />
                    {statusConfig.label}
                  </Badge>

                  <Badge variant="outline">
                    {TYPE_LABELS[approval.type] || approval.type}
                  </Badge>

                  {priorityConfig && (
                    <Badge variant="outline" className={cn('gap-1.5', priorityConfig.className)}>
                      {PriorityIcon && <PriorityIcon className="h-3.5 w-3.5" />}
                      {priorityConfig.label}
                    </Badge>
                  )}

                  {approval.conversationId && (
                    <Badge variant="outline" className="gap-1.5">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Conversation
                    </Badge>
                  )}
                </div>

                {/* Requester info */}
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {approval.requestedByName
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">
                      {approval.requestedByName || approval.requestedBy}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(approval.createdAt), { addSuffix: true })}
                      {' · '}
                      {format(new Date(approval.createdAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>

                {/* Reason */}
                {approval.reason && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {approval.reason}
                  </p>
                )}

                {/* Decision (for approved/rejected) */}
                {approval.decision && (
                  <div className="rounded-lg border bg-muted/50 p-3">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <p className="text-xs font-medium text-muted-foreground">Decision</p>
                        <p className="mt-1 text-sm">{approval.decision}</p>
                      </div>
                      {approval.approvedByName && (
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">by</p>
                          <p className="text-xs font-medium">{approval.approvedByName}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Metadata preview */}
                {approval.metadata && Object.keys(approval.metadata).length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {approval.metadata.source ? (
                      <span className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        Source: {String(approval.metadata.source)}
                      </span>
                    ) : null}
                    {approval.metadata.amount ? (
                      <span>Amount: ${typeof approval.metadata.amount === 'number' ? approval.metadata.amount.toLocaleString() : String(approval.metadata.amount)}</span>
                    ) : null}
                  </div>
                )}
              </div>

              {/* Right: Actions */}
              <div className="flex shrink-0 items-start gap-2">
                {/* Quick actions for pending approvals */}
                {approval.status === 'submitted' && (
                  <>
                    {onApprove && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onApprove(approval)}
                        className="gap-2"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        Approve
                      </Button>
                    )}
                    {onReject && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onReject(approval)}
                        className="gap-2"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </Button>
                    )}
                  </>
                )}

                {/* View button for non-pending */}
                {approval.status !== 'submitted' && onView && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onView(approval)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                )}

                {/* More menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">More actions</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/app/approvals/${approval.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View details
                      </Link>
                    </DropdownMenuItem>
                    {approval.conversationId && (
                      <DropdownMenuItem asChild>
                        <Link href={`/app/omnichannel/${approval.conversationId}`}>
                          <MessageSquare className="mr-2 h-4 w-4" />
                          View conversation
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {approval.status === 'submitted' && (
                      <>
                        {onApprove && (
                          <DropdownMenuItem onClick={() => onApprove(approval)}>
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                        )}
                        {onReject && (
                          <DropdownMenuItem
                            onClick={() => onReject(approval)}
                            className="text-destructive"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        )}
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
