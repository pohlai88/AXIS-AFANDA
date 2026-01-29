'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getApproval, approveApproval, rejectApproval } from '@/app/lib/api/approvals';
import { ApprovalDetail } from '@/app/components/approvals/approval-detail';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { Approval } from '@/app/lib/stores/approvals-store';

export default function ApprovalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const approvalId = params.id as string;

  const [approval, setApproval] = useState<Approval | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const fetchApproval = async () => {
    try {
      setLoading(true);
      const result = await getApproval(approvalId);
      setApproval({
        ...result.data,
        createdAt: new Date(result.data.createdAt),
        updatedAt: new Date(result.data.updatedAt),
        approvedAt: result.data.approvedAt ? new Date(result.data.approvedAt) : undefined,
        rejectedAt: result.data.rejectedAt ? new Date(result.data.rejectedAt) : undefined,
        submittedAt: result.data.submittedAt ? new Date(result.data.submittedAt) : undefined,
      });
    } catch (error) {
      console.error('Failed to fetch approval:', error);
      toast.error('Failed to load approval');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproval();
  }, [approvalId]);

  const handleApprove = async (decision: string) => {
    if (!approval) return;

    setProcessing(true);
    try {
      await approveApproval(approval.id, decision);
      toast.success('Approval approved successfully');
      fetchApproval(); // Refresh to show updated state
    } catch (error) {
      console.error('Failed to approve:', error);
      toast.error('Failed to approve');
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (decision: string) => {
    if (!approval) return;

    setProcessing(true);
    try {
      await rejectApproval(approval.id, decision);
      toast.success('Approval rejected');
      fetchApproval(); // Refresh to show updated state
    } catch (error) {
      console.error('Failed to reject:', error);
      toast.error('Failed to reject');
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/app/approvals')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Approval Details</h1>
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="mt-2 text-sm text-muted-foreground">Loading approval details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!approval) {
    return (
      <div className="flex h-full flex-col">
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/app/approvals')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Approval Not Found</h1>
            </div>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              The requested approval could not be found.
            </p>
            <Button
              onClick={() => router.push('/app/approvals')}
              className="mt-4"
            >
              Back to Approvals
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/app/approvals')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Approval Details</h1>
              <p className="text-sm text-muted-foreground">
                #{approval.id.slice(0, 8)}
              </p>
            </div>
          </div>
          <Button onClick={fetchApproval} variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl">
          <ApprovalDetail
            approval={approval}
            onApprove={approval.status === 'submitted' ? handleApprove : undefined}
            onReject={approval.status === 'submitted' ? handleReject : undefined}
            processing={processing}
          />
        </div>
      </div>
    </div>
  );
}
