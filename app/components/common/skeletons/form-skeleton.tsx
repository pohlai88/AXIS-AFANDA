import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

interface FormSkeletonProps {
  /** Number of form fields */
  fields?: number;
  /** Show form header */
  showHeader?: boolean;
  /** Show form actions (buttons) */
  showActions?: boolean;
}

/**
 * Generic form skeleton for loading form views
 * Usage: <FormSkeleton fields={5} showHeader showActions />
 */
export function FormSkeleton({
  fields = 4,
  showHeader = true,
  showActions = true,
}: FormSkeletonProps) {
  return (
    <Card>
      {showHeader && (
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-2/3" />
        </CardHeader>
      )}
      <CardContent className="space-y-6">
        {Array.from({ length: fields }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
        {showActions && (
          <div className="flex justify-end gap-3 pt-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-24" />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * Inline form skeleton (for inline editing)
 */
export function InlineFormSkeleton({ fields = 3 }: { fields?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 flex-1" />
        </div>
      ))}
    </div>
  );
}

/**
 * Settings form skeleton (for settings pages)
 */
export function SettingsFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Section 1 */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-48" />
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-64" />
            </div>
            <Skeleton className="h-6 w-10" />
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-72" />
            </div>
            <Skeleton className="h-6 w-10" />
          </div>
        </div>
      </div>

      {/* Section 2 */}
      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="space-y-3">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
