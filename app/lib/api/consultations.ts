/**
 * API client for consultations/meetings
 * Uses centralized types with Zod validation
 */

import { apiClient } from './client';
import {
  Meeting,
  MeetingSchema,
  MeetingListSchema,
  CreateMeetingData,
  CreateMeetingSchema,
  UpdateMeetingData,
  UpdateMeetingSchema,
  CompleteMeetingMinutesData,
  CompleteMeetingMinutesSchema,
  MeetingFilters,
  MeetingFiltersSchema,
  MeetingStats,
  MeetingStatsSchema,
  HeatmapDataSchema,
  HeatmapDay,
} from '@/app/lib/types';
import { z } from 'zod';

// ============================================================================
// Response Wrappers
// ============================================================================

const MeetingResponseSchema = z.object({
  data: MeetingSchema,
});

const MeetingListResponseSchema = z.object({
  data: MeetingListSchema,
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }).optional(),
});

const MeetingStatsResponseSchema = z.object({
  data: MeetingStatsSchema,
});

const HeatmapResponseSchema = z.object({
  data: HeatmapDataSchema,
});

// ============================================================================
// Helper: Build Query String
// ============================================================================

function buildQueryString(filters?: MeetingFilters): string {
  if (!filters) return '';

  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.status) params.append('status', filters.status);
  if (filters.type) params.append('type', filters.type);
  if (filters.startDate) params.append('startDate', filters.startDate.toISOString());
  if (filters.endDate) params.append('endDate', filters.endDate.toISOString());
  if (filters.organizerId) params.append('organizerId', filters.organizerId);
  if (filters.participantId) params.append('participantId', filters.participantId);
  if (filters.caseId) params.append('caseId', filters.caseId);
  if (filters.needsMinutes !== undefined) params.append('needsMinutes', filters.needsMinutes.toString());

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Get list of meetings with optional filters
 */
export async function getMeetings(filters?: MeetingFilters): Promise<Meeting[]> {
  // Validate filters if provided
  if (filters) {
    MeetingFiltersSchema.parse(filters);
  }

  const queryString = buildQueryString(filters);
  const response = await apiClient.get(`/meetings${queryString}`, MeetingListResponseSchema);
  return response.data;
}

/**
 * Get a single meeting by ID
 */
export async function getMeeting(id: string): Promise<Meeting> {
  const response = await apiClient.get(`/meetings/${id}`, MeetingResponseSchema);
  return response.data;
}

/**
 * Create a new meeting
 */
export async function createMeeting(data: CreateMeetingData): Promise<Meeting> {
  // Validate input data
  CreateMeetingSchema.parse(data);

  const response = await apiClient.post('/meetings', data, MeetingResponseSchema);
  return response.data;
}

/**
 * Update an existing meeting
 */
export async function updateMeeting(id: string, data: UpdateMeetingData): Promise<Meeting> {
  // Validate input data
  UpdateMeetingSchema.parse(data);

  const response = await apiClient.patch(`/meetings/${id}`, data, MeetingResponseSchema);
  return response.data;
}

/**
 * Delete a meeting
 */
export async function deleteMeeting(id: string): Promise<void> {
  await apiClient.delete(`/meetings/${id}`);
}

// ============================================================================
// Domain-Specific Operations
// ============================================================================

/**
 * Start a meeting (update status to in-progress)
 */
export async function startMeeting(id: string): Promise<Meeting> {
  const response = await apiClient.patch(
    `/meetings/${id}`,
    {
      status: 'in-progress',
      actualStart: new Date(),
    },
    MeetingResponseSchema
  );
  return response.data;
}

/**
 * Complete a meeting (update status to completed)
 */
export async function completeMeeting(id: string): Promise<Meeting> {
  const response = await apiClient.patch(
    `/meetings/${id}`,
    {
      status: 'completed',
      actualEnd: new Date(),
    },
    MeetingResponseSchema
  );
  return response.data;
}

/**
 * Cancel a meeting
 */
export async function cancelMeeting(id: string, reason?: string): Promise<Meeting> {
  const response = await apiClient.patch(
    `/meetings/${id}`,
    {
      status: 'cancelled',
      metadata: { cancellationReason: reason },
    },
    MeetingResponseSchema
  );
  return response.data;
}

/**
 * Complete meeting minutes
 */
export async function completeMeetingMinutes(
  id: string,
  data: CompleteMeetingMinutesData
): Promise<Meeting> {
  // Validate input data
  CompleteMeetingMinutesSchema.parse(data);

  const response = await apiClient.post(
    `/meetings/${id}/minutes`,
    data,
    MeetingResponseSchema
  );
  return response.data;
}

/**
 * Join a meeting (update participant status)
 */
export async function joinMeeting(id: string, participantId: string): Promise<Meeting> {
  const response = await apiClient.post(
    `/meetings/${id}/join`,
    { participantId },
    MeetingResponseSchema
  );
  return response.data;
}

/**
 * Leave a meeting (update participant status)
 */
export async function leaveMeeting(id: string, participantId: string): Promise<Meeting> {
  const response = await apiClient.post(
    `/meetings/${id}/leave`,
    { participantId },
    MeetingResponseSchema
  );
  return response.data;
}

// ============================================================================
// Statistics & Analytics
// ============================================================================

/**
 * Get meeting statistics
 */
export async function getMeetingStats(filters?: Pick<MeetingFilters, 'startDate' | 'endDate'>): Promise<MeetingStats> {
  const queryString = buildQueryString(filters);
  const response = await apiClient.get(`/meetings/stats${queryString}`, MeetingStatsResponseSchema);
  return response.data;
}

/**
 * Get meeting heatmap data for calendar visualization
 */
export async function getMeetingHeatmap(
  startDate: Date,
  endDate: Date
): Promise<HeatmapDay[]> {
  const params = new URLSearchParams({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const response = await apiClient.get(
    `/meetings/heatmap?${params}`,
    HeatmapResponseSchema
  );
  return response.data;
}

// ============================================================================
// Exports
// ============================================================================

export type {
  Meeting,
  CreateMeetingData,
  UpdateMeetingData,
  CompleteMeetingMinutesData,
  MeetingFilters,
  MeetingStats,
  HeatmapDay,
};
