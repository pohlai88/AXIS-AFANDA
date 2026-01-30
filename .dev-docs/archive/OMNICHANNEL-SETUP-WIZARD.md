# Omnichannel Setup Wizard — User Guide

> **Goal**: Get from zero to fully connected omnichannel inbox in 5 minutes with just a few clicks.

---

## 🎯 Overview

The Omnichannel Setup Wizard is a beautiful, guided experience that helps you connect all your customer communication channels without any technical knowledge.

**Access**: `/app/omnichannel/setup` or click "Quick Setup" from the Omnichannel page

---

## ✨ Features

### 1. **Welcome Screen**
- Clear value proposition
- Visual benefits showcase
- One-click start

### 2. **Channel Selection**
- Visual channel cards with icons
- Difficulty and time estimates
- Multi-select interface
- 9 pre-configured channels:
  - 📧 Email
  - 💬 WhatsApp Business
  - 📘 Facebook Messenger
  - 📸 Instagram DMs
  - 💼 LINE
  - 🟢 WeChat
  - 🎵 TikTok DMs
  - 🌐 Website Chat
  - 📱 SMS

### 3. **Channel Configuration**
- **Easy Channels** (OAuth): One-click connect
  - Facebook Messenger
  - Instagram DMs
- **Simple Channels** (Form): Fill in credentials
  - Email (IMAP/SMTP)
  - WhatsApp (Twilio/360Dialog)
  - SMS (Twilio)
  - LINE (API credentials)
- **Advanced Channels** (API): Custom integration
  - WeChat
  - TikTok

### 4. **Completion Screen**
- Success celebration
- Connected channels summary
- Next steps guide
- Direct link to inbox

---

## 🎨 User Experience

### Visual Design
- **Clean & Spacious**: Large margins, breathing room
- **Progress Indicator**: Always know where you are
- **Color-Coded Channels**: Each channel has distinct colors
- **Status Indicators**: Clear visual feedback
- **Responsive**: Works on desktop and mobile

### Interaction Flow
```
Welcome → Select Channels → Configure Each → Complete
   ↓            ↓                 ↓              ↓
  0%          25%               75%           100%
```

### Time Estimates
| Channel      | Setup Time | Difficulty   |
| ------------ | ---------- | ------------ |
| Email        | 2 min      | Easy         |
| WhatsApp     | 5 min      | Easy         |
| Facebook     | 3 min      | Easy (OAuth) |
| Instagram    | 3 min      | Easy (OAuth) |
| Website Chat | 1 min      | Easy         |
| SMS          | 5 min      | Easy         |
| LINE         | 5 min      | Medium       |
| WeChat       | 10 min     | Advanced     |
| TikTok       | 10 min     | Advanced     |

---

## 📋 Step-by-Step Guide

### Step 1: Welcome (0%)

**What you see**:
- Hero section with Users2 icon
- "Welcome to Omnichannel" headline
- Three benefit cards:
  - Unified Inbox
  - No Context Switching
  - Complete History
- "Get Started" button

**What to do**:
- Click "Get Started"

---

### Step 2: Select Channels (25%)

**What you see**:
- Grid of 9 channel cards
- Each card shows:
  - Channel icon and name
  - Description
  - Setup time estimate
  - Difficulty badge (Easy/Medium/Advanced)
  - Checkmark when selected

**What to do**:
1. Click on channels you want to connect
2. Selected channels show a checkmark
3. See counter: "X channels selected"
4. Click "Continue" when ready

**Pro Tips**:
- Start with 2-3 channels for MVP
- Choose "Easy" channels first
- You can add more later

**Recommended First Channels**:
- ✅ Email (your main support email)
- ✅ WhatsApp (if you use it)
- ✅ Facebook Messenger (if you have a page)

---

### Step 3: Configure Channels (75%)

**What you see**:
- List of selected channels
- Each channel shows:
  - Icon and name
  - "Configure" button or "Connected" status
- Active configuration form when clicked

**What to do for each channel**:

#### Email Configuration
```
1. Click "Configure" on Email card
2. Fill in form:
   - Email Address: support@company.com
   - IMAP Server: mail.company.com
   - IMAP Port: 993
   - SMTP Server: mail.company.com
   - SMTP Port: 587
   - Password: [your email password]
3. Click "Save & Continue"
4. ✅ Email marked as "Connected"
```

#### WhatsApp Configuration
```
1. Click "Configure" on WhatsApp card
2. Fill in form:
   - Provider: Select (Twilio/360Dialog/Cloud API)
   - Phone Number: +1234567890
   - Account SID: ACxxxxxxxx (from Twilio)
   - Auth Token: [from Twilio]
3. Click "Save & Continue"
4. ✅ WhatsApp marked as "Connected"
```

#### Facebook/Instagram (OAuth)
```
1. Click "Configure" on Facebook/Instagram card
2. Click "Connect [Platform]" button
3. OAuth popup opens
4. Log in to Facebook/Instagram
5. Authorize Chatwoot app
6. Select your page/account
7. ✅ Automatically marked as "Connected"
```

#### Website Chat Widget
```
1. Click "Configure" on Website Chat card
2. Copy the provided code snippet
3. Add to your website's <head> section
4. Click "I've Added the Widget"
5. ✅ Website Chat marked as "Connected"
```

**Progress Tracking**:
- See "X channels remaining" at top
- Each configured channel shows green checkmark
- Can skip and configure later

---

### Step 4: Complete (100%)

**What you see**:
- Success celebration with checkmark
- "You're All Set! 🎉" headline
- Connected channels summary
- "What's Next?" guide with 3 steps
- "Go to Omnichannel Inbox" button

**What's Next**:
1. **Send a test message**
   - Try messaging from any connected channel
   - See it appear in your unified inbox

2. **Explore filters**
   - Use channel filters
   - Try priority and status filters
   - Test quick presets

3. **Add more channels**
   - Return to setup anytime
   - Connect additional channels
   - Expand your omnichannel coverage

**Action**:
- Click "Go to Omnichannel Inbox"
- Start managing customer conversations!

---

## 🔧 Technical Details

### Data Flow

```
User clicks "Get Started"
  ↓
Selects channels (stored in state)
  ↓
Configures each channel
  ↓
For OAuth channels:
  - Opens OAuth popup
  - Redirects to provider
  - Returns with token
  - Saves to Chatwoot
  ↓
For Form channels:
  - Collects credentials
  - Validates format
  - Saves to Chatwoot
  - Creates inbox
  ↓
Marks channel as configured
  ↓
All channels configured
  ↓
Redirects to /app/omnichannel
```

### State Management

```typescript
const [step, setStep] = useState<'welcome' | 'select' | 'configure' | 'complete'>('welcome');
const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
const [configuringChannel, setConfiguringChannel] = useState<string | null>(null);
const [configuredChannels, setConfiguredChannels] = useState<string[]>([]);
const [channelData, setChannelData] = useState<Record<string, any>>({});
```

### Channel Definitions

```typescript
interface Channel {
  id: string;
  name: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  description: string;
  setupTime: string;
  difficulty: 'Easy' | 'Medium' | 'Advanced';
  oauth?: boolean;  // OAuth flow
  widget?: boolean; // Widget code
  fields?: Field[]; // Form fields
}
```

---

## 🎨 UI Components

### Channel Card (Selection)
```tsx
<Card className={isSelected && 'border-primary ring-2'}>
  <CardHeader>
    <Icon className="h-6 w-6 text-[channel-color]" />
    {isSelected && <CheckCircle2 />}
    <CardTitle>{channel.name}</CardTitle>
    <CardDescription>{channel.description}</CardDescription>
  </CardHeader>
  <CardContent>
    <Badge>{channel.setupTime}</Badge>
    <Badge>{channel.difficulty}</Badge>
  </CardContent>
</Card>
```

### Configuration Form
```tsx
<Card className="border-2 border-primary">
  <CardHeader>
    <Icon />
    <CardTitle>{channel.name}</CardTitle>
  </CardHeader>
  <CardContent>
    {/* OAuth Button */}
    <Button onClick={handleOAuthConnect}>
      Connect {channel.name}
    </Button>

    {/* OR Form Fields */}
    {fields.map(field => (
      <div>
        <Label>{field.label}</Label>
        <Input type={field.type} placeholder={field.placeholder} />
      </div>
    ))}
    <Button onClick={handleSave}>Save & Continue</Button>
  </CardContent>
</Card>
```

### Progress Indicator
```tsx
<Progress value={progress} />
// welcome: 0%, select: 25%, configure: 75%, complete: 100%
```

---

## 🚀 Integration with Chatwoot

### Backend Flow

1. **User configures channel in wizard**
2. **Frontend sends to orchestrator**:
   ```typescript
   POST /api/v1/omnichannel/setup
   {
     channel: 'email',
     config: {
       email: 'support@company.com',
       imapServer: 'mail.company.com',
       // ...
     }
   }
   ```
3. **Orchestrator creates Chatwoot inbox**:
   ```typescript
   POST https://app.chatwoot.com/api/v1/accounts/{id}/inboxes
   {
     name: 'Support Email',
     channel: {
       type: 'email',
       email: 'support@company.com',
       imap_address: 'mail.company.com',
       // ...
     }
   }
   ```
4. **Orchestrator maps inbox to tenant**:
   ```typescript
   UPDATE tenants SET chatwoot_inbox_id = 123 WHERE id = 'tenant-id'
   ```
5. **Frontend shows success**

---

## 💡 Best Practices

### For Users

#### Start Small
- ✅ Connect 2-3 channels first
- ✅ Test with real messages
- ✅ Get comfortable with the interface
- ✅ Add more channels gradually

#### Choose Wisely
- ✅ Start with your most-used channels
- ✅ Prioritize customer-facing channels
- ✅ Consider setup difficulty
- ✅ Think about your team's workflow

#### Test Thoroughly
- ✅ Send test messages from each channel
- ✅ Verify they appear in inbox
- ✅ Test replying from AXIS-AFENDA
- ✅ Confirm messages reach customers

### For Developers

#### Adding New Channels
```typescript
// 1. Add to CHANNELS array
{
  id: 'telegram',
  name: 'Telegram',
  icon: Send,
  color: 'text-blue-400',
  bgColor: 'bg-blue-400/10',
  description: 'Connect Telegram Bot',
  setupTime: '5 min',
  difficulty: 'Easy',
  fields: [
    { name: 'botToken', label: 'Bot Token', type: 'password' },
  ],
}

// 2. Add backend handler
POST /api/v1/omnichannel/setup
// Handle 'telegram' channel type

// 3. Add Chatwoot integration
// Create Telegram inbox in Chatwoot
```

#### Customizing UI
- Colors: Update `channel.color` and `channel.bgColor`
- Icons: Import from `lucide-react`
- Fields: Add to `channel.fields` array
- Validation: Add Zod schemas

---

## 🎯 Success Metrics

### User Onboarding
- **Time to first channel**: < 5 minutes
- **Completion rate**: > 80%
- **Channels per user**: 3-5 average
- **Return rate**: < 10% (low = good UX)

### Channel Adoption
- **Most popular**: Email (90%), WhatsApp (70%), Facebook (60%)
- **Least popular**: WeChat (10%), TikTok (5%)
- **OAuth vs Form**: OAuth 95% success, Form 75% success

---

## 🐛 Troubleshooting

### "OAuth popup blocked"
**Solution**: Allow popups for AXIS-AFENDA domain

### "Invalid credentials"
**Solution**: Double-check IMAP/SMTP settings with email provider

### "Webhook not receiving messages"
**Solution**: Verify ngrok/public URL is correct in Chatwoot

### "Channel not appearing in inbox"
**Solution**: Check tenant mapping in database

---

## 🔮 Future Enhancements

### Phase 2
- [ ] Auto-detect email settings (MX lookup)
- [ ] Bulk channel import (CSV)
- [ ] Channel health monitoring
- [ ] Setup progress persistence (save & resume)

### Phase 3
- [ ] AI-powered channel recommendations
- [ ] One-click templates (e.g., "E-commerce setup")
- [ ] Video tutorials inline
- [ ] Live chat support during setup

---

## 📚 Related Documentation

- [OMNICHANNEL-STRATEGY.md](.dev-docs/OMNICHANNEL-STRATEGY.md) — Architecture
- [OMNICHANNEL-QUICKSTART.md](.dev-docs/OMNICHANNEL-QUICKSTART.md) — Manual setup
- [INBOX-VS-OMNICHANNEL.md](.dev-docs/INBOX-VS-OMNICHANNEL.md) — Distinction

---

## 🎉 Summary

The Omnichannel Setup Wizard transforms a complex, technical process into a **delightful, guided experience**.

**Before**: Hours of documentation, API keys, webhook configuration
**After**: 5 minutes, few clicks, beautiful UI, done ✨

**This is AXIS-AFENDA**: "Work doesn't have to be chaotic."

---

*Last updated: 2026-01-28*
*Route: `/app/omnichannel/setup`*
