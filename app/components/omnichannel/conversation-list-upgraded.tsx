'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import {
  Users,
  MessageSquare,
  Phone,
  Mail,
  MoreHorizontal,
  Eye,
  Archive,
  Trash2,
  Reply,
  Forward,
} from 'lucide-react';
import type { Conversation } from '@/app/lib/stores/conversations-store';
import { NoConversationsState } from '@/app/components/common/empty-states';

interface OmnichannelConversationListProps {
  conversations: Conversation[];
  loading?: boolean;
  onConversationClick: (id: string) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// shadcn best practice: Use semantic variant mapping
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'waiting':
      return 'secondary';
    case 'closed':
      return 'outline';
    default:
      return 'outline';
  }
};

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case 'chat':
      return MessageSquare;
    case 'email':
      return Mail;
    case 'phone':
      return Phone;
    default:
      return MessageSquare;
  }
};

const getChannelLabel = (channel: string) => {
  switch (channel) {
    case 'chat':
      return 'Chat';
    case 'email':
      return 'Email';
    case 'phone':
      return 'Phone';
    default:
      return channel;
  }
};

export function OmnichannelConversationListUpgraded({
  conversations,
  loading,
  onConversationClick,
  onArchive,
  onDelete,
}: OmnichannelConversationListProps) {
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
              <Skeleton className="h-8 w-8" />
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
    <div className="space-y-4">
      {conversations.map((conversation) => {
        const ChannelIcon = getChannelIcon('chat'); // Default to chat
        const statusVariant = getStatusVariant(conversation.status || 'active');

        return (
          <Card key={conversation.id} className="transition-shadow hover:shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {conversation.contactName?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{conversation.contactName || 'Unknown'}</h3>
                      <Badge variant="outline" className="text-xs">
                        <ChannelIcon className="mr-1 h-3 w-3" />
                        {getChannelLabel('chat')}
                      </Badge>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="default" className="h-5 min-w-5 px-1 text-xs">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <Badge variant={statusVariant} className="text-xs">
                      {conversation.status || 'active'}
                    </Badge>
                  </div>

                  {/* Contact Info */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{conversation.contactEmail || 'No email'}</span>
                    <span>
                      {conversation.lastMessageAt
                        ? formatDistanceToNow(new Date(conversation.lastMessageAt), {
                          addSuffix: true,
                        })
                        : 'Just now'}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onConversationClick(conversation.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      Open Conversation
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Reply className="mr-2 h-4 w-4" />
                      Reply
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Forward className="mr-2 h-4 w-4" />
                      Forward
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {onArchive && (
                      <DropdownMenuItem onClick={() => onArchive(conversation.id)}>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <DropdownMenuItem onClick={() => onDelete(conversation.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
