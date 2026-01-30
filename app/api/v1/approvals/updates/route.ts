/**
 * SSE endpoint for approval updates
 * 
 * Provides real-time updates for approval submissions, decisions, morphs, and PUSH events.
 * This is a mock implementation for development - replace with actual orchestrator integration.
 */

import { NextRequest, NextResponse } from 'next/server';
import { TIMING } from '@/app/lib/constants';

// Use nodejs runtime for better SSE support in development
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * GET handler for approval updates SSE endpoint
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
            message: 'Approval updates stream connected',
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
            console.error('[Approval Updates SSE] Heartbeat error:', error);
            clearInterval(heartbeatInterval);
          }
        }, TIMING.SSE_HEARTBEAT_MS);

        // Cleanup on disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(heartbeatInterval);
          controller.close();
        });

        // TODO: Replace with actual orchestrator subscription
        // In production, subscribe to approval events from orchestrator:
        // - approval_submitted
        // - approval_approved
        // - approval_rejected
        // - approval_morphed
        // - approval_pushed
        // - approval_commented
        // - approval_mentioned
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
    console.error('[Approval Updates SSE] Error creating stream:', error);
    return NextResponse.json(
      { error: 'Failed to create approval updates stream' },
      { status: 500 }
    );
  }
}
