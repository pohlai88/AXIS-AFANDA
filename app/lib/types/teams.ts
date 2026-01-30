/**
 * Teams Domain Types
 * Centralized types with Zod validation
 */

import { z } from 'zod';
import { BaseEntitySchema, UserSchema } from './common';

// ============================================================================
// Team Visibility
// ============================================================================

export const TeamVisibilitySchema = z.enum(['private', 'public']);
export type TeamVisibility = z.infer<typeof TeamVisibilitySchema>;

// ============================================================================
// Team Member Role
// ============================================================================

export const TeamMemberRoleSchema = z.enum(['owner', 'admin', 'member']);
export type TeamMemberRole = z.infer<typeof TeamMemberRoleSchema>;

// ============================================================================
// Team Member
// ============================================================================

export const TeamMemberSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  avatar: z.string().optional(),
  role: TeamMemberRoleSchema,
  joinedAt: z.coerce.date(),
  invitedBy: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type TeamMember = z.infer<typeof TeamMemberSchema>;
export const TeamMemberListSchema = z.array(TeamMemberSchema);

// ============================================================================
// Team Invitation
// ============================================================================

export const InvitationStatusSchema = z.enum(['pending', 'accepted', 'declined', 'expired']);
export type InvitationStatus = z.infer<typeof InvitationStatusSchema>;

export const TeamInvitationSchema = z.object({
  id: z.string(),
  teamId: z.string(),
  email: z.string().email(),
  role: TeamMemberRoleSchema,
  status: InvitationStatusSchema,
  invitedBy: z.string(),
  invitedAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
  respondedAt: z.coerce.date().optional(),
  token: z.string().optional(),
});

export type TeamInvitation = z.infer<typeof TeamInvitationSchema>;
export const TeamInvitationListSchema = z.array(TeamInvitationSchema);

// ============================================================================
// Team Settings
// ============================================================================

export const TeamSettingsSchema = z.object({
  allowMemberInvites: z.boolean().default(false),
  requireApprovalForJoin: z.boolean().default(true),
  defaultMemberRole: TeamMemberRoleSchema.default('member'),
  maxMembers: z.number().positive().optional(),
  enableNotifications: z.boolean().default(true),
  enableThreads: z.boolean().default(true),
});

export type TeamSettings = z.infer<typeof TeamSettingsSchema>;

// ============================================================================
// Team
// ============================================================================

export const TeamSchema = BaseEntitySchema.extend({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  visibility: TeamVisibilitySchema.default('private'),
  avatar: z.string().url().optional(),
  color: z.string().optional(),
  members: TeamMemberListSchema.default([]),
  memberCount: z.number().default(0),
  settings: TeamSettingsSchema.default({}),
  parentTeamId: z.string().optional(), // For nested teams
  childTeamIds: z.array(z.string()).default([]),
});

export type Team = z.infer<typeof TeamSchema>;
export const TeamListSchema = z.array(TeamSchema);

// ============================================================================
// Create/Update Schemas
// ============================================================================

export const CreateTeamSchema = TeamSchema.omit({
  id: true,
  tenantId: true,
  createdAt: true,
  updatedAt: true,
  createdBy: true,
  updatedBy: true,
  members: true,
  memberCount: true,
  childTeamIds: true,
});

export type CreateTeamData = z.infer<typeof CreateTeamSchema>;

export const UpdateTeamSchema = CreateTeamSchema.partial();
export type UpdateTeamData = z.infer<typeof UpdateTeamSchema>;

export const AddTeamMemberSchema = z.object({
  userId: z.string(),
  role: TeamMemberRoleSchema.default('member'),
});

export type AddTeamMemberData = z.infer<typeof AddTeamMemberSchema>;

export const UpdateTeamMemberSchema = z.object({
  role: TeamMemberRoleSchema,
});

export type UpdateTeamMemberData = z.infer<typeof UpdateTeamMemberSchema>;

export const InviteTeamMembersSchema = z.object({
  emails: z.array(z.string().email()).min(1),
  role: TeamMemberRoleSchema.default('member'),
  message: z.string().optional(),
});

export type InviteTeamMembersData = z.infer<typeof InviteTeamMembersSchema>;

// ============================================================================
// Team Filters
// ============================================================================

export const TeamFiltersSchema = z.object({
  search: z.string().optional(),
  visibility: TeamVisibilitySchema.optional(),
  memberId: z.string().optional(),
  parentTeamId: z.string().optional(),
  hasParent: z.boolean().optional(),
});

export type TeamFilters = z.infer<typeof TeamFiltersSchema>;

// ============================================================================
// Team Statistics
// ============================================================================

export const TeamStatsSchema = z.object({
  total: z.number(),
  totalMembers: z.number(),
  publicTeams: z.number(),
  privateTeams: z.number(),
  myTeams: z.number().optional(),
  activeToday: z.number().optional(),
});

export type TeamStats = z.infer<typeof TeamStatsSchema>;
