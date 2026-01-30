'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Mail,
  MailOpen,
  Users,
  MoreVertical,
  Eye,
  Archive,
  Trash2,
  CheckSquare,
  MessageSquare,
  UserPlus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSelectionSet } from '@/app/components/shared';
import { NoConversationsState } from '@/app/components/common/empty-states';

interface Conversation {
  id: string;
  type: 'direct' | 'group';
  participant: {
    name: string;
    email?: string;
    avatar?: string;
  };
  lastMessage: {
    content: string;
    timestamp: string;
    unread: boolean;
  };
  unreadCount?: number;
}

interface ConversationListWithBulkProps {
  conversations: Conversation[];
  loading?: boolean;
  onSelectConversation?: (conversation: Conversation) => void;
  onMarkRead?: (conversationIds: string[]) => void;
  onArchive?: (conversationIds: string[]) => void;
  onDelete?: (conversationIds: string[]) => void;
}

export function ConversationListWithBulk({
  conversations,
  loading,
  onSelectConversation,
  onMarkRead,
  onArchive,
  onDelete,
}: ConversationListWithBulkProps) {
  const allIds = conversations.map((c) => c.id);
  const {
    selected,
    selectedCount,
    isAllSelected,
    toggleAll,
    toggleOne,
    clear,
  } = useSelectionSet(allIds);

  const handleBulkMarkRead = () => {
    if (selectedCount > 0 && onMarkRead) {
      onMarkRead(Array.from(selected));
      clear();
    }
  };

  const handleBulkArchive = () => {
    if (selectedCount > 0 && onArchive) {
      onArchive(Array.from(selected));
      clear();
    }
  };

  const handleBulkDelete = () => {
    if (selectedCount > 0 && onDelete) {
      onDelete(Array.from(selected));
      clear();
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Loading conversations...</p>
        </div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return <NoConversationsState />;
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <Card className="border-l-4 border-l-primary">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {selectedCount} conversation{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkMarkRead}
                disabled={!onMarkRead}
              >
                <MailOpen className="mr-2 h-4 w-4" />
                Mark Read
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkArchive}
                disabled={!onArchive}
              >
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                disabled={!onDelete}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
              >
                Clear
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Select All */}
      <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/20">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={toggleAll}
          aria-label="Select all conversations"
        />
        <span className="text-sm font-medium">Select All</span>
        <span className="text-sm text-muted-foreground">
          ({selectedCount} of {conversations.length} selected)
        </span>
      </div>

      {/* Conversation List */}
      <div className="space-y-2">
        {conversations.map((conversation) => (
          <Card
            key={conversation.id}
            className={cn(
              'cursor-pointer transition-all hover:shadow-md',
              selected.has(conversation.id) && 'ring-2 ring-primary ring-offset-2',
              conversation.lastMessage.unread && 'border-l-4 border-l-primary'
            )}
            onClick={() => onSelectConversation?.(conversation)}
          >
            <div className="p-4">
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div onClick={(e) => e.stopPropagation()}>
                  <Checkbox
                    checked={selected.has(conversation.id)}
                    onCheckedChange={(checked) => toggleOne(conversation.id, !!checked)}
                    aria-label={`Select ${conversation.participant.name}`}
                  />
                </div>

                {/* Avatar */}
                <Avatar className="h-10 w-10">
                  <AvatarFallback>
                    {conversation.participant.avatar || conversation.participant.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{conversation.participant.name}</h4>
                      {conversation.type === 'group' && (
                        <Users className="h-4 w-4 text-muted-foreground" />
                      )}
                      {conversation.lastMessage.unread && (
                        <div className="h-2 w-2 bg-primary rounded-full" />
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {conversation.lastMessage.timestamp}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground truncate">
                      {conversation.lastMessage.content}
                    </p>
                    {conversation.unreadCount && conversation.unreadCount > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        {conversation.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onSelectConversation?.(conversation)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Open
                      </DropdownMenuItem>
                      {conversation.lastMessage.unread && (
                        <DropdownMenuItem onClick={() => onMarkRead?.([conversation.id])}>
                          <MailOpen className="mr-2 h-4 w-4" />
                          Mark as Read
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => onArchive?.([conversation.id])}>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete?.([conversation.id])}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
