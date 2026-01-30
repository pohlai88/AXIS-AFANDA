/**
 * Whiteboards API Route (Next.js)
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and, desc, sql, or } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { getAuthUser } from '@/app/lib/middleware/nextjs-auth';
import { createErrorResponse, validateQueryParams, validateRequestBody } from '@/app/lib/validation/nextjs-errors';
import { paginationSchema } from '@/app/lib/validation/validation';
import { paginatedResponse, queryWithCount, createCountQuery } from '@/app/lib/api/route-helpers';
import { z } from 'zod';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ============================================================================
// Validation Schemas
// ============================================================================

const whiteboardVisibilitySchema = z.enum(['private', 'team', 'public']);
const whiteboardTypeSchema = z.enum(['freeform', 'mindmap', 'flowchart', 'kanban']);

const createWhiteboardSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  type: whiteboardTypeSchema.default('freeform'),
  visibility: whiteboardVisibilitySchema.default('private'),
  tldrawData: z.record(z.string(), z.any()).optional(),
  tags: z.array(z.string()).default([]),
  isTemplate: z.boolean().default(false),
  templateCategory: z.string().optional(),
});

const whiteboardFiltersSchema = z.object({
  visibility: whiteboardVisibilitySchema.optional(),
  type: whiteboardTypeSchema.optional(),
  isTemplate: z.coerce.boolean().optional(),
  ownerId: z.string().optional(),
  search: z.string().optional(),
});

// ============================================================================
// GET /api/v1/whiteboards - List whiteboards
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const queryParams = validateQueryParams(
      request,
      paginationSchema.merge(whiteboardFiltersSchema)
    );

    const { page, limit, visibility, type, isTemplate, ownerId, search } = queryParams;

    // Build where conditions
    const conditions = [eq(schema.whiteboards.tenantId, tenantId)];

    // User can see: own whiteboards + public + shared with them
    conditions.push(
      or(
        eq(schema.whiteboards.ownerId, user.id),
        eq(schema.whiteboards.visibility, 'public'),
        sql`${schema.whiteboards.sharedWith} @> ${JSON.stringify([{ userId: user.id }])}`
      )!
    );

    if (visibility) {
      conditions.push(eq(schema.whiteboards.visibility, visibility));
    }
    if (type) {
      conditions.push(eq(schema.whiteboards.type, type));
    }
    if (isTemplate !== undefined) {
      conditions.push(eq(schema.whiteboards.isTemplate, isTemplate));
    }
    if (ownerId) {
      conditions.push(eq(schema.whiteboards.ownerId, ownerId));
    }
    if (search) {
      conditions.push(
        sql`(${schema.whiteboards.name} ILIKE ${'%' + search + '%'} OR ${schema.whiteboards.description} ILIKE ${'%' + search + '%'})`
      );
    }

    const whereClause = and(...conditions);

    // Parallel query execution for data + count
    const { data, total } = await queryWithCount(
      async ({ limit, offset }) =>
        db
          .select()
          .from(schema.whiteboards)
          .where(whereClause)
          .orderBy(desc(schema.whiteboards.updatedAt))
          .limit(limit)
          .offset(offset),
      async () => {
        const [{ count }] = await db
          .select({ count: createCountQuery() })
          .from(schema.whiteboards)
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
// POST /api/v1/whiteboards - Create whiteboard
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const data = await validateRequestBody(request, createWhiteboardSchema);

    const [whiteboard] = await db
      .insert(schema.whiteboards)
      .values({
        ...data,
        tenantId,
        ownerId: user.id,
        ownerName: user.name,
      })
      .returning();

    return NextResponse.json({ data: whiteboard }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
