'use client';

import { useEffect, useState, useCallback } from 'react';
import { useConversationsStore, type MessageAttachment } from '@/app/lib/stores/conversations-store';
import { getConversations, getConversation, getMessages, sendMessage } from '@/app/lib/api/conversations';
import { ConversationList } from '@/app/components/omnichannel/conversation-list';
import { InboxFilters, type InboxFilters as InboxFiltersType } from '@/app/components/omnichannel/inbox-filters';
import { ModernMessageThread } from '@/app/components/chat/modern-message-thread';
import { ModernComposeBox } from '@/app/components/chat/modern-compose-box';
import { TypingIndicator } from '@/app/components/chat/typing-indicator';
import { ConversationSidebar } from '@/app/components/omnichannel/conversation-sidebar';
import { ConversationActions } from '@/app/components/omnichannel/conversation-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Search,
  RefreshCw,
  MessageCircle,
  PanelRightClose,
  PanelRightOpen,
  Users2,
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useConversationUpdates } from '@/app/hooks/use-conversation-updates';
import { ConnectionStatusIndicator } from '@/app/components/common/connection-status-indicator';
import { OmnichannelStatsCards, type OmnichannelStats } from '@/app/components/omnichannel/omnichannel-stats';
import { OmnichannelConversationListWithBulk } from '@/app/components/omnichannel/conversation-list-with-bulk';
import { bulkDeleteConversations, bulkUpdateConversations } from '@/app/lib/api/conversations';

export default function OmnichannelSplitPage() {
  const {
    conversations,
    setConversations,
    updateConversation,
    selectedConversation,
    selectConversation,
    messages,
    setMessages,
    setLoading,
    loading
  } = useConversationsStore();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<InboxFiltersType>({ status: 'open' });
  const [sending, setSending] = useState(false);
  const [isTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [stats, setStats] = useState<OmnichannelStats>({
    open: 0,
    assigned: 0,
    urgent: 0,
    avgResponseTime: 15, // Mock average response time in minutes
  });

  // Real-time updates via SSE
  const { isConnected, error } = useConversationUpdates({
    enabled: true,
    showToasts: true,
    onUpdate: (update) => {
      console.log('Omnichannel conversation update:', update);
      // Refresh conversations list when updates received
      fetchConversations();
    },
  });

  // Calculate stats
  useEffect(() => {
    const open = conversations.filter(c => c.status === 'open').length;
    const assigned = conversations.filter(c => c.assigneeId).length;
    const urgent = conversations.filter(c => c.priority === 'urgent').length;

    setStats({
      open,
      assigned,
      urgent,
      avgResponseTime: 15, // Mock value - would be calculated from actual response times
    });
  }, [conversations]);

  // Fetch conversations
  const fetchConversations = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getConversations({
        ...filters,
        search: search || undefined,
      });
      setConversations(result.data.map((c: unknown) => {
        const conv = c as Record<string, unknown>;
        return {
          id: String(conv.id),
          tenantId: String(conv.tenantId || ''),
          chatwootId: Number(conv.chatwootId),
          status: String(conv.status || 'open'),
          priority: conv.priority as string | undefined,
          contactName: conv.contactName as string | undefined,
          contactEmail: conv.contactEmail as string | undefined,
          assigneeId: conv.assigneeId as number | undefined,
          assigneeName: conv.assigneeName as string | undefined,
          teamId: conv.teamId as number | undefined,
          teamName: conv.teamName as string | undefined,
          labels: conv.labels as string[] | undefined,
          unreadCount: Number(conv.unreadCount || 0),
          lastMessageAt: conv.lastMessageAt ? new Date(conv.lastMessageAt as string) : undefined,
          createdAt: new Date(conv.createdAt as string),
          updatedAt: conv.updatedAt ? new Date(conv.updatedAt as string) : new Date(),
        };
      }));
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [filters, search, setLoading, setConversations]);

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) {
        fetchConversations();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search, fetchConversations]);

  // Handle conversation click
  const handleConversationClick = async (conversationId: string) => {
    try {
      setLoadingMessages(true);

      // Fetch conversation details
      const convResult = await getConversation(conversationId);
      const convData = convResult.data as Record<string, unknown>;
      selectConversation({
        id: String(convData.id),
        tenantId: String(convData.tenantId || ''),
        chatwootId: Number(convData.chatwootId),
        status: String(convData.status || 'open'),
        priority: convData.priority as string | undefined,
        contactName: convData.contactName as string | undefined,
        contactEmail: convData.contactEmail as string | undefined,
        assigneeId: convData.assigneeId as number | undefined,
        assigneeName: convData.assigneeName as string | undefined,
        teamId: convData.teamId as number | undefined,
        teamName: convData.teamName as string | undefined,
        labels: convData.labels as string[] | undefined,
        unreadCount: Number(convData.unreadCount || 0),
        lastMessageAt: convData.lastMessageAt ? new Date(convData.lastMessageAt as string) : undefined,
        createdAt: new Date(convData.createdAt as string),
        updatedAt: convData.updatedAt ? new Date(convData.updatedAt as string) : new Date(),
      });

      // Fetch messages
      const messagesResult = await getMessages(conversationId);
      setMessages(conversationId, messagesResult.data.map((m: unknown) => {
        const msg = m as Record<string, unknown>;
        return {
          id: String(msg.id),
          conversationId: String(msg.conversationId),
          chatwootId: Number(msg.chatwootId),
          content: String(msg.content || ''),
          messageType: String(msg.messageType || 'incoming'),
          senderType: String(msg.senderType || 'contact'),
          senderId: Number(msg.senderId),
          senderName: msg.senderName as string | undefined,
          private: Boolean(msg.private),
          attachments: msg.attachments as MessageAttachment[] | undefined,
          createdAt: new Date(msg.createdAt as string),
        };
      }));
    } catch (error) {
      console.error('Failed to fetch conversation:', error);
      toast.error('Failed to load conversation');
    } finally {
      setLoadingMessages(false);
    }
  };

  // Handle send message
  const handleSendMessage = async (content: string, isPrivate: boolean = false) => {
    if (!selectedConversation) return;

    try {
      setSending(true);
      const result = await sendMessage(selectedConversation.id, content, isPrivate);

      // Add message to store
      const conversationMessages = messages[selectedConversation.id] || [];
      setMessages(selectedConversation.id, [...conversationMessages, {
        ...result.data,
        createdAt: new Date(result.data.createdAt),
      }]);

      toast.success(isPrivate ? 'Private note added' : 'Message sent');
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  // Handle emoji reaction
  const handleReaction = (messageId: string, emoji: string) => {
    toast.success(`Reacted with ${emoji}`);
  };

  // Handle reply
  const handleReply = (messageId: string) => {
    // TODO: Implement reply functionality
    console.log('Reply to message:', messageId);
    toast.info('Reply feature coming soon');
  };

  const conversationMessages = selectedConversation
    ? messages[selectedConversation.id] || []
    : [];

  // Empty state
  const showEmptyState = !loading && conversations.length === 0 && !search;

  const bulkConversations = conversations.map((c) => {
    const channelType = (c as unknown as Record<string, unknown> | null)?.channelType as string | undefined;
    const channel = channelType?.includes('email')
      ? 'email'
      : channelType?.includes('phone')
        ? 'phone'
        : channelType?.includes('facebook') || channelType?.includes('instagram') || channelType?.includes('twitter')
          ? 'social'
          : 'chat';

    const status = c.status === 'pending'
      ? 'pending'
      : c.status === 'resolved' || c.status === 'closed'
        ? 'closed'
        : 'open';

    const priority = (c.priority === 'urgent' || c.priority === 'high' || c.priority === 'medium' || c.priority === 'low')
      ? c.priority
      : 'medium';

    return {
      id: c.id,
      customer: {
        name: c.contactName || 'Unknown',
        email: c.contactEmail,
      },
      channel,
      status,
      priority,
      assigneeId: c.assigneeId ? String(c.assigneeId) : undefined,
      assigneeName: c.assigneeName,
      lastMessage: {
        content: c.contactEmail ? `Conversation with ${c.contactEmail}` : 'Conversation updated',
        timestamp: c.lastMessageAt ? new Date(c.lastMessageAt).toLocaleString() : 'Just now',
      },
      tags: c.labels,
      unreadCount: c.unreadCount,
    };
  });

  const handleBulkAssign = (conversationIds: string[], assigneeId: string) => {
    const assigneeName =
      assigneeId === 'user-1'
        ? 'John Doe'
        : assigneeId === 'user-2'
          ? 'Jane Smith'
          : assigneeId === 'unassigned'
            ? undefined
            : `User ${assigneeId}`;

    bulkUpdateConversations(conversationIds, {
      assigneeId: assigneeId === 'unassigned' ? null : Number(assigneeId) || null,
      assigneeName: assigneeName ?? null,
    })
      .then(() => {
        toast.success(`Assigned ${conversationIds.length} conversation(s)`);
        fetchConversations();
      })
      .catch((error) => {
        console.error('Bulk assign failed:', error);
        toast.error('Bulk assign failed');
      });
  };

  const handleBulkAddTags = (conversationIds: string[], tags: string[]) => {
    bulkUpdateConversations(conversationIds, {
      labelsOp: { op: 'add', labels: tags },
    })
      .then(() => {
        toast.success(`Tagged ${conversationIds.length} conversation(s)`);
        fetchConversations();
      })
      .catch((error) => {
        console.error('Bulk tag failed:', error);
        toast.error('Bulk tag failed');
      });
  };

  const handleBulkArchive = (conversationIds: string[]) => {
    bulkUpdateConversations(conversationIds, { status: 'resolved' })
      .then(() => {
        toast.success(`Archived ${conversationIds.length} conversation(s)`);
        fetchConversations();
      })
      .catch((error) => {
        console.error('Bulk archive failed:', error);
        toast.error('Bulk archive failed');
      });
  };

  const handleBulkDelete = (conversationIds: string[]) => {
    bulkDeleteConversations(conversationIds)
      .then(() => {
        if (selectedConversation && conversationIds.includes(selectedConversation.id)) {
          selectConversation(null);
        }
        toast.success(`Deleted ${conversationIds.length} conversation(s)`);
        fetchConversations();
      })
      .catch((error) => {
        console.error('Bulk delete failed:', error);
        toast.error('Bulk delete failed');
      });
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-lux-gold-soft flex h-12 w-12 items-center justify-center rounded-xl">
              <Users2 className="h-6 w-6 text-lux-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Omnichannel</h1>
              <p className="text-sm text-muted-foreground">
                Customer conversations across all channels
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

        {/* Stats */}
        <div className="mt-4">
          <OmnichannelStatsCards stats={stats} loading={loading} />
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Conversation List */}
        <div className={cn(
          "flex flex-col border-r bg-background transition-all",
          selectedConversation ? "w-80" : "w-96"
        )}>
          {/* Header */}
          <div className="border-b px-4 py-3">
            <div className="mb-3">
              <h1 className="text-lg font-semibold">Omnichannel</h1>
              <p className="text-xs text-muted-foreground">
                {conversations.length} conversations
              </p>
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
            <InboxFilters filters={filters} onFiltersChange={setFilters} />
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading...</p>
                </div>
              </div>
            ) : showEmptyState ? (
              <div className="flex h-full items-center justify-center p-6">
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <MessageCircle className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold">No conversations yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Connect your channels to start
                  </p>
                  <Button className="mt-4" size="sm" onClick={() => window.location.href = '/app/omnichannel/setup'}>
                    Setup Channels
                  </Button>
                </div>
              </div>
            ) : (
              <div className="p-2">
                <OmnichannelConversationListWithBulk
                  conversations={bulkConversations}
                  onSelectConversation={(conv) => handleConversationClick(conv.id)}
                  onAssign={handleBulkAssign}
                  onAddTags={handleBulkAddTags}
                  onArchive={handleBulkArchive}
                  onDelete={handleBulkDelete}
                />
              </div>
            )}
          </div>

          {/* Refresh Button */}
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full"
              onClick={fetchConversations}
              disabled={loading}
            >
              <RefreshCw className={cn("mr-2 h-4 w-4", loading && "animate-spin")} />
              Refresh
            </Button>
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
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary/10 text-sm">
                        {selectedConversation.contactName?.charAt(0).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div>
                      <h2 className="text-sm font-semibold">
                        {selectedConversation.contactName || 'Unknown'}
                      </h2>
                      <p className="text-xs text-muted-foreground">
                        {selectedConversation.contactEmail}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <ConversationActions conversation={selectedConversation} />
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
                  </div>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex flex-1 overflow-hidden">
                <div className="flex-1 overflow-auto bg-muted/20">
                  {loadingMessages ? (
                    <div className="flex h-full items-center justify-center">
                      <div className="text-center">
                        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
                        <p className="mt-2 text-sm text-muted-foreground">Loading messages...</p>
                      </div>
                    </div>
                  ) : (
                    <>
                      <ModernMessageThread
                        messages={conversationMessages}
                        onReaction={handleReaction}
                        onReply={handleReply}
                      />
                      {/* Typing Indicator */}
                      {isTyping && (
                        <TypingIndicator
                          userName={selectedConversation.contactName || 'Customer'}
                          userInitial={selectedConversation.contactName?.charAt(0)}
                        />
                      )}
                    </>
                  )}
                </div>

                {/* Sidebar */}
                {showSidebar && (
                  <div className="w-80 border-l bg-background">
                    <ConversationSidebar conversation={selectedConversation} />
                  </div>
                )}
              </div>

              {/* Compose Box */}
              <ModernComposeBox
                onSend={handleSendMessage}
                sending={sending}
                channelType={(selectedConversation as unknown as Record<string, unknown> | null)?.channelType as string || 'web'}
                placeholder="Type a message..."
                showPrivateToggle={true}
                showChannelBadge={true}
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
