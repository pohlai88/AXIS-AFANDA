/**
 * SSE endpoint for conversation updates
 * 
 * Provides real-time updates for new messages, status changes, assignments, and contact updates.
 * This is a mock implementation for development - replace with actual orchestrator/Chatwoot integration.
 */

import { NextRequest, NextResponse } from 'next/server';
import { TIMING } from '@/app/lib/constants';

// Use nodejs runtime for better SSE support in development
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET handler for conversation updates SSE endpoint
 * @param request - The incoming request
 * @returns SSE stream response
 */
export async function GET(request: NextRequest): Promise<Response> {
  try {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        // Send initial SSE comment (helps establish connection)
        controller.enqueue(encoder.encode(': SSE connection established\n\n'));

        // Send initial connection message
        const connectionMessage = {
          type: 'connected',
          data: {
            timestamp: new Date().toISOString(),
            message: 'Conversation updates stream connected',
          },
        };

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(connectionMessage)}\n\n`)
        );

        // Send heartbeat every 15 seconds to keep connection alive
        const heartbeatInterval = setInterval(() => {
          try {
            const heartbeat = {
              type: 'heartbeat',
              data: {
                timestamp: new Date().toISOString(),
              },
            };
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(heartbeat)}\n\n`)
            );
          } catch (error) {
            console.error('[Conversation Updates SSE] Heartbeat error:', error);
            clearInterval(heartbeatInterval);
          }
        }, TIMING.SSE_HEARTBEAT_MS);

        // Cleanup on disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeatInterval);
          controller.close();
        });

        // TODO: Replace with actual Chatwoot webhook/orchestrator subscription
        // In production, subscribe to conversation events:
        // - message_received
        // - message_sent
        // - conversation_assigned
        // - conversation_status_changed
        // - conversation_resolved
        // - typing_indicator
        // - contact_updated
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    console.error('[Conversation Updates SSE] Error creating stream:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation updates stream' },
      { status: 500 }
    );
  }
}
