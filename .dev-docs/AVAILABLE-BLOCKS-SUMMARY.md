# Available Shadcn Blocks Summary

> Quick reference for available blocks to mix and match

---

## 🎯 For App Registry Page (`/app/settings/modules`)

### Recommended Blocks to Combine:

1. **`settings-dialog`** (Base Layout)
   - Location: `lib/ui/Blocks-shadcn/settings-dialog.tsx`
   - Use: Sidebar + main content layout structure
   - Adapt: Remove dialog wrapper, use as page layout

2. **`data-table`** (Module List - Full Featured)
   - Location: `components/data-table.tsx` (already added)
   - Use: Table with pagination, sorting, filtering
   - Adapt: Change columns to: Name, Type, Enabled, Actions

3. **`switch-demo`** (Toggle Switches)
   - Location: `lib/ui/Blocks-shadcn/switch-demo.tsx`
   - Use: Enable/disable toggles for each module
   - Component: `Switch` from `@/components/ui/switch`

4. **`section-cards`** (Alternative: Card Grid)
   - Location: `components/section-cards.tsx`
   - Use: Each module as a card with toggle
   - Adapt: Replace KPI data with module data

---

## 🔔 For Notification Center (Header)

### Recommended Blocks to Combine:

1. **`dropdown-menu-demo`** (Dropdown Pattern)
   - Location: Check `lib/ui/Blocks-shadcn/` or use `DropdownMenu` directly
   - Use: Dropdown structure for notification list
   - Component: `DropdownMenu` from `@/components/ui/dropdown-menu`

2. **`settings-dialog`** (Bell Icon Reference)
   - Location: `lib/ui/Blocks-shadcn/settings-dialog.tsx` (line 5)
   - Use: `Bell` icon from `lucide-react`
   - Import: `import { Bell } from "lucide-react"`

3. **`popover-demo`** (Alternative: Popover)
   - Location: `lib/ui/Blocks-shadcn/popover-demo.tsx`
   - Use: Popover instead of dropdown
   - Component: `Popover` from `@/components/ui/popover`

4. **`typography-list`** (Notification Items)
   - Location: `lib/ui/Blocks-shadcn/typography-list.tsx`
   - Use: List formatting for notifications
   - Or: Simple div structure with hover states

---

## 📋 Complete Block Inventory

### Layout & Navigation
- `dashboard-01` ✅ (already added)
- `settings-dialog` — Settings layout with sidebar
- `sidebar-*` (15 variants) — Various sidebar patterns
- `site-header` ✅ (already in use)

### Tables & Lists
- `data-table` ✅ (already added - full featured)
- `table-demo` — Simple table example
- `typography-list` — List formatting

### Forms & Controls
- `switch-demo` — Toggle switches
- `form-examples` — Form patterns
- `input-demo` — Input variations

### Menus & Dropdowns
- `dropdown-menu-demo` — Dropdown patterns
- `popover-demo` — Popover patterns
- `context-menu-demo` — Right-click menus
- `menubar-demo` — Menu bar

### Cards & Content
- `section-cards` ✅ (already in dashboard)
- `card` component — Base card (already available)

### Dialogs & Sheets
- `dialog-demo` — Dialog patterns
- `drawer-demo` — Drawer/sheet patterns
- `sheet-demo` — Sheet patterns

---

## 🚀 Quick Implementation Strategy

### App Registry: Use `settings-dialog` + `data-table`

```tsx
// 1. Copy settings-dialog.tsx structure
// 2. Adapt sidebar nav to: General, Modules, Integrations
// 3. In main content, use data-table with module data
// 4. Add Switch component in "Enabled" column
```

### Notification Center: Use `DropdownMenu` + `Bell` icon

```tsx
// 1. Use DropdownMenu from @/components/ui/dropdown-menu
// 2. Add Bell icon from lucide-react as trigger
// 3. Add Badge for unread count
// 4. List notifications in DropdownMenuContent
```

---

## ✅ What's Already Available

- ✅ `data-table.tsx` — Full table component
- ✅ `Switch` component — Toggle switches
- ✅ `DropdownMenu` — Dropdown menus
- ✅ `Popover` — Popover component
- ✅ `Badge` — Badge component
- ✅ `Bell` icon — From lucide-react (used in settings-dialog)

**No new components needed** — just copy existing blocks and adapt!

---

*Last updated: 2026-01-28*
