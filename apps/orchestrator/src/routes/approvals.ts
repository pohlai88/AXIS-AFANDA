import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { db, schema } from '../db/client';
import { eq, and, desc, sql } from 'drizzle-orm';
import { getTenantId } from '../middleware/tenant';
import { getAuthUser } from '../middleware/auth';
import { NotFoundError, ValidationError } from '../lib/errors';
import {
  createApprovalSchema,
  updateApprovalSchema,
  approvalFiltersSchema,
  paginationSchema,
} from '../lib/validation';

export const approvalsRouter = new Hono();

// ============================================================================
// GET /approvals - List approvals
// ============================================================================
approvalsRouter.get(
  '/',
  zValidator('query', paginationSchema.merge(approvalFiltersSchema)),
  async (c) => {
    const tenantId = getTenantId(c);
    const { page, limit, status, type, conversationId } = c.req.valid('query');

    // Build where conditions
    const conditions = [eq(schema.approvals.tenantId, tenantId)];

    if (status) {
      conditions.push(eq(schema.approvals.status, status));
    }
    if (type) {
      conditions.push(eq(schema.approvals.type, type));
    }
    if (conversationId) {
      conditions.push(eq(schema.approvals.conversationId, conversationId));
    }

    // Fetch approvals with pagination
    const approvals = await db
      .select()
      .from(schema.approvals)
      .where(and(...conditions))
      .orderBy(desc(schema.approvals.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    // Count total for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`cast(count(*) as integer)` })
      .from(schema.approvals)
      .where(and(...conditions));

    return c.json({
      data: approvals,
      meta: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    });
  }
);

// ============================================================================
// GET /approvals/:id - Get approval by ID
// ============================================================================
approvalsRouter.get('/:id', async (c) => {
  const tenantId = getTenantId(c);
  const id = c.req.param('id');

  const [approval] = await db
    .select()
    .from(schema.approvals)
    .where(
      and(
        eq(schema.approvals.id, id),
        eq(schema.approvals.tenantId, tenantId)
      )
    )
    .limit(1);

  if (!approval) {
    throw new NotFoundError('Approval', id);
  }

  return c.json({ data: approval });
});

// ============================================================================
// POST /approvals - Create approval
// ============================================================================
approvalsRouter.post(
  '/',
  zValidator('json', createApprovalSchema),
  async (c) => {
    const tenantId = getTenantId(c);
    const user = getAuthUser(c);
    const input = c.req.valid('json');

    // Validate conversation exists if provided
    if (input.conversationId) {
      const [conversation] = await db
        .select()
        .from(schema.conversations)
        .where(
          and(
            eq(schema.conversations.id, input.conversationId),
            eq(schema.conversations.tenantId, tenantId)
          )
        )
        .limit(1);

      if (!conversation) {
        throw new NotFoundError('Conversation', input.conversationId);
      }
    }

    // Create approval
    const [approval] = await db
      .insert(schema.approvals)
      .values({
        tenantId,
        conversationId: input.conversationId,
        type: input.type,
        status: 'submitted',
        requestedBy: user.id,
        requestedByName: user.name,
        reason: input.reason,
        metadata: input.metadata,
        submittedAt: new Date(),
      })
      .returning();

    // Create activity log
    await db.insert(schema.activities).values({
      tenantId,
      userId: user.id,
      type: 'approval_created',
      source: 'orchestrator',
      title: `Approval request created`,
      description: `${user.name} created a ${input.type} approval request`,
      data: { approvalId: approval.id, type: input.type },
    });

    return c.json({ data: approval }, 201);
  }
);

// ============================================================================
// PATCH /approvals/:id - Update approval (approve/reject)
// ============================================================================
approvalsRouter.patch(
  '/:id',
  zValidator('json', updateApprovalSchema),
  async (c) => {
    const tenantId = getTenantId(c);
    const user = getAuthUser(c);
    const id = c.req.param('id');
    const input = c.req.valid('json');

    // Fetch existing approval
    const [existing] = await db
      .select()
      .from(schema.approvals)
      .where(
        and(
          eq(schema.approvals.id, id),
          eq(schema.approvals.tenantId, tenantId)
        )
      )
      .limit(1);

    if (!existing) {
      throw new NotFoundError('Approval', id);
    }

    // Validate status transition
    if (input.status) {
      if (existing.status === 'approved' || existing.status === 'rejected') {
        throw new ValidationError('Cannot modify an already processed approval');
      }
      if (existing.status !== 'submitted') {
        throw new ValidationError('Can only approve/reject submitted approvals');
      }
    }

    // Update approval
    const updateData: any = {
      ...input,
      updatedAt: new Date(),
    };

    if (input.status === 'approved') {
      updateData.approvedBy = user.id;
      updateData.approvedByName = user.name;
      updateData.approvedAt = new Date();
    } else if (input.status === 'rejected') {
      updateData.approvedBy = user.id;
      updateData.approvedByName = user.name;
      updateData.rejectedAt = new Date();
    }

    const [approval] = await db
      .update(schema.approvals)
      .set(updateData)
      .where(eq(schema.approvals.id, id))
      .returning();

    // Create activity log
    if (input.status) {
      await db.insert(schema.activities).values({
        tenantId,
        userId: user.id,
        type: `approval_${input.status}`,
        source: 'orchestrator',
        title: `Approval ${input.status}`,
        description: `${user.name} ${input.status} the approval request`,
        data: { approvalId: approval.id, decision: input.decision },
      });
    }

    return c.json({ data: approval });
  }
);

// ============================================================================
// DELETE /approvals/:id - Delete approval (only drafts)
// ============================================================================
approvalsRouter.delete('/:id', async (c) => {
  const tenantId = getTenantId(c);
  const id = c.req.param('id');

  const [existing] = await db
    .select()
    .from(schema.approvals)
    .where(
      and(
        eq(schema.approvals.id, id),
        eq(schema.approvals.tenantId, tenantId)
      )
    )
    .limit(1);

  if (!existing) {
    throw new NotFoundError('Approval', id);
  }

  if (existing.status !== 'draft') {
    throw new ValidationError('Can only delete draft approvals');
  }

  await db.delete(schema.approvals).where(eq(schema.approvals.id, id));

  return c.json({ message: 'Approval deleted successfully' });
});
