/**
 * Meeting MagicToDo API Route
 * Creates tasks from meeting action items
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

const createMagicTodoSchema = z.object({
  caseId: z.string(),
  title: z.string(),
  type: z.enum(['self', 'assigned', 'department', 'approval']),
  assignedTo: z.string().optional(),
  assignedToDepartment: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string(),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const { id: meetingId } = await context.params;
    const validated = await validateRequestBody(request, createMagicTodoSchema);

    // Check meeting exists
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

    // Create MagicToDo
    const todoId = createId();
    const [todo] = await db.insert(schema.magicTodos).values({
      id: todoId,
      caseId: validated.caseId,
      meetingId,
      tenantId,
      title: validated.title,
      type: validated.type,
      assignedTo: validated.assignedTo,
      assignedToDepartment: validated.assignedToDepartment,
      createdBy: user.id,
      priority: validated.priority,
      dueDate: new Date(validated.dueDate),
      status: 'not-started',
      watcherIds: [],
    }).returning();

    // Create case event
    await db.insert(schema.caseEvents).values({
      id: createId(),
      caseId: validated.caseId,
      tenantId,
      type: 'task',
      timestamp: new Date(),
      source: 'consultation',
      sourceId: todoId,
      description: `Task created: ${validated.title}`,
      userId: user.id,
      metadata: validated,
    });

    return NextResponse.json({ data: todo }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
