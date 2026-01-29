import { Hono } from 'hono';
import { z } from 'zod';
import { db } from '../db/client';
import { meetings, magicTodos, caseTrails, caseEvents } from '../db/schema-meetings';
import { eq, and, desc } from 'drizzle-orm';
import { createId } from '@paralleldrive/cuid2';
import { errorHandler } from '../lib/errors';

const app = new Hono();

// Validation schemas
const createMeetingSchema = z.object({
  tenantId: z.string(),
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
  // Agenda items (will be reused in minutes)
  agendaItems: z.array(z.string()),
});

const completeMeetingMinutesSchema = z.object({
  meetingId: z.string(),
  attendance: z.array(z.string()),
  discussedItems: z.array(z.string()), // Reused from agenda!
  decisions: z.array(z.string()),
  blockers: z.array(z.string()).optional(),
  outcome: z.string(),
});

const createMagicTodoSchema = z.object({
  meetingId: z.string(),
  caseId: z.string(),
  title: z.string(),
  type: z.enum(['self', 'assigned', 'department', 'approval']),
  assignedTo: z.string().optional(),
  assignedToDepartment: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  dueDate: z.string(),
});

// ============================================================================
// POST /meetings - Create meeting
// ============================================================================
app.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const validated = createMeetingSchema.parse(body);

    // Create case trail
    const caseId = `CASE-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

    await db.insert(caseTrails).values({
      id: caseId,
      tenantId: validated.tenantId,
      title: validated.title,
      status: 'open',
      participantIds: validated.participantIds,
      linkedMeetingIds: [],
    });

    // Create meeting
    const meetingId = createId();
    const meeting = await db.insert(meetings).values({
      id: meetingId,
      caseId,
      tenantId: validated.tenantId,
      title: validated.title,
      type: validated.type,
      scheduledStart: new Date(validated.scheduledStart),
      scheduledEnd: new Date(validated.scheduledEnd),
      duration: validated.duration,
      organizerId: 'user-1', // TODO: Get from auth
      participantIds: validated.participantIds,
      locationType: validated.type === 'video' ? 'jitsi' : validated.type,
      locationDetails: validated.locationDetails,
      status: 'scheduled',
      minutesCompleted: false,
    }).returning();

    // Create initial case event
    await db.insert(caseEvents).values({
      id: createId(),
      caseId,
      tenantId: validated.tenantId,
      type: 'meeting',
      timestamp: new Date(),
      source: 'consultation',
      sourceId: meetingId,
      description: `Meeting scheduled: ${validated.title}`,
      userId: 'user-1',
      metadata: {
        agendaItems: validated.agendaItems,
      },
    });

    return c.json({ data: meeting[0] });
  } catch (error) {
    return errorHandler(error as Error, c);
  }
});

// ============================================================================
// POST /meetings/:id/minutes - Complete meeting minutes
// ============================================================================
app.post('/:id/minutes', async (c) => {
  try {
    const meetingId = c.req.param('id');
    const body = await c.req.json();
    const validated = completeMeetingMinutesSchema.parse(body);

    // Update meeting with minutes
    const updated = await db
      .update(meetings)
      .set({
        minutesCompleted: true,
        minutesData: {
          discussion: validated.discussedItems.join(', '),
          decisions: validated.decisions,
          actionItems: [], // Will be filled by MagicToDo
          completedAt: new Date().toISOString(),
          completedBy: 'user-1',
        },
        status: 'completed',
        actualEnd: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(meetings.id, meetingId))
      .returning();

    if (!updated[0]) {
      return c.json({ error: 'Meeting not found' }, 404);
    }

    // Create case event
    await db.insert(caseEvents).values({
      id: createId(),
      caseId: updated[0].caseId,
      tenantId: updated[0].tenantId,
      type: 'note',
      timestamp: new Date(),
      source: 'consultation',
      sourceId: meetingId,
      description: 'Meeting minutes completed',
      userId: 'user-1',
      metadata: validated,
    });

    return c.json({ data: updated[0] });
  } catch (error) {
    return errorHandler(error as Error, c);
  }
});

// ============================================================================
// POST /meetings/:id/todos - Create MagicToDo
// ============================================================================
app.post('/:id/todos', async (c) => {
  try {
    const meetingId = c.req.param('id');
    const body = await c.req.json();
    const validated = createMagicTodoSchema.parse(body);

    const todoId = createId();
    const todo = await db.insert(magicTodos).values({
      id: todoId,
      caseId: validated.caseId,
      meetingId: validated.meetingId,
      tenantId: 'tenant-1', // TODO: Get from auth
      title: validated.title,
      type: validated.type,
      assignedTo: validated.assignedTo,
      assignedToDepartment: validated.assignedToDepartment,
      createdBy: 'user-1',
      priority: validated.priority,
      dueDate: new Date(validated.dueDate),
      status: 'not-started',
      watcherIds: [],
    }).returning();

    // Create case event
    await db.insert(caseEvents).values({
      id: createId(),
      caseId: validated.caseId,
      tenantId: 'tenant-1',
      type: 'task',
      timestamp: new Date(),
      source: 'consultation',
      sourceId: todoId,
      description: `Task created: ${validated.title}`,
      userId: 'user-1',
      metadata: validated,
    });

    return c.json({ data: todo[0] });
  } catch (error) {
    return errorHandler(error as Error, c);
  }
});

// ============================================================================
// GET /meetings - List meetings
// ============================================================================
app.get('/', async (c) => {
  try {
    const tenantId = c.req.query('tenantId') || 'tenant-1';
    const status = c.req.query('status');

    const conditions = [eq(meetings.tenantId, tenantId)];

    if (status) {
      conditions.push(eq(meetings.status, status as any));
    }

    const result = await db
      .select()
      .from(meetings)
      .where(and(...conditions))
      .orderBy(desc(meetings.scheduledStart));

    return c.json({ data: result });
  } catch (error) {
    return errorHandler(error as Error, c);
  }
});

// ============================================================================
// GET /meetings/:id - Get meeting details
// ============================================================================
app.get('/:id', async (c) => {
  try {
    const meetingId = c.req.param('id');
    const meeting = await db.select().from(meetings).where(eq(meetings.id, meetingId));

    if (!meeting[0]) {
      return c.json({ error: 'Meeting not found' }, 404);
    }

    return c.json({ data: meeting[0] });
  } catch (error) {
    return errorHandler(error as Error, c);
  }
});

// ============================================================================
// GET /cases/:id - Get case trail
// ============================================================================
app.get('/cases/:id', async (c) => {
  try {
    const caseId = c.req.param('id');

    const caseData = await db.select().from(caseTrails).where(eq(caseTrails.id, caseId));

    if (!caseData[0]) {
      return c.json({ error: 'Case not found' }, 404);
    }

    // Get all events for this case
    const events = await db
      .select()
      .from(caseEvents)
      .where(eq(caseEvents.caseId, caseId))
      .orderBy(desc(caseEvents.timestamp));

    return c.json({
      data: {
        case: caseData[0],
        events,
      },
    });
  } catch (error) {
    return errorHandler(error as Error, c);
  }
});

export default app;
