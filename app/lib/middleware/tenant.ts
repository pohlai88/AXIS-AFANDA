import { Context, Next } from 'hono';
import { getAuthUser } from './auth';
import { ForbiddenError } from '../lib/errors';

// ============================================================================
// Tenant isolation middleware
// ============================================================================
export async function tenantMiddleware(c: Context, next: Next) {
  const user = getAuthUser(c);

  // Extract tenant ID from query params or path params
  const tenantIdFromQuery = c.req.query('tenantId');
  const tenantIdFromPath = c.req.param('tenantId');
  const requestedTenantId = tenantIdFromPath || tenantIdFromQuery;

  // If tenant ID is specified in request, validate access
  if (requestedTenantId && requestedTenantId !== user.tenantId) {
    // TODO: Check if user has access to multiple tenants (org → team hierarchy)
    // For MVP: Only allow access to user's own tenant
    throw new ForbiddenError('Access denied to this tenant');
  }

  // Set tenant ID in context for use in queries
  c.set('tenantId', user.tenantId);

  await next();
}

// ============================================================================
// Get tenant ID from context
// ============================================================================
export function getTenantId(c: Context): string {
  const tenantId = c.get('tenantId');

  if (!tenantId) {
    throw new Error('Tenant ID not found in context');
  }

  return tenantId;
}

// ============================================================================
// Validate tenant access for a resource
// ============================================================================
export function validateTenantAccess(resourceTenantId: string, contextTenantId: string) {
  if (resourceTenantId !== contextTenantId) {
    throw new ForbiddenError('Access denied to this resource');
  }
}
