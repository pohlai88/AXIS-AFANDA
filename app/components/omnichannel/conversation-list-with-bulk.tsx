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
  MessageCircle,
  Users,
  MoreVertical,
  Eye,
  Archive,
  Trash2,
  CheckSquare,
  UserPlus,
  Tag,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSelectionSet } from '@/app/components/shared';
import { NoConversationsState } from '@/app/components/common/empty-states';

interface OmnichannelConversation {
  id: string;
  customer: {
    name: string;
    email?: string;
    avatar?: string;
  };
  channel: 'email' | 'chat' | 'phone' | 'social';
  status: 'open' | 'closed' | 'pending';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assigneeId?: string;
  assigneeName?: string;
  lastMessage: {
    content: string;
    timestamp: string;
  };
  tags?: string[];
  unreadCount?: number;
}

interface OmnichannelConversationListWithBulkProps {
  conversations: OmnichannelConversation[];
  loading?: boolean;
  onSelectConversation?: (conversation: OmnichannelConversation) => void;
  onAssign?: (conversationIds: string[], assigneeId: string) => void;
  onAddTags?: (conversationIds: string[], tags: string[]) => void;
  onArchive?: (conversationIds: string[]) => void;
  onDelete?: (conversationIds: string[]) => void;
}

const CHANNEL_LABELS = {
  email: 'Email',
  chat: 'Chat',
  phone: 'Phone',
  social: 'Social',
};

const STATUS_CONFIG = {
  open: { label: 'Open', className: 'bg-approve-bg text-approve-fg' },
  closed: { label: 'Closed', className: 'bg-pending-bg text-pending-fg' },
  pending: { label: 'Pending', className: 'bg-changes-bg text-changes-fg' },
};

const PRIORITY_CONFIG = {
  low: { label: 'Low', className: 'text-pending-fg' },
  medium: { label: 'Medium', className: 'text-changes-fg' },
  high: { label: 'High', className: 'text-status-warn-fg' },
  urgent: { label: 'Urgent', className: 'text-reject-fg', icon: AlertTriangle },
};

export function OmnichannelConversationListWithBulk({
  conversations,
  loading,
  onSelectConversation,
  onAssign,
  onAddTags,
  onArchive,
  onDelete,
}: OmnichannelConversationListWithBulkProps) {
  const allIds = conversations.map((c) => c.id);
  const {
    selected,
    selectedCount,
    isAllSelected,
    toggleAll,
    toggleOne,
    clear,
  } = useSelectionSet(allIds);

  const handleBulkAssign = (assigneeId: string) => {
    if (selectedCount > 0 && onAssign) {
      onAssign(Array.from(selected), assigneeId);
      clear();
    }
  };

  const handleBulkAddTags = (tags: string[]) => {
    if (selectedCount > 0 && onAddTags) {
      onAddTags(Array.from(selected), tags);
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <UserPlus className="mr-2 h-4 w-4" />
                    Assign
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleBulkAssign('user-1')}>
                    Assign to John Doe
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAssign('user-2')}>
                    Assign to Jane Smith
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAssign('unassigned')}>
                    Unassign
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Tag className="mr-2 h-4 w-4" />
                    Add Tags
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleBulkAddTags(['urgent'])}>
                    Add Urgent Tag
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAddTags(['vip'])}>
                    Add VIP Tag
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleBulkAddTags(['follow-up'])}>
                    Add Follow-up Tag
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
        {conversations.map((conversation) => {
          const statusConfig = STATUS_CONFIG[conversation.status];
          const priorityConfig = PRIORITY_CONFIG[conversation.priority];
          const channelLabel = CHANNEL_LABELS[conversation.channel];

          return (
            <Card
              key={conversation.id}
              className={cn(
                'cursor-pointer transition-all hover:shadow-md',
                selected.has(conversation.id) && 'ring-2 ring-primary ring-offset-2',
                conversation.status === 'open' && 'border-l-4 border-l-green-500'
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
                      aria-label={`Select ${conversation.customer.name}`}
                    />
                  </div>

                  {/* Avatar */}
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {conversation.customer.avatar || conversation.customer.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium truncate">{conversation.customer.name}</h4>
                        <Badge variant="outline" className="text-xs">
                          {channelLabel}
                        </Badge>
                        <Badge className={cn('text-xs', statusConfig.className)}>
                          {statusConfig.label}
                        </Badge>
                        {priorityConfig && 'icon' in priorityConfig && priorityConfig.icon && (
                          <priorityConfig.icon className={cn('h-4 w-4', priorityConfig.className)} />
                        )}
                        {conversation.unreadCount && conversation.unreadCount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
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
                      {conversation.assigneeName && (
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {conversation.assigneeName}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Tags */}
                    {conversation.tags && conversation.tags.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {conversation.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
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
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onAssign?.([conversation.id], 'user-1')}>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Assign
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onAddTags?.([conversation.id], ['urgent'])}>
                          <Tag className="mr-2 h-4 w-4" />
                          Add Urgent Tag
                        </DropdownMenuItem>
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
          );
        })}
      </div>
    </div>
  );
}
