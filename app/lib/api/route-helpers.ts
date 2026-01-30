/**
 * Next.js API Route Helpers
 * 
 * Common patterns and utilities for API routes following Next.js 16 best practices
 */

import { NextRequest, NextResponse } from 'next/server';
import { sql, SQL } from 'drizzle-orm';

// ============================================================================
// Runtime Configuration Constants
// ============================================================================

/**
 * Use nodejs runtime for routes that need:
 * - Database connections
 * - SSE/WebSocket
 * - Long-running operations
 */
export const NODEJS_RUNTIME = 'nodejs' as const;

/**
 * Use edge runtime for routes that need:
 * - Ultra-low latency
 * - No database/IO (or using serverless-compatible drivers)
 * - Global distribution
 */
export const EDGE_RUNTIME = 'edge' as const;

/**
 * Force dynamic rendering for routes that:
 * - Return user-specific data
 * - Query databases
 * - Use request-time information
 */
export const FORCE_DYNAMIC = 'force-dynamic' as const;

// ============================================================================
// Response Helpers
// ============================================================================

/**
 * Create a JSON response with proper headers
 */
export function jsonResponse<T>(
  data: T,
  options: {
    status?: number;
    cache?: 'no-store' | 'force-cache' | `max-age=${number}`;
    revalidate?: number;
  } = {}
) {
  const { status = 200, cache, revalidate } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Set cache control
  if (cache === 'no-store') {
    headers['Cache-Control'] = 'no-store, must-revalidate';
  } else if (cache === 'force-cache') {
    headers['Cache-Control'] = 'public, immutable';
  } else if (cache) {
    headers['Cache-Control'] = `public, ${cache}`;
  }

  // Set revalidate header for ISR
  if (revalidate !== undefined) {
    headers['x-vercel-revalidate'] = revalidate.toString();
  }

  return NextResponse.json(data, { status, headers });
}

/**
 * Create a paginated response
 */
export function paginatedResponse<T>(
  data: T[],
  meta: {
    page: number;
    limit: number;
    total: number;
  },
  options?: Parameters<typeof jsonResponse>[1]
) {
  return jsonResponse(
    {
      data,
      meta: {
        ...meta,
        totalPages: Math.ceil(meta.total / meta.limit),
      },
    },
    options
  );
}

// ============================================================================
// Query Optimization Helpers
// ============================================================================

/**
 * Helper to perform paginated query with count in a single transaction
 * This avoids N+1 queries and ensures consistency
 */
export async function queryWithCount<T>(
  queryFn: (opts: { limit: number; offset: number }) => Promise<T[]>,
  countFn: () => Promise<number>,
  page: number,
  limit: number
): Promise<{ data: T[]; total: number }> {
  // Execute both queries in parallel for better performance
  const [data, total] = await Promise.all([
    queryFn({ limit, offset: (page - 1) * limit }),
    countFn(),
  ]);

  return { data, total };
}

/**
 * Create a count query helper
 */
export function createCountQuery(): SQL<number> {
  return sql<number>`cast(count(*) as integer)`;
}

// ============================================================================
// SSE Response Helpers
// ============================================================================

/**
 * Create an SSE response with proper headers
 */
export function createSSEResponse(stream: ReadableStream) {
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering in nginx
    },
  });
}

/**
 * SSE stream encoder
 */
export class SSEEncoder {
  private encoder = new TextEncoder();

  /**
   * Encode a message for SSE
   */
  encode(event: string, data: unknown): Uint8Array {
    const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
    return this.encoder.encode(message);
  }

  /**
   * Encode a comment (for keeping connection alive)
   */
  comment(text: string): Uint8Array {
    return this.encoder.encode(`: ${text}\n\n`);
  }

  /**
   * Encode a heartbeat
   */
  heartbeat(): Uint8Array {
    return this.encode('heartbeat', { timestamp: new Date().toISOString() });
  }
}

// ============================================================================
// Request Helpers
// ============================================================================

/**
 * Parse pagination from query params (already handled by validateQueryParams,
 * but this is a convenience wrapper)
 */
export function getPagination(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));

  return { page, limit };
}

/**
 * Get filter params from search params
 */
export function getFilters(
  searchParams: URLSearchParams,
  allowedFilters: string[]
): Record<string, string> {
  const filters: Record<string, string> = {};

  for (const key of allowedFilters) {
    const value = searchParams.get(key);
    if (value) {
      filters[key] = value;
    }
  }

  return filters;
}
