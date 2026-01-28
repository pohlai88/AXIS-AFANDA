# AXIS-AFENDA — Project Spec (Canonical)

> Single source of truth for architecture, stack, improvements, and roadmap.  
> See [.dev-docs/README.md](./README.md) for doc index and legacy references.

---

## 1. Vision & MVP

**Product**: Multi-tenant enterprise shell that orchestrates approvals, omnichannel (Chatwoot), team chat (Matrix), consultation rooms (Jitsi), and whiteboards (tldraw). **Clone + integrate** existing tools; minimal orchestration layer.

**MVP loop**: Customer Inbox → Escalate → CEO Approval → Decision logged.  
Validates: multi-tenant, approvals, audit trail, external integration, real-time updates.

---

## 2. Architecture

### Core

- **Shell App** (Next.js): One UI, one nav, tenant context, module registry. Owns UX cohesion.
- **Orchestrator API** (Hono): Control plane only. Approvals, audit trail, webhooks, activity timeline. No business-logic sprawl.
- **Keycloak**: Single source of truth for identity and permissions. **No local role edits** in sub-systems; sync downward only.

### Improvements (adopted)

| Area | Practice |
|------|----------|
| **API contract** | Explicit versioning (`/api/v1/...`). OpenAPI (or equivalent) spec as contract between Shell and Orchestrator. |
| **Real-time** | SSE or WebSocket from Orchestrator → Shell for activity timeline / notifications (e.g. new approval, CEO decision). Prefer over polling. |
| **Module loading** | Module registry: which modules exist, iframe vs in-app. Lazy-load iframes only when a module is opened. |
| **Frontend state** | Server as source of truth. Fetch from Orchestrator → Zustand. Validate API responses with Zod. No duplicate “truth”. |
| **Errors & resilience** | Error boundaries in Shell (per route or per module). Toasts / inline feedback for API errors. Retries for transient failures (e.g. submit approval). |

### Data flow (MVP)

1. Customer message in Chatwoot → Agent escalates in Shell.
2. Shell → `POST /api/v1/approvals` (Orchestrator).
3. Orchestrator stores approval, audit log; optionally pushes event (SSE/WS).
4. CEO sees approval in Shell, approves/rejects → `PATCH /api/v1/approvals/:id`.
5. Orchestrator updates state, audit; optional webhook to Chatwoot. Consultation room creation when approved.

### Auth & tenants

- Auth: Keycloak OIDC → JWT. Shell (NextAuth or equivalent) + Orchestrator validates JWT.
- Tenants: Keycloak groups → Individual / Team / Org. Resolve in Orchestrator; enforce tenant isolation in all queries.

---

## 3. Stack

| Layer | Choice |
|-------|--------|
| **Shell** | Next.js (App Router), React, TypeScript |
| **Orchestrator** | Hono, TypeScript |
| **Validation** | Zod (schemas, API in/out) |
| **State** | Zustand (client); server = source of truth |
| **Design system** | Tailwind v4, `app/globals.css`, `app/styles/luxury.utilities.css`, shadcn/ui + blocks |
| **DB** | PostgreSQL |
| **Cache / events** | Redis (sessions, rate limit, optional event bus) |
| **Identity** | Keycloak |
| **Integrations** | Chatwoot, Matrix, Jitsi, tldraw (embed) |
| **Tests** | Vitest (unit), Playwright (E2E) |

---

## 4. Design system & CSS

- **Tokens & theme**: `app/globals.css` — `@theme` (Tailwind), `:root` / `.dark` variables (surfaces, semantic, KPI, charts, badges, status, etc.). **Do not duplicate**; extend only when necessary.
- **Luxury utilities**: `app/styles/luxury.utilities.css` — `lux-` helpers (surfaces, shadows, rings, gold accents, badges, table, sheen). Additive only; do not replace shadcn semantics.
- **Components**: shadcn/ui + registry blocks. **Use, don’t rebuild.** Prefer blocks for layouts, tables, forms, charts, command palette.

**CSS is finalized.** Build UI on top of existing tokens and utilities; avoid “we’ll fix CSS later” work.

---

## 5. UI & DRY

- **Use shadcn blocks** first (dashboard, sidebar, forms, tables, command, etc.). **Copy** from `lib/ui/Blocks-shadcn` to `app/components/`, then integrate with business logic.
- **Copy + migrate**: Don't import directly from `lib/ui/Blocks-shadcn` or `lib/ui/primitive-shadcn`. Copy to `app/` and adapt.
- **Custom logic**: approval workflows, API integration, Keycloak sync, tenant resolution, audit. Not net-new generic UI.
- **Naming**: `lux-` for luxury utilities; existing shadcn/semantic tokens elsewhere.

---

## 6. Repo layout (current)

```
app/                 # Next.js App Router
  globals.css        # Theme, tokens, base polish
  styles/            # luxury.utilities.css, etc.
  layout.tsx, page.tsx
lib/                 # Shared UI, blocks, utilities
.dev-docs/           # PROJECT-SPEC.md canonical; README index; legacy docs
```

Orchestrator and packages may live in same repo or separate repos; API contract and versioning still apply.

---

## 7. Roadmap

1. **CSS** — Done. Tokens + luxury utilities locked.
2. **Shell** — Layout, sidebar, tenant switcher, `/app` routes, module registry, embedding.
3. **Orchestrator** — `v1` APIs (approvals, activity, webhooks), DB schema, SSE/WS for notifications.
4. **Keycloak** — Auth, tenant context, sync.
5. **Chatwoot** — Webhooks, escalation flow, MVP feature.
6. **Later** — Matrix, Jitsi, tldraw, analytics, settings.

---

## 8. Conventions

- **API**: REST, `/api/v1/...`, Zod-validated request/response. OpenAPI maintained.
- **Errors**: Consistent error shape; use HTTP status codes and structured bodies.
- **Tenant isolation**: Every Orchestrator query scoped by tenant; Shell never cross-tenant.
- **Logging**: No secrets in logs; structured where possible.

---

## 9. Legacy docs (reference only)

Older, superseded material:

- `ARCHITECTURE.md`, `AXIS-AFENDA-PROJECT-REF.md`, `DEVELOPMENT_ROADMAP.md`
- `DESIGN_SYSTEM_*`, `PROCESS_TRACKING.md`, `SHADCN_BLOCKS_INTEGRATION.md`

See [.dev-docs/README.md](./README.md). Update **PROJECT-SPEC.md** (and AGENTS.md / Cursor rules) for new decisions; do not feed legacy docs.

---

*Last updated: 2026-01-28*
