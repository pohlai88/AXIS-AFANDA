/**
 * Next.js Auth Middleware
 * Adapted from Hono middleware for Next.js API routes
 */

import { NextRequest } from 'next/server';
import { UnauthorizedError } from '../validation/errors';

// ============================================================================
// Type for authenticated user
// ============================================================================
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  tenantId: string;
  roles?: string[];
  groups?: string[];
}

// ============================================================================
// Get authenticated user from Next.js request
// ============================================================================
export function getAuthUser(request: NextRequest): AuthUser {
  // For MVP: Mock authentication
  // TODO: Implement JWT validation with Keycloak
  
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For development: Return mock user
    // In production: throw new UnauthorizedError('Missing or invalid authorization header');
    return {
      id: 'mock-user-id',
      email: 'mock@example.com',
      name: 'Mock User',
      tenantId: 'mock-tenant-id',
    };
  }
  
  const token = authHeader.substring(7);
  
  // TODO: Validate JWT token with Keycloak
  // For now, mock user data
  return {
    id: 'mock-user-id',
    email: 'mock@example.com',
    name: 'Mock User',
    tenantId: 'mock-tenant-id',
  };
}

// ============================================================================
// Validate request has authentication
// ============================================================================
export function requireAuth(request: NextRequest): AuthUser {
  const user = getAuthUser(request);
  
  if (!user) {
    throw new UnauthorizedError('User not authenticated');
  }
  
  return user;
}
