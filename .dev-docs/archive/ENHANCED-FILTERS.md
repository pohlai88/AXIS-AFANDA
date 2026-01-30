# Enhanced Inbox Filters — Feature Documentation

## 📋 Overview

The AXIS-AFENDA inbox now features a **powerful, enterprise-grade filtering system** that enables agents to quickly find and manage conversations across multiple dimensions.

---

## ✨ Key Features

### 1. **Quick Filter Presets**
Pre-configured filters for common workflows:

| Preset | Description | Filters Applied |
|--------|-------------|-----------------|
| **My Open** | Conversations assigned to you | `status: open`, `assigneeId: me` |
| **Urgent** | High-priority open conversations | `status: open`, `priority: urgent` |
| **Escalated** | Conversations with active escalations | `hasEscalation: true`, `status: open` |
| **Unread** | Conversations with unread messages | `unreadOnly: true` |
| **Pending** | Conversations awaiting response | `status: pending` |
| **Resolved** | Completed conversations | `status: resolved` |

### 2. **Standard Filters**

#### Status
- **Open**: Active conversations
- **Pending**: Awaiting customer response
- **Resolved**: Completed conversations
- **Snoozed**: Temporarily hidden

#### Priority
- **Urgent**: Critical issues (red indicator)
- **High**: Important issues (orange indicator)
- **Medium**: Standard priority (yellow indicator)
- **Low**: Low priority (blue indicator)

#### Assignee
- **All assignees**: Show all conversations
- **Assigned to me**: Only conversations assigned to current user
- **Unassigned**: Conversations without an assignee

### 3. **Special Filters**

#### Has Escalation
- **Purpose**: Find conversations with active approval requests
- **Use Case**: CEO/Manager reviewing escalated issues
- **Integration**: Joins with `approvals` table, filters for `status: submitted`

#### Unread Only
- **Purpose**: Show conversations with unread messages
- **Use Case**: Quickly catch up on new activity
- **Filter**: `unreadCount > 0`

### 4. **Advanced Filters**

#### Labels
- **Multi-select**: Choose multiple labels
- **Common labels**: `bug`, `feature-request`, `billing`, `technical`, `sales`, `support`, `vip`, `urgent`
- **JSONB query**: Uses PostgreSQL JSONB contains operator for efficient filtering

#### Date Range
- **From Date**: Filter conversations created after this date
- **To Date**: Filter conversations created before this date
- **Use Case**: Monthly reports, time-based analysis

#### Sort Options
- **Last Message**: Sort by most recent activity (default)
- **Priority**: Sort by priority level
- **Created Date**: Sort by conversation creation time
- **Unread Count**: Sort by number of unread messages

#### Sort Order
- **Descending**: Newest/highest first (default)
- **Ascending**: Oldest/lowest first

---

## 🎯 Filter Combinations

### Common Workflows

#### 1. **Morning Triage**
```typescript
{
  status: 'open',
  assigneeId: 'me',
  sortBy: 'priority',
  sortOrder: 'desc'
}
```
Shows your open conversations, highest priority first.

#### 2. **Escalation Review (CEO/Manager)**
```typescript
{
  hasEscalation: true,
  status: 'open',
  sortBy: 'lastMessage'
}
```
Shows all conversations awaiting approval, most recent first.

#### 3. **VIP Customer Support**
```typescript
{
  labels: ['vip'],
  status: 'open',
  unreadOnly: true
}
```
Shows unread conversations from VIP customers.

#### 4. **Weekly Report**
```typescript
{
  dateFrom: new Date('2026-01-21'),
  dateTo: new Date('2026-01-28'),
  status: 'resolved'
}
```
Shows all resolved conversations from the past week.

#### 5. **Urgent Unassigned**
```typescript
{
  priority: 'urgent',
  assigneeId: 'unassigned',
  status: 'open'
}
```
Finds urgent conversations that need immediate assignment.

---

## 🔧 Technical Implementation

### Backend (Orchestrator)

#### Validation Schema
```typescript
// apps/orchestrator/src/lib/validation.ts
export const conversationFiltersSchema = z.object({
  status: z.enum(['open', 'resolved', 'pending', 'snoozed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assigneeId: z.coerce.number().int().optional(),
  teamId: z.coerce.number().int().optional(),
  labels: z.array(z.string()).optional(),
  search: z.string().optional(),
  hasEscalation: z.coerce.boolean().optional(),
  unreadOnly: z.coerce.boolean().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
  sortBy: z.enum(['lastMessage', 'priority', 'created', 'unread']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});
```

#### Query Building
```typescript
// apps/orchestrator/src/routes/conversations.ts

// Standard filters
if (status) conditions.push(eq(schema.conversations.status, status));
if (priority) conditions.push(eq(schema.conversations.priority, priority));

// Unread filter
if (unreadOnly) {
  conditions.push(sql`${schema.conversations.unreadCount} > 0`);
}

// Date range filters
if (dateFrom) {
  conditions.push(sql`${schema.conversations.createdAt} >= ${dateFrom}`);
}

// Label filtering (JSONB contains)
if (labels && labels.length > 0) {
  conditions.push(sql`${schema.conversations.labels} @> ${JSON.stringify(labels)}`);
}

// Escalation filter (join with approvals)
if (hasEscalation) {
  query = query.innerJoin(
    schema.approvals,
    and(
      eq(schema.approvals.conversationId, schema.conversations.id),
      eq(schema.approvals.status, 'submitted')
    )
  );
}
```

### Frontend (Shell)

#### Component Structure
```
app/components/inbox/inbox-filters.tsx
├── Quick Presets (6 buttons)
├── Standard Filters (Status, Priority, Assignee)
├── Special Filters (Escalation, Unread)
├── Advanced Filters (Toggle)
│   ├── Labels (Multi-select badges)
│   ├── Date Range (Calendar pickers)
│   └── Sort Options (Dropdowns)
└── Active Filters Display (Removable badges)
```

#### State Management
```typescript
// app/app/inbox/page.tsx
const [filters, setFilters] = useState({
  status: 'open', // Default to open conversations
});

// Filters are debounced and trigger API calls
useEffect(() => {
  fetchConversations();
}, [filters]);
```

---

## 🎨 UI/UX Features

### Visual Indicators
- **Active filter count badge**: Shows number of active filters
- **Preset highlighting**: Active preset shown with primary variant
- **Priority colors**: Visual priority indicators in dropdowns
- **Removable badges**: Click X to remove individual filters
- **Reset button**: Clear all filters at once

### Accessibility
- **Keyboard navigation**: All filters accessible via keyboard
- **ARIA labels**: Proper labeling for screen readers
- **Focus management**: Clear focus indicators
- **Semantic HTML**: Proper form structure

### Performance
- **Debounced search**: 300ms delay to reduce API calls
- **Optimized queries**: Indexed columns for fast filtering
- **Pagination**: Limit results to prevent overload
- **Lazy loading**: Advanced filters hidden by default

---

## 📊 Database Indexes

Ensure these indexes exist for optimal performance:

```sql
-- Conversations table
CREATE INDEX conversations_tenant_idx ON conversations(tenant_id);
CREATE INDEX conversations_status_idx ON conversations(status);
CREATE INDEX conversations_priority_idx ON conversations(priority);
CREATE INDEX conversations_assignee_idx ON conversations(assignee_id);
CREATE INDEX conversations_created_idx ON conversations(created_at);
CREATE INDEX conversations_unread_idx ON conversations(unread_count);

-- Approvals table (for escalation filter)
CREATE INDEX approvals_conversation_idx ON approvals(conversation_id);
CREATE INDEX approvals_status_idx ON approvals(status);

-- JSONB index for labels
CREATE INDEX conversations_labels_idx ON conversations USING GIN(labels);
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Quick presets apply correct filters
- [ ] Status filter shows correct conversations
- [ ] Priority filter shows correct conversations
- [ ] Assignee filter (me/unassigned) works
- [ ] Escalation filter shows only escalated conversations
- [ ] Unread filter shows only unread conversations
- [ ] Label multi-select works
- [ ] Date range filtering works
- [ ] Sort options change order correctly
- [ ] Active filter badges display correctly
- [ ] Reset button clears all filters
- [ ] Filter combinations work together

### API Testing

```bash
# Test escalation filter
curl "http://localhost:8000/api/v1/conversations?tenantId=mock-tenant-id&hasEscalation=true"

# Test unread filter
curl "http://localhost:8000/api/v1/conversations?tenantId=mock-tenant-id&unreadOnly=true"

# Test date range
curl "http://localhost:8000/api/v1/conversations?tenantId=mock-tenant-id&dateFrom=2026-01-01&dateTo=2026-01-31"

# Test label filter
curl "http://localhost:8000/api/v1/conversations?tenantId=mock-tenant-id&labels=vip&labels=urgent"

# Test sorting
curl "http://localhost:8000/api/v1/conversations?tenantId=mock-tenant-id&sortBy=priority&sortOrder=desc"
```

---

## 🚀 Future Enhancements

### Planned Features
1. **Saved filter presets**: Allow users to save custom filter combinations
2. **Team filters**: Filter by team assignment
3. **Custom date ranges**: "Last 7 days", "This month", etc.
4. **Advanced search**: Full-text search in message content
5. **Filter history**: Recently used filters
6. **Export filtered results**: CSV/Excel export
7. **Bulk actions**: Apply actions to filtered conversations
8. **Filter sharing**: Share filter URLs with team members

### Integration Points
- **Analytics**: Track most-used filters
- **Notifications**: Alert on filter matches (e.g., new urgent conversation)
- **Automation**: Trigger workflows based on filter criteria
- **Reporting**: Generate reports from filtered data

---

## 📚 Related Documentation

- [Project Spec](.dev-docs/PROJECT-SPEC.md) — Architecture and conventions
- [Setup Guide](.dev-docs/SETUP-OPTION-1.md) — Multi-tenant setup
- [Chatwoot Integration](.dev-docs/CHATWOOT-INTEGRATION.md) — Webhook and API integration
- [Agent Guidelines](AGENTS.md) — Development standards

---

## 🎓 Best Practices

### For Agents
1. **Start with presets**: Use quick filters for common tasks
2. **Combine filters**: Layer multiple filters for precision
3. **Save time**: Use keyboard shortcuts (coming soon)
4. **Review escalations daily**: Check "Escalated" preset regularly

### For Administrators
1. **Monitor filter usage**: Track which filters are most popular
2. **Optimize indexes**: Ensure database indexes are maintained
3. **Train team**: Show agents how to use advanced filters
4. **Review labels**: Keep label list clean and relevant

### For Developers
1. **Add indexes**: Index any new filterable columns
2. **Validate inputs**: Use Zod schemas for type safety
3. **Test performance**: Ensure filters remain fast at scale
4. **Document changes**: Update this doc when adding filters

---

*Last updated: 2026-01-28*
