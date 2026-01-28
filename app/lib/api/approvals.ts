/**
 * API client for approvals
 */

import { apiClient } from './client';
import { z } from 'zod';

// ============================================================================
// Schemas
// ============================================================================
const approvalSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  conversationId: z.string().optional(),
  type: z.string(),
  status: z.string(),
  requestedBy: z.string(),
  requestedByName: z.string().optional(),
  approvedBy: z.string().optional(),
  approvedByName: z.string().optional(),
  reason: z.string().optional(),
  decision: z.string().optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  submittedAt: z.string().optional(),
  approvedAt: z.string().optional(),
  rejectedAt: z.string().optional(),
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
