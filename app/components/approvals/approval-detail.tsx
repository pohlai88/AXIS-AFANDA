'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  FileText,
  MessageSquare,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Approval } from '@/app/lib/stores/approvals-store';

interface ApprovalDetailProps {
  approval: Approval;
  onApprove?: (decision: string) => Promise<void>;
  onReject?: (decision: string) => Promise<void>;
  onMorph?: (targetScope: 'org' | 'team' | 'individual', targetId: string, reason: string) => Promise<void>;
  onPush?: (
    type: 'PUSH_TO_PERSON' | 'PUSH_TO_ROLE' | 'PUSH_TO_QUEUE',
    targetId: string,
    targetName: string,
    nextAction: string,
    dueAt: Date | undefined,
    priority: 'low' | 'medium' | 'high' | 'urgent'
  ) => Promise<void>;
  processing?: boolean;
  showActions?: boolean;
}

// Status config
const STATUS_CONFIG = {
  draft: {
    icon: FileText,
    label: 'Draft',
    className: 'bg-status-draft-bg text-status-draft-fg border-status-draft-bd',
  },
  submitted: {
    icon: Clock,
    label: 'Pending',
    className: 'bg-pending-bg text-pending-fg border-pending-bd',
  },
  approved: {
    icon: CheckCircle2,
    label: 'Approved',
    className: 'bg-approve-bg text-approve-fg border-approve-bd',
  },
  rejected: {
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

export function ApprovalDetail({
  approval,
  onApprove,
  onReject,
  onMorph,
  onPush,
  processing,
  showActions = true,
}: ApprovalDetailProps) {
  const [decision, setDecision] = useState('');
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const statusConfig = STATUS_CONFIG[approval.status as keyof typeof STATUS_CONFIG] || STATUS_CONFIG.submitted;
  const StatusIcon = statusConfig.icon;
  const priority = approval.metadata?.priority as string | undefined;

  const handleApprove = async () => {
    if (onApprove) {
      setActionType('approve');
      try {
        await onApprove(decision);
        setDecision('');
        setActionType(null);
      } catch {
        setActionType(null);
      }
    }
  };

  const handleReject = async () => {
    if (onReject && decision.trim()) {
      setActionType('reject');
      try {
        await onReject(decision);
        setDecision('');
        setActionType(null);
      } catch {
        setActionType(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className={cn('gap-1.5', statusConfig.className)}>
                  <StatusIcon className="h-3.5 w-3.5" />
                  {statusConfig.label}
                </Badge>
                <Badge variant="outline">
                  {TYPE_LABELS[approval.type] || approval.type}
                </Badge>
                {priority && (
                  <Badge
                    variant="outline"
                    className={cn(
                      priority === 'urgent' && 'border-reject-bd text-reject-fg',
                      priority === 'high' && 'border-status-warn-bd text-status-warn-fg'
                    )}
                  >
                    {priority === 'urgent' && <AlertTriangle className="mr-1 h-3 w-3" />}
                    {priority}
                  </Badge>
                )}
              </div>
              <CardTitle>Approval Request #{approval.id.slice(0, 8)}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Requester */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {approval.requestedByName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">
                {approval.requestedByName || approval.requestedBy}
              </p>
              <p className="text-xs text-muted-foreground">Requester</p>
            </div>
          </div>

          <Separator />

          {/* Timestamps */}
          <div className="grid gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Created:</span>
              <span className="font-medium">
                {format(new Date(approval.createdAt), 'MMM d, yyyy h:mm a')}
              </span>
              <span className="text-muted-foreground">
                ({formatDistanceToNow(new Date(approval.createdAt), { addSuffix: true })})
              </span>
            </div>

            {approval.approvedAt && (
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-approve-fg" />
                <span className="text-muted-foreground">Approved:</span>
                <span className="font-medium">
                  {format(new Date(approval.approvedAt), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
            )}

            {approval.rejectedAt && (
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-reject-fg" />
                <span className="text-muted-foreground">Rejected:</span>
                <span className="font-medium">
                  {format(new Date(approval.rejectedAt), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
            )}
          </div>

          {/* Links */}
          {approval.conversationId && (
            <div className="flex items-center gap-2 text-sm">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <a
                href={`/app/omnichannel/${approval.conversationId}`}
                className="text-primary hover:underline"
              >
                View related conversation
                <ExternalLink className="ml-1 inline h-3 w-3" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Request Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Request Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {approval.reason && (
            <div>
              <Label className="text-muted-foreground">Reason</Label>
              <p className="mt-1 text-sm">{approval.reason}</p>
            </div>
          )}

          {approval.metadata && Object.keys(approval.metadata).length > 0 && (
            <div>
              <Label className="text-muted-foreground">Additional Information</Label>
              <div className="mt-2 space-y-2">
                {Object.entries(approval.metadata).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-sm">
                    <span className="text-muted-foreground capitalize">
                      {key.replace(/_/g, ' ')}:
                    </span>
                    <span className="font-medium">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Decision (if already decided) */}
      {approval.decision && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Decision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm">{approval.decision}</p>
            {approval.approvedByName && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>
                  by <span className="font-medium">{approval.approvedByName}</span>
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Decision Form (for pending approvals) */}
      {approval.status === 'submitted' && (onApprove || onReject) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Make Decision</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="decision">
                {actionType === 'reject' ? 'Reason for rejection *' : 'Comment (optional)'}
              </Label>
              <Textarea
                id="decision"
                placeholder={
                  actionType === 'reject'
                    ? 'Explain why this request is being rejected...'
                    : 'Add any comments about your decision...'
                }
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
                rows={4}
                disabled={processing}
              />
              {actionType === 'reject' && !decision.trim() && (
                <p className="text-xs text-muted-foreground">
                  A reason is required when rejecting a request
                </p>
              )}
            </div>

            <div className="flex gap-2">
              {onApprove && (
                <Button
                  onClick={handleApprove}
                  disabled={processing}
                  className="flex-1 gap-2"
                >
                  {processing && actionType === 'approve' ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      Approve
                    </>
                  )}
                </Button>
              )}
              {onReject && (
                <Button
                  onClick={handleReject}
                  disabled={processing || !decision.trim()}
                  variant="destructive"
                  className="flex-1 gap-2"
                >
                  {processing && actionType === 'reject' ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4" />
                      Reject
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Morph & PUSH Actions */}
      {showActions && (onMorph || onPush) && (
        <div className="grid gap-4 md:grid-cols-2">
          {onMorph && (
            <div>
              {/* Morph selector will be imported and used */}
              <p className="text-sm text-muted-foreground mb-2">
                Morph to different scope (coming soon)
              </p>
            </div>
          )}
          {onPush && (
            <div>
              {/* PUSH handoff will be imported and used */}
              <p className="text-sm text-muted-foreground mb-2">
                PUSH handoff (coming soon)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Audit Trail (Past-Present-Future) */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Audit Trail</CardTitle>
          <p className="text-sm text-muted-foreground">
            Complete history with past, present, and future states
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* If we have audit trail, render it */}
            {approval.auditTrail && approval.auditTrail.length > 0 ? (
              approval.auditTrail.map((event, index) => (
                <div key={event.id} className="relative">
                  {/* Timeline line */}
                  {index < approval.auditTrail!.length - 1 && (
                    <div className="absolute left-4 top-8 h-full w-px bg-border" />
                  )}

                  <div className="flex gap-4">
                    {/* Icon */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                      {event.eventType === 'created' && <FileText className="h-4 w-4" />}
                      {event.eventType === 'submitted' && <ArrowRight className="h-4 w-4" />}
                      {event.eventType === 'approved' && <CheckCircle2 className="h-4 w-4 text-approve-fg" />}
                      {event.eventType === 'rejected' && <XCircle className="h-4 w-4 text-reject-fg" />}
                      {event.eventType === 'morphed' && <ArrowRight className="h-4 w-4" />}
                      {event.eventType === 'pushed' && <ArrowRight className="h-4 w-4" />}
                      {!['created', 'submitted', 'approved', 'rejected', 'morphed', 'pushed'].includes(event.eventType) && (
                        <FileText className="h-4 w-4" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium">
                          {event.actorName} {event.eventType}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(event.timestamp), { addSuffix: true })}
                        </p>
                      </div>

                      {/* Past-Present-Future */}
                      <div className="grid gap-2 text-sm">
                        {/* Past */}
                        {event.previousState && (
                          <div className="rounded-lg bg-muted/50 p-2">
                            <p className="text-xs font-medium text-muted-foreground">Past</p>
                            <p className="text-xs">
                              Status: {String(event.previousState.status || '')}
                            </p>
                          </div>
                        )}

                        {/* Present */}
                        <div className="rounded-lg bg-primary/10 p-2">
                          <p className="text-xs font-medium text-primary">Present</p>
                          <p className="text-xs">
                            Status: {String(event.currentState.status || '')}
                            {event.currentState.assignedTo ? (
                              <> · Assigned to: {String(event.currentState.assignedTo)}</>
                            ) : null}
                          </p>
                        </div>

                        {/* Future */}
                        {event.futureState && (
                          <div className="rounded-lg bg-changes-bg p-2">
                            <p className="text-xs font-medium text-changes-fg">Future</p>
                            <div className="space-y-1 text-xs">
                              {event.futureState.predictedCompletion && (
                                <p>
                                  Predicted: {format(new Date(event.futureState.predictedCompletion), 'PPP')}
                                </p>
                              )}
                              {event.futureState.nextMilestone && (
                                <p>Next: {event.futureState.nextMilestone}</p>
                              )}
                              {event.futureState.slaStatus && (
                                <Badge
                                  variant={
                                    event.futureState.slaStatus === 'on_track'
                                      ? 'default'
                                      : event.futureState.slaStatus === 'at_risk'
                                        ? 'secondary'
                                        : 'destructive'
                                  }
                                  className="text-xs"
                                >
                                  SLA: {event.futureState.slaStatus}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Fallback to simple timeline if no audit trail
              <>
                {/* Created */}
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="h-full w-px bg-border" />
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-medium">Request created</p>
                    <p className="text-xs text-muted-foreground">
                      by {approval.requestedByName || approval.requestedBy}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(approval.createdAt), 'MMM d, yyyy h:mm a')}
                    </p>
                  </div>
                </div>

                {/* Submitted */}
                {approval.submittedAt && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pending-bg">
                        <ArrowRight className="h-4 w-4 text-pending-fg" />
                      </div>
                      {(approval.approvedAt || approval.rejectedAt) && (
                        <div className="h-full w-px bg-border" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm font-medium">Submitted for review</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(approval.submittedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Approved */}
                {approval.approvedAt && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-approve-bg">
                        <CheckCircle2 className="h-4 w-4 text-approve-fg" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Approved</p>
                      <p className="text-xs text-muted-foreground">
                        by {approval.approvedByName || approval.approvedBy}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(approval.approvedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Rejected */}
                {approval.rejectedAt && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-reject-bg">
                        <XCircle className="h-4 w-4 text-reject-fg" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Rejected</p>
                      <p className="text-xs text-muted-foreground">
                        by {approval.approvedByName || approval.approvedBy}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(approval.rejectedAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
