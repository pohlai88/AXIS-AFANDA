'use client';

import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';

export interface TabConfig {
  id: string;
  icon: React.ReactNode;
  label: string;
  badge?: string | number | null;
  badgeVariant?: 'default' | 'destructive' | 'outline' | 'secondary';
}

interface VerticalTabsNavProps {
  tabs: TabConfig[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export function VerticalTabsNav({ tabs, activeTab, onTabChange }: VerticalTabsNavProps) {
  return (
    <TooltipProvider>
      <div className="w-20 border-r bg-lux-surface flex flex-col items-center gap-3 py-6">
        {tabs.map((tab) => (
          <Tooltip key={tab.id} delayDuration={0}>
            <TooltipTrigger asChild>
              <button
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'relative w-14 h-14 rounded-xl flex items-center justify-center',
                  'transition-all duration-lux-base',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-lux scale-105'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground hover:scale-105'
                )}
                aria-label={tab.label}
                aria-current={activeTab === tab.id ? 'page' : undefined}
              >
                {tab.icon}
                {tab.badge && (
                  <Badge
                    variant={tab.badgeVariant || 'destructive'}
                    className={cn(
                      'absolute -top-1 -right-1 h-5 min-w-[20px] px-1',
                      'flex items-center justify-center',
                      'text-xs font-bold',
                      'shadow-sm'
                    )}
                  >
                    {tab.badge}
                  </Badge>
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-medium">
              <p>{tab.label}</p>
              {tab.badge && (
                <p className="text-xs text-muted-foreground mt-1">
                  {typeof tab.badge === 'number' && tab.badge > 0
                    ? `${tab.badge} item${tab.badge > 1 ? 's' : ''}`
                    : tab.badge
                  }
                </p>
              )}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
