'use client';

/**
 * Hook for real-time whiteboard updates via SSE
 * 
 * Subscribes to whiteboard-specific collaboration events and provides typed
 * updates for cursor positions, shape changes, collaborator joins/leaves, etc.
 */

import { useEffect } from 'react';
import { useSSEMulti } from './use-sse';
import { toast } from 'sonner';

export interface WhiteboardUpdateData {
  whiteboardId?: string;
  whiteboardName?: string;
  userId?: string;
  userName?: string;
  userColor?: string;
  cursorX?: number;
  cursorY?: number;
  shapeId?: string;
  shapeType?: 'rectangle' | 'ellipse' | 'line' | 'arrow' | 'text' | 'draw' | 'sticky';
  snapshotId?: string;
  snapshotName?: string;
  isLocked?: boolean;
}

export interface WhiteboardUpdate {
  whiteboardId: string;
  type:
  | 'collaborator_joined'
  | 'collaborator_left'
  | 'cursor_moved'
  | 'shape_created'
  | 'shape_updated'
  | 'shape_deleted'
  | 'snapshot_created'
  | 'snapshot_restored'
  | 'whiteboard_locked'
  | 'whiteboard_unlocked'
  | 'selection_changed';
  data: WhiteboardUpdateData;
  timestamp: Date;
}

export interface UseWhiteboardUpdatesOptions {
  enabled?: boolean;
  showToasts?: boolean;
  onUpdate?: (update: WhiteboardUpdate) => void;
}

/**
 * Subscribe to real-time updates for a specific whiteboard
 */
export function useWhiteboardUpdates(
  whiteboardId: string,
  options: UseWhiteboardUpdatesOptions = {}
) {
  const { enabled = true, showToasts = false, onUpdate } = options;

  const sseUrl = `/api/v1/whiteboards/${whiteboardId}/updates`;

  const eventTypes = [
    'collaborator_joined',
    'collaborator_left',
    'cursor_moved',
    'shape_created',
    'shape_updated',
    'shape_deleted',
    'snapshot_created',
    'snapshot_restored',
    'whiteboard_locked',
    'whiteboard_unlocked',
    'selection_changed',
  ];

  const { events, isConnected, error } = useSSEMulti(
    sseUrl,
    eventTypes,
    {
      enabled,
      onOpen: () => {
        console.log(`[Whiteboard Updates] Connected to ${whiteboardId}`);
      },
      onError: (err) => {
        console.error(`[Whiteboard Updates] Error for ${whiteboardId}:`, err);
        if (showToasts) {
          toast.error('Lost connection to whiteboard', {
            description: 'Attempting to reconnect...',
          });
        }
      },
    }
  );

  // Handle incoming events
  useEffect(() => {
    events.forEach((event, eventType) => {
      const data = event.data as WhiteboardUpdateData;
      const update: WhiteboardUpdate = {
        whiteboardId,
        type: eventType as WhiteboardUpdate['type'],
        data,
        timestamp: event.timestamp,
      };

      // Show toast notifications for important events
      if (showToasts) {
        switch (eventType) {
          case 'collaborator_joined':
            toast.info(`${data.userName || 'Someone'} joined the whiteboard`, {
              icon: '👋',
            });
            break;
          case 'collaborator_left':
            toast.info(`${data.userName || 'Someone'} left the whiteboard`, {
              icon: '👋',
            });
            break;
          case 'snapshot_created':
            toast.success('Snapshot created', {
              icon: '📸',
              description: data.snapshotName,
            });
            break;
          case 'snapshot_restored':
            toast.info('Snapshot restored', {
              icon: '⏮️',
              description: data.snapshotName,
            });
            break;
          case 'whiteboard_locked':
            toast.warning('Whiteboard locked', {
              icon: '🔒',
              description: `by ${data.userName || 'someone'}`,
            });
            break;
          case 'whiteboard_unlocked':
            toast.success('Whiteboard unlocked', {
              icon: '🔓',
              description: `by ${data.userName || 'someone'}`,
            });
            break;
        }
      }

      // Call custom handler
      onUpdate?.(update);
    });
  }, [events, whiteboardId, showToasts, onUpdate]);

  return {
    isConnected,
    error,
    updates: Array.from(events.values()),
  };
}
