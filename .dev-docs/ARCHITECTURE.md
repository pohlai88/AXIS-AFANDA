# Architecture Overview

> ⚠️ **Legacy.** Superseded by [PROJECT-SPEC.md](./PROJECT-SPEC.md) § Architecture. Kept for reference only.

---

## System Design Philosophy

**Clone + Integrate**: Deploy battle-tested open-source tools and build a minimal orchestration layer to unify them into a cohesive product.

## Core Principles

1. **Keycloak = Source of Truth** for identity and permissions
2. **No local role edits** in sub-systems (sync downward only)
3. **Shell App owns** navigation, context, and UX cohesion
4. **Orchestrator = Control Plane** (not business logic engine)
5. **Minimal approval workflow** (start simple, add complexity only when forced)

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Shell App (Next.js)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Tenant     │  │  Navigation  │  │  Module      │      │
│  │   Switcher   │  │   Sidebar    │  │  Registry    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    Orchestrator API (Hono)                   │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Approvals   │  │  Audit Trail │  │  Webhooks    │      │
│  │  Workflow    │  │  Timeline    │  │  Handler     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
┌──────────────────┐  ┌──────────────┐  ┌──────────────┐
│    Keycloak      │  │  PostgreSQL  │  │    Redis     │
│   (Identity)     │  │  (Database)  │  │   (Cache)    │
└──────────────────┘  └──────────────┘  └──────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   Chatwoot   │      │    Matrix    │     │    Jitsi     │
│ (Omnichannel)│      │ (Team Chat)  │     │(Consultation)│
└──────────────┘      └──────────────┘     └──────────────┘
```

## Data Flow: MVP Feature

**Customer Inbox → Escalate → CEO Approval → Decision Logged**

1. Customer message arrives in Chatwoot
2. Agent clicks "Escalate to CEO" in Shell App
3. Shell App calls Orchestrator API: `POST /api/approvals`
4. Orchestrator creates approval record + audit log
5. CEO sees approval in Shell App `/app/approvals`
6. CEO approves/rejects
7. Shell App calls Orchestrator: `PATCH /api/approvals/:id`
8. Orchestrator updates status + logs to audit trail
9. Webhook sent back to Chatwoot (optional)
10. Consultation room created if approved: `POST /api/consultations`

## Authentication Flow

```
User → Shell App → Keycloak (OIDC)
                      ↓
                  JWT Token
                      ↓
        ┌─────────────┴─────────────┐
        ▼                           ▼
  Shell App Session          Orchestrator API
  (NextAuth)                 (JWT Validation)
        │                           │
        └───────────┬───────────────┘
                    ▼
            External Services
         (Chatwoot, Matrix, Jitsi)
```

## Tenant Context Resolution

```typescript
// Keycloak groups structure
/teams/engineering          → Team tenant
/teams/sales               → Team tenant
/organizations/acme-corp   → Organization tenant

// User session
{
  user: {
    id: "user-123",
    name: "John Doe",
    groups: [
      "/teams/engineering",
      "/organizations/acme-corp"
    ]
  }
}

// Available tenants in Shell App
[
  { id: "user-123", name: "Personal", type: "individual" },
  { id: "/teams/engineering", name: "Engineering", type: "team" },
  { id: "/organizations/acme-corp", name: "Acme Corp", type: "organization" }
]
```

## Database Schema

### Approvals Table
- `id` (uuid, primary key)
- `title` (varchar)
- `description` (text)
- `status` (enum: pending, approved, rejected)
- `requested_by` (varchar)
- `approved_by` (varchar, nullable)
- `tenant_id` (varchar)
- `priority` (enum: low, medium, high)
- `comment` (text, nullable)
- `metadata` (jsonb)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### Audit Logs Table
- `id` (uuid, primary key)
- `action` (varchar)
- `resource` (varchar)
- `resource_id` (varchar)
- `user_id` (varchar)
- `tenant_id` (varchar)
- `old_values` (jsonb)
- `new_values` (jsonb)
- `metadata` (jsonb)
- `created_at` (timestamp)

### Consultations Table
- `id` (uuid, primary key)
- `title` (varchar)
- `jitsi_room` (varchar, unique)
- `status` (enum: scheduled, active, ended)
- `host_id` (varchar)
- `participant_ids` (varchar[])
- `approval_id` (uuid, foreign key, nullable)
- `tenant_id` (varchar)
- `scheduled_at` (timestamp)
- `started_at` (timestamp)
- `ended_at` (timestamp)
- `created_at` (timestamp)

## API Endpoints

### Orchestrator API

**Approvals**
- `POST /api/approvals` - Create approval request
- `GET /api/approvals?tenantId=X` - List approvals for tenant
- `GET /api/approvals/:id` - Get approval details
- `PATCH /api/approvals/:id` - Update approval status

**Audit Trail**
- `POST /api/audit` - Create audit log entry
- `GET /api/audit?tenantId=X` - Get audit logs for tenant
- `GET /api/audit/resource/:type/:id` - Get logs for specific resource

**Webhooks**
- `POST /api/webhooks/chatwoot` - Chatwoot webhook handler
- `POST /api/webhooks/matrix` - Matrix webhook handler
- `POST /api/webhooks/:service` - Generic webhook handler

**Consultations**
- `POST /api/consultations` - Create consultation room
- `GET /api/consultations?tenantId=X` - List consultations
- `GET /api/consultations/:id` - Get consultation details
- `POST /api/consultations/:id/start` - Start consultation
- `POST /api/consultations/:id/end` - End consultation

## Security Boundaries

1. **Shell App** validates session via NextAuth + Keycloak
2. **Orchestrator API** validates JWT tokens from Keycloak
3. **External services** receive proxied requests with service-specific auth
4. **No direct access** from Shell App to external services (except embedded iframes)
5. **Tenant isolation** enforced at database query level

## Deployment Strategy

### Development
- Monorepo with Turborepo
- Local Docker Compose for infrastructure
- Hot reload for Shell App and Orchestrator

### Production (Future)
- Shell App: Vercel/Netlify
- Orchestrator: Docker container on VPS
- Infrastructure: Managed PostgreSQL, Redis, Keycloak cluster
- External services: Self-hosted on separate VPS or managed services

## Scalability Considerations

**Current MVP**: Single-server, shared database
**Future**: 
- Separate databases per service
- Redis for session storage and caching
- Message queue (Redis Streams or RabbitMQ) for async workflows
- Horizontal scaling of Orchestrator API
- CDN for Shell App static assets
