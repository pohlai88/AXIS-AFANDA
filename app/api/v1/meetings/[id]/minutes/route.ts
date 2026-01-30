/**
 * Meeting Minutes API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { getAuthUser } from '@/app/lib/middleware/nextjs-auth';
import { NotFoundError } from '@/app/lib/validation/errors';
import { createErrorResponse, validateRequestBody } from '@/app/lib/validation/nextjs-errors';
import { z } from 'zod';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const completeMeetingMinutesSchema = z.object({
  attendance: z.array(z.string()),
  discussedItems: z.array(z.string()),
  decisions: z.array(z.string()),
  blockers: z.array(z.string()).optional(),
  outcome: z.string(),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const { id: meetingId } = await context.params;
    const validated = await validateRequestBody(request, completeMeetingMinutesSchema);

    // Check meeting exists
    const [existing] = await db
      .select()
      .from(schema.meetings)
      .where(
        and(
          eq(schema.meetings.id, meetingId),
          eq(schema.meetings.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundError('Meeting', meetingId);
    }

    // Update meeting with minutes
    const [updated] = await db
      .update(schema.meetings)
      .set({
        minutesCompleted: true,
        minutesData: {
          discussion: validated.discussedItems.join(', '),
          decisions: validated.decisions,
          actionItems: [],
          completedAt: new Date().toISOString(),
          completedBy: user.id,
        },
        status: 'completed',
        actualEnd: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.meetings.id, meetingId))
      .returning();

    // Create case event
    await db.insert(schema.caseEvents).values({
      id: createId(),
      caseId: existing.caseId,
      tenantId,
      type: 'note',
      timestamp: new Date(),
      source: 'consultation',
      sourceId: meetingId,
      description: 'Meeting minutes completed',
      userId: user.id,
      metadata: validated,
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    return createErrorResponse(error);
  }
}
