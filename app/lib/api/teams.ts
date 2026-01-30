/**
 * API client for teams
 * Uses centralized types with Zod validation
 */

import { apiClient } from './client';
import {
  Team,
  TeamSchema,
  TeamListSchema,
  CreateTeamData,
  CreateTeamSchema,
  UpdateTeamData,
  UpdateTeamSchema,
  TeamMember,
  TeamMemberSchema,
  TeamMemberListSchema,
  AddTeamMemberData,
  AddTeamMemberSchema,
  UpdateTeamMemberData,
  UpdateTeamMemberSchema,
  InviteTeamMembersData,
  InviteTeamMembersSchema,
  TeamInvitation,
  TeamInvitationSchema,
  TeamInvitationListSchema,
  TeamFilters,
  TeamFiltersSchema,
  TeamStats,
  TeamStatsSchema,
} from '@/app/lib/types';
import { z } from 'zod';

// ============================================================================
// Response Wrappers
// ============================================================================

const TeamResponseSchema = z.object({
  data: TeamSchema,
});

const TeamListResponseSchema = z.object({
  data: TeamListSchema,
  meta: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
  }).optional(),
});

const TeamMemberResponseSchema = z.object({
  data: TeamMemberSchema,
});

const TeamMemberListResponseSchema = z.object({
  data: TeamMemberListSchema,
});

const TeamInvitationResponseSchema = z.object({
  data: TeamInvitationSchema,
});

const TeamInvitationListResponseSchema = z.object({
  data: TeamInvitationListSchema,
});

const TeamStatsResponseSchema = z.object({
  data: TeamStatsSchema,
});

const InvitationResultSchema = z.object({
  success: z.boolean(),
  invited: z.number(),
  failed: z.number(),
  invitations: TeamInvitationListSchema,
  errors: z.array(z.object({
    email: z.string(),
    error: z.string(),
  })).optional(),
});

const BulkDeleteResultSchema = z.object({
  success: z.boolean(),
  deleted: z.number(),
});

const BulkRemoveMembersResultSchema = z.object({
  success: z.boolean(),
  removed: z.number(),
});

// ============================================================================
// Helper: Build Query String
// ============================================================================

function buildQueryString(filters?: TeamFilters): string {
  if (!filters) return '';

  const params = new URLSearchParams();

  if (filters.search) params.append('search', filters.search);
  if (filters.visibility) params.append('visibility', filters.visibility);
  if (filters.memberId) params.append('memberId', filters.memberId);
  if (filters.parentTeamId) params.append('parentTeamId', filters.parentTeamId);
  if (filters.hasParent !== undefined) params.append('hasParent', filters.hasParent.toString());

  const queryString = params.toString();
  return queryString ? `?${queryString}` : '';
}

// ============================================================================
// Team CRUD Operations
// ============================================================================

/**
 * Get list of teams with optional filters
 */
export async function getTeams(filters?: TeamFilters): Promise<Team[]> {
  // Validate filters if provided
  if (filters) {
    TeamFiltersSchema.parse(filters);
  }

  const queryString = buildQueryString(filters);
  const response = await apiClient.get(`/teams${queryString}`, TeamListResponseSchema);
  return response.data;
}

/**
 * Get a single team by ID
 */
export async function getTeam(id: string): Promise<Team> {
  const response = await apiClient.get(`/teams/${id}`, TeamResponseSchema);
  return response.data;
}

/**
 * Create a new team
 */
export async function createTeam(data: CreateTeamData): Promise<Team> {
  // Validate input data
  CreateTeamSchema.parse(data);

  const response = await apiClient.post('/teams', data, TeamResponseSchema);
  return response.data;
}

/**
 * Update an existing team
 */
export async function updateTeam(id: string, data: UpdateTeamData): Promise<Team> {
  // Validate input data
  UpdateTeamSchema.parse(data);

  const response = await apiClient.patch(`/teams/${id}`, data, TeamResponseSchema);
  return response.data;
}

/**
 * Delete a team
 */
export async function deleteTeam(id: string): Promise<void> {
  await apiClient.delete(`/teams/${id}`);
}

// ============================================================================
// Team Member Operations
// ============================================================================

/**
 * Get all members of a team
 */
export async function getTeamMembers(teamId: string): Promise<TeamMember[]> {
  const response = await apiClient.get(
    `/teams/${teamId}/members`,
    TeamMemberListResponseSchema
  );
  return response.data;
}

/**
 * Get a specific team member
 */
export async function getTeamMember(teamId: string, memberId: string): Promise<TeamMember> {
  const response = await apiClient.get(
    `/teams/${teamId}/members/${memberId}`,
    TeamMemberResponseSchema
  );
  return response.data;
}

/**
 * Add a member to a team
 */
export async function addTeamMember(
  teamId: string,
  data: AddTeamMemberData
): Promise<TeamMember> {
  // Validate input data
  AddTeamMemberSchema.parse(data);

  const response = await apiClient.post(
    `/teams/${teamId}/members`,
    data,
    TeamMemberResponseSchema
  );
  return response.data;
}

/**
 * Update a team member's role
 */
export async function updateTeamMember(
  teamId: string,
  memberId: string,
  data: UpdateTeamMemberData
): Promise<TeamMember> {
  // Validate input data
  UpdateTeamMemberSchema.parse(data);

  const response = await apiClient.patch(
    `/teams/${teamId}/members/${memberId}`,
    data,
    TeamMemberResponseSchema
  );
  return response.data;
}

/**
 * Remove a member from a team
 */
export async function removeTeamMember(teamId: string, userId: string): Promise<void> {
  await apiClient.delete(`/teams/${teamId}/members/${userId}`);
}

// ============================================================================
// Team Invitation Operations
// ============================================================================

/**
 * Invite members to a team
 */
export async function inviteTeamMembers(
  teamId: string,
  data: InviteTeamMembersData
): Promise<{ invited: number; failed: number; invitations: TeamInvitation[] }> {
  // Validate input data
  InviteTeamMembersSchema.parse(data);

  const response = await apiClient.post(
    `/teams/${teamId}/invitations`,
    data,
    InvitationResultSchema
  );

  return {
    invited: response.invited,
    failed: response.failed,
    invitations: response.invitations,
  };
}

// ============================================================================
// Bulk operations
// ============================================================================

export async function bulkInviteTeamMembers(
  teamIds: string[],
  data: InviteTeamMembersData
): Promise<{ invited: number; failed: number; invitations: TeamInvitation[] }> {
  InviteTeamMembersSchema.parse(data);

  const response = await apiClient.post(
    `/teams/bulk`,
    { teamIds, ...data },
    InvitationResultSchema
  );

  return {
    invited: response.invited,
    failed: response.failed,
    invitations: response.invitations,
  };
}

export async function bulkRemoveTeamMembers(teamIds: string[], userIds: string[]) {
  const response = await apiClient.patch(
    `/teams/bulk`,
    { teamIds, userIds },
    BulkRemoveMembersResultSchema
  );
  return response;
}

export async function bulkDeleteTeams(teamIds: string[]) {
  const response = await apiClient.delete(`/teams/bulk`, BulkDeleteResultSchema, { teamIds });
  return response;
}

/**
 * Get all invitations for a team
 */
export async function getTeamInvitations(
  teamId: string,
  status?: 'pending' | 'accepted' | 'declined' | 'expired'
): Promise<TeamInvitation[]> {
  const params = status ? `?status=${status}` : '';
  const response = await apiClient.get(
    `/teams/${teamId}/invitations${params}`,
    TeamInvitationListResponseSchema
  );
  return response.data;
}

/**
 * Get a specific invitation
 */
export async function getTeamInvitation(
  teamId: string,
  invitationId: string
): Promise<TeamInvitation> {
  const response = await apiClient.get(
    `/teams/${teamId}/invitations/${invitationId}`,
    TeamInvitationResponseSchema
  );
  return response.data;
}

/**
 * Cancel/revoke an invitation
 */
export async function cancelTeamInvitation(teamId: string, invitationId: string): Promise<void> {
  await apiClient.delete(`/teams/${teamId}/invitations/${invitationId}`);
}

/**
 * Resend an invitation
 */
export async function resendTeamInvitation(
  teamId: string,
  invitationId: string
): Promise<TeamInvitation> {
  const response = await apiClient.post(
    `/teams/${teamId}/invitations/${invitationId}/resend`,
    {},
    TeamInvitationResponseSchema
  );
  return response.data;
}

/**
 * Accept an invitation (public endpoint with token)
 */
export async function acceptTeamInvitation(token: string): Promise<{ team: Team; member: TeamMember }> {
  const response = await apiClient.post(
    `/teams/invitations/accept`,
    { token },
    z.object({
      data: z.object({
        team: TeamSchema,
        member: TeamMemberSchema,
      }),
    })
  );
  return response.data;
}

/**
 * Decline an invitation (public endpoint with token)
 */
export async function declineTeamInvitation(token: string): Promise<void> {
  await apiClient.post(`/teams/invitations/decline`, { token });
}

// ============================================================================
// Statistics
// ============================================================================

/**
 * Get team statistics
 */
export async function getTeamStats(): Promise<TeamStats> {
  const response = await apiClient.get('/teams/stats', TeamStatsResponseSchema);
  return response.data;
}

// ============================================================================
// Exports
// ============================================================================

export type {
  Team,
  CreateTeamData,
  UpdateTeamData,
  TeamMember,
  AddTeamMemberData,
  UpdateTeamMemberData,
  TeamInvitation,
  InviteTeamMembersData,
  TeamFilters,
  TeamStats,
};
