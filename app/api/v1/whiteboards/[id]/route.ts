/**
 * Single Whiteboard API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and, or, sql } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { getAuthUser } from '@/app/lib/middleware/nextjs-auth';
import { NotFoundError } from '@/app/lib/validation/errors';
import { createErrorResponse, validateRequestBody } from '@/app/lib/validation/nextjs-errors';
import { z } from 'zod';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const updateWhiteboardSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  type: z.enum(['freeform', 'mindmap', 'flowchart', 'kanban']).optional(),
  visibility: z.enum(['private', 'team', 'public']).optional(),
  tldrawData: z.record(z.string(), z.any()).optional(),
  tags: z.array(z.string()).optional(),
});

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const { id } = await context.params;

    const [whiteboard] = await db
      .select()
      .from(schema.whiteboards)
      .where(
        and(
          eq(schema.whiteboards.id, id),
          eq(schema.whiteboards.tenantId, tenantId),
          or(
            eq(schema.whiteboards.ownerId, user.id),
            eq(schema.whiteboards.visibility, 'public'),
            sql`${schema.whiteboards.sharedWith} @> ${JSON.stringify([{ userId: user.id }])}`
          )!
        )
      )
      .limit(1);

    if (!whiteboard) {
      throw new NotFoundError('Whiteboard', id);
    }

    return NextResponse.json({ data: whiteboard });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const { id } = await context.params;
    const updates = await validateRequestBody(request, updateWhiteboardSchema);

    // Check whiteboard exists and user has edit access
    const [existing] = await db
      .select()
      .from(schema.whiteboards)
      .where(
        and(
          eq(schema.whiteboards.id, id),
          eq(schema.whiteboards.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundError('Whiteboard', id);
    }

    // Check if user can edit (owner or shared with edit permission)
    const canEdit =
      existing.ownerId === user.id ||
      (existing.sharedWith as any[])?.some(
        (share) => share.userId === user.id && share.canEdit
      );

    if (!canEdit) {
      return NextResponse.json(
        { error: { code: 'FORBIDDEN', message: 'No edit permission' } },
        { status: 403 }
      );
    }

    const [whiteboard] = await db
      .update(schema.whiteboards)
      .set({
        ...updates,
        lastEditedBy: user.id,
        lastEditedByName: user.name,
        lastEditedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.whiteboards.id, id))
      .returning();

    return NextResponse.json({ data: whiteboard });
  } catch (error) {
    return createErrorResponse(error);
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const { id } = await context.params;

    // Check whiteboard exists and user is owner
    const [existing] = await db
      .select()
      .from(schema.whiteboards)
      .where(
        and(
          eq(schema.whiteboards.id, id),
          eq(schema.whiteboards.tenantId, tenantId),
          eq(schema.whiteboards.ownerId, user.id)
        )
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundError('Whiteboard', id);
    }

    await db
      .delete(schema.whiteboards)
      .where(eq(schema.whiteboards.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    return createErrorResponse(error);
  }
}
