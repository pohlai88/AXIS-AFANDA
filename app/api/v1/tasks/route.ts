/**
 * Tasks API Route (Next.js)
 * Converted from Hono to Next.js API routes
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and, desc, sql } from 'drizzle-orm';
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

const taskStatusSchema = z.enum(['todo', 'in_progress', 'completed', 'cancelled']);
const taskPrioritySchema = z.enum(['low', 'medium', 'high', 'urgent']);
const taskSourceSchema = z.enum(['manual', 'approval', 'omnichannel', 'consultation', 'whiteboard', 'magic_todo']);

const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  status: taskStatusSchema.default('todo'),
  priority: taskPrioritySchema.default('medium'),
  assignedTo: z.string().optional(),
  assignedToName: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedHours: z.number().optional(),
  source: taskSourceSchema.default('manual'),
  sourceId: z.string().optional(),
  tags: z.array(z.string()).default([]),
  subtasks: z.array(z.object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean().default(false),
  })).default([]),
});

const taskFiltersSchema = z.object({
  status: taskStatusSchema.optional(),
  priority: taskPrioritySchema.optional(),
  assignedTo: z.string().optional(),
  source: taskSourceSchema.optional(),
  search: z.string().optional(),
});

// ============================================================================
// GET /api/v1/tasks - List tasks
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const queryParams = validateQueryParams(
      request,
      paginationSchema.merge(taskFiltersSchema)
    );

    const { page, limit, status, priority, assignedTo, source, search } = queryParams;

    // Build where conditions
    const conditions = [eq(schema.tasks.tenantId, tenantId)];

    if (status) {
      conditions.push(eq(schema.tasks.status, status));
    }
    if (priority) {
      conditions.push(eq(schema.tasks.priority, priority));
    }
    if (assignedTo) {
      conditions.push(eq(schema.tasks.assignedTo, assignedTo));
    }
    if (source) {
      conditions.push(eq(schema.tasks.source, source));
    }
    if (search) {
      conditions.push(
        sql`(${schema.tasks.title} ILIKE ${'%' + search + '%'} OR ${schema.tasks.description} ILIKE ${'%' + search + '%'})`
      );
    }

    const whereClause = and(...conditions);

    // Parallel query execution for data + count
    const { data, total } = await queryWithCount(
      async ({ limit, offset }) =>
        db
          .select()
          .from(schema.tasks)
          .where(whereClause)
          .orderBy(desc(schema.tasks.createdAt))
          .limit(limit)
          .offset(offset),
      async () => {
        const [{ count }] = await db
          .select({ count: createCountQuery() })
          .from(schema.tasks)
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
// POST /api/v1/tasks - Create task
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const data = await validateRequestBody(request, createTaskSchema);

    const [task] = await db
      .insert(schema.tasks)
      .values({
        ...data,
        tenantId,
        createdBy: user.id,
        createdByName: user.name,
        dueDate: data.dueDate ? new Date(data.dueDate) : null,
      })
      .returning();

    return NextResponse.json({ data: task }, { status: 201 });
  } catch (error) {
    return createErrorResponse(error);
  }
}
