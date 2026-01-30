'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, User, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Conversation } from '@/app/lib/stores/conversations-store';
import { NoConversationsState } from '@/app/components/common/empty-states';

interface ConversationListProps {
  conversations: Conversation[];
  loading: boolean;
  onConversationClick: (id: string) => void;
  onMarkRead?: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// shadcn best practice: Use semantic variant mapping instead of hardcoded classes
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'open':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'snoozed':
      return 'outline';
    case 'resolved':
      return 'secondary';
    default:
      return 'outline';
  }
};

const getPriorityVariant = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'destructive';
    case 'high':
      return 'default';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    case 'none':
      return 'outline';
    default:
      return 'outline';
  }
};

export function ConversationListUpgraded({
  conversations,
  loading,
  onConversationClick,
  onMarkRead,
  onArchive,
  onDelete,
}: ConversationListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-start gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return <NoConversationsState />;
  }

  return (
    <div className="space-y-2">
      {conversations.map((conversation) => (
        <Card key={conversation.id} className="transition-shadow hover:shadow-sm">
          <CardContent className="p-0">
            <Button
              variant="ghost"
              className="w-full h-auto p-4 justify-start"
              onClick={() => onConversationClick(conversation.id)}
            >
              <div className="flex items-start gap-4 w-full">
                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {conversation.contactName
                      ? conversation.contactName.charAt(0).toUpperCase()
                      : <User className="h-5 w-5" />}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 space-y-2 text-left">
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
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={getStatusVariant(conversation.status)}
                      className="text-xs"
                    >
                      {conversation.status}
                    </Badge>

                    {conversation.priority && (
                      <Badge
                        variant={getPriorityVariant(conversation.priority)}
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

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onConversationClick(conversation.id); }}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Open Conversation
                    </DropdownMenuItem>
                    {conversation.unreadCount > 0 && onMarkRead && (
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMarkRead(conversation.id); }}>
                        Mark as Read
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {onArchive && (
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive(conversation.id); }}>
                        Archive
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete(conversation.id); }} className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
