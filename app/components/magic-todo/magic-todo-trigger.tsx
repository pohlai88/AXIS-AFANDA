'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { MagicTodoPanel } from './magic-todo-panel';

export function MagicTodoTrigger() {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(7); // Mock count

  // Listen for toggle event from sidebar
  useEffect(() => {
    const handleToggle = () => {
      setIsOpen((prev) => !prev);
    };

    window.addEventListener('toggle-magic-todo', handleToggle);
    return () => {
      window.removeEventListener('toggle-magic-todo', handleToggle);
    };
  }, []);

  return (
    <>
      {/* Floating trigger button */}
      <div
        className={cn(
          'fixed right-0 top-1/2 z-50 -translate-y-1/2 transition-all duration-300',
          isOpen ? 'translate-x-[400px]' : 'translate-x-0'
        )}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          size="lg"
          className={cn(
            'group relative h-16 rounded-l-xl rounded-r-none shadow-lg',
            'bg-gradient-to-br from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
            'border-r-0 pr-3 pl-4',
            'transition-all duration-300'
          )}
        >
          <div className="flex items-center gap-2">
            {isOpen ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <Sparkles className="h-5 w-5 animate-pulse" />
                <span className="font-semibold">Tasks</span>
                {pendingCount > 0 && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 min-w-[20px] bg-white/20 text-white"
                  >
                    {pendingCount}
                  </Badge>
                )}
              </>
            )}
          </div>
        </Button>
      </div>

      {/* Side panel */}
      <MagicTodoPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onCountChange={setPendingCount}
      />
    </>
  );
}
