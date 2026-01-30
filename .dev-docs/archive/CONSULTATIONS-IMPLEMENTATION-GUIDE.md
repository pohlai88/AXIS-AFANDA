# Consultations System — Implementation Guide

> Step-by-step guide to implement the redesigned UI/UX

---

## 📋 Overview

This guide walks you through implementing the redesigned consultations system, focusing on **copy-and-adapt** from shadcn blocks and **leverage existing luxury utilities**.

---

## 🎯 Before & After Comparison

### Main Page

**BEFORE:**
```
- Simple card list
- Basic search and filters
- Static layout
- No visual hierarchy
- Limited interactivity
```

**AFTER:**
```
✨ Smart timeline with date grouping
📊 KPI dashboard with metrics
🗓️ Calendar heatmap for activity visualization
⚡ Proximity-based styling (urgent meetings pulse)
🎨 Luxury card effects (glow on hover)
📱 Fully responsive
```

### Detail Page

**BEFORE:**
```
- Horizontal tabs
- Basic meeting info
- Separate minutes dialog
- Static case trail
```

**AFTER:**
```
✨ Vertical tabs (space-efficient)
🎥 Live meeting embed with split-pane
📝 Collaborative notes (tldraw integration)
🤖 AI-powered suggestions
⚡ MagicToDo sheet (quick actions)
🔗 Visual timeline for case trail
```

---

## 🚀 Implementation Steps

### Phase 1: Foundation (Week 1-2)

#### Step 1.1: Update Main Consultations Page

**File:** `app/app/consultations/page.tsx`

1. **Add Quick Stats Bar:**

```typescript
import { QuickStatsBar } from '@/app/components/consultations/quick-stats-bar';

export default function ConsultationsPage() {
  // ... existing code ...
  
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        {/* ... existing header ... */}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* NEW: Quick Stats */}
          <QuickStatsBar meetings={mockMeetings} />
          
          {/* NEW: Timeline View */}
          <TimelineView meetings={upcomingMeetings} />
          
          {/* ... rest of content ... */}
        </div>
      </div>
    </div>
  );
}
```

2. **Replace list with Timeline:**

```typescript
// OLD: Simple map
{upcomingMeetings.map((meeting) => (
  <Card key={meeting.id}>
    {/* ... */}
  </Card>
))}

// NEW: Timeline grouping
<TimelineView meetings={upcomingMeetings} />
```

3. **Add Calendar Heatmap:**

```typescript
<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
  {/* Left: Timeline (2/3 width) */}
  <div className="lg:col-span-2">
    <TimelineView meetings={filteredMeetings} />
  </div>
  
  {/* Right: Heatmap + Filters (1/3 width) */}
  <div className="space-y-6">
    <CalendarHeatmap meetings={allMeetings} />
    {/* Filters, etc. */}
  </div>
</div>
```

#### Step 1.2: Create Component Files

Copy these blocks from `lib/ui/Blocks-shadcn/` to `app/components/consultations/blocks/`:

```bash
# Terminal commands
mkdir -p app/components/consultations/blocks

# Copy calendar for date picker
cp lib/ui/Blocks-shadcn/calendar-01.tsx app/components/consultations/blocks/calendar.tsx

# Copy data table for past meetings
cp lib/ui/Blocks-shadcn/data-table.tsx app/components/consultations/blocks/meetings-table.tsx

# Copy chart blocks for analytics
cp lib/ui/Blocks-shadcn/chart-area-interactive.tsx app/components/consultations/blocks/activity-chart.tsx
```

Then create your custom components:

```
app/components/consultations/
  ├── blocks/                      # Copied & adapted shadcn blocks
  │   ├── calendar.tsx
  │   ├── meetings-table.tsx
  │   └── activity-chart.tsx
  ├── timeline-view.tsx           # New: Smart timeline
  ├── quick-stats-bar.tsx         # New: KPI cards
  ├── calendar-heatmap.tsx        # New: Activity viz
  ├── meeting-card-enhanced.tsx   # Enhanced from existing
  └── floating-action-bar.tsx     # New: Context actions
```

#### Step 1.3: Apply Luxury Utilities

Update your meeting cards with luxury effects:

```typescript
// OLD
<Card className="hover:bg-muted/50">

// NEW
<Card className="card-glow-lux bg-lux-surface shadow-lux hover:shadow-lux-strong">
```

Add proximity-based styling:

```typescript
// Add urgency indicator
const isUrgent = differenceInMinutes(meeting.scheduledStart, new Date()) <= 15;

<Card className={cn(
  'card-glow-lux',
  isUrgent && 'border-danger animate-pulse'
)}>
```

---

### Phase 2: Enhanced Detail Page (Week 2-3)

#### Step 2.1: Vertical Tabs Layout

**File:** `app/app/consultations/[id]/page.tsx`

Replace horizontal tabs with vertical:

```typescript
export default function MeetingDetailPage() {
  const [activeTab, setActiveTab] = useState('room');
  
  const tabs = [
    { id: 'room', icon: <Video />, label: 'Room', badge: null },
    { id: 'agenda', icon: <FileText />, label: 'Plan', badge: null },
    { id: 'minutes', icon: <Pen />, label: 'Minutes', badge: meeting.minutesCompleted ? null : '!' },
    { id: 'actions', icon: <CheckSquare />, label: 'Actions', badge: meeting.todos.length },
    { id: 'trail', icon: <GitBranch />, label: 'Trail', badge: null },
  ];
  
  return (
    <div className="flex h-full">
      {/* Vertical Sidebar */}
      <div className="w-20 border-r bg-lux-surface flex flex-col items-center gap-3 py-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'relative w-14 h-14 rounded-xl flex items-center justify-center',
              'transition-all duration-lux-base',
              activeTab === tab.id
                ? 'bg-primary text-primary-foreground shadow-lux'
                : 'hover:bg-muted text-muted-foreground'
            )}
          >
            {tab.icon}
            {tab.badge && (
              <span className="absolute -top-1 -right-1 bg-danger text-white 
                             text-xs rounded-full w-5 h-5 flex items-center 
                             justify-center font-bold">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        {renderTabContent(activeTab)}
      </div>
    </div>
  );
}
```

#### Step 2.2: Split-Pane Meeting Room

Create live meeting experience:

```typescript
function MeetingRoomTab({ meeting }: { meeting: Meeting }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Left: Video */}
      <div className="space-y-4">
        <Card className="aspect-video bg-black rounded-xl overflow-hidden">
          {meeting.type === 'video' && (
            <JitsiMeeting roomId={meeting.locationDetails.jitsiRoomId} />
          )}
        </Card>
        
        <ParticipantsPanel participants={meeting.participants} />
      </div>
      
      {/* Right: Notes */}
      <div className="space-y-4">
        <CollaborativeNotesCard boardId={meeting.whiteboardId} />
        <AISuggestionsPanel meetingId={meeting.id} />
      </div>
    </div>
  );
}
```

#### Step 2.3: MagicToDo Sheet

Add slide-in sheet for quick action creation:

```typescript
import { MagicTodoSheet } from '@/app/components/consultations/magic-todo-sheet';

// In your component
const [showMagicTodo, setShowMagicTodo] = useState(false);

// Trigger button
<Button onClick={() => setShowMagicTodo(true)} className="btn-gold-lux">
  <Sparkles className="h-4 w-4 mr-2" />
  Create Action
</Button>

// Sheet component
<MagicTodoSheet
  open={showMagicTodo}
  onOpenChange={setShowMagicTodo}
  meeting={meeting}
  onCreateTask={(task) => {
    // API call to create task
    console.log('Creating task:', task);
  }}
/>
```

---

### Phase 3: Smart Features (Week 3-4)

#### Step 3.1: AI Suggestions Integration

Create AI suggestions panel:

```typescript
// app/components/consultations/ai-suggestions-panel.tsx

export function AISuggestionsPanel({ meetingId }: { meetingId: string }) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  
  // Mock AI detection (replace with actual API)
  useEffect(() => {
    // Simulate AI extracting action items from notes
    const detected = [
      'Submit budget approval request (Sarah)',
      'Post job listings for 2 developers (Mike)',
      'Update product roadmap (You)',
    ];
    setSuggestions(detected);
  }, [meetingId]);
  
  return (
    <Card className="bg-lux-gold-soft border-lux-gold">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-lux-gold" />
          AI Detected Action Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {suggestions.map((suggestion, idx) => (
          <div key={idx} className="flex items-start gap-2 p-2 rounded-lg 
                                    bg-background hover:bg-muted transition-colors">
            <Checkbox id={`suggestion-${idx}`} />
            <label htmlFor={`suggestion-${idx}`} className="flex-1 text-sm">
              {suggestion}
            </label>
            <Button size="sm" variant="ghost" className="shrink-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

#### Step 3.2: Real-time Updates

Add SSE for live updates:

```typescript
// app/components/consultations/use-meeting-updates.ts

import { useEffect } from 'react';
import { useSSE } from '@/app/lib/sse-client';

export function useMeetingUpdates(meetingId: string) {
  const { data, error } = useSSE(`/api/v1/meetings/${meetingId}/updates`);
  
  useEffect(() => {
    if (data?.type === 'participant_joined') {
      toast.info(`${data.userName} joined the meeting`);
    }
    if (data?.type === 'minutes_completed') {
      toast.success('Meeting minutes completed!', {
        icon: '✨',
      });
    }
  }, [data]);
  
  return { updates: data, error };
}

// Use in component
function MeetingDetailPage() {
  const { updates } = useMeetingUpdates(meetingId);
  
  // Updates will trigger re-renders automatically
}
```

#### Step 3.3: Floating Action Bar

Add context-aware floating bar:

```typescript
export function FloatingActionBar({ selectedMeeting }: { selectedMeeting: Meeting | null }) {
  if (!selectedMeeting) return null;
  
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 
                    animate-in slide-in-from-bottom duration-300">
      <Card className="bg-lux-surface/95 backdrop-blur-lg shadow-lux-strong 
                      border-lux p-4 flex items-center gap-4">
        <Avatar className="h-10 w-10">
          <AvatarFallback>{getMeetingIcon(selectedMeeting.type)}</AvatarFallback>
        </Avatar>
        
        <div>
          <p className="font-semibold text-sm">{selectedMeeting.title}</p>
          <p className="text-xs text-muted-foreground">{selectedMeeting.caseId}</p>
        </div>
        
        <Separator orientation="vertical" className="h-10" />
        
        <Button variant="outline" size="sm">
          View Case
        </Button>
        
        <Button size="sm" className="btn-gold-lux">
          {selectedMeeting.type === 'video' ? 'Join Meeting' : 'Start Meeting'}
        </Button>
        
        <Button variant="ghost" size="icon" onClick={() => clearSelection()}>
          <X className="h-4 w-4" />
        </Button>
      </Card>
    </div>
  );
}
```

---

### Phase 4: Polish & Testing (Week 4-5)

#### Step 4.1: Micro-interactions

Add animations and effects:

```typescript
// Confetti on completion
import confetti from 'canvas-confetti';

function celebrateCompletion() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#D4AF37', '#FFD700', '#FFA500'],
  });
}

// Pulse animation for urgent
<Card className={cn(
  'card-glow-lux',
  isUrgent && 'animate-pulse'
)}>

// Shimmer on hover
<Card className="group relative overflow-hidden">
  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                  transition-transform duration-1000 ease-out
                  bg-gradient-to-r from-transparent via-primary/10 to-transparent 
                  pointer-events-none" />
  {/* Content */}
</Card>
```

#### Step 4.2: Mobile Optimization

Responsive breakpoints:

```typescript
// Stack vertical tabs on mobile
<div className="flex flex-col md:flex-row h-full">
  {/* Tabs: horizontal on mobile, vertical on desktop */}
  <div className="md:w-20 border-b md:border-b-0 md:border-r">
    <div className="flex md:flex-col gap-2 p-2 overflow-x-auto md:overflow-x-visible">
      {tabs.map((tab) => (
        <button className="shrink-0">
          {/* Tab content */}
        </button>
      ))}
    </div>
  </div>
  
  {/* Content */}
  <div className="flex-1 overflow-auto">
    {/* ... */}
  </div>
</div>

// Stack split-pane on mobile
<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  {/* Stacks on mobile, side-by-side on desktop */}
</div>
```

#### Step 4.3: Performance Optimization

Lazy load components:

```typescript
import dynamic from 'next/dynamic';

// Lazy load heavy components
const JitsiMeeting = dynamic(() => import('@/app/components/consultations/jitsi-meeting'), {
  loading: () => <Skeleton className="aspect-video" />,
  ssr: false,
});

const TldrawBoard = dynamic(() => import('@/app/components/whiteboards/tldraw-board'), {
  loading: () => <Skeleton className="h-[400px]" />,
  ssr: false,
});

// Virtualize long lists
import { useVirtualizer } from '@tanstack/react-virtual';

function PastMeetingsList({ meetings }: { meetings: Meeting[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  
  const virtualizer = useVirtualizer({
    count: meetings.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
  });
  
  return (
    <div ref={parentRef} className="h-[600px] overflow-auto">
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map((virtualRow) => (
          <div
            key={virtualRow.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <MeetingCard meeting={meetings[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 🎨 Design System Checklist

### Colors

- [ ] Use `var(--info)` for upcoming meetings
- [ ] Use `var(--warn)` for meetings starting soon
- [ ] Use `var(--danger)` for urgent/overdue
- [ ] Use `var(--success)` for completed
- [ ] Use luxury gold tokens for CTAs

### Typography

- [ ] Hero titles: `text-hero-lux tracking-hero leading-hero`
- [ ] Section headings: `text-2xl font-semibold tracking-tight`
- [ ] Body text: `text-sm text-muted-foreground`
- [ ] Metadata: `text-xs text-muted-foreground`

### Spacing

- [ ] Card gaps: `gap-[var(--layout-gap)]`
- [ ] Section padding: `py-[var(--layout-section-py)]`
- [ ] Container max: `max-w-[var(--layout-container-max)]`

### Effects

- [ ] Card hover: `card-glow-lux`
- [ ] Surfaces: `bg-lux-surface`
- [ ] Shadows: `shadow-lux` / `shadow-lux-strong`
- [ ] Buttons: `btn-gold-lux`
- [ ] Rings: `ring-lux-glow`

---

## 🧪 Testing Checklist

### Functionality

- [ ] Timeline groups by date correctly
- [ ] Proximity alerts show at right time
- [ ] KPI stats calculate accurately
- [ ] Heatmap reflects meeting density
- [ ] MagicToDo creates tasks correctly
- [ ] Minutes completion saves data
- [ ] Case trail shows full history

### UX

- [ ] Cards are clickable with clear feedback
- [ ] Loading states show during API calls
- [ ] Error states display helpful messages
- [ ] Empty states guide user actions
- [ ] Mobile nav is intuitive
- [ ] Keyboard navigation works

### Performance

- [ ] Initial load < 2s
- [ ] Smooth animations (60fps)
- [ ] Lazy loading works
- [ ] Virtual scrolling for long lists
- [ ] Images optimized
- [ ] No layout shifts

### Accessibility

- [ ] Keyboard navigable
- [ ] Screen reader friendly
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] ARIA labels present

---

## 📚 Resources

### Documentation
- [Design Spec](.dev-docs/CONSULTATIONS-UI-REDESIGN.md)
- [Component Examples](.dev-docs/CONSULTATIONS-COMPONENT-EXAMPLES.tsx)
- [Project Spec](.dev-docs/PROJECT-SPEC.md)
- [Agent Guidelines](AGENTS.md)

### shadcn Blocks
- `lib/ui/Blocks-shadcn/` — Full library
- [Available Blocks Summary](.dev-docs/AVAILABLE-BLOCKS-SUMMARY.md)
- [Blocks Mix & Match Guide](.dev-docs/BLOCKS-MIX-MATCH-GUIDE.md)

### Design System
- `app/globals.css` — Theme tokens
- `app/styles/luxury.utilities.css` — Luxury utilities
- `.cursor/rules/css-design-system.mdc` — CSS rules

---

## 🎉 Success Criteria

Your implementation is successful when:

✅ **Visual Impact** — Meetings look premium with luxury effects  
✅ **Intuitive Flow** — Users complete tasks without confusion  
✅ **Smart Features** — AI suggestions and proximity alerts work  
✅ **Performance** — Fast load times and smooth interactions  
✅ **Responsive** — Perfect on mobile, tablet, and desktop  
✅ **Accessible** — WCAG compliant and keyboard friendly  

---

*Ready to build? Start with Phase 1, test thoroughly, then move to Phase 2. Ship incrementally!*
