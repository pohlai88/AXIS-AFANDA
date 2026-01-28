'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User } from 'lucide-react';
import type { Conversation } from '@/app/lib/stores/conversations-store';

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  onConversationClick: (id: string) => void;
}

export function ConversationList({
  conversations,
  loading,
  onConversationClick,
}: ConversationListProps) {
  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No conversations</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No conversations match your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="divide-y">
      {conversations.map((conversation) => (
        <button
          key={conversation.id}
          onClick={() => onConversationClick(conversation.id)}
          className="w-full px-6 py-4 text-left transition-colors hover:bg-muted/50"
        >
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {conversation.contactName
                  ? conversation.contactName.charAt(0).toUpperCase()
                  : <User className="h-5 w-5" />}
              </AvatarFallback>
            </Avatar>

            {/* Content */}
            <div className="flex-1 space-y-1">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {conversation.contactName || 'Unknown'}
                  </span>
                  {conversation.unreadCount > 0 && (
                    <Badge variant="default" className="h-5 min-w-5 px-1 text-xs">
                      {conversation.unreadCount}
                    </Badge>
                  )}
                </div>
                <span className="text-xs text-muted-foreground">
                  {conversation.lastMessageAt
                    ? formatDistanceToNow(new Date(conversation.lastMessageAt), {
                      addSuffix: true,
                    })
                    : 'Just now'}
                </span>
              </div>

              {/* Email */}
              {conversation.contactEmail && (
                <p className="text-sm text-muted-foreground">
                  {conversation.contactEmail}
                </p>
              )}

              {/* Status and Labels */}
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    conversation.status === 'open'
                      ? 'default'
                      : conversation.status === 'resolved'
                        ? 'secondary'
                        : 'outline'
                  }
                  className="text-xs"
                >
                  {conversation.status}
                </Badge>

                {conversation.priority && (
                  <Badge
                    variant={
                      conversation.priority === 'urgent'
                        ? 'destructive'
                        : conversation.priority === 'high'
                          ? 'default'
                          : 'outline'
                    }
                    className="text-xs"
                  >
                    {conversation.priority}
                  </Badge>
                )}

                {conversation.labels && conversation.labels.length > 0 && (
                  <div className="flex gap-1">
                    {conversation.labels.slice(0, 2).map((label) => (
                      <Badge key={label} variant="outline" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                    {conversation.labels.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{conversation.labels.length - 2}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              {/* Assignee */}
              {conversation.assigneeName && (
                <p className="text-xs text-muted-foreground">
                  Assigned to {conversation.assigneeName}
                </p>
              )}
            </div>
          </div>
        </button>
      ))}
    </div>
  );
}
