'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
  Trash2,
  CheckSquare,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Approval } from '@/app/lib/stores/approvals-store';
import { NoFilteredResultsState } from '@/app/components/common/empty-states';
import { useSelectionSet } from '@/app/components/shared';

interface ApprovalListWithBulkProps {
  approvals: Approval[];
  loading?: boolean;
  onApprove?: (approval: Approval) => void;
  onReject?: (approval: Approval) => void;
  onView?: (approval: Approval) => void;
  onBulkApprove?: (approvalIds: string[]) => void;
  onBulkReject?: (approvalIds: string[]) => void;
  onBulkDelete?: (approvalIds: string[]) => void;
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
  cancelled: {
    variant: 'secondary' as const,
    icon: FileText,
    label: 'Cancelled',
    className: 'bg-status-draft-bg text-status-draft-fg border-status-draft-bd',
  },
};

// Type labels
const TYPE_LABELS: Record<string, string> = {
  REQ: 'Request',
  APR: 'Approval',
  CON: 'Consultation',
  FYI: 'For Your Information',
  INC: 'Incident',
};

export function ApprovalListWithBulk({
  approvals,
  loading,
  onApprove,
  onReject,
  onView,
  onBulkApprove,
  onBulkReject,
  onBulkDelete,
}: ApprovalListWithBulkProps) {
  const allIds = approvals.map((a) => a.id);
  const {
    selected,
    selectedCount,
    isAllSelected,
    toggleAll,
    toggleOne,
    clear,
    setSelected,
  } = useSelectionSet(allIds);

  const handleBulkApprove = () => {
    if (selectedCount > 0 && onBulkApprove) {
      onBulkApprove(Array.from(selected));
      clear();
    }
  };

  const handleBulkReject = () => {
    if (selectedCount > 0 && onBulkReject) {
      onBulkReject(Array.from(selected));
      clear();
    }
  };

  const handleBulkDelete = () => {
    if (selectedCount > 0 && onBulkDelete) {
      onBulkDelete(Array.from(selected));
      clear();
    }
  };

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
    return <NoFilteredResultsState />;
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <Card className="border-l-4 border-l-primary">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {selectedCount} approval{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkApprove}
                disabled={!onBulkApprove}
              >
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkReject}
                disabled={!onBulkReject}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                disabled={!onBulkDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
              >
                Clear
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Select All */}
      <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/20">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={toggleAll}
          aria-label="Select all approvals"
        />
        <span className="text-sm font-medium">Select All</span>
        <span className="text-sm text-muted-foreground">
          ({selectedCount} of {approvals.length} selected)
        </span>
      </div>

      {/* Approval Cards */}
      <div className="grid gap-4">
        {approvals.map((approval) => {
          const statusConfig = STATUS_CONFIG[approval.status];
          const typeLabel = TYPE_LABELS[approval.type] || approval.type;

          return (
            <Card
              key={approval.id}
              className={cn(
                'transition-all hover:shadow-md',
                selected.has(approval.id) && 'ring-2 ring-primary ring-offset-2'
              )}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <Checkbox
                    checked={selected.has(approval.id)}
                    onCheckedChange={(checked) => toggleOne(approval.id, !!checked)}
                    aria-label={`Select ${approval.title}`}
                  />

                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold truncate">{approval.title}</h3>
                          <Badge variant="outline" className="text-xs">
                            {typeLabel}
                          </Badge>
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

                      {/* Status and Actions */}
                      <div className="flex items-center gap-2">
                        <Badge className={statusConfig.className}>
                          <statusConfig.icon className="mr-1 h-3 w-3" />
                          {statusConfig.label}
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
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
