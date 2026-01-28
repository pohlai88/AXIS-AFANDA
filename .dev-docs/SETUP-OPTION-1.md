# Option 1 Setup Guide: Shared Chatwoot Account

## 📋 Overview

This guide walks you through setting up **Option 1: Shared Chatwoot Account with Multiple Inboxes**.

Each tenant gets their own inbox within your Chatwoot account, providing logical separation while using a single subscription.

---

## ✅ Prerequisites

- [ ] Chatwoot account created at https://app.chatwoot.com
- [ ] Orchestrator running (`npm run dev` in `apps/orchestrator/`)
- [ ] Database schema updated (`npm run db:push`)
- [ ] ngrok running (`ngrok http 8000`)

---

## 🚀 Step 1: Create Inboxes in Chatwoot

### 1.1 Login to Chatwoot
Go to: https://app.chatwoot.com

### 1.2 Create Inboxes

1. Click **Settings** (gear icon) → **Inboxes**
2. Click **"Add Inbox"**
3. Choose channel type (recommend **"Website"** for testing)
4. Configure inbox:
   - **Name**: "Mock Tenant Support" (or your tenant name)
   - **Website URL**: http://localhost:3000 (or your domain)
   - **Widget Color**: Choose any color
5. Click **"Create Inbox"**
6. **Note the Inbox ID** from the URL:
   ```
   https://app.chatwoot.com/app/accounts/1/settings/inboxes/123
                                                              ^^^
                                                         This is inbox ID
   ```

### 1.3 Repeat for Each Tenant

Create additional inboxes:
- **Inbox 2**: "Acme Corp Support" → Note inbox ID
- **Inbox 3**: "TechStart Support" → Note inbox ID

**Example**:
```
✅ Mock Tenant Support → Inbox ID: 123
✅ Acme Corp Support → Inbox ID: 456  
✅ TechStart Support → Inbox ID: 789
```

---

## 🔧 Step 2: Map Inboxes to Tenants

### 2.1 Edit the Setup Script

Open `apps/orchestrator/setup-inboxes.ts` and update with your inbox IDs:

```typescript
const inboxMappings = [
  {
    tenantId: 'mock-tenant-id',
    tenantName: 'Mock Tenant',
    inboxId: 123, // ← Replace with your actual inbox ID
  },
  // Add more tenants
  // {
  //   tenantId: 'tenant-2',
  //   tenantName: 'Acme Corp',
  //   inboxId: 456,
  // },
];
```

### 2.2 Run the Setup Script

```bash
cd apps/orchestrator
npm run setup:inboxes
```

**Expected output**:
```
🔧 Setting up Chatwoot inboxes for tenants...

📋 Inbox mappings to apply:
  - Mock Tenant: Inbox ID 123

✅ Updated Mock Tenant → Inbox ID: 123

✨ Setup complete!
```

### 2.3 Verify in Database

```bash
npm run db:check
```

You should see the `chatwoot_inbox_id` populated for your tenant.

---

## 🧪 Step 3: Test the Integration

### 3.1 Create a Test Conversation

1. Go to Chatwoot → **Conversations**
2. Click **"New Conversation"**
3. Select the inbox you created (e.g., "Mock Tenant Support")
4. Add a contact and message
5. Send the message

### 3.2 Check Webhook Logs

In your orchestrator terminal, you should see:

```
Received Chatwoot webhook: conversation_created
✅ Mapped inbox 123 → tenant Mock Tenant (mock-tenant-id)
```

### 3.3 Verify in Shell UI

1. Open http://localhost:3000/app/inbox
2. You should see the conversation appear!
3. Click on it to view details
4. Try sending a reply

### 3.4 Test Filtering

Create conversations in different inboxes and verify they're isolated per tenant.

**Try the enhanced filters**:
1. Use quick presets (My Open, Urgent, Escalated)
2. Filter by priority and status
3. Try the "Has Escalation" filter
4. Use advanced filters (labels, date range, sorting)

See [Enhanced Filters Documentation](.dev-docs/ENHANCED-FILTERS.md) for full details.

---

## 📊 Step 4: Add More Tenants (Optional)

### 4.1 Create New Tenant in Database

```bash
cd apps/orchestrator
```

Create a new script `add-tenant.ts`:

```typescript
import { db, schema } from './src/db/client';

async function main() {
  const [tenant] = await db
    .insert(schema.tenants)
    .values({
      id: 'tenant-acme',
      name: 'Acme Corp',
      type: 'org',
      chatwootInboxId: 456, // Your inbox ID from Chatwoot
    })
    .returning();

  console.log('✅ Created tenant:', tenant);
}

main().then(() => process.exit(0));
```

Run it:
```bash
tsx add-tenant.ts
```

### 4.2 Test the New Tenant

1. Create a conversation in the new inbox
2. Check orchestrator logs for tenant mapping
3. Verify isolation between tenants

---

## 🔍 Troubleshooting

### Problem: Webhook shows "No tenant found for inbox X"

**Solution**:
1. Check inbox ID is correct:
   ```bash
   npm run db:check
   ```
2. Verify inbox ID in Chatwoot matches database
3. Re-run setup script with correct ID

### Problem: Conversations from all inboxes appear for all tenants

**Solution**:
1. Check `chatwootInboxId` is set in database
2. Verify API calls filter by inbox:
   ```typescript
   const conversations = await chatwoot.getConversations({
     inbox_id: tenant.chatwootInboxId
   });
   ```

### Problem: Can't create inbox in Chatwoot

**Solution**:
- Check your Chatwoot plan limits
- Some plans limit number of inboxes
- Consider upgrading or using Option 2 for more tenants

---

## 📈 Monitoring

### View Tenant Mappings

```bash
cd apps/orchestrator
npm run db:check
```

### Check Webhook Events

```sql
SELECT * FROM webhook_events 
ORDER BY created_at DESC 
LIMIT 10;
```

### View Conversations by Tenant

```sql
SELECT 
  t.name as tenant_name,
  c.chatwoot_id,
  c.inbox_id,
  c.status,
  c.contact_name
FROM conversations c
JOIN tenants t ON c.tenant_id = t.id
ORDER BY c.created_at DESC;
```

---

## 🎯 Success Criteria

- [ ] Multiple inboxes created in Chatwoot
- [ ] Inbox IDs mapped to tenants in database
- [ ] Webhooks correctly identify tenant from inbox
- [ ] Conversations isolated per tenant
- [ ] Shell UI shows only tenant's conversations
- [ ] Replies sent to correct inbox

---

## 🚀 Next Steps

Once Option 1 is working:

1. **Add More Tenants**: Create more inboxes and map them
2. **Test Filtering**: Verify isolation between tenants
3. **Deploy to Production**: 
   - Deploy orchestrator to Railway
   - Update webhook URL in Chatwoot
   - Deploy shell to Vercel
4. **Consider Option 2**: For enterprise customers who need dedicated accounts

---

## 📚 Related Docs

- [Enhanced Filters](.dev-docs/ENHANCED-FILTERS.md) — Powerful filtering system
- [Multi-Tenant Architecture](.dev-docs/MULTI-TENANT-CHATWOOT.md)
- [Chatwoot Integration](.dev-docs/CHATWOOT-INTEGRATION.md)
- [Project Spec](.dev-docs/PROJECT-SPEC.md)

---

*Last updated: 2026-01-28*
