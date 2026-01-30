# Design Tokens — Quick Reference Card

**Quick access guide for daily development**

---

## 🚀 Quick Start

```bash
# Scan for hardcoded values
npm run tokens:scan

# Preview fixes
npm run tokens:fix:dry

# Apply fixes
npm run tokens:fix
```

---

## 📦 Import

```typescript
import { designTokens, tokenClasses } from '@/lib/design-tokens';
```

---

## 🎨 Common Colors

### Semantic (Use These First!)

```tsx
// Backgrounds
className="bg-background"      // Page background
className="bg-card"            // Card surfaces
className="bg-muted"           // Subtle backgrounds
className="bg-primary"         // Brand gold

// Text
className="text-foreground"    // Primary text
className="text-muted-foreground" // Secondary text
className="text-primary"       // Brand gold text

// Borders
className="border-border"      // Standard borders
className="border-input"       // Input borders
```

### Status Colors

```tsx
className="text-[hsl(var(--success))]"  // Green
className="text-[hsl(var(--danger))]"   // Red
className="text-[hsl(var(--warn))]"     // Orange
className="text-[hsl(var(--info))]"     // Blue
```

### Workflow States

```tsx
// Approval
className="bg-[hsl(var(--approve-bg))] text-[hsl(var(--approve-fg))]"

// Rejection
className="bg-[hsl(var(--reject-bg))] text-[hsl(var(--reject-fg))]"

// Changes
className="bg-[hsl(var(--changes-bg))] text-[hsl(var(--changes-fg))]"

// Pending
className="bg-[hsl(var(--pending-bg))] text-[hsl(var(--pending-fg))]"
```

---

## 📐 Layout

```tsx
// Container widths
className="max-w-[var(--layout-container-max)]"     // 80rem (1280px)
className="max-w-[var(--layout-container-narrow)]"  // 48rem (768px)

// Section spacing
className="py-[var(--layout-section-py)]"  // Responsive vertical padding

// Consistent gaps
className="gap-[var(--layout-gap)]"  // 1.5rem (24px)
```

---

## ⚡ Motion

```tsx
// Transition durations
className="duration-[var(--ax-motion-fast)]"  // 150ms - quick interactions
className="duration-[var(--ax-motion-base)]"  // 250ms - standard transitions
className="duration-[var(--ax-motion-slow)]"  // 350ms - deliberate animations

// In style prop
style={{ transition: `all ${designTokens.motion.base}` }}
```

---

## 🔘 Radius

```tsx
className="rounded-[var(--radius)]"     // Base radius (0.5rem)
className="rounded-[var(--radius-lg)]"  // Large radius
className="rounded-[var(--radius-md)]"  // Medium radius
className="rounded-[var(--radius-sm)]"  // Small radius
```

---

## ✨ Luxury Utilities

### Cards

```tsx
// Premium card with glow effect
<Card className="card-glow-lux shadow-lux">
  <CardHeader className="bg-lux-surface">
    <CardTitle>Title</CardTitle>
  </CardHeader>
</Card>
```

### Buttons

```tsx
// Gold button with shimmer
<Button className="btn-gold-lux">
  Premium Action
</Button>

// Standard button with hover effect
<Button className="btn-hover-lux">
  Standard Action
</Button>
```

### Typography

```tsx
// Hero text
<h1 className="text-hero-lux text-6xl">
  Main Headline
</h1>

// Sub-hero text
<h2 className="text-hero-sub-lux text-3xl">
  Subheadline
</h2>

// Gold accent text
<span className="text-lux-gold">
  Premium Feature
</span>
```

### Surfaces

```tsx
// Premium surface (panels, dialogs)
className="bg-lux-surface"

// Paper surface (reports, documents)
className="bg-lux-paper"
```

### Shadows

```tsx
className="shadow-lux"         // Soft elevation
className="shadow-lux-strong"  // Strong elevation (modals)
```

### Borders

```tsx
className="border-lux"       // Premium border
className="border-lux-gold"  // Gold accent border
```

### Tables

```tsx
<table className="table-lux">
  <thead>
    <tr>
      <th>Column</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data</td>
    </tr>
  </tbody>
</table>
```

### Interactive Effects

```tsx
// Subtle shine on hover
<div className="sheen-lux">
  Interactive Element
</div>

// Focus ring
<input className="focus:ring-lux" />
<input className="focus:ring-lux-strong" />  // Stronger ring
```

### Badges

```tsx
<span className="badge-lux">Soft Badge</span>
<span className="badge-lux-solid">Solid Badge</span>
```

---

## 🚫 Anti-Patterns (Don't Use)

```tsx
// ❌ BAD: Hardcoded colors
className="bg-white text-black"
className="bg-gray-200 text-gray-700"
style={{ color: '#fff' }}

// ✅ GOOD: Use tokens
className="bg-background text-foreground"
className="bg-muted text-muted-foreground"
style={{ color: designTokens.colors.foreground }}

// ❌ BAD: Hardcoded spacing
className="max-w-7xl"
style={{ maxWidth: '1280px' }}

// ✅ GOOD: Use layout tokens
className="max-w-[var(--layout-container-max)]"
style={{ maxWidth: designTokens.layout.containerMax }}

// ❌ BAD: Hardcoded durations
className="duration-200"
style={{ transition: 'all 200ms' }}

// ✅ GOOD: Use motion tokens
className="duration-[var(--ax-motion-fast)]"
style={{ transition: `all ${designTokens.motion.fast}` }}
```

---

## 💡 Pro Tips

### 1. Use Semantic Tokens First

```tsx
// ✅ GOOD: Semantic
className="bg-muted text-muted-foreground"

// ⚠️ OK: Direct token (when semantic doesn't fit)
className="bg-[hsl(var(--surface-1))]"

// ❌ BAD: Hardcoded
className="bg-gray-100"
```

### 2. Luxury Utilities for Premium Feel

```tsx
// Standard card
<Card>Content</Card>

// Premium card
<Card className="card-glow-lux shadow-lux bg-lux-surface">
  Content
</Card>
```

### 3. Programmatic Access

```typescript
// For dynamic styles
const getStatusColor = (status: string) => {
  switch (status) {
    case 'approved':
      return designTokens.colors.workflow.approve.bg;
    case 'rejected':
      return designTokens.colors.workflow.reject.bg;
    default:
      return designTokens.colors.muted;
  }
};
```

### 4. Dark Mode Support

All tokens automatically support dark mode:

```tsx
// Works in both light and dark mode
className="bg-background text-foreground border-border"
```

---

## 📚 Full Documentation

- **Complete Guide**: `.cursor/TOKEN-SYSTEM-COMPLETE.md`
- **Migration Guide**: `.cursor/DESIGN-TOKEN-MIGRATION.md`
- **Token Module**: `lib/design-tokens.ts`
- **CSS Source**: `app/globals.css`

---

## 🔍 Troubleshooting

### Issue: Scanner reports false positives

```bash
# Check if it's in a comment or string
# Scanner skips comments but may catch strings
```

### Issue: Token not working

```tsx
// Make sure to use correct syntax
className="max-w-[var(--layout-container-max)]"  // ✅ Correct
className="max-w-var(--layout-container-max)"    // ❌ Wrong
```

### Issue: Need custom color

```tsx
// Use opacity modifiers with tokens
className="bg-primary/20"  // 20% opacity
className="text-foreground/70"  // 70% opacity
```

---

*Quick reference for AXIS-AFENDA design token system*  
*Last updated: 2026-01-30*
