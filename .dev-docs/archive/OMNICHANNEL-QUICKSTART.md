# Omnichannel Quick Start — Get ALL Channels in ONE Inbox Today

> **Goal**: Get your WhatsApp, LINE, WeChat, TikTok, Facebook, Instagram, and 5 company emails into ONE unified AXIS-AFENDA inbox.

---

## ⚡ 30-Minute Setup

### Step 1: Sign Up for Chatwoot Cloud (5 min)

```bash
1. Go to: https://app.chatwoot.com/app/auth/signup
2. Sign up (free trial available)
3. Create your account
4. Note your account URL: https://app.chatwoot.com/app/accounts/YOUR_ACCOUNT_ID
```

---

### Step 2: Add Your First 3 Channels (15 min)

#### Channel 1: Company Email (easiest)

```bash
# In Chatwoot Dashboard
1. Click Settings (gear icon) → Inboxes
2. Click "Add Inbox"
3. Select "Email"
4. Fill in:
   - Name: "Support Email"
   - Email: support@yourcompany.com
   - IMAP Server: mail.yourcompany.com
   - IMAP Port: 993
   - IMAP Login: support@yourcompany.com
   - IMAP Password: [your email password]
   - SMTP Server: mail.yourcompany.com
   - SMTP Port: 587
   - SMTP Login: support@yourcompany.com
   - SMTP Password: [your email password]
5. Click "Create Email Channel"
6. Note the Inbox ID from URL: .../inboxes/123 ← this number
```

#### Channel 2: WhatsApp Business (via Twilio)

```bash
# Get Twilio Account (if you don't have)
1. Go to: https://www.twilio.com/try-twilio
2. Sign up and verify phone
3. Get WhatsApp Sandbox number OR buy a number

# In Chatwoot
1. Settings → Inboxes → Add Inbox
2. Select "WhatsApp"
3. Choose "Twilio"
4. Fill in:
   - Name: "WhatsApp Business"
   - Phone Number: +1234567890
   - Account SID: [from Twilio console]
   - Auth Token: [from Twilio console]
5. Click "Create WhatsApp Channel"
6. Note the Inbox ID
```

#### Channel 3: Facebook Messenger

```bash
# In Chatwoot
1. Settings → Inboxes → Add Inbox
2. Select "Facebook"
3. Click "Connect Facebook"
4. Log in to Facebook
5. Authorize Chatwoot app
6. Select your Facebook Page
7. Click "Create Facebook Channel"
8. Note the Inbox ID
```

---

### Step 3: Connect to AXIS-AFENDA (10 min)

#### Update Orchestrator Webhook

```bash
# In Chatwoot: Settings → Webhooks
1. Click "Add Webhook"
2. Webhook URL: https://YOUR_NGROK_URL/api/v1/webhooks/chatwoot
   (Use your ngrok URL from earlier setup)
3. Subscribe to events:
   - ✅ Conversation Created
   - ✅ Conversation Status Changed
   - ✅ Message created
   - ✅ Message updated
4. Click "Create Webhook"
```

#### Map Inboxes to Your Tenant

```bash
# In your terminal
cd c:\AI-BOS\NEXIS-AFENDA\apps\orchestrator

# Edit setup-inboxes.ts
const inboxMappings = [
  {
    tenantId: 'mock-tenant-id',
    tenantName: 'Your Company',
    inboxId: 123, // Your email inbox ID
  },
  {
    tenantId: 'mock-tenant-id',
    tenantName: 'Your Company',
    inboxId: 124, // Your WhatsApp inbox ID
  },
  {
    tenantId: 'mock-tenant-id',
    tenantName: 'Your Company',
    inboxId: 125, // Your Facebook inbox ID
  },
];

# Run setup
npm run setup:inboxes
```

---

### Step 4: Test Your Unified Inbox (5 min)

```bash
# Send test messages
1. Email: Send an email to support@yourcompany.com
2. WhatsApp: Message your Twilio WhatsApp number
3. Facebook: Message your Facebook page

# Check AXIS-AFENDA
1. Open: http://localhost:3000/app/inbox
2. You should see ALL 3 messages in one list!
3. Each with a channel badge (email, whatsapp, facebook)
4. Click any conversation to view and reply
```

---

## 🚀 Add More Channels (Next 30 min)

### Instagram DMs

```bash
# In Chatwoot
1. Settings → Inboxes → Add Inbox
2. Select "Instagram"
3. Connect Facebook Business Account
4. Select Instagram Business Profile
5. Authorize permissions
6. Note Inbox ID

# Add to AXIS-AFENDA
npm run setup:inboxes
# Add new mapping with Instagram inbox ID
```

### More Company Emails

```bash
# Repeat for each email
1. Chatwoot: Settings → Inboxes → Add Inbox → Email
2. Add: sales@yourcompany.com (Inbox ID: 126)
3. Add: billing@yourcompany.com (Inbox ID: 127)
4. Add: tech@yourcompany.com (Inbox ID: 128)
5. Add: hr@yourcompany.com (Inbox ID: 129)

# Update setup-inboxes.ts with all 5 email inbox IDs
npm run setup:inboxes
```

### LINE Messaging

```bash
# Get LINE Channel
1. Go to: https://developers.line.biz/console/
2. Create a Provider
3. Create a Messaging API channel
4. Get Channel ID and Channel Secret
5. Set Webhook URL (from Chatwoot)

# In Chatwoot
1. Settings → Inboxes → Add Inbox
2. Select "LINE"
3. Paste Channel ID and Secret
4. Note Inbox ID

# Add to AXIS-AFENDA
npm run setup:inboxes
```

### WeChat (Advanced — via API)

```bash
# WeChat requires custom integration
# Coming soon in Phase 2
# For now, use Chatwoot API inbox as bridge
```

### TikTok DMs (Advanced — via API)

```bash
# TikTok requires custom integration
# Coming soon in Phase 2
# For now, use Chatwoot API inbox as bridge
```

---

## 📊 Your Unified Inbox

### What You'll See

```
┌─────────────────────────────────────────────────────────┐
│  AXIS-AFENDA Inbox                      [Filters] [⚙️]  │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  📧 [Email] John Doe                            2m ago   │
│     "Question about pricing..."                          │
│                                                          │
│  💬 [WhatsApp] Sarah Smith                      5m ago   │
│     "When will my order arrive?"                         │
│                                                          │
│  📘 [Facebook] Mike Johnson                    10m ago   │
│     "I need help with..."                                │
│                                                          │
│  📸 [Instagram] Emma Wilson                    15m ago   │
│     "Love your products! 💕"                             │
│                                                          │
│  💼 [LINE] Tanaka-san                          20m ago   │
│     "お問い合わせです"                                      │
│                                                          │
│  📧 [Email - Sales] Corporate Client           30m ago   │
│     "Enterprise pricing inquiry"                         │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Filter by Channel

```bash
# Use the enhanced filters
1. Click "Channel" dropdown
2. Select "WhatsApp" → See only WhatsApp messages
3. Select "Email" → See only email messages
4. Select "All" → See everything

# Combine filters
- Channel: WhatsApp + Priority: Urgent
- Channel: Email + Status: Open
- Channel: Instagram + Unread Only
```

---

## 🎯 Benefits You'll Experience

### Before (Chaos)
```
❌ 11 different apps/tabs open
❌ Constant context switching
❌ Missed messages
❌ Inconsistent responses
❌ No unified customer view
❌ Mental exhaustion
```

### After (Calm)
```
✅ ONE inbox for everything
✅ All messages in one place
✅ Unified customer profiles
✅ Consistent response quality
✅ Complete conversation history
✅ Peace of mind
```

---

## 📈 Scaling Strategy

### Week 1: Core Channels
- ✅ 1-2 company emails
- ✅ WhatsApp Business
- ✅ Facebook Messenger

### Week 2: Social Expansion
- ✅ Instagram DMs
- ✅ Remaining company emails
- ✅ Website chat widget

### Week 3: Messaging Apps
- ✅ LINE
- ✅ Telegram (if needed)
- ✅ WeChat (via bridge)

### Week 4: Advanced
- ✅ TikTok DMs (via bridge)
- ✅ SMS via Twilio
- ✅ Twitter/X DMs

---

## 🆘 Troubleshooting

### "Chatwoot inbox not receiving messages"

```bash
# Check IMAP/SMTP settings
1. Verify credentials are correct
2. Check firewall isn't blocking ports
3. Test email manually first

# For WhatsApp
1. Verify Twilio webhook is set
2. Check Twilio logs for errors
3. Ensure WhatsApp number is verified

# For Facebook/Instagram
1. Re-authorize if needed
2. Check page permissions
3. Verify business account is connected
```

### "Messages not appearing in AXIS-AFENDA"

```bash
# Check webhook
1. Verify ngrok is running
2. Check orchestrator logs
3. Verify webhook URL in Chatwoot is correct

# Check inbox mapping
1. Run: npm run db:check
2. Verify chatwoot_inbox_id is set
3. Re-run setup:inboxes if needed
```

### "Can't reply to messages"

```bash
# Check Chatwoot API token
1. Verify CHATWOOT_API_TOKEN in .env
2. Check token has correct permissions
3. Test API manually with curl
```

---

## 🎓 Pro Tips

### 1. **Unified Contact Profiles**
```bash
# When same person contacts via multiple channels
- Chatwoot automatically merges by email
- AXIS-AFENDA shows all channel history
- See complete customer journey
```

### 2. **Canned Responses**
```bash
# Create templates in Chatwoot
- Settings → Canned Responses
- Use shortcuts like /greeting
- Works across all channels
```

### 3. **Auto-Assignment**
```bash
# Route by channel
- WhatsApp → Sales team
- Email → Support team
- Instagram → Social media team
```

### 4. **SLA by Channel**
```bash
# Set expectations
- WhatsApp: 5 min response time
- Email: 2 hour response time
- Social media: 1 hour response time
```

---

## 📚 Next Steps

1. ✅ **Set up 3 channels today** (30 min)
2. ✅ **Test unified inbox** (5 min)
3. ✅ **Add more channels** (ongoing)
4. ✅ **Train your team** (1 hour)
5. ✅ **Monitor analytics** (daily)
6. ✅ **Optimize workflows** (weekly)

---

## 🎉 Welcome to Calm

> **"Too many tools. No center."** → **One inbox. All channels. Peace.**

You now have:
- ✅ ONE place to check for ALL messages
- ✅ ONE interface to respond across ALL channels
- ✅ ONE unified view of each customer
- ✅ ONE calm, organized workflow

**This is AXIS-AFENDA.**

---

*Questions? Check [OMNICHANNEL-STRATEGY.md](.dev-docs/OMNICHANNEL-STRATEGY.md) for detailed architecture.*

*Last updated: 2026-01-28*
