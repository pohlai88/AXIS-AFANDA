/**
 * SSE (Server-Sent Events) Client
 * 
 * Provides real-time updates from the orchestrator without polling.
 * Handles connection management, reconnection, and error handling.
 */

export interface SSEConfig {
  url: string;
  reconnectDelay?: number;
  maxReconnectAttempts?: number;
  withCredentials?: boolean;
}

export interface SSEEvent<T = unknown> {
  type: string;
  data: T;
  timestamp: Date;
}

export type SSEEventHandler<T = unknown> = (event: SSEEvent<T>) => void;
export type SSEErrorHandler = (error: Error) => void;
export type SSEOpenHandler = () => void;

export class SSEClient {
  private eventSource: EventSource | null = null;
  private config: Required<SSEConfig>;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private connectionTimer: NodeJS.Timeout | null = null;
  private handlers: Map<string, Set<SSEEventHandler>> = new Map();
  private errorHandlers: Set<SSEErrorHandler> = new Set();
  private openHandlers: Set<SSEOpenHandler> = new Set();
  private closed = false;

  constructor(config: SSEConfig) {
    this.config = {
      reconnectDelay: 3000,
      maxReconnectAttempts: 5,
      withCredentials: true,
      ...config,
    };
  }

  /**
   * Connect to the SSE endpoint
   */
  connect(): void {
    if (this.eventSource || this.closed) return;

    try {
      this.eventSource = new EventSource(this.config.url, {
        withCredentials: this.config.withCredentials,
      });

      this.eventSource.onopen = () => {
        console.log('[SSE] Connection established:', this.config.url);
        this.reconnectAttempts = 0;

        // Clear connection timeout
        if (this.connectionTimer) {
          clearTimeout(this.connectionTimer);
          this.connectionTimer = null;
        }

        this.openHandlers.forEach(handler => handler());
      };

      // Set a connection timeout (10 seconds)
      this.connectionTimer = setTimeout(() => {
        if (this.eventSource?.readyState === EventSource.CONNECTING) {
          console.warn('[SSE] Connection timeout - still connecting after 10s:', this.config.url);
        }
      }, 10000);

      this.eventSource.onerror = (error) => {
        const readyState = this.eventSource?.readyState;
        const stateNames = ['CONNECTING', 'OPEN', 'CLOSED'];
        const stateName = stateNames[readyState ?? 2];

        console.error('[SSE] Connection error:', {
          url: this.config.url,
          readyState,
          stateName,
          error,
          attempt: this.reconnectAttempts + 1,
        });

        // Only handle reconnect if connection is closed
        if (readyState === EventSource.CLOSED) {
          this.handleError(new Error(`SSE connection closed (${this.config.url})`));
          this.handleReconnect();
        } else if (readyState === EventSource.CONNECTING) {
          // Still trying to connect, don't trigger reconnect yet
          console.log('[SSE] Still attempting initial connection...');
        }
      };

      this.eventSource.onmessage = (event) => {
        this.handleMessage(event);
      };
    } catch (error) {
      console.error('[SSE] Failed to create EventSource:', error);
      this.handleError(error as Error);
    }
  }

  /**
   * Subscribe to a specific event type
   */
  on<T = unknown>(eventType: string, handler: SSEEventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());

      // Register event listener with EventSource
      if (this.eventSource) {
        this.eventSource.addEventListener(eventType, (event) => {
          this.handleMessage(event as MessageEvent, eventType);
        });
      }
    }

    this.handlers.get(eventType)!.add(handler as SSEEventHandler);

    // Return unsubscribe function
    return () => {
      const handlers = this.handlers.get(eventType);
      if (handlers) {
        handlers.delete(handler as SSEEventHandler);
        if (handlers.size === 0) {
          this.handlers.delete(eventType);
        }
      }
    };
  }

  /**
   * Subscribe to error events
   */
  onError(handler: SSEErrorHandler): () => void {
    this.errorHandlers.add(handler);
    return () => {
      this.errorHandlers.delete(handler);
    };
  }

  /**
   * Subscribe to connection open events
   */
  onOpen(handler: SSEOpenHandler): () => void {
    this.openHandlers.add(handler);
    return () => {
      this.openHandlers.delete(handler);
    };
  }

  /**
   * Close the connection
   */
  close(): void {
    this.closed = true;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.connectionTimer) {
      clearTimeout(this.connectionTimer);
      this.connectionTimer = null;
    }

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    this.handlers.clear();
    this.errorHandlers.clear();
    this.openHandlers.clear();
  }

  /**
   * Get connection state
   */
  get readyState(): number {
    return this.eventSource?.readyState ?? EventSource.CLOSED;
  }

  /**
   * Check if connected
   */
  get isConnected(): boolean {
    return this.eventSource?.readyState === EventSource.OPEN;
  }

  private handleMessage(event: MessageEvent, eventType?: string): void {
    try {
      const data = JSON.parse(event.data);
      const type = eventType || data.type || 'message';

      const sseEvent: SSEEvent = {
        type,
        data: data.data || data,
        timestamp: new Date(),
      };

      const handlers = this.handlers.get(type);
      if (handlers) {
        handlers.forEach(handler => {
          try {
            handler(sseEvent);
          } catch (error) {
            console.error(`[SSE] Handler error for ${type}:`, error);
          }
        });
      }
    } catch (error) {
      console.error('[SSE] Failed to parse message:', error, event.data);
    }
  }

  private handleError(error: Error): void {
    this.errorHandlers.forEach(handler => {
      try {
        handler(error);
      } catch (err) {
        console.error('[SSE] Error handler failed:', err);
      }
    });
  }

  private handleReconnect(): void {
    if (this.closed) return;

    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }

    if (this.reconnectAttempts >= this.config.maxReconnectAttempts) {
      console.error('[SSE] Max reconnect attempts reached');
      this.handleError(new Error('Max reconnect attempts reached'));
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `[SSE] Reconnecting (attempt ${this.reconnectAttempts}/${this.config.maxReconnectAttempts})...`
    );

    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, this.config.reconnectDelay);
  }
}

/**
 * Create a new SSE client
 */
export function createSSEClient(config: SSEConfig): SSEClient {
  return new SSEClient(config);
}
