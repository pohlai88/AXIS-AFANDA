'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  MailOpen,
  Users,
  MoreVertical,
  Eye,
  Archive,
  Trash2,
  CheckSquare,
  Reply,
  Forward,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
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
  status?: 'active' | 'archived' | 'deleted';
}

interface ConversationListShadcnProps {
  conversations: Conversation[];
  loading?: boolean;
  onSelectConversation?: (conversation: Conversation) => void;
  onMarkRead?: (conversationIds: string[]) => void;
  onArchive?: (conversationIds: string[]) => void;
  onDelete?: (conversationIds: string[]) => void;
  className?: string;
}

// shadcn best practice: Use semantic status mapping
const getStatusVariant = (status?: string) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'archived':
      return 'secondary';
    case 'deleted':
      return 'destructive';
    default:
      return 'default';
  }
};

const getStatusIcon = (type: string) => {
  switch (type) {
    case 'direct':
      return Users;
    case 'group':
      return Users;
    default:
      return Users;
  }
};

export function ConversationListShadcn({
  conversations,
  loading,
  onSelectConversation,
  onMarkRead,
  onArchive,
  onDelete,
  className,
}: ConversationListShadcnProps) {
  const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set());

  const handleSelectConversation = (conversationId: string, checked: boolean) => {
    setSelectedConversations(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(conversationId);
      } else {
        newSet.delete(conversationId);
      }
      return newSet;
    });
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedConversations(new Set(conversations.map(c => c.id)));
    } else {
      setSelectedConversations(new Set());
    }
  };

  const handleBulkMarkRead = () => {
    if (selectedConversations.size > 0 && onMarkRead) {
      onMarkRead(Array.from(selectedConversations));
      setSelectedConversations(new Set());
    }
  };

  const handleBulkArchive = () => {
    if (selectedConversations.size > 0 && onArchive) {
      onArchive(Array.from(selectedConversations));
      setSelectedConversations(new Set());
    }
  };

  const handleBulkDelete = () => {
    if (selectedConversations.size > 0 && onDelete) {
      onDelete(Array.from(selectedConversations));
      setSelectedConversations(new Set());
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
    <div className={cn('space-y-4', className)}>
      {/* Bulk Actions Bar */}
      {selectedConversations.size > 0 && (
        <Card className="border-l-4 border-l-primary">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckSquare className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  {selectedConversations.size} conversation{selectedConversations.size !== 1 ? 's' : ''} selected
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleBulkMarkRead}>
                  <MailOpen className="mr-2 h-4 w-4" />
                  Mark Read
                </Button>
                <Button variant="outline" size="sm" onClick={handleBulkArchive}>
                  <Archive className="mr-2 h-4 w-4" />
                  Archive
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleBulkDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedConversations(new Set())}>
                  Clear
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Conversations</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedConversations.size === conversations.length}
                    onCheckedChange={handleSelectAll}
                    aria-label="Select all conversations"
                  />
                </TableHead>
                <TableHead>Participant</TableHead>
                <TableHead>Last Message</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="w-12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {conversations.map((conversation) => {
                const TypeIcon = getStatusIcon(conversation.type);
                const isUnread = conversation.lastMessage.unread;
                const isSelected = selectedConversations.has(conversation.id);

                return (
                  <TableRow
                    key={conversation.id}
                    className={cn(
                      'cursor-pointer transition-colors hover:bg-muted/50',
                      isSelected && 'bg-muted',
                      isUnread && 'font-medium'
                    )}
                    onClick={() => onSelectConversation?.(conversation)}
                  >
                    <TableCell>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={(checked) => handleSelectConversation(conversation.id, !!checked)}
                        aria-label={`Select ${conversation.participant.name}`}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>
                            {conversation.participant.avatar || conversation.participant.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-medium">{conversation.participant.name}</div>
                          {conversation.participant.email && (
                            <div className="text-xs text-muted-foreground">{conversation.participant.email}</div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="truncate text-sm">{conversation.lastMessage.content}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <TypeIcon className="h-4 w-4 text-muted-foreground" />
                        <Badge variant="outline" className="text-xs">
                          {conversation.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(conversation.status)} className="text-xs">
                        {conversation.status || 'active'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { addSuffix: true })}
                        </span>
                        {conversation.unreadCount && conversation.unreadCount > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {conversation.unreadCount}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onSelectConversation?.(conversation); }}>
                            <Eye className="mr-2 h-4 w-4" />
                            Open
                          </DropdownMenuItem>
                          {isUnread && (
                            <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onMarkRead?.([conversation.id]); }}>
                              <MailOpen className="mr-2 h-4 w-4" />
                              Mark as Read
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); }}>
                            <Reply className="mr-2 h-4 w-4" />
                            Reply
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); }}>
                            <Forward className="mr-2 h-4 w-4" />
                            Forward
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onArchive?.([conversation.id]); }}>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onDelete?.([conversation.id]); }}>
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
