# AXIS-AFENDA Orchestrator

Hono-based API service that orchestrates Chatwoot, manages approvals, and provides unified activity timeline.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Neon PostgreSQL database (configured in `.env`)
- Chatwoot Cloud account (or self-hosted)

### Installation

```bash
cd apps/orchestrator
npm install
```

### Environment Variables

Add to root `.env` file:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require

# Chatwoot Cloud
CHATWOOT_API_URL=https://app.chatwoot.com
CHATWOOT_API_TOKEN=your_personal_access_token
CHATWOOT_ACCOUNT_ID=1

# Server
PORT=8000
CORS_ORIGIN=http://localhost:3000
```

### Database Setup

```bash
# Generate migrations
npm run db:generate

# Push schema to database
npm run db:push

# Open Drizzle Studio (optional)
npm run db:studio
```

### Development

```bash
# Start dev server with hot reload
npm run dev

# Server runs on http://localhost:8000
```

### Production Build

```bash
# Build TypeScript
npm run build

# Start production server
npm start
```

## 📡 API Endpoints

### Health Check
```
GET /health
```

### Approvals
```
GET    /api/v1/approvals
GET    /api/v1/approvals/:id
POST   /api/v1/approvals
PATCH  /api/v1/approvals/:id
DELETE /api/v1/approvals/:id
```

### Conversations
```
GET    /api/v1/conversations
GET    /api/v1/conversations/:id
GET    /api/v1/conversations/:id/messages
POST   /api/v1/conversations/:id/messages
PATCH  /api/v1/conversations/:id
POST   /api/v1/conversations/:id/escalate
```

### Activity Timeline
```
GET    /api/v1/activity          # Regular HTTP
GET    /api/v1/activity          # SSE (Accept: text/event-stream)
GET    /api/v1/activity/:id
```

### Webhooks
```
POST   /api/v1/webhooks/chatwoot
```

## 🔗 Chatwoot Webhook Setup

### ⚠️ Important: Webhook URL Issue

**Your current URL won't work:**
```
https://www.localhost:8000/api/v1/webhooks/chatwoot  ❌
```

Chatwoot Cloud cannot reach `localhost`. You need a public URL.

### Option 1: Use ngrok (Recommended for Local Testing)

1. **Install ngrok:**
   ```bash
   # Download from https://ngrok.com/download
   # Or use chocolatey: choco install ngrok
   ```

2. **Start ngrok tunnel:**
   ```bash
   ngrok http 8000
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok-free.app`)

4. **Update webhook URL in Chatwoot:**
   ```
   https://abc123.ngrok-free.app/api/v1/webhooks/chatwoot
   ```

5. **Test the webhook** by creating a conversation in Chatwoot

### Option 2: Deploy to Railway (Production)

1. **Connect GitHub repo to Railway**
2. **Set environment variables** in Railway dashboard
3. **Deploy** - Railway will provide a public URL
4. **Use webhook URL:**
   ```
   https://your-orchestrator.railway.app/api/v1/webhooks/chatwoot
   ```

### Webhook Events Supported

- ✅ `conversation_created`
- ✅ `conversation_updated`
- ✅ `conversation_status_changed`
- ✅ `message_created`
- ✅ `message_updated`
- ✅ `webwidget_triggered`
- ✅ `contact_created`
- ✅ `contact_updated`
- ✅ `conversation_typing_on`
- ✅ `conversation_typing_off`

## 🧪 Testing

### Test Webhook Locally

1. Start orchestrator: `npm run dev`
2. Start ngrok: `ngrok http 8000`
3. Update Chatwoot webhook URL with ngrok URL
4. Create a test conversation in Chatwoot
5. Check orchestrator logs for webhook events

### Test API Endpoints

```bash
# Health check
curl http://localhost:8000/health

# Get conversations (requires auth header)
curl -H "Authorization: Bearer mock-token" http://localhost:8000/api/v1/conversations

# Get approvals
curl -H "Authorization: Bearer mock-token" http://localhost:8000/api/v1/approvals
```

## 📊 Database Schema

- `tenants` - Multi-tenant isolation
- `conversations` - Synced from Chatwoot
- `messages` - Message history
- `approvals` - Approval workflow
- `activities` - Unified activity timeline
- `webhook_events` - Webhook audit trail

## 🚢 Deployment

### Railway

1. Connect GitHub repository
2. Set environment variables
3. Deploy automatically on push

### Environment Variables for Production

```bash
DATABASE_URL=postgresql://...
CHATWOOT_API_URL=https://app.chatwoot.com
CHATWOOT_API_TOKEN=your_token
CHATWOOT_ACCOUNT_ID=1
CORS_ORIGIN=https://your-app.vercel.app
PORT=8000
```

## 📝 Notes

- Authentication is currently mocked for MVP (ready for Keycloak integration)
- Tenant mapping from Chatwoot account_id is currently hardcoded (needs implementation)
- SSE endpoint supports both regular HTTP and Server-Sent Events
