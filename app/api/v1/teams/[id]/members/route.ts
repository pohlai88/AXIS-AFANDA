/**
 * Team Members API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and, desc } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { getAuthUser } from '@/app/lib/middleware/nextjs-auth';
import { NotFoundError } from '@/app/lib/validation/errors';
import { createErrorResponse, validateRequestBody } from '@/app/lib/validation/nextjs-errors';
import { z } from 'zod';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const addMemberSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  userEmail: z.string().email(),
  role: z.enum(['owner', 'admin', 'member', 'viewer']).default('member'),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const { id: teamId } = await context.params;

    // Check team exists
    const [team] = await db
      .select()
      .from(schema.teams)
      .where(
        and(
          eq(schema.teams.id, teamId),
          eq(schema.teams.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!team) {
      throw new NotFoundError('Team', teamId);
    }

    // Get members
    const members = await db
      .select()
      .from(schema.teamMembers)
      .where(eq(schema.teamMembers.teamId, teamId))
      .orderBy(desc(schema.teamMembers.joinedAt));

    return NextResponse.json({ data: members });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const { id: teamId } = await context.params;
    const data = await validateRequestBody(request, addMemberSchema);

    // Check team exists
    const [team] = await db
      .select()
      .from(schema.teams)
      .where(
        and(
          eq(schema.teams.id, teamId),
          eq(schema.teams.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!team) {
      throw new NotFoundError('Team', teamId);
    }

    // Add member
    const [member] = await db
      .insert(schema.teamMembers)
      .values({
        teamId,
        ...data,
        invitedBy: user.id,
        invitedByName: user.name,
      })
      .returning();

    return NextResponse.json({ data: member }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
