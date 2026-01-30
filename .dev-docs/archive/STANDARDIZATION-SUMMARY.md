# AXIS-AFENDA Standardization Summary
> **Quick reference for domain standardization priorities**

## 📊 Current State

| Area | Completion | Status |
|------|-----------|--------|
| **API Clients** | 25% (2/8) | 🔴 Critical Gap |
| **Zustand Stores** | 37% (3/8) | ⚠️ Inconsistent |
| **SSE Real-time** | 25% (2/8) | 🔴 Critical Gap |
| **Type Safety (Zod)** | 0% | 🔴 Missing |
| **Stat Cards** | 37% (3/8) | ⚠️ Inconsistent |
| **Multi-select** | 37% (3/8) | ⚠️ Inconsistent |
| **Audit Trails** | 12% (1/8) | 🔴 Missing |
| **Component Reuse** | ~20% | 🔴 Low |

## 🎯 Top 5 Critical Issues

### 1. **Missing API Clients** 🔴
**Domains without API clients**: Consultations, Whiteboards, Tasks, Teams (5/8 missing)

**Impact**: No type safety, inconsistent error handling, manual fetch calls everywhere

**Fix**: Create standardized API clients using Approvals as template
```typescript
app/lib/api/
├── consultations.ts    // 🔴 Create
├── whiteboards.ts      // 🔴 Create
├── tasks.ts            // 🔴 Create
└── teams.ts            // 🔴 Create
```

### 2. **No Zod Validation** 🔴
**Impact**: Runtime errors, no type safety at boundaries, debugging nightmare

**Fix**: Add Zod schemas for all entity types
```typescript
app/lib/types/
├── approvals.ts        // Add Zod schemas
├── consultations.ts    // Add Zod schemas
├── conversations.ts    // Add Zod schemas
// ... etc
```

### 3. **Missing Real-time Updates** 🔴
**Domains without SSE**: Approvals, Inbox, Omnichannel, Whiteboards, Tasks, Teams (6/8 missing)

**Impact**: Stale data, manual refresh required, poor UX

**Fix**: Add SSE endpoints and hooks for all domains
```typescript
// Add SSE endpoints:
/api/v1/approvals/updates
/api/v1/conversations/updates
/api/v1/whiteboards/[id]/updates
/api/v1/tasks/updates
/api/v1/teams/updates
```

### 4. **Inconsistent State Management** ⚠️
**Domains without Zustand stores**: Consultations, Whiteboards, Tasks, Teams (5/8 missing)

**Impact**: Props drilling, inconsistent patterns, hard to maintain

**Fix**: Create Zustand stores for all domains
```typescript
app/lib/stores/
├── consultations-store.ts    // 🔴 Create
├── whiteboards-store.ts      // 🔴 Create
├── tasks-store.ts            // 🔴 Create
└── teams-store.ts            // 🔴 Create
```

### 5. **Scattered Type Definitions** 🔴
**Current**: Types in stores, components, and inline (no consistency)

**Impact**: Import confusion, duplicate definitions, no single source of truth

**Fix**: Centralize all types in `app/lib/types/`

## 🚀 Quick Win Priorities

### Week 1-2: Foundation Layer
1. **Centralize types** → Move all to `app/lib/types/`
2. **Add Zod schemas** → Runtime validation for all entities
3. **Create API clients** → Consistent fetch patterns
4. **Create Zustand stores** → Standardized state management

**Result**: Strong foundation for all future work

### Week 3-4: Real-time & UI
5. **Add SSE endpoints** → Real-time updates for all domains
6. **Add connection indicators** → Show SSE status
7. **Add stat cards** → Consistent metrics display
8. **Add multi-select** → Bulk operations

**Result**: Modern, real-time UX across all domains

### Week 5-6: Feature Parity
9. **Add audit trails** → Track changes in critical domains
10. **Add comments** → Discussion threads everywhere
11. **Shared components** → Reusable UI library
12. **Toast notifications** → User feedback

**Result**: Feature-complete, polished experience

## 📋 Implementation Checklist

### API Layer
- [ ] Create `app/lib/types/` directory with Zod schemas
- [ ] Create API clients for Consultations, Whiteboards, Tasks, Teams
- [ ] Add Zod validation to all API responses
- [ ] Standardize error handling across all API clients

### State Management
- [ ] Create Zustand stores for Consultations, Whiteboards, Tasks, Teams
- [ ] Add optimistic updates to all stores
- [ ] Implement caching with TTL
- [ ] Standardize store patterns

### Real-time Features
- [ ] Add SSE endpoint for Approvals updates
- [ ] Add SSE endpoint for Conversations updates
- [ ] Add SSE endpoint for Whiteboards updates
- [ ] Add SSE endpoint for Tasks updates
- [ ] Add SSE endpoint for Teams updates
- [ ] Create SSE hooks for each domain
- [ ] Add connection status indicators to all list pages

### UI Components
- [ ] Create `app/components/shared/` directory
- [ ] Extract shared components (filters, stats, tables, comments)
- [ ] Add stat cards to Inbox, Omnichannel, Whiteboards, Teams
- [ ] Add multi-select to Approvals, Inbox, Omnichannel, Teams
- [ ] Create generic hooks (filters, selection, pagination)

### Feature Additions
- [ ] Add audit trails to Consultations, Omnichannel, Tasks, Teams, Whiteboards
- [ ] Add comments to Approvals, Consultations, Tasks, Teams
- [ ] Add toast notifications throughout
- [ ] Improve form validation (Zod schemas)
- [ ] Add templates where appropriate

## 🎯 Success Metrics

| Metric | Before | Target | Progress |
|--------|--------|--------|----------|
| API Clients | 25% | 87% | ⬜⬜⬜⬜⬜⬜⬜ |
| Zustand Stores | 37% | 87% | ⬜⬜⬜⬜⬜⬜⬜ |
| SSE Real-time | 25% | 100% | ⬜⬜⬜⬜⬜⬜⬜ |
| Type Safety | 0% | 100% | ⬜⬜⬜⬜⬜⬜⬜ |
| Stat Cards | 37% | 87% | ⬜⬜⬜⬜⬜⬜⬜ |
| Multi-select | 37% | 87% | ⬜⬜⬜⬜⬜⬜⬜ |
| Audit Trails | 12% | 75% | ⬜⬜⬜⬜⬜⬜⬜ |
| Component Reuse | 20% | 60% | ⬜⬜⬜⬜⬜⬜⬜ |

## 📚 Reference Documents

- **[DOMAIN-COMPARISON-REPORT.md](DOMAIN-COMPARISON-REPORT.md)** - Full detailed analysis
- **[PROJECT-SPEC.md](PROJECT-SPEC.md)** - Architecture and stack reference
- **[AGENTS.md](../AGENTS.md)** - Agent guidelines and conventions

## 🔗 Quick Links

### Templates to Copy
- **API Client**: Use `app/lib/api/approvals.ts` as template
- **Zustand Store**: Use `app/lib/stores/approvals-store.ts` as template
- **SSE Endpoint**: Use `app/api/v1/activity/route.ts` as template
- **SSE Hook**: Use `app/hooks/use-meeting-updates.ts` as template

### Code Patterns
```typescript
// Standard API Client
export async function getEntities(): Promise<Entity[]> {
  const response = await fetch('/api/v1/entities');
  if (!response.ok) throw new Error('Failed to fetch');
  const data = await response.json();
  return EntityListSchema.parse(data); // Zod validation
}

// Standard Zustand Store
export const useEntityStore = create<EntityStore>((set, get) => ({
  entities: [],
  isLoading: false,
  fetchEntities: async () => {
    set({ isLoading: true });
    try {
      const entities = await apiClient.getEntities();
      set({ entities, isLoading: false });
    } catch (error) {
      set({ error, isLoading: false });
    }
  },
}));

// Standard SSE Hook
export function useEntityUpdates() {
  const { events, isConnected, error } = useSSEMulti(
    '/api/v1/entities/updates',
    ['entity_created', 'entity_updated', 'entity_deleted'],
    { enabled: true }
  );
  return { isConnected, error, updates: Array.from(events.values()) };
}
```

---

*Last updated: 2026-01-29*  
*Track progress: Update checkboxes as items are completed*
