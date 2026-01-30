/**
 * Meetings Stats API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and, sql } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { createErrorResponse } from '@/app/lib/validation/nextjs-errors';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);

    // Run all count queries in parallel for better performance
    const [
      [scheduledCount],
      [inProgressCount],
      [completedCount],
      [minutesCompletedCount],
      [videoCount],
    ] = await Promise.all([
      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(schema.meetings)
        .where(
          and(
            eq(schema.meetings.tenantId, tenantId),
            eq(schema.meetings.status, 'scheduled')
          )
        ),
      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(schema.meetings)
        .where(
          and(
            eq(schema.meetings.tenantId, tenantId),
            eq(schema.meetings.status, 'in_progress')
          )
        ),
      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(schema.meetings)
        .where(
          and(
            eq(schema.meetings.tenantId, tenantId),
            eq(schema.meetings.status, 'completed')
          )
        ),
      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(schema.meetings)
        .where(
          and(
            eq(schema.meetings.tenantId, tenantId),
            eq(schema.meetings.minutesCompleted, true)
          )
        ),
      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(schema.meetings)
        .where(
          and(
            eq(schema.meetings.tenantId, tenantId),
            eq(schema.meetings.type, 'video')
          )
        ),
    ]);

    return NextResponse.json(
      {
        data: {
          scheduled: scheduledCount.count,
          inProgress: inProgressCount.count,
          completed: completedCount.count,
          minutesCompleted: minutesCompletedCount.count,
          video: videoCount.count,
        },
      },
      {
        headers: {
          'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
        },
      }
    );
  } catch (error) {
    return createErrorResponse(error);
  }
}
