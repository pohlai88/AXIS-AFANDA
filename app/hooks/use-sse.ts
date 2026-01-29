'use client';

/**
 * React hook for Server-Sent Events (SSE)
 * 
 * Provides a simple interface to subscribe to real-time events.
 */

import { useEffect, useState, useRef, useMemo } from 'react';
import { SSEClient, createSSEClient, type SSEEvent } from '@/app/lib/sse-client';

export interface UseSSEOptions {
  enabled?: boolean;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
  onOpen?: () => void;
  onError?: (error: Error) => void;
}

export interface UseSSEResult<T = unknown> {
  data: T | null;
  isConnected: boolean;
  error: Error | null;
  lastEvent: SSEEvent<T> | null;
}

/**
 * Hook to subscribe to a single SSE endpoint
 */
export function useSSE<T = unknown>(
  url: string,
  eventType?: string,
  options: UseSSEOptions = {}
): UseSSEResult<T> {
  const {
    enabled = true,
    reconnectDelay = 3000,
    maxReconnectAttempts = 5,
    onOpen,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastEvent, setLastEvent] = useState<SSEEvent<T> | null>(null);

  const clientRef = useRef<SSEClient | null>(null);

  useEffect(() => {
    if (!enabled || !url) return;

    // Create client
    const client = createSSEClient({
      url,
      reconnectDelay,
      maxReconnectAttempts,
    });

    clientRef.current = client;

    // Handle connection open
    const unsubOpen = client.onOpen(() => {
      setIsConnected(true);
      setError(null);
      onOpen?.();
    });

    // Handle errors
    const unsubError = client.onError((err) => {
      setIsConnected(false);
      setError(err);
      onError?.(err);
    });

    // Subscribe to events
    const unsubEvents = client.on<T>(eventType || 'message', (event) => {
      setData(event.data);
      setLastEvent(event);
    });

    // Connect
    client.connect();

    // Cleanup
    return () => {
      unsubOpen();
      unsubError();
      unsubEvents();
      client.close();
      clientRef.current = null;
    };
  }, [url, eventType, enabled, reconnectDelay, maxReconnectAttempts, onOpen, onError]);

  return {
    data,
    isConnected,
    error,
    lastEvent,
  };
}

/**
 * Hook to subscribe to multiple event types on a single SSE endpoint
 */
export function useSSEMulti<T = unknown>(
  url: string,
  eventTypes: string[],
  options: UseSSEOptions = {}
): {
  events: Map<string, SSEEvent<T>>;
  isConnected: boolean;
  error: Error | null;
} {
  const {
    enabled = true,
    reconnectDelay = 3000,
    maxReconnectAttempts = 5,
    onOpen,
    onError,
  } = options;

  const [events, setEvents] = useState<Map<string, SSEEvent<T>>>(new Map());
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clientRef = useRef<SSEClient | null>(null);

  // Memoize eventTypes to avoid spread in dependency array
  const eventTypesKey = useMemo(() => JSON.stringify(eventTypes), [eventTypes]);

  useEffect(() => {
    if (!enabled || !url || eventTypes.length === 0) return;

    // Create client
    const client = createSSEClient({
      url,
      reconnectDelay,
      maxReconnectAttempts,
    });

    clientRef.current = client;

    // Handle connection open
    const unsubOpen = client.onOpen(() => {
      setIsConnected(true);
      setError(null);
      onOpen?.();
    });

    // Handle errors
    const unsubError = client.onError((err) => {
      setIsConnected(false);
      setError(err);
      onError?.(err);
    });

    // Subscribe to all event types
    const unsubscribers = eventTypes.map((eventType) =>
      client.on<T>(eventType, (event) => {
        setEvents((prev) => new Map(prev).set(eventType, event));
      })
    );

    // Connect
    client.connect();

    // Cleanup
    return () => {
      unsubOpen();
      unsubError();
      unsubscribers.forEach((unsub) => unsub());
      client.close();
      clientRef.current = null;
    };
  }, [url, enabled, reconnectDelay, maxReconnectAttempts, onOpen, onError, eventTypesKey, eventTypes]);

  return {
    events,
    isConnected,
    error,
  };
}
