# AXIS-AFENDA Domain Comparison Report
> **Purpose**: Diagnosis and standardization across all domains  
> **Date**: 2026-01-29  
> **Scope**: API structure, Routes, Feature UI/UX consistency

---

## Executive Summary

**Total Domains Analyzed**: 8 (Approvals, Consultations, Inbox, Omnichannel, Whiteboards, Tasks, Activity, Teams)

### Key Findings
✅ **Strengths**: Consistent architectural pattern (Shell → Orchestrator → Keycloak)  
⚠️ **Inconsistencies**: API client implementation, store usage, hook patterns, component organization  
🔴 **Gaps**: Missing real-time features, incomplete API clients, inconsistent type definitions

---

## 1. API STRUCTURE COMPARISON

### 1.1 API Routes (SSE Endpoints in Shell)

| Domain | SSE Endpoint | Purpose | Heartbeat | Features |
|--------|-------------|---------|-----------|----------|
| **Activity** | ✅ `/api/v1/activity` | Global activity stream | 15s | ✅ Connection msg, heartbeat |
| **Consultations** | ✅ `/api/v1/meetings/updates` | Global meeting updates | 30s→15s | ✅ Connection msg, heartbeat |
| **Consultations** | ✅ `/api/v1/meetings/[id]/updates` | Meeting-specific updates | 15s | ✅ Connection msg, heartbeat |
| **Approvals** | ❌ None | - | - | - |
| **Inbox** | ❌ None | - | - | - |
| **Omnichannel** | ❌ None | - | - | - |
| **Whiteboards** | ❌ None | - | - | - |
| **Tasks** | ❌ None | - | - | - |
| **Teams** | ❌ None | - | - | - |

**🔴 CRITICAL GAP**: Only 2 domains (Activity, Consultations) have real-time SSE. Others rely on polling or no real-time updates.

#### Recommendation
1. Standardize SSE across all domains:
   - `/api/v1/approvals/updates` - Real-time approval status changes
   - `/api/v1/conversations/updates` - Real-time messages (both Inbox & Omnichannel)
   - `/api/v1/whiteboards/[id]/updates` - Real-time collaboration events
   - `/api/v1/tasks/updates` - Real-time task changes
   - `/api/v1/teams/[id]/updates` - Real-time team membership changes

2. **Standard SSE Pattern**:
   ```typescript
   // 1. Runtime: nodejs (not edge)
   export const runtime = 'nodejs';
   export const dynamic = 'force-dynamic';
   
   // 2. Initial SSE comment
   controller.enqueue(encoder.encode(': SSE connection established\n\n'));
   
   // 3. Connection message
   const message = { type: 'connected', data: { ... } };
   
   // 4. Heartbeat every 15 seconds
   setInterval(() => { /* heartbeat */ }, 15000);
   ```

---

### 1.2 API Client Implementation

| Domain | API Client File | Methods | Zod Validation | Error Handling | Status |
|--------|----------------|---------|----------------|----------------|--------|
| **Approvals** | ✅ `lib/api/approvals.ts` | 10 methods | ❌ No | ❌ Basic | 🟡 Partial |
| **Consultations** | ❌ None | - | - | - | 🔴 Missing |
| **Inbox** | ✅ `lib/api/conversations.ts` | 6 methods | ❌ No | ❌ Basic | 🟡 Partial |
| **Omnichannel** | ✅ Shared with Inbox | 6 methods | ❌ No | ❌ Basic | 🟡 Partial |
| **Whiteboards** | ❌ None | - | - | - | 🔴 Missing |
| **Tasks** | ❌ None | - | - | - | 🔴 Missing |
| **Activity** | ❌ None (SSE only) | - | - | - | ⚪ N/A |
| **Teams** | ❌ None | - | - | - | 🔴 Missing |

**⚠️ INCONSISTENCY**: Only 2 domains (Approvals, Inbox/Omnichannel) have dedicated API clients.

#### Recommendation
1. **Create standardized API clients for all domains**:
   ```typescript
   // Pattern: app/lib/api/{domain}.ts
   app/lib/api/approvals.ts      // ✅ Exists
   app/lib/api/conversations.ts  // ✅ Exists
   app/lib/api/consultations.ts  // 🔴 Create
   app/lib/api/whiteboards.ts    // 🔴 Create
   app/lib/api/tasks.ts          // 🔴 Create
   app/lib/api/teams.ts          // 🔴 Create
   ```

2. **Standard API Client Structure**:
   ```typescript
   // 1. Zod schema for validation
   export const EntitySchema = z.object({ ... });
   
   // 2. Type from schema
   export type Entity = z.infer<typeof EntitySchema>;
   
   // 3. Standard CRUD methods
   export async function getEntities(filters?: Filters): Promise<Entity[]>
   export async function getEntity(id: string): Promise<Entity>
   export async function createEntity(data: CreateEntityData): Promise<Entity>
   export async function updateEntity(id: string, data: UpdateEntityData): Promise<Entity>
   export async function deleteEntity(id: string): Promise<void>
   
   // 4. Domain-specific methods
   export async function [domainSpecificAction](...): Promise<...>
   ```

3. **Add Zod validation** to all API responses:
   ```typescript
   const response = await fetch(...);
   const data = await response.json();
   return EntitySchema.parse(data); // Validates at runtime
   ```

4. **Standardize error handling**:
   ```typescript
   try {
     const response = await fetch(...);
     if (!response.ok) {
       const error = await response.json();
       throw new ApiError(error.message, response.status, error.code);
     }
     return EntitySchema.parse(await response.json());
   } catch (error) {
     // Log error with context
     console.error(`[API/${domain}] ${method} failed:`, error);
     throw error;
   }
   ```

---

### 1.3 Orchestrator API Endpoints (Referenced)

All domains reference orchestrator endpoints at `/api/v1/{domain}`. Pattern is consistent:

```
GET    /api/v1/{domain}           - List with filters
GET    /api/v1/{domain}/:id       - Get single
POST   /api/v1/{domain}           - Create
PATCH  /api/v1/{domain}/:id       - Update
DELETE /api/v1/{domain}/:id       - Delete
```

✅ **STRENGTH**: Consistent REST API structure across all domains.

⚠️ **NOTE**: Orchestrator implementation is outside shell scope, but shell should have API clients for all endpoints.

---

## 2. ROUTES STRUCTURE COMPARISON

### 2.1 Page Route Patterns

| Domain | List Page | Detail Page | Create/New Page | Setup Page | Patterns |
|--------|-----------|-------------|-----------------|------------|----------|
| **Approvals** | `/app/approvals` | `/app/approvals/[id]` | `/app/approvals/new` | - | ✅ Standard 3-page |
| **Consultations** | `/app/consultations` | `/app/consultations/[id]` | ❌ Dialog | - | 🟡 Dialog creation |
| **Inbox** | `/app/inbox` | ❌ Split view | ❌ Dialog | - | 🟡 Split view pattern |
| **Omnichannel** | `/app/omnichannel` | `/app/omnichannel/[id]` | ❌ Dialog | `/app/omnichannel/setup` | 🟡 Has setup wizard |
| **Whiteboards** | `/app/whiteboards` | `/app/whiteboards/[id]` | ❌ Dialog | - | 🟡 Dialog creation |
| **Tasks** | `/app/tasks` | ❌ Sheet | ❌ Sheet/Dialog | - | 🟡 Sheet pattern |
| **Activity** | `/app/activity` | - | - | - | ⚪ Timeline only |
| **Teams** | `/app/settings/teams` | `/app/teams/[id]` | ❌ Dialog | - | ⚠️ Split location |

**⚠️ INCONSISTENCY**: Mixed patterns for creation (dedicated page vs dialog vs sheet).

#### Recommendation
1. **Standardize creation pattern** by entity complexity:
   - **Complex entities** (Approvals, Omnichannel setup): Dedicated `/new` page with wizard
   - **Medium entities** (Consultations, Whiteboards): Dialogs with 2-3 steps
   - **Simple entities** (Tasks, Comments): Sheets/inline forms

2. **Standardize detail view pattern**:
   - **Full entities**: Dedicated `[id]` page (Approvals, Consultations, Whiteboards, Teams)
   - **Split view**: List + detail pane (Inbox, Omnichannel when appropriate)
   - **Sheet view**: Right drawer (Tasks, Comments, Quick actions)

3. **Fix Teams location inconsistency**:
   - Move `/app/settings/teams` list to `/app/teams` for consistency
   - Keep settings at `/app/settings/teams` for team-level configuration only

---

### 2.2 Route Organization

```
app/app/
├── activity/           ✅ Single-level
├── approvals/          ✅ Multi-level (new, [id])
├── consultations/      ✅ Multi-level ([id])
├── help/               ✅ Single-level
├── inbox/              ✅ Single-level (split view)
├── omnichannel/        ✅ Multi-level ([id], setup)
├── settings/           ✅ Multi-level (11 sub-pages)
├── sse-test/           🔴 DEBUG PAGE (remove before prod)
├── tasks/              ✅ Single-level
├── teams/              ⚠️ Only has [id], list is in /settings/teams
└── whiteboards/        ✅ Multi-level ([id])
```

**🔴 ACTION ITEM**: Remove `/app/sse-test` before production or move to dev-only route.

---

## 3. FEATURE UI/UX COMPARISON

### 3.1 List View Patterns

| Domain | View Options | Filters | Search | Stats | Selection | Actions |
|--------|-------------|---------|--------|-------|-----------|---------|
| **Approvals** | ❌ List only | ✅ Status, urgency, scope, date | ✅ Yes | ✅ 5 stat cards | ❌ No | ✅ Per-item |
| **Consultations** | ✅ Timeline/Grid | ✅ Status, type | ✅ Yes | ✅ 4 stat cards | ✅ Multi-select | ✅ Bulk + per-item |
| **Inbox** | ❌ List only | ✅ All/Unread/Direct/Groups | ✅ Yes | ❌ No | ❌ No | ✅ Per-item |
| **Omnichannel** | ❌ List only | ✅ Status, priority, assignee, team, channel | ✅ Yes | ❌ No | ❌ No | ✅ Per-item |
| **Whiteboards** | ✅ Grid/List/Table | ✅ All/My/Shared/Templates | ✅ Yes | ❌ No | ✅ Multi-select | ✅ Bulk + per-item |
| **Tasks** | ❌ Table only | ✅ Data table filters | ✅ Yes | ✅ 5 stat cards | ✅ Multi-select | ✅ Bulk + per-item |
| **Activity** | ❌ Timeline only | ❌ No | ❌ No | ❌ No | ❌ No | ❌ No |
| **Teams** | ❌ List only | ❌ No | ✅ Yes | ❌ No | ❌ No | ✅ Per-item |

**⚠️ INCONSISTENCY**: 
- Stats cards exist in 3/8 domains
- Multi-select exists in 3/8 domains
- Multiple view options in 2/8 domains

#### Recommendation
1. **Standardize stat cards** for all domains with meaningful metrics:
   ```typescript
   // Pattern: Quick stats at top of list page
   - Approvals:      ✅ Has (pending, approved, rejected, urgent, totalToday)
   - Consultations:  ✅ Has (needsMinutes, thisWeek, completed, todayDuration)
   - Inbox:          🔴 Add (unread, direct, groups, today)
   - Omnichannel:    🔴 Add (open, assigned, urgent, avgResponseTime)
   - Whiteboards:    🔴 Add (total, my, shared, activeToday)
   - Tasks:          ✅ Has (todo, inProgress, completed, overdue, totalToday)
   - Activity:       ⚪ N/A (timeline view)
   - Teams:          🔴 Add (total, members, public, private)
   ```

2. **Add multi-select and bulk actions** where appropriate:
   ```typescript
   // Implement for:
   - Approvals:      🔴 Add (bulk approve, bulk delete)
   - Consultations:  ✅ Has
   - Inbox:          🔴 Add (mark as read, archive, delete)
   - Omnichannel:    🔴 Add (assign, add labels, archive)
   - Whiteboards:    ✅ Has
   - Tasks:          ✅ Has
   - Teams:          🔴 Add (bulk invite, bulk remove)
   ```

3. **Add view options** for domains with varied content:
   ```typescript
   // Add view toggles:
   - Approvals:      🔴 Add (list, timeline, kanban by status)
   - Consultations:  ✅ Has (timeline, grid)
   - Inbox:          🔴 Add (compact, comfortable, spacious)
   - Omnichannel:    🔴 Add (compact, comfortable, spacious)
   - Whiteboards:    ✅ Has (grid, list, table)
   - Tasks:          🔴 Add (list, board, table)
   ```

---

### 3.2 Detail View Patterns

| Domain | Layout | Tabs | Actions | Comments | Related Items | Audit Trail |
|--------|--------|------|---------|----------|---------------|-------------|
| **Approvals** | Single scroll | ❌ No | ✅ Top bar | ❌ No | ✅ Tasks | ✅ Yes |
| **Consultations** | Vertical tabs | ✅ 5 tabs | ✅ Top bar | ❌ No | ✅ Trail | ❌ No |
| **Inbox** | Split view | ❌ No | ✅ Sidebar | ❌ No | ❌ No | ❌ No |
| **Omnichannel** | Split view | ❌ No | ✅ Sidebar | ❌ No | ❌ No | ❌ No |
| **Whiteboards** | Full canvas | ❌ No | ✅ Toolbar | ✅ Yes | ❌ No | ❌ No |
| **Tasks** | Sheet | ❌ No | ✅ Header | ✅ Yes | ❌ No | ❌ No |
| **Activity** | - | - | - | - | - | - |
| **Teams** | Horizontal tabs | ✅ 3 tabs | ✅ Top bar | ❌ No | ❌ No | ❌ No |

**⚠️ INCONSISTENCY**: 
- Only Consultations has vertical tabs
- Only Approvals has audit trail (but it's a core feature)
- Comments exist in 2/8 domains

#### Recommendation
1. **Standardize tab patterns**:
   - **Complex entities**: Use tabs (Approvals could benefit from tabs)
   - **Tab structure**:
     ```typescript
     // Approvals: Add tabs
     - Overview (current main view)
     - Workflow (approvers, history, SLA)
     - Related (tasks, morph events, PUSH events)
     - Audit (existing audit trail)
     
     // Consultations: Keep vertical tabs (good pattern)
     - Room, Plan, Minutes, Actions, Trail
     
     // Teams: Keep horizontal tabs
     - Members, Settings, Activity
     ```

2. **Add audit trail** to critical domains:
   ```typescript
   // Add audit trail to:
   - Approvals:      ✅ Has (excellent implementation)
   - Consultations:  🔴 Add (status changes, participant changes)
   - Omnichannel:    🔴 Add (assignment changes, status changes)
   - Tasks:          🔴 Add (status changes, assignee changes)
   - Teams:          🔴 Add (membership changes, role changes)
   - Whiteboards:    🔴 Add (edit history, collaborator changes)
   ```

3. **Standardize comment patterns**:
   ```typescript
   // Add comments to all domains:
   - Approvals:      🔴 Add (discussion thread)
   - Consultations:  🔴 Add (meeting notes/comments)
   - Omnichannel:    ✅ Has (messages)
   - Tasks:          🔴 Add (task comments)
   - Teams:          🔴 Add (team discussions)
   - Whiteboards:    ✅ Has (canvas comments)
   ```

---

### 3.3 Creation Flows

| Domain | Flow Type | Steps | Validation | Templates | Preview | Completion |
|--------|-----------|-------|------------|-----------|---------|------------|
| **Approvals** | Wizard | 4 steps | ✅ Per-step | ✅ Yes | ✅ Yes | ✅ Redirect to detail |
| **Consultations** | Dialog | Single | 🟡 Basic | ❌ No | ❌ No | ✅ Redirect to detail |
| **Inbox** | Dialog | Single | 🟡 Basic | ❌ No | ❌ No | ✅ Stay in inbox |
| **Omnichannel** | Wizard | 4 steps | 🟡 Basic | ✅ Channel types | ✅ Yes | ✅ Redirect to list |
| **Whiteboards** | Dialog | Single | 🟡 Basic | ✅ Templates | ❌ No | ✅ Redirect to editor |
| **Tasks** | Sheet | Single | 🟡 Basic | ❌ No | ❌ No | ✅ Stay in list |
| **Teams** | Dialog | Single | 🟡 Basic | ❌ No | ❌ No | ✅ Redirect to detail |

**✅ STRENGTH**: Approvals has the most complete creation flow (wizard, validation, templates, preview).

**⚠️ INCONSISTENCY**: Validation quality varies significantly.

#### Recommendation
1. **Standardize validation**:
   ```typescript
   // All forms should use Zod schemas
   import { z } from 'zod';
   
   const CreateEntitySchema = z.object({
     title: z.string().min(1, 'Required').max(200, 'Too long'),
     description: z.string().optional(),
     // ... domain-specific fields
   });
   
   type CreateEntityData = z.infer<typeof CreateEntitySchema>;
   ```

2. **Add preview step** to complex creation flows:
   ```typescript
   // Add preview to:
   - Approvals:      ✅ Has (step 4: Review)
   - Consultations:  🔴 Add (meeting summary before creation)
   - Omnichannel:    ✅ Has (setup complete screen)
   - Whiteboards:    🔴 Add (template preview)
   ```

3. **Standardize template support**:
   ```typescript
   // Add templates to:
   - Approvals:      ✅ Has (11 types)
   - Consultations:  🔴 Add (meeting templates: standup, retrospective, planning)
   - Tasks:          🔴 Add (task templates by type)
   - Teams:          🔴 Add (team templates: department, project, working group)
   ```

---

### 3.4 Real-time Features

| Domain | SSE Updates | Toast Notifications | Connection Status | Update Handling |
|--------|-------------|-------------------|-------------------|-----------------|
| **Approvals** | ❌ None | ❌ None | ❌ None | 🔴 Manual refresh |
| **Consultations** | ✅ Yes | ✅ Yes | ✅ Indicator | ✅ Auto-update |
| **Inbox** | ❌ None | ❌ None | ❌ None | 🔴 Manual refresh |
| **Omnichannel** | ❌ None | ❌ None | ❌ None | 🔴 Manual refresh |
| **Whiteboards** | ❌ None | ❌ None | ❌ None | 🔴 Manual refresh |
| **Tasks** | ❌ None | ❌ None | ❌ None | 🔴 Manual refresh |
| **Activity** | ✅ Yes | ❌ None | ❌ None | ✅ Auto-update |
| **Teams** | ❌ None | ❌ None | ❌ None | 🔴 Manual refresh |

**🔴 CRITICAL GAP**: Only Consultations has complete real-time UX (SSE + toasts + connection status).

#### Recommendation
1. **Add SSE to all domains** (see Section 1.1):
   ```typescript
   // Standard hook pattern (copy from use-meeting-updates.ts):
   export function use{Domain}Updates(options?: UseUpdatesOptions) {
     const { events, isConnected, error } = useSSEMulti(
       `/api/v1/{domain}/updates`,
       ['{domain}_created', '{domain}_updated', '{domain}_deleted'],
       {
         enabled: options?.enabled,
         onOpen: () => console.log('[{Domain} Updates] Connected'),
         onError: (err) => console.error('[{Domain} Updates] Error:', err),
       }
     );
     
     // Handle events and show toasts
     useEffect(() => { /* ... */ }, [events]);
     
     return { isConnected, error, updates };
   }
   ```

2. **Add ConnectionStatusIndicator** to all list pages:
   ```tsx
   // Import from consultations/connection-status-indicator.tsx
   <ConnectionStatusIndicator
     isConnected={isConnected}
     error={error}
     label="{Domain} Updates"
   />
   ```

3. **Add toast notifications** for important events:
   ```typescript
   // Standard toast patterns:
   toast.success('Approval approved!');
   toast.info('New message received');
   toast.error('Connection lost', { description: 'Reconnecting...' });
   ```

---

### 3.5 Component Reusability

| Component Type | Approvals | Consultations | Inbox | Omnichannel | Whiteboards | Tasks | Activity | Teams | Reusable? |
|----------------|-----------|---------------|-------|-------------|-------------|-------|----------|-------|-----------|
| **Filters** | ✅ Custom | ❌ No | ✅ Custom | ✅ Custom | ❌ No | ✅ DataTable | ❌ No | ❌ No | 🔴 No |
| **Stats Cards** | ✅ Custom | ✅ Custom | ❌ No | ❌ No | ❌ No | ✅ Custom | ❌ No | ❌ No | 🔴 No |
| **Data Table** | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Yes | ✅ Yes | ❌ No | ❌ No | 🟡 Partial |
| **Message Thread** | ❌ N/A | ❌ No | ✅ Custom | ✅ Custom | ❌ N/A | ❌ N/A | ❌ N/A | ❌ N/A | 🟡 Separate |
| **Comments** | ❌ No | ❌ No | ❌ N/A | ❌ N/A | ✅ Custom | ✅ Custom | ❌ N/A | ❌ No | 🔴 No |
| **Timeline** | ❌ No | ✅ Custom | ❌ No | ❌ No | ❌ No | ❌ No | ✅ Custom | ❌ No | 🔴 No |

**🔴 CRITICAL GAP**: Poor component reusability across domains.

#### Recommendation
1. **Create shared component library**:
   ```typescript
   app/components/shared/
   ├── filters/
   │   ├── entity-filters.tsx        // Generic filter component
   │   └── filter-types.ts           // Filter type definitions
   ├── stats/
   │   ├── stat-cards.tsx            // Generic stat cards
   │   └── stat-card.tsx             // Single stat card
   ├── tables/
   │   ├── data-table.tsx            // ✅ Already exists
   │   └── data-table-toolbar.tsx   // Add generic toolbar
   ├── comments/
   │   ├── comment-thread.tsx       // Generic comment thread
   │   ├── comment-item.tsx         // Single comment
   │   └── comment-form.tsx         // Comment input
   ├── messaging/
   │   ├── message-thread.tsx       // Generic message thread
   │   ├── message-item.tsx         // Single message
   │   └── compose-box.tsx          // Message input
   └── timelines/
       ├── timeline-view.tsx         // Generic timeline
       └── timeline-item.tsx         // Timeline entry
   ```

2. **Refactor domain components** to use shared library:
   ```typescript
   // Example: Approvals filters
   <EntityFilters
     filters={approvalFilters}
     onFilterChange={handleFilterChange}
     schema={ApprovalFilterSchema}
   />
   ```

3. **Create generic hooks**:
   ```typescript
   app/hooks/
   ├── use-entity-filters.ts        // Generic filter state
   ├── use-entity-selection.ts      // Generic multi-select
   ├── use-entity-pagination.ts     // Generic pagination
   └── use-entity-sorting.ts        // Generic sorting
   ```

---

### 3.6 State Management Patterns

| Domain | Store Type | Location | Data Flow | Caching | Optimistic Updates |
|--------|-----------|----------|-----------|---------|-------------------|
| **Approvals** | ✅ Zustand | `lib/stores/approvals-store.ts` | API → Store → UI | ❌ No | ❌ No |
| **Consultations** | ❌ None | Mock data in pages | Mock → UI | ❌ No | ❌ No |
| **Inbox** | ✅ Zustand | `lib/stores/conversations-store.ts` | API → Store → UI | ❌ No | ❌ No |
| **Omnichannel** | ✅ Shared | `lib/stores/conversations-store.ts` | API → Store → UI | ❌ No | ❌ No |
| **Whiteboards** | ❌ None | Local state | Mock → UI | ❌ No | ❌ No |
| **Tasks** | ❌ None | Local state | Mock → UI | ❌ No | ❌ No |
| **Activity** | ✅ Zustand | `lib/stores/activity-store.ts` | SSE → Store → UI | ❌ No | ❌ No |
| **Teams** | ❌ None | Local state | Mock → UI | ❌ No | ❌ No |

**⚠️ INCONSISTENCY**: Only 3/8 domains use Zustand stores. Others use local state or mock data.

#### Recommendation
1. **Standardize on Zustand** for all domains:
   ```typescript
   app/lib/stores/
   ├── approvals-store.ts        // ✅ Exists
   ├── conversations-store.ts    // ✅ Exists
   ├── activity-store.ts         // ✅ Exists
   ├── consultations-store.ts    // 🔴 Create
   ├── whiteboards-store.ts      // 🔴 Create
   ├── tasks-store.ts            // 🔴 Create
   └── teams-store.ts            // 🔴 Create
   ```

2. **Standard store pattern**:
   ```typescript
   interface EntityStore {
     // State
     entities: Entity[];
     selectedEntity: Entity | null;
     filters: EntityFilters;
     isLoading: boolean;
     error: Error | null;
     
     // Actions
     fetchEntities: (filters?: EntityFilters) => Promise<void>;
     fetchEntity: (id: string) => Promise<void>;
     createEntity: (data: CreateEntityData) => Promise<Entity>;
     updateEntity: (id: string, data: UpdateEntityData) => Promise<Entity>;
     deleteEntity: (id: string) => Promise<void>;
     setFilters: (filters: EntityFilters) => void;
     selectEntity: (entity: Entity | null) => void;
     clearError: () => void;
   }
   ```

3. **Add optimistic updates** for better UX:
   ```typescript
   // Update UI immediately, rollback on error
   updateEntity: async (id, data) => {
     const originalEntity = get().entities.find(e => e.id === id);
     
     // Optimistic update
     set(state => ({
       entities: state.entities.map(e => 
         e.id === id ? { ...e, ...data } : e
       ),
     }));
     
     try {
       const updated = await apiClient.updateEntity(id, data);
       // Confirm with server response
       set(state => ({
         entities: state.entities.map(e => 
           e.id === id ? updated : e
         ),
       }));
       return updated;
     } catch (error) {
       // Rollback on error
       set(state => ({
         entities: state.entities.map(e => 
           e.id === id ? originalEntity! : e
         ),
       }));
       throw error;
     }
   };
   ```

4. **Add caching** with TTL:
   ```typescript
   interface CachedData<T> {
     data: T;
     timestamp: number;
     ttl: number; // milliseconds
   }
   
   // Check cache before fetching
   fetchEntities: async (filters) => {
     const cached = get().cache.get(cacheKey);
     if (cached && Date.now() - cached.timestamp < cached.ttl) {
       set({ entities: cached.data });
       return;
     }
     
     // Fetch from API and cache
     const entities = await apiClient.getEntities(filters);
     set({ 
       entities,
       cache: new Map(get().cache).set(cacheKey, {
         data: entities,
         timestamp: Date.now(),
         ttl: 60000, // 1 minute
       }),
     });
   };
   ```

---

## 4. TYPE DEFINITIONS COMPARISON

### 4.1 Type Definition Locations

| Domain | Types Location | Zod Schemas | Shared Types | Import Pattern |
|--------|---------------|-------------|--------------|----------------|
| **Approvals** | `lib/stores/approvals-store.ts` | ❌ No | ❌ No | Store exports |
| **Consultations** | `components/consultations/types.ts` | ❌ No | ❌ No | Component exports |
| **Inbox** | `lib/stores/conversations-store.ts` | ❌ No | ✅ Yes (with Omnichannel) | Store exports |
| **Omnichannel** | `lib/stores/conversations-store.ts` | ❌ No | ✅ Yes (with Inbox) | Store exports |
| **Whiteboards** | ❌ Inline | ❌ No | ❌ No | Inline |
| **Tasks** | `components/magic-todo/types.ts` | ❌ No | ❌ No | Component exports |
| **Activity** | `lib/stores/activity-store.ts` | ❌ No | ❌ No | Store exports |
| **Teams** | ❌ Inline | ❌ No | ❌ No | Inline |

**⚠️ INCONSISTENCY**: Types scattered across stores, components, and inline definitions.

#### Recommendation
1. **Centralize type definitions**:
   ```typescript
   app/lib/types/
   ├── index.ts                  // Re-export all types
   ├── approvals.ts              // Approval types
   ├── consultations.ts          // Meeting types
   ├── conversations.ts          // Inbox/Omnichannel types
   ├── whiteboards.ts            // Whiteboard types
   ├── tasks.ts                  // Task types
   ├── teams.ts                  // Team types
   ├── activity.ts               // Activity types
   ├── common.ts                 // Shared types (User, Tenant, etc.)
   └── api.ts                    // API response types
   ```

2. **Add Zod schemas** for all types:
   ```typescript
   // app/lib/types/approvals.ts
   import { z } from 'zod';
   
   export const ApprovalSchema = z.object({
     id: z.string().uuid(),
     tenantId: z.string(),
     title: z.string().min(1).max(200),
     description: z.string().optional(),
     status: z.enum(['pending', 'approved', 'rejected', 'cancelled']),
     createdAt: z.coerce.date(),
     updatedAt: z.coerce.date(),
     // ... all fields
   });
   
   export type Approval = z.infer<typeof ApprovalSchema>;
   
   // Also export schemas for API validation
   export const ApprovalListSchema = z.array(ApprovalSchema);
   export const CreateApprovalSchema = ApprovalSchema.omit({ 
     id: true, 
     createdAt: true, 
     updatedAt: true 
   });
   ```

3. **Shared types** for cross-domain entities:
   ```typescript
   // app/lib/types/common.ts
   export interface User {
     id: string;
     name: string;
     email: string;
     avatar?: string;
   }
   
   export interface Tenant {
     id: string;
     name: string;
     slug: string;
   }
   
   export interface Attachment {
     id: string;
     filename: string;
     mimeType: string;
     size: number;
     url: string;
     hash?: string;
   }
   
   export interface Label {
     id: string;
     name: string;
     color: string;
   }
   
   export interface Comment {
     id: string;
     content: string;
     author: User;
     createdAt: Date;
     updatedAt?: Date;
   }
   ```

---

## 5. PRIORITY RECOMMENDATIONS

### 5.1 Critical (Implement First)

1. **🔴 Add API clients** for missing domains
   - Consultations, Whiteboards, Tasks, Teams
   - Use Approvals API client as template
   - Add Zod validation

2. **🔴 Add Zustand stores** for missing domains
   - Consultations, Whiteboards, Tasks, Teams
   - Standardize store pattern
   - Add optimistic updates

3. **🔴 Centralize type definitions**
   - Move all types to `app/lib/types/`
   - Add Zod schemas for runtime validation
   - Create shared type library

4. **🔴 Add SSE endpoints** for missing domains
   - Approvals, Inbox, Omnichannel, Whiteboards, Tasks, Teams
   - Use standard SSE pattern (nodejs runtime, 15s heartbeat)
   - Add hooks for each domain

### 5.2 High Priority (Next Phase)

5. **⚠️ Standardize list views**
   - Add stat cards to Inbox, Omnichannel, Whiteboards, Teams
   - Add multi-select to Approvals, Inbox, Omnichannel, Teams
   - Add view options (grid/list/table) where appropriate

6. **⚠️ Add audit trails**
   - Consultations, Omnichannel, Tasks, Teams, Whiteboards
   - Use Approvals audit trail as template
   - Include past/present/future state tracking

7. **⚠️ Standardize creation flows**
   - Add validation (Zod) to all forms
   - Add templates where appropriate
   - Add preview steps for complex entities

8. **⚠️ Add comments** to all domains
   - Create shared comment component
   - Add threading support
   - Add mentions (@user)

### 5.3 Medium Priority (Quality of Life)

9. **🟡 Create shared component library**
   - Extract common patterns (filters, stats, tables, comments)
   - Create generic hooks
   - Improve component reusability

10. **🟡 Add caching and optimistic updates**
    - Implement in all Zustand stores
    - Add TTL-based cache invalidation
    - Improve perceived performance

11. **🟡 Standardize detail views**
    - Add tabs where appropriate
    - Consistent action placement
    - Related items sections

12. **🟡 Add toast notifications**
    - Success, error, info toasts for all actions
    - Connection status toasts
    - Progress notifications

### 5.4 Low Priority (Polish)

13. **⚪ Improve error handling**
    - Standardized error boundaries
    - Retry mechanisms
    - User-friendly error messages

14. **⚪ Add keyboard shortcuts**
    - Command palette integration
    - Navigation shortcuts
    - Quick actions (Cmd+K, Cmd+P, etc.)

15. **⚪ Add empty states**
    - Consistent empty state components
    - Call-to-action buttons
    - Helpful illustrations

16. **⚪ Add loading states**
    - Skeleton loaders for all domains
    - Progressive loading
    - Suspense boundaries

---

## 6. IMPLEMENTATION ROADMAP

### Phase 1: Foundation (Week 1-2)
**Goal**: Establish consistent architecture patterns

- [ ] Create centralized type definitions (`app/lib/types/`)
- [ ] Add Zod schemas for all entities
- [ ] Create API clients for all domains
- [ ] Create Zustand stores for all domains
- [ ] Add SSE endpoints for all domains
- [ ] Create SSE hooks for all domains

**Deliverable**: Complete API layer with type safety and real-time capabilities

### Phase 2: UI Standardization (Week 3-4)
**Goal**: Consistent user experience across domains

- [ ] Create shared component library (`app/components/shared/`)
- [ ] Refactor domain components to use shared library
- [ ] Add stat cards to all list views
- [ ] Add multi-select and bulk actions
- [ ] Standardize filters and search
- [ ] Add connection status indicators

**Deliverable**: Consistent UI patterns and improved UX

### Phase 3: Feature Parity (Week 5-6)
**Goal**: All domains have complete feature sets

- [ ] Add audit trails to all critical domains
- [ ] Add comments to all domains
- [ ] Add toast notifications throughout
- [ ] Improve validation in all forms
- [ ] Add preview steps to creation flows
- [ ] Add templates where appropriate

**Deliverable**: Feature-complete domains with rich interactions

### Phase 4: Optimization (Week 7-8)
**Goal**: Performance and reliability improvements

- [ ] Add caching with TTL
- [ ] Implement optimistic updates
- [ ] Add error boundaries
- [ ] Improve loading states
- [ ] Add retry mechanisms
- [ ] Performance profiling and optimization

**Deliverable**: Fast, reliable, production-ready application

### Phase 5: Polish (Week 9-10)
**Goal**: Best-in-class user experience

- [ ] Add keyboard shortcuts
- [ ] Improve empty states
- [ ] Add progressive loading
- [ ] Add animations and transitions
- [ ] Accessibility improvements (ARIA, keyboard nav)
- [ ] User onboarding and help

**Deliverable**: Polished, professional application

---

## 7. METRICS FOR SUCCESS

### Before Standardization (Current State)

| Metric | Value |
|--------|-------|
| API Clients | 2/8 domains (25%) |
| Zustand Stores | 3/8 domains (37%) |
| SSE Endpoints | 2/8 domains (25%) |
| Real-time Updates | 1/8 domains (12%) |
| Stat Cards | 3/8 domains (37%) |
| Multi-select | 3/8 domains (37%) |
| Audit Trails | 1/8 domains (12%) |
| Comments | 2/8 domains (25%) |
| Type Definitions | Scattered (0% centralized) |
| Component Reuse | Low (~20%) |

### After Standardization (Target)

| Metric | Target |
|--------|--------|
| API Clients | 7/8 domains (87%) - Activity SSE-only |
| Zustand Stores | 7/8 domains (87%) - Activity SSE-only |
| SSE Endpoints | 8/8 domains (100%) |
| Real-time Updates | 8/8 domains (100%) |
| Stat Cards | 7/8 domains (87%) - Activity N/A |
| Multi-select | 7/8 domains (87%) - Activity N/A |
| Audit Trails | 6/8 domains (75%) - core domains |
| Comments | 7/8 domains (87%) - Activity N/A |
| Type Definitions | 100% centralized with Zod |
| Component Reuse | High (~60%) |

---

## 8. APPENDICES

### A. File Structure Reference

**Current:**
```
app/
├── api/v1/
│   ├── activity/route.ts              ✅ SSE
│   └── meetings/
│       ├── [id]/updates/route.ts      ✅ SSE
│       └── updates/route.ts           ✅ SSE
├── app/
│   ├── approvals/                     ✅ Complete routing
│   ├── consultations/                 🟡 Partial features
│   ├── inbox/                         🟡 Partial features
│   ├── omnichannel/                   🟡 Partial features
│   ├── whiteboards/                   🟡 Partial features
│   ├── tasks/                         🟡 Partial features
│   ├── activity/                      🟡 Basic only
│   └── teams/                         🟡 Split location
├── components/
│   ├── approvals/                     ✅ 11 components
│   ├── consultations/                 ✅ 20 components
│   ├── inbox/                         🟡 7 components
│   ├── omnichannel/                   🟡 6 components
│   ├── whiteboards/                   🟡 6 components
│   ├── tasks/                         🟡 2 components
│   └── [shared]                       🔴 Missing
├── hooks/
│   ├── use-activity-stream.ts         ✅ SSE hook
│   ├── use-meeting-updates.ts         ✅ SSE hook
│   ├── use-sse.ts                     ✅ Core SSE
│   └── use-command-palette.ts         ✅ Other
├── lib/
│   ├── api/
│   │   ├── approvals.ts               ✅ API client
│   │   └── conversations.ts           ✅ API client
│   ├── stores/
│   │   ├── approvals-store.ts         ✅ Zustand
│   │   ├── conversations-store.ts     ✅ Zustand
│   │   └── activity-store.ts          ✅ Zustand
│   └── sse-client.ts                  ✅ SSE core
```

**Target:**
```
app/
├── api/v1/
│   ├── activity/route.ts              ✅ SSE
│   ├── approvals/updates/route.ts     🔴 Add SSE
│   ├── conversations/updates/route.ts 🔴 Add SSE
│   ├── meetings/
│   │   ├── [id]/updates/route.ts      ✅ SSE
│   │   └── updates/route.ts           ✅ SSE
│   ├── tasks/updates/route.ts         🔴 Add SSE
│   ├── teams/updates/route.ts         🔴 Add SSE
│   └── whiteboards/
│       └── [id]/updates/route.ts      🔴 Add SSE
├── app/                               (no changes)
├── components/
│   ├── [domain]/                      (keep specific)
│   └── shared/                        🔴 Add
│       ├── filters/
│       ├── stats/
│       ├── tables/
│       ├── comments/
│       ├── messaging/
│       └── timelines/
├── hooks/
│   ├── use-activity-stream.ts         ✅ Exists
│   ├── use-approval-updates.ts        🔴 Add
│   ├── use-conversation-updates.ts    🔴 Add
│   ├── use-meeting-updates.ts         ✅ Exists
│   ├── use-task-updates.ts            🔴 Add
│   ├── use-team-updates.ts            🔴 Add
│   ├── use-whiteboard-updates.ts      🔴 Add
│   ├── use-entity-filters.ts          🔴 Add (generic)
│   ├── use-entity-selection.ts        🔴 Add (generic)
│   └── use-entity-pagination.ts       🔴 Add (generic)
├── lib/
│   ├── api/
│   │   ├── approvals.ts               ✅ Exists
│   │   ├── consultations.ts           🔴 Add
│   │   ├── conversations.ts           ✅ Exists
│   │   ├── tasks.ts                   🔴 Add
│   │   ├── teams.ts                   🔴 Add
│   │   └── whiteboards.ts             🔴 Add
│   ├── stores/
│   │   ├── approvals-store.ts         ✅ Exists
│   │   ├── activity-store.ts          ✅ Exists
│   │   ├── consultations-store.ts     🔴 Add
│   │   ├── conversations-store.ts     ✅ Exists
│   │   ├── tasks-store.ts             🔴 Add
│   │   ├── teams-store.ts             🔴 Add
│   │   └── whiteboards-store.ts       🔴 Add
│   ├── types/                         🔴 Add
│   │   ├── index.ts                   (re-exports)
│   │   ├── approvals.ts               (with Zod)
│   │   ├── consultations.ts           (with Zod)
│   │   ├── conversations.ts           (with Zod)
│   │   ├── tasks.ts                   (with Zod)
│   │   ├── teams.ts                   (with Zod)
│   │   ├── whiteboards.ts             (with Zod)
│   │   ├── activity.ts                (with Zod)
│   │   ├── common.ts                  (shared types)
│   │   └── api.ts                     (API types)
│   └── sse-client.ts                  ✅ Exists
```

### B. Component Dependency Map

```
Approvals:
  ├─ approval-list          (list view)
  ├─ approval-filters       (filter sidebar)
  ├─ approval-stats         (stat cards)
  ├─ approval-detail        (detail view)
  ├─ template-selector      (wizard step 1)
  ├─ template-form          (wizard step 2)
  ├─ attachment-upload      (wizard step 3)
  ├─ morph-selector         (morphing UI)
  ├─ push-handoff           (PUSH UI)
  └─ duplicate-detection-dialog

Consultations:
  ├─ timeline-view          (list view)
  ├─ timeline-meeting-card  (card component)
  ├─ quick-stats-bar        (stat bar)
  ├─ calendar-heatmap       (heatmap)
  ├─ connection-status-indicator (SSE status)
  ├─ floating-action-bar    (bulk actions)
  ├─ meeting-flow-dialog    (creation)
  ├─ meeting-request-dialog (request meeting)
  ├─ live-meeting-room      (detail: room tab)
  ├─ jitsi-meeting          (Jitsi integration)
  ├─ participants-panel     (participants)
  ├─ meeting-minutes-dialog (minutes completion)
  ├─ magic-todo-sheet       (AI task creation)
  ├─ case-trail-timeline    (detail: trail tab)
  ├─ vertical-tabs-nav      (tab navigation)
  ├─ collaborative-notes-card
  ├─ ai-suggestions-panel
  ├─ confetti-celebration
  └─ loading-skeleton

Inbox:
  ├─ conversation-list      (list view)
  ├─ inbox-filters          (filter tabs)
  ├─ conversation-sidebar   (detail sidebar)
  ├─ message-thread         (messages)
  ├─ reply-box              (compose)
  ├─ conversation-actions   (actions)
  └─ create-group-dialog

Omnichannel:
  ├─ conversation-list      (list view)
  ├─ inbox-filters          (filter sidebar)
  ├─ conversation-sidebar   (detail sidebar)
  ├─ message-thread         (messages)
  ├─ reply-box              (compose with private notes)
  └─ conversation-actions   (actions)

Whiteboards:
  ├─ whiteboards-table      (table view)
  ├─ whiteboard-card        (grid/list view)
  ├─ tags-manager           (tags)
  ├─ tldraw-board           (canvas)
  ├─ mindmap-toolbar        (mindmap tools)
  └─ comments-sidebar       (comments)

Tasks:
  ├─ tasks-data-table       (data table)
  └─ task-stats             (stat cards)

Activity:
  └─ activity-timeline      (timeline)

Teams:
  ├─ create-team-dialog     (creation)
  ├─ invite-team-members-dialog
  ├─ team-member-row        (member item)
  └─ change-member-role-dialog

Shared (to be created):
  ├─ entity-filters         🔴 Create
  ├─ stat-cards             🔴 Create
  ├─ data-table-toolbar     🔴 Create
  ├─ comment-thread         🔴 Create
  ├─ message-thread         🔴 Create (from inbox/omnichannel)
  └─ timeline-view          🔴 Create (from consultations/activity)
```

### C. API Endpoint Reference

```
# Approvals
GET    /api/v1/approvals
GET    /api/v1/approvals/:id
POST   /api/v1/approvals
PATCH  /api/v1/approvals/:id
DELETE /api/v1/approvals/:id
GET    /api/v1/approvals/templates
GET    /api/v1/approvals/templates/:id
GET    /api/v1/approvals/check-duplicate
POST   /api/v1/approvals/:id/morph
POST   /api/v1/approvals/:id/push
GET    /api/v1/approvals/updates           🔴 Add SSE

# Consultations/Meetings
GET    /api/v1/meetings
GET    /api/v1/meetings/:id
POST   /api/v1/meetings
PATCH  /api/v1/meetings/:id
DELETE /api/v1/meetings/:id
POST   /api/v1/meetings/:id/minutes
GET    /api/v1/meetings/updates            ✅ SSE
GET    /api/v1/meetings/:id/updates        ✅ SSE

# Conversations (Inbox & Omnichannel)
GET    /api/v1/conversations
GET    /api/v1/conversations/:id
POST   /api/v1/conversations
PATCH  /api/v1/conversations/:id
DELETE /api/v1/conversations/:id
GET    /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/escalate
GET    /api/v1/conversations/updates       🔴 Add SSE

# Whiteboards
GET    /api/v1/whiteboards
GET    /api/v1/whiteboards/:id
POST   /api/v1/whiteboards
PATCH  /api/v1/whiteboards/:id
DELETE /api/v1/whiteboards/:id
POST   /api/v1/whiteboards/:id/snapshot
GET    /api/v1/whiteboards/:id/updates     🔴 Add SSE

# Tasks
GET    /api/v1/tasks
GET    /api/v1/tasks/:id
POST   /api/v1/tasks
PATCH  /api/v1/tasks/:id
DELETE /api/v1/tasks/:id
PATCH  /api/v1/tasks/bulk
DELETE /api/v1/tasks/bulk
GET    /api/v1/tasks/updates               🔴 Add SSE

# Teams
GET    /api/v1/teams
GET    /api/v1/teams/:id
POST   /api/v1/teams
PATCH  /api/v1/teams/:id
DELETE /api/v1/teams/:id
GET    /api/v1/teams/:id/members
POST   /api/v1/teams/:id/members
DELETE /api/v1/teams/:id/members/:userId
PATCH  /api/v1/teams/:id/members/:memberId
POST   /api/v1/teams/:id/invitations
GET    /api/v1/teams/:id/invitations
GET    /api/v1/teams/updates               🔴 Add SSE

# Activity
GET    /api/v1/activity                    ✅ SSE
```

---

## Next Steps

1. **Review this report** with the team
2. **Prioritize recommendations** based on business goals
3. **Create implementation tickets** for Phase 1
4. **Set up tracking** for standardization metrics
5. **Begin implementation** following the roadmap

**Questions? Discuss in**:
- `#architecture` channel for architectural decisions
- `#frontend` channel for UI/UX patterns
- `#api` channel for API standardization

---

*Report generated: 2026-01-29*  
*Next review: After Phase 1 completion*
