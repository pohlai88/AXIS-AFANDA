/**
 * Meetings API Route (Next.js)
 * Migrated from orchestrator - includes consultation rooms, case trails, and MagicToDo
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and, desc, sql } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { getAuthUser } from '@/app/lib/middleware/nextjs-auth';
import { createErrorResponse, validateQueryParams, validateRequestBody } from '@/app/lib/validation/nextjs-errors';
import { paginationSchema } from '@/app/lib/validation/validation';
import { paginatedResponse, queryWithCount, createCountQuery } from '@/app/lib/api/route-helpers';
import { z } from 'zod';

// Next.js 16 Route Configuration
export const runtime = 'nodejs'; // Use nodejs for database operations
export const dynamic = 'force-dynamic'; // Always fetch fresh data

// ============================================================================
// Validation Schemas
// ============================================================================

const createMeetingSchema = z.object({
  title: z.string(),
  type: z.enum(['video', 'physical', 'phone']),
  scheduledStart: z.string(),
  scheduledEnd: z.string(),
  duration: z.number(),
  participantIds: z.array(z.string()),
  locationDetails: z.object({
    jitsiRoomId: z.string().optional(),
    address: z.string().optional(),
    phoneNumber: z.string().optional(),
  }).optional(),
  agendaItems: z.array(z.string()),
});

const meetingFiltersSchema = z.object({
  status: z.enum(['scheduled', 'in_progress', 'completed', 'cancelled']).optional(),
});

// ============================================================================
// GET /api/v1/meetings - List meetings
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const queryParams = validateQueryParams(
      request,
      paginationSchema.merge(meetingFiltersSchema)
    );

    const { page, limit, status } = queryParams;

    const conditions = [eq(schema.meetings.tenantId, tenantId)];

    if (status) {
      conditions.push(eq(schema.meetings.status, status));
    }

    const whereClause = and(...conditions);

    // Parallel query execution for data + count
    const { data, total } = await queryWithCount(
      async ({ limit, offset }) =>
        db
          .select()
          .from(schema.meetings)
          .where(whereClause)
          .orderBy(desc(schema.meetings.scheduledStart))
          .limit(limit)
          .offset(offset),
      async () => {
        const [{ count }] = await db
          .select({ count: createCountQuery() })
          .from(schema.meetings)
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
// POST /api/v1/meetings - Create meeting with case trail
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const validated = await validateRequestBody(request, createMeetingSchema);

    // Create case trail
    const caseId = `CASE-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    await db.insert(schema.caseTrails).values({
      id: caseId,
      tenantId,
      title: validated.title,
      status: 'open',
      participantIds: validated.participantIds,
      linkedMeetingIds: [],
    });

    // Create meeting
    const meetingId = createId();
    const [meeting] = await db.insert(schema.meetings).values({
      id: meetingId,
      caseId,
      tenantId,
      title: validated.title,
      type: validated.type,
      scheduledStart: new Date(validated.scheduledStart),
      scheduledEnd: new Date(validated.scheduledEnd),
      duration: validated.duration,
      organizerId: user.id,
      participantIds: validated.participantIds,
      locationType: validated.type === 'video' ? 'jitsi' : validated.type,
      locationDetails: validated.locationDetails,
      status: 'scheduled',
      minutesCompleted: false,
    }).returning();

    // Create initial case event
    await db.insert(schema.caseEvents).values({
      id: createId(),
      caseId,
      tenantId,
      type: 'meeting',
      timestamp: new Date(),
      source: 'consultation',
      sourceId: meetingId,
      description: `Meeting scheduled: ${validated.title}`,
      userId: user.id,
      metadata: {
        agendaItems: validated.agendaItems,
      },
    });

    return NextResponse.json({ data: meeting }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
