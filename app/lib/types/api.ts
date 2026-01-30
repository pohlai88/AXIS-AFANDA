/**
 * API Types - Request/Response types for API calls
 */

import { z } from 'zod';
import { PaginationMetaSchema } from './common';

// ============================================================================
// API Response Wrappers
// ============================================================================

/**
 * Standard API success response
 */
export const ApiSuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: dataSchema,
    message: z.string().optional(),
  });

export type ApiSuccessResponse<T> = {
  success: true;
  data: T;
  message?: string;
};

/**
 * Standard API error response
 */
export const ApiErrorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
  }),
});

export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

/**
 * Paginated API response
 */
export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    data: z.array(dataSchema),
    meta: PaginationMetaSchema,
  });

export type PaginatedResponse<T> = {
  success: true;
  data: T[];
  meta: z.infer<typeof PaginationMetaSchema>;
};

// ============================================================================
// API Error Class
// ============================================================================

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public code?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }

  toJSON() {
    return {
      success: false,
      error: {
        code: this.code || 'UNKNOWN_ERROR',
        message: this.message,
        details: this.details,
      },
    };
  }
}

// ============================================================================
// HTTP Methods
// ============================================================================

export type HttpMethod = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';

// ============================================================================
// API Client Config
// ============================================================================

export interface ApiClientConfig {
  baseUrl?: string;
  headers?: Record<string, string>;
  timeout?: number;
}

// ============================================================================
// Fetch Options
// ============================================================================

export interface FetchOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
  timeout?: number;
}
