'use client';

/**
 * Hook for real-time activity stream via SSE
 * 
 * Connects to the global activity feed and provides real-time updates
 * for approvals, meetings, messages, and other system events.
 */

import { useSSEMulti } from './use-sse';

export interface Activity {
  id: string;
  tenantId: string;
  type: string;
  source: string;
  userId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
}

/**
 * Subscribe to real-time activity stream for a tenant
 * 
 * @param tenantId - The tenant ID to subscribe to
 * @param enabled - Whether to enable the connection (default: true)
 */
export function useActivityStream(tenantId: string, enabled = true) {
  const sseUrl = `/api/v1/activity`;

  // Subscribe to activity events and heartbeats
  const { events, isConnected, error } = useSSEMulti<Activity>(
    sseUrl,
    ['activity', 'heartbeat'],
    {
      enabled: enabled && !!tenantId,
      reconnectDelay: 3000,
      maxReconnectAttempts: 5,
      onOpen: () => {
        console.log('[ActivityStream] Connected to activity stream');
      },
      onError: (err) => {
        console.error('[ActivityStream] Connection error:', err);
      },
    }
  );

  // Get the latest activity event
  const activityEvent = events.get('activity');
  const heartbeatEvent = events.get('heartbeat');

  return {
    /** The latest activity from the stream */
    activity: activityEvent?.data ?? null,
    /** Whether the SSE connection is active */
    isConnected,
    /** Any connection error */
    error,
    /** Timestamp of last heartbeat (for connection health monitoring) */
    lastHeartbeat: heartbeatEvent?.timestamp ?? null,
  };
}
