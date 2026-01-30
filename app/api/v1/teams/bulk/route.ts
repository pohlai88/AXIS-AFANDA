/**
 * Teams Bulk Operations API Route
 *
 * Note: Teams are self-managed; orgs remain Keycloak-managed.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { and, eq, inArray } from 'drizzle-orm';
import { z } from 'zod';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { getAuthUser } from '@/app/lib/middleware/nextjs-auth';
import { NotFoundError } from '@/app/lib/validation/errors';
import { createErrorResponse, validateRequestBody } from '@/app/lib/validation/nextjs-errors';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const roleSchema = z.enum(['owner', 'admin', 'member', 'viewer']);

const bulkInviteSchema = z.object({
  teamIds: z.array(z.string()).min(1),
  emails: z.array(z.string().email()).min(1),
  role: roleSchema.default('member'),
  message: z.string().optional(),
});

const bulkRemoveMembersSchema = z.object({
  teamIds: z.array(z.string()).min(1),
  userIds: z.array(z.string()).min(1),
});

const bulkDeleteTeamsSchema = z.object({
  teamIds: z.array(z.string()).min(1),
});

function mapInvitationStatus(inv: { acceptedAt: Date | null; expiresAt: Date }, now: Date) {
  if (inv.acceptedAt) return 'accepted' as const;
  if (inv.expiresAt.getTime() <= now.getTime()) return 'expired' as const;
  return 'pending' as const;
}

// ============================================================================
// POST /api/v1/teams/bulk - Bulk invite members (creates invitations)
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const { teamIds, emails, role } = await validateRequestBody(request, bulkInviteSchema);

    // Verify teams exist and belong to tenant
    const existingTeams = await db
      .select({ id: schema.teams.id })
      .from(schema.teams)
      .where(and(inArray(schema.teams.id, teamIds), eq(schema.teams.tenantId, tenantId)));

    if (existingTeams.length !== teamIds.length) {
      throw new NotFoundError('Some teams');
    }

    const now = new Date();
    const expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const rows = teamIds.flatMap((teamId) =>
      emails.map((email) => ({
        teamId,
        email,
        role,
        invitedBy: user.id,
        invitedByName: user.name,
        token: crypto.randomUUID(),
        expiresAt,
      }))
    );

    const inserted = await db.insert(schema.teamInvitations).values(rows).returning();

    // Map DB rows to API-friendly invitation objects (matches TeamInvitationSchema expectations)
    const invitations = inserted.map((inv) => ({
      id: inv.id,
      teamId: inv.teamId,
      email: inv.email,
      role: inv.role,
      status: mapInvitationStatus({ acceptedAt: inv.acceptedAt ?? null, expiresAt: inv.expiresAt }, now),
      invitedBy: inv.invitedBy,
      invitedAt: inv.createdAt,
      expiresAt: inv.expiresAt,
      respondedAt: inv.acceptedAt ?? undefined,
      token: inv.token,
    }));

    return NextResponse.json({
      success: true,
      invited: invitations.length,
      failed: 0,
      invitations,
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

// ============================================================================
// PATCH /api/v1/teams/bulk - Bulk remove members from teams
// ============================================================================

export async function PATCH(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const { teamIds, userIds } = await validateRequestBody(request, bulkRemoveMembersSchema);

    // Verify teams exist and belong to tenant
    const existingTeams = await db
      .select({ id: schema.teams.id })
      .from(schema.teams)
      .where(and(inArray(schema.teams.id, teamIds), eq(schema.teams.tenantId, tenantId)));

    if (existingTeams.length !== teamIds.length) {
      throw new NotFoundError('Some teams');
    }

    // Remove members by userId across selected teams
    await db
      .delete(schema.teamMembers)
      .where(and(inArray(schema.teamMembers.teamId, teamIds), inArray(schema.teamMembers.userId, userIds)));

    return NextResponse.json({ success: true, removed: userIds.length });
  } catch (error) {
    return createErrorResponse(error);
  }
}

// ============================================================================
// DELETE /api/v1/teams/bulk - Bulk delete teams
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const { teamIds } = await validateRequestBody(request, bulkDeleteTeamsSchema);

    const existingTeams = await db
      .select({ id: schema.teams.id })
      .from(schema.teams)
      .where(and(inArray(schema.teams.id, teamIds), eq(schema.teams.tenantId, tenantId)));

    if (existingTeams.length !== teamIds.length) {
      throw new NotFoundError('Some teams');
    }

    await db
      .delete(schema.teams)
      .where(and(inArray(schema.teams.id, teamIds), eq(schema.teams.tenantId, tenantId)));

    return NextResponse.json({ success: true, deleted: teamIds.length });
  } catch (error) {
    return createErrorResponse(error);
  }
}

