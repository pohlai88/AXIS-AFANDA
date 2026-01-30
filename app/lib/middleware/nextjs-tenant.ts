/**
 * Next.js Tenant Middleware
 * Adapted from Hono middleware for Next.js API routes
 */

import { NextRequest } from 'next/server';
import { getAuthUser } from './nextjs-auth';
import { ForbiddenError } from '../validation/errors';

// ============================================================================
// Get tenant ID from authenticated user
// ============================================================================
export function getTenantId(request: NextRequest): string {
  const user = getAuthUser(request);
  
  // Extract tenant ID from query params if specified
  const url = new URL(request.url);
  const requestedTenantId = url.searchParams.get('tenantId');
  
  // If tenant ID is specified in request, validate access
  if (requestedTenantId && requestedTenantId !== user.tenantId) {
    // TODO: Check if user has access to multiple tenants (org → team hierarchy)
    // For MVP: Only allow access to user's own tenant
    throw new ForbiddenError('Access denied to this tenant');
  }
  
  return user.tenantId;
}

// ============================================================================
// Validate tenant access for a resource
// ============================================================================
export function validateTenantAccess(resourceTenantId: string, contextTenantId: string) {
  if (resourceTenantId !== contextTenantId) {
    throw new ForbiddenError('Access denied to this resource');
  }
}
