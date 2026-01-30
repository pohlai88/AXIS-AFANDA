/**
 * Approvals Stats API Route
 */

import { NextRequest, NextResponse } from 'next/server';
import { db, schema } from '@/app/lib/db/client';
import { eq, and, sql } from 'drizzle-orm';
import { getTenantId } from '@/app/lib/middleware/nextjs-tenant';
import { createErrorResponse } from '@/app/lib/validation/nextjs-errors';
import { jsonResponse, createCountQuery } from '@/app/lib/api/route-helpers';

// Next.js 16 Route Configuration
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const tenantId = getTenantId(request);

    // Run all count queries in parallel for better performance
    const [
      [submittedCount],
      [approvedCount],
      [rejectedCount],
      [ceoApprovalCount],
      [escalationCount],
    ] = await Promise.all([
      db
        .select({ count: createCountQuery() })
        .from(schema.approvals)
        .where(
          and(
            eq(schema.approvals.tenantId, tenantId),
            eq(schema.approvals.status, 'submitted')
          )
        ),
      db
        .select({ count: createCountQuery() })
        .from(schema.approvals)
        .where(
          and(
            eq(schema.approvals.tenantId, tenantId),
            eq(schema.approvals.status, 'approved')
          )
        ),
      db
        .select({ count: createCountQuery() })
        .from(schema.approvals)
        .where(
          and(
            eq(schema.approvals.tenantId, tenantId),
            eq(schema.approvals.status, 'rejected')
          )
        ),
      db
        .select({ count: createCountQuery() })
        .from(schema.approvals)
        .where(
          and(
            eq(schema.approvals.tenantId, tenantId),
            eq(schema.approvals.type, 'ceo_approval')
          )
        ),
      db
        .select({ count: createCountQuery() })
        .from(schema.approvals)
        .where(
          and(
            eq(schema.approvals.tenantId, tenantId),
            eq(schema.approvals.type, 'escalation')
          )
        ),
    ]);

    return jsonResponse(
      {
        data: {
          submitted: submittedCount.count,
          approved: approvedCount.count,
          rejected: rejectedCount.count,
          ceoApproval: ceoApprovalCount.count,
          escalation: escalationCount.count,
        },
      },
      {
        cache: 'public, max-age=30, stale-while-revalidate=60',
      }
    );
  } catch (error) {
    return createErrorResponse(error);
  }
}
