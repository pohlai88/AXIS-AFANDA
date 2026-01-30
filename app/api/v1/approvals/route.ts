/**
 * Approvals API Route (Next.js)
 * Migrated from orchestrator Hono routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and, desc, sql } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { getAuthUser } from '@/app/lib/middleware/nextjs-auth';
import { NotFoundError } from '@/app/lib/validation/errors';
import { createErrorResponse, validateQueryParams, validateRequestBody } from '@/app/lib/validation/nextjs-errors';
import { paginationSchema, approvalFiltersSchema, createApprovalSchema } from '@/app/lib/validation/validation';
import { paginatedResponse, queryWithCount, createCountQuery } from '@/app/lib/api/route-helpers';
import { APPROVAL_STATUS, HTTP_STATUS } from '@/app/lib/constants';

// Next.js 16 Route Configuration
export const runtime = 'nodejs'; // Use nodejs for database operations
export const dynamic = 'force-dynamic'; // Always fetch fresh data

// ============================================================================
// GET /api/v1/approvals - List approvals
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const queryParams = validateQueryParams(
      request,
      paginationSchema.merge(approvalFiltersSchema)
    );

    const { page, limit, status, type, conversationId } = queryParams;

    // Build where conditions
    const conditions = [eq(schema.approvals.tenantId, tenantId)];

    if (status) {
      conditions.push(eq(schema.approvals.status, status));
    }
    if (type) {
      conditions.push(eq(schema.approvals.type, type));
    }
    if (conversationId) {
      conditions.push(eq(schema.approvals.conversationId, conversationId));
    }

    const whereClause = and(...conditions);

    // Optimized: Run both queries in parallel
    const { data, total } = await queryWithCount(
      async ({ limit, offset }) =>
        db
          .select()
          .from(schema.approvals)
          .where(whereClause)
          .orderBy(desc(schema.approvals.createdAt))
          .limit(limit)
          .offset(offset),
      async () => {
        const [{ count }] = await db
          .select({ count: createCountQuery() })
          .from(schema.approvals)
          .where(whereClause);
        return count;
      },
      page,
      limit
    );

    return paginatedResponse(data, { page, limit, total }, { cache: 'no-store' });
  } catch (error) {
    return createErrorResponse(error);
  }
}

// ============================================================================
// POST /api/v1/approvals - Create approval
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const input = await validateRequestBody(request, createApprovalSchema);

    // Validate conversation exists if provided
    if (input.conversationId) {
      const [conversation] = await db
        .select()
        .from(schema.conversations)
        .where(
          and(
            eq(schema.conversations.id, input.conversationId),
            eq(schema.conversations.tenantId, tenantId)
          )
        )
        .limit(1);

      if (!conversation) {
        throw new NotFoundError('Conversation', input.conversationId);
      }
    }

    // Create approval
    const [approval] = await db
      .insert(schema.approvals)
      .values({
        tenantId,
        conversationId: input.conversationId,
        type: input.type,
        status: APPROVAL_STATUS.SUBMITTED,
        requestedBy: user.id,
        requestedByName: user.name,
        reason: input.reason,
        metadata: input.metadata,
        submittedAt: new Date(),
      })
      .returning();

    // Create activity log
    await db.insert(schema.activities).values({
      tenantId,
      userId: user.id,
      type: 'approval_created',
      source: 'orchestrator',
      title: `Approval request created`,
      description: `${user.name} created a ${input.type} approval request`,
      data: { approvalId: approval.id, type: input.type },
    });

    return NextResponse.json({ data: approval }, { status: HTTP_STATUS.CREATED });
  } catch (error) {
    return createErrorResponse(error);
  }
}
