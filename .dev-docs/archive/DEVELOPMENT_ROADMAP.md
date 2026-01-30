# AXIS AFENDA - Development Roadmap

> ⚠️ **Legacy.** Superseded by [PROJECT-SPEC.md](./PROJECT-SPEC.md) § Roadmap.

> **Goal**: Ship MVP in 4 weeks - Customer Inbox → Escalation → CEO Approval

---

## 🎯 MVP Definition

**Single Feature**: Agent escalates Chatwoot conversation → CEO approves/rejects → Decision logged

**Validates**: Multi-tenant, approvals, audit trail, external integration, real-time updates

---

## 📅 Timeline Overview

| Week | Focus | Deliverable |
|------|-------|-------------|
| **Week 1** | Shell App Foundation | Tenant switcher, module routing, Keycloak auth |
| **Week 2** | Orchestrator API | Approvals API, activity timeline, database |
| **Week 3** | Chatwoot Integration | Webhook handling, escalation flow, MVP feature |
| **Week 4** | Polish & Testing | Bug fixes, E2E tests, documentation |

---

## 🚀 Phase 1: Shell App Foundation (Week 1)

### Day 1-2: Project Setup & Structure

**Tasks**:
- [ ] Rename `apps/web` → `apps/shell` (or keep as is)
- [ ] Create `packages/shared` for types and constants
- [ ] Set up Docker Compose with PostgreSQL, Redis, Keycloak
- [ ] Configure environment variables (.env.example)

**Deliverables**:
- Monorepo structure finalized
- Local development environment running
- Keycloak instance accessible

---

### Day 3-4: Shell App Core UI

**Tasks**:
- [ ] Create `/app` layout with sidebar + topbar (using design-system)
- [ ] Implement tenant switcher component (Individual → Team → Org)
- [ ] Build module registry page (list enabled modules)
- [ ] Create `<ModuleEmbed>` component for iframe wrapping
- [ ] Set up module routing system (`/app/modules/:name`)

**Components to Build**:
```typescript
// apps/shell/src/components/
- AppLayout.tsx          // Main shell layout
- Sidebar.tsx            // Navigation sidebar
- TenantSwitcher.tsx     // Tenant selector
- ModuleEmbed.tsx         // Iframe wrapper
- NotificationCenter.tsx // Unified notifications
```

**Deliverables**:
- Shell app UI structure complete
- Navigation working
- Module embedding ready

---

### Day 5: Keycloak Authentication

**Tasks**:
- [ ] Install NextAuth.js
- [ ] Configure Keycloak provider
- [ ] Implement login/logout flow
- [ ] Store tenant context in session
- [ ] Create auth middleware for protected routes

**Implementation**:
```typescript
// apps/shell/src/lib/auth.ts
- Keycloak OIDC configuration
- JWT token handling
- Session management
- Tenant context extraction
```

**Deliverables**:
- Users can log in via Keycloak
- Session persists across page loads
- Tenant context available in app

---

## 🔧 Phase 2: Orchestrator API (Week 2)

### Day 1-2: Project Setup

**Tasks**:
- [ ] Create `apps/orchestrator` (choose: FastAPI or Express.js)
- [ ] Set up project structure (API routes, services, models)
- [ ] Configure database connection (PostgreSQL)
- [ ] Set up database migrations tool (Prisma/Drizzle)

**Recommended Structure**:
```
apps/orchestrator/
  src/
    api/          # API routes
    services/     # Business logic
    models/       # Database models
    webhooks/     # Webhook handlers
    events/       # Event bus
```

**Deliverables**:
- Orchestrator project initialized
- Database connection working
- Migration system ready

---

### Day 3-4: Database Schema & Models

**Tasks**:
- [ ] Create database schema (tenants, users, approvals, activity_timeline)
- [ ] Set up ORM models (Prisma/Drizzle)
- [ ] Create migration scripts
- [ ] Seed test data

**Core Tables**:
- `tenants` - Organizations, teams, individuals
- `users` - Mirrored from Keycloak
- `user_tenants` - User-tenant relationships
- `approvals` - Approval requests
- `activity_timeline` - Unified event feed
- `webhook_events` - Webhook audit log

**Deliverables**:
- Database schema created
- Models defined
- Test data seeded

---

### Day 5: Approvals API

**Tasks**:
- [ ] Implement approval state machine (Draft → Submitted → Approved/Rejected)
- [ ] Create API endpoints:
  - `POST /api/v1/approvals/requests`
  - `GET /api/v1/approvals/:id`
  - `POST /api/v1/approvals/:id/submit`
  - `POST /api/v1/approvals/:id/approve`
  - `POST /api/v1/approvals/:id/reject`
  - `GET /api/v1/approvals` (list with filters)
- [ ] Add input validation
- [ ] Implement tenant isolation

**Deliverables**:
- Approvals API fully functional
- State machine working
- Tenant isolation enforced

---

### Day 6-7: Activity Timeline & Keycloak Sync

**Tasks**:
- [ ] Implement activity timeline API (`GET /api/v1/activity`)
- [ ] Create webhook endpoint structure (`POST /api/v1/webhooks/:source`)
- [ ] Build Keycloak sync job (users, groups → database)
- [ ] Set up event bus (Postgres LISTEN/NOTIFY or Redis)

**Deliverables**:
- Activity timeline working
- Webhook endpoints ready
- Keycloak sync automated

---

## 🔗 Phase 3: Chatwoot Integration (Week 3)

### Day 1-2: Chatwoot Setup

**Tasks**:
- [ ] Add Chatwoot to Docker Compose
- [ ] Configure Chatwoot webhooks
- [ ] Set up Chatwoot API access
- [ ] Test Chatwoot webhook delivery

**Deliverables**:
- Chatwoot running locally
- Webhooks configured
- API access working

---

### Day 3-4: Integration Implementation

**Tasks**:
- [ ] Implement Chatwoot webhook handler
- [ ] Store Chatwoot events in activity timeline
- [ ] Create "Escalate to CEO" button in Shell App
- [ ] Connect button to approvals API
- [ ] Display Chatwoot conversations in Shell App

**Webhook Events to Handle**:
- `message_created` - New customer message
- `conversation_updated` - Status changes

**Deliverables**:
- Chatwoot webhooks processed
- Escalation flow working
- Chatwoot UI embedded in Shell

---

### Day 5-7: MVP Feature Completion

**Tasks**:
- [ ] Complete end-to-end flow:
  1. Customer message in Chatwoot
  2. Agent clicks "Escalate to CEO"
  3. Approval created
  4. CEO sees notification
  5. CEO approves/rejects
  6. Agent notified
  7. Activity logged
- [ ] Add real-time notifications (WebSocket/SSE)
- [ ] Implement notification center UI
- [ ] Test complete flow

**Deliverables**:
- ✅ MVP feature working end-to-end
- Real-time updates functional
- All acceptance criteria met

---

## 🧪 Phase 4: Polish & Testing (Week 4)

### Day 1-3: Testing

**Tasks**:
- [ ] Write unit tests for approval state machine
- [ ] Write integration tests for API endpoints
- [ ] Write E2E tests for MVP flow (Playwright)
- [ ] Test tenant isolation
- [ ] Test error handling

**Deliverables**:
- Test coverage > 70%
- All critical paths tested
- E2E tests passing

---

### Day 4-5: Bug Fixes & Polish

**Tasks**:
- [ ] Fix identified bugs
- [ ] Improve error messages
- [ ] Add loading states
- [ ] Optimize performance
- [ ] Improve UI/UX

**Deliverables**:
- No critical bugs
- Smooth user experience
- Performance acceptable

---

### Day 6-7: Documentation & Deployment Prep

**Tasks**:
- [ ] Write API documentation (OpenAPI/Swagger)
- [ ] Create deployment guide
- [ ] Document environment variables
- [ ] Set up staging environment
- [ ] Prepare production deployment plan

**Deliverables**:
- Documentation complete
- Staging environment ready
- Deployment plan finalized

---

## 🛠️ Technology Decisions Needed

### Orchestrator Framework
- **Option A**: FastAPI (Python)
  - ✅ Better async, type safety, OpenAPI auto-docs
  - ⚠️ Different language from frontend
- **Option B**: Express.js (Node.js/TypeScript)
  - ✅ Same language, easier team onboarding
  - ⚠️ Less type safety, more boilerplate

**Recommendation**: FastAPI if team comfortable with Python, else Express.js

### Database ORM
- **Option A**: Prisma (TypeScript)
  - ✅ Great DX, type-safe queries
- **Option B**: Drizzle (TypeScript)
  - ✅ More SQL-like, lighter weight
- **Option C**: SQLAlchemy (Python, if FastAPI)
  - ✅ Mature, feature-rich

**Recommendation**: Prisma for TypeScript, SQLAlchemy for Python

---

## 📋 Immediate Next Steps (Start Today)

### Priority 1: Shell App Structure
1. Create `apps/shell/src/components/AppLayout.tsx`
2. Create `apps/shell/src/components/Sidebar.tsx`
3. Create `apps/shell/src/components/TenantSwitcher.tsx`
4. Set up `/app` routes structure

### Priority 2: Orchestrator Setup
1. Create `apps/orchestrator` project
2. Choose framework (FastAPI or Express.js)
3. Set up database connection
4. Create initial database schema

### Priority 3: Keycloak Integration
1. Set up Keycloak in Docker Compose
2. Configure NextAuth.js with Keycloak
3. Test login flow

---

## ✅ Success Criteria

**Week 1**: Shell app structure complete, Keycloak auth working

**Week 2**: Orchestrator API functional, database schema deployed

**Week 3**: Chatwoot integrated, MVP feature working end-to-end

**Week 4**: Tests passing, bugs fixed, ready for staging deployment

---

## 🚨 Risks & Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Keycloak setup complexity | High | Use official Keycloak Docker image, follow docs |
| Chatwoot webhook reliability | Medium | Implement retry logic, store events before processing |
| Database migration issues | Medium | Test migrations on staging first, have rollback plan |
| Timeline overrun | High | Focus on MVP only, defer nice-to-haves |

---

## 📚 Resources

- [Project Reference](./AXIS-AFENDA-PROJECT-REF.md) - Full technical details
- [Design System Docs](./DESIGN_SYSTEM_INTEGRATION.md) - UI components
- Keycloak Docs: https://www.keycloak.org/documentation
- Chatwoot API: https://www.chatwoot.com/developers/api

---

*Last Updated: 2026-01-28*
*Status: Ready to Start Development*
