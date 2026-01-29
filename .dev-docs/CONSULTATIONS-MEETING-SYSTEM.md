# Consultations + Meeting System — The AFENDA Way

> Meeting-centric workflow with Minutes, MagicToDo, and Full Traceability

---

## 🎯 Core Philosophy

**"After the meeting, then what?"**

Every consultation/meeting should produce:
1. 📝 **Meeting Minutes** (auto-captured, spot-on)
2. ✨ **MagicToDo** (actionable tasks)
3. 🔗 **Linked to Approval** (if needed)
4. 📊 **Full Trail** (past-present-future)

**No external tools. No calendar sync. Everything in AFENDA.**

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  CONSULTATION/MEETING                    │
│                  (Physical or Jitsi)                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│              MEETING MINUTES (Auto-capture)              │
│  - Participants                                          │
│  - Discussion points                                     │
│  - Decisions made                                        │
│  - Action items identified                               │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                   MAGIC TODO                             │
│  [Click on Minutes] → Generate Tasks                     │
│                                                          │
│  Options:                                                │
│  1. Self-Reminder (for me)                              │
│  2. Push to Someone (assign task)                       │
│  3. Push to Department (team task)                      │
│  4. Link to Approval (needs approval)                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ↓
┌─────────────────────────────────────────────────────────┐
│                  CASE TRAIL                              │
│  CASE-2024-001                                          │
│  ├─ Past: Customer inquiry (Omnichannel)                │
│  ├─ Present: Meeting held (Consultation)                │
│  ├─ Action: Tasks created (MagicToDo)                   │
│  ├─ Approval: CEO approved (Approval System)            │
│  └─ Future: Follow-up scheduled                         │
└─────────────────────────────────────────────────────────┘
```

---

## 🎨 UI/UX Design

### Main Consultations Page

```
┌────────────────────────────────────────────────────────┐
│ Consultations & Meetings        [+ New Meeting]        │
├────────────────────────────────────────────────────────┤
│ [Upcoming] [Past] [All Cases]                          │
├────────────────────────────────────────────────────────┤
│                                                         │
│ Upcoming Meetings                                      │
│ ┌────────────────────────────────────────────────┐   │
│ │ 🎥 Video - Q1 Budget Review                    │   │
│ │ Thu, Jan 30 • 9:00 AM - 10:00 AM              │   │
│ │ With: Sarah Chen, Mike Johnson                 │   │
│ │ CASE-2024-001                                  │   │
│ │ [Join Meeting] [View Case] [Reschedule]       │   │
│ ├────────────────────────────────────────────────┤   │
│ │ 🏥 In-Person - Product Planning                │   │
│ │ Fri, Jan 31 • 2:00 PM - 3:00 PM               │   │
│ │ Location: Office 3B                            │   │
│ │ With: Emma Wilson, Alex Rodriguez              │   │
│ │ CASE-2024-002                                  │   │
│ │ [Start Meeting] [View Case] [Reschedule]      │   │
│ └────────────────────────────────────────────────┘   │
│                                                         │
│ Past Meetings (Needs Minutes)                          │
│ ┌────────────────────────────────────────────────┐   │
│ │ ⚠️ Engineering Sync - No minutes yet           │   │
│ │ Mon, Jan 27 • 10:00 AM                         │   │
│ │ CASE-2024-003                                  │   │
│ │ [Add Minutes] [View Case]                      │   │
│ └────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────┘
```

---

### Meeting Detail Page (During/After Meeting)

```
┌────────────────────────────────────────────────────────┐
│ ← Back to Consultations                                │
├────────────────────────────────────────────────────────┤
│ 🎥 Q1 Budget Review                                    │
│ CASE-2024-001                                          │
│ Thu, Jan 30 • 9:00 AM - 10:00 AM                      │
├────────────────────────────────────────────────────────┤
│                                                         │
│ [Meeting] [Minutes] [MagicToDo] [Case Trail]          │
│                                                         │
│ ┌─ Meeting Tab ─────────────────────────────────────┐ │
│ │                                                    │ │
│ │ Participants:                                      │ │
│ │ • Sarah Chen (Organizer)                          │ │
│ │ • Mike Johnson                                     │ │
│ │ • You                                              │ │
│ │                                                    │ │
│ │ Jitsi Meeting:                                     │ │
│ │ [Join Meeting] [Copy Link]                        │ │
│ │                                                    │ │
│ │ Status: ⏰ Starting in 5 minutes                   │ │
│ │                                                    │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

### Meeting Minutes Tab (The Magic! ✨)

```
┌────────────────────────────────────────────────────────┐
│ ← Back to Consultations                                │
├────────────────────────────────────────────────────────┤
│ 🎥 Q1 Budget Review                                    │
│ CASE-2024-001                                          │
├────────────────────────────────────────────────────────┤
│                                                         │
│ [Meeting] [Minutes] [MagicToDo] [Case Trail]          │
│                                                         │
│ ┌─ Minutes Tab ─────────────────────────────────────┐ │
│ │                                                    │ │
│ │ Meeting Minutes                    [✨ MagicToDo] │ │
│ │ ────────────────────────────────────────────────  │ │
│ │                                                    │ │
│ │ 📅 Date: Thu, Jan 30, 2026                        │ │
│ │ ⏰ Time: 9:00 AM - 10:00 AM (1 hour)              │ │
│ │ 👥 Attendees: Sarah Chen, Mike Johnson, You       │ │
│ │                                                    │ │
│ │ 📝 Discussion:                                     │ │
│ │ ┌──────────────────────────────────────────────┐ │ │
│ │ │ 1. Q1 marketing budget needs adjustment      │ │ │
│ │ │    - Current: $50k                           │ │ │
│ │ │    - Proposed: $65k (+30%)                   │ │ │
│ │ │    - Reason: New campaign launch             │ │ │
│ │ │                                              │ │ │
│ │ │ 2. Engineering resources stretched           │ │ │
│ │ │    - Need 2 more developers                  │ │ │
│ │ │    - Timeline: By Feb 15                     │ │ │
│ │ │                                              │ │ │
│ │ │ 3. Product roadmap review                    │ │ │
│ │ │    - Feature A: Priority 1                   │ │ │
│ │ │    - Feature B: Delayed to Q2                │ │ │
│ │ └──────────────────────────────────────────────┘ │ │
│ │                                                    │ │
│ │ ✅ Decisions Made:                                 │ │
│ │ • Approve $65k marketing budget                   │ │
│ │ • Start hiring 2 developers immediately           │ │
│ │ • Postpone Feature B to Q2                        │ │
│ │                                                    │ │
│ │ 🎯 Action Items:                                   │ │
│ │ ┌──────────────────────────────────────────────┐ │ │
│ │ │ [ ] Sarah: Submit budget approval request    │ │ │
│ │ │     → Click to create MagicToDo              │ │ │
│ │ │                                              │ │ │
│ │ │ [ ] Mike: Post job listings for developers   │ │ │
│ │ │     → Click to create MagicToDo              │ │ │
│ │ │                                              │ │ │
│ │ │ [ ] You: Update product roadmap              │ │ │
│ │ │     → Click to create MagicToDo              │ │ │
│ │ └──────────────────────────────────────────────┘ │ │
│ │                                                    │ │
│ │ [Save Minutes] [Export PDF]                       │ │
│ │                                                    │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

---

### MagicToDo Tab (The Power! ⚡)

```
┌────────────────────────────────────────────────────────┐
│ ✨ MagicToDo - Convert Minutes to Actions              │
├────────────────────────────────────────────────────────┤
│                                                         │
│ From Meeting Minutes:                                  │
│ "Sarah: Submit budget approval request"                │
│                                                         │
│ ┌─ Create Task ──────────────────────────────────────┐│
│ │                                                     ││
│ │ Task Type:                                          ││
│ │ ( ) Self-Reminder (for me)                         ││
│ │ (•) Push to Someone (assign)                       ││
│ │ ( ) Push to Department (team)                      ││
│ │ ( ) Link to Approval (needs approval)              ││
│ │                                                     ││
│ │ ─────────────────────────────────────────────────  ││
│ │                                                     ││
│ │ Assign To: [Sarah Chen ▼]                          ││
│ │                                                     ││
│ │ Task Title:                                         ││
│ │ [Submit Q1 Marketing Budget Approval___________]   ││
│ │                                                     ││
│ │ Description:                                        ││
│ │ ┌─────────────────────────────────────────────┐   ││
│ │ │ Request approval for $65k marketing budget  │   ││
│ │ │ (increase from $50k)                        │   ││
│ │ │                                             │   ││
│ │ │ Justification: New campaign launch          │   ││
│ │ └─────────────────────────────────────────────┘   ││
│ │                                                     ││
│ │ Priority: [High ▼]                                  ││
│ │ Due Date: [Feb 5, 2026 ▼]                          ││
│ │                                                     ││
│ │ Link to Approval?                                   ││
│ │ [x] Yes - Create approval request                  ││
│ │     Approver: [CEO ▼]                              ││
│ │     Amount: [$65,000]                              ││
│ │                                                     ││
│ │ Watchers (who's listening):                         ││
│ │ [x] Mike Johnson                                    ││
│ │ [x] Finance Department                              ││
│ │ [ ] Marketing Team                                  ││
│ │                                                     ││
│ │ [Create Task & Approval] [Cancel]                  ││
│ │                                                     ││
│ └─────────────────────────────────────────────────────┘│
└────────────────────────────────────────────────────────┘
```

---

### Case Trail Tab (Full Traceability! 🔗)

```
┌────────────────────────────────────────────────────────┐
│ 📊 Case Trail - CASE-2024-001                          │
│ "Q1 Budget Review"                                     │
├────────────────────────────────────────────────────────┤
│                                                         │
│ Timeline (Past → Present → Future)                     │
│                                                         │
│ ┌─ PAST ────────────────────────────────────────────┐ │
│ │                                                    │ │
│ │ 🔵 Jan 15 - Customer Inquiry                      │ │
│ │    Source: Omnichannel (WhatsApp)                 │ │
│ │    Contact: Sarah Chen                            │ │
│ │    Topic: Budget concerns for Q1                  │ │
│ │    [View Conversation]                            │ │
│ │                                                    │ │
│ │ 🔵 Jan 20 - Internal Discussion                   │ │
│ │    Source: Inbox (Team Chat)                      │ │
│ │    Participants: Sarah, Mike, You                 │ │
│ │    Topic: Initial budget review                   │ │
│ │    [View Chat]                                    │ │
│ │                                                    │ │
│ │ 🔵 Jan 25 - Meeting Scheduled                     │ │
│ │    Type: Video Consultation                       │ │
│ │    Date: Jan 30, 9:00 AM                         │ │
│ │    [View Details]                                 │ │
│ │                                                    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─ PRESENT ─────────────────────────────────────────┐ │
│ │                                                    │ │
│ │ 🟢 Jan 30 - Meeting Held ← YOU ARE HERE          │ │
│ │    Duration: 1 hour                               │ │
│ │    Attendees: 3 people                            │ │
│ │    Minutes: Completed ✓                           │ │
│ │    [View Minutes]                                 │ │
│ │                                                    │ │
│ │ 🟢 Jan 30 - Tasks Created (MagicToDo)            │ │
│ │    • Submit budget approval (Sarah) - Pending     │ │
│ │    • Post job listings (Mike) - In Progress       │ │
│ │    • Update roadmap (You) - Not Started           │ │
│ │    [View Tasks]                                   │ │
│ │                                                    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ ┌─ FUTURE ──────────────────────────────────────────┐ │
│ │                                                    │ │
│ │ ⏳ Feb 5 - Approval Decision Due                  │ │
│ │    Approver: CEO                                  │ │
│ │    Amount: $65,000                                │ │
│ │    Status: Pending                                │ │
│ │    [View Approval]                                │ │
│ │                                                    │ │
│ │ ⏳ Feb 15 - Hiring Deadline                       │ │
│ │    Task: Hire 2 developers                        │ │
│ │    Owner: Mike Johnson                            │ │
│ │    Status: In Progress                            │ │
│ │    [View Task]                                    │ │
│ │                                                    │ │
│ │ ⏳ Mar 1 - Follow-up Meeting                      │ │
│ │    Type: Video Consultation                       │ │
│ │    Purpose: Review progress                       │ │
│ │    [Schedule Now]                                 │ │
│ │                                                    │ │
│ └────────────────────────────────────────────────────┘ │
│                                                         │
│ Activity Feed (Real-time)                              │
│ • 2 min ago: Mike updated task status                 │
│ • 5 min ago: Sarah added comment to approval          │
│ • 1 hour ago: Meeting minutes saved                   │
│                                                         │
└────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features

### 1. **Meeting Minutes (Mandatory)**

**Auto-capture during meeting:**
- Date, time, duration
- Participants list
- Discussion points (manual entry or voice-to-text)
- Decisions made
- Action items identified

**Enforcement:**
- ⚠️ Warning if meeting ends without minutes
- 🔒 Can't close meeting without saving minutes
- 📧 Reminder email if minutes not completed within 24h

---

### 2. **MagicToDo (The Magic! ✨)**

**One-click task creation from minutes:**

#### Option A: Self-Reminder
```
For: Me
Type: Personal task
Notification: Email/In-app
Calendar: My calendar
```

#### Option B: Push to Someone
```
For: Specific person
Type: Assigned task
Notification: Email + In-app
Tracking: Task board
Reminder: Auto-reminders
```

#### Option C: Push to Department
```
For: Entire department
Type: Team task
Visibility: All department members
Assignment: Round-robin or volunteer
```

#### Option D: Link to Approval
```
For: Approval workflow
Type: Approval request
Approver: CEO/Manager
Amount: If budget-related
Deadline: Auto-calculated
Trail: Links to case
```

---

### 3. **Watchers (Who's Listening)**

**Anyone can be added as watcher:**
- Gets notifications on updates
- Can see progress
- Can add comments
- Can't edit (read-only)

**Use cases:**
- Department heads monitoring
- Stakeholders tracking progress
- Team members staying informed

---

### 4. **Case Trail (Full Traceability)**

**Every case has complete history:**

**Past:**
- Original inquiry (Omnichannel)
- Internal discussions (Inbox)
- Meeting scheduled

**Present:**
- Meeting held
- Minutes recorded
- Tasks created
- Approvals requested

**Future:**
- Pending approvals
- Task deadlines
- Follow-up meetings
- Expected outcomes

**Benefits:**
- Complete context
- No information loss
- Easy handoffs
- Audit trail
- Pattern recognition

---

## 🔗 Integration Points

### With Omnichannel
```
Customer inquiry → Create case → Schedule meeting
                                      ↓
                              Meeting minutes
                                      ↓
                              MagicToDo tasks
```

### With Inbox
```
Team discussion → Create case → Schedule meeting
                                     ↓
                             Meeting minutes
                                     ↓
                             MagicToDo tasks
```

### With Approvals
```
Meeting decision → MagicToDo → Link to approval
                                      ↓
                              CEO approves
                                      ↓
                              Task updated
                                      ↓
                              Case trail updated
```

### With Whiteboards
```
Meeting → Whiteboard created → Linked to minutes
                                      ↓
                              Collaborative notes
                                      ↓
                              Saved to case
```

---

## 📊 Database Schema

```typescript
// Meetings/Consultations
interface Meeting {
  id: string;
  caseId: string; // Links to case trail
  tenantId: string;
  
  // Basic info
  title: string;
  description: string;
  type: 'video' | 'physical' | 'phone';
  
  // Timing
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  duration: number;
  
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
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  
  // Minutes (mandatory)
  minutes?: {
    discussion: string;
    decisions: string[];
    actionItems: string[];
    completedAt: Date;
    completedBy: string;
  };
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// MagicToDo Tasks
interface MagicTodo {
  id: string;
  caseId: string; // Links to case trail
  meetingId: string; // Links to meeting
  tenantId: string;
  
  // Task info
  title: string;
  description: string;
  type: 'self' | 'assigned' | 'department' | 'approval';
  
  // Assignment
  assignedTo?: string; // User ID
  assignedToDepartment?: string; // Department ID
  createdBy: string;
  
  // Priority & timing
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate: Date;
  reminderDate?: Date;
  
  // Status
  status: 'not-started' | 'in-progress' | 'completed' | 'cancelled';
  completedAt?: Date;
  
  // Approval link (if type === 'approval')
  approvalId?: string;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
  
  // Watchers
  watcherIds: string[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Case Trail
interface CaseTrail {
  id: string; // CASE-2024-001
  tenantId: string;
  
  // Basic info
  title: string;
  description: string;
  category: string;
  
  // Status
  status: 'open' | 'in-progress' | 'waiting' | 'resolved' | 'closed';
  
  // Timeline events
  events: Array<{
    id: string;
    type: 'inquiry' | 'discussion' | 'meeting' | 'task' | 'approval' | 'note';
    timestamp: Date;
    source: 'omnichannel' | 'inbox' | 'consultation' | 'approval' | 'manual';
    sourceId: string; // ID of the source entity
    description: string;
    userId: string;
    metadata: Record<string, any>;
  }>;
  
  // Linked entities
  linkedConversationIds: string[];
  linkedMeetingIds: string[];
  linkedTaskIds: string[];
  linkedApprovalIds: string[];
  linkedWhiteboardIds: string[];
  
  // Participants
  participantIds: string[];
  watcherIds: string[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}
```

---

## 🎨 Visual Flow

### Complete User Journey

```
1. Customer Inquiry (Omnichannel)
   ↓
2. Create Case (CASE-2024-001)
   ↓
3. Internal Discussion (Inbox)
   ↓
4. Schedule Meeting (Consultation)
   ↓
5. Hold Meeting (Video/Physical)
   ↓
6. Write Minutes (Mandatory!)
   ↓
7. Click MagicToDo on action items
   ↓
8. Choose task type:
   - Self-reminder
   - Push to someone
   - Push to department
   - Link to approval
   ↓
9. Task created & assigned
   ↓
10. If approval needed:
    - Approval request sent
    - CEO reviews
    - Decision made
    ↓
11. Task updated based on approval
    ↓
12. Case trail updated
    ↓
13. Follow-up meeting scheduled (if needed)
    ↓
14. Cycle repeats...
```

---

## 🚀 Implementation Plan

### Phase 1: Core Meeting System (Week 1-2)
- [ ] Meeting scheduling UI
- [ ] Jitsi integration
- [ ] Physical meeting support
- [ ] Case creation/linking
- [ ] Basic meeting detail page

### Phase 2: Meeting Minutes (Week 3)
- [ ] Minutes editor (rich text)
- [ ] Discussion points
- [ ] Decisions tracking
- [ ] Action items list
- [ ] Mandatory enforcement
- [ ] PDF export

### Phase 3: MagicToDo (Week 4-5)
- [ ] One-click task creation
- [ ] 4 task types (self/assigned/dept/approval)
- [ ] Task assignment UI
- [ ] Watchers system
- [ ] Approval linking
- [ ] Notification system

### Phase 4: Case Trail (Week 6)
- [ ] Timeline view
- [ ] Event aggregation
- [ ] Past-Present-Future sections
- [ ] Activity feed
- [ ] Cross-linking (conversations, meetings, tasks, approvals)
- [ ] Search & filter

### Phase 5: Polish & Integration (Week 7-8)
- [ ] Integrate with Omnichannel
- [ ] Integrate with Inbox
- [ ] Integrate with Approvals
- [ ] Integrate with Whiteboards
- [ ] Mobile optimization
- [ ] Performance optimization

---

## 🎉 Why This is BETTER Than Cal.com

### Cal.com Gives You:
- ✅ Scheduling
- ✅ Calendar
- ✅ Reminders

### AFENDA Gives You:
- ✅ Scheduling
- ✅ **Meeting Minutes (mandatory!)**
- ✅ **MagicToDo (instant task creation)**
- ✅ **Approval integration**
- ✅ **Full case trail (past-present-future)**
- ✅ **Watchers system**
- ✅ **Cross-module linking**
- ✅ **Complete traceability**
- ✅ **No external tools needed**

**Your system enforces accountability and follow-through!** 🎯

---

## 💡 Unique Value Propositions

### 1. **Enforced Follow-through**
- Can't close meeting without minutes
- Minutes must have action items
- Action items become tasks automatically
- Tasks link to approvals
- Complete trail maintained

### 2. **Zero Context Loss**
- Everything linked to case
- Full history visible
- Easy handoffs
- No information silos

### 3. **Accountability Built-in**
- Watchers see everything
- Tasks assigned clearly
- Approvals tracked
- Deadlines enforced

### 4. **Simplified Workflow**
- One click from minutes to task
- One click from task to approval
- One view for entire case
- No tool switching

---

## 🎯 Success Metrics

### Meeting Effectiveness
- % of meetings with minutes (target: 100%)
- Average time to complete minutes (target: <30 min)
- % of action items converted to tasks (target: 100%)

### Task Completion
- Task completion rate (target: >90%)
- Average time to complete (track trends)
- % of tasks linked to approvals (measure governance)

### Case Resolution
- Average case resolution time
- % of cases with complete trail (target: 100%)
- Follow-up meeting rate

---

## 🎉 Summary

**This is WAY better than just integrating Cal.com!**

### What You Get:
1. ✅ **Meeting scheduling** (video/physical/phone)
2. ✅ **Mandatory meeting minutes** (no escape!)
3. ✅ **MagicToDo** (one-click task creation)
4. ✅ **4 task types** (self/assigned/dept/approval)
5. ✅ **Watchers system** (who's listening)
6. ✅ **Approval integration** (seamless)
7. ✅ **Full case trail** (past-present-future)
8. ✅ **Complete traceability** (audit-ready)
9. ✅ **Zero external tools** (all in AFENDA)

**This is your competitive advantage!** 🚀

---

*Next: Shall we start building this?*
*Timeline: 8 weeks for full system*
*Start with: Core meeting system + Minutes*
