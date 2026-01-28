'use client';

import { useEffect, useState } from 'react';
import { useApprovalsStore } from '@/app/lib/stores/approvals-store';
import { getApprovals, approveApproval, rejectApproval } from '@/app/lib/api/approvals';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { CheckCircle2, XCircle, Clock, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { Approval } from '@/app/lib/stores/approvals-store';

export default function ApprovalsPage() {
  const { approvals, setApprovals, setLoading, loading } = useApprovalsStore();
  const [statusFilter, setStatusFilter] = useState('submitted');
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [dialogType, setDialogType] = useState<'approve' | 'reject' | null>(null);
  const [decision, setDecision] = useState('');
  const [processing, setProcessing] = useState(false);

  // Fetch approvals
  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const result = await getApprovals({
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setApprovals(result.data);
    } catch (error) {
      console.error('Failed to fetch approvals:', error);
      toast.error('Failed to load approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [statusFilter]);

  const handleApprove = async () => {
    if (!selectedApproval) return;

    try {
      setProcessing(true);
      await approveApproval(selectedApproval.id, decision);
      toast.success('Approval approved');
      setDialogType(null);
      setDecision('');
      fetchApprovals();
    } catch (error) {
      console.error('Failed to approve:', error);
      toast.error('Failed to approve');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApproval) return;

    try {
      setProcessing(true);
      await rejectApproval(selectedApproval.id, decision);
      toast.success('Approval rejected');
      setDialogType(null);
      setDecision('');
      fetchApprovals();
    } catch (error) {
      console.error('Failed to reject:', error);
      toast.error('Failed to reject');
    } finally {
      setProcessing(false);
    }
  };

  const openDialog = (approval: Approval, type: 'approve' | 'reject') => {
    setSelectedApproval(approval);
    setDialogType(type);
    setDecision('');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Approvals</h1>
            <p className="text-sm text-muted-foreground">
              Review and manage approval requests
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="submitted">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchApprovals} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-2 text-sm text-muted-foreground">Loading approvals...</p>
            </div>
          </div>
        ) : approvals.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <Clock className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">No approvals</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No approval requests match your filters
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-4">
            {approvals.map((approval) => (
              <Card key={approval.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Header */}
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          approval.status === 'submitted'
                            ? 'default'
                            : approval.status === 'approved'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {approval.status}
                      </Badge>
                      <Badge variant="outline">{approval.type}</Badge>
                    </div>

                    {/* Details */}
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Requested by <span className="font-medium">{approval.requestedByName || approval.requestedBy}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(approval.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>

                    {/* Reason */}
                    {approval.reason && (
                      <p className="text-sm">{approval.reason}</p>
                    )}

                    {/* Decision */}
                    {approval.decision && (
                      <div className="rounded-lg border bg-muted/50 p-3">
                        <p className="text-xs font-medium text-muted-foreground">Decision</p>
                        <p className="mt-1 text-sm">{approval.decision}</p>
                        {approval.approvedByName && (
                          <p className="mt-1 text-xs text-muted-foreground">
                            by {approval.approvedByName}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {approval.status === 'submitted' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => openDialog(approval, 'approve')}
                      >
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => openDialog(approval, 'reject')}
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Approve/Reject Dialog */}
      <Dialog open={dialogType !== null} onOpenChange={() => setDialogType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogType === 'approve' ? 'Approve Request' : 'Reject Request'}
            </DialogTitle>
            <DialogDescription>
              {dialogType === 'approve'
                ? 'Add a comment about your approval decision (optional).'
                : 'Please provide a reason for rejection.'}
            </DialogDescription>
          </DialogHeader>

          {selectedApproval && (
            <div className="space-y-4 py-4">
              {/* Approval Info */}
              <div className="rounded-lg border bg-muted/50 p-3 text-sm">
                <p className="font-medium">
                  {selectedApproval.type.replace('_', ' ').toUpperCase()}
                </p>
                <p className="text-muted-foreground">
                  Requested by {selectedApproval.requestedByName || selectedApproval.requestedBy}
                </p>
                {selectedApproval.reason && (
                  <p className="mt-2 text-muted-foreground">{selectedApproval.reason}</p>
                )}
              </div>

              {/* Decision Input */}
              <div className="space-y-2">
                <Label htmlFor="decision">
                  {dialogType === 'approve' ? 'Comment (optional)' : 'Reason for rejection'}
                </Label>
                <Textarea
                  id="decision"
                  placeholder={
                    dialogType === 'approve'
                      ? 'Add any comments about your decision...'
                      : 'Explain why this request is being rejected...'
                  }
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDialogType(null)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant={dialogType === 'approve' ? 'default' : 'destructive'}
              onClick={dialogType === 'approve' ? handleApprove : handleReject}
              disabled={processing || (dialogType === 'reject' && !decision.trim())}
            >
              {processing ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </>
              ) : dialogType === 'approve' ? (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </>
              ) : (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
