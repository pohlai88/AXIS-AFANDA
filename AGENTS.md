# AXIS-AFENDA — Agent Guidelines

Use this with **`.cursor/rules/`** for consistent, on-spec behavior. Canonical spec: **`.dev-docs/PROJECT-SPEC.md`**.

---

## 1. Project context

- **Product**: Multi-tenant enterprise shell (approvals, Chatwoot, Matrix, Jitsi, tldraw). Clone + integrate; minimal orchestration.
- **MVP**: Customer Inbox → Escalate → CEO Approval → Decision logged.
- **Stack**: Next.js, Hono, Zod, Zustand, Tailwind v4, shadcn/ui, Keycloak, PostgreSQL, Redis.

---

## 2. Architecture

- **Shell** (Next.js): One UI, nav, tenant context, module registry. Owns UX.
- **Orchestrator** (Hono): Control plane. Approvals, audit, webhooks, activity. No business-logic sprawl.
- **Keycloak**: SSOT for identity/permissions. No local role edits; sync downward only.
- **Improvements**: `/api/v1` + OpenAPI contract; SSE/WS for real-time; module registry + lazy iframes; server as source of truth; error boundaries + retries.

---

## 3. Design system & CSS

- **Tokens**: `app/globals.css` — `@theme`, `:root` / `.dark`. Surfaces, semantic, KPI, charts, badges, status. Use these; don’t add one-off colors.
- **Luxury**: `app/styles/luxury.utilities.css` — `lux-` utilities (surfaces, shadows, rings, gold, badges, table, sheen). Additive only.
- **Components**: shadcn/ui + blocks. **Use, don’t rebuild.** Prefer blocks for layouts, tables, forms, charts, command palette.

---

## 4. DRY & UI

- **Use shadcn blocks first.** Copy from `lib/ui/Blocks-shadcn` to `app/components/`, then integrate with business logic.
- **Copy + migrate**: Don't import directly from `lib/ui/Blocks-shadcn`. Copy to `app/` and adapt to project structure.
- **Custom logic**: workflows, API integration, Keycloak, tenants, audit. Not generic UI.
- **~80% blocks/integration, ~20% custom logic.**

---

## 5. Conventions

- **API**: REST, `/api/v1/...`, Zod-validated. Maintain OpenAPI.
- **State**: Server = source of truth. Fetch → Zustand. Validate responses with Zod.
- **Tenant isolation**: All orchestrator queries scoped by tenant.
- **Errors**: Structured shape; toasts / inline feedback; retries for transient failures.

---

## 6. References

| Resource | Purpose |
|----------|---------|
| [.dev-docs/PROJECT-SPEC.md](.dev-docs/PROJECT-SPEC.md) | Architecture, stack, roadmap, conventions |
| [.dev-docs/README.md](.dev-docs/README.md) | Doc index; legacy deprecation |
| `app/globals.css` | Theme, tokens, base polish |
| `app/styles/luxury.utilities.css` | Luxury utilities |

---

*Last updated: 2026-01-28*
