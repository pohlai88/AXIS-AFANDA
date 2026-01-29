'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { User, Bot } from 'lucide-react';
import type { Message } from '@/app/lib/stores/conversations-store';

interface MessageThreadProps {
  messages: Message[];
}

export function MessageThread({ messages }: MessageThreadProps) {
  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">No messages yet</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-4 p-6">
        {messages.map((message) => {
          const isIncoming = message.messageType === 'incoming';
          const isPrivate = message.private;

          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isIncoming ? 'justify-start' : 'justify-end'}`}
            >
              {/* Avatar (only for incoming messages) */}
              {isIncoming && (
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    {message.senderName
                      ? message.senderName.charAt(0).toUpperCase()
                      : message.senderType === 'bot'
                        ? <Bot className="h-4 w-4" />
                        : <User className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
              )}

              {/* Message Content */}
              <div className={`max-w-[70%] space-y-1 ${!isIncoming && 'flex flex-col items-end'}`}>
                {/* Sender Name */}
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">
                    {message.senderName || 'Unknown'}
                  </span>
                  {isPrivate && (
                    <Badge variant="secondary" className="h-5 text-xs">
                      Private Note
                    </Badge>
                  )}
                </div>

                {/* Message Bubble */}
                <Card
                  className={`p-3 ${isPrivate
                      ? 'border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950'
                      : isIncoming
                        ? 'bg-muted'
                        : 'bg-primary text-primary-foreground'
                    }`}
                >
                  <p className="whitespace-pre-wrap text-sm">{message.content}</p>

                  {/* Attachments */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((attachment, index) => (
                        <a
                          key={index}
                          href={attachment.dataUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs underline"
                        >
                          📎 {attachment.extension || 'attachment'}
                        </a>
                      ))}
                    </div>
                  )}
                </Card>

                {/* Timestamp */}
                <span className="text-xs text-muted-foreground">
                  {format(new Date(message.createdAt), 'MMM d, h:mm a')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
