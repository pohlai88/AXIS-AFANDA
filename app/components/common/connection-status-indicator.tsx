'use client';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface ConnectionStatusIndicatorProps {
  isConnected: boolean;
  isConnecting?: boolean;
  error?: Error | null;
  className?: string;
  showLabel?: boolean;
}

export function ConnectionStatusIndicator({
  isConnected,
  isConnecting = false,
  error = null,
  className,
  showLabel = false,
}: ConnectionStatusIndicatorProps) {
  const getStatus = () => {
    if (error) return 'error';
    if (isConnecting) return 'connecting';
    if (isConnected) return 'connected';
    return 'disconnected';
  };

  const status = getStatus();

  const statusConfig = {
    connected: {
      icon: <Wifi className="h-3 w-3" />,
      label: 'Live',
      color: 'bg-success text-success-foreground',
      description: 'Real-time updates active',
    },
    connecting: {
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
      label: 'Connecting...',
      color: 'bg-muted text-muted-foreground',
      description: 'Establishing connection...',
    },
    disconnected: {
      icon: <WifiOff className="h-3 w-3" />,
      label: 'Offline',
      color: 'bg-muted text-muted-foreground',
      description: 'Not connected to live updates',
    },
    error: {
      icon: <WifiOff className="h-3 w-3" />,
      label: 'Error',
      color: 'bg-destructive text-destructive-foreground',
      description: error?.message || 'Connection error',
    },
  };

  const config = statusConfig[status];

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <Badge
            variant="outline"
            className={cn(
              'flex items-center gap-1.5 text-xs font-medium',
              'transition-all duration-[var(--ax-motion-fast)]',
              config.color,
              className
            )}
          >
            {config.icon}
            {showLabel && <span>{config.label}</span>}
          </Badge>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p className="font-medium">{config.label}</p>
          <p className="text-xs text-muted-foreground">{config.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

