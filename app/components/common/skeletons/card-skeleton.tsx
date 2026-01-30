import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CardSkeletonProps {
  /** Number of skeleton cards to show */
  count?: number;
  /** Show header section */
  showHeader?: boolean;
  /** Show footer section */
  showFooter?: boolean;
  /** Custom className */
  className?: string;
}

/**
 * Generic card skeleton for loading grid views
 * Usage: <CardSkeleton count={6} showHeader showFooter />
 */
export function CardSkeleton({
  count = 3,
  showHeader = true,
  showFooter = true,
  className,
}: CardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className={cn('card-glow-lux', className)}>
          {showHeader && (
            <CardHeader className="space-y-2">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </CardHeader>
          )}
          <CardContent className="space-y-3">
            <Skeleton className="h-32 w-full rounded-md" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            {showFooter && (
              <div className="flex items-center justify-between pt-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-16" />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </>
  );
}

/**
 * Simple card skeleton (minimal version)
 */
export function SimpleCardSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i}>
          <CardContent className="space-y-3 py-4">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </CardContent>
        </Card>
      ))}
    </>
  );
}

/**
 * Whiteboard card skeleton
 */
export function WhiteboardCardSkeleton({ count = 6 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardContent className="p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
            <div className="flex items-center gap-2 pt-2">
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-3 w-16 ml-auto" />
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}
