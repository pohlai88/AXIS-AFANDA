/**
 * Case Trails API Route
 * Tracks consultation cases with linked meetings and events
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and, desc } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { NotFoundError } from '@/app/lib/validation/errors';
import { createErrorResponse } from '@/app/lib/validation/nextjs-errors';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const { id: caseId } = await context.params;

    // Get case trail
    const [caseData] = await db
      .select()
      .from(schema.caseTrails)
      .where(
        and(
          eq(schema.caseTrails.id, caseId),
          eq(schema.caseTrails.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!caseData) {
      throw new NotFoundError('Case', caseId);
    }

    // Get all events for this case
    const events = await db
      .select()
      .from(schema.caseEvents)
      .where(eq(schema.caseEvents.caseId, caseId))
      .orderBy(desc(schema.caseEvents.timestamp));

    return NextResponse.json({
      data: {
        case: caseData,
        events,
      },
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
