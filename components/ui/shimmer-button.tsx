'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { VariantProps } from 'class-variance-authority';
import { buttonVariants } from '@/components/ui/button';

export interface ShimmerButtonProps
  extends React.ComponentProps<'button'>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  shimmerColor?: string;
  shimmerDuration?: string;
  children?: React.ReactNode;
}

const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  ({ className, shimmerColor, shimmerDuration, children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          'relative overflow-hidden',
          'before:absolute before:inset-0',
          'before:-translate-x-full before:animate-shimmer',
          'before:bg-linear-to-r before:from-transparent',
          shimmerColor || 'before:via-white/20',
          'before:to-transparent',
          'hover:before:translate-x-full',
          'before:transition-transform',
          shimmerDuration || 'before:duration-1000',
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);

ShimmerButton.displayName = 'ShimmerButton';

export { ShimmerButton };
