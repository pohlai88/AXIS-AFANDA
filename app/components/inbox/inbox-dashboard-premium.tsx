'use client';

import { useState } from 'react';
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Mail,
  MailOpen,
  MoreHorizontal,
  Eye,
  Archive,
  Trash2,
  CheckSquare,
  Reply,
  Forward,
  Send,
  Star,
  Paperclip,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

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
  priority?: 'high' | 'medium' | 'low';
  starred?: boolean;
  hasAttachment?: boolean;
}

interface InboxDashboardPremiumProps {
  conversations: Conversation[];
  loading?: boolean;
  onSelectConversation?: (conversation: Conversation) => void;
  onMarkRead?: (conversationIds: string[]) => void;
  onArchive?: (conversationIds: string[]) => void;
  onDelete?: (conversationIds: string[]) => void;
  onStar?: (conversationIds: string[]) => void;
  onReply?: (conversationId: string) => void;
  onForward?: (conversationId: string) => void;
  className?: string;
}

// shadcn premium: Semantic status mapping (unused - can be removed if not needed)
// const getStatusVariant = (status?: string) => {
//   switch (status) {
//     case 'active': return 'default';
//     case 'archived': return 'secondary';
//     case 'deleted': return 'destructive';
//     default: return 'default';
//   }
// };

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case 'high':
      return 'text-reject-fg';
    case 'medium':
      return 'text-status-warn-fg';
    case 'low':
      return 'text-approve-fg';
    default:
      return 'text-muted-foreground';
  }
};

export function InboxDashboardPremium({
  conversations,
  onSelectConversation,
  onMarkRead,
  onArchive,
  onDelete,
  onStar,
  onReply,
  onForward,
}: InboxDashboardPremiumProps) {
  const [selectedConversations, setSelectedConversations] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState('inbox');
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleBulkStar = () => {
    if (selectedConversations.size > 0 && onStar) {
      onStar(Array.from(selectedConversations));
      setSelectedConversations(new Set());
    }
  };

  // shadcn premium: High-quality stats cards
  const stats = [
    {
      title: 'Total Conversations',
      value: conversations.length,
      description: 'All messages',
      icon: Mail,
      trend: {
        value: '+8.2%',
        direction: 'up' as const,
      },
    },
    {
      title: 'Unread',
      value: conversations.filter(c => c.lastMessage.unread).length,
      description: 'Awaiting response',
      icon: MailOpen,
      trend: {
        value: '+12.5%',
        direction: 'up' as const,
      },
    },
    {
      title: 'Starred',
      value: conversations.filter(c => c.starred).length,
      description: 'Important messages',
      icon: Star,
      trend: {
        value: '+3.1%',
        direction: 'up' as const,
      },
    },
    {
      title: 'Attachments',
      value: conversations.filter(c => c.hasAttachment).length,
      description: 'Files shared',
      icon: Paperclip,
      trend: {
        value: '+15.3%',
        direction: 'up' as const,
      },
    },
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SidebarProvider>
      <SidebarInset>
        {/* shadcn premium: Professional header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-16">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Inbox</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border rounded-md bg-background"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* shadcn premium: High-quality section cards */}
          <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="@container/card">
                  <CardHeader>
                    <CardDescription>{stat.title}</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      {stat.value}
                    </CardTitle>
                    <CardAction>
                      <Badge variant="outline">
                        {stat.trend.direction === 'up' ? (
                          <TrendingUp className="size-4" />
                        ) : (
                          <TrendingDown className="size-4" />
                        )}
                        {stat.trend.value}
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1.5 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      {stat.trend.direction === 'up' ? (
                        <>
                          Trending up this period <TrendingUp className="size-4" />
                        </>
                      ) : (
                        <>
                          Trending down this period <TrendingDown className="size-4" />
                        </>
                      )}
                    </div>
                    <div className="text-muted-foreground">{stat.description}</div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>

          {/* shadcn premium: Bulk actions bar */}
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
                    <Button variant="outline" size="sm" onClick={handleBulkStar}>
                      <Star className="mr-2 h-4 w-4" />
                      Star
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

          {/* shadcn premium: Advanced tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="inbox">Inbox</TabsTrigger>
              <TabsTrigger value="starred">Starred</TabsTrigger>
              <TabsTrigger value="sent">Sent</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>

            <TabsContent value="inbox" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Conversations</CardTitle>
                      <CardDescription>Active conversations</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={selectedConversations.size === filteredConversations.length}
                        onCheckedChange={handleSelectAll}
                      />
                      <span className="text-sm text-muted-foreground">
                        {selectedConversations.size} of {filteredConversations.length} selected
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead>Participant</TableHead>
                        <TableHead>Last Message</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="w-12">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredConversations.map((conversation) => {
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
                                {conversation.hasAttachment && (
                                  <Paperclip className="h-3 w-3 text-muted-foreground inline-block ml-2" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="text-xs">
                                {conversation.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {conversation.priority && (
                                <Badge
                                  variant="outline"
                                  className={cn('text-xs', getPriorityColor(conversation.priority))}
                                >
                                  {conversation.priority}
                                </Badge>
                              )}
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
                                {conversation.starred && (
                                  <Star className="h-4 w-4 text-primary fill-current" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                                    <MoreHorizontal className="h-4 w-4" />
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
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onReply?.(conversation.id); }}>
                                    <Reply className="mr-2 h-4 w-4" />
                                    Reply
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onForward?.(conversation.id); }}>
                                    <Forward className="mr-2 h-4 w-4" />
                                    Forward
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onStar?.([conversation.id]); }}>
                                    <Star className="mr-2 h-4 w-4" />
                                    Star
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
            </TabsContent>

            <TabsContent value="starred" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Starred Conversations</CardTitle>
                  <CardDescription>Important messages</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Star className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No starred conversations</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Star important conversations to find them quickly.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sent" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Sent Messages</CardTitle>
                  <CardDescription>Messages you've sent</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Send className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No sent messages</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Your sent messages will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="archived" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Archived Conversations</CardTitle>
                  <CardDescription>Old conversations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Archive className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No archived conversations</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      Archived conversations will appear here.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
