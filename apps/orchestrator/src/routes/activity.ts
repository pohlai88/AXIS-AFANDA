import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { streamSSE } from 'hono/streaming';
import { db, schema } from '../db/client';
import { eq, and, desc, gte } from 'drizzle-orm';
import { getTenantId } from '../middleware/tenant';
import {
  activityFiltersSchema,
  paginationSchema,
} from '../lib/validation';

export const activityRouter = new Hono();

// ============================================================================
// GET /activity - Get activity timeline (with SSE support)
// ============================================================================
activityRouter.get(
  '/',
  zValidator('query', paginationSchema.merge(activityFiltersSchema)),
  async (c) => {
    const tenantId = getTenantId(c);
    const { page, limit, type, source, userId, since } = c.req.valid('query');

    // Check if client wants SSE
    const acceptHeader = c.req.header('Accept');
    const wantsSSE = acceptHeader?.includes('text/event-stream');

    if (wantsSSE) {
      // Return SSE stream
      return streamSSE(c, async (stream) => {
        // Send heartbeat every 30 seconds
        const heartbeatInterval = setInterval(() => {
          stream.writeSSE({
            data: JSON.stringify({ type: 'heartbeat', timestamp: new Date().toISOString() }),
            event: 'heartbeat',
          });
        }, 30000);

        // Poll for new activities every 2 seconds
        let lastActivityId: string | null = null;

        const pollInterval = setInterval(async () => {
          try {
            const conditions = [eq(schema.activities.tenantId, tenantId)];

            if (lastActivityId) {
              // Fetch only newer activities
              const [lastActivity] = await db
                .select()
                .from(schema.activities)
                .where(eq(schema.activities.id, lastActivityId))
                .limit(1);

              if (lastActivity) {
                conditions.push(gte(schema.activities.createdAt, lastActivity.createdAt));
              }
            }

            if (type) {
              conditions.push(eq(schema.activities.type, type));
            }
            if (source) {
              conditions.push(eq(schema.activities.source, source));
            }
            if (userId) {
              conditions.push(eq(schema.activities.userId, userId));
            }

            const newActivities = await db
              .select()
              .from(schema.activities)
              .where(and(...conditions))
              .orderBy(desc(schema.activities.createdAt))
              .limit(10);

            // Send new activities
            for (const activity of newActivities) {
              if (activity.id !== lastActivityId) {
                await stream.writeSSE({
                  data: JSON.stringify(activity),
                  event: 'activity',
                  id: activity.id,
                });
                lastActivityId = activity.id;
              }
            }
          } catch (error) {
            console.error('Error polling activities:', error);
          }
        }, 2000);

        // Cleanup on disconnect
        stream.onAbort(() => {
          clearInterval(heartbeatInterval);
          clearInterval(pollInterval);
        });
      });
    }

    // Regular HTTP response
    const conditions = [eq(schema.activities.tenantId, tenantId)];

    if (type) {
      conditions.push(eq(schema.activities.type, type));
    }
    if (source) {
      conditions.push(eq(schema.activities.source, source));
    }
    if (userId) {
      conditions.push(eq(schema.activities.userId, userId));
    }
    if (since) {
      conditions.push(gte(schema.activities.createdAt, since));
    }

    const activities = await db
      .select()
      .from(schema.activities)
      .where(and(...conditions))
      .orderBy(desc(schema.activities.createdAt))
      .limit(limit)
      .offset((page - 1) * limit);

    const [{ count }] = await db
      .select({ count: schema.activities.id })
      .from(schema.activities)
      .where(and(...conditions));

    return c.json({
      data: activities,
      meta: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(Number(count) / limit),
      },
    });
  }
);

// ============================================================================
// GET /activity/:id - Get activity by ID
// ============================================================================
activityRouter.get('/:id', async (c) => {
  const tenantId = getTenantId(c);
  const id = c.req.param('id');

  const [activity] = await db
    .select()
    .from(schema.activities)
    .where(
      and(
        eq(schema.activities.id, id),
        eq(schema.activities.tenantId, tenantId)
      )
    )
    .limit(1);

  if (!activity) {
    return c.json({
      error: {
        code: 'NOT_FOUND',
        message: 'Activity not found',
      },
    }, 404);
  }

  return c.json({ data: activity });
});
