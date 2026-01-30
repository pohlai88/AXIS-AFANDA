import { pgTable, text, timestamp, jsonb, boolean, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from './schema';
import { createId } from '@paralleldrive/cuid2';

// ============================================================================
// Enums
// ============================================================================

export const teamVisibilityEnum = pgEnum('team_visibility', ['public', 'private', 'secret']);
export const teamMemberRoleEnum = pgEnum('team_member_role', ['owner', 'admin', 'member', 'viewer']);

// ============================================================================
// Teams Table
// ============================================================================

export const teams = pgTable('teams', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Basic info
  name: text('name').notNull(),
  description: text('description'),
  avatar: text('avatar'),
  visibility: teamVisibilityEnum('visibility').notNull().default('private'),

  // Settings
  allowMemberInvite: boolean('allow_member_invite').notNull().default(false),
  allowMemberRemoval: boolean('allow_member_removal').notNull().default(false),

  // Metadata
  tags: jsonb('tags').$type<string[]>().default([]),
  metadata: jsonb('metadata'),
  createdBy: text('created_by').notNull(),
  createdByName: text('created_by_name'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  tenantIdx: index('teams_tenant_idx').on(table.tenantId),
  visibilityIdx: index('teams_visibility_idx').on(table.visibility),
}));

// ============================================================================
// Team Members Table
// ============================================================================

export const teamMembers = pgTable('team_members', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  teamId: text('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  userName: text('user_name'),
  userEmail: text('user_email'),
  role: teamMemberRoleEnum('role').notNull().default('member'),
  invitedBy: text('invited_by'),
  invitedByName: text('invited_by_name'),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  metadata: jsonb('metadata'),
}, (table) => ({
  teamIdx: index('team_members_team_idx').on(table.teamId),
  userIdx: index('team_members_user_idx').on(table.userId),
  teamUserIdx: index('team_members_team_user_idx').on(table.teamId, table.userId),
}));

// ============================================================================
// Team Invitations Table
// ============================================================================

export const teamInvitations = pgTable('team_invitations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  teamId: text('team_id').notNull().references(() => teams.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  role: teamMemberRoleEnum('role').notNull().default('member'),
  invitedBy: text('invited_by').notNull(),
  invitedByName: text('invited_by_name'),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  acceptedAt: timestamp('accepted_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  teamIdx: index('team_invitations_team_idx').on(table.teamId),
  emailIdx: index('team_invitations_email_idx').on(table.email),
  tokenIdx: index('team_invitations_token_idx').on(table.token),
}));

// ============================================================================
// Relations
// ============================================================================

export const teamsRelations = relations(teams, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [teams.tenantId],
    references: [tenants.id],
  }),
  members: many(teamMembers),
  invitations: many(teamInvitations),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const teamInvitationsRelations = relations(teamInvitations, ({ one }) => ({
  team: one(teams, {
    fields: [teamInvitations.teamId],
    references: [teams.id],
  }),
}));
