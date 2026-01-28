# Inbox Strategy for Multi-Tenant Setup

## The Question

> "There is no universal inbox, means I need to create one by one? Even via Twilio?"

**Answer**: Yes, you create inboxes per tenant, BUT you have smart options to make this easier!

---

## 🎯 Recommended Strategy

### **Hybrid Approach: Website Widget + Email**

```
┌─────────────────────────────────────────┐
│   Your Chatwoot Account                 │
├─────────────────────────────────────────┤
│  📱 Website Widget Inbox (Shared)       │
│     ↳ All tenants use same widget       │
│     ↳ Identify by custom attributes     │
│                                          │
│  📧 Email Inbox 1 → tenant1@domain.com  │
│  📧 Email Inbox 2 → tenant2@domain.com  │
│  📧 Email Inbox 3 → tenant3@domain.com  │
└─────────────────────────────────────────┘
```

**Why this works**:
- ✅ Website widget: One inbox, identify tenant by custom attributes
- ✅ Email: Separate inbox per tenant (natural separation)
- ✅ Cost-effective: No need for multiple Twilio numbers
- ✅ Flexible: Add more channels later

---

## Option 1: **Website Widget** (Easiest)

### Single Inbox, Multiple Tenants

**How it works**:
1. Create ONE "Website" inbox in Chatwoot
2. Install widget in your Shell app
3. Pass tenant info as custom attributes
4. Filter conversations by custom attributes

### Implementation

**Step 1: Create Website Inbox**
```
Chatwoot → Settings → Inboxes → Add Inbox
→ Choose "Website"
→ Name: "AXIS-AFENDA Widget"
→ Website URL: https://your-domain.com
```

**Step 2: Add Widget to Shell**

Create `app/components/chatwoot-widget.tsx`:

```typescript
'use client';

import { useEffect } from 'react';
import { useTenant } from '@/app/providers/tenant-provider';

export function ChatwootWidget() {
  const { tenant } = useTenant();

  useEffect(() => {
    if (!tenant) return;

    // Configure with tenant info
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: 'right',
      locale: 'en',
      // ✅ Pass tenant as custom attribute
      customAttributes: {
        tenant_id: tenant.id,
        tenant_name: tenant.name,
        tenant_type: tenant.type,
      },
    };

    // Load Chatwoot SDK
    const script = document.createElement('script');
    script.src = 'https://app.chatwoot.com/packs/js/sdk.js';
    script.defer = true;
    script.async = true;

    script.onload = () => {
      window.chatwootSDK?.run({
        websiteToken: process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN!,
        baseUrl: 'https://app.chatwoot.com',
      });
    };

    document.body.appendChild(script);

    return () => {
      script.parentNode?.removeChild(script);
    };
  }, [tenant]);

  return null;
}
```

**Step 3: Add to Layout**

```typescript
// app/app/layout.tsx
import { ChatwootWidget } from '@/app/components/chatwoot-widget';

export default function AppLayout({ children }) {
  return (
    <>
      {children}
      <ChatwootWidget />
    </>
  );
}
```

**Step 4: Filter by Custom Attributes**

```typescript
// In webhook handler
const tenantId = payload.conversation?.custom_attributes?.tenant_id;
```

**Pros**:
- ✅ One inbox for all tenants
- ✅ Easy to set up
- ✅ No per-tenant configuration

**Cons**:
- ⚠️ Need to filter by custom attributes
- ⚠️ Less isolation

---

## Option 2: **Email Inboxes** (Production Ready)

### Separate Email per Tenant

**How it works**:
1. Create email inbox per tenant
2. Use email forwarding or catch-all
3. Natural separation by email address

### Setup

**Step 1: Configure Email Domain**

Option A: **Forwarding**
```
support-tenant1@yourdomain.com → Forward to Chatwoot
support-tenant2@yourdomain.com → Forward to Chatwoot
support-tenant3@yourdomain.com → Forward to Chatwoot
```

Option B: **Catch-all + Routing**
```
*@support.yourdomain.com → Chatwoot
Then route by subdomain or prefix
```

**Step 2: Create Email Inboxes**

```
Chatwoot → Settings → Inboxes → Add Inbox
→ Choose "Email"
→ Email: support-tenant1@yourdomain.com
→ SMTP/IMAP settings
→ Repeat for each tenant
```

**Step 3: Map to Tenants**

```typescript
const inboxMappings = [
  {
    tenantId: 'tenant-1',
    tenantName: 'Acme Corp',
    inboxId: 123,
    email: 'support-acme@yourdomain.com'
  },
  {
    tenantId: 'tenant-2',
    tenantName: 'TechStart',
    inboxId: 456,
    email: 'support-techstart@yourdomain.com'
  },
];
```

**Pros**:
- ✅ Complete isolation
- ✅ Professional (branded emails)
- ✅ Works with existing email workflows

**Cons**:
- ⚠️ Need email infrastructure
- ⚠️ One inbox per tenant

---

## Option 3: **API Inbox** (Programmatic)

### Single API Inbox + Custom Routing

**How it works**:
1. Create ONE "API" inbox
2. Create conversations programmatically
3. Add tenant info to custom attributes
4. Route based on attributes

### Implementation

**Step 1: Create API Inbox**
```
Chatwoot → Settings → Inboxes → Add Inbox
→ Choose "API"
→ Name: "AXIS-AFENDA API"
```

**Step 2: Create Conversations via API**

```typescript
// When customer initiates contact
const conversation = await chatwoot.createConversation({
  inbox_id: apiInboxId,
  contact: {
    name: customer.name,
    email: customer.email,
  },
  custom_attributes: {
    tenant_id: tenant.id,
    tenant_name: tenant.name,
    source: 'shell_app',
  },
});
```

**Pros**:
- ✅ Full programmatic control
- ✅ One inbox, unlimited tenants
- ✅ Flexible routing

**Cons**:
- ⚠️ More complex
- ⚠️ Need to build UI for customers

---

## Option 4: **Twilio/SMS** (For SMS/WhatsApp)

### Separate Phone Number per Tenant

**Cost Warning**: Each tenant needs their own Twilio number (~$1/month + usage)

**How it works**:
1. Buy Twilio number per tenant
2. Create Twilio inbox in Chatwoot
3. Connect number to inbox

### Setup

**Step 1: Buy Twilio Numbers**
```
Twilio Console → Phone Numbers → Buy Numbers
→ +1-555-0001 → Tenant 1
→ +1-555-0002 → Tenant 2
→ +1-555-0003 → Tenant 3
```

**Step 2: Create Twilio Inboxes**
```
Chatwoot → Settings → Inboxes → Add Inbox
→ Choose "Twilio"
→ Phone Number: +1-555-0001
→ Account SID, Auth Token
→ Repeat for each number
```

**Monthly Cost**:
```
10 tenants × $1/number = $10/month
+ SMS usage
```

**Pros**:
- ✅ SMS/WhatsApp support
- ✅ Complete isolation
- ✅ Professional (dedicated numbers)

**Cons**:
- ❌ Expensive at scale
- ❌ One inbox per tenant required
- ❌ Need Twilio account

---

## 🎯 **Recommendation for AXIS-AFENDA**

### Phase 1: MVP (Website Widget)
```
✅ Create ONE "Website" inbox
✅ Add widget to Shell app
✅ Pass tenant_id as custom attribute
✅ Filter by custom attributes
```

**Cost**: $0 (included in Chatwoot plan)  
**Time**: 15 minutes  
**Scalability**: Unlimited tenants

### Phase 2: Production (Email)
```
✅ Add email inboxes per tenant
✅ Use branded email addresses
✅ Map inbox IDs to tenants
```

**Cost**: Email hosting only  
**Time**: 5 minutes per tenant  
**Scalability**: Limited by Chatwoot plan

### Phase 3: Enterprise (Twilio)
```
✅ Add Twilio for SMS/WhatsApp
✅ Only for tenants who need it
✅ Pass cost to customer
```

**Cost**: $1/month per tenant + usage  
**Time**: 10 minutes per tenant  
**Scalability**: Pay-as-you-grow

---

## 📊 Comparison Table

| Channel            | Inboxes Needed | Cost          | Setup Time    | Best For     |
| ------------------ | -------------- | ------------- | ------------- | ------------ |
| **Website Widget** | 1              | $0            | 15 min        | MVP, Testing |
| **Email**          | 1 per tenant   | Email hosting | 5 min/tenant  | Production   |
| **API**            | 1              | $0            | 30 min        | Custom flows |
| **Twilio SMS**     | 1 per tenant   | $1/mo + usage | 10 min/tenant | Enterprise   |
| **WhatsApp**       | 1 per tenant   | Varies        | 20 min/tenant | Enterprise   |

---

## 🚀 Quick Start: Website Widget Approach

Let me create the widget component for you:

### 1. Add Environment Variable

```bash
# .env
NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN=your_website_token_here
```

### 2. Create Widget Component

File: `app/components/chatwoot-widget.tsx`

```typescript
'use client';

import { useEffect } from 'react';
import { useTenant } from '@/app/providers/tenant-provider';

declare global {
  interface Window {
    chatwootSettings?: any;
    chatwootSDK?: any;
  }
}

export function ChatwootWidget() {
  const { tenant } = useTenant();

  useEffect(() => {
    if (!tenant || typeof window === 'undefined') return;

    // Configure Chatwoot
    window.chatwootSettings = {
      hideMessageBubble: false,
      position: 'right',
      locale: 'en',
      type: 'expanded_bubble',
      customAttributes: {
        tenant_id: tenant.id,
        tenant_name: tenant.name,
        tenant_type: tenant.type,
      },
    };

    // Load SDK
    const script = document.createElement('script');
    script.src = 'https://app.chatwoot.com/packs/js/sdk.js';
    script.defer = true;
    script.async = true;

    script.onload = () => {
      if (window.chatwootSDK) {
        window.chatwootSDK.run({
          websiteToken: process.env.NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN!,
          baseUrl: 'https://app.chatwoot.com',
        });
      }
    };

    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [tenant]);

  return null;
}
```

### 3. Add to Layout

```typescript
// app/app/layout.tsx
import { ChatwootWidget } from '@/app/components/chatwoot-widget';

export default function AppLayout({ children }) {
  // ... existing code ...
  
  return (
    <>
      {/* existing layout */}
      <ChatwootWidget />
    </>
  );
}
```

### 4. Update Webhook Handler

```typescript
// apps/orchestrator/src/routes/webhooks.ts
async function getTenantIdFromInbox(inboxId: number | undefined): Promise<string> {
  // ... existing code ...
  
  // Also check custom attributes
  const customAttrs = payload.conversation?.custom_attributes;
  if (customAttrs?.tenant_id) {
    return customAttrs.tenant_id;
  }
  
  // Fall back to inbox mapping
  // ... rest of code
}
```

---

## ✅ Summary

**You asked**: "Do I need to create inboxes one by one?"

**Answer**: 
- **Website Widget**: NO - One inbox for all tenants (use custom attributes)
- **Email**: YES - One inbox per tenant (but natural separation)
- **Twilio**: YES - One inbox per tenant (expensive at scale)

**Recommendation**: Start with Website Widget (1 inbox, 0 cost, 15 minutes)

---

*Last updated: 2026-01-28*
