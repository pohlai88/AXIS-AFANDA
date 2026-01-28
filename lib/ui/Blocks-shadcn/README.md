# Components

[← Back to Main](../README.md) | [📚 Documentation](../docs/README.md) | [🎨 Storybook](../stories/README.md)

---

## 📦 Component Library

This directory contains 60+ production-ready UI components built with React 19, TypeScript, and Radix UI primitives.

### 🎯 Quick Links

- **[UI Components](./ui/)** - Base component library
- **[Component Stories](../stories/)** - Storybook documentation
- **[Design Tokens](../lib/tokens/)** - Colors, spacing, typography
- **[Component Index](./ui/index.ts)** - Centralized exports

---

## 🧩 Available Components

### Forms & Inputs
- **Button** - Versatile button with variants and sizes
- **Input** - Text input with validation support
- **Textarea** - Multi-line text input
- **Select** - Dropdown selection
- **Checkbox** - Boolean input
- **Radio Group** - Single selection from options
- **Switch** - Toggle switch
- **Slider** - Range input
- **Form** - Form wrapper with validation

### Layout
- **Card** - Content container with header/footer
- **Separator** - Visual divider
- **Aspect Ratio** - Maintain aspect ratios
- **Scroll Area** - Custom scrollable areas
- **Resizable** - Resizable panels

### Navigation
- **Tabs** - Tabbed interface
- **Accordion** - Collapsible content
- **Breadcrumb** - Navigation breadcrumbs
- **Menubar** - Application menu
- **Navigation Menu** - Site navigation
- **Pagination** - Page navigation

### Feedback & Overlays
- **Alert** - Contextual messages
- **Toast** - Notification toasts
- **Dialog** - Modal dialogs
- **Alert Dialog** - Confirmation dialogs
- **Drawer** - Side panel
- **Popover** - Floating content
- **Tooltip** - Hover information
- **Dropdown Menu** - Action menus
- **Context Menu** - Right-click menus
- **Hover Card** - Rich hover content

### Data Display
- **Table** - Data tables
- **Badge** - Status indicators
- **Avatar** - User avatars
- **Calendar** - Date picker
- **Progress** - Progress indicators
- **Skeleton** - Loading placeholders
- **Command** - Command palette

---

## 📖 Usage

### Importing Components

```typescript
// Import from centralized index
import { Button, Card, Input } from '@/components/ui'

// Or import individually
import { Button } from '@/components/ui/button'
```

### Basic Example

```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="default">Get Started</Button>
      </CardContent>
    </Card>
  )
}
```

---

## 🎨 Component Patterns

### Composition Pattern

Components use the compound component pattern for flexibility:

```typescript
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>Content</CardContent>
  <CardFooter>Footer</CardFooter>
</Card>
```

### Variant System

Components use CVA (Class Variance Authority) for variants:

```typescript
<Button variant="default" size="md">Default</Button>
<Button variant="destructive" size="sm">Delete</Button>
<Button variant="outline" size="lg">Outline</Button>
```

### Accessibility

All components follow WAI-ARIA guidelines:
- Proper ARIA attributes
- Keyboard navigation
- Focus management
- Screen reader support

---

## 🔗 Related Documentation

- **[Storybook Stories](../stories/)** - Interactive component demos
- **[Design Tokens](../lib/tokens/)** - Design system tokens
- **[Hooks](../hooks/)** - Custom React hooks
- **[Testing](../__tests__/)** - Component tests
- **[Documentation](../docs/)** - Full documentation

---

## 🛠️ Development

### Adding New Components

1. Create component file in `ui/` directory
2. Export from `ui/index.ts`
3. Create Storybook story in `../stories/`
4. Add tests in `../__tests__/`
5. Update this README

### Component Structure

```typescript
// ui/my-component.tsx
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const myComponentVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        default: 'default-classes',
        secondary: 'secondary-classes',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface MyComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof myComponentVariants> {}

const MyComponent = React.forwardRef<HTMLDivElement, MyComponentProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(myComponentVariants({ variant, className }))}
        {...props}
      />
    )
  }
)
MyComponent.displayName = 'MyComponent'

export { MyComponent, myComponentVariants }
```

---

## 📊 Component Status

| Component | Status | Stories | Tests | A11y |
|-----------|--------|---------|-------|------|
| Button | ✅ | ✅ | ✅ | ✅ |
| Card | ✅ | ✅ | ⚠️ | ✅ |
| Input | ✅ | ✅ | ⚠️ | ✅ |
| ... | ... | ... | ... | ... |

**Legend:**
- ✅ Complete
- ⚠️ Partial
- ❌ Missing

---

## 🔍 Navigation

- [← Main README](../README.md)
- [📚 Documentation](../docs/README.md)
- [🎨 Storybook Stories](../stories/README.md)
- [🎨 Design Tokens](../lib/README.md)
- [🪝 Hooks](../hooks/README.md)
- [🧪 Tests](../__tests__/README.md)

---

**Last Updated:** 2026-01-26  
**Total Components:** 60+  
**Framework:** React 19 + TypeScript
