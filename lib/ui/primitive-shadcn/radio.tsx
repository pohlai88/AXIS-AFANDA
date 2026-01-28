/**
 * @file        radio.tsx
 * @description TODO: Add description
 *
 * @repo        AXIS-V3
 * @path        components\\ui\\radio.tsx
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

export type RadioProps = React.InputHTMLAttributes<HTMLInputElement>

const Radio = React.forwardRef<HTMLInputElement, RadioProps>(({ className, ...props }, ref) => {
  return (
    <input
      type='radio'
      className={cn(
        'aspect-square border-primary text-primary ring-offset-background focus-visible:ring-ring h-4 w-4 rounded-full border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Radio.displayName = 'Radio'

export { Radio }
