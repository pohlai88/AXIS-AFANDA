/**
 * Conversations API Route (Next.js)
 * Migrated from orchestrator - full database-backed implementation
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and, like, or, sql } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { createErrorResponse, validateQueryParams } from '@/app/lib/validation/nextjs-errors';
import { paginationSchema, conversationFiltersSchema } from '@/app/lib/validation/validation';
import { paginatedResponse, queryWithCount, createCountQuery } from '@/app/lib/api/route-helpers';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ============================================================================
// GET /api/v1/conversations - List conversations with advanced filtering
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const queryParams = validateQueryParams(
      request,
      paginationSchema.merge(conversationFiltersSchema)
    );

    const {
      page,
      limit,
      status,
      priority,
      assigneeId,
      teamId,
      labels,
      search,
      hasEscalation,
      unreadOnly,
      dateFrom,
      dateTo,
      sortBy = 'lastMessage',
      sortOrder = 'desc',
    } = queryParams;

    // Build where conditions
    const conditions = [eq(schema.conversations.tenantId, tenantId)];

    if (status) {
      conditions.push(eq(schema.conversations.status, status));
    }
    if (priority) {
      conditions.push(eq(schema.conversations.priority, priority));
    }
    if (assigneeId) {
      conditions.push(eq(schema.conversations.assigneeId, assigneeId));
    }
    if (teamId) {
      conditions.push(eq(schema.conversations.teamId, teamId));
    }
    if (search) {
      conditions.push(
        or(
          like(schema.conversations.contactName, `%${search}%`),
          like(schema.conversations.contactEmail, `%${search}%`)
        )!
      );
    }
    if (unreadOnly) {
      conditions.push(sql`${schema.conversations.unreadCount} > 0`);
    }
    if (dateFrom) {
      conditions.push(sql`${schema.conversations.createdAt} >= ${dateFrom}`);
    }
    if (dateTo) {
      conditions.push(sql`${schema.conversations.createdAt} <= ${dateTo}`);
    }

    // Handle label filtering (JSONB contains)
    if (labels && labels.length > 0) {
      conditions.push(sql`${schema.conversations.labels} @> ${JSON.stringify(labels)}`);
    }

    const whereClause = and(...conditions);

    // Apply sorting
    const orderColumn = {
      lastMessage: schema.conversations.lastMessageAt,
      priority: schema.conversations.priority,
      created: schema.conversations.createdAt,
      unread: schema.conversations.unreadCount,
    }[sortBy];

    const orderFn = sortOrder === 'asc' ? sql`${orderColumn} ASC` : sql`${orderColumn} DESC`;

    // Parallel query execution for data + count
    const { data, total } = await queryWithCount(
      async ({ limit, offset }) => {
        // Handle escalation filter (join with approvals)
        if (hasEscalation) {
          return db
            .select({
              id: schema.conversations.id,
              tenantId: schema.conversations.tenantId,
              chatwootId: schema.conversations.chatwootId,
              chatwootAccountId: schema.conversations.chatwootAccountId,
              status: schema.conversations.status,
              priority: schema.conversations.priority,
              inboxId: schema.conversations.inboxId,
              contactId: schema.conversations.contactId,
              contactName: schema.conversations.contactName,
              contactEmail: schema.conversations.contactEmail,
              assigneeId: schema.conversations.assigneeId,
              assigneeName: schema.conversations.assigneeName,
              teamId: schema.conversations.teamId,
              teamName: schema.conversations.teamName,
              labels: schema.conversations.labels,
              customAttributes: schema.conversations.customAttributes,
              lastMessageAt: schema.conversations.lastMessageAt,
              unreadCount: schema.conversations.unreadCount,
              metadata: schema.conversations.metadata,
              createdAt: schema.conversations.createdAt,
              updatedAt: schema.conversations.updatedAt,
            })
            .from(schema.conversations)
            .innerJoin(
              schema.approvals,
              and(
                eq(schema.approvals.conversationId, schema.conversations.id),
                eq(schema.approvals.status, 'submitted')
              )
            )
            .where(whereClause)
            .orderBy(orderFn)
            .limit(limit)
            .offset(offset);
        }

        // Normal query without escalation filter
        return db
          .select()
          .from(schema.conversations)
          .where(whereClause)
          .orderBy(orderFn)
          .limit(limit)
          .offset(offset);
      },
      async () => {
        const [{ count }] = await db
          .select({ count: createCountQuery() })
          .from(schema.conversations)
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
