'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format, isToday, isYesterday } from 'date-fns';
import { User, Bot, Check, CheckCheck, Smile, Reply, MoreVertical } from 'lucide-react';
import type { Message } from '@/app/lib/stores/conversations-store';

/** Reaction on a message */
interface MessageReaction {
  emoji: string;
  count: number;
}

/** Extended message with delivery status and reactions */
interface ExtendedMessage extends Message {
  status?: 'sent' | 'delivered' | 'read';
  reactions?: MessageReaction[];
}

interface ModernMessageThreadProps {
  messages: ExtendedMessage[];
  onReaction?: (messageId: string, emoji: string) => void;
  onReply?: (messageId: string) => void;
}

// Quick emoji reactions
const QUICK_REACTIONS = ['👍', '❤️', '😂', '😮', '😢', '🙏'];

export function ModernMessageThread({
  messages,
  onReaction,
  onReply
}: ModernMessageThreadProps) {
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);

  if (messages.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Smile className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">No messages yet</p>
          <p className="text-xs text-muted-foreground">Start the conversation!</p>
        </div>
      </div>
    );
  }

  const formatMessageTime = (date: Date) => {
    if (isToday(date)) {
      return format(date, 'h:mm a');
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`;
    } else {
      return format(date, 'MMM d, h:mm a');
    }
  };

  const groupMessagesByDate = (messages: ExtendedMessage[]) => {
    const groups: { date: string; messages: ExtendedMessage[] }[] = [];
    let currentDate = '';

    messages.forEach((message) => {
      const messageDate = format(new Date(message.createdAt), 'yyyy-MM-dd');
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({ date: messageDate, messages: [message] });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });

    return groups;
  };

  const formatDateDivider = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) return 'Today';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMMM d, yyyy');
  };

  const messageGroups = groupMessagesByDate(messages);

  return (
    <ScrollArea className="h-full">
      <div className="space-y-6 p-4">
        {messageGroups.map((group) => (
          <div key={group.date}>
            {/* Date Divider */}
            <div className="mb-4 flex items-center justify-center">
              <div className="rounded-full bg-muted px-3 py-1">
                <span className="text-xs font-medium text-muted-foreground">
                  {formatDateDivider(group.date)}
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="space-y-2">
              {group.messages.map((message, index) => {
                const isIncoming = message.messageType === 'incoming';
                const isPrivate = message.private;
                const showAvatar = isIncoming && (
                  index === group.messages.length - 1 ||
                  group.messages[index + 1]?.messageType !== 'incoming'
                );

                return (
                  <div
                    key={message.id}
                    className={`flex gap-2 ${isIncoming ? 'justify-start' : 'justify-end'}`}
                    onMouseEnter={() => setHoveredMessageId(message.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                  >
                    {/* Avatar (only for incoming messages, last in group) */}
                    {isIncoming && (
                      <div className="flex-shrink-0">
                        {showAvatar ? (
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-xs">
                              {message.senderName
                                ? message.senderName.charAt(0).toUpperCase()
                                : message.senderType === 'bot'
                                  ? <Bot className="h-4 w-4" />
                                  : <User className="h-4 w-4" />}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="h-8 w-8" />
                        )}
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div className={`group relative max-w-[70%] ${!isIncoming && 'flex flex-col items-end'}`}>
                      {/* Sender Name (only for first message in group) */}
                      {isIncoming && showAvatar && (
                        <div className="mb-1 flex items-center gap-2 px-3">
                          <span className="text-xs font-semibold text-foreground">
                            {message.senderName || 'Unknown'}
                          </span>
                          {isPrivate && (
                            <Badge variant="secondary" className="h-4 px-1.5 text-[10px]">
                              Private
                            </Badge>
                          )}
                        </div>
                      )}

                      {/* Message Content */}
                      <div className="relative">
                        {/* Quick Actions (on hover) */}
                        {hoveredMessageId === message.id && (
                          <div className={`absolute top-0 z-10 flex gap-1 ${isIncoming ? '-right-20' : '-left-20'}`}>
                            {/* Emoji Reaction */}
                            {onReaction && (
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-full bg-background shadow-md hover:bg-muted"
                                  >
                                    <Smile className="h-4 w-4" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-2" align="center">
                                  <div className="flex gap-1">
                                    {QUICK_REACTIONS.map((emoji) => (
                                      <Button
                                        key={emoji}
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 p-0 text-lg hover:scale-125 transition-transform"
                                        onClick={() => onReaction(message.id, emoji)}
                                      >
                                        {emoji}
                                      </Button>
                                    ))}
                                  </div>
                                </PopoverContent>
                              </Popover>
                            )}

                            {/* More Options */}
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-full bg-background shadow-md hover:bg-muted"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-40 p-1" align="center">
                                {onReply && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start"
                                    onClick={() => onReply(message.id)}
                                  >
                                    <Reply className="mr-2 h-4 w-4" />
                                    Reply
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start"
                                >
                                  Copy
                                </Button>
                              </PopoverContent>
                            </Popover>
                          </div>
                        )}

                        {/* Bubble */}
                        <div
                          className={`rounded-2xl px-4 py-2 shadow-sm ${isPrivate
                            ? 'border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/50'
                            : isIncoming
                              ? 'bg-muted'
                              : 'bg-primary text-primary-foreground'
                            } ${isIncoming
                              ? showAvatar ? 'rounded-tl-sm' : ''
                              : 'rounded-tr-sm'
                            }`}
                        >
                          <p className="whitespace-pre-wrap text-sm leading-relaxed">
                            {message.content}
                          </p>

                          {/* Attachments */}
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((attachment, idx) => (
                                <a
                                  key={idx}
                                  href={attachment.dataUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 rounded-lg bg-background/50 px-2 py-1 text-xs hover:bg-background/80"
                                >
                                  📎 {attachment.extension || 'attachment'}
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Time & Status */}
                          <div className={`mt-1 flex items-center gap-1 ${isIncoming ? 'justify-start' : 'justify-end'}`}>
                            <span className={`text-[10px] ${isIncoming ? 'text-muted-foreground' : 'text-primary-foreground/70'}`}>
                              {formatMessageTime(new Date(message.createdAt))}
                            </span>
                            {!isIncoming && (
                              <span className="text-primary-foreground/70">
                                {/* Delivery status */}
                                {message.status === 'read' ? (
                                  <CheckCheck className="h-3 w-3" />
                                ) : message.status === 'delivered' ? (
                                  <CheckCheck className="h-3 w-3 opacity-50" />
                                ) : (
                                  <Check className="h-3 w-3 opacity-50" />
                                )}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Reactions */}
                        {message.reactions && message.reactions.length > 0 && (
                          <div className={`mt-1 flex flex-wrap gap-1 ${!isIncoming && 'justify-end'}`}>
                            {message.reactions.map((reaction, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-1 rounded-full bg-background px-2 py-0.5 text-xs shadow-sm"
                              >
                                <span>{reaction.emoji}</span>
                                <span className="text-[10px] text-muted-foreground">
                                  {reaction.count}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
