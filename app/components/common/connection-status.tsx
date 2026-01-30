'use client';

/**
 * Connection Status Indicator
 * 
 * Shows real-time SSE connection status with visual feedback
 */

import { Badge } from '@/components/ui/badge';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConnectionStatusProps {
  isConnected: boolean;
  label?: string;
  className?: string;
  showIcon?: boolean;
}

export function ConnectionStatus({
  isConnected,
  label,
  className,
  showIcon = true
}: ConnectionStatusProps) {
  return (
    <Badge
      variant={isConnected ? 'default' : 'secondary'}
      className={cn(
        'gap-1.5 transition-colors',
        isConnected
          ? 'bg-approve-bg text-approve-fg border-approve-bd'
          : 'bg-muted text-muted-foreground',
        className
      )}
    >
      {showIcon && (
        isConnected ? (
          <Wifi className="h-3 w-3" />
        ) : (
          <WifiOff className="h-3 w-3" />
        )
      )}
      <span className="text-xs font-medium">
        {label || (isConnected ? 'Live' : 'Offline')}
      </span>
    </Badge>
  );
}

export interface ConnectionStatusWithLoadingProps extends ConnectionStatusProps {
  isLoading?: boolean;
}

export function ConnectionStatusWithLoading({
  isConnected,
  isLoading,
  label,
  className,
  showIcon = true,
}: ConnectionStatusWithLoadingProps) {
  if (isLoading) {
    return (
      <Badge variant="secondary" className={cn('gap-1.5', className)}>
        <Loader2 className="h-3 w-3 animate-spin" />
        <span className="text-xs font-medium">Connecting...</span>
      </Badge>
    );
  }

  return (
    <ConnectionStatus
      isConnected={isConnected}
      label={label}
      className={className}
      showIcon={showIcon}
    />
  );
}
