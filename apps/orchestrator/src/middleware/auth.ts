import { Context, Next } from 'hono';
import { UnauthorizedError } from '../lib/errors';

// ============================================================================
// Auth middleware (JWT validation - to be implemented with Keycloak)
// ============================================================================
export async function authMiddleware(c: Context, next: Next) {
  // For MVP: Mock authentication
  // TODO: Implement JWT validation with Keycloak

  const authHeader = c.req.header('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // For development: Allow requests without auth
    // In production: throw new UnauthorizedError('Missing or invalid authorization header');
    c.set('user', {
      id: 'mock-user-id',
      email: 'mock@example.com',
      name: 'Mock User',
      tenantId: 'mock-tenant-id',
    });
    return next();
  }

  const token = authHeader.substring(7);

  // TODO: Validate JWT token with Keycloak
  // For now, mock user data
  c.set('user', {
    id: 'mock-user-id',
    email: 'mock@example.com',
    name: 'Mock User',
    tenantId: 'mock-tenant-id',
  });

  await next();
}

// ============================================================================
// Get authenticated user from context
// ============================================================================
export function getAuthUser(c: Context) {
  const user = c.get('user');

  if (!user) {
    throw new UnauthorizedError('User not authenticated');
  }

  return user;
}

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
