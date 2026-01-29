'use client';

/**
 * Hook for real-time meeting updates via SSE
 * 
 * Subscribes to meeting-specific events and provides typed updates.
 */

import { useEffect } from 'react';
import { useSSEMulti } from './use-sse';
import { toast } from 'sonner';

export interface MeetingUpdate {
  meetingId: string;
  type: 'participant_joined' | 'participant_left' | 'minutes_completed' | 'status_changed' | 'task_created';
  data: any;
  timestamp: Date;
}

export interface UseMeetingUpdatesOptions {
  enabled?: boolean;
  showToasts?: boolean;
  onUpdate?: (update: MeetingUpdate) => void;
}

/**
 * Subscribe to real-time updates for a specific meeting
 */
export function useMeetingUpdates(
  meetingId: string,
  options: UseMeetingUpdatesOptions = {}
) {
  const { enabled = true, showToasts = true, onUpdate } = options;

  const sseUrl = `/api/v1/meetings/${meetingId}/updates`;

  const eventTypes = [
    'participant_joined',
    'participant_left',
    'minutes_completed',
    'status_changed',
    'task_created',
  ];

  const { events, isConnected, error } = useSSEMulti(
    sseUrl,
    eventTypes,
    {
      enabled,
      onOpen: () => {
        console.log(`[Meeting Updates] Connected to ${meetingId}`);
      },
      onError: (err) => {
        console.error(`[Meeting Updates] Error for ${meetingId}:`, err);
        if (showToasts) {
          toast.error('Lost connection to meeting updates', {
            description: 'Attempting to reconnect...',
          });
        }
      },
    }
  );

  // Handle incoming events
  useEffect(() => {
    events.forEach((event, eventType) => {
      const update: MeetingUpdate = {
        meetingId,
        type: eventType as MeetingUpdate['type'],
        data: event.data,
        timestamp: event.timestamp,
      };

      // Show toast notifications
      if (showToasts) {
        switch (eventType) {
          case 'participant_joined':
            toast.info(`${event.data.userName} joined the meeting`, {
              icon: '👋',
            });
            break;
          case 'participant_left':
            toast.info(`${event.data.userName} left the meeting`, {
              icon: '👋',
            });
            break;
          case 'minutes_completed':
            toast.success('Meeting minutes completed!', {
              icon: '✨',
              description: 'View them in the Minutes tab',
            });
            break;
          case 'status_changed':
            toast.info(`Meeting status: ${event.data.newStatus}`, {
              icon: '📅',
            });
            break;
          case 'task_created':
            toast.success('New task created', {
              icon: '✅',
              description: event.data.taskTitle,
            });
            break;
        }
      }

      // Call custom handler
      onUpdate?.(update);
    });
  }, [events, meetingId, showToasts, onUpdate]);

  return {
    isConnected,
    error,
    updates: Array.from(events.values()),
  };
}

/**
 * Subscribe to updates for all meetings (e.g., for the main list page)
 */
export function useGlobalMeetingUpdates(options: UseMeetingUpdatesOptions = {}) {
  const { enabled = true, showToasts = false, onUpdate } = options;

  const sseUrl = '/api/v1/meetings/updates';

  const eventTypes = [
    'meeting_created',
    'meeting_updated',
    'meeting_deleted',
    'meeting_started',
    'meeting_completed',
  ];

  const { events, isConnected, error } = useSSEMulti(
    sseUrl,
    eventTypes,
    {
      enabled,
      onOpen: () => {
        console.log('[Global Meeting Updates] Connected');
      },
      onError: (err) => {
        console.error('[Global Meeting Updates] Error:', err);
      },
    }
  );

  // Handle incoming events
  useEffect(() => {
    events.forEach((event, eventType) => {
      const update: MeetingUpdate = {
        meetingId: event.data.meetingId,
        type: eventType as any,
        data: event.data,
        timestamp: event.timestamp,
      };

      // Show toast notifications for important events
      if (showToasts) {
        switch (eventType) {
          case 'meeting_started':
            toast.info(`Meeting "${event.data.meetingTitle}" has started`, {
              icon: '🎥',
              action: {
                label: 'Join',
                onClick: () => {
                  window.location.href = `/app/consultations/${event.data.meetingId}`;
                },
              },
            });
            break;
          case 'meeting_created':
            toast.success('New meeting scheduled', {
              icon: '📅',
              description: event.data.meetingTitle,
            });
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
