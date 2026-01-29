/**
 * SSE endpoint for global meeting updates
 * 
 * This is a mock implementation for testing.
 * Replace with actual orchestrator integration in production.
 */

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

/**
 * GET handler for global meeting updates SSE endpoint
 * @param request - The incoming request
 * @returns SSE stream response
 */
export async function GET(request: NextRequest): Promise<Response> {
  try {
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        // Send initial connection message
        const message = {
          type: 'connected',
          data: { timestamp: new Date().toISOString() },
        };

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(message)}\n\n`)
        );

        // Simulate periodic global updates (for testing)
        const interval = setInterval(() => {
          const updateTypes = [
            {
              type: 'meeting_started',
              data: {
                meetingId: 'meeting-' + Date.now(),
                meetingTitle: 'Sprint Planning',
                timestamp: new Date().toISOString(),
              },
            },
            {
              type: 'meeting_created',
              data: {
                meetingId: 'meeting-' + Date.now(),
                meetingTitle: 'Budget Review Q2',
                scheduledStart: new Date(Date.now() + 3600000).toISOString(),
                timestamp: new Date().toISOString(),
              },
            },
          ];

          const randomUpdate = updateTypes[Math.floor(Math.random() * updateTypes.length)];

          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(randomUpdate)}\n\n`)
            );
          } catch (error) {
            console.error('[Meeting Updates SSE] Error sending update:', error);
            clearInterval(interval);
          }
        }, 30000); // Send update every 30 seconds

        // Cleanup on disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(interval);
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
    console.error('[Meeting Updates SSE] Error creating stream:', error);
    return NextResponse.json(
      { error: 'Failed to create meeting updates stream' },
      { status: 500 }
    );
  }
}
