/**
 * Single Task API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { NotFoundError } from '@/app/lib/validation/errors';
import { createErrorResponse, validateRequestBody } from '@/app/lib/validation/nextjs-errors';
import { z } from 'zod';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// ============================================================================
// Validation Schemas
// ============================================================================

const taskStatusSchema = z.enum(['todo', 'in_progress', 'completed', 'cancelled']);
const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);
const taskSourceSchema = z.enum(['manual', 'approval', 'omnichannel', 'consultation', 'whiteboard', 'magic_todo']);

const updateTaskSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assignedTo: z.string().optional(),
  assignedToName: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedHours: z.number().optional(),
  source: taskSourceSchema.optional(),
  sourceId: z.string().optional(),
  tags: z.array(z.string()).optional(),
  subtasks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean(),
  })).optional(),
});

// ============================================================================
// GET /api/v1/tasks/[id] - Get task by ID
// ============================================================================

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const { id } = await context.params;

    const [task] = await db
      .select()
      .from(schema.tasks)
      .where(
        and(
          eq(schema.tasks.id, id),
          eq(schema.tasks.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!task) {
      throw new NotFoundError('Task', id);
    }

    return NextResponse.json({ data: task });
  } catch (error) {
    return createErrorResponse(error);
  }
}

// ============================================================================
// PATCH /api/v1/tasks/[id] - Update task
// ============================================================================

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const { id } = await context.params;
    const updates = await validateRequestBody(request, updateTaskSchema);

    // Check task exists
    const [existing] = await db
      .select()
      .from(schema.tasks)
      .where(
        and(
          eq(schema.tasks.id, id),
          eq(schema.tasks.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundError('Task', id);
    }

    // Handle completedAt when status changes to completed
    const completedAt = updates.status === 'completed' && existing.status !== 'completed'
      ? new Date()
      : existing.completedAt;

    const [task] = await db
      .update(schema.tasks)
      .set({
        ...updates,
        completedAt,
        dueDate: updates.dueDate ? new Date(updates.dueDate) : existing.dueDate,
        updatedAt: new Date(),
      })
      .where(eq(schema.tasks.id, id))
      .returning();

    return NextResponse.json({ data: task });
  } catch (error) {
    return createErrorResponse(error);
  }
}

// ============================================================================
// DELETE /api/v1/tasks/[id] - Delete task
// ============================================================================

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const { id } = await context.params;

    // Check task exists
    const [existing] = await db
      .select()
      .from(schema.tasks)
      .where(
        and(
          eq(schema.tasks.id, id),
          eq(schema.tasks.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundError('Task', id);
    }

    await db
      .delete(schema.tasks)
      .where(eq(schema.tasks.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
