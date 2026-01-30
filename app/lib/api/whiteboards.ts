/**
 * API client for whiteboards
 * Uses centralized types with Zod validation
 */

import { apiClient } from './client';
import {
  Whiteboard,
  WhiteboardSchema,
  WhiteboardListSchema,
  CreateWhiteboardData,
  CreateWhiteboardSchema,
  UpdateWhiteboardData,
  UpdateWhiteboardSchema,
  CreateSnapshotData,
  CreateSnapshotSchema,
  WhiteboardFilters,
  WhiteboardFiltersSchema,
  WhiteboardSnapshot,
  WhiteboardSnapshotSchema,
  WhiteboardSnapshotListSchema,
} from '@/app/lib/types';
import { z } from 'zod';

// ============================================================================
// Response Wrappers
// ============================================================================

const WhiteboardResponseSchema = z.object({
  data: WhiteboardSchema,
});

const WhiteboardListResponseSchema = z.object({
  data: WhiteboardListSchema,
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }).optional(),
});

const SnapshotResponseSchema = z.object({
  data: WhiteboardSnapshotSchema,
});

const SnapshotListResponseSchema = z.object({
  data: WhiteboardSnapshotListSchema,
});

// ============================================================================
// Helper: Build Query String
// ============================================================================

function buildQueryString(filters?: WhiteboardFilters): string {
  if (!filters) return '';

  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.visibility) params.append('visibility', filters.visibility);
  if (filters.tags) filters.tags.forEach(tag => params.append('tags', tag));
  if (filters.collaboratorId) params.append('collaboratorId', filters.collaboratorId);
  if (filters.isTemplate !== undefined) params.append('isTemplate', filters.isTemplate.toString());
  if (filters.templateCategory) params.append('templateCategory', filters.templateCategory);

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Get list of whiteboards with optional filters
 */
export async function getWhiteboards(filters?: WhiteboardFilters): Promise<Whiteboard[]> {
  // Validate filters if provided
  if (filters) {
    WhiteboardFiltersSchema.parse(filters);
  }

  const queryString = buildQueryString(filters);
  const response = await apiClient.get(`/whiteboards${queryString}`, WhiteboardListResponseSchema);
  return response.data;
}

/**
 * Get a single whiteboard by ID
 */
export async function getWhiteboard(id: string): Promise<Whiteboard> {
  const response = await apiClient.get(`/whiteboards/${id}`, WhiteboardResponseSchema);
  return response.data;
}

/**
 * Create a new whiteboard
 */
export async function createWhiteboard(data: CreateWhiteboardData): Promise<Whiteboard> {
  // Validate input data
  CreateWhiteboardSchema.parse(data);

  const response = await apiClient.post('/whiteboards', data, WhiteboardResponseSchema);
  return response.data;
}

/**
 * Update an existing whiteboard
 */
export async function updateWhiteboard(id: string, data: UpdateWhiteboardData): Promise<Whiteboard> {
  // Validate input data
  UpdateWhiteboardSchema.parse(data);

  const response = await apiClient.patch(`/whiteboards/${id}`, data, WhiteboardResponseSchema);
  return response.data;
}

/**
 * Delete a whiteboard
 */
export async function deleteWhiteboard(id: string): Promise<void> {
  await apiClient.delete(`/whiteboards/${id}`);
}

/**
 * Duplicate a whiteboard
 */
export async function duplicateWhiteboard(id: string, name?: string): Promise<Whiteboard> {
  const response = await apiClient.post(
    `/whiteboards/${id}/duplicate`,
    { name },
    WhiteboardResponseSchema
  );
  return response.data;
}

// ============================================================================
// Collaboration Operations
// ============================================================================

/**
 * Add a collaborator to a whiteboard
 */
export async function addCollaborator(
  whiteboardId: string,
  userId: string,
  role: 'owner' | 'editor' | 'viewer' = 'editor'
): Promise<Whiteboard> {
  const response = await apiClient.post(
    `/whiteboards/${whiteboardId}/collaborators`,
    { userId, role },
    WhiteboardResponseSchema
  );
  return response.data;
}

/**
 * Remove a collaborator from a whiteboard
 */
export async function removeCollaborator(
  whiteboardId: string,
  userId: string
): Promise<Whiteboard> {
  const response = await apiClient.delete(
    `/whiteboards/${whiteboardId}/collaborators/${userId}`,
    WhiteboardResponseSchema
  );
  return response.data;
}

/**
 * Update collaborator role
 */
export async function updateCollaboratorRole(
  whiteboardId: string,
  userId: string,
  role: 'owner' | 'editor' | 'viewer'
): Promise<Whiteboard> {
  const response = await apiClient.patch(
    `/whiteboards/${whiteboardId}/collaborators/${userId}`,
    { role },
    WhiteboardResponseSchema
  );
  return response.data;
}

// ============================================================================
// Snapshot Operations
// ============================================================================

/**
 * Create a snapshot of the current whiteboard state
 */
export async function createSnapshot(
  whiteboardId: string,
  data: CreateSnapshotData
): Promise<WhiteboardSnapshot> {
  // Validate input data
  CreateSnapshotSchema.parse(data);

  const response = await apiClient.post(
    `/whiteboards/${whiteboardId}/snapshots`,
    data,
    SnapshotResponseSchema
  );
  return response.data;
}

/**
 * Get all snapshots for a whiteboard
 */
export async function getSnapshots(whiteboardId: string): Promise<WhiteboardSnapshot[]> {
  const response = await apiClient.get(
    `/whiteboards/${whiteboardId}/snapshots`,
    SnapshotListResponseSchema
  );
  return response.data;
}

/**
 * Get a specific snapshot
 */
export async function getSnapshot(
  whiteboardId: string,
  snapshotId: string
): Promise<WhiteboardSnapshot> {
  const response = await apiClient.get(
    `/whiteboards/${whiteboardId}/snapshots/${snapshotId}`,
    SnapshotResponseSchema
  );
  return response.data;
}

/**
 * Restore whiteboard to a snapshot
 */
export async function restoreSnapshot(
  whiteboardId: string,
  snapshotId: string
): Promise<Whiteboard> {
  const response = await apiClient.post(
    `/whiteboards/${whiteboardId}/snapshots/${snapshotId}/restore`,
    {},
    WhiteboardResponseSchema
  );
  return response.data;
}

/**
 * Delete a snapshot
 */
export async function deleteSnapshot(whiteboardId: string, snapshotId: string): Promise<void> {
  await apiClient.delete(`/whiteboards/${whiteboardId}/snapshots/${snapshotId}`);
}

// ============================================================================
// Export Operations
// ============================================================================

/**
 * Export whiteboard as PNG
 */
export async function exportWhiteboardAsPNG(id: string): Promise<Blob> {
  const response = await fetch(`/api/v1/whiteboards/${id}/export/png`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to export whiteboard as PNG');
  }

  return response.blob();
}

/**
 * Export whiteboard as SVG
 */
export async function exportWhiteboardAsSVG(id: string): Promise<Blob> {
  const response = await fetch(`/api/v1/whiteboards/${id}/export/svg`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to export whiteboard as SVG');
  }

  return response.blob();
}

/**
 * Export whiteboard as PDF
 */
export async function exportWhiteboardAsPDF(id: string): Promise<Blob> {
  const response = await fetch(`/api/v1/whiteboards/${id}/export/pdf`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error('Failed to export whiteboard as PDF');
  }

  return response.blob();
}

// ============================================================================
// Template Operations
// ============================================================================

/**
 * Get all whiteboard templates
 */
export async function getWhiteboardTemplates(category?: string): Promise<Whiteboard[]> {
  const params = new URLSearchParams({
    isTemplate: 'true',
    ...(category && { templateCategory: category }),
  });

  const response = await apiClient.get(
    `/whiteboards?${params}`,
    WhiteboardListResponseSchema
  );
  return response.data;
}

/**
 * Create a whiteboard from a template
 */
export async function createFromTemplate(
  templateId: string,
  name: string
): Promise<Whiteboard> {
  const response = await apiClient.post(
    `/whiteboards/${templateId}/use-template`,
    { name },
    WhiteboardResponseSchema
  );
  return response.data;
}

// ============================================================================
// Exports
// ============================================================================

export type {
  Whiteboard,
  CreateWhiteboardData,
  UpdateWhiteboardData,
  WhiteboardFilters,
  WhiteboardSnapshot,
  CreateSnapshotData,
};
