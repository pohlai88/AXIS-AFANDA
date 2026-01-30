/**
 * Whiteboards Stats API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and, sql } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { getAuthUser } from '@/app/lib/middleware/nextjs-auth';
import { createErrorResponse } from '@/app/lib/validation/nextjs-errors';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);

    // Run all count queries in parallel for better performance
    const [
      [totalCount],
      [myCount],
      [sharedCount],
      [templateCount],
    ] = await Promise.all([
      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(schema.whiteboards)
        .where(
          and(
            eq(schema.whiteboards.tenantId, tenantId),
            sql`(
              ${schema.whiteboards.ownerId} = ${user.id} OR
              ${schema.whiteboards.visibility} = 'public' OR
              ${schema.whiteboards.sharedWith} @> ${JSON.stringify([{ userId: user.id }])}
            )`
          )
        ),
      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(schema.whiteboards)
        .where(
          and(
            eq(schema.whiteboards.tenantId, tenantId),
            eq(schema.whiteboards.ownerId, user.id)
          )
        ),
      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(schema.whiteboards)
        .where(
          and(
            eq(schema.whiteboards.tenantId, tenantId),
            sql`${schema.whiteboards.sharedWith} @> ${JSON.stringify([{ userId: user.id }])}`
          )
        ),
      db
        .select({ count: sql<number>`cast(count(*) as integer)` })
        .from(schema.whiteboards)
        .where(
          and(
            eq(schema.whiteboards.tenantId, tenantId),
            eq(schema.whiteboards.isTemplate, true)
          )
        ),
    ]);

    return NextResponse.json(
      {
        data: {
          total: totalCount.count,
          my: myCount.count,
          shared: sharedCount.count,
          templates: templateCount.count,
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
