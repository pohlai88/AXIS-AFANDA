# Codebase Audit Summary

**Date**: January 30, 2026  
**Scope**: Full codebase audit for hardcoded values, shadcn compliance, and best practices

---

## Executive Summary

Comprehensive audit and optimization completed. Key improvements:
- Created centralized constants system (`app/lib/constants/index.ts`)
- Fixed hardcoded overlay colors in UI components
- Migrated status/priority colors to semantic design tokens
- Eliminated magic numbers in API routes (SSE heartbeat intervals)
- Updated approval workflow status handling to use constants

---

## Changes Made

### 1. Created Constants System

**File**: `app/lib/constants/index.ts`

Centralized constants for:
- `APPROVAL_STATUS` - draft, submitted, pending, approved, rejected, posted, void
- `TASK_STATUS` - todo, in_progress, review, completed, blocked
- `CONVERSATION_STATUS` - open, pending, resolved, snoozed
- `MEETING_STATUS` - scheduled, in_progress, completed, cancelled
- `PRIORITY` - low, medium, high, urgent (with labels)
- `VISIBILITY` - public, private, restricted
- `HTTP_STATUS` - standard HTTP status codes
- `TIMING` - SSE_HEARTBEAT_MS, debounce, throttle, toast durations
- `STATUS_COLORS` / `PRIORITY_COLORS` / `KPI_COLORS` - semantic token mappings

### 2. UI Component Fixes

**Overlays** (Dialog, Sheet, Drawer):
- Changed `bg-black/50` → `bg-background/80 backdrop-blur-sm`
- Provides semantic dark mode support

**Button & Badge**:
- Changed `text-white` → `text-destructive-foreground` on destructive variant
- Ensures proper contrast in both themes

### 3. Component Color Migrations

Fixed hardcoded Tailwind colors in:

| Component                         | Before                          | After                               |
| --------------------------------- | ------------------------------- | ----------------------------------- |
| `approval-list.tsx`               | `text-blue-600`, `text-red-600` | `text-changes-fg`, `text-reject-fg` |
| `push-handoff.tsx`                | `bg-red-500/10`, etc.           | `bg-reject-bg`, semantic tokens     |
| `inbox-stats.tsx`                 | `border-orange-500/20`          | `border-status-warn-bd`             |
| `team-stats.tsx`                  | `border-blue-500/20`            | `border-changes-bd`                 |
| `whiteboard-stats.tsx`            | `border-purple-500/20`          | `border-primary/20`                 |
| `omnichannel-stats.tsx`           | `border-red-500/20`             | `border-reject-bd`                  |
| `task-stats.tsx`                  | `border-blue-500/20`            | `border-changes-bd`                 |
| `template-selector.tsx`           | `bg-blue-500/10`                | `bg-changes-bg`                     |
| `conversation-list-with-bulk.tsx` | `bg-green-100`                  | `bg-approve-bg`                     |
| `account/page.tsx`                | `bg-green-50`                   | `bg-approve-bg`                     |
| `collaboration/page.tsx`          | `bg-yellow-50`                  | `bg-status-warn-bg`                 |
| `jitsi-meeting.tsx`               | `#1a1a1a`                       | `hsl(240 5% 7%)`                    |

### 4. API Route Improvements

Updated 8 SSE routes to use `TIMING.SSE_HEARTBEAT_MS`:
- `activity/route.ts`
- `approvals/updates/route.ts`
- `conversations/updates/route.ts`
- `tasks/updates/route.ts`
- `teams/updates/route.ts`
- `meetings/[id]/updates/route.ts`
- `whiteboards/[id]/updates/route.ts`

Updated approval routes to use `APPROVAL_STATUS` constants:
- `approvals/route.ts` - status on create
- `approvals/[id]/route.ts` - status validation

Fixed type safety:
- Changed `const updateData: any` → `const updateData: Record<string, unknown>`

---

## Remaining Work

### Hardcoded Colors Still Present (~85 bg- / ~100 text-)

**Files with most issues**:
1. `settings/diagnostics/page.tsx` (14 bg, 14 text)
2. `omnichannel/setup/page.tsx` (12 bg, 16 text)
3. `channel-icons.tsx` (9 each) - may be intentional for brand colors
4. `whiteboards/tags-manager.tsx` (13 bg)
5. Various dashboard/filter components

**Recommendation**: 
- For status-related colors → migrate to semantic tokens
- For brand/channel colors → may need dedicated token palette
- For demo/test pages → acceptable as-is

### API Routes

**Still needs attention**:
- Response validation schemas (all routes return unvalidated responses)
- `webhooks/chatwoot/route.ts` - `'mock-tenant-id'` fallbacks need removal
- Some inline Zod schemas should move to shared validation file

### shadcn/ui Improvements

**Optional CVA additions**:
- `avatar.tsx` - size variants via CVA
- `switch.tsx` - size variants via CVA
- `select.tsx` - size variants via CVA

---

## Design Token Reference

### Semantic Status Colors (from globals.css)

```css
/* Approval workflow */
--approve-bg, --approve-fg, --approve-bd
--reject-bg, --reject-fg, --reject-bd
--changes-bg, --changes-fg, --changes-bd
--pending-bg, --pending-fg, --pending-bd

/* Status tags */
--status-draft-bg/fg/bd
--status-posted-bg/fg/bd
--status-void-bg/fg/bd
--status-warn-bg/fg/bd

/* KPIs */
--kpi-up-bg/fg/bd
--kpi-down-bg/fg/bd
--kpi-flat-bg/fg/bd
```

### Usage Examples

```tsx
// Before (hardcoded)
className="bg-green-500/10 text-green-600 border-green-500/20"

// After (semantic)
className="bg-approve-bg text-approve-fg border-approve-bd"
```

---

## Verification

### What Was Verified ✅
- [x] Constants file compiles without errors
- [x] UI components render without errors
- [x] No linter errors in modified files
- [x] SSE routes use consistent timing constant

### What Needs Browser Testing ⚠️
- [ ] Overlay appearance (dialog, sheet, drawer)
- [ ] Status badge colors in both light/dark modes
- [ ] Stats cards border/background visibility

---

## Files Modified

```
app/lib/constants/index.ts (NEW)
components/ui/dialog.tsx
components/ui/sheet.tsx
components/ui/drawer.tsx
components/ui/button.tsx
components/ui/badge.tsx
app/components/approvals/approval-list.tsx
app/components/approvals/push-handoff.tsx
app/components/approvals/template-selector.tsx
app/components/inbox/inbox-stats.tsx
app/components/teams/team-stats.tsx
app/components/whiteboards/whiteboard-stats.tsx
app/components/omnichannel/omnichannel-stats.tsx
app/components/omnichannel/conversation-list-with-bulk.tsx
app/components/tasks/task-stats.tsx
app/components/consultations/jitsi-meeting.tsx
app/api/v1/activity/route.ts
app/api/v1/approvals/route.ts
app/api/v1/approvals/[id]/route.ts
app/api/v1/approvals/updates/route.ts
app/api/v1/conversations/updates/route.ts
app/api/v1/tasks/updates/route.ts
app/api/v1/teams/updates/route.ts
app/api/v1/meetings/[id]/updates/route.ts
app/api/v1/whiteboards/[id]/updates/route.ts
app/app/settings/account/page.tsx
app/app/settings/collaboration/page.tsx
```

---

*Generated by codebase audit - January 30, 2026*
