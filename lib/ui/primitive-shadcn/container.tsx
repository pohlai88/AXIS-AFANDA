/**
 * @file        container.tsx
 * @description TODO: Add description
 *
 * @repo        AXIS-V3
 * @path        components\\ui\\container.tsx
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

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  name?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  centered?: boolean
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, name, size, centered = false, ...props }, ref) => {
    const getContainerClasses = () => {
      const classes = []

      // Base container class
      if (name) {
        classes.push(`@container/${name}`)
      } else {
        classes.push('@container')
      }

      // Size constraints
      if (size) {
        classes.push(`max-w-${size}`)
      }

      // Centering
      if (centered) {
        classes.push('mx-auto')
      }

      return classes.join(' ')
    }

    return <div ref={ref} className={cn(getContainerClasses(), className)} {...props} />
  }
)
Container.displayName = 'Container'

export { Container }
