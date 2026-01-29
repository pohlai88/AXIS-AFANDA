'use client';

import { useEffect, useState } from 'react';
import { useConversationsStore } from '@/app/lib/stores/conversations-store';
import { getConversations, getConversation, getMessages, sendMessage } from '@/app/lib/api/conversations';
import { ConversationList } from '@/app/components/omnichannel/conversation-list';
import { InboxFilters } from '@/app/components/omnichannel/inbox-filters';
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
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function OmnichannelSplitPage() {
  const {
    conversations,
    setConversations,
    selectedConversation,
    selectConversation,
    messages,
    setMessages,
    setLoading,
    loading
  } = useConversationsStore();

  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<any>({ status: 'open' });
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      const result = await getConversations({
        ...filters,
        search: search || undefined,
      });
      setConversations(result.data as any);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchConversations();
  }, [filters]);

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) {
        fetchConversations();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  // Handle conversation click
  const handleConversationClick = async (conversationId: string) => {
    try {
      setLoadingMessages(true);

      // Fetch conversation details
      const convResult = await getConversation(conversationId);
      selectConversation(convResult.data as any);

      // Fetch messages
      const messagesResult = await getMessages(conversationId);
      setMessages(conversationId, messagesResult.data.map((m: any) => ({
        ...m,
        createdAt: new Date(m.createdAt),
      })));
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
    toast.info('Reply feature coming soon');
  };

  const conversationMessages = selectedConversation
    ? messages[selectedConversation.id] || []
    : [];

  // Empty state
  const showEmptyState = !loading && conversations.length === 0 && !search;

  return (
    <div className="flex h-full">
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
            <ConversationList
              conversations={conversations}
              onConversationClick={handleConversationClick}
              selectedId={selectedConversation?.id}
            />
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
              channelType={(selectedConversation as any).channelType || 'web'}
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
  );
}
