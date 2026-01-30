import { pgTable, text, timestamp, jsonb, boolean, pgEnum, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from './schema';
import { createId } from '@paralleldrive/cuid2';

// ============================================================================
// Enums
// ============================================================================

export const whiteboardVisibilityEnum = pgEnum('whiteboard_visibility', ['private', 'team', 'public']);
export const whiteboardTypeEnum = pgEnum('whiteboard_type', ['freeform', 'mindmap', 'flowchart', 'kanban']);

// ============================================================================
// Whiteboards Table
// ============================================================================

export const whiteboards = pgTable('whiteboards', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tenantId: text('tenant_id').notNull().references(() => tenants.id, { onDelete: 'cascade' }),

  // Basic info
  name: text('name').notNull(),
  description: text('description'),
  type: whiteboardTypeEnum('type').notNull().default('freeform'),
  visibility: whiteboardVisibilityEnum('visibility').notNull().default('private'),

  // Content
  snapshot: text('snapshot'), // Base64 encoded image
  tldrawData: jsonb('tldraw_data').$type<Record<string, any>>(), // Full tldraw state

  // Ownership
  ownerId: text('owner_id').notNull(),
  ownerName: text('owner_name'),

  // Sharing
  sharedWith: jsonb('shared_with').$type<Array<{
    userId: string;
    userName?: string;
    canEdit: boolean;
  }>>().default([]),

  // Tags
  tags: jsonb('tags').$type<string[]>().default([]),

  // Template
  isTemplate: boolean('is_template').notNull().default(false),
  templateCategory: text('template_category'),

  // Metadata
  metadata: jsonb('metadata'),
  lastEditedBy: text('last_edited_by'),
  lastEditedByName: text('last_edited_by_name'),
  lastEditedAt: timestamp('last_edited_at'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  tenantIdx: index('whiteboards_tenant_idx').on(table.tenantId),
  ownerIdx: index('whiteboards_owner_idx').on(table.ownerId),
  visibilityIdx: index('whiteboards_visibility_idx').on(table.visibility),
  templateIdx: index('whiteboards_template_idx').on(table.isTemplate),
}));

// ============================================================================
// Whiteboard Comments Table
// ============================================================================

export const whiteboardComments = pgTable('whiteboard_comments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  whiteboardId: text('whiteboard_id').notNull().references(() => whiteboards.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull(),
  userName: text('user_name'),
  content: text('content').notNull(),

  // Position on canvas
  position: jsonb('position').$type<{
    x: number;
    y: number;
  }>(),

  // Thread
  parentId: text('parent_id'),
  resolved: boolean('resolved').notNull().default(false),
  resolvedBy: text('resolved_by'),
  resolvedAt: timestamp('resolved_at'),

  // Metadata
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => ({
  whiteboardIdx: index('whiteboard_comments_whiteboard_idx').on(table.whiteboardId),
  parentIdx: index('whiteboard_comments_parent_idx').on(table.parentId),
}));

// ============================================================================
// Whiteboard Versions Table (for history)
// ============================================================================

export const whiteboardVersions = pgTable('whiteboard_versions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  whiteboardId: text('whiteboard_id').notNull().references(() => whiteboards.id, { onDelete: 'cascade' }),
  versionNumber: text('version_number').notNull(),
  snapshot: text('snapshot'),
  tldrawData: jsonb('tldraw_data').$type<Record<string, any>>(),
  createdBy: text('created_by').notNull(),
  createdByName: text('created_by_name'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
}, (table) => ({
  whiteboardIdx: index('whiteboard_versions_whiteboard_idx').on(table.whiteboardId),
}));

// ============================================================================
// Relations
// ============================================================================

export const whiteboardsRelations = relations(whiteboards, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [whiteboards.tenantId],
    references: [tenants.id],
  }),
  comments: many(whiteboardComments),
  versions: many(whiteboardVersions),
}));

export const whiteboardCommentsRelations = relations(whiteboardComments, ({ one }) => ({
  whiteboard: one(whiteboards, {
    fields: [whiteboardComments.whiteboardId],
    references: [whiteboards.id],
  }),
}));

export const whiteboardVersionsRelations = relations(whiteboardVersions, ({ one }) => ({
  whiteboard: one(whiteboards, {
    fields: [whiteboardVersions.whiteboardId],
    references: [whiteboards.id],
  }),
}));
