# tldraw Integration — Implementation Plan

> Collaborative whiteboards for AXIS-AFENDA

---

## 🎯 Overview

**Goal**: Integrate tldraw v2 for collaborative whiteboards (Figma Jam-like experience)

**Use Cases**:
- Brainstorming sessions
- Design collaboration
- Process mapping
- Visual planning
- Customer consultation diagrams

---

## 📋 Features to Implement

### Phase 1: Basic Integration (MVP)
1. ✅ Install tldraw v2
2. ✅ Create TldrawBoard component
3. ✅ Whiteboards list page
4. ✅ Individual whiteboard page
5. ✅ Local persistence (browser storage)
6. ✅ Basic CRUD operations

### Phase 2: Server Persistence
1. Database schema for whiteboards
2. API endpoints (create, read, update, delete, list)
3. Auto-save to server
4. Load from server
5. Snapshot management

### Phase 3: Real-Time Collaboration
1. WebSocket/SSE for real-time sync
2. Multi-user presence indicators
3. Cursor tracking
4. Live updates
5. Conflict resolution

### Phase 4: Advanced Features
1. Whiteboard templates
2. Export (PNG, SVG, PDF)
3. Permissions (view, edit, admin)
4. Comments and annotations
5. Version history
6. Integration with approvals (attach whiteboard to escalation)

---

## 🛠️ Technical Stack

| Component | Technology |
|-----------|------------|
| **Library** | tldraw v2 |
| **Persistence** | PostgreSQL + tldraw snapshots |
| **Real-time** | WebSocket or SSE |
| **State** | tldraw Editor + Zustand |
| **API** | Hono (Orchestrator) |

---

## 📐 Architecture

```
┌─────────────────────────────────────────┐
│     Shell App (Next.js)                 │
│  ┌─────────────────────────────────┐   │
│  │  Whiteboards Page               │   │
│  │  - List view                    │   │
│  │  - Create new                   │   │
│  │  - Search/filter                │   │
│  └─────────────────────────────────┘   │
│  ┌─────────────────────────────────┐   │
│  │  Whiteboard Detail Page         │   │
│  │  ┌───────────────────────────┐  │   │
│  │  │  TldrawBoard Component    │  │   │
│  │  │  - tldraw canvas          │  │   │
│  │  │  - Auto-save              │  │   │
│  │  │  - Real-time sync         │  │   │
│  │  └───────────────────────────┘  │   │
│  └─────────────────────────────────┘   │
└──────────────┬──────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│  Orchestrator API (Hono)                │
│  - POST /api/v1/whiteboards             │
│  - GET /api/v1/whiteboards              │
│  - GET /api/v1/whiteboards/:id          │
│  - PATCH /api/v1/whiteboards/:id        │
│  - DELETE /api/v1/whiteboards/:id       │
│  - POST /api/v1/whiteboards/:id/snapshot│
│  - WebSocket /ws/whiteboards/:id        │
└─────────────────────────────────────────┘
               │
┌──────────────┴──────────────────────────┐
│  PostgreSQL Database                    │
│  - whiteboards table                    │
│  - whiteboard_snapshots table           │
│  - whiteboard_collaborators table       │
└─────────────────────────────────────────┘
```

---

## 🗄️ Database Schema

### `whiteboards` table
```sql
CREATE TABLE whiteboards (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL REFERENCES tenants(id),
  name TEXT NOT NULL,
  description TEXT,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  last_snapshot JSONB, -- Latest tldraw snapshot
  thumbnail_url TEXT,
  is_template BOOLEAN DEFAULT FALSE,
  permissions JSONB, -- { view: [], edit: [], admin: [] }
  metadata JSONB -- Custom metadata
);

CREATE INDEX idx_whiteboards_tenant_id ON whiteboards(tenant_id);
CREATE INDEX idx_whiteboards_created_by ON whiteboards(created_by);
```

### `whiteboard_snapshots` table (version history)
```sql
CREATE TABLE whiteboard_snapshots (
  id TEXT PRIMARY KEY,
  whiteboard_id TEXT NOT NULL REFERENCES whiteboards(id) ON DELETE CASCADE,
  snapshot JSONB NOT NULL,
  created_by TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  version INTEGER NOT NULL,
  description TEXT
);

CREATE INDEX idx_whiteboard_snapshots_whiteboard_id ON whiteboard_snapshots(whiteboard_id);
```

### `whiteboard_collaborators` table (active users)
```sql
CREATE TABLE whiteboard_collaborators (
  id TEXT PRIMARY KEY,
  whiteboard_id TEXT NOT NULL REFERENCES whiteboards(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  cursor_position JSONB,
  last_seen TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(whiteboard_id, user_id)
);

CREATE INDEX idx_whiteboard_collaborators_whiteboard_id ON whiteboard_collaborators(whiteboard_id);
```

---

## 🔌 API Endpoints

### Create Whiteboard
```
POST /api/v1/whiteboards
Body: { name, description?, isTemplate? }
Response: { data: { id, name, ... } }
```

### List Whiteboards
```
GET /api/v1/whiteboards?page=1&limit=20&search=...
Response: { data: [...], meta: { total, page, ... } }
```

### Get Whiteboard
```
GET /api/v1/whiteboards/:id
Response: { data: { id, name, lastSnapshot, ... } }
```

### Update Whiteboard
```
PATCH /api/v1/whiteboards/:id
Body: { name?, description?, lastSnapshot? }
Response: { data: { id, name, ... } }
```

### Save Snapshot (Auto-save)
```
POST /api/v1/whiteboards/:id/snapshot
Body: { snapshot: {...}, description? }
Response: { data: { id, version, ... } }
```

### Delete Whiteboard
```
DELETE /api/v1/whiteboards/:id
Response: { success: true }
```

---

## 🎨 UI Components

### Whiteboards List Page
- Grid/list view toggle
- Search bar
- "New Whiteboard" button
- Whiteboard cards with:
  - Thumbnail preview
  - Name
  - Last edited date
  - Collaborators count
  - Quick actions (open, duplicate, delete)
- Filters (my boards, shared, templates)

### Whiteboard Detail Page
- Full-screen tldraw canvas
- Top toolbar:
  - Whiteboard name (editable)
  - Share button
  - Export button
  - Settings menu
  - Back to list
- Auto-save indicator
- Collaborators avatars
- Real-time presence

---

## 🚀 Implementation Steps

### Step 1: Install Dependencies
```bash
npm install tldraw
```

### Step 2: Create Components
- `app/components/whiteboards/tldraw-board.tsx`
- `app/components/whiteboards/whiteboard-card.tsx`
- `app/components/whiteboards/whiteboard-list.tsx`

### Step 3: Create Pages
- `app/app/whiteboards/page.tsx` (list)
- `app/app/whiteboards/new/page.tsx` (create)
- `app/app/whiteboards/[id]/page.tsx` (detail)

### Step 4: Create API Client
- `app/lib/api/whiteboards.ts`
- `app/lib/stores/whiteboards-store.ts`

### Step 5: Backend Schema
- `apps/orchestrator/src/db/schema.ts` (add tables)
- Migration script

### Step 6: Backend Routes
- `apps/orchestrator/src/routes/whiteboards.ts`
- Validation schemas

### Step 7: Real-Time (Phase 3)
- WebSocket handler
- Presence tracking
- Snapshot sync

---

## 📝 tldraw Integration Code

### Basic Component
```tsx
'use client';

import { Tldraw } from 'tldraw';
import 'tldraw/tldraw.css';

export function TldrawBoard({ persistenceKey }: { persistenceKey: string }) {
  return (
    <div className="h-full w-full">
      <Tldraw persistenceKey={persistenceKey} />
    </div>
  );
}
```

### With Server Persistence
```tsx
'use client';

import { Tldraw, Editor, TLRecord } from 'tldraw';
import { useCallback, useEffect, useState } from 'react';
import { saveWhiteboardSnapshot } from '@/app/lib/api/whiteboards';

export function TldrawBoard({ whiteboardId, initialSnapshot }: Props) {
  const [editor, setEditor] = useState<Editor | null>(null);

  // Auto-save every 5 seconds
  useEffect(() => {
    if (!editor) return;

    const interval = setInterval(() => {
      const snapshot = editor.store.getSnapshot();
      saveWhiteboardSnapshot(whiteboardId, snapshot);
    }, 5000);

    return () => clearInterval(interval);
  }, [editor, whiteboardId]);

  const handleMount = useCallback((editor: Editor) => {
    setEditor(editor);
    
    // Load initial snapshot
    if (initialSnapshot) {
      editor.store.loadSnapshot(initialSnapshot);
    }
  }, [initialSnapshot]);

  return (
    <div className="h-full w-full">
      <Tldraw onMount={handleMount} />
    </div>
  );
}
```

---

## 🔐 Security Considerations

1. **Tenant Isolation**: All whiteboards scoped by tenant_id
2. **Permissions**: Check user permissions before load/save
3. **Rate Limiting**: Limit snapshot saves per minute
4. **Validation**: Validate snapshot structure
5. **Size Limits**: Limit snapshot size (e.g., 10MB)

---

## 📊 Success Metrics

- Whiteboard creation time < 2s
- Auto-save latency < 500ms
- Real-time sync latency < 100ms
- Support 10+ concurrent users per board
- Zero data loss on crashes

---

## 🎯 MVP Scope (Phase 1)

For initial implementation:
1. ✅ Basic tldraw integration
2. ✅ Whiteboards list page
3. ✅ Create/edit/delete whiteboards
4. ✅ Local browser persistence
5. ⏳ Server persistence (Phase 2)
6. ⏳ Real-time collaboration (Phase 3)

---

*Last updated: 2026-01-28*
*Status: Ready to implement*
