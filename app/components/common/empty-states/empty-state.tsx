import { Button } from '@/components/ui/button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  /** Icon to display */
  icon?: LucideIcon;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Primary action button */
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  /** Secondary action button */
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  /** Custom className */
  className?: string;
}

/**
 * Generic empty state component
 * Usage: <EmptyState icon={FileIcon} title="No files" description="..." action={{...}} />
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn('flex h-full min-h-96 items-center justify-center p-8', className)}>
      <div className="text-center max-w-md">
        {Icon && (
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Icon className="h-8 w-8 text-muted-foreground" />
          </div>
        )}

        <h3 className="text-xl font-semibold text-foreground mb-2">
          {title}
        </h3>

        {description && (
          <p className="text-sm text-muted-foreground mb-6">
            {description}
          </p>
        )}

        {(action || secondaryAction) && (
          <div className="flex items-center justify-center gap-3">
            {action && (
              <Button onClick={action.onClick} className="btn-gold-lux">
                {action.icon && <action.icon className="mr-2 h-4 w-4" />}
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button variant="outline" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact empty state (for smaller spaces)
 */
export function CompactEmptyState({
  icon: Icon,
  title,
  description,
  className,
}: Omit<EmptyStateProps, 'action' | 'secondaryAction'>) {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center', className)}>
      {Icon && <Icon className="h-10 w-10 text-muted-foreground mb-3" />}
      <h4 className="text-sm font-medium text-foreground mb-1">{title}</h4>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
