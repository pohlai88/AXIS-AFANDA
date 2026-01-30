/**
 * Approvals Domain Types
 * Centralized types with Zod validation
 */

import { z } from 'zod';
import { BaseEntitySchema, AttachmentSchema, LabelSchema, PrioritySchema, MentionSchema } from './common';

// ============================================================================
// Approval Types
// ============================================================================

export const ApprovalTypeSchema = z.enum(['REQ', 'APR', 'CON', 'FYI', 'INC']);
export type ApprovalType = z.infer<typeof ApprovalTypeSchema>;

export const ApprovalStatusSchema = z.enum([
  'pending',
  'approved',
  'rejected',
  'cancelled',
  'escalated',
]);
export type ApprovalStatus = z.infer<typeof ApprovalStatusSchema>;

export const ApprovalScopeSchema = z.enum(['org', 'team', 'individual']);
export type ApprovalScope = z.infer<typeof ApprovalScopeSchema>;

export const PrivacyLevelSchema = z.enum(['PUBLIC', 'PRIVATE', 'RESTRICTED']);
export type PrivacyLevel = z.infer<typeof PrivacyLevelSchema>;

// ============================================================================
// Template Field
// ============================================================================

export const TemplateFieldValidationSchema = z.object({
  required: z.boolean().optional(),
  min: z.number().optional(),
  max: z.number().optional(),
  pattern: z.string().optional(),
  options: z.array(z.string()).optional(),
});

export const TemplateFieldSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(['text', 'number', 'date', 'select', 'multiselect', 'file', 'textarea']),
  validation: TemplateFieldValidationSchema.optional(),
  helpText: z.string().optional(),
});

export type TemplateField = z.infer<typeof TemplateFieldSchema>;

// ============================================================================
// Approval Policy
// ============================================================================

export const ApprovalPolicySchema = z.object({
  type: z.enum(['single', 'sequential', 'parallel', 'quorum']),
  approvers: z.array(
    z.object({
      step: z.number().optional(), // For sequential
      userId: z.string().optional(),
      roleKey: z.string().optional(),
      queueKey: z.string().optional(),
      required: z.boolean(),
    })
  ),
  quorumCount: z.number().optional(), // For quorum type
});

export type ApprovalPolicy = z.infer<typeof ApprovalPolicySchema>;

// ============================================================================
// SLA Policy
// ============================================================================

export const SLAPolicySchema = z.object({
  ackTarget: z.number().optional(), // Minutes to acknowledge
  resolveTarget: z.number().optional(), // Minutes to resolve
  escalationRules: z
    .array(
      z.object({
        afterMinutes: z.number(),
        escalateTo: z.string(), // userId or roleKey
      })
    )
    .optional(),
});

export type SLAPolicy = z.infer<typeof SLAPolicySchema>;

// ============================================================================
// Approval Template
// ============================================================================

export const ApprovalTemplateSchema = z.object({
  id: z.string(),
  code: z.string(), // e.g., 'REQ_EXPENSE', 'APR_BUDGET'
  type: ApprovalTypeSchema,
  name: z.string(),
  description: z.string(),
  category: z.string(),
  requiredFields: z.array(TemplateFieldSchema),
  optionalFields: z.array(TemplateFieldSchema),
  evidencePolicy: z.enum(['required', 'optional', 'none']),
  approvalPolicy: ApprovalPolicySchema,
  privacyDefault: PrivacyLevelSchema,
  tagsSchema: z.array(z.string()), // Allowed label IDs
  slaPolicy: SLAPolicySchema,
  outputContract: z.array(TemplateFieldSchema),
  version: z.number(),
  isActive: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type ApprovalTemplate = z.infer<typeof ApprovalTemplateSchema>;
export const ApprovalTemplateListSchema = z.array(ApprovalTemplateSchema);

// ============================================================================
// Morph (Scope Change)
// ============================================================================

export const MorphSchema = z.object({
  id: z.string(),
  sourceApprovalId: z.string(),
  sourceScope: ApprovalScopeSchema,
  targetScope: ApprovalScopeSchema,
  morphReason: z.string(),
  morphedBy: z.string(),
  morphedAt: z.coerce.date(),
  targetApprovalId: z.string(),
});

export type Morph = z.infer<typeof MorphSchema>;

// ============================================================================
// PUSH Event (Handoff)
// ============================================================================

export const PushEventSchema = z.object({
  id: z.string(),
  approvalId: z.string(),
  type: z.enum(['PUSH_TO_PERSON', 'PUSH_TO_ROLE', 'PUSH_TO_QUEUE']),
  targetId: z.string(),
  targetName: z.string(),
  nextAction: z.string(),
  dueAt: z.coerce.date().optional(),
  priority: PrioritySchema,
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
  pushedBy: z.string(),
  pushedAt: z.coerce.date(),
  completedAt: z.coerce.date().optional(),
});

export type PushEvent = z.infer<typeof PushEventSchema>;

// ============================================================================
// Audit Event (Past-Present-Future Trail)
// ============================================================================

export const AuditEventSchema = z.object({
  id: z.string(),
  approvalId: z.string(),
  eventType: z.string(),
  actor: z.string(),
  actorName: z.string(),
  timestamp: z.coerce.date(),
  pastState: z.record(z.unknown()).optional(),
  presentState: z.record(z.unknown()),
  futureState: z.record(z.unknown()).optional(),
  diff: z.record(z.unknown()).optional(),
  metadata: z.record(z.unknown()).optional(),
});

export type AuditEvent = z.infer<typeof AuditEventSchema>;

// ============================================================================
// Approval
// ============================================================================

export const ApprovalSchema = BaseEntitySchema.extend({
  templateId: z.string(),
  templateCode: z.string(),
  type: ApprovalTypeSchema,
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  status: ApprovalStatusSchema,
  priority: PrioritySchema.default('medium'),
  urgency: z.boolean().default(false),
  scope: ApprovalScopeSchema,
  privacy: PrivacyLevelSchema,
  requesterId: z.string(),
  requesterName: z.string(),
  formData: z.record(z.unknown()),
  attachments: z.array(AttachmentSchema).default([]),
  labels: z.array(LabelSchema).default([]),
  mentions: z.array(MentionSchema).default([]),
  morphs: z.array(MorphSchema).default([]),
  pushEvents: z.array(PushEventSchema).default([]),
  auditTrail: z.array(AuditEventSchema).default([]),
  approvedBy: z.string().optional(),
  approvedAt: z.coerce.date().optional(),
  rejectedBy: z.string().optional(),
  rejectedAt: z.coerce.date().optional(),
  rejectionReason: z.string().optional(),
  slaAckedAt: z.coerce.date().optional(),
  slaResolvedAt: z.coerce.date().optional(),
  slaBreach: z.boolean().default(false),
});

export type Approval = z.infer<typeof ApprovalSchema>;
export const ApprovalListSchema = z.array(ApprovalSchema);

// ============================================================================
// Create/Update Schemas
// ============================================================================

export const CreateApprovalSchema = ApprovalSchema.omit({
  id: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  morphs: true,
  pushEvents: true,
  auditTrail: true,
  approvedBy: true,
  approvedAt: true,
  rejectedBy: true,
  rejectedAt: true,
  rejectionReason: true,
  slaAckedAt: true,
  slaResolvedAt: true,
  slaBreach: true,
}).extend({
  attachments: z.array(z.string()).optional(), // File IDs for creation
  labels: z.array(z.string()).optional(), // Label IDs for creation
});

export type CreateApprovalData = z.infer<typeof CreateApprovalSchema>;

export const UpdateApprovalSchema = CreateApprovalSchema.partial();
export type UpdateApprovalData = z.infer<typeof UpdateApprovalSchema>;

export const ApproveApprovalSchema = z.object({
  comments: z.string().optional(),
  conditions: z.string().optional(),
});

export type ApproveApprovalData = z.infer<typeof ApproveApprovalSchema>;

export const RejectApprovalSchema = z.object({
  reason: z.string().min(10),
  alternativeSuggestion: z.string().optional(),
});

export type RejectApprovalData = z.infer<typeof RejectApprovalSchema>;

export const MorphApprovalSchema = z.object({
  targetScope: ApprovalScopeSchema,
  morphReason: z.string().min(10),
});

export type MorphApprovalData = z.infer<typeof MorphApprovalSchema>;

export const PushApprovalSchema = z.object({
  type: z.enum(['PUSH_TO_PERSON', 'PUSH_TO_ROLE', 'PUSH_TO_QUEUE']),
  targetId: z.string(),
  targetName: z.string(),
  nextAction: z.string().min(10),
  dueAt: z.coerce.date().optional(),
  priority: PrioritySchema.default('medium'),
});

export type PushApprovalData = z.infer<typeof PushApprovalSchema>;

// ============================================================================
// Approval Filters
// ============================================================================

export const ApprovalFiltersSchema = z.object({
  search: z.string().optional(),
  status: ApprovalStatusSchema.optional(),
  type: ApprovalTypeSchema.optional(),
  priority: PrioritySchema.optional(),
  urgency: z.boolean().optional(),
  scope: ApprovalScopeSchema.optional(),
  privacy: PrivacyLevelSchema.optional(),
  requesterId: z.string().optional(),
  templateId: z.string().optional(),
  labels: z.array(z.string()).optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  slaBreach: z.boolean().optional(),
});

export type ApprovalFilters = z.infer<typeof ApprovalFiltersSchema>;

// ============================================================================
// Approval Statistics
// ============================================================================

export const ApprovalStatsSchema = z.object({
  pending: z.number(),
  approved: z.number(),
  rejected: z.number(),
  urgent: z.number(),
  totalToday: z.number(),
  slaBreach: z.number().optional(),
  avgResolutionTime: z.number().optional(), // in minutes
});

export type ApprovalStats = z.infer<typeof ApprovalStatsSchema>;

// ============================================================================
// Duplicate Check
// ============================================================================

export const DuplicateCheckRequestSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  templateId: z.string(),
  formData: z.record(z.unknown()).optional(),
});

export type DuplicateCheckRequest = z.infer<typeof DuplicateCheckRequestSchema>;

export const DuplicateCheckResponseSchema = z.object({
  isDuplicate: z.boolean(),
  similarApprovals: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      status: ApprovalStatusSchema,
      similarity: z.number(), // 0-100%
      createdAt: z.coerce.date(),
    })
  ),
});

export type DuplicateCheckResponse = z.infer<typeof DuplicateCheckResponseSchema>;
