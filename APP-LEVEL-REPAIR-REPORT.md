# App-Level Components Repair Report

## 📊 **Scan Results Summary**

### **App-Level Components (58 total):**

#### **Domain Components:**
- **Approvals (15)**: approval-detail, approval-filters, approval-list variants, etc.
- **Inbox (12)**: conversation-list variants, message components, etc.
- **Teams (3)**: team-list, team-member-row, team-switcher
- **Whiteboards (7)**: comments-sidebar, whiteboard components
- **Consultations (20)**: ai-suggestions, calendar-heatmap, jitsi-meeting, etc.
- **Tasks (2)**: tasks components
- **Common (20)**: empty-states, errors, skeletons, etc.
- **Shared (9)**: shared components
- **Navigation (5)**: nav components
- **Templates (1)**: template components

#### **Root Level Components (20):**
- activity-timeline.tsx ✅
- app-sidebar.tsx (removed - was duplicate)
- calendar-01.tsx (removed - was orphan)
- change-member-role-dialog.tsx ✅
- chart-area-interactive.tsx ✅
- chatwoot-widget.tsx ✅
- command-palette.tsx ✅
- data-table.tsx ✅
- error-boundary.tsx ✅
- login-form.tsx ✅
- module-iframe.tsx ✅
- module-registry-table.tsx ✅
- notification-center.tsx ✅
- search-form.tsx ✅
- section-cards.tsx ✅
- settings-layout.tsx ✅
- shell-sidebar.tsx ✅
- site-header.tsx ✅
- team-switcher.tsx ✅
- tenant-switcher.tsx ✅
- theme-toggle.tsx ✅
- version-switcher.tsx ✅

### **Blocks Components (267 total in lib/ui/Blocks-shadcn):**
- Calendar blocks (32)
- Chart blocks (60+)
- Form blocks (10+)
- Navigation blocks (15+)
- Typography blocks (15+)
- And many more...

## 🔍 **Issues Identified:**

### **1. Import Path Issues:**
- Some components use old import paths
- Missing `@/app/` prefix in some imports

### **2. Hardcoded Styles:**
- Activity timeline uses hardcoded classes
- Section cards use hardcoded gradient classes
- Navigation patterns repeated across components

### **3. Missing Data Attributes:**
- Some app components missing `data-slot` attributes
- Inconsistent use of data attributes

### **4. Duplicate Components:**
- Found in Blocks-shadcn (should be references, not duplicates)

## 🔧 **Repairs Needed:**

### **High Priority:**
1. **Update import paths** to use `@/app/` consistently
2. **Add data attributes** to app components
3. **Replace hardcoded styles** with constants

### **Medium Priority:**
1. **Standardize loading patterns**
2. **Consistent empty state usage**
3. **Unify navigation patterns**

### **Low Priority:**
1. **Review Blocks-shadcn usage**
2. **Optimize component re-renders**

## 📋 **Action Plan:**

### Phase 1: Fix Import Paths
```tsx
// Before
import { Button } from "@/components/ui/button"

// After  
import { Button } from "@/app/components/ui/button"
```

### Phase 2: Add Constants
```tsx
// Before
className="flex h-8 w-8 items-center justify-center rounded-full bg-muted"

// After
className={APP_PATTERNS.activityTimeline.iconContainer}
```

### Phase 3: Add Data Attributes
```tsx
// Before
<div className="flex items-center gap-2">

// After
<div data-slot="activity-item" className="flex items-center gap-2">
```

## 🎯 **Next Steps:**

1. **Create automated script** to update import paths
2. **Apply constants** to identified patterns
3. **Add data attributes** consistently
4. **Test all components** after repairs

## 📈 **Expected Outcome:**
- ✅ Consistent import paths
- ✅ Centralized styling patterns
- ✅ Better component organization
- ✅ Improved maintainability
- ✅ v4 pattern compliance across all components
