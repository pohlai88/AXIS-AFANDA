# AXIS-AFENDA — True Omnichannel Strategy

> **Philosophy**: "Too many tools. No center." — One inbox for ALL channels.

---

## 🎯 Vision

**Current Reality (Chaos)**:
- WhatsApp Business on phone
- LINE on another device
- WeChat on desktop
- TikTok DMs in app
- Facebook Messenger in browser
- Instagram DMs in another tab
- 5 company emails across 3 clients
- **Result**: Context switching hell, missed messages, mental exhaustion

**AXIS-AFENDA Reality (Calm)**:
- **ONE inbox** in AXIS-AFENDA Shell
- **ALL channels** unified with conversation threading
- **ONE interface** to respond across all platforms
- **Result**: "Work doesn't have to be chaotic"

---

## 🏗️ Architecture: Hub-and-Spoke Model

```
┌─────────────────────────────────────────────────────────────┐
│                    AXIS-AFENDA SHELL                         │
│                  (One Unified Inbox)                         │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
                            │ Webhooks + API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    ORCHESTRATOR                              │
│          (Conversation Normalization Layer)                  │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
        ▼                   ▼                   ▼
┌──────────────┐   ┌──────────────┐   ┌──────────────┐
│   CHATWOOT   │   │   CHATWOOT   │   │   CHATWOOT   │
│   (Hub 1)    │   │   (Hub 2)    │   │   (Hub 3)    │
└──────────────┘   └──────────────┘   └──────────────┘
        │                   │                   │
    ┌───┴───┐           ┌───┴───┐         ┌───┴───┐
    ▼       ▼           ▼       ▼         ▼       ▼
 WhatsApp  LINE      WeChat  TikTok    FB   Insta
  Email1  Email2     Email3  Email4   Email5
```

### Why Chatwoot as Hubs?

**Chatwoot is the omnichannel aggregator**:
- Supports 15+ channel types natively
- Handles message normalization
- Manages channel-specific APIs
- Provides webhook infrastructure
- Open-source and self-hostable

**AXIS-AFENDA adds**:
- Multi-tenant orchestration
- Approval workflows
- Audit trails
- Unified UX across all channels
- Escalation and consultation rooms

---

## 📱 Supported Channels via Chatwoot

### 1. **Messaging Apps**

| Channel               | Chatwoot Support | Setup Method                   |
| --------------------- | ---------------- | ------------------------------ |
| **WhatsApp Business** | ✅ Native         | Twilio / 360Dialog / Cloud API |
| **LINE**              | ✅ Native         | LINE Messaging API             |
| **WeChat**            | ⚠️ Via API        | Custom API integration         |
| **Telegram**          | ✅ Native         | Bot API                        |
| **Viber**             | ⚠️ Via API        | Custom integration             |

### 2. **Social Media**

| Channel                | Chatwoot Support | Setup Method             |
| ---------------------- | ---------------- | ------------------------ |
| **Facebook Messenger** | ✅ Native         | Facebook App integration |
| **Instagram DMs**      | ✅ Native         | Instagram Business API   |
| **TikTok DMs**         | ⚠️ Via API        | TikTok Business API      |
| **Twitter/X DMs**      | ✅ Native         | Twitter API              |
| **LinkedIn Messages**  | ⚠️ Via API        | LinkedIn API             |

### 3. **Email**

| Channel               | Chatwoot Support | Setup Method           |
| --------------------- | ---------------- | ---------------------- |
| **Company Email 1-5** | ✅ Native         | IMAP/SMTP per inbox    |
| **Support Email**     | ✅ Native         | Forward to Chatwoot    |
| **Department Emails** | ✅ Native         | Multiple email inboxes |

### 4. **Web & App**

| Channel             | Chatwoot Support | Setup Method     |
| ------------------- | ---------------- | ---------------- |
| **Website Chat**    | ✅ Native         | Chatwoot widget  |
| **Mobile App Chat** | ✅ Native         | SDK integration  |
| **API Channel**     | ✅ Native         | Custom API inbox |

### 5. **Business Tools**

| Channel                 | Chatwoot Support | Setup Method                      |
| ----------------------- | ---------------- | --------------------------------- |
| **SMS**                 | ✅ Native         | Twilio / Bandwidth                |
| **Voice (Transcribed)** | ⚠️ Via API        | Twilio → Transcription → Chatwoot |
| **Slack Connect**       | ⚠️ Via API        | Slack API                         |

---

## 🔧 Implementation Strategy

### Phase 1: Core Channels (MVP) — Week 1-2

**Goal**: Get 3-5 most critical channels into one inbox

#### Step 1: Identify Priority Channels
```bash
# Example priority list
1. Company Email (support@company.com)
2. WhatsApp Business
3. Facebook Messenger
4. Instagram DMs
5. Website Chat Widget
```

#### Step 2: Set Up Chatwoot Inboxes
```bash
# For each channel, create a Chatwoot inbox
Settings → Inboxes → Add Inbox → [Channel Type]

# Example: Email Inbox
- Name: "Support Email"
- Email: support@company.com
- IMAP: mail.company.com:993
- SMTP: mail.company.com:587

# Example: WhatsApp
- Name: "WhatsApp Business"
- Provider: Twilio / 360Dialog
- Phone Number: +1234567890
- API Credentials: [from provider]

# Example: Facebook Messenger
- Name: "Facebook Page"
- Connect: [Authorize Facebook App]
- Select Page: [Your Business Page]
```

#### Step 3: Configure Webhooks
```bash
# In Chatwoot: Settings → Webhooks
Webhook URL: https://your-orchestrator.com/api/v1/webhooks/chatwoot
Events: All conversation and message events
```

#### Step 4: Map to AXIS-AFENDA Tenant
```bash
# Run setup script
cd apps/orchestrator
npm run setup:inboxes

# Update with Chatwoot inbox IDs
{
  tenantId: 'your-tenant-id',
  chatwootInboxId: 123, // WhatsApp inbox
}
```

### Phase 2: Expand Channels — Week 3-4

**Goal**: Add remaining channels

#### Social Media Channels
```bash
# Instagram DMs
Settings → Inboxes → Instagram
- Connect Facebook Business Account
- Select Instagram Business Profile
- Authorize permissions

# TikTok (via API)
Settings → Inboxes → API
- Create API inbox
- Build TikTok webhook bridge
- Forward TikTok DMs to Chatwoot API
```

#### Additional Email Accounts
```bash
# For each company email
Settings → Inboxes → Email
- sales@company.com → Inbox ID: 456
- billing@company.com → Inbox ID: 789
- hr@company.com → Inbox ID: 101
- tech@company.com → Inbox ID: 102
```

#### Messaging Apps
```bash
# LINE
Settings → Inboxes → LINE
- LINE Channel ID
- LINE Channel Secret
- Webhook URL

# WeChat (via custom bridge)
- Build WeChat API bridge
- Forward to Chatwoot API inbox
- Map WeChat user IDs to contacts
```

### Phase 3: Advanced Features — Week 5-6

**Goal**: Channel-specific features and automation

#### Unified Contact Profiles
```typescript
// Merge contacts across channels
{
  contactId: "unified-123",
  channels: {
    whatsapp: "+1234567890",
    email: "customer@example.com",
    facebook: "fb-user-id-123",
    instagram: "insta-handle-123",
  },
  conversationHistory: [
    { channel: "whatsapp", date: "2026-01-20", summary: "..." },
    { channel: "email", date: "2026-01-22", summary: "..." },
    { channel: "instagram", date: "2026-01-25", summary: "..." },
  ]
}
```

#### Channel-Specific Templates
```typescript
// Canned responses per channel
{
  template: "greeting",
  channels: {
    whatsapp: "Hi! 👋 How can we help?",
    email: "Hello,\n\nThank you for contacting us...",
    instagram: "Hey! 💬 What's up?",
  }
}
```

#### Smart Routing
```typescript
// Route by channel priority
{
  vipCustomers: ["whatsapp", "email"], // Respond via these first
  generalInquiries: ["email", "website"],
  socialMedia: ["facebook", "instagram", "tiktok"],
}
```

---

## 💾 Database Schema Updates

### Enhanced Conversations Table

```typescript
// apps/orchestrator/src/db/schema.ts

export const conversations = pgTable('conversations', {
  // ... existing fields ...
  
  // NEW: Channel identification
  channelType: text('channel_type').notNull(), // 'whatsapp', 'email', 'facebook', etc.
  channelIdentifier: text('channel_identifier'), // phone number, email, user ID
  
  // NEW: Unified contact
  unifiedContactId: text('unified_contact_id'), // Links conversations from same person
  
  // NEW: Channel metadata
  channelMetadata: jsonb('channel_metadata').$type<{
    platform: string;
    accountHandle?: string;
    phoneNumber?: string;
    emailAddress?: string;
    socialProfile?: string;
  }>(),
});

export const unifiedContacts = pgTable('unified_contacts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  
  // Primary identity
  name: text('name'),
  primaryEmail: text('primary_email'),
  primaryPhone: text('primary_phone'),
  
  // Channel identities
  channelIdentities: jsonb('channel_identities').$type<{
    whatsapp?: string;
    line?: string;
    wechat?: string;
    facebook?: string;
    instagram?: string;
    tiktok?: string;
    email?: string[];
    twitter?: string;
  }>(),
  
  // Metadata
  tags: jsonb('tags').$type<string[]>(),
  customAttributes: jsonb('custom_attributes'),
  
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});
```

---

## 🎨 UI Enhancements for Omnichannel

### 1. **Channel Badges in Conversation List**

```tsx
// app/components/inbox/conversation-list-item.tsx

<div className="flex items-center gap-2">
  {/* Channel badge */}
  <Badge variant="outline" className="gap-1">
    {getChannelIcon(conversation.channelType)}
    {conversation.channelType}
  </Badge>
  
  {/* Contact name */}
  <span>{conversation.contactName}</span>
</div>

// Channel icons
const getChannelIcon = (channel: string) => {
  const icons = {
    whatsapp: <MessageCircle className="h-3 w-3 text-green-500" />,
    email: <Mail className="h-3 w-3 text-blue-500" />,
    facebook: <Facebook className="h-3 w-3 text-blue-600" />,
    instagram: <Instagram className="h-3 w-3 text-pink-500" />,
    tiktok: <Music className="h-3 w-3 text-black" />,
    line: <MessageSquare className="h-3 w-3 text-green-400" />,
    wechat: <MessageCircle className="h-3 w-3 text-green-600" />,
  };
  return icons[channel] || <MessageCircle className="h-3 w-3" />;
};
```

### 2. **Channel Filter in Inbox**

```tsx
// Add to inbox-filters.tsx

<div className="space-y-2">
  <Label className="text-xs">Channel</Label>
  <Select
    value={filters.channelType || 'all'}
    onValueChange={(value) =>
      onFiltersChange({
        ...filters,
        channelType: value === 'all' ? undefined : value,
      })
    }
  >
    <SelectTrigger className="h-9">
      <SelectValue placeholder="All channels" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="all">All channels</SelectItem>
      <SelectItem value="whatsapp">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-3.5 w-3.5 text-green-500" />
          WhatsApp
        </div>
      </SelectItem>
      <SelectItem value="email">
        <div className="flex items-center gap-2">
          <Mail className="h-3.5 w-3.5 text-blue-500" />
          Email
        </div>
      </SelectItem>
      <SelectItem value="facebook">
        <div className="flex items-center gap-2">
          <Facebook className="h-3.5 w-3.5 text-blue-600" />
          Facebook
        </div>
      </SelectItem>
      <SelectItem value="instagram">
        <div className="flex items-center gap-2">
          <Instagram className="h-3.5 w-3.5 text-pink-500" />
          Instagram
        </div>
      </SelectItem>
      {/* ... more channels */}
    </SelectContent>
  </Select>
</div>
```

### 3. **Unified Contact View**

```tsx
// app/components/inbox/unified-contact-sidebar.tsx

<div className="space-y-4">
  <h3 className="font-semibold">Contact Profile</h3>
  
  {/* Primary info */}
  <div>
    <p className="font-medium">{contact.name}</p>
    <p className="text-sm text-muted-foreground">{contact.primaryEmail}</p>
  </div>
  
  {/* All channels */}
  <div className="space-y-2">
    <Label className="text-xs">Connected Channels</Label>
    {contact.channelIdentities.whatsapp && (
      <div className="flex items-center gap-2 text-sm">
        <MessageCircle className="h-4 w-4 text-green-500" />
        <span>{contact.channelIdentities.whatsapp}</span>
      </div>
    )}
    {contact.channelIdentities.email?.map((email) => (
      <div key={email} className="flex items-center gap-2 text-sm">
        <Mail className="h-4 w-4 text-blue-500" />
        <span>{email}</span>
      </div>
    ))}
    {contact.channelIdentities.facebook && (
      <div className="flex items-center gap-2 text-sm">
        <Facebook className="h-4 w-4 text-blue-600" />
        <span>Facebook Messenger</span>
      </div>
    )}
    {/* ... more channels */}
  </div>
  
  {/* Conversation history across channels */}
  <div className="space-y-2">
    <Label className="text-xs">Recent Conversations</Label>
    {conversationHistory.map((conv) => (
      <div key={conv.id} className="flex items-center gap-2 text-sm">
        {getChannelIcon(conv.channelType)}
        <span className="text-muted-foreground">
          {format(new Date(conv.lastMessageAt), 'MMM d')}
        </span>
      </div>
    ))}
  </div>
</div>
```

### 4. **Channel-Aware Reply Box**

```tsx
// app/components/inbox/reply-box.tsx

<div className="space-y-2">
  {/* Channel indicator */}
  <div className="flex items-center gap-2 text-sm text-muted-foreground">
    {getChannelIcon(conversation.channelType)}
    <span>Replying via {conversation.channelType}</span>
  </div>
  
  {/* Channel-specific features */}
  {conversation.channelType === 'whatsapp' && (
    <div className="flex gap-2">
      <Button size="sm" variant="outline">
        <Image className="h-4 w-4" />
      </Button>
      <Button size="sm" variant="outline">
        <FileText className="h-4 w-4" />
      </Button>
    </div>
  )}
  
  {/* Reply textarea */}
  <Textarea
    placeholder={getPlaceholder(conversation.channelType)}
    value={message}
    onChange={(e) => setMessage(e.target.value)}
  />
</div>
```

---

## 📊 Omnichannel Analytics

### Dashboard Metrics

```tsx
// app/app/analytics/page.tsx

<div className="grid gap-4 md:grid-cols-4">
  {/* Total conversations by channel */}
  <Card>
    <CardHeader>
      <CardTitle>Conversations by Channel</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <MessageCircle className="h-4 w-4 text-green-500" />
            WhatsApp
          </span>
          <span className="font-semibold">245</span>
        </div>
        <div className="flex justify-between">
          <span className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-500" />
            Email
          </span>
          <span className="font-semibold">189</span>
        </div>
        {/* ... more channels */}
      </div>
    </CardContent>
  </Card>
  
  {/* Response time by channel */}
  <Card>
    <CardHeader>
      <CardTitle>Avg Response Time</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span>WhatsApp</span>
          <span className="text-green-600">2.3 min</span>
        </div>
        <div className="flex justify-between">
          <span>Email</span>
          <span className="text-blue-600">1.2 hrs</span>
        </div>
        {/* ... more channels */}
      </div>
    </CardContent>
  </Card>
</div>
```

---

## 🚀 Setup Guide: Your 5 Company Emails + Social

### Step-by-Step for Your Use Case

#### 1. **Set Up Chatwoot Instance**
```bash
# Option A: Chatwoot Cloud (easiest)
- Sign up at https://app.chatwoot.com
- Choose plan (Pro recommended for multiple inboxes)

# Option B: Self-hosted (full control)
- Deploy Chatwoot on Railway/Render
- Follow: https://www.chatwoot.com/docs/self-hosted
```

#### 2. **Add Your 5 Company Emails**
```bash
# In Chatwoot: Settings → Inboxes → Add Inbox → Email

# Email 1: support@company.com
Name: "Support Email"
Email: support@company.com
IMAP: mail.company.com:993 (SSL)
SMTP: mail.company.com:587 (TLS)
Username: support@company.com
Password: [email password]

# Email 2: sales@company.com
# Email 3: billing@company.com
# Email 4: tech@company.com
# Email 5: hr@company.com
# ... repeat for each
```

#### 3. **Add WhatsApp Business**
```bash
# Option A: Twilio (easiest)
Settings → Inboxes → WhatsApp
- Provider: Twilio
- Account SID: [from Twilio]
- Auth Token: [from Twilio]
- Phone Number: +1234567890

# Option B: 360Dialog (cheaper for high volume)
# Option C: Cloud API (direct from Meta)
```

#### 4. **Add Facebook Messenger**
```bash
Settings → Inboxes → Facebook
- Click "Connect Facebook"
- Authorize Chatwoot app
- Select your Facebook Page
- Confirm permissions
```

#### 5. **Add Instagram DMs**
```bash
Settings → Inboxes → Instagram
- Connect Facebook Business Account
- Select Instagram Business Profile
- Authorize permissions
```

#### 6. **Add LINE**
```bash
Settings → Inboxes → LINE
- Create LINE Channel at https://developers.line.biz
- Get Channel ID and Channel Secret
- Add webhook URL: [Chatwoot webhook]
- Paste credentials in Chatwoot
```

#### 7. **Add WeChat (via API bridge)**
```bash
# WeChat requires custom integration
Settings → Inboxes → API
- Create API inbox
- Build WeChat webhook bridge (Node.js)
- Forward WeChat messages to Chatwoot API
```

#### 8. **Add TikTok (via API bridge)**
```bash
# Similar to WeChat
Settings → Inboxes → API
- Create API inbox
- Build TikTok webhook bridge
- Forward TikTok DMs to Chatwoot API
```

#### 9. **Map All Inboxes to AXIS-AFENDA**
```bash
cd apps/orchestrator
npm run setup:inboxes

# Update with all inbox IDs
const inboxMappings = [
  { tenantId: 'your-id', inboxId: 123 }, // support@company.com
  { tenantId: 'your-id', inboxId: 124 }, // sales@company.com
  { tenantId: 'your-id', inboxId: 125 }, // billing@company.com
  { tenantId: 'your-id', inboxId: 126 }, // tech@company.com
  { tenantId: 'your-id', inboxId: 127 }, // hr@company.com
  { tenantId: 'your-id', inboxId: 128 }, // WhatsApp
  { tenantId: 'your-id', inboxId: 129 }, // Facebook
  { tenantId: 'your-id', inboxId: 130 }, // Instagram
  { tenantId: 'your-id', inboxId: 131 }, // LINE
  { tenantId: 'your-id', inboxId: 132 }, // WeChat
  { tenantId: 'your-id', inboxId: 133 }, // TikTok
];
```

#### 10. **Test the Unified Inbox**
```bash
# Send test messages from each channel
1. Email: Send to support@company.com
2. WhatsApp: Message your business number
3. Facebook: Message your page
4. Instagram: DM your business account
5. LINE: Message your LINE account
6. WeChat: Message your WeChat account
7. TikTok: DM your TikTok account

# Check AXIS-AFENDA inbox
Open: http://localhost:3000/app/inbox
- All messages should appear in one unified list
- Each with channel badge
- Filter by channel type
- Respond from one interface
```

---

## 🎯 Result: One Calm Inbox

### Before AXIS-AFENDA
```
8:00 AM - Check WhatsApp (5 messages)
8:10 AM - Check LINE (3 messages)
8:20 AM - Check WeChat (2 messages)
8:30 AM - Check TikTok (4 messages)
8:40 AM - Check Facebook (7 messages)
8:50 AM - Check Instagram (6 messages)
9:00 AM - Check Email 1 (12 messages)
9:10 AM - Check Email 2 (8 messages)
9:20 AM - Check Email 3 (5 messages)
9:30 AM - Check Email 4 (3 messages)
9:40 AM - Check Email 5 (2 messages)

Total: 57 messages across 11 platforms
Time: 1 hour 40 minutes
Mental state: Exhausted
```

### After AXIS-AFENDA
```
8:00 AM - Open AXIS-AFENDA inbox
8:01 AM - See all 57 messages in one list
8:02 AM - Filter by priority
8:03 AM - Respond to urgent messages
8:15 AM - Process remaining messages
8:30 AM - Done

Total: 57 messages in one platform
Time: 30 minutes
Mental state: Calm, focused
```

---

## 📚 Next Steps

1. **Read this document** — Understand the architecture
2. **Choose your channels** — Prioritize 3-5 most critical
3. **Set up Chatwoot** — Cloud or self-hosted
4. **Add inboxes** — One by one, test each
5. **Map to AXIS-AFENDA** — Run setup script
6. **Test unified inbox** — Send test messages
7. **Train your team** — One interface for everything
8. **Scale gradually** — Add more channels over time

---

## 🎉 Philosophy Realized

> **"Too many tools. No center."** → **One inbox. All channels. Calm.**

This is the AXIS-AFENDA promise:
- **Direction**: One place to look
- **Structure**: All channels organized
- **Peace**: No more context switching

---

*Last updated: 2026-01-28*
*Status: ✅ Architecture defined, ready for implementation*
