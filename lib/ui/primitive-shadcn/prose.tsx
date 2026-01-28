/**
 * @file        prose.tsx
 * @description TODO: Add description
 *
 * @repo        AXIS-V3
 * @path        components\\ui\\prose.tsx
 *
 * @since       2026-01-26
 * @changedate  2026-01-26
 * @changeref   {{changeRef}}
 *
 * @category    General
 * @tags        TODO
 */

import { cn } from '@/lib/utils'
import * as React from 'react'

interface ProseProps extends React.HTMLAttributes<HTMLElement> {
  as?: keyof React.JSX.IntrinsicElements
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  invert?: boolean
}

const Prose = React.forwardRef<HTMLElement, ProseProps>(
  ({ className, as: Component = 'div', size = 'lg', invert = false, ...props }, ref) => {
    const ComponentToRender = Component as React.ElementType

    return (
      <ComponentToRender
        ref={ref}
        className={cn(
          'prose',
          invert && 'prose-invert',
          size === 'sm' && 'prose-sm',
          size === 'md' && 'prose-md',
          size === 'lg' && 'prose-lg',
          size === 'xl' && 'prose-xl',
          size === '2xl' && 'prose-2xl',
          'max-w-none',
          'text-foreground',
          className
        )}
        {...props}
      />
    )
  }
)
Prose.displayName = 'Prose'

export { Prose }
