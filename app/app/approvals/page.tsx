'use client';

import { useEffect, useState } from 'react';
import { useApprovalsStore } from '@/app/lib/stores/approvals-store';
import { getApprovals, approveApproval, rejectApproval } from '@/app/lib/api/approvals';
import { ApprovalFilters, type ApprovalFilters as ApprovalFiltersType } from '@/app/components/approvals/approval-filters';
import { ApprovalList } from '@/app/components/approvals/approval-list';
import { ApprovalStatsCards, type ApprovalStats } from '@/app/components/approvals/approval-stats';
import { ApprovalDetail } from '@/app/components/approvals/approval-detail';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import type { Approval } from '@/app/lib/stores/approvals-store';

export default function ApprovalsPage() {
  const { approvals, setApprovals, setLoading, loading } = useApprovalsStore();
  const [filters, setFilters] = useState<ApprovalFiltersType>({
    status: 'submitted',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [processing, setProcessing] = useState(false);
  const [stats, setStats] = useState<ApprovalStats>({
    pending: 0,
    approved: 0,
    rejected: 0,
    urgent: 0,
    totalToday: 0,
  });

  // Fetch approvals
  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const result = await getApprovals({
        status: filters.status,
        type: filters.type,
        // Add more filter params as needed
      });
      const mappedApprovals = result.data.map((a: any) => ({
        ...a,
        createdAt: new Date(a.createdAt),
        updatedAt: new Date(a.updatedAt),
        approvedAt: a.approvedAt ? new Date(a.approvedAt) : undefined,
        rejectedAt: a.rejectedAt ? new Date(a.rejectedAt) : undefined,
      }));
      setApprovals(mappedApprovals);

      // Calculate stats
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const pending = mappedApprovals.filter((a) => a.status === 'submitted').length;
      const approved = mappedApprovals.filter((a) => a.status === 'approved').length;
      const rejected = mappedApprovals.filter((a) => a.status === 'rejected').length;
      const urgent = mappedApprovals.filter(
        (a) => a.status === 'submitted' && a.metadata?.priority === 'urgent'
      ).length;
      const totalToday = mappedApprovals.filter(
        (a) => new Date(a.createdAt) >= today
      ).length;

      setStats({
        pending,
        approved,
        rejected,
        urgent,
        totalToday,
      });
    } catch (error) {
      console.error('Failed to fetch approvals:', error);
      toast.error('Failed to load approvals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, [filters.status, filters.type]);

  const handleApprove = async (approval: Approval) => {
    setSelectedApproval(approval);
  };

  const handleReject = async (approval: Approval) => {
    setSelectedApproval(approval);
  };

  const handleView = (approval: Approval) => {
    setSelectedApproval(approval);
  };

  const handleApproveDecision = async (decision: string) => {
    if (!selectedApproval) return;

    setProcessing(true);
    try {
      await approveApproval(selectedApproval.id, decision);
      toast.success('Approval approved successfully');
      setSelectedApproval(null);
      fetchApprovals();
    } catch (error) {
      console.error('Failed to approve:', error);
      toast.error('Failed to approve');
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  const handleRejectDecision = async (decision: string) => {
    if (!selectedApproval) return;

    setProcessing(true);
    try {
      await rejectApproval(selectedApproval.id, decision);
      toast.success('Approval rejected');
      setSelectedApproval(null);
      fetchApprovals();
    } catch (error) {
      console.error('Failed to reject:', error);
      toast.error('Failed to reject');
      throw error;
    } finally {
      setProcessing(false);
    }
  };

  const handleFiltersChange = (newFilters: ApprovalFiltersType) => {
    setFilters(newFilters);
  };

  const handleResetFilters = () => {
    setFilters({
      status: 'submitted',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
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
            <Button onClick={() => window.location.href = '/app/approvals/new'}>
              New Request
            </Button>
            <Button onClick={fetchApprovals} variant="outline" size="sm">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Stats */}
          <ApprovalStatsCards stats={stats} loading={loading} />

          {/* Filters */}
          <ApprovalFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onReset={handleResetFilters}
          />

          {/* List */}
          <ApprovalList
            approvals={approvals}
            loading={loading}
            onApprove={handleApprove}
            onReject={handleReject}
            onView={handleView}
          />
        </div>
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedApproval} onOpenChange={(open) => !open && setSelectedApproval(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>Approval Details</SheetTitle>
          </SheetHeader>
          <div className="mt-6">
            {selectedApproval && (
              <ApprovalDetail
                approval={selectedApproval}
                onApprove={selectedApproval.status === 'submitted' ? handleApproveDecision : undefined}
                onReject={selectedApproval.status === 'submitted' ? handleRejectDecision : undefined}
                processing={processing}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
