'use client';

/**
 * Hook for real-time conversation updates via SSE
 * 
 * Subscribes to conversation events from Chatwoot/Omnichannel and provides
 * typed updates for messages, assignments, status changes, and contact updates.
 */

import { useEffect } from 'react';
import { useSSEMulti } from './use-sse';
import { toast } from 'sonner';

export interface ConversationUpdateData {
  conversationId?: string;
  contactName?: string;
  contactId?: string;
  channelType?: 'email' | 'whatsapp' | 'facebook' | 'instagram' | 'twitter' | 'telegram' | 'web' | 'sms';
  messageContent?: string;
  messageSender?: string;
  assignedTo?: string;
  assignedToName?: string;
  status?: 'open' | 'resolved' | 'pending' | 'snoozed';
  priority?: 'urgent' | 'high' | 'normal' | 'low';
  isTyping?: boolean;
  typingUser?: string;
}

export interface ConversationUpdate {
  conversationId: string;
  type:
  | 'message_received'
  | 'message_sent'
  | 'conversation_assigned'
  | 'conversation_unassigned'
  | 'conversation_status_changed'
  | 'conversation_resolved'
  | 'conversation_reopened'
  | 'typing_indicator'
  | 'contact_updated'
  | 'priority_changed';
  data: ConversationUpdateData;
  timestamp: Date;
}

export interface UseConversationUpdatesOptions {
  enabled?: boolean;
  showToasts?: boolean;
  onUpdate?: (update: ConversationUpdate) => void;
}

/**
 * Subscribe to updates for all conversations (e.g., for the inbox list)
 */
export function useConversationUpdates(options: UseConversationUpdatesOptions = {}) {
  const { enabled = true, showToasts = true, onUpdate } = options;

  const sseUrl = '/api/v1/conversations/updates';

  const eventTypes = [
    'message_received',
    'message_sent',
    'conversation_assigned',
    'conversation_unassigned',
    'conversation_status_changed',
    'conversation_resolved',
    'conversation_reopened',
    'typing_indicator',
    'contact_updated',
    'priority_changed',
  ];

  const { events, isConnected, error } = useSSEMulti(
    sseUrl,
    eventTypes,
    {
      enabled,
      onOpen: () => {
        console.log('[Conversation Updates] Connected');
      },
      onError: (err) => {
        console.error('[Conversation Updates] Error:', err);
        if (showToasts) {
          toast.error('Lost connection to conversation updates', {
            description: 'Attempting to reconnect...',
          });
        }
      },
    }
  );

  // Handle incoming events
  useEffect(() => {
    events.forEach((event, eventType) => {
      const data = event.data as ConversationUpdateData;
      const update: ConversationUpdate = {
        conversationId: data.conversationId || '',
        type: eventType as ConversationUpdate['type'],
        data,
        timestamp: event.timestamp,
      };

      // Show toast notifications for important events
      if (showToasts) {
        switch (eventType) {
          case 'message_received':
            toast.info(`New message from ${data.contactName || 'Customer'}`, {
              icon: '💬',
              description: data.messageContent?.slice(0, 50) + (data.messageContent && data.messageContent.length > 50 ? '...' : ''),
              action: {
                label: 'View',
                onClick: () => {
                  window.location.href = `/app/inbox/${data.conversationId}`;
                },
              },
            });
            break;
          case 'conversation_assigned':
            toast.success('Conversation assigned', {
              icon: '👤',
              description: `Assigned to ${data.assignedToName || 'someone'}`,
            });
            break;
          case 'conversation_resolved':
            toast.success('Conversation resolved', {
              icon: '✅',
              description: data.contactName,
            });
            break;
          case 'priority_changed':
            if (data.priority === 'urgent') {
              toast.warning('Conversation marked as urgent', {
                icon: '🚨',
                description: data.contactName,
                action: {
                  label: 'View',
                  onClick: () => {
                    window.location.href = `/app/inbox/${data.conversationId}`;
                  },
                },
              });
            }
            break;
        }
      }

      // Call custom handler
      onUpdate?.(update);
    });
  }, [events, showToasts, onUpdate]);

  return {
    isConnected,
    error,
    updates: Array.from(events.values()),
  };
}
