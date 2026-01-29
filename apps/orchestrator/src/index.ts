import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { serve } from '@hono/node-server';
import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables from root .env
dotenv.config({ path: resolve(process.cwd(), '../../.env') });

// Import routes
import { approvalsRouter } from './routes/approvals';
import { conversationsRouter } from './routes/conversations';
import { activityRouter } from './routes/activity';
import { webhooksRouter } from './routes/webhooks';
import meetingsRouter from './routes/meetings';

// Import middleware
import { authMiddleware } from './middleware/auth';
import { tenantMiddleware } from './middleware/tenant';
import { errorHandler } from './lib/errors';

// ============================================================================
// Create Hono app
// ============================================================================
const app = new Hono();

// ============================================================================
// Global middleware
// ============================================================================
app.use('*', logger());
app.use('*', cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
}));

// ============================================================================
// Health check
// ============================================================================
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    version: '0.1.0',
  });
});

// ============================================================================
// API routes (with auth and tenant middleware)
// ============================================================================
const api = new Hono();

// Apply auth and tenant middleware to all API routes
api.use('*', authMiddleware);
api.use('*', tenantMiddleware);

// Mount routers
api.route('/approvals', approvalsRouter);
api.route('/conversations', conversationsRouter);
api.route('/activity', activityRouter);
api.route('/meetings', meetingsRouter);

// Webhooks don't need auth (they have their own validation)
app.route('/api/v1/webhooks', webhooksRouter);

// Mount API under /api/v1
app.route('/api/v1', api);

// ============================================================================
// Error handling
// ============================================================================
app.onError((err, c) => {
  return errorHandler(err, c);
});

// ============================================================================
// 404 handler
// ============================================================================
app.notFound((c) => {
  return c.json({
    error: {
      code: 'NOT_FOUND',
      message: 'Route not found',
    },
  }, 404);
});

// ============================================================================
// Start server
// ============================================================================
const port = parseInt(process.env.PORT || '8000', 10);

console.log(`🚀 Orchestrator starting on port ${port}...`);

serve({
  fetch: app.fetch,
  port,
});

console.log(`✅ Orchestrator running at http://localhost:${port}`);
console.log(`📊 Health check: http://localhost:${port}/health`);
console.log(`📡 API base: http://localhost:${port}/api/v1`);
