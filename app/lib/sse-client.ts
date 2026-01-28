/**
 * SSE (Server-Sent Events) client for real-time activity updates
 */

import { useEffect, useRef } from 'react';
import { useConversationsStore } from './stores/conversations-store';
import { useApprovalsStore } from './stores/approvals-store';
import { toast } from 'sonner';

interface Activity {
  id: string;
  tenantId: string;
  type: string;
  source: string;
  title: string;
  description?: string;
  data: any;
  createdAt: string;
}

export function useActivityStream(tenantId: string) {
  const eventSourceRef = useRef<EventSource | null>(null);
  const connectingRef = useRef(false);
  const { addConversation, updateConversation, addMessage } = useConversationsStore();
  const { addApproval, updateApproval } = useApprovalsStore();

  useEffect(() => {
    if (!tenantId) return;

    // Prevent multiple connections
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      return;
    }

    // Prevent duplicate connection attempts
    if (connectingRef.current) {
      return;
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    const url = `${apiUrl}/activity?tenantId=${tenantId}`;

    connectingRef.current = true;
    console.log('🔌 SSE connecting...');

    // Create EventSource
    const eventSource = new EventSource(url, {
      withCredentials: false,
    });

    eventSourceRef.current = eventSource;

    // Handle messages
    eventSource.addEventListener('activity', (event) => {
      try {
        const activity: Activity = JSON.parse(event.data);
        console.log('📨 Activity received:', activity.type);

        handleActivity(activity);
      } catch (error) {
        console.error('Failed to parse activity:', error);
      }
    });

    // Handle heartbeat
    eventSource.addEventListener('heartbeat', (event) => {
      console.log('💓 Heartbeat received');
    });

    // Handle connection open
    eventSource.onopen = () => {
      connectingRef.current = false;
      console.log('✅ SSE connected');
    };

    // Handle errors
    eventSource.onerror = (error) => {
      // EventSource error object is often empty, check readyState instead
      const state = eventSource.readyState;

      if (state === EventSource.CLOSED) {
        connectingRef.current = false;
        console.log('❌ SSE connection closed');
        // Don't reconnect automatically - cleanup will handle it
      } else if (state === EventSource.CONNECTING) {
        // Connecting state - don't log repeatedly
        if (!connectingRef.current) {
          console.log('⚠️ SSE reconnecting...');
          connectingRef.current = true;
        }
      }
    };

    // Cleanup
    return () => {
      connectingRef.current = false;
      if (eventSource.readyState !== EventSource.CLOSED) {
        eventSource.close();
      }
      eventSourceRef.current = null;
    };
  }, [tenantId]);

  function handleActivity(activity: Activity) {
    switch (activity.type) {
      case 'conversation_created':
        // Refresh conversations list
        toast.info('New conversation received');
        break;

      case 'message_created':
        // Add message to conversation
        if (activity.data.conversationId) {
          // Message will be added via webhook sync
          toast.info('New message received');
        }
        break;

      case 'conversation_updated':
        // Update conversation in store
        if (activity.data.conversationId) {
          updateConversation(activity.data.conversationId, activity.data.changes);
        }
        break;

      case 'approval_created':
        // Show notification for new approval
        toast.info('New approval request', {
          description: activity.description,
        });
        break;

      case 'approval_approved':
      case 'approval_rejected':
        // Show notification for approval decision
        toast.success(activity.title, {
          description: activity.description,
        });
        break;

      case 'conversation_escalated':
        // Show notification for escalation
        toast.info('Conversation escalated', {
          description: activity.description,
        });
        break;

      default:
        console.log('Unhandled activity type:', activity.type);
    }
  }
}
