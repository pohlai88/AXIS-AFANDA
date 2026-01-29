'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useConversationsStore } from '@/app/lib/stores/conversations-store';
import { getConversation, getMessages, sendMessage } from '@/app/lib/api/conversations';
import { ModernMessageThread } from '@/app/components/chat/modern-message-thread';
import { ModernComposeBox } from '@/app/components/chat/modern-compose-box';
import { TypingIndicator } from '@/app/components/chat/typing-indicator';
import { ConversationSidebar } from '@/app/components/omnichannel/conversation-sidebar';
import { ConversationActions } from '@/app/components/omnichannel/conversation-actions';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function ConversationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;

  const { selectedConversation, selectConversation, messages, setMessages } =
    useConversationsStore();

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Fetch conversation and messages
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);

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
        setLoading(false);
      }
    }

    fetchData();
  }, [conversationId]);

  // Handle send message
  const handleSendMessage = async (content: string, isPrivate: boolean = false) => {
    try {
      setSending(true);
      const result = await sendMessage(conversationId, content, isPrivate);

      // Add message to store
      const conversationMessages = messages[conversationId] || [];
      setMessages(conversationId, [...conversationMessages, {
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
    // TODO: Implement API call to add reaction
    toast.success(`Reacted with ${emoji}`);
  };

  // Handle reply
  const handleReply = (messageId: string) => {
    // TODO: Implement reply functionality
    toast.info('Reply feature coming soon');
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!selectedConversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">Conversation not found</h3>
          <Button onClick={() => router.push('/app/omnichannel')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Omnichannel
          </Button>
        </div>
      </div>
    );
  }

  const conversationMessages = messages[conversationId] || [];

  return (
    <div className="flex h-full">
      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="border-b bg-background px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => router.push('/app/omnichannel')}
                variant="ghost"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-lg font-semibold">
                  {selectedConversation.contactName || 'Unknown'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {selectedConversation.contactEmail}
                </p>
              </div>
            </div>

            <ConversationActions conversation={selectedConversation} />
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-auto bg-muted/20">
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
      </div>

      {/* Sidebar */}
      <div className="w-80 border-l bg-muted/10">
        <ConversationSidebar conversation={selectedConversation} />
      </div>
    </div>
  );
}
