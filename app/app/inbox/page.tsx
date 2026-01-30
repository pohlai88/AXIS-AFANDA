'use client';

import { useState, useEffect } from 'react';
import { ModernMessageThread } from '@/app/components/chat/modern-message-thread';
import { ModernComposeBox } from '@/app/components/chat/modern-compose-box';
import { TypingIndicator } from '@/app/components/chat/typing-indicator';
import { CreateGroupDialog } from '@/app/components/inbox/create-group-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Search,
  Plus,
  Mail,
  MailOpen,
  Users2,
  User,
  Phone,
  Video,
  MoreVertical,
  UserPlus,
  Bell,
  Pin,
  MessageCircle,
  PanelRightClose,
  PanelRightOpen,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useConversationUpdates } from '@/app/hooks/use-conversation-updates';
import { ConnectionStatusIndicator } from '@/app/components/common/connection-status-indicator';
import { InboxStatsCards, type InboxStats } from '@/app/components/inbox/inbox-stats';
import { ConversationListWithBulk } from '@/app/components/inbox/conversation-list-with-bulk';

// Mock data
const mockConversations = [
  {
    id: '1',
    type: 'direct' as const,
    participant: {
      name: 'Sarah Chen',
      email: 'sarah@company.com',
      avatar: 'SC',
      status: 'online' as 'online' | 'away' | 'offline',
      role: 'Product Manager',
      department: 'Product',
    },
    lastMessage: {
      content: 'Can you review the Q1 budget proposal?',
      timestamp: '2m ago',
      unread: true,
    },
  },
  {
    id: '2',
    type: 'direct' as const,
    participant: {
      name: 'Mike Johnson',
      email: 'mike@company.com',
      avatar: 'MJ',
      status: 'away' as const,
      role: 'Engineering Lead',
      department: 'Engineering',
    },
    lastMessage: {
      content: 'Thanks for the update!',
      timestamp: '15m ago',
      unread: false,
    },
  },
  {
    id: '3',
    type: 'group' as const,
    participant: {
      name: 'Engineering Team',
      email: 'engineering@company.com',
      avatar: 'ET',
      memberCount: 12,
      department: 'Engineering',
    },
    lastMessage: {
      content: 'Alex: The deployment is complete',
      timestamp: '1h ago',
      unread: true,
    },
  },
  {
    id: '4',
    type: 'group' as const,
    participant: {
      name: 'Product Team',
      email: 'product@company.com',
      avatar: 'PT',
      memberCount: 8,
      department: 'Product',
    },
    lastMessage: {
      content: 'Emma: New feature specs are ready',
      timestamp: '2h ago',
      unread: false,
    },
  },
];

interface MockMessage {
  id: string;
  conversationId?: string;
  chatwootId?: number;
  content: string;
  messageType: string;
  senderName: string;
  senderType: string;
  senderId?: number;
  createdAt: string;
  private: boolean;
  attachments: unknown[];
  status: 'sent' | 'delivered' | 'read';
  reactions?: Array<{ emoji: string; count: number }>;
}

// Generate mock messages with stable timestamps
const generateMockMessages = (): Record<string, MockMessage[]> => {
  const now = Date.now();
  return {
    '1': [
      {
        id: '1',
        content: 'Hey! Can you review the Q1 budget proposal when you get a chance?',
        messageType: 'incoming',
        senderName: 'Sarah Chen',
        senderType: 'user',
        createdAt: new Date(now - 3600000).toISOString(),
        private: false,
        attachments: [],
        status: 'read',
      },
      {
        id: '2',
        content: 'Sure! Let me take a look now. Is there anything specific you want me to focus on?',
        messageType: 'outgoing',
        senderName: 'You',
        senderType: 'user',
        createdAt: new Date(now - 3500000).toISOString(),
        private: false,
        attachments: [],
        status: 'read',
      },
      {
        id: '3',
        content: 'Mainly the marketing budget allocation. We might need to adjust it based on the new campaign plans.',
        messageType: 'incoming',
        senderName: 'Sarah Chen',
        senderType: 'user',
        createdAt: new Date(now - 3400000).toISOString(),
        private: false,
        attachments: [],
        status: 'read',
        reactions: [{ emoji: '👍', count: 1 }],
      },
      {
        id: '4',
        content: 'Got it! I\'ll review that section carefully and get back to you by end of day.',
        messageType: 'outgoing',
        senderName: 'You',
        senderType: 'user',
        createdAt: new Date(now - 3300000).toISOString(),
        private: false,
        attachments: [],
        status: 'read',
      },
      {
        id: '5',
        content: 'Perfect! Thanks so much 🙏',
        messageType: 'incoming',
        senderName: 'Sarah Chen',
        senderType: 'user',
        createdAt: new Date(now - 3200000).toISOString(),
        private: false,
        attachments: [],
        status: 'read',
      },
    ],
  };
};

const mockMessages = generateMockMessages();

export default function InboxSplitPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'direct' | 'groups'>('all');
  const [selectedConversation, setSelectedConversation] = useState<typeof mockConversations[number] | null>(null);
  const [messages, setMessages] = useState<MockMessage[]>([]);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [conversations, setConversations] = useState(mockConversations);
  const [stats, setStats] = useState<InboxStats>({
    unread: 0,
    direct: 0,
    groups: 0,
    today: 0,
  });

  // Real-time updates via SSE
  const { isConnected, error } = useConversationUpdates({
    enabled: true,
    showToasts: true,
    onUpdate: (update) => {
      console.log('Conversation update:', update);
      // TODO: Refresh conversations list from API when updates received
      // For now, this will show toast notifications for real-time events
    },
  });

  // Calculate stats
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const unread = conversations.filter(c => c.lastMessage.unread).length;
    const direct = conversations.filter(c => c.type === 'direct').length;
    const groups = conversations.filter(c => c.type === 'group').length;
    const todayCount = conversations.filter(c => {
      // For mock data, we'll simulate "today" messages
      return c.lastMessage.timestamp === '2m ago' || c.lastMessage.timestamp === '15m ago';
    }).length;

    setStats({
      unread,
      direct,
      groups,
      today: todayCount,
    });
  }, [conversations]);

  const filteredConversations = conversations.filter((conv) => {
    if (filter === 'unread' && !conv.lastMessage.unread) return false;
    if (filter === 'direct' && conv.type !== 'direct') return false;
    if (filter === 'groups' && conv.type !== 'group') return false;
    if (search && !conv.participant.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleBulkMarkRead = (conversationIds: string[]) => {
    setConversations((prev) =>
      prev.map((c) =>
        conversationIds.includes(c.id)
          ? { ...c, lastMessage: { ...c.lastMessage, unread: false } }
          : c
      )
    );
    toast.success(`Marked ${conversationIds.length} conversation(s) as read`);
  };

  const handleBulkArchive = (conversationIds: string[]) => {
    setConversations((prev) => prev.filter((c) => !conversationIds.includes(c.id)));
    if (selectedConversation && conversationIds.includes(selectedConversation.id)) {
      setSelectedConversation(null);
      setMessages([]);
    }
    toast.success(`Archived ${conversationIds.length} conversation(s)`);
  };

  const handleBulkDelete = (conversationIds: string[]) => {
    setConversations((prev) => prev.filter((c) => !conversationIds.includes(c.id)));
    if (selectedConversation && conversationIds.includes(selectedConversation.id)) {
      setSelectedConversation(null);
      setMessages([]);
    }
    toast.success(`Deleted ${conversationIds.length} conversation(s)`);
  };

  const handleCreateGroup = (group: {
    name: string;
    description: string;
    memberIds: string[];
  }) => {
    // Create new group conversation
    const newGroup = {
      id: String(conversations.length + 1),
      type: 'group' as const,
      participant: {
        name: group.name,
        email: `${group.name.toLowerCase().replace(/\s+/g, '-')}@company.com`,
        avatar: group.name.substring(0, 2).toUpperCase(),
        memberCount: group.memberIds.length,
        department: 'Custom',
      },
      lastMessage: {
        content: 'Group created',
        timestamp: 'Just now',
        unread: false,
      },
    };

    setConversations([newGroup, ...conversations]);

    // Auto-select the new group
    setSelectedConversation(newGroup);
    setMessages([]);
  };

  const handleConversationClick = (conversationId: string) => {
    const conversation = conversations.find((c) => c.id === conversationId);
    setSelectedConversation(conversation || null);
    setMessages(mockMessages[conversationId] || []);
  };

  const handleSendMessage = async (content: string) => {
    try {
      setSending(true);
      await new Promise((resolve) => setTimeout(resolve, 500));

      const newMessage: MockMessage = {
        id: String(messages.length + 1),
        content,
        messageType: 'outgoing',
        senderName: 'You',
        senderType: 'user',
        createdAt: new Date().toISOString(),
        private: false,
        attachments: [],
        status: 'sent' as const,
      };

      setMessages([...messages, newMessage]);
      toast.success('Message sent');

      // Simulate typing
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => setIsTyping(false), 2000);
      }, 1000);
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    toast.success(`Reacted with ${emoji}`);
  };

  const handleReply = (messageId: string) => {
    // TODO: Implement reply functionality
    console.log('Reply to message:', messageId);
    toast.info('Reply feature coming soon');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Create Group Dialog */}
      <CreateGroupDialog
        open={showCreateGroup}
        onOpenChange={setShowCreateGroup}
        onCreateGroup={handleCreateGroup}
      />

      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-lux-gold-soft flex h-12 w-12 items-center justify-center rounded-xl">
              <Mail className="h-6 w-6 text-lux-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Inbox</h1>
              <p className="text-sm text-muted-foreground">
                Internal team communication and direct messages
              </p>
            </div>
          </div>
          <ConnectionStatusIndicator
            isConnected={isConnected}
            error={error}
            showLabel
            className="hidden sm:flex"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Conversation List */}
        <div className={cn(
          "flex flex-col border-r bg-background transition-all",
          selectedConversation ? "w-80" : "w-96"
        )}>
          {/* Stats */}
          <div className="p-4 border-b">
            <InboxStatsCards stats={stats} />
          </div>

          {/* Header */}
          <div className="border-b px-4 py-3">
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h1 className="text-lg font-semibold">Inbox</h1>
                <p className="text-xs text-muted-foreground">
                  {filteredConversations.length} conversations
                </p>
              </div>
              <Button
                size="sm"
                variant="default"
                onClick={() => setShowCreateGroup(true)}
                title="Create group conversation"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Group
              </Button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-9 pl-9"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="border-b px-4 py-2">
            <div className="flex gap-1">
              <Button
                variant={filter === 'all' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setFilter('all')}
              >
                All
              </Button>
              <Button
                variant={filter === 'unread' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setFilter('unread')}
              >
                <Mail className="mr-1 h-3 w-3" />
                Unread
              </Button>
              <Button
                variant={filter === 'direct' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setFilter('direct')}
              >
                <User className="mr-1 h-3 w-3" />
                Direct
              </Button>
              <Button
                variant={filter === 'groups' ? 'default' : 'ghost'}
                size="sm"
                className="h-7 text-xs"
                onClick={() => setFilter('groups')}
              >
                <Users2 className="mr-1 h-3 w-3" />
                Groups
              </Button>
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-auto">
            {filteredConversations.length === 0 ? (
              <div className="flex h-full items-center justify-center p-6">
                <div className="text-center">
                  <MailOpen className="mx-auto h-12 w-12 text-muted-foreground/50" />
                  <h3 className="mt-4 font-semibold">No conversations found</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {search ? 'Try adjusting your search' : 'Start a new conversation'}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-2">
                <ConversationListWithBulk
                  conversations={filteredConversations}
                  onSelectConversation={(conv) => handleConversationClick(conv.id)}
                  onMarkRead={handleBulkMarkRead}
                  onArchive={handleBulkArchive}
                  onDelete={handleBulkDelete}
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Conversation Detail */}
        <div className="flex flex-1 flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="border-b bg-background px-4 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="relative">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/10 text-sm">
                          {selectedConversation.participant.avatar}
                        </AvatarFallback>
                      </Avatar>
                      {selectedConversation.type === 'direct' && (
                        <div className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background bg-approve-fg" />
                      )}
                    </div>

                    {/* Info */}
                    <div>
                      <h2 className="text-sm font-semibold">
                        {selectedConversation.participant.name}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.type === 'direct'
                          ? selectedConversation.participant.status === 'online'
                            ? 'Active now'
                            : 'Away'
                          : `${selectedConversation.participant.memberCount} members`}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Phone className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Video className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShowSidebar(!showSidebar)}
                    >
                      {showSidebar ? (
                        <PanelRightClose className="h-4 w-4" />
                      ) : (
                        <PanelRightOpen className="h-4 w-4" />
                      )}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Add to conversation
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Bell className="mr-2 h-4 w-4" />
                          Mute notifications
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Pin className="mr-2 h-4 w-4" />
                          Pin conversation
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Delete conversation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-auto bg-muted/20">
                  <ModernMessageThread
                    messages={messages.map(m => ({
                      id: m.id,
                      conversationId: m.conversationId || selectedConversation.id,
                      chatwootId: m.chatwootId || 0,
                      content: m.content,
                      messageType: m.messageType,
                      senderType: m.senderType,
                      senderId: m.senderId || 0,
                      senderName: m.senderName,
                      private: m.private,
                      attachments: [],
                      createdAt: new Date(m.createdAt),
                      status: m.status,
                      reactions: m.reactions,
                    }))}
                    onReaction={handleReaction}
                    onReply={handleReply}
                  />
                  {isTyping && (
                    <TypingIndicator
                      userName={selectedConversation.participant.name}
                      userInitial={selectedConversation.participant.avatar}
                    />
                  )}
                </div>

                {/* Sidebar */}
                {showSidebar && (
                  <div className="w-80 border-l bg-background">
                    <div className="p-4">
                      {/* Profile */}
                      <div className="text-center">
                        <Avatar className="mx-auto h-20 w-20">
                          <AvatarFallback className="bg-primary/10 text-2xl">
                            {selectedConversation.participant.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="mt-3 font-semibold">
                          {selectedConversation.participant.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {selectedConversation.participant.role || selectedConversation.participant.department}
                        </p>
                        <Badge variant="secondary" className="mt-2">
                          {selectedConversation.participant.department}
                        </Badge>
                      </div>

                      <Separator className="my-4" />

                      {/* Contact Info */}
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground">Email</p>
                          <p className="text-sm">{selectedConversation.participant.email}</p>
                        </div>
                        {selectedConversation.type === 'direct' && (
                          <div>
                            <p className="text-xs font-medium text-muted-foreground">Status</p>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-approve-fg" />
                              <p className="text-sm capitalize">
                                {selectedConversation.participant.status}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>

                      <Separator className="my-4" />

                      {/* Quick Actions */}
                      <div className="space-y-2">
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Phone className="mr-2 h-4 w-4" />
                          Start voice call
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Video className="mr-2 h-4 w-4" />
                          Start video call
                        </Button>
                        <Button variant="outline" size="sm" className="w-full justify-start">
                          <Search className="mr-2 h-4 w-4" />
                          Search in conversation
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Compose Box */}
              <ModernComposeBox
                onSend={handleSendMessage}
                sending={sending}
                placeholder="Type a message..."
                showPrivateToggle={false}
                showChannelBadge={false}
              />
            </>
          ) : (
            /* No Conversation Selected */
            <div className="flex h-full items-center justify-center bg-muted/10">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <MessageCircle className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Select a conversation</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose a conversation from the list to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
