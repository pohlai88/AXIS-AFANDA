# AXIS-AFENDA — Agent Guidelines

Use this with **`.cursor/rules/`** for consistent, on-spec behavior. Canonical spec: **`.dev-docs/PROJECT-SPEC.md`**.

---

## 1. Project Vision & Context

- **Product**: Multi-tenant enterprise shell orchestrating approvals, omnichannel (Chatwoot), team chat (Matrix), consultation rooms (Jitsi), and whiteboards (tldraw). Clone + integrate; minimal orchestration.
- **Philosophy**: "Life is chaos, but work doesn't have to be." Work should be a sanctuary of order within life's chaos.
- **MVP Flow**: Customer Inbox → Escalate → CEO Approval → Decision logged.
- **Stack**: Next.js 16.1.6, Zod, Zustand, Tailwind v4, shadcn/ui, PostgreSQL (Neon), Drizzle ORM.
  - Note: Hono, Keycloak, and Redis are planned but not yet implemented.

---

## 2. Architecture Principles

### Core Components

- **Shell App** (Next.js): Unified UI, navigation, tenant context, module registry. Owns UX cohesion.
- **API Layer** (Next.js API Routes): Currently handles approvals, conversations, tasks, teams, and more. No separate Orchestrator yet.
- **Keycloak**: Authentication library exists (`app/lib/keycloak/`) but full integration is pending.

### Implementation Patterns

- **API Contract**: Versioned endpoints (`/api/v1/...`) implemented in Next.js API routes.
- **State Management**: Zustand stores for each domain (conversations, approvals, tasks, teams, etc.).
- **Database**: Drizzle ORM with Neon PostgreSQL. No schema files found - likely using inline schema.
- **Error Handling**: Toast notifications via Sonner. Error boundaries not yet implemented.

---

## 3. Design System & CSS

### Token Architecture

- **Theme Tokens**: `app/globals.css` — `@theme` configuration, `:root` / `.dark` variables
- **Semantic Tokens**: `--approve-*` (bg/fg/bd), `--kpi-*` (up/down/flat with bg/fg/bd) for business logic
- **Luxury Utilities**: `app/styles/luxury.utilities.css` — `lux-` prefixed utilities (surfaces, shadows, rings, gold, badges, table, sheen)

### Usage Guidelines

- **No one-off colors**: Always use semantic tokens or luxury utilities
- **Hero Typography**: Available as utility classes - `text-hero-lux`, `text-hero-sub-lux`, `tracking-hero`, `leading-hero`
- **Hover Effects**:
  - Cards: Add `card-glow-lux` class manually for gold top-edge glow + lift
  - Buttons: Add `btn-hover-lux` class manually for subtle lift + shadow
  - Gold CTAs: Use `btn-gold-lux` class for primary actions
- **Dark Mode**: All tokens have `.dark` variants. UI adapts automatically.

---

## 4. UI Development & DRY

### Block Strategy

- **Use shadcn blocks first**: Copy from `lib/ui/Blocks-shadcn` to `app/components/`, then integrate
- **Copy + migrate**: Never import directly from `lib/ui/Blocks-shadcn`. Adapt to project structure
- **Custom Logic**: Focus on workflows, API integration, Keycloak sync, tenant resolution, audit
- **Ratio**: ~80% blocks/integration, ~20% custom business logic

### React Patterns

- **Functional Components**: Prefer with custom hooks for reusable logic
- **Error Boundaries**: Implement per route/module for resilience
- **Type Safety**: Strict TypeScript with Zod validation
- **Performance**: Lazy loading, code splitting, optimized re-renders

---

## 5. API & Data Conventions

### REST API

- **Endpoints**: `/api/v1/...` with routes for approvals, conversations, tasks, teams, meetings, webhooks, etc.
- **Validation**: Zod schemas used in stores and API routes.
- **OpenAPI**: Not currently maintained.
- **Error Shape**: Standard Next.js API responses.

### Data Flow

- **Tenant Isolation**: Tenant context in stores and API routes (tenantId field).
- **Audit Trail**: Activity timeline API exists but implementation is partial.
- **Webhooks**: Chatwoot webhook integration exists.
- **Caching**: No Redis implementation currently.

---

## 6. Development Workflow

### File Organization

```
app/
├── globals.css          # Theme tokens, base styles
├── styles/              # luxury.utilities.css, extensions
├── components/          # Migrated shadcn blocks + custom
├── lib/                 # Shared utilities, stores
├── api/                 # Next.js API routes
└── app/                 # App Router pages
```

### Key Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run tokens:scan` - Find hardcoded values
- `npm run tokens:fix` - Replace with tokens

### Database

- **ORM**: Drizzle with PostgreSQL (Neon)
- **Migrations**: No migration files found in project
- **Connection**: Using @neondatabase/serverless for serverless connection

---

## 7. Security & Auth

### Keycloak Integration

- **Status**: Library exists in `app/lib/keycloak/` but full integration is pending
- **Plan**: OIDC Flow with groups as tenants
- **Current**: Authentication not fully implemented

### Best Practices

- **No Secrets in Logs**: Structured logging without sensitive data
- **Rate Limiting**: Redis-based rate limiting
- **CORS**: Properly configured for API endpoints
- **Environment**: `.env.local` for local overrides

---

## 8. Testing & Quality

### Test Stack

- **Unit**: Not implemented (Vitest in package.json but no test files)
- **E2E**: Not implemented (Playwright not in dependencies)
- **Type Checking**: Strict TypeScript enabled
- **Linting**: ESLint with Next.js config

### Quality Gates

- **All PRs**: Must pass tests and linting
- **Token Compliance**: No hardcoded colors/values
- **API Contract**: OpenAPI must be valid
- **Performance**: Core Web Vitals monitored

---

## 9. References & Resources

| Resource                                                               | Purpose                                  |
| ---------------------------------------------------------------------- | ---------------------------------------- |
| [.dev-docs/PROJECT-SPEC.md](.dev-docs/PROJECT-SPEC.md)                 | Architecture, stack, roadmap (canonical) |
| [.dev-docs/KEYCLOAK-QUICK-START.md](.dev-docs/KEYCLOAK-QUICK-START.md) | 10-minute setup guide                    |
| [.dev-docs/KEYCLOAK-IAM-SETUP.md](.dev-docs/KEYCLOAK-IAM-SETUP.md)     | Complete IAM configuration               |
| `app/globals.css`                                                      | Theme tokens, base styles                |
| `app/styles/luxury.utilities.css`                                      | Luxury utilities reference               |
| `.cursor/rules/`                                                       | Development rules for IDE                |
| [package.json](package.json)                                           | Dependencies and scripts                 |

---

## 10. Common Patterns

### Status Variants

```typescript
const getStatusVariant = (status: string) => {
  switch (status) {
    case "open":
      return "default";
    case "pending":
      return "secondary";
    case "snoozed":
      return "outline";
    case "resolved":
      return "secondary";
    default:
      return "outline";
  }
};
```

### API Response Validation

```typescript
const responseSchema = z.object({
  data: z.array(conversationSchema),
  total: z.number(),
  page: z.number(),
});
```

### Tenant-Scoped Queries

```sql
-- All queries must include tenant filter
SELECT * FROM approvals
WHERE tenant_id = :tenantId
AND status = 'pending';
```

---

_Last updated: 2026-01-30_
