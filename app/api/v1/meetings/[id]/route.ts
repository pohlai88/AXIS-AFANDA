/**
 * Single Meeting API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and } from 'drizzle-orm';
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
    const { id: meetingId } = await context.params;

    const [meeting] = await db
      .select()
      .from(schema.meetings)
      .where(
        and(
          eq(schema.meetings.id, meetingId),
          eq(schema.meetings.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!meeting) {
      throw new NotFoundError('Meeting', meetingId);
    }

    return NextResponse.json({ data: meeting });
  } catch (error) {
    return createErrorResponse(error);
  }
}
