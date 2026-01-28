import { create } from 'zustand';

// ============================================================================
// Types
// ============================================================================
export interface Approval {
  id: string;
  tenantId: string;
  conversationId?: string;
  type: string;
  status: string;
  requestedBy: string;
  requestedByName?: string;
  approvedBy?: string;
  approvedByName?: string;
  reason?: string;
  decision?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;
}

interface ApprovalsState {
  approvals: Approval[];
  selectedApproval: Approval | null;
  loading: boolean;
  error: string | null;

  // Actions
  setApprovals: (approvals: Approval[]) => void;
  addApproval: (approval: Approval) => void;
  updateApproval: (id: string, updates: Partial<Approval>) => void;
  selectApproval: (approval: Approval | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// ============================================================================
// Store
// ============================================================================
export const useApprovalsStore = create<ApprovalsState>((set) => ({
  approvals: [],
  selectedApproval: null,
  loading: false,
  error: null,

  setApprovals: (approvals) => set({ approvals }),

  addApproval: (approval) =>
    set((state) => ({
      approvals: [approval, ...state.approvals],
    })),

  updateApproval: (id, updates) =>
    set((state) => ({
      approvals: state.approvals.map((approval) =>
        approval.id === id ? { ...approval, ...updates } : approval
      ),
      selectedApproval:
        state.selectedApproval?.id === id
          ? { ...state.selectedApproval, ...updates }
          : state.selectedApproval,
    })),

  selectApproval: (approval) => set({ selectedApproval: approval }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      approvals: [],
      selectedApproval: null,
      loading: false,
      error: null,
    }),
}));
