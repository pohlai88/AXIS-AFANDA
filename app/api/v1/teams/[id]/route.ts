/**
 * Single Team API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and, sql } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { NotFoundError } from '@/app/lib/validation/errors';
import { createErrorResponse, validateRequestBody } from '@/app/lib/validation/nextjs-errors';
import { z } from 'zod';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const updateTeamSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  avatar: z.string().url().optional(),
  visibility: z.enum(['public', 'private', 'secret']).optional(),
  allowMemberInvite: z.boolean().optional(),
  allowMemberRemoval: z.boolean().optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const { id } = await context.params;

    const [team] = await db
      .select()
      .from(schema.teams)
      .where(
        and(
          eq(schema.teams.id, id),
          eq(schema.teams.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!team) {
      throw new NotFoundError('Team', id);
    }

    // Get member count
    const [{ count }] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(schema.teamMembers)
      .where(eq(schema.teamMembers.teamId, id));

    return NextResponse.json({
      data: {
        ...team,
        memberCount: count,
      },
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const { id } = await context.params;
    const updates = await validateRequestBody(request, updateTeamSchema);

    // Check team exists
    const [existing] = await db
      .select()
      .from(schema.teams)
      .where(
        and(
          eq(schema.teams.id, id),
          eq(schema.teams.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundError('Team', id);
    }

    const [team] = await db
      .update(schema.teams)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(eq(schema.teams.id, id))
      .returning();

    return NextResponse.json({ data: team });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const { id } = await context.params;

    // Check team exists
    const [existing] = await db
      .select()
      .from(schema.teams)
      .where(
        and(
          eq(schema.teams.id, id),
          eq(schema.teams.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundError('Team', id);
    }

    // Delete team (members will cascade delete)
    await db
      .delete(schema.teams)
      .where(eq(schema.teams.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
