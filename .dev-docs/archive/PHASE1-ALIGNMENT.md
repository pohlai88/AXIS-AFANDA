# Phase 1 Alignment Check

> Comparing current implementation with [AXIS-AFENDA-PROJECT-REF.md](./AXIS-AFENDA-PROJECT-REF.md) Phase 1 requirements

---

## ✅ Completed (Phase 1 Step 1: Shell App)

### Deliverables Status

| Deliverable | Status | Notes |
|------------|--------|-------|
| **`/app` routes with sidebar + topbar** | ✅ **DONE** | Implemented with `ShellSidebar` and `SiteHeader` |
| **Tenant switcher** | ✅ **DONE** | `TenantProvider` + `TenantSwitcher` component with Individual/Team/Org support |
| **Module routing system** | ✅ **DONE** | All routes functional: `/app`, `/app/inbox`, `/app/approvals`, etc. |
| **Embedding wrapper** | ✅ **DONE** | `ModuleIframe` component for iframe-based modules |
| **Module registry** | ✅ **DONE** | `app/lib/module-registry.ts` with Zod schemas, helper functions |

### Partially Complete

| Deliverable | Status | Notes |
|------------|--------|-------|
| **App registry page** | ⚠️ **PARTIAL** | Module registry exists, but no UI page showing enabled modules |
| **Notification center UI** | ❌ **NOT DONE** | Not implemented yet |

---

## 📐 Structure Alignment

### Reference Suggests (Monorepo)
```
apps/
  shell/          # Next.js Shell App
  orchestrator/   # API Service
packages/
  design-system/  # UI components
  shared/         # Shared types/utils
```

### Current Structure (Single Repo)
```
app/              # Next.js App Router (Shell)
  app/            # Routes
  components/     # Shell components
  lib/            # Module registry
  providers/      # Context providers
components/       # shadcn UI components
lib/              # Blocks-shadcn (reference only)
```

**Decision**: PROJECT-SPEC.md says "Orchestrator and packages may live in same repo or separate repos" — current structure is valid. Monorepo can be adopted later if needed.

---

## 🎯 Architecture Alignment

### Core Principles ✅

- ✅ **Shell App = Unified UX** — Implemented with sidebar, header, tenant context
- ✅ **Module registry pattern** — Implemented with `module-registry.ts`
- ✅ **Design system consistency** — Using shadcn blocks, luxury utilities
- ✅ **Copy + migrate approach** — Following pattern (e.g., `ShellSidebar` adapted from blocks)

### Key Differences

| Aspect | Reference | Current | Status |
|--------|-----------|---------|--------|
| **Orchestrator framework** | FastAPI or Express.js | Not started | ⏳ Pending (PROJECT-SPEC says Hono) |
| **Monorepo** | Suggested | Single repo | ✅ Acceptable per PROJECT-SPEC |
| **Notification center** | Required | Not implemented | ❌ Gap |

---

## 🔍 Detailed Comparison

### Phase 1 Step 1 Requirements

**From AXIS-AFENDA-PROJECT-REF.md line 411-418:**

- [x] Implement `/app` routes with left sidebar + topbar
- [x] **Tenant switcher**: Individual → Team → Org
- [ ] "App registry" page (which modules are enabled)
- [x] Clean embedding wrapper component (`<ModuleEmbed>`)
- [x] Module routing system
- [ ] Notification center UI

**Completion: 4/6 (67%)**

### What We've Built

1. **Shell Layout** (`app/app/layout.tsx`)
   - ✅ SidebarProvider with ShellSidebar
   - ✅ SidebarInset with SiteHeader
   - ✅ TenantProvider integration
   - ✅ Theme toggle in header

2. **Tenant System**
   - ✅ `TenantProvider` with context
   - ✅ `TenantSwitcher` UI component
   - ✅ Supports Individual/Team/Org types
   - ✅ localStorage persistence

3. **Module Registry**
   - ✅ Type-safe with Zod schemas
   - ✅ Supports `in-app` and `iframe` types
   - ✅ Helper functions (getModule, getModuleByRoute, etc.)
   - ⚠️ No UI page to view/manage modules

4. **Routes**
   - ✅ `/app` — Dashboard (using shadcn dashboard-01)
   - ✅ `/app/inbox` — Inbox placeholder
   - ✅ `/app/approvals` — Approvals placeholder
   - ✅ `/app/omnichannel` — Omnichannel placeholder
   - ✅ `/app/consultations` — Consultations placeholder
   - ✅ `/app/settings` — Settings placeholder
   - ✅ `/app/help` — Help placeholder

5. **Iframe Embedding**
   - ✅ `ModuleIframe` component
   - ✅ Loading states
   - ✅ Error handling
   - ✅ Lazy loading support

---

## ⚠️ Gaps to Address

### 1. App Registry Page (UI)
**Status**: Module registry exists but no UI

**What's needed**:
- Page at `/app/modules` or `/app/settings/modules`
- List all modules with enable/disable toggle
- Show module type (in-app vs iframe)
- Show module status

**Priority**: Medium (can be added later)

### 2. Notification Center UI
**Status**: Not implemented

**What's needed**:
- Notification bell icon in header
- Dropdown/popover with notification list
- Real-time updates (SSE/WebSocket) — requires Orchestrator
- Mark as read functionality

**Priority**: High (needed for MVP loop)

### 3. Orchestrator API (Phase 1 Step 2)
**Status**: Not started

**What's needed**:
- Choose framework (PROJECT-SPEC says Hono, reference suggests FastAPI/Express)
- Set up project structure
- Implement `/api/v1/approvals` endpoints
- Database schema
- Webhook handlers

**Priority**: High (needed for MVP)

---

## ✅ Alignment Summary

### What's Aligned

1. **Architecture principles** — Shell App + Orchestration Layer ✅
2. **Technology stack** — Next.js v16, shadcn/ui, Tailwind v4 ✅
3. **Design system** — Using blocks, luxury utilities ✅
4. **Module pattern** — Registry + embedding ✅
5. **Tenant system** — Individual/Team/Org hierarchy ✅

### What's Different (But Acceptable)

1. **Monorepo structure** — Single repo is fine per PROJECT-SPEC
2. **Orchestrator framework** — PROJECT-SPEC says Hono (reference suggests FastAPI/Express) — follow PROJECT-SPEC

### What's Missing

1. **App registry UI page** — Medium priority
2. **Notification center** — High priority (needed for MVP)
3. **Orchestrator API** — High priority (Phase 1 Step 2)

---

## 🎯 Next Steps (To Fully Align)

### Immediate (Complete Phase 1 Step 1)

1. **Create App Registry Page**
   - `/app/settings/modules` or `/app/modules`
   - Show all modules from registry
   - Enable/disable toggle
   - Module type indicators

2. **Notification Center UI** (basic version)
   - Bell icon in header
   - Dropdown with notification list
   - Mock data for now (real-time comes with Orchestrator)

### Next Phase (Phase 1 Step 2)

3. **Orchestrator API Setup**
   - Create Hono project structure
   - Database schema (PostgreSQL)
   - Basic `/api/v1/approvals` endpoints
   - Webhook ingestion

---

## 📊 Overall Alignment Score

**Phase 1 Step 1: 67% Complete (4/6 deliverables)**

- ✅ Core shell structure
- ✅ Tenant system
- ✅ Module registry (backend)
- ✅ Routes and navigation
- ⚠️ App registry UI (missing)
- ❌ Notification center (missing)

**Recommendation**: We're well-aligned on architecture and core functionality. The missing pieces (app registry UI, notification center) are UI polish that can be added quickly. The Orchestrator API is the next major milestone.

---

*Last updated: 2026-01-28*
