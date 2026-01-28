# Chatwoot Integration Guide

## Overview

AXIS-AFENDA integrates with Chatwoot Cloud to provide omnichannel customer support (email, chat, social media) while maintaining a unified UX through the Shell app.

**Architecture**: Chatwoot Cloud (backend) → Orchestrator API (sync & orchestration) → Next.js Shell (custom UI)

---

## ✅ What's Implemented

### Backend (Orchestrator)

1. **Hono API Service** (`apps/orchestrator/`)
   - Running on http://localhost:8000
   - Drizzle ORM with Neon PostgreSQL
   - Full CRUD APIs for conversations, messages, approvals

2. **Webhook Handler** (`/api/v1/webhooks/chatwoot`)
   - Receives events from Chatwoot Cloud
   - Syncs conversations and messages to local DB
   - Creates activity timeline entries
   - Supports all subscribed events:
     - conversation_created, conversation_updated, conversation_status_changed
     - message_created, message_updated
     - webwidget_triggered, contact_created, contact_updated
     - conversation_typing_on, conversation_typing_off

3. **Chatwoot API Client** (`src/services/chatwoot.ts`)
   - Send messages
   - Update conversations (status, assignee, labels)
   - Fetch conversations and contacts
   - Get canned responses and agents

4. **Database Schema**
   - `tenants` - Multi-tenant isolation
   - `conversations` - Synced from Chatwoot
   - `messages` - Message history
   - `approvals` - Approval workflow
   - `activities` - Unified activity timeline
   - `webhook_events` - Audit trail

5. **Real-time Updates**
   - SSE endpoint (`/api/v1/activity`)
   - Heartbeat every 30 seconds
   - Polls for new activities every 2 seconds

### Frontend (Shell)

1. **Inbox Page** (`/app/inbox`)
   - Conversation list with filters
   - Search functionality
   - Status, priority, and assignee filters
   - Click to open conversation detail

2. **Conversation Detail** (`/app/inbox/[id]`)
   - Message thread with incoming/outgoing bubbles
   - Reply box with private note toggle
   - Contact info sidebar
   - Conversation actions (resolve, assign, escalate)

3. **Approvals Page** (`/app/approvals`)
   - List of approval requests
   - Filter by status (pending, approved, rejected)
   - Approve/reject actions with decision notes
   - Links to source conversations

4. **Real-time Updates**
   - SSE client connected to orchestrator
   - Toast notifications for new messages, approvals
   - Auto-refresh on events

---

## 🔧 Setup Guide

### 1. Chatwoot Cloud Setup

1. **Sign up**: https://chatwoot.com
2. **Create account** and get your Account ID
3. **Get API token**:
   - Go to Profile Settings → Access Token
   - Copy the token

4. **Configure webhook**:
   - Go to Settings → Integrations → Webhooks
   - Add webhook URL: `https://your-ngrok-url/api/v1/webhooks/chatwoot`
   - Subscribe to events (all selected by default)
   - Save

### 2. Local Development Setup

**Prerequisites**:
- Node.js 20+
- ngrok (for webhook testing)
- Neon PostgreSQL (already configured)

**Steps**:

1. **Install dependencies**:
   ```bash
   cd apps/orchestrator
   npm install
   ```

2. **Update .env** with Chatwoot credentials:
   ```bash
   CHATWOOT_API_URL=https://app.chatwoot.com
   CHATWOOT_API_TOKEN=your_token_here
   CHATWOOT_ACCOUNT_ID=your_account_id
   ```

3. **Setup database**:
   ```bash
   cd apps/orchestrator
   npm run db:push      # Push schema to Neon
   npm run db:seed      # Create mock tenant
   ```

4. **Start orchestrator**:
   ```bash
   npm run dev          # Runs on http://localhost:8000
   ```

5. **Start ngrok** (in separate terminal):
   ```bash
   ngrok http 8000
   ```
   Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

6. **Update Chatwoot webhook URL**:
   - Go to Chatwoot → Settings → Integrations → Webhooks
   - Update URL to: `https://abc123.ngrok-free.app/api/v1/webhooks/chatwoot`

7. **Start Next.js** (in separate terminal):
   ```bash
   npm run dev          # Runs on http://localhost:3000
   ```

8. **Test the integration**:
   - Create a conversation in Chatwoot
   - Check orchestrator logs for webhook events
   - Open http://localhost:3000/app/inbox
   - You should see the conversation!

---

## 🧪 Testing

### Test Webhook Locally

```bash
cd apps/orchestrator
npm run test:webhook
```

This sends mock webhook events to your local orchestrator.

### Check Database

```bash
cd apps/orchestrator
npm run db:check
```

Shows all conversations, messages, activities, and webhook events in the database.

### Test API Endpoints

```bash
# Health check
curl http://localhost:8000/health

# Get conversations
curl -H "Authorization: Bearer mock-token" \
  http://localhost:8000/api/v1/conversations

# Get approvals
curl -H "Authorization: Bearer mock-token" \
  http://localhost:8000/api/v1/approvals
```

---

## 📡 API Endpoints

### Conversations

```
GET    /api/v1/conversations
       ?status=open&priority=high&search=query&page=1&limit=20

GET    /api/v1/conversations/:id

GET    /api/v1/conversations/:id/messages

POST   /api/v1/conversations/:id/messages
       Body: { content: string, private: boolean }

PATCH  /api/v1/conversations/:id
       Body: { status, priority, assigneeId, teamId, labels }

POST   /api/v1/conversations/:id/escalate
```

### Approvals

```
GET    /api/v1/approvals
       ?status=submitted&type=escalation&page=1&limit=20

GET    /api/v1/approvals/:id

POST   /api/v1/approvals
       Body: { conversationId, type, reason, metadata }

PATCH  /api/v1/approvals/:id
       Body: { status: 'approved' | 'rejected', decision }

DELETE /api/v1/approvals/:id
```

### Activity Timeline

```
GET    /api/v1/activity
       ?type=message_created&source=chatwoot&page=1&limit=20
       
       Accept: text/event-stream  (for SSE)

GET    /api/v1/activity/:id
```

### Webhooks

```
POST   /api/v1/webhooks/chatwoot
       Body: Chatwoot webhook payload
```

---

## 🔄 Data Flow

### Incoming Message Flow

1. Customer sends message in Chatwoot
2. Chatwoot → Webhook → Orchestrator (`/api/v1/webhooks/chatwoot`)
3. Orchestrator syncs to database (conversations, messages tables)
4. Orchestrator creates activity log
5. Orchestrator emits SSE event
6. Shell receives SSE event → Updates UI → Shows toast notification

### Outgoing Message Flow

1. Agent types message in Shell
2. Shell → Orchestrator (`POST /api/v1/conversations/:id/messages`)
3. Orchestrator → Chatwoot API (send message)
4. Orchestrator stores message in database
5. Chatwoot sends webhook back (message_created)
6. Orchestrator ignores duplicate (idempotency check)

### Escalation Flow

1. Agent clicks "Escalate to CEO" in conversation detail
2. Shell → Orchestrator (`POST /api/v1/conversations/:id/escalate`)
3. Orchestrator creates approval record
4. Orchestrator creates activity log
5. Orchestrator emits SSE event
6. CEO sees notification in Shell
7. CEO opens `/app/approvals` and approves/rejects
8. Shell → Orchestrator (`PATCH /api/v1/approvals/:id`)
9. Orchestrator updates approval status
10. Orchestrator creates activity log
11. Agent receives notification

---

## 🚀 Deployment

### Orchestrator to Railway

1. **Connect GitHub repo** to Railway
2. **Set root directory**: `apps/orchestrator`
3. **Environment variables**:
   ```
   DATABASE_URL=your_neon_connection_string
   CHATWOOT_API_URL=https://app.chatwoot.com
   CHATWOOT_API_TOKEN=your_token
   CHATWOOT_ACCOUNT_ID=your_account_id
   CORS_ORIGIN=https://your-app.vercel.app
   PORT=8000
   ```
4. **Deploy** - Railway provides public URL
5. **Update Chatwoot webhook** to Railway URL

### Shell to Vercel

1. **Connect GitHub repo** to Vercel
2. **Environment variables**:
   ```
   NEXT_PUBLIC_API_URL=https://your-orchestrator.railway.app/api/v1
   DATABASE_URL=your_neon_connection_string
   ```
3. **Deploy** - Vercel provides public URL

---

## 📊 Current Status

### ✅ Completed

- [x] Orchestrator API with Hono + Drizzle
- [x] Database schema and migrations
- [x] Webhook handler for all Chatwoot events
- [x] Chatwoot API client
- [x] SSE endpoint for real-time updates
- [x] Inbox UI with conversation list and filters
- [x] Conversation detail with message thread
- [x] Reply box with private notes
- [x] Approvals page with approve/reject actions
- [x] Escalation workflow

### 🔄 In Progress

- [ ] Deploy to Railway (orchestrator)
- [ ] Deploy to Vercel (shell)
- [ ] Connect real Chatwoot account
- [ ] Test end-to-end flow

### 📝 TODO

- [ ] Implement Keycloak authentication
- [ ] Map Chatwoot account_id to tenant_id
- [ ] Add canned responses dropdown
- [ ] Add file attachment support
- [ ] Add label management UI
- [ ] Add agent assignment UI
- [ ] Implement Matrix integration
- [ ] Implement Jitsi integration

---

## 🐛 Troubleshooting

### Webhook not receiving events

1. Check ngrok is running: `ngrok http 8000`
2. Check orchestrator is running: `curl http://localhost:8000/health`
3. Check webhook URL in Chatwoot matches ngrok URL
4. Check orchestrator logs for errors
5. Test webhook manually: `npm run test:webhook`

### Conversations not showing in Shell

1. Check orchestrator is running
2. Check database has conversations: `npm run db:check`
3. Check API client URL: `NEXT_PUBLIC_API_URL` in .env
4. Check browser console for API errors
5. Check CORS settings in orchestrator

### SSE not connecting

1. Check `NEXT_PUBLIC_API_URL` is set correctly
2. Check orchestrator SSE endpoint: `curl -H "Accept: text/event-stream" http://localhost:8000/api/v1/activity`
3. Check browser console for SSE errors
4. Check tenant ID matches: `mock-tenant-id`

---

## 📚 References

- [Chatwoot API Docs](https://www.chatwoot.com/developers/api/)
- [Chatwoot Webhooks](https://www.chatwoot.com/docs/product/channels/api/webhook)
- [Hono Documentation](https://hono.dev/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Server-Sent Events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events)

---

*Last updated: 2026-01-28*
