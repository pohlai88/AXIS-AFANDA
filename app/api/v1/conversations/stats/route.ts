/**
 * Conversations Stats API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and, sql } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { createErrorResponse } from '@/app/lib/validation/nextjs-errors';
import { jsonResponse, createCountQuery } from '@/app/lib/api/route-helpers';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);

    // Run all count queries in parallel for better performance
    const [
      [openCount],
      [pendingCount],
      [resolvedCount],
      [unreadCount],
      [highPriorityCount],
    ] = await Promise.all([
      db
        .select({ count: createCountQuery() })
        .from(schema.conversations)
        .where(
          and(
            eq(schema.conversations.tenantId, tenantId),
            eq(schema.conversations.status, 'open')
          )
        ),
      db
        .select({ count: createCountQuery() })
        .from(schema.conversations)
        .where(
          and(
            eq(schema.conversations.tenantId, tenantId),
            eq(schema.conversations.status, 'pending')
          )
        ),
      db
        .select({ count: createCountQuery() })
        .from(schema.conversations)
        .where(
          and(
            eq(schema.conversations.tenantId, tenantId),
            eq(schema.conversations.status, 'resolved')
          )
        ),
      db
        .select({ count: createCountQuery() })
        .from(schema.conversations)
        .where(
          and(
            eq(schema.conversations.tenantId, tenantId),
            sql`${schema.conversations.unreadCount} > 0`
          )
        ),
      db
        .select({ count: createCountQuery() })
        .from(schema.conversations)
        .where(
          and(
            eq(schema.conversations.tenantId, tenantId),
            eq(schema.conversations.priority, 'urgent')
          )
        ),
    ]);

    return jsonResponse(
      {
        data: {
          open: openCount.count,
          pending: pendingCount.count,
          resolved: resolvedCount.count,
          unread: unreadCount.count,
          highPriority: highPriorityCount.count,
        },
      },
      {
        cache: 'public, max-age=30, stale-while-revalidate=60',
      }
    );
  } catch (error) {
    return createErrorResponse(error);
  }
}
