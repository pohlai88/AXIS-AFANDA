/**
 * Next.js Error Handling
 * Utilities for handling errors in Next.js API routes
 */

import { NextResponse } from 'next/server';
import { ZodError, type ZodSchema } from 'zod';
import { AppError, formatErrorResponse } from './errors';

// ============================================================================
// Create error response for Next.js
// ============================================================================
export function createErrorResponse(error: unknown, defaultStatus = 500) {
  console.error('API Error:', error);

  const statusCode = error instanceof AppError ? error.statusCode : defaultStatus;
  const response = formatErrorResponse(error);

  return NextResponse.json(response, { status: statusCode });
}

// ============================================================================
// Async route handler wrapper with error handling
// ============================================================================
export function withErrorHandling<T>(
  handler: (request: Request, context?: any) => Promise<Response>
) {
  return async (request: Request, context?: any): Promise<Response> => {
    try {
      return await handler(request, context);
    } catch (error) {
      return createErrorResponse(error);
    }
  };
}

// ============================================================================
// Validate request body with Zod
// ============================================================================
export async function validateRequestBody<T>(
  request: Request,
  schema: ZodSchema<T>
): Promise<T> {
  try {
    const body = await request.json();
    return schema.parse(body);
  } catch (error) {
    if (error instanceof ZodError) {
      throw error;
    }
    throw new Error('Invalid request body');
  }
}

// ============================================================================
// Validate query params with Zod
// ============================================================================
export function validateQueryParams<T>(
  request: Request,
  schema: ZodSchema<T>
): T {
  const url = new URL(request.url);
  const params = Object.fromEntries(url.searchParams.entries());
  return schema.parse(params);
}
