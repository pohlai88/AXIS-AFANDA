---
name: Chatwoot Zammad Integration
overview: Implement omnichannel inbox, ticket management, and team collaboration features by integrating Chatwoot via API/webhooks while building a custom UI shell. Deploy on Vercel (frontend) + Neon (PostgreSQL) + Railway/Render (orchestrator) stack.
todos:
  - id: setup-orchestrator
    content: Create apps/orchestrator/ with Hono, Drizzle ORM, and project structure
    status: completed
  - id: database-schema
    content: Define Drizzle schema for tenants, conversations, messages, approvals, activities
    status: completed
  - id: core-api-endpoints
    content: Implement approvals, conversations, activity, and webhooks API routes
    status: completed
  - id: chatwoot-client
    content: Build Chatwoot API client service for conversation/message operations
    status: in_progress
  - id: webhook-handler
    content: Implement Chatwoot webhook handler with event processing and sync logic
    status: completed
  - id: inbox-ui
    content: Build inbox page with conversation list, filters, and search
    status: pending
  - id: conversation-detail-ui
    content: Build conversation detail page with message thread, reply box, and actions
    status: pending
  - id: sse-implementation
    content: Implement SSE endpoint in orchestrator and client in Shell for real-time updates
    status: completed
  - id: approval-workflow
    content: Build escalation flow, approval dashboard, and decision logging
    status: pending
  - id: deployment-setup
    content: Deploy Shell to Vercel, orchestrator to Railway, and configure Neon + Upstash
    status: pending
isProject: false
---

# Chatwoot & Zammad Feature Integration Plan

## 🎯 Key Decisions (Updated)

Based on your feedback and best practices:

1. **✅ Drizzle ORM** (not Prisma) - Better Neon integration, lighter, faster
2. **✅ Chatwoot Cloud** (not self-hosted) - No infrastructure overhead, faster MVP
3. **✅ shadcn Blocks Only** - Copy from `lib/ui/Blocks-shadcn/`, no hardcoded UI
4. **✅ Existing .env** - Update current file (already has Neon, Railway, Vercel)
5. **✅ Hono + TypeScript** - As specified in PROJECT-SPEC

---

## Architecture Decision

**Best Practice Approach: Hybrid Integration**

Based on your requirements and the "Clone + Integrate" philosophy from PROJECT-SPEC, we'll:

1. **Use Chatwoot as the backend engine** - Leverage its battle-tested omnichannel infrastructure, APIs, and webhook system
2. **Build custom UI in AXIS-AFENDA Shell** - Native Next.js components that feel cohesive with your design system
3. **Orchestrator as the glue** - Hono-based API service that syncs data, enforces tenant isolation, and manages approvals
4. **Deploy on modern serverless stack** - Vercel (Shell) + Neon (PostgreSQL) + Railway/Render (Orchestrator + Chatwoot)

This avoids rebuilding complex channel integrations (WhatsApp, Facebook, etc.) while maintaining UX cohesion.

---

## Tech Stack (Best Practice)

### Frontend (Shell)

- **Next.js 16** on Vercel
- Existing design system (shadcn/ui + Tailwind v4)
- Zustand for state management
- Zod for validation

### Backend (Orchestrator)

- **Hono** (TypeScript) - as specified in PROJECT-SPEC
- Deploy on Railway or Render (supports Node.js)
- Zod for API validation
- Better than Express (lighter, faster) and FastAPI (same language as frontend)

### Database

- **Neon PostgreSQL** (serverless, Vercel-optimized) - Already configured
- **Drizzle ORM** for type-safe queries (better Neon integration than Prisma)
- Separate databases: orchestrator DB + Chatwoot DB (if self-hosting)

### External Services

- **Chatwoot Cloud** (hosted service - fastest path, no infrastructure management)
  - Alternative: Self-host on Railway if needed later
  - Decision: Use Cloud for MVP, avoid infrastructure complexity
- **Keycloak** (for later - use mock tenants for MVP)
- **Upstash Redis** (serverless Redis for sessions and rate limiting)

### Real-time

- Server-Sent Events (SSE) from Orchestrator → Shell
- Chatwoot webhooks → Orchestrator → SSE → Shell

### UI Strategy (No Hardcoded Components)

**Principle**: Use shadcn blocks exclusively - no custom UI from scratch

**Available Blocks** (from `[lib/ui/Blocks-shadcn/](lib/ui/Blocks-shadcn/)`):

- **Layouts**: `sidebar-07`, `sidebar-10`, `sidebar-right` (responsive, collapsible)
- **Tables**: `data-table` (sorting, filtering, pagination, row selection)
- **Forms**: `validated-contact-form`, `simple-validated-form` (Zod validation)
- **Dialogs**: `dialog-demo`, `drawer-demo` (modals, sheets)
- **Commands**: `command-demo` (command palette, search)

**Copy + Adapt Pattern**:

1. Copy block from `lib/ui/Blocks-shadcn/` to `app/components/`
2. Adapt props and data structure
3. Integrate with API client and Zustand stores
4. No custom styling - use existing tokens from `app/globals.css`

**Reference**: See `[.dev-docs/AVAILABLE-BLOCKS-SUMMARY.md](.dev-docs/AVAILABLE-BLOCKS-SUMMARY.md)`

---

## 📦 shadcn Blocks Mapping (Quick Reference)


| Feature                 | Block to Copy                        | Adapt For                                 |
| ----------------------- | ------------------------------------ | ----------------------------------------- |
| **Inbox Layout**        | `sidebar-07.tsx` or `sidebar-10.tsx` | Main layout with filters sidebar          |
| **Conversation List**   | `data-table.tsx`                     | Table with sorting, filtering, pagination |
| **Conversation Detail** | `sidebar-right.tsx`                  | Message thread + contact info sidebar     |
| **Message Thread**      | `ScrollArea` + `Card`                | Chat-style message bubbles                |
| **Reply Box**           | `validated-contact-form.tsx`         | Textarea + file upload + send button      |
| **Filters**             | `Select` + `Switch` + `Badge`        | Status, assignee, label filters           |
| **Search**              | `search-form.tsx`                    | Debounced search input                    |
| **Approval List**       | `data-table.tsx`                     | Approval table with actions               |
| **Approval Actions**    | `dialog-demo.tsx` + `Button`         | Approve/reject dialogs                    |
| **Escalate Button**     | `Button` + `dialog-demo.tsx`         | Escalation confirmation modal             |


**All blocks available in**: `[lib/ui/Blocks-shadcn/](lib/ui/Blocks-shadcn/)`

---

## Implementation Phases

### Phase 1: Orchestrator Foundation (Week 1)

**Goal**: Build the Hono API service with database, authentication, and core endpoints.

#### 1.1 Project Setup

Create `apps/orchestrator/` with Hono:

```
apps/orchestrator/
├── src/
│   ├── index.ts              # Hono app entry
│   ├── routes/
│   │   ├── approvals.ts      # Approval endpoints
│   │   ├── activity.ts       # Activity timeline
│   │   ├── webhooks.ts       # Webhook handlers
│   │   └── conversations.ts  # Conversation proxy
│   ├── services/
│   │   ├── chatwoot.ts       # Chatwoot API client
│   │   ├── approvals.ts      # Approval logic
│   │   └── activity.ts       # Activity aggregation
│   ├── db/
│   │   ├── schema.ts         # Prisma schema
│   │   └── client.ts         # Prisma client
│   ├── middleware/
│   │   ├── auth.ts           # JWT validation
│   │   └── tenant.ts         # Tenant isolation
│   └── lib/
│       ├── validation.ts     # Zod schemas
│       └── errors.ts         # Error handling
├── drizzle/              # Generated migrations
├── drizzle.config.ts    # Drizzle configuration
├── package.json
└── tsconfig.json
```

**Key files**:

- `[apps/orchestrator/package.json](apps/orchestrator/package.json)` - Hono, Drizzle, Zod dependencies
- `[apps/orchestrator/src/index.ts](apps/orchestrator/src/index.ts)`` - Hono app with CORS, error handling
- `[apps/orchestrator/src/db/schema.ts](apps/orchestrator/src/db/schema.ts)` - Drizzle schema

#### 1.2 Database Schema

Drizzle schema for core entities (optimized for Neon):

```typescript
// apps/orchestrator/src/db/schema.ts
import { pgTable, text, integer, timestamp, jsonb, boolean, index } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

// Tenants (mirrored from Keycloak later)
export const tenants = pgTable('tenants', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  type: text('type').notNull(), // 'individual', 'team', 'org'
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Conversations (synced from Chatwoot)
export const conversations = pgTable('conversations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  chatwootId: integer('chatwoot_id').unique().notNull(),
  chatwootAccountId: integer('chatwoot_account_id').notNull(),
  status: text('status').notNull(), // 'open', 'resolved', 'pending'
  priority: text('priority'), // 'low', 'medium', 'high', 'urgent'
  inboxId: integer('inbox_id').notNull(),
  contactId: integer('contact_id').notNull(),
  assigneeId: integer('assignee_id'),
  teamId: integer('team_id'),
  labels: jsonb('labels'),
  customAttributes: jsonb('custom_attributes'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  tenantIdx: index('conversations_tenant_idx').on(table.tenantId),
  chatwootIdx: index('conversations_chatwoot_idx').on(table.chatwootId),
}));

// Messages (synced from Chatwoot)
export const messages = pgTable('messages', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  conversationId: text('conversation_id').notNull().references(() => conversations.id),
  chatwootId: integer('chatwoot_id').unique().notNull(),
  content: text('content').notNull(),
  messageType: text('message_type').notNull(), // 'incoming', 'outgoing'
  senderType: text('sender_type').notNull(), // 'contact', 'agent'
  senderId: integer('sender_id').notNull(),
  private: boolean('private').default(false).notNull(),
  attachments: jsonb('attachments'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  conversationIdx: index('messages_conversation_idx').on(table.conversationId),
}));

// Approvals (orchestrator-owned)
export const approvals = pgTable('approvals', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  conversationId: text('conversation_id').references(() => conversations.id),
  type: text('type').notNull(), // 'ceo_approval', 'escalation'
  status: text('status').notNull(), // 'draft', 'submitted', 'approved', 'rejected'
  requestedBy: text('requested_by').notNull(),
  approvedBy: text('approved_by'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
  approvedAt: timestamp('approved_at'),
}, (table) => ({
  tenantIdx: index('approvals_tenant_idx').on(table.tenantId),
  statusIdx: index('approvals_status_idx').on(table.status),
}));

// Activity Timeline (aggregated events)
export const activities = pgTable('activities', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  type: text('type').notNull(), // 'conversation_created', 'approval_created', etc.
  source: text('source').notNull(), // 'chatwoot', 'orchestrator'
  title: text('title').notNull(),
  data: jsonb('data').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  tenantTimeIdx: index('activities_tenant_time_idx').on(table.tenantId, table.createdAt),
}));
```

**Drizzle Configuration**:

```typescript
// apps/orchestrator/drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/db/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

#### 1.3 Core API Endpoints

**Approvals API** (`/api/v1/approvals`):

- `POST /api/v1/approvals` - Create approval request
- `GET /api/v1/approvals/:id` - Get approval details
- `PATCH /api/v1/approvals/:id` - Update status (approve/reject)
- `GET /api/v1/approvals` - List approvals (filtered by tenant)

**Activity API** (`/api/v1/activity`):

- `GET /api/v1/activity` - Get activity timeline (SSE endpoint)
- `GET /api/v1/activity/:id` - Get activity details

**Conversations API** (`/api/v1/conversations`):

- `GET /api/v1/conversations` - List conversations (proxy to Chatwoot)
- `GET /api/v1/conversations/:id` - Get conversation details
- `POST /api/v1/conversations/:id/messages` - Send message
- `PATCH /api/v1/conversations/:id` - Update conversation (status, assignee, etc.)
- `POST /api/v1/conversations/:id/escalate` - Create escalation approval

**Webhooks API** (`/api/v1/webhooks`):

- `POST /api/v1/webhooks/chatwoot` - Receive Chatwoot events

#### 1.4 Chatwoot API Client

Service to interact with Chatwoot API:

```typescript
// apps/orchestrator/src/services/chatwoot.ts
export class ChatwootClient {
  async getConversations(accountId: number, filters?: object)
  async getConversation(accountId: number, conversationId: number)
  async sendMessage(accountId: number, conversationId: number, content: string)
  async updateConversation(accountId: number, conversationId: number, updates: object)
  async assignConversation(accountId: number, conversationId: number, agentId: number)
  async addLabel(accountId: number, conversationId: number, labels: string[])
}
```

---

### Phase 2: Chatwoot Integration (Week 2)

**Goal**: Set up Chatwoot, configure webhooks, sync conversations to orchestrator.

#### 2.1 Chatwoot Strategy (Cloud vs Self-Hosted)

**Recommended: Chatwoot Cloud** (fastest, no infrastructure overhead)

**Why Cloud for MVP:**

- No infrastructure management (PostgreSQL, Redis, app server)
- Automatic updates and security patches
- Faster time to market
- Railway is ready for orchestrator only
- Cost: $19-99/month (vs $20-30/month self-hosted + maintenance time)

**Setup Steps:**

1. Sign up at [chatwoot.com](https://chatwoot.com)
2. Create account and get API access token (Profile Settings → Access Token)
3. Configure webhook URL: `https://your-orchestrator.railway.app/api/v1/webhooks/chatwoot`
4. Create inbox (Website, Email, or API channel)
5. Test API connection from orchestrator

**Self-Hosted Alternative** (if needed later):

- Only consider if: need custom modifications, data sovereignty requirements, or cost optimization at scale
- Railway template available but adds complexity
- Requires: PostgreSQL DB, Redis, app server, maintenance

**Decision for MVP: Use Chatwoot Cloud** ✅

#### 2.2 Webhook Handler

Implement webhook handler to sync Chatwoot events:

```typescript
// apps/orchestrator/src/routes/webhooks.ts
app.post('/webhooks/chatwoot', async (c) => {
  const event = await c.req.json();
  
  switch (event.event) {
    case 'conversation_created':
      await syncConversation(event.conversation);
      await createActivity('conversation_created', event);
      break;
    case 'message_created':
      await syncMessage(event.message);
      await createActivity('message_created', event);
      break;
    case 'conversation_status_changed':
      await updateConversation(event.conversation);
      await createActivity('status_changed', event);
      break;
  }
  
  return c.json({ success: true });
});
```

#### 2.3 Data Sync Strategy

**Initial sync**:

- Fetch existing conversations from Chatwoot API
- Store in orchestrator DB with `chatwootId` mapping
- Link to tenants (use Chatwoot account_id → tenant mapping)

**Real-time sync**:

- Chatwoot webhooks → Orchestrator → Update DB
- Emit SSE events to connected Shell clients
- Handle webhook retries and idempotency

---

### Phase 3: Shell UI Components (Week 2-3)

**Goal**: Build native inbox, conversation, and team collaboration UI in Next.js Shell.

#### 3.1 Inbox Page

Create `[app/app/inbox/page.tsx](app/app/inbox/page.tsx)`:

**Features**:

- Conversation list with filters (status, assignee, labels)
- Real-time updates via SSE
- Search and sorting
- Bulk actions (assign, label, resolve)

**shadcn Blocks to Use** (no hardcoded UI):

1. **Layout**: Copy `[lib/ui/Blocks-shadcn/sidebar-07.tsx](lib/ui/Blocks-shadcn/sidebar-07.tsx)` or `sidebar-10.tsx`
  - Adapt: Main content = conversation list, sidebar = filters
  - Already has responsive layout, collapsible sidebar
2. **Conversation List**: Copy `[lib/ui/Blocks-shadcn/data-table.tsx](lib/ui/Blocks-shadcn/data-table.tsx)`
  - Adapt: Columns = Contact, Subject, Status, Assignee, Last Message, Time
  - Built-in: Sorting, pagination, row selection
  - Add: Click row to open conversation detail
3. **Filters**: Use existing `Select`, `Switch`, `Badge` components
  - Status filter: Multi-select with badges
  - Assignee filter: Combobox with agent list
  - Label filter: Multi-select with color-coded badges
4. **Search**: Copy `[lib/ui/Blocks-shadcn/search-form.tsx](lib/ui/Blocks-shadcn/search-form.tsx)`
  - Adapt: Search conversations by contact name, message content
  - Add debounce (300ms)

**Components to create** (using blocks):

- `app/components/inbox/conversation-list.tsx` - Copy data-table, adapt columns
- `app/components/inbox/inbox-filters.tsx` - Compose Select + Switch + Badge
- `app/components/inbox/conversation-row.tsx` - Custom table row with status badge

**Data flow**:

1. Fetch conversations from orchestrator: `GET /api/v1/conversations`
2. Store in Zustand: `useConversationsStore`
3. Subscribe to SSE: `/api/v1/activity` for real-time updates
4. Update store on events

#### 3.2 Conversation Detail Page

Create `[app/app/inbox/[id]/page.tsx](app/app/inbox/[id]/page.tsx)`:

**Features**:

- Message thread (incoming + outgoing)
- Contact info sidebar
- Conversation actions (assign, label, resolve, escalate)
- Private notes (team collaboration)
- Canned responses dropdown
- Rich text editor for replies

**shadcn Blocks to Use**:

1. **Layout**: Copy `[lib/ui/Blocks-shadcn/sidebar-right.tsx](lib/ui/Blocks-shadcn/sidebar-right.tsx)`
  - Main content = message thread + reply box
  - Right sidebar = contact info, labels, actions
2. **Message Thread**: Use `ScrollArea` + `Card` components
  - Incoming messages: Left-aligned, gray background
  - Outgoing messages: Right-aligned, primary color
  - Attachments: Use `Badge` + download icon
  - Timestamps: Use `typography-muted` style
3. **Reply Box**: Copy `[lib/ui/Blocks-shadcn/validated-contact-form.tsx](lib/ui/Blocks-shadcn/validated-contact-form.tsx)`
  - Adapt: Replace form fields with `Textarea` for message
  - Add: File upload button, canned responses dropdown
  - Add: Send button with loading state
4. **Actions**: Use `DropdownMenu` + `Button` components
  - Actions: Assign, Add Label, Resolve, Escalate
  - Each action opens a `Dialog` or inline form
5. **Private Notes**: Copy reply box pattern
  - Visual distinction: Yellow/amber background
  - Add @mentions: Use `Combobox` for agent selection
  - Mark as private with `Switch`

**Components to create** (using blocks):

- `app/components/inbox/message-thread.tsx` - ScrollArea + Card composition
- `app/components/inbox/message-bubble.tsx` - Card with conditional styling
- `app/components/inbox/reply-box.tsx` - Form with Textarea + file upload
- `app/components/inbox/conversation-sidebar.tsx` - Sidebar with contact info
- `app/components/inbox/conversation-actions.tsx` - DropdownMenu with actions

#### 3.3 Team Collaboration Features

**Private Notes**:

- Markdown editor with @mentions
- Store in Chatwoot as private messages
- Show in conversation thread with visual distinction

**Assignments**:

- Assign to agent or team
- Show assignee avatar in conversation list
- Filter by "assigned to me"

**Labels**:

- Color-coded labels
- Multi-select in conversation detail
- Filter by label in inbox

**Canned Responses**:

- Dropdown menu in reply box
- Fetch from Chatwoot API
- Insert into editor on select

#### 3.4 Real-time Updates

Implement SSE client in Shell:

```typescript
// app/lib/sse-client.ts
export function useActivityStream(tenantId: string) {
  useEffect(() => {
    const eventSource = new EventSource(
      `/api/v1/activity?tenant=${tenantId}`
    );
    
    eventSource.onmessage = (event) => {
      const activity = JSON.parse(event.data);
      
      // Update Zustand stores based on activity type
      if (activity.type === 'conversation_created') {
        conversationsStore.add(activity.data);
      } else if (activity.type === 'message_created') {
        messagesStore.add(activity.data);
      }
    };
    
    return () => eventSource.close();
  }, [tenantId]);
}
```

---

### Phase 4: Approval Workflow (Week 3)

**Goal**: Implement escalation → approval → decision flow.

#### 4.1 Escalation Flow

**Trigger**: Agent clicks "Escalate to CEO" button in conversation detail

**Steps**:

1. Shell → `POST /api/v1/approvals` with conversation ID
2. Orchestrator creates approval record
3. Orchestrator emits activity event
4. CEO sees notification in Shell

**UI Components**:

- `EscalateButton` in conversation detail
- `EscalateDialog` - Confirmation modal with reason input
- `ApprovalNotification` - Toast notification for CEO

#### 4.2 Approval Dashboard

Create `[app/app/approvals/page.tsx](app/app/approvals/page.tsx)`:

**Features**:

- List of pending approvals
- Filter by status (pending, approved, rejected)
- Approve/reject actions
- View linked conversation

**shadcn Blocks to Use**:

1. **Layout**: Copy `[lib/ui/Blocks-shadcn/data-table.tsx](lib/ui/Blocks-shadcn/data-table.tsx)`
  - Columns: Type, Requested By, Conversation, Status, Created, Actions
  - Built-in: Sorting, filtering, pagination
2. **Status Badges**: Use existing `Badge` component
  - Pending: Yellow/amber
  - Approved: Green
  - Rejected: Red
3. **Actions**: Use `Button` + `Dialog` components
  - Approve button: Green, opens confirmation dialog
  - Reject button: Red, opens rejection reason dialog
  - View conversation: Opens conversation in modal or new tab
4. **Approval Detail**: Copy `[lib/ui/Blocks-shadcn/dialog-demo.tsx](lib/ui/Blocks-shadcn/dialog-demo.tsx)`
  - Show: Approval type, requester, conversation context, metadata
  - Actions: Approve, Reject, Cancel

**Components to create** (using blocks):

- `app/components/approvals/approval-list.tsx` - Copy data-table, adapt columns
- `app/components/approvals/approval-actions.tsx` - Button group with dialogs
- `app/components/approvals/approval-detail-dialog.tsx` - Dialog with approval info

#### 4.3 Decision Logging

**On approval/rejection**:

1. Shell → `PATCH /api/v1/approvals/:id` with decision
2. Orchestrator updates approval status
3. Orchestrator creates activity log
4. Orchestrator sends webhook to Chatwoot (optional)
5. Agent sees notification in Shell

---

### Phase 5: Deployment Setup (Week 4)

**Goal**: Deploy to production-ready serverless stack.

#### 5.1 Vercel (Shell)

**Setup**:

1. Connect GitHub repo to Vercel
2. Set environment variables:
  - `NEXT_PUBLIC_API_URL` → Orchestrator URL
  - `NEXTAUTH_URL`, `NEXTAUTH_SECRET` (for later)
3. Deploy: `vercel --prod`

**Configuration**:

- Build command: `npm run build`
- Output directory: `.next`
- Node.js version: 20.x

#### 5.2 Neon PostgreSQL

**Setup**:

1. Create Neon project
2. Create two databases:
  - `orchestrator` - For AXIS-AFENDA data
  - `chatwoot` - For Chatwoot data (if self-hosting)
3. Get connection strings
4. Configure Prisma: `DATABASE_URL=postgresql://...`

**Migrations**:

```bash
cd apps/orchestrator
npm run db:generate  # Generate migrations
npm run db:push      # Push to Neon database
```

#### 5.3 Railway/Render (Orchestrator + Chatwoot)

**Orchestrator Deployment**:

1. Create Railway project
2. Connect GitHub repo
3. Set build command: `cd apps/orchestrator && npm run build`
4. Set start command: `node dist/index.js`
5. Environment variables:
  - `DATABASE_URL` → Neon connection string
  - `CHATWOOT_API_URL`, `CHATWOOT_API_TOKEN`
  - `JWT_SECRET` (for auth)

**Chatwoot Deployment** (if self-hosting):

1. Use Railway template or Docker
2. Set environment variables:
  - `DATABASE_URL` → Neon Chatwoot DB
  - `REDIS_URL` → Upstash Redis
  - `FRONTEND_URL` → Chatwoot domain
3. Configure webhook URL → Orchestrator

#### 5.4 Upstash Redis

**Setup**:

1. Create Upstash Redis database
2. Get connection URL
3. Use for:
  - Session storage (NextAuth)
  - Rate limiting (Orchestrator)
  - Optional: Event bus (alternative to SSE)

---

## File Structure (After Implementation)

```
NEXIS-AFENDA/
├── app/                          # Next.js Shell (existing)
│   ├── app/
│   │   ├── inbox/
│   │   │   ├── page.tsx          # Inbox list view
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Conversation detail
│   │   ├── approvals/
│   │   │   └── page.tsx          # Approval dashboard
│   │   └── activity/
│   │       └── page.tsx          # Activity timeline
│   ├── components/
│   │   ├── inbox/                # NEW
│   │   │   ├── conversation-list.tsx
│   │   │   ├── conversation-card.tsx
│   │   │   ├── message-thread.tsx
│   │   │   ├── reply-box.tsx
│   │   │   └── private-note-box.tsx
│   │   └── approvals/            # NEW
│   │       ├── approval-list.tsx
│   │       ├── approval-card.tsx
│   │       └── escalate-dialog.tsx
│   ├── lib/
│   │   ├── api/
│   │   │   └── client.ts         # Existing API client
│   │   ├── stores/               # NEW Zustand stores
│   │   │   ├── conversations-store.ts
│   │   │   ├── messages-store.ts
│   │   │   └── approvals-store.ts
│   │   └── sse-client.ts         # NEW SSE client
│   └── ...
│
├── apps/orchestrator/            # NEW Hono API service
│   ├── src/
│   │   ├── index.ts
│   │   ├── routes/
│   │   │   ├── approvals.ts
│   │   │   ├── conversations.ts
│   │   │   ├── activity.ts
│   │   │   └── webhooks.ts
│   │   ├── services/
│   │   │   ├── chatwoot.ts
│   │   │   ├── approvals.ts
│   │   │   └── activity.ts
│   │   ├── db/
│   │   │   ├── schema.ts
│   │   │   └── client.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   └── tenant.ts
│   │   └── lib/
│   │       ├── validation.ts
│   │       └── errors.ts
│   ├── drizzle/           # Generated migrations
│   ├── drizzle.config.ts  # Drizzle configuration
│   ├── package.json
│   └── tsconfig.json
│
├── .env                          # UPDATE with Chatwoot vars (already has Neon, Railway)
├── docker-compose.yml            # NEW for local dev (optional)
└── .dev-docs/
    └── CHATWOOT-INTEGRATION.md   # NEW integration docs
```

**Key Changes**:

- ✅ Use existing `.env` (already has Neon, Railway, Vercel)
- ✅ Copy shadcn blocks from `lib/ui/Blocks-shadcn/` to `app/components/`
- ✅ Drizzle ORM instead of Prisma (better Neon integration)
- ✅ Chatwoot Cloud (no self-hosting infrastructure)

---

## Key Integration Points

### 1. Chatwoot → Orchestrator (Webhooks)

**Webhook events to handle**:

- `conversation_created` → Sync to DB, create activity
- `message_created` → Sync to DB, create activity, emit SSE
- `conversation_status_changed` → Update DB, create activity
- `conversation_updated` → Update DB (assignee, labels, etc.)

**Webhook security**:

- Validate webhook signature (HMAC)
- Store events in DB for replay
- Idempotency: check `chatwootId` before inserting

### 2. Orchestrator → Shell (SSE)

**SSE endpoint**: `GET /api/v1/activity?tenant=<id>`

**Event types**:

- `conversation_created`
- `message_created`
- `approval_created`
- `approval_updated`
- `status_changed`

**Client handling**:

- Reconnect on disconnect
- Update Zustand stores on events
- Show toast notifications for important events

### 3. Shell → Orchestrator (API)

**API calls**:

- Fetch conversations: `GET /api/v1/conversations`
- Send message: `POST /api/v1/conversations/:id/messages`
- Update conversation: `PATCH /api/v1/conversations/:id`
- Create approval: `POST /api/v1/approvals`
- Approve/reject: `PATCH /api/v1/approvals/:id`

**Error handling**:

- Use error boundaries for route-level errors
- Show toast for API errors
- Retry transient failures (network errors)

### 4. Orchestrator → Chatwoot (API)

**API calls**:

- Proxy conversation reads
- Send messages on behalf of agents
- Update conversation status/assignee/labels
- Fetch canned responses
- Create private notes

---

## Environment Variables

Update existing `[.env](.env)` file (already has Neon, Railway, Vercel configured):

```bash
# ============================================================================
# AXIS-AFENDA Orchestrator & Chatwoot Integration
# ============================================================================

# Orchestrator API (add to existing .env)
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_ORCHESTRATOR_URL=http://localhost:8000

# Chatwoot Cloud (Orchestrator)
CHATWOOT_API_URL=https://app.chatwoot.com
CHATWOOT_API_TOKEN=your_personal_access_token_from_chatwoot
CHATWOOT_ACCOUNT_ID=your_account_id
CHATWOOT_WEBHOOK_SECRET=your_webhook_secret

# Orchestrator Database (use existing Neon connection)
# DATABASE_URL is already configured in .env
# ORCHESTRATOR_DATABASE_URL=${DATABASE_URL}  # Reuse existing Neon DB

# Upstash Redis (for sessions, rate limiting)
UPSTASH_REDIS_URL=your_upstash_redis_url
UPSTASH_REDIS_TOKEN=your_upstash_token

# JWT Secret (for API authentication)
JWT_SECRET=your_jwt_secret_key_min_32_chars

# SSE Configuration
SSE_HEARTBEAT_INTERVAL=30000  # 30 seconds
SSE_MAX_CONNECTIONS=1000
```

**Note**: Your existing `.env` already has:

- ✅ Neon PostgreSQL (`DATABASE_URL`)
- ✅ Railway (`RAILWAY_TOKEN`, `RAILWAY_PROJECT_URL`)
- ✅ Vercel (`VERCEL_TOKEN`)
- ✅ Observability (Sentry, Grafana)

Just add the new Chatwoot and Orchestrator variables above.

---

## Testing Strategy

### Unit Tests

- Approval state machine logic
- Chatwoot API client
- Webhook handlers
- Validation schemas (Zod)

### Integration Tests

- API endpoints with test database
- Webhook ingestion flow
- SSE event emission
- Chatwoot API integration (mocked)

### E2E Tests (Playwright)

- Complete escalation flow
- Send message in conversation
- Approve/reject approval
- Real-time updates

---

## Success Metrics (MVP)

- Agent can view conversations from Chatwoot in Shell inbox
- Agent can send messages and see replies in real-time
- Agent can escalate conversation to CEO approval
- CEO sees approval notification within 5 seconds
- CEO can approve/reject with one click
- Agent receives decision notification
- All actions logged in activity timeline
- Tenant isolation enforced (no cross-tenant data)
- Deployed to production stack (Vercel + Neon + Railway)

---

## Migration Path (Zammad Features)

If you want to add Zammad features later:

**Zammad strengths** (vs Chatwoot):

- Better ticket management (SLA, ticket types, custom fields)
- More advanced automation (triggers, schedulers)
- Knowledge base integration
- Time tracking

**Integration approach**:

- Similar webhook + API pattern
- Sync tickets to orchestrator DB
- Build custom UI in Shell
- Use Zammad for backend, Shell for UX

**When to consider**:

- Need advanced SLA management
- Need time tracking
- Need more complex ticket workflows
- Chatwoot omnichannel + Zammad ticketing = hybrid

---

## Next Steps (Immediate Actions)

1. **Set up Chatwoot** (cloud or self-hosted)
2. **Create orchestrator project** (`apps/orchestrator/`)
3. **Define Prisma schema** and run migrations
4. **Implement core API endpoints** (approvals, conversations, webhooks)
5. **Configure Chatwoot webhooks** → Orchestrator
6. **Build inbox UI components** in Shell
7. **Implement SSE for real-time updates**
8. **Test escalation → approval flow**
9. **Deploy to Vercel + Neon + Railway**
10. **Monitor and iterate**

---

## References

**External Services**:

- [Chatwoot API Docs](https://www.chatwoot.com/developers/api/)
- [Chatwoot Webhooks](https://www.chatwoot.com/docs/product/channels/api/webhook)
- [Chatwoot Cloud Signup](https://chatwoot.com)

**Tech Stack**:

- [Hono Documentation](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Drizzle with Neon](https://orm.drizzle.team/docs/get-started-postgresql#neon)
- [Neon Serverless Driver](https://neon.tech/docs/serverless/serverless-driver)

**Deployment**:

- [Vercel Deployment](https://vercel.com/docs)
- [Railway Deployment](https://docs.railway.app/)
- [Upstash Redis](https://upstash.com/docs/redis)

**UI Components**:

- [shadcn/ui Blocks](https://ui.shadcn.com/blocks)
- [Available Blocks Summary](.dev-docs/AVAILABLE-BLOCKS-SUMMARY.md)

