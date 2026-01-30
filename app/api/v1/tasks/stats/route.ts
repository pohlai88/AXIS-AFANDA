/**
 * Tasks Stats API Route
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

// ============================================================================
// GET /api/v1/tasks/stats - Get task statistics
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);

    // Run all count queries in parallel for better performance
    const [
      [todoCount],
      [inProgressCount],
      [completedCount],
      [overdueCount],
      [todayCount],
    ] = await Promise.all([
      db
        .select({ count: createCountQuery() })
        .from(schema.tasks)
        .where(
          and(
            eq(schema.tasks.tenantId, tenantId),
            eq(schema.tasks.status, 'todo')
          )
        ),
      db
        .select({ count: createCountQuery() })
        .from(schema.tasks)
        .where(
          and(
            eq(schema.tasks.tenantId, tenantId),
            eq(schema.tasks.status, 'in_progress')
          )
        ),
      db
        .select({ count: createCountQuery() })
        .from(schema.tasks)
        .where(
          and(
            eq(schema.tasks.tenantId, tenantId),
            eq(schema.tasks.status, 'completed')
          )
        ),
      db
        .select({ count: createCountQuery() })
        .from(schema.tasks)
        .where(
          and(
            eq(schema.tasks.tenantId, tenantId),
            sql`${schema.tasks.status} != 'completed'`,
            sql`${schema.tasks.dueDate} < NOW()`
          )
        ),
      db
        .select({ count: createCountQuery() })
        .from(schema.tasks)
        .where(
          and(
            eq(schema.tasks.tenantId, tenantId),
            sql`DATE(${schema.tasks.createdAt}) = CURRENT_DATE`
          )
        ),
    ]);

    return jsonResponse(
      {
        data: {
          todo: todoCount.count,
          inProgress: inProgressCount.count,
          completed: completedCount.count,
          overdue: overdueCount.count,
          totalToday: todayCount.count,
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
