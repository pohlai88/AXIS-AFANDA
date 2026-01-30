/**
 * Teams API Route (Next.js)
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and, desc, sql } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { getAuthUser } from '@/app/lib/middleware/nextjs-auth';
import { createErrorResponse, validateQueryParams, validateRequestBody } from '@/app/lib/validation/nextjs-errors';
import { paginationSchema } from '@/app/lib/validation/validation';
import { paginatedResponse, queryWithCount, createCountQuery } from '@/app/lib/api/route-helpers';
import { z } from 'zod';

// Next.js 16 Route Configuration
export const runtime = 'nodejs'; // Use nodejs for database operations
export const dynamic = 'force-dynamic'; // Always fetch fresh data

// ============================================================================
// Validation Schemas
// ============================================================================

const teamVisibilitySchema = z.enum(['public', 'private', 'secret']);

const createTeamSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  avatar: z.string().url().optional(),
  visibility: teamVisibilitySchema.default('private'),
  allowMemberInvite: z.boolean().default(false),
  allowMemberRemoval: z.boolean().default(false),
  tags: z.array(z.string()).default([]),
});

const updateTeamSchema = createTeamSchema.partial();

const teamFiltersSchema = z.object({
  visibility: teamVisibilitySchema.optional(),
  search: z.string().optional(),
});

// ============================================================================
// GET /api/v1/teams - List teams
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const queryParams = validateQueryParams(
      request,
      paginationSchema.merge(teamFiltersSchema)
    );

    const { page, limit, visibility, search } = queryParams;

    // Build where conditions
    const conditions = [eq(schema.teams.tenantId, tenantId)];

    if (visibility) {
      conditions.push(eq(schema.teams.visibility, visibility));
    }
    if (search) {
      conditions.push(
        sql`(${schema.teams.name} ILIKE ${'%' + search + '%'} OR ${schema.teams.description} ILIKE ${'%' + search + '%'})`
      );
    }

    const whereClause = and(...conditions);

    // Parallel query execution for data + count
    const { data, total } = await queryWithCount(
      async ({ limit, offset }) => {
        // Fetch teams with member counts using subquery (more efficient than N+1)
        const teams = await db
          .select({
            id: schema.teams.id,
            tenantId: schema.teams.tenantId,
            name: schema.teams.name,
            description: schema.teams.description,
            avatar: schema.teams.avatar,
            visibility: schema.teams.visibility,
            allowMemberInvite: schema.teams.allowMemberInvite,
            allowMemberRemoval: schema.teams.allowMemberRemoval,
            tags: schema.teams.tags,
            createdBy: schema.teams.createdBy,
            createdByName: schema.teams.createdByName,
            createdAt: schema.teams.createdAt,
            updatedAt: schema.teams.updatedAt,
            memberCount: sql<number>`(
              SELECT CAST(COUNT(*) AS INTEGER)
              FROM ${schema.teamMembers}
              WHERE ${schema.teamMembers.teamId} = ${schema.teams.id}
            )`.as('memberCount'),
          })
          .from(schema.teams)
          .where(whereClause)
          .orderBy(desc(schema.teams.createdAt))
          .limit(limit)
          .offset(offset);

        return teams;
      },
      async () => {
        const [{ count }] = await db
          .select({ count: createCountQuery() })
          .from(schema.teams)
          .where(whereClause);
        return count;
      },
      page,
      limit
    );

    return paginatedResponse(data, { page, limit, total });
  } catch (error) {
    return createErrorResponse(error);
  }
}

// ============================================================================
// POST /api/v1/teams - Create team
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const data = await validateRequestBody(request, createTeamSchema);

    // Create team
    const [team] = await db
      .insert(schema.teams)
      .values({
        ...data,
        tenantId,
        createdBy: user.id,
        createdByName: user.name,
      })
      .returning();

    // Add creator as owner
    await db.insert(schema.teamMembers).values({
      teamId: team.id,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      role: 'owner',
    });

    return NextResponse.json({ data: team }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
