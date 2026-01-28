# Multi-Tenant Chatwoot Architecture

## The Question

> "I found a problem, only my alone token, meaning to say I'm creating apps for myself? Or can other tenants use this service too?"

**Answer**: Other tenants CAN use this service! You have two architecture options.

---

## Architecture Options

### Option 1: **Shared Chatwoot Account** (Recommended for MVP)

All tenants share **your Chatwoot account**, but each gets their own **Inbox**.

```
Your Chatwoot Account (ID: 123)
├── Inbox 1 (ID: 10) → Acme Corp (tenant-1)
├── Inbox 2 (ID: 20) → TechStart Inc (tenant-2)
└── Inbox 3 (ID: 30) → Global LLC (tenant-3)
```

**How it works**:
1. Create one inbox per tenant in Chatwoot
2. Store `chatwootInboxId` in tenant record
3. Filter conversations by inbox ID
4. All use same API token (yours)

**Pros**:
- ✅ Simple setup
- ✅ Single Chatwoot subscription
- ✅ One webhook, one API token
- ✅ Centralized management

**Cons**:
- ❌ All data in one account
- ❌ Plan limits shared across tenants
- ❌ Can't give tenants direct Chatwoot access

**Best for**: SaaS where you manage support for all customers

---

### Option 2: **Dedicated Chatwoot Accounts** (Enterprise)

Each tenant gets their **own Chatwoot account**.

```
Chatwoot Cloud
├── Account 1 (Acme Corp)
│   ├── API Token: xxx-tenant-1
│   └── Account ID: 100
├── Account 2 (TechStart Inc)
│   ├── API Token: yyy-tenant-2
│   └── Account ID: 200
└── Account 3 (Global LLC)
    ├── API Token: zzz-tenant-3
    └── Account ID: 300
```

**How it works**:
1. Each tenant creates their own Chatwoot account
2. Store their API credentials in tenant record (encrypted)
3. Create Chatwoot client per tenant
4. Complete data isolation

**Pros**:
- ✅ Complete data isolation
- ✅ Tenants can manage their own Chatwoot
- ✅ Separate billing per tenant
- ✅ Better for enterprise customers

**Cons**:
- ❌ More complex setup
- ❌ Multiple Chatwoot subscriptions
- ❌ Need to store credentials securely

**Best for**: White-label solutions, enterprise customers

---

## Implementation

### Database Schema (Already Updated)

```typescript
export const tenants = pgTable('tenants', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  type: text('type').notNull(),
  
  // Option 1: Shared account
  chatwootInboxId: integer('chatwoot_inbox_id'),
  
  // Option 2: Dedicated account
  chatwootApiUrl: text('chatwoot_api_url'),
  chatwootApiToken: text('chatwoot_api_token'), // Encrypted
  chatwootAccountId: integer('chatwoot_account_id'),
  
  // ... other fields
});
```

### Usage Examples

#### Option 1: Shared Account Setup

```typescript
// 1. Create inbox in Chatwoot for tenant
const inbox = await chatwoot.createInbox({
  name: 'Acme Corp Support',
  channel: { type: 'web_widget' }
});

// 2. Store inbox ID in tenant record
await db.insert(tenants).values({
  id: 'tenant-1',
  name: 'Acme Corp',
  type: 'org',
  chatwootInboxId: inbox.id, // ← Store inbox ID
});

// 3. Filter conversations by inbox
const conversations = await chatwoot.getConversations({
  inbox_id: tenant.chatwootInboxId
});
```

#### Option 2: Dedicated Account Setup

```typescript
// 1. Tenant creates their own Chatwoot account
// 2. Tenant provides API credentials

// 3. Store credentials (encrypted)
await db.insert(tenants).values({
  id: 'tenant-2',
  name: 'TechStart Inc',
  type: 'org',
  chatwootApiUrl: 'https://app.chatwoot.com',
  chatwootApiToken: encrypt('their-api-token'),
  chatwootAccountId: 200,
});

// 4. Create client per tenant
const chatwoot = createChatwootClientForTenant(tenant);
const conversations = await chatwoot.getConversations();
```

---

## Updated Service Code

```typescript
// apps/orchestrator/src/services/chatwoot.ts

/**
 * Create Chatwoot client for a specific tenant
 */
export function createChatwootClientForTenant(tenant: {
  chatwootApiUrl?: string | null;
  chatwootApiToken?: string | null;
  chatwootAccountId?: number | null;
  chatwootInboxId?: number | null;
}): ChatwootClient {
  // Option 2: Tenant has dedicated account
  if (tenant.chatwootApiToken && tenant.chatwootAccountId) {
    return new ChatwootClient({
      apiUrl: tenant.chatwootApiUrl || 'https://app.chatwoot.com',
      apiToken: tenant.chatwootApiToken,
      accountId: tenant.chatwootAccountId,
    });
  }
  
  // Option 1: Tenant uses shared account (your token)
  return createChatwootClient();
}

/**
 * Get inbox ID for filtering (Option 1)
 */
export function getTenantInboxId(tenant: {
  chatwootInboxId?: number | null;
}): number | undefined {
  return tenant.chatwootInboxId || undefined;
}
```

---

## Webhook Handling

### Option 1: Single Webhook

```typescript
// Webhook receives all events from your account
app.post('/api/v1/webhooks/chatwoot', async (c) => {
  const payload = await c.req.json();
  
  // Map inbox ID to tenant
  const inboxId = payload.conversation.inbox_id;
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.chatwootInboxId, inboxId)
  });
  
  // Process for that tenant
  await syncConversation(tenant.id, payload);
});
```

### Option 2: Multiple Webhooks

```typescript
// Each tenant's Chatwoot account sends webhooks to same endpoint
app.post('/api/v1/webhooks/chatwoot', async (c) => {
  const payload = await c.req.json();
  
  // Map account ID to tenant
  const accountId = payload.account.id;
  const tenant = await db.query.tenants.findFirst({
    where: eq(tenants.chatwootAccountId, accountId)
  });
  
  // Process for that tenant
  await syncConversation(tenant.id, payload);
});
```

---

## Migration Path

### Phase 1: MVP (Shared Account)

1. Use your Chatwoot account
2. Create inbox per tenant
3. Store `chatwootInboxId` in tenant table
4. Filter by inbox ID

### Phase 2: Enterprise (Dedicated Accounts)

1. Add tenant onboarding flow
2. Let tenants provide their Chatwoot credentials
3. Store encrypted credentials
4. Use dedicated client per tenant
5. Support both modes simultaneously

---

## Security Considerations

### Encrypting API Tokens

```typescript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY!; // 32 bytes
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

export function decrypt(text: string): string {
  const parts = text.split(':');
  const iv = Buffer.from(parts.shift()!, 'hex');
  const encrypted = Buffer.from(parts.join(':'), 'hex');
  const decipher = createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}
```

### Environment Variables

```bash
# .env
ENCRYPTION_KEY=your-32-byte-encryption-key-here-must-be-32-chars
```

---

## Comparison Table

| Feature          | Option 1: Shared      | Option 2: Dedicated     |
| ---------------- | --------------------- | ----------------------- |
| Setup Complexity | ⭐ Simple              | ⭐⭐⭐ Complex             |
| Data Isolation   | ⚠️ Inbox-level         | ✅ Account-level         |
| Cost             | 💰 Single subscription | 💰💰💰 Per tenant          |
| Tenant Control   | ❌ No direct access    | ✅ Full control          |
| Scalability      | ⚠️ Plan limits         | ✅ Unlimited             |
| Use Case         | SaaS, SMB             | Enterprise, White-label |

---

## Recommendation

**For AXIS-AFENDA MVP**: Start with **Option 1** (Shared Account)

**Why**:
1. Faster to market
2. Lower cost
3. Simpler to manage
4. Good enough for most customers

**When to upgrade to Option 2**:
- Enterprise customers require data isolation
- Customers want direct Chatwoot access
- You hit plan limits
- White-label requirements

---

## Next Steps

1. **Update seed script** to include `chatwootInboxId`:
   ```bash
   npm run db:push  # Apply schema changes
   ```

2. **Create inboxes in Chatwoot**:
   - Go to Settings → Inboxes → Add Inbox
   - Create one per tenant
   - Note the inbox IDs

3. **Update tenant records**:
   ```sql
   UPDATE tenants 
   SET chatwoot_inbox_id = 123 
   WHERE id = 'mock-tenant-id';
   ```

4. **Test filtering**:
   ```typescript
   const conversations = await chatwoot.getConversations({
     inbox_id: tenant.chatwootInboxId
   });
   ```

---

## FAQ

**Q: Can I mix both options?**  
A: Yes! Some tenants can use shared account (Option 1) while others use dedicated accounts (Option 2). The code supports both.

**Q: How do I migrate from Option 1 to Option 2?**  
A: Export conversations from your Chatwoot account, import to tenant's account, update tenant record with new credentials.

**Q: What about self-hosted Chatwoot?**  
A: Option 2 supports this! Just set `chatwootApiUrl` to your self-hosted URL.

**Q: How many tenants can share one account?**  
A: Depends on your Chatwoot plan. Check inbox limits and conversation volume.

---

*Last updated: 2026-01-28*
