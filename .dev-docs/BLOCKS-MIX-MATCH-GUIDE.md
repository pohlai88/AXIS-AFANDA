# Shadcn Blocks Mix & Match Guide

> Guide for combining existing shadcn blocks to create App Registry and Notification Center without building new components

---

## 📦 Available Blocks (Relevant)

### Settings & Configuration
- **`settings-dialog`** — Settings dialog with sidebar navigation (has Bell icon for notifications)
- **`switch-demo`** — Toggle switches (perfect for enable/disable modules)

### Lists & Tables
- **`data-table`** — Full-featured table with pagination, sorting, filtering (already added)
- **`table-demo`** — Simple table examples
- **`typography-list`** — List formatting

### Navigation & Menus
- **`dropdown-menu-demo`** — Dropdown menus (good for notification dropdown)
- **`popover-demo`** — Popover components (alternative for notifications)
- **`command-demo`** — Command palette (could work for module search)

### Cards & Layouts
- **`section-cards`** — KPI cards (already in dashboard)
- **`dashboard-01`** — Full dashboard (already added)

### Forms & Inputs
- **`form-examples`** — Form patterns
- **`switch-demo`** — Toggle switches

---

## 🎯 Recommended Mix & Match

### 1. App Registry Page (`/app/settings/modules`)

**Combine these blocks:**

1. **Base Layout**: Use `settings-dialog` structure
   - Sidebar navigation (left)
   - Main content area (right)
   - Breadcrumb navigation

2. **Module List**: Use `data-table` component
   - Columns: Name, Type (in-app/iframe), Status, Actions
   - Enable/disable toggle using `Switch` from `switch-demo`
   - Already have `data-table.tsx` in components

3. **Module Cards Alternative**: Use `section-cards` pattern
   - Each module as a card
   - Toggle switch inside card
   - Module icon and description

**Suggested Implementation:**

```tsx
// Copy settings-dialog.tsx structure
// Replace sidebar nav with module categories
// Use data-table or section-cards for module list
// Add Switch component for enable/disable
```

**Blocks to copy:**
- `lib/ui/Blocks-shadcn/settings-dialog.tsx` → `app/components/settings-layout.tsx`
- `lib/ui/Blocks-shadcn/switch-demo.tsx` → Use Switch component
- `components/data-table.tsx` → Already available, adapt for modules

---

### 2. Notification Center (Header Dropdown)

**Combine these blocks:**

1. **Trigger**: Bell icon from `settings-dialog` (line 5: `Bell` from lucide-react)

2. **Dropdown**: Use `dropdown-menu-demo` pattern
   - Bell icon button
   - DropdownMenu with notification list
   - Scrollable content area

3. **Notification Items**: Use list pattern from `typography-list` or simple divs
   - Each notification as a list item
   - Badge for unread count
   - Timestamp display

**Suggested Implementation:**

```tsx
// Copy dropdown-menu pattern
// Add Bell icon from lucide-react
// Use DropdownMenuContent with ScrollArea
// List notifications with Badge for unread
```

**Blocks to copy:**
- `lib/ui/Blocks-shadcn/dropover-demo.tsx` or `dropdown-menu-demo.tsx` → `app/components/notification-center.tsx`
- Use `Bell` icon from `settings-dialog.tsx` (lucide-react)
- Use `Badge` component for unread count
- Use `ScrollArea` for long lists

---

## 📋 Step-by-Step Implementation Plan

### App Registry Page

1. **Copy `settings-dialog.tsx`** → `app/components/settings-layout.tsx`
   - Adapt sidebar to show: General, Modules, Integrations, etc.
   - Keep the dialog structure but use as page layout

2. **Create module list using `data-table`**
   - Copy `components/data-table.tsx` structure
   - Adapt columns for: Module Name, Type, Enabled, Actions
   - Add Switch component in "Enabled" column

3. **Alternative: Use `section-cards` pattern**
   - Each module as a card
   - Card contains: icon, name, description, toggle switch
   - Grid layout like dashboard cards

### Notification Center

1. **Copy dropdown menu pattern**
   - Use `DropdownMenu` from `components/ui/dropdown-menu`
   - Add `Bell` icon as trigger
   - Style with badge for unread count

2. **Notification list**
   - Use simple div structure with hover states
   - Add timestamps
   - Mark as read functionality

---

## 🔧 Quick Copy Commands

### For App Registry:
```bash
# Copy settings-dialog structure
npx shadcn@latest add @shadcn/settings-dialog --yes

# Switch component already available
# Data-table already available
```

### For Notification Center:
```bash
# Dropdown menu already available
# Just need to add Bell icon and structure
```

---

## 📝 Files to Create (Using Existing Blocks)

1. **`app/components/settings-layout.tsx`**
   - Copy from `lib/ui/Blocks-shadcn/settings-dialog.tsx`
   - Adapt for page layout (not dialog)
   - Use for `/app/settings/*` routes

2. **`app/components/module-registry-table.tsx`**
   - Adapt `components/data-table.tsx`
   - Change columns to: Name, Type, Enabled (Switch), Actions
   - Use module registry data

3. **`app/components/notification-center.tsx`**
   - Use `DropdownMenu` pattern
   - Add `Bell` icon trigger
   - List notifications with badges

---

## ✅ What We Already Have

- ✅ `data-table.tsx` — Full table with all features
- ✅ `Switch` component — For toggles
- ✅ `DropdownMenu` — For notification dropdown
- ✅ `Badge` — For unread counts
- ✅ `settings-dialog.tsx` — Settings layout pattern
- ✅ `section-cards.tsx` — Card grid pattern

**No new components needed** — just copy, adapt, and combine existing blocks!

---

*Last updated: 2026-01-28*
