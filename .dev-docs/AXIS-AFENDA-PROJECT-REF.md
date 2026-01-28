# AXIS AFENDA - Project Reference

> ⚠️ **Legacy.** Superseded by [PROJECT-SPEC.md](./PROJECT-SPEC.md). Keep for detailed references only.

> **Core Strategy**: Clone + Integrate approach for fastest MVP delivery with controlled risk

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack Decisions](#technology-stack-decisions)
3. [Monorepo Structure](#monorepo-structure)
4. [Risk Mitigation](#risk-mitigation)
5. [Infrastructure & Services](#infrastructure--services)
6. [Implementation Roadmap](#implementation-roadmap)
7. [Orchestration Layer (Core Moat)](#orchestration-layer-core-moat)
8. [API Design Patterns](#api-design-patterns)
9. [Database Schema](#database-schema)
10. [Security Considerations](#security-considerations)
11. [MVP Feature Definition](#mvp-feature-definition)
12. [Testing Strategy](#testing-strategy)
13. [Deployment & Operations](#deployment--operations)

---

## 🏗️ Architecture Overview

### Core Philosophy

**Build a Shell App + Orchestration Layer** that integrates existing tools rather than building everything from scratch.

### Key Principles

- **Keycloak = Single Source of Truth** for identity and permissions
- **Orchestrator = Control Plane**, not business logic engine
- **Shell App = Unified UX** that makes everything feel like one product
- **Downward sync only** - never allow local role edits in sub-systems
- **Event-driven architecture** - use webhooks and event bus for loose coupling

### System Components

```
┌─────────────────────────────────────────────────────────┐
│              Shell App (Next.js v16)                    │
│  - Navigation, Context, Permissions, Notifications       │
│  - Design System (shadcn/ui)                             │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────┴──────────────────────────────────┐
│         Orchestration Layer (API Service)                │
│  - Tenant Resolution (Individual → Team → Org)           │
│  - Approval State Machine                               │
│  - Cross-service Permissions                            │
│  - Webhook Ingestion & Routing                          │
│  - Unified Activity Timeline                            │
│  - Event Bus (Postgres LISTEN/NOTIFY or Redis)         │
└──────┬──────────┬──────────┬──────────┬───────────────┘
       │          │          │          │
   Keycloak   Chatwoot    Matrix     Jitsi
   (Identity) (Omnichannel) (Team Chat) (Video)
```

### Data Flow

1. **Authentication**: User → Keycloak → Shell App (JWT/OIDC)
2. **Authorization**: Shell App → Orchestrator → Keycloak (permission check)
3. **Events**: External Service → Webhook → Orchestrator → Event Bus → Shell App
4. **Actions**: Shell App → Orchestrator API → External Service API

---

## 🛠️ Technology Stack Decisions

### ✅ Approved Technologies

#### Frontend Framework
- **Next.js v16** ✅
  - App Router with React Server Components
  - Server-side rendering for performance
  - API routes for backend integration

#### Design System
- **shadcn/ui (New York style)** ✅
  - 50+ components already integrated
  - Tailwind CSS v4 with CSS variables
  - Dark mode support via next-themes
  - Fully typed with TypeScript

#### Identity & Access Management
- **Keycloak** ⭐ **Non-negotiable**
  - Handles individual → team → org hierarchy via realms + groups + attributes
  - Single source of truth for all permissions
  - OIDC/OAuth2 support
  - **Integration**: NextAuth.js or custom OIDC client

#### Customer Support / Omnichannel
- **Chatwoot** ✅
  - API-first, realtime, modern UX
  - Better choice over Zammad
  - ⚠️ Don't fork deeply—extend via webhooks + APIs
  - **Integration**: Webhook → Orchestrator → Activity Timeline

#### Team Collaboration
- **Matrix + Element** ✅
  - Correct for long-term sovereignty
  - ⚠️ UX cohesion is your responsibility
  - **Integration**: Matrix webhooks + Element embedding

#### Video Conferencing
- **Jitsi Meet** ✅
  - Correct choice
  - ⚠️ Resource-heavy—gate behind scheduled/approval-based usage
  - **Integration**: Jitsi API for room creation, embed in Shell

#### Whiteboard / Collaboration
- **tldraw** ✅
  - Best possible call
  - Embed tldraw, persist snapshots in your DB
  - ❌ Don't host AFFiNE early (distraction)
  - **Integration**: React component, save to PostgreSQL

#### Backend Framework (Orchestrator)
- **Recommended**: FastAPI (Python) or Express.js (Node.js)
  - FastAPI: Better for async, type safety, OpenAPI docs
  - Express.js: JavaScript/TypeScript consistency with frontend
  - **Decision needed**: Choose based on team expertise

#### Database
- **PostgreSQL** ✅
  - Primary database for orchestrator
  - Supports LISTEN/NOTIFY for event bus
  - JSONB for flexible schema (activity timeline, approvals metadata)

#### Caching & Events
- **Redis** ✅
  - Session storage
  - Rate limiting
  - Event bus alternative to Postgres LISTEN/NOTIFY
  - Chatwoot dependency

### ⚠️ Deferred Technologies

#### Workflow Engine
- **Camunda** = enterprise-grade, heavy, future-proof
- **ApprovalFlow** = lightweight, fast
- **Decision**: Start without Camunda for MVP
  - Build minimal approval state machine in orchestration layer first
  - Introduce Camunda only when workflows explode in complexity
  - Avoids "BPMN-first paralysis" trap

#### Additional Services (Post-MVP)
- AFFiNE (documentation/wiki)
- Advanced analytics
- AI/ML features
- Federation-heavy Matrix config

---

## 📦 Monorepo Structure

### Current Structure

```
axis-afenda/
├── apps/
│   └── web/                    # Next.js Shell App (rename to 'shell'?)
│       ├── src/
│       │   └── app/           # App Router pages
│       ├── package.json
│       └── next.config.ts
│
├── packages/
│   └── design-system/         # shadcn/ui components
│       ├── components/        # 50+ UI components
│       ├── hooks/             # React hooks (use-mobile, etc.)
│       ├── lib/               # Utilities (cn, fonts, etc.)
│       ├── providers/         # Theme provider
│       └── styles/            # Global CSS with Tailwind v4
│
├── package.json               # Root workspace config
├── pnpm-workspace.yaml        # pnpm workspace definition
├── turbo.json                 # Turborepo pipeline config
└── .dev-docs/                 # Project documentation
```

### Recommended Structure (Future)

```
axis-afenda/
├── apps/
│   ├── shell/                 # Next.js Shell App (rename from 'web')
│   │   ├── src/
│   │   │   ├── app/           # App Router
│   │   │   ├── components/   # Shell-specific components
│   │   │   ├── lib/           # Shell utilities
│   │   │   └── modules/       # Module registry (Chatwoot, Matrix, etc.)
│   │   └── package.json
│   │
│   └── orchestrator/          # API Service (to be created)
│       ├── src/
│       │   ├── api/           # API routes
│       │   ├── services/      # Business logic
│       │   ├── models/         # Database models
│       │   ├── webhooks/      # Webhook handlers
│       │   └── events/         # Event bus handlers
│       └── package.json
│
├── packages/
│   ├── design-system/         # ✅ Already exists
│   ├── shared/                 # To be created
│   │   ├── types/             # Shared TypeScript types
│   │   ├── constants/         # Shared constants
│   │   └── utils/              # Shared utilities
│   └── database/               # To be created (optional)
│       └── schema/             # Prisma/Drizzle schema
│
├── docker/
│   ├── docker-compose.yml     # Local development
│   └── docker-compose.prod.yml # Production
│
└── .dev-docs/                 # Project documentation
```

### Package Naming Convention

- **Apps**: `@axis-afenda/shell`, `@axis-afenda/orchestrator`
- **Packages**: `@axis-afenda/design-system`, `@axis-afenda/shared`

---

## ⚠️ Risk Mitigation

### Risk 1: "Iframe Soup" - Disjointed User Experience

**Problem**: If you iframe everything, users will feel it's stitched together.

**Solution**: Build a **Shell App (Next.js)** that owns:
- Navigation (unified sidebar, topbar)
- Context (org / team / project switcher)
- Permissions (derived from Keycloak)
- Notifications (unified notification center)
- URL structure (`/app/module-name` pattern)
- Design system (consistent UI across all modules)

**Implementation**:
- Use design system components for all Shell UI
- Create `<ModuleEmbed>` component for iframe wrapping
- Implement module registry pattern
- Use Next.js App Router for module routing

Everything else is a **capability**, not a product.

---

### Risk 2: Permission Drift Across Systems

**Problem**: Keycloak groups ≠ Chatwoot roles ≠ Matrix power levels.

**Solution**:
- **Keycloak = source of truth**
- Sync **downward only** (Keycloak → Orchestrator → External Services)
- **Never allow local role edits** in sub-systems
- Implement sync job that runs periodically
- Log all permission changes for audit

> **Rule**: If a permission can't be expressed in Keycloak, it doesn't exist.

**Implementation Pattern**:
```typescript
// Orchestrator sync job
async function syncPermissionsFromKeycloak() {
  const keycloakGroups = await keycloak.getGroups();
  await chatwoot.syncRoles(keycloakGroups);
  await matrix.syncPowerLevels(keycloakGroups);
}
```

---

### Risk 3: Over-automating Too Early

**Problem**: Camunda + BPMN + approvals on Day 1 = slow death.

**Solution**: Start with simple state machine:
```
Draft → Submitted → Approved → Rejected
```

**State Machine Implementation**:
```typescript
type ApprovalStatus = 'draft' | 'submitted' | 'approved' | 'rejected';

const transitions: Record<ApprovalStatus, ApprovalStatus[]> = {
  draft: ['submitted'],
  submitted: ['approved', 'rejected'],
  approved: [],
  rejected: []
};
```

Add complexity only when forced (e.g., multi-step approvals, conditional routing).

---

### Risk 4: Database Schema Evolution

**Problem**: Schema changes break integrations and require migrations.

**Solution**:
- Use migration tool (Prisma Migrate, Drizzle, or raw SQL)
- Version all API endpoints
- Use feature flags for breaking changes
- Maintain backward compatibility for at least 2 versions

---

### Risk 5: Event Bus Reliability

**Problem**: Lost events = broken integrations.

**Solution**:
- Use idempotent webhook handlers
- Implement retry logic with exponential backoff
- Store webhook events in database before processing
- Use dead letter queue for failed events
- Monitor event processing latency

---

## 🐳 Infrastructure & Services

### ✅ Included in v0 Docker Compose

**Infrastructure**
- **PostgreSQL 16+**
  - Primary database for orchestrator
  - Separate databases per service (optional)
  - Connection pooling (PgBouncer recommended for production)

- **Redis 7+**
  - Session storage
  - Rate limiting
  - Event bus (alternative to Postgres LISTEN/NOTIFY)
  - Chatwoot dependency

- **Nginx / Traefik**
  - Single entrypoint (reverse proxy)
  - SSL termination
  - Load balancing (production)

**Core Services**
- **Keycloak 24+** (Identity)
  - Port: 8080 (internal), 8443 (HTTPS)
  - Database: PostgreSQL (separate instance or shared)
  - Admin console: `/admin`

- **Chatwoot** (Omnichannel)
  - Port: 3000 (web), 8080 (Rails)
  - Dependencies: PostgreSQL, Redis
  - Webhook endpoint: `/webhooks/chatwoot`

- **Matrix Synapse** (Team Chat)
  - Port: 8008 (HTTP), 8448 (HTTPS)
  - Database: PostgreSQL
  - Federation: Disabled for MVP

- **Jitsi Meet** (Video Conferencing)
  - Port: 80/443 (web), 4443 (TURN)
  - Resource-heavy: Gate behind approvals
  - API for room creation

**Your Product**
- `apps/shell` (Next.js)
  - Port: 3000 (dev), 80/443 (prod)
  - Environment: Node.js 20+

- `apps/orchestrator` (API Service)
  - Port: 8000 (dev), 80/443 (prod)
  - Framework: FastAPI or Express.js
  - Environment: Python 3.11+ or Node.js 20+

- `event-bus` (simple: Postgres + LISTEN/NOTIFY or Redis Pub/Sub)
  - No separate service needed
  - Implemented in orchestrator

### 🚫 Not Included Yet

- Camunda (workflow engine)
- AFFiNE (documentation/wiki)
- Federation-heavy Matrix config
- Advanced analytics
- AI/ML services
- Monitoring stack (Prometheus, Grafana) - Add in Phase 2

---

## 🗺️ Implementation Roadmap

### Phase 1: Foundation (Weeks 1-2)

#### Step 1: Build the Product Shell (Next.js) ✅ IN PROGRESS

**Goal**: One URL space, one nav, one session, one tenant context.

**Current Status**: 
- ✅ Next.js v16 app created (`apps/web`)
- ✅ Design system integrated (`packages/design-system`)
- ⏳ Shell structure to be implemented

**Deliverables**:
- [ ] Rename `apps/web` → `apps/shell` (or keep as is)
- [ ] Implement `/app` routes with left sidebar + topbar
- [ ] **Tenant switcher**: Individual → Team → Org
- [ ] "App registry" page (which modules are enabled)
- [ ] Clean embedding wrapper component (`<ModuleEmbed>`)
- [ ] Module routing system
- [ ] Notification center UI

**Why first**: Every other tool will plug into this.

**Monorepo Structure**:
```
apps/
  shell/          # Next.js Shell App (rename from 'web')
  orchestrator/   # API service (to be created)
packages/
  design-system/  # ✅ UI components (already exists)
  shared/         # To be created (types, utils, constants)
```

---

#### Step 2: Orchestrator API (Your "Truth Engine")

**Goal**: SSOT for identity mapping + approvals + cross-tool events.

**Technology Choice Needed**:
- FastAPI (Python) - Recommended for async, type safety, OpenAPI
- Express.js (Node.js) - Consistency with frontend stack

**MVP Endpoints**:
```
# Approvals
POST   /api/v1/approvals/requests
GET    /api/v1/approvals/:id
POST   /api/v1/approvals/:id/submit
POST   /api/v1/approvals/:id/approve
POST   /api/v1/approvals/:id/reject
GET    /api/v1/approvals                    # List with filters

# Webhooks
POST   /api/v1/webhooks/chatwoot
POST   /api/v1/webhooks/matrix
POST   /api/v1/webhooks/keycloak            # User/group sync

# Rooms
POST   /api/v1/rooms/consultation/create
GET    /api/v1/rooms/:id
DELETE /api/v1/rooms/:id

# Activity Timeline
GET    /api/v1/activity                     # Unified feed
GET    /api/v1/activity/:id

# Tenants
GET    /api/v1/tenants                      # List accessible tenants
GET    /api/v1/tenants/:id
POST   /api/v1/tenants/:id/switch           # Switch context
```

**Data Storage**:
- org/team membership (mirrored from Keycloak)
- approvals ledger (immutable audit trail)
- "activity timeline" (one feed across everything)
- webhook events (for replay/debugging)

**Database Schema** (see [Database Schema](#database-schema) section)

---

#### Step 3: Identity - Keycloak SSO Integration

**Goal**: Everything uses your login + tenant context.

**MVP**:
- NextAuth.js (or custom OIDC) + Keycloak
- group/role mapping into your DB
- "no local roles" rule enforced
- Session management with Redis

**Implementation**:
```typescript
// apps/shell/src/lib/auth.ts
import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak';

export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Map Keycloak groups to app roles
      if (account && profile) {
        token.groups = profile.groups || [];
        token.roles = extractRoles(profile);
      }
      return token;
    },
    async session({ session, token }) {
      session.user.groups = token.groups;
      session.user.roles = token.roles;
      return session;
    },
  },
};
```

---

### Phase 2: First Integration (Week 3)

#### Step 4: Integrate Chatwoot

**Why first**: Gives immediate business value (omnichannel + shared inbox).

**Integration Pattern**:
- Don't fork Chatwoot
- Use Chatwoot webhooks → your orchestrator
- Shell shows Chatwoot inside "Customer Inbox" module
- "Escalate to CEO Approval" button calls your approvals API

**Webhook Events to Handle**:
- `message_created` - New customer message
- `conversation_updated` - Status changes
- `agent_assigned` - Agent assignment

**Implementation**:
```typescript
// apps/orchestrator/src/webhooks/chatwoot.ts
export async function handleChatwootWebhook(event: ChatwootEvent) {
  // Store in activity timeline
  await activityTimeline.create({
    type: 'chatwoot_message',
    source: 'chatwoot',
    data: event,
    tenantId: event.account_id,
  });

  // If escalation requested, create approval
  if (event.type === 'message_created' && event.escalate) {
    await approvals.create({
      type: 'ceo_approval',
      source: 'chatwoot',
      sourceId: event.conversation_id,
      tenantId: event.account_id,
    });
  }
}
```

---

### Phase 3: Additional Integrations (Week 4+)

#### Step 5: Team Chat - Matrix

**Timing**: After tenant context, permissions model, and audit feed are established.

**Why later**: Matrix is powerful but biggest ops/UX rabbit hole.

**Integration**:
- Matrix webhooks for room events
- Element embedding in Shell
- Sync Matrix rooms with tenant structure
- Map Keycloak groups to Matrix room permissions

---

#### Step 6: Consultation Rooms - Jitsi

**Timing**: After approvals system is working.

**Integration**:
- "Approved" → room created via Jitsi API
- room link stored + audited in orchestrator
- room embedded in Shell
- Auto-cleanup after meeting ends

**Implementation**:
```typescript
// When approval is approved
if (approval.status === 'approved' && approval.type === 'consultation_room') {
  const room = await jitsi.createRoom({
    name: `consultation-${approval.id}`,
    moderator: approval.requestedBy,
  });
  
  await rooms.create({
    approvalId: approval.id,
    jitsiRoomId: room.id,
    jitsiUrl: room.url,
    expiresAt: addHours(new Date(), 2),
  });
}
```

---

#### Step 7: Whiteboard - tldraw

**Timing**: Last (but easy).

**Integration**:
- Embed tldraw React component
- Save snapshots to PostgreSQL (JSONB)
- Link to approvals / conversations / teams
- Version history support

---

## 🎯 Orchestration Layer (Core Moat)

This is the **only thing you truly "build."**

### Responsibilities

- **Tenant Resolution** (individual → team → org)
  - Resolve user's accessible tenants from Keycloak
  - Support tenant switching
  - Enforce tenant isolation

- **Approval Logic**
  - Simple state machine (Draft → Submitted → Approved/Rejected)
  - Approval types (CEO approval, consultation room, etc.)
  - Approval routing (who can approve what)

- **Cross-service Permissions**
  - Map Keycloak groups to service-specific roles
  - Sync permissions downward (Keycloak → Services)
  - Cache permission mappings

- **Webhook Ingestion**
  - Receive webhooks from external services
  - Validate webhook signatures
  - Route to appropriate handlers
  - Store for audit/replay

- **Unified Activity Timeline**
  - Aggregate events from all services
  - Filter by tenant, user, type
  - Real-time updates via WebSocket/SSE

- **"CEO consultation room" Lifecycle**
  - Create room on approval
  - Manage room access
  - Cleanup expired rooms
  - Audit room usage

### Design Philosophy

> **Control Plane**, not Business Logic Engine

Think of it as the "glue" that makes all services work together as one product.

### Technology Stack (Orchestrator)

**Option 1: FastAPI (Python)**
- ✅ Excellent async support
- ✅ Automatic OpenAPI docs
- ✅ Type safety with Pydantic
- ✅ Great for data processing

**Option 2: Express.js (Node.js)**
- ✅ Same language as frontend
- ✅ Large ecosystem
- ✅ Easy to find developers
- ⚠️ Less type safety (TypeScript helps)

**Recommendation**: FastAPI for better async/type safety, unless team is more comfortable with Node.js.

---

## 🔌 API Design Patterns

### RESTful Conventions

- Use HTTP verbs correctly (GET, POST, PUT, DELETE, PATCH)
- Version APIs: `/api/v1/...`
- Use plural nouns for resources: `/api/v1/approvals`
- Filter, sort, paginate: `/api/v1/approvals?status=submitted&page=1&limit=20`

### Response Format

```typescript
// Success response
{
  "data": { ... },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 100
  }
}

// Error response
{
  "error": {
    "code": "APPROVAL_NOT_FOUND",
    "message": "Approval with id '123' not found",
    "details": { ... }
  }
}
```

### Authentication

- Use Bearer tokens (JWT from Keycloak)
- Include tenant context in headers or JWT claims
- Validate tokens on every request

### Rate Limiting

- Use Redis for rate limiting
- Different limits per endpoint type
- Return `429 Too Many Requests` with retry-after header

### Idempotency

- Use idempotency keys for mutating operations
- Store in Redis with TTL
- Return same response for duplicate requests

---

## 🗄️ Database Schema

### Core Tables

```sql
-- Tenants (mirrored from Keycloak)
CREATE TABLE tenants (
  id UUID PRIMARY KEY,
  keycloak_realm_id VARCHAR(255) UNIQUE NOT NULL,
  keycloak_group_id VARCHAR(255),
  type VARCHAR(50) NOT NULL, -- 'individual', 'team', 'org'
  name VARCHAR(255) NOT NULL,
  parent_id UUID REFERENCES tenants(id),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Users (mirrored from Keycloak)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  keycloak_user_id VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User-Tenant relationships
CREATE TABLE user_tenants (
  user_id UUID REFERENCES users(id),
  tenant_id UUID REFERENCES tenants(id),
  role VARCHAR(50) NOT NULL, -- 'owner', 'admin', 'member', 'viewer'
  PRIMARY KEY (user_id, tenant_id)
);

-- Approvals
CREATE TABLE approvals (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  type VARCHAR(50) NOT NULL, -- 'ceo_approval', 'consultation_room', etc.
  status VARCHAR(50) NOT NULL, -- 'draft', 'submitted', 'approved', 'rejected'
  requested_by UUID REFERENCES users(id) NOT NULL,
  approved_by UUID REFERENCES users(id),
  source VARCHAR(50), -- 'chatwoot', 'manual', etc.
  source_id VARCHAR(255), -- ID in source system
  metadata JSONB, -- Flexible data per approval type
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP,
  rejected_at TIMESTAMP
);

-- Activity Timeline
CREATE TABLE activity_timeline (
  id UUID PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50) NOT NULL, -- 'chatwoot_message', 'approval_created', etc.
  source VARCHAR(50) NOT NULL, -- 'chatwoot', 'orchestrator', etc.
  title VARCHAR(255) NOT NULL,
  description TEXT,
  data JSONB, -- Event-specific data
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_activity_tenant ON activity_timeline(tenant_id, created_at DESC);
CREATE INDEX idx_activity_user ON activity_timeline(user_id, created_at DESC);

-- Rooms (Jitsi consultation rooms)
CREATE TABLE rooms (
  id UUID PRIMARY KEY,
  approval_id UUID REFERENCES approvals(id),
  tenant_id UUID REFERENCES tenants(id) NOT NULL,
  jitsi_room_id VARCHAR(255) UNIQUE NOT NULL,
  jitsi_url TEXT NOT NULL,
  created_by UUID REFERENCES users(id) NOT NULL,
  expires_at TIMESTAMP,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Webhook Events (for audit/replay)
CREATE TABLE webhook_events (
  id UUID PRIMARY KEY,
  source VARCHAR(50) NOT NULL, -- 'chatwoot', 'matrix', etc.
  event_type VARCHAR(100) NOT NULL,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  error TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_webhook_processed ON webhook_events(processed, created_at);
```

### Migration Strategy

- Use Prisma, Drizzle, or raw SQL migrations
- Version all migrations
- Test migrations on staging first
- Support rollback scripts

---

## 🔒 Security Considerations

### Authentication & Authorization

- **Keycloak Integration**
  - Use OIDC/OAuth2 flows
  - Validate JWT tokens on every request
  - Implement token refresh
  - Store refresh tokens securely

- **Tenant Isolation**
  - Always validate tenant access in API
  - Use Row Level Security (RLS) in PostgreSQL if possible
  - Never expose cross-tenant data

- **API Security**
  - Rate limiting per user/tenant
  - Input validation (use Zod/Pydantic)
  - SQL injection prevention (use ORM/parameterized queries)
  - XSS prevention (sanitize user input)

### Webhook Security

- Validate webhook signatures
- Use HMAC for signature verification
- Whitelist webhook source IPs (if possible)
- Store webhook events for audit

### Data Protection

- Encrypt sensitive data at rest (PII, tokens)
- Use HTTPS everywhere
- Implement CORS policies
- Sanitize logs (don't log sensitive data)

### Secrets Management

- Use environment variables for secrets
- Never commit secrets to git
- Use secret management service (HashiCorp Vault, AWS Secrets Manager) in production
- Rotate secrets regularly

---

## 🚀 MVP Feature Definition

### Core MVP Feature: Customer Inbox → Escalation → Approval

**User Flow**:
1. Customer message arrives in Chatwoot
2. Agent clicks "Escalate to CEO Approval" button in Shell App
3. Approval request created in orchestrator
4. CEO sees approval notification in Shell App
5. CEO views approval details and approves/rejects
6. Decision logged in audit trail
7. Agent notified of decision
8. Activity appears in unified timeline

### Why This Proves Everything

This single loop validates:
- ✅ Multi-tenant works (tenant isolation)
- ✅ Approvals work (state machine)
- ✅ Audit trail works (immutable logging)
- ✅ External tool integration works (Chatwoot webhooks)
- ✅ Real-time updates work (notifications)
- ✅ "The Machine" exists (orchestration layer)

### Acceptance Criteria

- [ ] Agent can escalate conversation from Chatwoot UI
- [ ] Approval appears in CEO's dashboard within 5 seconds
- [ ] CEO can approve/reject with one click
- [ ] Agent receives notification of decision
- [ ] All actions logged in activity timeline
- [ ] Approval state persisted correctly
- [ ] Tenant isolation enforced (CEO only sees their org's approvals)

---

## 🧪 Testing Strategy

### Unit Tests

- Test approval state machine transitions
- Test permission mapping logic
- Test webhook handlers
- Test utility functions

### Integration Tests

- Test API endpoints with test database
- Test Keycloak integration (mock or test instance)
- Test webhook ingestion
- Test event bus

### E2E Tests

- Test complete approval flow
- Test tenant switching
- Test Chatwoot integration
- Use Playwright or Cypress

### Test Data

- Use factories for test data generation
- Seed test database with realistic data
- Clean up after tests

---

## 🚢 Deployment & Operations

### Development Environment

- Docker Compose for local development
- Hot reload for all services
- Local Keycloak instance
- Test data seeding script

### Staging Environment

- Mirror production setup
- Use production-like data volumes
- Automated testing on deploy
- Performance testing

### Production Environment

- **Infrastructure**
  - Container orchestration (Kubernetes or Docker Swarm)
  - Load balancer (Nginx/Traefik)
  - Database backups (automated, daily)
  - Monitoring (Prometheus + Grafana)

- **CI/CD**
  - Automated tests on PR
  - Build Docker images
  - Deploy to staging on merge to main
  - Manual approval for production

- **Monitoring**
  - Application logs (centralized logging)
  - Error tracking (Sentry)
  - Performance metrics (APM)
  - Uptime monitoring

- **Backup & Recovery**
  - Daily database backups
  - Test restore procedures monthly
  - Disaster recovery plan

---

## 📊 Timeline & Risk Assessment

| Approach                          | Time          | Risk         |
| --------------------------------- | ------------- | ------------ |
| Build everything                  | 3–6 months    | 🔥 Very high |
| Clone everything blindly          | 2–3 weeks     | 😵 UX mess   |
| **Clone + integrate (this plan)** | **2–4 weeks** | ✅ Controlled |

### Realistic Timeline

- **Week 1**: Shell App structure + Design System integration ✅ (in progress)
- **Week 2**: Orchestrator API + Keycloak integration
- **Week 3**: Chatwoot integration + MVP feature
- **Week 4**: Testing, bug fixes, polish

---

## 🎯 Immediate Next Steps

### What to Build Today

1. **Complete Shell App Structure** (`apps/web` or rename to `apps/shell`)
   - [ ] Implement tenant switcher UI
   - [ ] Create module sidebar component
   - [ ] Build embed wrapper component (`<ModuleEmbed>`)
   - [ ] Set up module routing

2. **Create `apps/orchestrator`**
   - [ ] Choose framework (FastAPI or Express.js)
   - [ ] Set up project structure
   - [ ] Create database schema
   - [ ] Implement approvals API
   - [ ] Implement activity timeline API

3. **Wire Keycloak login**
   - [ ] Set up NextAuth.js with Keycloak
   - [ ] Implement tenant context in session
   - [ ] Create org/team membership sync job

4. **Create `packages/shared`**
   - [ ] Shared TypeScript types
   - [ ] Constants (approval statuses, etc.)
   - [ ] Shared utilities

---

## 📝 Additional Deliverables Needed

1. **Service topology design** (ports, auth flow, trust boundaries)
2. **Docker Compose draft** (clean, minimal, prod-shaped)
3. **Orchestration API contracts** (OpenAPI/Swagger spec)
4. **Keycloak → Chatwoot → Matrix role mapping** (precise definitions)
5. **Shell App navigation & embedding rules** (design spec)
6. **Database migration scripts** (initial schema)
7. **Environment variable documentation** (.env.example files)

---

## 🔑 Key Takeaways

1. **Shell App + Orchestration = Your Product** - Everything else is a capability
2. **Keycloak = Single Source of Truth** - Never allow permission drift
3. **Start Simple** - Draft → Submitted → Approved → Rejected is enough
4. **Integrate One Tool at a Time** - Chatwoot first, then Matrix, then Jitsi
5. **MVP Feature = One Complete Loop** - Customer Inbox → Escalation → Approval
6. **Design System Already Exists** - Use it consistently across Shell App
7. **Event-Driven Architecture** - Use webhooks and event bus for loose coupling
8. **Security First** - Tenant isolation, input validation, audit logging

---

## 📚 Related Documentation

- [Design System Integration](./DESIGN_SYSTEM_INTEGRATION.md)
- [Architecture Details](./ARCHITECTURE.md)
- [Process Tracking](./PROCESS_TRACKING.md)

---

*Last Updated: 2026-01-28*
*Version: 2.0*
