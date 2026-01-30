/**
 * Tasks Bulk Operations API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and, inArray } from 'drizzle-orm';
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

const bulkUpdateSchema = z.object({
  taskIds: z.array(z.string()).min(1),
  updates: z.object({
    status: z.enum(['todo', 'in_progress', 'completed', 'cancelled']).optional(),
    priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
    assignedTo: z.string().optional(),
    tags: z.array(z.string()).optional(),
  }),
});

const bulkDeleteSchema = z.object({
  taskIds: z.array(z.string()).min(1),
});

// ============================================================================
// PATCH /api/v1/tasks/bulk - Bulk update tasks
// ============================================================================

export async function PATCH(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const { taskIds, updates } = await validateRequestBody(request, bulkUpdateSchema);

    // Verify all tasks exist and belong to tenant
    const existingTasks = await db
      .select()
      .from(schema.tasks)
      .where(
        and(
          inArray(schema.tasks.id, taskIds),
          eq(schema.tasks.tenantId, tenantId)
        )
      );

    if (existingTasks.length !== taskIds.length) {
      throw new NotFoundError('Some tasks not found');
    }

    // Update all tasks
    const updatedTasks = await db
      .update(schema.tasks)
      .set({
        ...updates,
        updatedAt: new Date(),
      })
      .where(inArray(schema.tasks.id, taskIds))
      .returning();

    return NextResponse.json({ data: updatedTasks });
  } catch (error) {
    return createErrorResponse(error);
  }
}

// ============================================================================
// DELETE /api/v1/tasks/bulk - Bulk delete tasks
// ============================================================================

export async function DELETE(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const { taskIds } = await validateRequestBody(request, bulkDeleteSchema);

    // Verify all tasks exist and belong to tenant
    const existingTasks = await db
      .select()
      .from(schema.tasks)
      .where(
        and(
          inArray(schema.tasks.id, taskIds),
          eq(schema.tasks.tenantId, tenantId)
        )
      );

    if (existingTasks.length !== taskIds.length) {
      throw new NotFoundError('Some tasks not found');
    }

    await db
      .delete(schema.tasks)
      .where(inArray(schema.tasks.id, taskIds));

    return NextResponse.json({
      success: true,
      deleted: taskIds.length
    });
  } catch (error) {
    return createErrorResponse(error);
  }
}
