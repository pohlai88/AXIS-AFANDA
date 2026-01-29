'use client';

import { create } from 'zustand';

// ============================================================================
// Types
// ============================================================================

/**
 * Approval Template Definition
 * Templates ensure structural consistency and prevent drift
 */
export interface ApprovalTemplate {
  id: string;
  code: string; // e.g., 'REQ_EXPENSE', 'APR_BUDGET', 'CON_EXCEPTION'
  type: 'REQ' | 'APR' | 'CON' | 'FYI' | 'INC';
  name: string;
  description: string;
  category: string;

  // Structure
  requiredFields: TemplateField[];
  optionalFields: TemplateField[];

  // Policies
  evidencePolicy: 'required' | 'optional' | 'none';
  approvalPolicy: ApprovalPolicy;
  privacyDefault: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';
  tagsSchema: string[]; // Allowed label IDs
  slaPolicy: SLAPolicy;

  // Output
  outputContract: TemplateField[];

  // Metadata
  version: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'file' | 'textarea';
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
  helpText?: string;
}

export interface ApprovalPolicy {
  type: 'single' | 'sequential' | 'parallel' | 'quorum';
  approvers: {
    step?: number; // For sequential
    userId?: string;
    roleKey?: string;
    queueKey?: string;
    required: boolean;
  }[];
  quorumCount?: number; // For quorum type
}

export interface SLAPolicy {
  ackTarget?: number; // Minutes to acknowledge
  resolveTarget?: number; // Minutes to resolve
  escalationRules?: {
    afterMinutes: number;
    escalateTo: string; // userId or roleKey
  }[];
}

/**
 * Attachment with hash-based deduplication
 */
export interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  contentHash: string; // SHA256 for deduplication
  uploadedBy: string;
  uploadedAt: Date;
}

/**
 * Label (controlled vocabulary)
 */
export interface Label {
  id: string; // Stable ID: LBL_FIN_AP, LBL_HR_LEAVE
  displayName: string;
  color: string;
  category: string;
}

/**
 * Mention (actor reference with audit)
 */
export interface Mention {
  id: string;
  type: 'user' | 'role' | 'team';
  targetId: string;
  targetName: string;
  mentionedBy: string;
  mentionedAt: Date;
  notified: boolean;
}

/**
 * Morph (derived thread across scopes)
 */
export interface Morph {
  id: string;
  sourceApprovalId: string;
  sourceScope: 'org' | 'team' | 'individual';
  targetScope: 'org' | 'team' | 'individual';
  morphReason: string;
  morphedBy: string;
  morphedAt: Date;
  targetApprovalId: string;
}

/**
 * PUSH (handoff event)
 */
export interface PushEvent {
  id: string;
  approvalId: string;
  type: 'PUSH_TO_PERSON' | 'PUSH_TO_ROLE' | 'PUSH_TO_QUEUE';
  targetId: string;
  targetName: string;
  nextAction: string;
  dueAt?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  pushedBy: string;
  pushedAt: Date;
  completedAt?: Date;
}

/**
 * Audit Event (past-present-future trail)
 */
export interface AuditEvent {
  id: string;
  approvalId: string;
  eventType: 'created' | 'submitted' | 'approved' | 'rejected' | 'morphed' | 'pushed' | 'commented' | 'attached' | 'mentioned';
  actor: string;
  actorName: string;
  timestamp: Date;

  // Past: What was
  previousState?: Record<string, any>;

  // Present: What is
  currentState: Record<string, any>;

  // Future: What will be (predictions, SLA, next steps)
  futureState?: {
    predictedCompletion?: Date;
    nextMilestone?: string;
    slaStatus?: 'on_track' | 'at_risk' | 'breached';
  };

  metadata?: Record<string, any>;
}

/**
 * Enhanced Approval with template, attachments, morphology
 */
export interface Approval {
  id: string;
  tenantId: string;

  // Template-first
  templateId: string;
  templateCode: string;
  templateVersion: number;

  // Content
  title: string;
  purpose: string;
  fields: Record<string, any>; // Template-defined fields
  contentHash: string; // SHA256 for deduplication

  // Relationships (internal only)
  conversationId?: string; // Link to internal conversation
  projectId?: string;
  parentApprovalId?: string; // For chains
  relatedApprovalIds?: string[];

  // Scope (internal hierarchy)
  scope: 'org' | 'team' | 'individual';
  scopeId: string; // orgId, teamId, or userId

  // Status
  type: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled';

  // Actors
  requestedBy: string;
  requestedByName?: string;
  approvedBy?: string;
  approvedByName?: string;

  // Decision
  reason?: string;
  decision?: string;

  // Attachments
  attachments?: Attachment[];

  // Labels & Mentions
  labels?: Label[];
  mentions?: Mention[];

  // Morphology
  morphs?: Morph[];
  morphedFrom?: string; // Source approval ID

  // PUSH events
  pushEvents?: PushEvent[];

  // Audit trail
  auditTrail?: AuditEvent[];

  // Privacy
  privacy: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';

  // SLA
  sla?: {
    ackTarget?: Date;
    resolveTarget?: Date;
    status: 'on_track' | 'at_risk' | 'breached';
  };

  // Metadata
  metadata?: Record<string, any>;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  submittedAt?: Date;
  approvedAt?: Date;
  rejectedAt?: Date;

  // Deduplication
  isDuplicate?: boolean;
  duplicateOfId?: string;
  duplicateOverrideReason?: string;
}

/**
 * Deduplication Record
 */
export interface DedupRecord {
  id: string;
  tenantId: string;
  templateId: string;
  contentHash: string;
  approvalId: string;
  createdAt: Date;
  expiresAt: Date; // Dedup window (e.g., 30 days)
}

interface ApprovalsState {
  approvals: Approval[];
  templates: ApprovalTemplate[];
  selectedApproval: Approval | null;
  selectedTemplate: ApprovalTemplate | null;
  loading: boolean;
  error: string | null;

  // Actions
  setApprovals: (approvals: Approval[]) => void;
  addApproval: (approval: Approval) => void;
  updateApproval: (id: string, updates: Partial<Approval>) => void;
  selectApproval: (approval: Approval | null) => void;

  setTemplates: (templates: ApprovalTemplate[]) => void;
  selectTemplate: (template: ApprovalTemplate | null) => void;

  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// ============================================================================
// Store
// ============================================================================
export const useApprovalsStore = create<ApprovalsState>((set) => ({
  approvals: [],
  templates: [],
  selectedApproval: null,
  selectedTemplate: null,
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

  setTemplates: (templates) => set({ templates }),

  selectTemplate: (template) => set({ selectedTemplate: template }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      approvals: [],
      templates: [],
      selectedApproval: null,
      selectedTemplate: null,
      loading: false,
      error: null,
    }),
}));
