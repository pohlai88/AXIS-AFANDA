/**
 * SSE endpoint for whiteboard-specific updates
 * 
 * Provides real-time collaboration events for a specific whiteboard (cursor positions, 
 * shape changes, collaborator joins/leaves).
 * This is a mock implementation for development - replace with actual tldraw sync integration.
 */

import { NextRequest, NextResponse } from 'next/server';
import { TIMING } from '@/app/lib/constants';

// Use nodejs runtime for better SSE support in development
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET handler for whiteboard updates SSE endpoint
 * @param request - The incoming request
 * @param context - Route context with params
 * @returns SSE stream response
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id: whiteboardId } = await context.params;
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        // Send initial SSE comment (helps establish connection)
        controller.enqueue(encoder.encode(': SSE connection established\n\n'));

        // Send initial connection message
        const connectionMessage = {
          type: 'connected',
          data: {
            whiteboardId,
            timestamp: new Date().toISOString(),
            message: `Connected to whiteboard ${whiteboardId}`,
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
                whiteboardId,
                timestamp: new Date().toISOString(),
              },
            };
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(heartbeat)}\n\n`)
            );
          } catch (error) {
            console.error('[Whiteboard Updates SSE] Heartbeat error:', error);
            clearInterval(heartbeatInterval);
          }
        }, TIMING.SSE_HEARTBEAT_MS);

        // Cleanup on disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeatInterval);
          controller.close();
        });

        // TODO: Replace with actual tldraw sync server integration
        // In production, subscribe to whiteboard events:
        // - collaborator_joined
        // - collaborator_left
        // - cursor_moved
        // - shape_created
        // - shape_updated
        // - shape_deleted
        // - snapshot_created
        // - whiteboard_locked
        // - whiteboard_unlocked
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
    console.error('[Whiteboard Updates SSE] Error creating stream:', error);
    return NextResponse.json(
      { error: 'Failed to create whiteboard updates stream' },
      { status: 500 }
    );
  }
}
