/**
 * SSE endpoint for global activity stream
 * 
 * Provides real-time updates for approvals, meetings, messages, and other system events.
 * This is a stub implementation for development - replace with actual orchestrator integration.
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * GET handler for activity stream SSE endpoint
 * @param request - The incoming request
 * @returns SSE stream response
 */
export async function GET(request: NextRequest): Promise<Response> {
  try {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        // Send initial connection message
        const connectionMessage = {
          type: 'connected',
          data: {
            timestamp: new Date().toISOString(),
            message: 'Activity stream connected',
          },
        };

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(connectionMessage)}\n\n`)
        );

        // Send heartbeat every 30 seconds to keep connection alive
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
            console.error('[Activity SSE] Heartbeat error:', error);
            clearInterval(heartbeatInterval);
          }
        }, 30000);

        // Cleanup on disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeatInterval);
          controller.close();
        });
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
    console.error('[Activity SSE] Error creating stream:', error);
    return NextResponse.json(
      { error: 'Failed to create activity stream' },
      { status: 500 }
    );
  }
}
