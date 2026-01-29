# Consultations + Appointments — Unified Scheduling System

> Comprehensive appointment scheduling with physical & online (Jitsi) meetings

---

## 🎯 Vision

**Merge Consultations + Appointments into one unified scheduling system** that handles:
- 📅 **Appointment Booking** - Schedule meetings
- 🏥 **Physical Meetings** - In-person consultations (clinic, office)
- 🎥 **Video Meetings** - Online consultations via Jitsi
- 📞 **Phone Calls** - Audio-only consultations
- 👥 **Multi-party** - Group consultations
- 🔄 **Recurring** - Regular appointments
- ⏰ **Reminders** - Email/SMS notifications
- 📊 **Calendar View** - Day/Week/Month views

---

## 🏗️ Recommended Architecture

### Option 1: **Cal.com Integration** (RECOMMENDED ⭐)

**Why Cal.com?**
- ✅ **Open-source** - Self-hostable
- ✅ **Modern stack** - Next.js, Prisma, TypeScript
- ✅ **Feature-rich** - Everything you need
- ✅ **API-first** - Easy integration
- ✅ **Jitsi support** - Built-in video conferencing
- ✅ **Multi-location** - Physical + Online
- ✅ **Team scheduling** - Round-robin, collective
- ✅ **Customizable** - White-label ready
- ✅ **Active development** - Large community

**Cal.com Features**:
```
✅ Event Types (Physical, Video, Phone)
✅ Availability Management
✅ Time Zone Support
✅ Buffer Times
✅ Duration Options
✅ Booking Limits
✅ Recurring Appointments
✅ Group Bookings
✅ Payment Integration (Stripe)
✅ Email Reminders
✅ SMS Notifications (Twilio)
✅ Calendar Sync (Google, Outlook)
✅ Webhooks
✅ Custom Branding
✅ Team Scheduling
✅ Jitsi Integration
✅ Zoom Integration
✅ Google Meet Integration
```

---

### Option 2: **Custom Build with Jitsi**

**Build from scratch:**
- ❌ More development time
- ❌ Need to handle edge cases
- ❌ Calendar sync complexity
- ❌ Time zone handling
- ❌ Reminder system
- ✅ Full control
- ✅ Tailored to needs

**Verdict**: Not recommended unless specific requirements can't be met by Cal.com

---

## 📊 Comparison

| Feature              | Cal.com          | Custom Build      |
| -------------------- | ---------------- | ----------------- |
| **Development Time** | 1-2 weeks        | 2-3 months        |
| **Maintenance**      | Low              | High              |
| **Features**         | 50+ built-in     | Build each one    |
| **Jitsi Support**    | ✅ Built-in       | Need to integrate |
| **Calendar Sync**    | ✅ Built-in       | Complex to build  |
| **Time Zones**       | ✅ Handled        | Need to implement |
| **Reminders**        | ✅ Built-in       | Need to build     |
| **Mobile App**       | ✅ Available      | Need to build     |
| **Cost**             | Free (self-host) | Development cost  |
| **Scalability**      | ✅ Proven         | Need to test      |
| **Updates**          | ✅ Regular        | Manual            |

---

## 🎨 Proposed UI/UX

### Main View: Calendar + List

```
┌────────────────────────────────────────────────────────┐
│ Consultations & Appointments    [+ New Appointment]    │
├────────────────────────────────────────────────────────┤
│ [Day] [Week] [Month] [List]              [Today]       │
├────────────────────────────────────────────────────────┤
│                                                         │
│  Calendar View (Week)                                  │
│  ┌──────┬──────┬──────┬──────┬──────┬──────┬──────┐  │
│  │ Mon  │ Tue  │ Wed  │ Thu  │ Fri  │ Sat  │ Sun  │  │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤  │
│  │ 9:00 │      │      │ 🎥   │      │      │      │  │
│  │      │ 🏥   │      │ Sarah│      │      │      │  │
│  │      │ Mike │      │ 30min│      │      │      │  │
│  │      │ 1hr  │      │      │      │      │      │  │
│  ├──────┼──────┼──────┼──────┼──────┼──────┼──────┤  │
│  │10:00 │      │ 📞   │      │ 🎥   │      │      │  │
│  │      │      │ Alex │      │ Team │      │      │  │
│  │      │      │ 15min│      │ 1hr  │      │      │  │
│  └──────┴──────┴──────┴──────┴──────┴──────┴──────┘  │
│                                                         │
│  Upcoming (Next 7 days)                                │
│  ┌────────────────────────────────────────────────┐   │
│  │ 🎥 Video - Sarah Chen                          │   │
│  │ Thu, Jan 30 • 9:00 AM - 9:30 AM               │   │
│  │ [Join Meeting] [Reschedule] [Cancel]          │   │
│  ├────────────────────────────────────────────────┤   │
│  │ 🏥 In-Person - Mike Johnson                   │   │
│  │ Tue, Jan 28 • 10:00 AM - 11:00 AM            │   │
│  │ Office 3B                                      │   │
│  │ [Check In] [Reschedule] [Cancel]              │   │
│  └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

---

### Appointment Types

#### 1. **Video Consultation** 🎥
```
Type: Online
Platform: Jitsi
Duration: 15/30/45/60 min
Features:
  - Auto-generated meeting link
  - Email reminder with link
  - Calendar invite
  - Waiting room
  - Recording (optional)
```

#### 2. **In-Person Appointment** 🏥
```
Type: Physical
Location: Office/Clinic address
Duration: 15/30/45/60/90 min
Features:
  - Location details
  - Parking info
  - Check-in system
  - Directions link
```

#### 3. **Phone Call** 📞
```
Type: Audio
Platform: Phone
Duration: 15/30/45 min
Features:
  - Phone number
  - Call reminder
  - Auto-dial link (mobile)
```

#### 4. **Group Consultation** 👥
```
Type: Video/Physical
Participants: Multiple
Duration: 30/60/90 min
Features:
  - Invite multiple people
  - Shared calendar
  - Group chat
```

---

### Booking Flow

```
Step 1: Select Type
┌────────────────────────────────┐
│ Choose Appointment Type        │
├────────────────────────────────┤
│ [🎥 Video Consultation]        │
│ [🏥 In-Person Visit]           │
│ [📞 Phone Call]                │
│ [👥 Group Meeting]             │
└────────────────────────────────┘

Step 2: Select Date & Time
┌────────────────────────────────┐
│ When would you like to meet?   │
├────────────────────────────────┤
│ [Calendar with available slots]│
│                                │
│ Available Times:               │
│ [9:00 AM] [10:00 AM] [2:00 PM]│
└────────────────────────────────┘

Step 3: Add Details
┌────────────────────────────────┐
│ Appointment Details            │
├────────────────────────────────┤
│ Name: [________________]       │
│ Email: [________________]      │
│ Phone: [________________]      │
│ Reason: [________________]     │
│                                │
│ [x] Send email reminder        │
│ [x] Send SMS reminder          │
└────────────────────────────────┘

Step 4: Confirm
┌────────────────────────────────┐
│ Confirm Appointment            │
├────────────────────────────────┤
│ 🎥 Video Consultation          │
│ Sarah Chen                     │
│ Thu, Jan 30 • 9:00 AM         │
│ Duration: 30 minutes           │
│                                │
│ [Confirm Booking]              │
└────────────────────────────────┘
```

---

## 🔧 Technical Implementation

### With Cal.com Integration

#### 1. **Self-Host Cal.com**
```bash
# Docker Compose
version: '3.8'
services:
  calcom:
    image: calcom/cal.com:latest
    ports:
      - "3001:3000"
    environment:
      - DATABASE_URL=postgresql://...
      - NEXTAUTH_SECRET=...
      - CALENDSO_ENCRYPTION_KEY=...
      - NEXT_PUBLIC_WEBAPP_URL=https://cal.yourdomain.com
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: calcom
      POSTGRES_USER: calcom
      POSTGRES_PASSWORD: ...

  redis:
    image: redis:7-alpine
```

#### 2. **Embed in AXIS-AFENDA**
```tsx
// app/app/consultations/page.tsx
'use client';

export default function ConsultationsPage() {
  return (
    <div className="h-full">
      {/* Embed Cal.com iframe */}
      <iframe
        src="https://cal.yourdomain.com/team/consultations"
        className="h-full w-full border-0"
        allow="camera; microphone"
      />
    </div>
  );
}
```

#### 3. **API Integration**
```typescript
// app/lib/api/cal.ts
import { CalApi } from '@calcom/api';

const cal = new CalApi({
  apiKey: process.env.CAL_API_KEY,
  baseUrl: process.env.CAL_BASE_URL,
});

// Create booking
export async function createBooking(data: {
  eventTypeId: number;
  start: Date;
  end: Date;
  name: string;
  email: string;
  location: string;
}) {
  return await cal.bookings.create(data);
}

// Get bookings
export async function getBookings(userId: string) {
  return await cal.bookings.list({ userId });
}

// Cancel booking
export async function cancelBooking(bookingId: string) {
  return await cal.bookings.cancel(bookingId);
}
```

#### 4. **Webhook Integration**
```typescript
// apps/orchestrator/src/routes/webhooks/cal.ts
import { Hono } from 'hono';

const app = new Hono();

app.post('/cal', async (c) => {
  const event = await c.req.json();

  switch (event.type) {
    case 'BOOKING_CREATED':
      // Log to activity timeline
      // Send notification
      // Update approval if needed
      break;

    case 'BOOKING_CANCELLED':
      // Update status
      // Notify participants
      break;

    case 'BOOKING_RESCHEDULED':
      // Update calendar
      // Send new invites
      break;
  }

  return c.json({ received: true });
});

export default app;
```

---

### Custom Build Approach

#### Database Schema
```typescript
// Appointments table
interface Appointment {
  id: string;
  tenantId: string;
  type: 'video' | 'physical' | 'phone' | 'group';
  title: string;
  description: string;
  
  // Timing
  startTime: Date;
  endTime: Date;
  duration: number; // minutes
  timezone: string;
  
  // Participants
  organizerId: string;
  participantIds: string[];
  
  // Location
  locationType: 'jitsi' | 'physical' | 'phone';
  locationDetails: {
    jitsiRoomId?: string;
    address?: string;
    phoneNumber?: string;
  };
  
  // Status
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed' | 'no-show';
  
  // Reminders
  reminderSent: boolean;
  reminderTime: Date;
  
  // Recurring
  isRecurring: boolean;
  recurrenceRule?: string; // RRULE format
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}
```

#### Jitsi Integration
```typescript
// app/lib/jitsi.ts
export function generateJitsiMeetingUrl(appointmentId: string) {
  const domain = process.env.JITSI_DOMAIN || 'meet.jit.si';
  const roomName = `consultation-${appointmentId}`;
  
  return `https://${domain}/${roomName}`;
}

export function getJitsiConfig(appointment: Appointment) {
  return {
    roomName: `consultation-${appointment.id}`,
    width: '100%',
    height: '100%',
    parentNode: document.querySelector('#jitsi-container'),
    configOverwrite: {
      startWithAudioMuted: false,
      startWithVideoMuted: false,
      enableWelcomePage: false,
    },
    interfaceConfigOverwrite: {
      SHOW_JITSI_WATERMARK: false,
      SHOW_WATERMARK_FOR_GUESTS: false,
    },
    userInfo: {
      displayName: appointment.organizerId,
    },
  };
}
```

---

## 🎯 Recommended Approach

### **Use Cal.com** ⭐

**Reasons**:
1. **Faster to market** - 1-2 weeks vs 2-3 months
2. **Battle-tested** - Used by thousands
3. **Feature-complete** - Everything you need
4. **Maintained** - Regular updates
5. **Scalable** - Proven at scale
6. **Cost-effective** - Free to self-host

**Integration Steps**:
1. ✅ Self-host Cal.com (Docker)
2. ✅ Configure Jitsi integration
3. ✅ Set up event types (Video, Physical, Phone)
4. ✅ Embed in AXIS-AFENDA Shell
5. ✅ Connect webhooks to Orchestrator
6. ✅ Sync with activity timeline
7. ✅ Add to approval workflow

---

## 📋 Feature Checklist

### MVP (Phase 1)
- [ ] Cal.com self-hosted deployment
- [ ] Jitsi integration for video calls
- [ ] Event types setup (Video, Physical, Phone)
- [ ] Embed in Shell app
- [ ] Webhook integration
- [ ] Activity timeline sync
- [ ] Email reminders
- [ ] Calendar view (Day/Week/Month)

### Phase 2
- [ ] SMS reminders (Twilio)
- [ ] Calendar sync (Google, Outlook)
- [ ] Recurring appointments
- [ ] Group consultations
- [ ] Payment integration (Stripe)
- [ ] Custom branding
- [ ] Mobile app

### Phase 3
- [ ] AI scheduling assistant
- [ ] Auto-rescheduling
- [ ] No-show tracking
- [ ] Analytics dashboard
- [ ] Patient portal
- [ ] Prescription integration
- [ ] Medical records link

---

## 🎨 UI Mockups

### Calendar View
```
┌─────────────────────────────────────────────┐
│ January 2026              [Today] [+ New]   │
├─────────────────────────────────────────────┤
│ Mon  Tue  Wed  Thu  Fri  Sat  Sun          │
│  27   28   29   30   31    1    2          │
│                                             │
│ 9:00  🎥   🏥        🎥                     │
│       Sarah Mike     Team                   │
│                                             │
│10:00       📞   🏥                          │
│            Alex Emma                        │
│                                             │
│11:00  🏥                                    │
│       John                                  │
└─────────────────────────────────────────────┘
```

### Appointment Detail
```
┌─────────────────────────────────────────────┐
│ 🎥 Video Consultation                       │
├─────────────────────────────────────────────┤
│ Sarah Chen                                  │
│ Thu, Jan 30 • 9:00 AM - 9:30 AM            │
│                                             │
│ Meeting Link:                               │
│ https://meet.jit.si/consultation-123        │
│ [Copy Link] [Join Meeting]                  │
│                                             │
│ Participants:                               │
│ • Sarah Chen (Organizer)                    │
│ • You                                       │
│                                             │
│ Notes:                                      │
│ Q1 budget review discussion                 │
│                                             │
│ [Reschedule] [Cancel] [Add to Calendar]    │
└─────────────────────────────────────────────┘
```

---

## 💰 Cost Analysis

### Cal.com (Self-hosted)
- **Setup**: Free
- **Hosting**: $20-50/month (VPS)
- **Maintenance**: Low
- **Total Year 1**: ~$500

### Custom Build
- **Development**: $20,000-40,000
- **Maintenance**: $5,000-10,000/year
- **Total Year 1**: $25,000-50,000

**Savings with Cal.com**: $24,500-49,500 ✅

---

## 🚀 Implementation Timeline

### With Cal.com
- **Week 1**: Setup & Configuration
- **Week 2**: Integration & Testing
- **Total**: 2 weeks

### Custom Build
- **Month 1**: Design & Architecture
- **Month 2**: Core Features
- **Month 3**: Testing & Polish
- **Total**: 3 months

**Time saved with Cal.com**: 10 weeks ✅

---

## 🎉 Recommendation

**Use Cal.com for Consultations + Appointments**

### Why?
1. ✅ **Proven solution** - Battle-tested
2. ✅ **Feature-rich** - Everything you need
3. ✅ **Fast deployment** - 2 weeks vs 3 months
4. ✅ **Cost-effective** - $500 vs $25,000+
5. ✅ **Jitsi support** - Built-in
6. ✅ **Scalable** - Handles growth
7. ✅ **Maintained** - Regular updates
8. ✅ **Open-source** - Full control

### Next Steps
1. Set up Cal.com instance
2. Configure Jitsi integration
3. Create event types
4. Embed in Shell
5. Connect webhooks
6. Test end-to-end
7. Launch! 🚀

---

*Recommendation: Cal.com integration*
*Timeline: 2 weeks*
*Cost: ~$500/year*
*ROI: Massive savings vs custom build*
