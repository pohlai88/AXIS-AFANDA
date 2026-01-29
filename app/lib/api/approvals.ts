/**
 * API client for approvals
 */

import { apiClient } from './client';
import { z } from 'zod';

// ============================================================================
// Schemas
// ============================================================================

const attachmentSchema = z.object({
  id: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number(),
  url: z.string(),
  contentHash: z.string(),
  uploadedBy: z.string(),
  uploadedAt: z.string(),
});

const labelSchema = z.object({
  id: z.string(),
  displayName: z.string(),
  color: z.string(),
  category: z.string(),
});

const mentionSchema = z.object({
  id: z.string(),
  type: z.enum(['user', 'role', 'team']),
  targetId: z.string(),
  targetName: z.string(),
  mentionedBy: z.string(),
  mentionedAt: z.string(),
  notified: z.boolean(),
});

const morphSchema = z.object({
  id: z.string(),
  sourceApprovalId: z.string(),
  sourceScope: z.enum(['org', 'team', 'individual']),
  targetScope: z.enum(['org', 'team', 'individual']),
  morphReason: z.string(),
  morphedBy: z.string(),
  morphedAt: z.string(),
  targetApprovalId: z.string(),
});

const pushEventSchema = z.object({
  id: z.string(),
  approvalId: z.string(),
  type: z.enum(['PUSH_TO_PERSON', 'PUSH_TO_ROLE', 'PUSH_TO_QUEUE']),
  targetId: z.string(),
  targetName: z.string(),
  nextAction: z.string(),
  dueAt: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  pushedBy: z.string(),
  pushedAt: z.string(),
  completedAt: z.string().optional(),
});

const auditEventSchema = z.object({
  id: z.string(),
  approvalId: z.string(),
  eventType: z.string(),
  actor: z.string(),
  actorName: z.string(),
  timestamp: z.string(),
  previousState: z.record(z.string(), z.any()).optional(),
  currentState: z.record(z.string(), z.any()),
  futureState: z.object({
    predictedCompletion: z.string().optional(),
    nextMilestone: z.string().optional(),
    slaStatus: z.enum(['on_track', 'at_risk', 'breached']).optional(),
    blockedBy: z.array(z.string()).optional(),
    blocking: z.array(z.string()).optional(),
  }).optional(),
  metadata: z.record(z.string(), z.any()).optional(),
});

const approvalSchema = z.object({
  id: z.string(),
  tenantId: z.string(),

  // Template
  templateId: z.string().optional(),
  templateCode: z.string().optional(),
  templateVersion: z.number().optional(),

  // Content
  title: z.string().optional(),
  purpose: z.string().optional(),
  fields: z.record(z.string(), z.any()).optional(),
  contentHash: z.string().optional(),

  // Relationships
  conversationId: z.string().optional(),
  projectId: z.string().optional(),
  parentApprovalId: z.string().optional(),
  relatedApprovalIds: z.array(z.string()).optional(),

  // Scope
  scope: z.enum(['org', 'team', 'individual']).optional(),
  scopeId: z.string().optional(),

  // Status
  type: z.string(),
  status: z.string(),

  // Actors
  requestedBy: z.string(),
  requestedByName: z.string().optional(),
  approvedBy: z.string().optional(),
  approvedByName: z.string().optional(),

  // Decision
  reason: z.string().optional(),
  decision: z.string().optional(),

  // Attachments
  attachments: z.array(attachmentSchema).optional(),

  // Labels & Mentions
  labels: z.array(labelSchema).optional(),
  mentions: z.array(mentionSchema).optional(),

  // Morphology
  morphs: z.array(morphSchema).optional(),
  morphedFrom: z.string().optional(),

  // PUSH
  pushEvents: z.array(pushEventSchema).optional(),

  // Audit
  auditTrail: z.array(auditEventSchema).optional(),

  // Privacy
  privacy: z.enum(['PUBLIC', 'PRIVATE', 'RESTRICTED']).optional(),

  // SLA
  sla: z.object({
    ackTarget: z.string().optional(),
    resolveTarget: z.string().optional(),
    status: z.enum(['on_track', 'at_risk', 'breached']),
  }).optional(),

  // Metadata
  metadata: z.record(z.string(), z.any()).optional(),

  // Timestamps
  createdAt: z.string(),
  updatedAt: z.string(),
  submittedAt: z.string().optional(),
  approvedAt: z.string().optional(),
  rejectedAt: z.string().optional(),

  // Deduplication
  isDuplicate: z.boolean().optional(),
  duplicateOfId: z.string().optional(),
  duplicateOverrideReason: z.string().optional(),
});

const paginatedApprovalsSchema = z.object({
  data: z.array(approvalSchema),
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }),
});

// ============================================================================
// API Functions
// ============================================================================

export interface ApprovalFilters {
  status?: string;
  type?: string;
  conversationId?: string;
  page?: number;
  limit?: number;
}

export async function getApprovals(filters?: ApprovalFilters) {
  const params = new URLSearchParams();

  if (filters?.status) params.append('status', filters.status);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.conversationId) params.append('conversationId', filters.conversationId);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());

  return apiClient.get(`/approvals?${params}`, paginatedApprovalsSchema);
}

export async function getApproval(id: string) {
  return apiClient.get(`/approvals/${id}`, z.object({ data: approvalSchema }));
}

export async function approveApproval(id: string, decision?: string) {
  return apiClient.patch(
    `/approvals/${id}`,
    { status: 'approved', decision },
    z.object({ data: approvalSchema })
  );
}

export async function rejectApproval(id: string, decision?: string) {
  return apiClient.patch(
    `/approvals/${id}`,
    { status: 'rejected', decision },
    z.object({ data: approvalSchema })
  );
}

// ============================================================================
// Templates
// ============================================================================

const templateFieldSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(['text', 'number', 'date', 'select', 'multiselect', 'file', 'textarea']),
  validation: z.object({
    required: z.boolean().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    options: z.array(z.string()).optional(),
  }).optional(),
  helpText: z.string().optional(),
});

const approvalTemplateSchema = z.object({
  id: z.string(),
  code: z.string(),
  type: z.enum(['REQ', 'APR', 'CON', 'FYI', 'INC']),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  requiredFields: z.array(templateFieldSchema),
  optionalFields: z.array(templateFieldSchema),
  evidencePolicy: z.enum(['required', 'optional', 'none']),
  approvalPolicy: z.object({
    type: z.enum(['single', 'sequential', 'parallel', 'quorum']),
    approvers: z.array(z.any()),
    quorumCount: z.number().optional(),
  }),
  privacyDefault: z.enum(['PUBLIC', 'PRIVATE', 'RESTRICTED']),
  tagsSchema: z.array(z.string()),
  slaPolicy: z.object({
    ackTarget: z.number().optional(),
    resolveTarget: z.number().optional(),
    escalationRules: z.array(z.any()).optional(),
  }),
  outputContract: z.array(templateFieldSchema),
  version: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export async function getTemplates() {
  return apiClient.get('/approvals/templates', z.object({ data: z.array(approvalTemplateSchema) }));
}

export async function getTemplate(id: string) {
  return apiClient.get(`/approvals/templates/${id}`, z.object({ data: approvalTemplateSchema }));
}

// ============================================================================
// Deduplication
// ============================================================================

export async function checkDuplicate(templateId: string, contentHash: string) {
  return apiClient.get(
    `/approvals/check-duplicate?templateId=${templateId}&contentHash=${contentHash}`,
    z.object({
      isDuplicate: z.boolean(),
      duplicate: approvalSchema.optional(),
    })
  );
}

// ============================================================================
// Morphology
// ============================================================================

export async function morphApproval(
  id: string,
  targetScope: 'org' | 'team' | 'individual',
  targetId: string,
  reason: string
) {
  return apiClient.post(
    `/approvals/${id}/morph`,
    { targetScope, targetId, reason },
    z.object({ data: approvalSchema })
  );
}

// ============================================================================
// PUSH
// ============================================================================

export async function pushApproval(
  id: string,
  type: 'PUSH_TO_PERSON' | 'PUSH_TO_ROLE' | 'PUSH_TO_QUEUE',
  targetId: string,
  nextAction: string,
  dueAt?: string,
  priority?: 'low' | 'medium' | 'high' | 'urgent'
) {
  return apiClient.post(
    `/approvals/${id}/push`,
    { type, targetId, nextAction, dueAt, priority },
    z.object({ data: pushEventSchema })
  );
}
