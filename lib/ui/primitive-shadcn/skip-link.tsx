import { cn } from '@/lib/utils'
import * as React from 'react'

interface SkipLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode
  className?: string
}

const SkipLink = React.forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <a ref={ref} className={cn('skip-link', className)} {...props}>
        {children}
      </a>
    )
  }
)
SkipLink.displayName = 'SkipLink'

export default SkipLink
