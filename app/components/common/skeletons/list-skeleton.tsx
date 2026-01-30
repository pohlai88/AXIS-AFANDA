import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

interface ListSkeletonProps {
  /** Number of skeleton items to show */
  count?: number;
  /** Show avatar on the left */
  showAvatar?: boolean;
  /** Show actions on the right */
  showActions?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Generic list skeleton for loading states
 * Usage: <ListSkeleton count={5} showAvatar />
 */
export function ListSkeleton({
  count = 3,
  showAvatar = false,
  showActions = false,
  className,
}: ListSkeletonProps) {
  return (
    <div className={cn('space-y-3', className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-lg border bg-card p-4"
        >
          {/* Avatar */}
          {showAvatar && (
            <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
          )}

          {/* Content */}
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>

          {/* Actions */}
          {showActions && (
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/**
 * Compact list skeleton (for sidebars, smaller spaces)
 */
export function CompactListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-2">
          <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-2 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
