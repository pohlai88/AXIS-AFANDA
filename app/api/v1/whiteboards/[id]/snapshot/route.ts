/**
 * Whiteboard Snapshot API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { getAuthUser } from '@/app/lib/middleware/nextjs-auth';
import { NotFoundError } from '@/app/lib/validation/errors';
import { createErrorResponse, validateRequestBody } from '@/app/lib/validation/nextjs-errors';
import { z } from 'zod';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const snapshotSchema = z.object({
  snapshot: z.string(), // Base64 encoded image
  tldrawData: z.record(z.string(), z.any()),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const tenantId = getTenantId(request);
    const user = getAuthUser(request);
    const { id } = await context.params;
    const { snapshot, tldrawData } = await validateRequestBody(request, snapshotSchema);

    // Check whiteboard exists and user can edit
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

    // Update whiteboard with snapshot
    const [whiteboard] = await db
      .update(schema.whiteboards)
      .set({
        snapshot,
        tldrawData,
        lastEditedBy: user.id,
        lastEditedByName: user.name,
        lastEditedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(schema.whiteboards.id, id))
      .returning();

    // Create version history entry
    const versionNumber = `v${Date.now()}`;
    await db.insert(schema.whiteboardVersions).values({
      whiteboardId: id,
      versionNumber,
      snapshot,
      tldrawData,
      createdBy: user.id,
      createdByName: user.name,
    });

    return NextResponse.json({ data: whiteboard });
  } catch (error) {
    return createErrorResponse(error);
  }
}
