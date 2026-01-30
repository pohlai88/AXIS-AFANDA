# shadcn/ui v4 Analysis and Migration Guide

## Overview

This document analyzes the shadcn/ui v4 structure and provides recommendations for updating the AXIS-AFENDA project to improve UI/UX consistency and leverage modern Tailwind CSS v4 features.

## Key Differences from Current Implementation

### 1. **Tailwind CSS v4 Features**

- Uses `@import "tailwindcss"` instead of legacy directives
- Inline `@theme` configuration in CSS
- Custom variants with `@custom-variant`
- CSS layers for better organization
- OKLCH color space for better color consistency

### 2. **Component Structure Improvements**

- Data attributes for component variants (`data-slot`, `data-variant`, `data-size`)
- More comprehensive focus states with `focus-visible:ring-ring/50`
- Better icon handling with `[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4`
- Improved disabled states and transitions

### 3. **Theme System**

- Multiple theme variants (vega, nova, lyra, maia, mira)
- More granular color tokens (sidebar, surface, code, selection)
- Better dark mode support with specific color mappings
- Semantic color naming

## Recommended Migration Steps

### Phase 1: Update Tailwind Configuration

1. **Update package.json dependencies:**

```json
{
  "dependencies": {
    "@tailwindcss/postcss": "^4.1.11",
    "tailwindcss": "^4.1.11",
    "tw-animate-css": "^1.4.0"
  }
}
```

2. **Create new globals.css structure:**

```css
@import "tailwindcss";
@import "tw-animate-css";

@theme inline {
  /* Define custom radius values */
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --radius-2xl: calc(var(--radius) + 8px);

  /* Map existing tokens to new structure */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  /* ... add all color mappings */
}

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  /* Migrate to OKLCH color space */
}

.dark {
  /* Dark mode colors */
}

@custom-variant dark (&:is(.dark *));
```

### Phase 2: Update Component Patterns

1. **Add data attributes to components:**

```tsx
// Before
<button className={cn(buttonVariants({ variant, size }), className)}>

// After
<button
  data-slot="button"
  data-variant={variant}
  data-size={size}
  className={cn(buttonVariants({ variant, size }), className)}
>
```

2. **Improve focus states:**

```tsx
// Add to base classes
outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]
```

3. **Better icon handling:**

```tsx
// Add to components with icons
[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0
```

### Phase 3: Migrate Luxury Utilities

Update `app/styles/luxury.utilities.css` to use Tailwind v4 syntax:

```css
@utility card-glow-lux {
  @apply relative overflow-hidden;
  &::before {
    @apply content-[''] absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent;
  }
  &:hover {
    @apply shadow-lg shadow-yellow-500/5 transition-shadow;
  }
}

@utility btn-gold-lux {
  @apply bg-gradient-to-r from-yellow-600 to-yellow-500 text-white hover:from-yellow-700 hover:to-yellow-600;
  @apply shadow-md shadow-yellow-500/25 hover:shadow-lg hover:shadow-yellow-500/30;
}
```

### Phase 4: Component Updates

#### Button Component

```tsx
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        luxury: "btn-gold-lux", // Custom luxury variant
        // ... other variants
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        // ... other sizes
      },
    },
  },
);
```

#### Card Component

```tsx
const cardVariants = cva(
  "rounded-xl border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "",
        elevated: "shadow-lg card-glow-lux",
        luxury:
          "border-yellow-200 dark:border-yellow-800 bg-linear-to-br from-yellow-50/50 to-orange-50/50 dark:from-yellow-950/20 dark:to-orange-950/20",
      },
    },
  },
);
```

### Phase 5: Empty State Components Update

Update empty states to use new patterns:

```tsx
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      data-slot="empty-state"
      className={cn(
        "flex h-full min-h-96 items-center justify-center p-8",
        className,
      )}
    >
      <div className="text-center max-w-md">
        {Icon && (
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Icon className="h-8 w-8 text-muted-foreground [&_svg]:size-8" />
          </div>
        )}
        <h3 className="text-xl font-semibold text-foreground mb-2">{title}</h3>
        {description && (
          <p className="text-sm text-muted-foreground mb-6">{description}</p>
        )}
        {/* Actions */}
      </div>
    </div>
  );
}
```

## Benefits of Migration

1. **Better Performance**: Tailwind v4's new engine is faster
2. **Improved Developer Experience**: Better IntelliSense and debugging
3. **Color Consistency**: OKLCH provides perceptually uniform colors
4. **Component Flexibility**: Data attributes enable better styling hooks
5. **Modern CSS**: Leverages latest CSS features

## Implementation Priority

1. **High Priority**
   - Update Tailwind to v4
   - Migrate globals.css structure
   - Update core components (Button, Card, Input)

2. **Medium Priority**
   - Update luxury utilities
   - Add data attributes to all components
   - Improve focus states

3. **Low Priority**
   - Add theme variants
   - Implement new color system
   - Add advanced component patterns

## Next Steps

1. Create a branch for the migration
2. Start with Phase 1 (Tailwind configuration)
3. Test with a single component
4. Gradually migrate all components
5. Update documentation

## Resources

- [Tailwind CSS v4 Docs](https://tailwindcss.com/docs/v4-beta)
- [shadcn/ui v4 Repository](https://github.com/shadcn-ui/ui/tree/main/apps/v4)
- [OKLCH Color Space](https://oklch.com/)
