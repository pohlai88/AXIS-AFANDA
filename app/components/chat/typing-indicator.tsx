'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface TypingIndicatorProps {
  userName?: string;
  userInitial?: string;
}

export function TypingIndicator({ userName = 'Someone', userInitial }: TypingIndicatorProps) {
  return (
    <div className="flex items-end gap-2 px-4 py-2">
      {/* Avatar */}
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-primary/10 text-xs">
          {userInitial || userName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      {/* Typing Bubble */}
      <div className="rounded-2xl rounded-tl-sm bg-muted px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
          <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" />
        </div>
      </div>

      {/* Name */}
      <span className="mb-1 text-xs text-muted-foreground">
        {userName} is typing...
      </span>
    </div>
  );
}
