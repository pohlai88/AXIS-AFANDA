/**
 * SSE endpoint for meeting-specific updates
 * 
 * This is a mock implementation for testing.
 * Replace with actual orchestrator integration in production.
 */

import { NextRequest, NextResponse } from 'next/server';
import { TIMING } from '@/app/lib/constants';

// Use nodejs runtime for better SSE support in development
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET handler for meeting-specific updates SSE endpoint
 * @param request - The incoming request
 * @param context - Route context containing params
 * @returns SSE stream response
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    // In Next.js 15+, params is a Promise that must be awaited
    const { id: meetingId } = await params;

    // Validate meeting ID
    if (!meetingId || typeof meetingId !== 'string') {
      return NextResponse.json(
        { error: 'Invalid meeting ID' },
        { status: 400 }
      );
    }

    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      async start(controller) {
        // Send initial SSE comment (helps establish connection)
        controller.enqueue(encoder.encode(': SSE connection established\n\n'));

        // Send initial connection message
        const message = {
          type: 'connected',
          data: { meetingId },
          timestamp: new Date().toISOString(),
        };

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(message)}\n\n`)
        );

        // Simulate periodic updates (for testing)
        const interval = setInterval(() => {
          // Randomly send different types of updates
          const updateTypes = [
            {
              type: 'participant_joined',
              data: {
                userId: '4',
                userName: 'Alex Smith',
                timestamp: new Date().toISOString(),
              },
            },
            {
              type: 'participant_left',
              data: {
                userId: '3',
                userName: 'Emma Wilson',
                timestamp: new Date().toISOString(),
              },
            },
            {
              type: 'status_changed',
              data: {
                newStatus: 'in_progress',
                previousStatus: 'scheduled',
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
            console.error(`[Meeting ${meetingId} SSE] Error sending update:`, error);
            clearInterval(interval);
          }
        }, TIMING.SSE_HEARTBEAT_MS); // Send update every 15 seconds

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
        'X-Accel-Buffering': 'no', // Disable buffering in nginx
      },
    });
  } catch (error) {
    console.error('[Meeting SSE] Error creating stream:', error);
    return NextResponse.json(
      { error: 'Failed to create meeting updates stream' },
      { status: 500 }
    );
  }
}
