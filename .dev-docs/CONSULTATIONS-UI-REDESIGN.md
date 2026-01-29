# Consultations & Meetings System — UI/UX Redesign

> Creative, innovative, powerful frontend for the AFENDA meeting-centric workflow

---

## 🎯 Design Philosophy

**"Transform meetings from obligation to opportunity"**

### Core Principles

1. **Anticipatory UX** — Surface what users need before they ask
2. **Visual Hierarchy** — Guide attention through typography, color, and motion
3. **Contextual Intelligence** — Show relevant information based on meeting state
4. **Effortless Flow** — Minimize clicks from intention to action
5. **Luxury Details** — Premium feel through micro-interactions and polish

---

## 🎨 Design System Integration

### Color Palette Strategy

```typescript
// Meeting Status Colors (using existing tokens)
const statusColors = {
  upcoming: 'var(--info)',           // Blue - anticipation
  inProgress: 'var(--warn)',         // Amber - active attention
  completed: 'var(--success)',       // Green - accomplished
  needsMinutes: 'var(--danger)',     // Red - requires action
  pending: 'var(--pending-bg)',      // Gray - waiting
}

// Priority Mapping (luxury tokens)
const priorityStyles = {
  urgent: 'bg-[var(--danger)] text-white lux-sheen',
  high: 'bg-lux-gold-soft text-lux-gold border-lux-gold',
  medium: 'bg-secondary text-secondary-foreground',
  low: 'bg-muted text-muted-foreground',
}
```

### Typography Hierarchy

```css
/* Hero-level meeting titles */
.meeting-hero {
  @apply text-hero-lux text-5xl md:text-6xl lg:text-7xl tracking-hero leading-hero;
}

/* Section headings */
.section-title {
  @apply text-2xl font-semibold tracking-tight text-foreground;
}

/* Metadata text */
.meta-text {
  @apply text-sm text-muted-foreground font-medium;
}
```

### Luxury Effects

```css
/* Premium card hover */
.meeting-card {
  @apply card-glow-lux bg-lux-surface shadow-lux 
         transition-all duration-lux-base
         hover:shadow-lux-strong hover:scale-[1.01];
}

/* Status indicators with glow */
.status-indicator {
  @apply relative;
}
.status-indicator::after {
  content: '';
  @apply absolute inset-0 rounded-full blur-md opacity-50;
  background: inherit;
}

/* Interactive buttons */
.action-btn {
  @apply btn-gold-lux ring-lux-glow;
}
```

---

## 📐 Layout Redesign

### Main Consultations Page

**Before:** Simple list with basic cards  
**After:** Dynamic grid with smart sections and visual hierarchy

```
┌────────────────────────────────────────────────────────────────────┐
│  🎯 Consultations & Meetings                    [+ New Meeting]    │
│  Meeting-centric workflow with minutes and actions                 │
├────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─ Quick Stats (KPI Cards) ──────────────────────────────────┐  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │  │
│  │  │ 🔴 3     │  │ 📅 12    │  │ ✅ 48    │  │ ⏱️ 2h    │   │  │
│  │  │ Needs    │  │ This     │  │ Complete │  │ Today    │   │  │
│  │  │ Minutes  │  │ Week     │  │ This Q   │  │ Meetings │   │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─ Timeline View (Innovative!) ───────────────────────────────┐  │
│  │                                                              │  │
│  │  Today • Thu Jan 29                                         │  │
│  │  ├─ 9:00 AM  🎥 Q1 Budget Review        [Starting in 5m]   │  │
│  │  │           with Sarah Chen, Mike      🟢 Join Now        │  │
│  │  │                                                          │  │
│  │  ├─ 2:00 PM  📋 Product Planning        [In 5 hours]       │  │
│  │  │           Office 3B • 3 participants  View Details      │  │
│  │  │                                                          │  │
│  │  Tomorrow • Fri Jan 30                                      │  │
│  │  ├─ 10:00 AM 🏥 Engineering Sync        [Tomorrow]         │  │
│  │  │           Video call • 4 participants View Details      │  │
│  │  │                                                          │  │
│  │  ├─ 3:00 PM  📊 Monthly Review          [Tomorrow]         │  │
│  │  │           Boardroom • CEO Approval    View Case         │  │
│  │                                                              │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─ Needs Attention (Urgent!) ─────────────────────────────────┐  │
│  │  ⚠️ 3 meetings need minutes to unlock actions               │  │
│  │                                                              │  │
│  │  📌 Engineering Sync  • Yesterday • [Complete Now →]        │  │
│  │  📌 Client Call       • 2 days ago • [Complete Now →]       │  │
│  │  📌 Team Standup      • 3 days ago • [Complete Now →]       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─ Calendar Heatmap (Visual Overview) ────────────────────────┐  │
│  │  Jan 2026                         [Filters: ▼ All Types]    │  │
│  │  Mon Tue Wed Thu Fri Sat Sun                                │  │
│  │   ░   ▓   ░   ▓   █   ░   ░      ░ = 0-1 meetings          │  │
│  │   ▓   ░   ▓   █   ░   ░   ░      ▓ = 2-3 meetings          │  │
│  │   ░   ▓   ░   █   ▓   ░   ░      █ = 4+ meetings           │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  ┌─ Past Meetings (Collapsible) ──────────────────────────────┐  │
│  │  [Expand to show 48 completed meetings...]                  │  │
│  │                                                              │  │
│  │  Filters: [Video] [In-Person] [Phone] [With Minutes] [All] │  │
│  │  Search: [________________________] 🔍                      │  │
│  └──────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────┘
```

### Meeting Detail Page (Tabbed View)

**Innovative Tab Design:** Vertical side tabs + main content area

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Consultations                                         │
├──────────────────────────────────────────────────────────────────┤
│  🎥 Q1 Budget Review                                             │
│  CASE-2024-001 • 🟢 In Progress • Starting in 5 minutes          │
├─────────────┬────────────────────────────────────────────────────┤
│             │                                                    │
│  TABS       │  CONTENT AREA                                      │
│  (Vertical) │                                                    │
│             │                                                    │
│  ┌────────┐ │  ┌─ Meeting Room ──────────────────────────────┐ │
│  │ 🏠 Room│ │  │                                              │ │
│  └────────┘ │  │  [========== JITSI EMBED ==========]         │ │
│             │  │                                              │ │
│  ┌────────┐ │  │  👥 Participants (3/5 joined)                │ │
│  │ 📋 Plan│ │  │  • Sarah Chen (Organizer) 🟢                │ │
│  └────────┘ │  │  • Mike Johnson 🟢                           │ │
│             │  │  • Emma Wilson 🟡 (Waiting...)               │ │
│  ┌────────┐ │  │                                              │ │
│  │ ✍️ Mins│ │  │  [Start Recording] [Share Screen] [End]      │ │
│  └────────┘ │  └──────────────────────────────────────────────┘ │
│             │                                                    │
│  ┌────────┐ │  ┌─ Live Notes (Collaborative) ────────────────┐ │
│  │ ⚡ Acts│ │  │  📝 Real-time notes powered by tldraw        │ │
│  └────────┘ │  │                                              │ │
│             │  │  [========== COLLABORATIVE NOTES ==========] │ │
│  ┌────────┐ │  │                                              │ │
│  │ 🔗 Case│ │  │  ✨ AI Suggestion: "Budget increase" mentioned│ │
│  └────────┘ │  │     [Create Action Item →]                   │ │
│             │  └──────────────────────────────────────────────┘ │
│             │                                                    │
└─────────────┴────────────────────────────────────────────────────┘
```

---

## 🚀 Key Innovations

### 1. **Smart Timeline View** (Main Page)

Replace static list with dynamic timeline that groups by date:

```typescript
// Timeline grouping logic
const groupedMeetings = meetings.reduce((acc, meeting) => {
  const dateKey = format(meeting.scheduledStart, 'yyyy-MM-dd');
  const label = formatTimelineLabel(meeting.scheduledStart);
  
  if (!acc[dateKey]) {
    acc[dateKey] = { label, meetings: [] };
  }
  acc[dateKey].meetings.push(meeting);
  return acc;
}, {});

// Visual indicators based on proximity
function getProximityStyle(scheduledStart: Date) {
  const minutesUntil = differenceInMinutes(scheduledStart, new Date());
  
  if (minutesUntil <= 5) return 'bg-danger text-danger-foreground animate-pulse';
  if (minutesUntil <= 30) return 'bg-warn text-warn-foreground';
  if (minutesUntil <= 120) return 'bg-info text-info-foreground';
  return 'bg-muted text-muted-foreground';
}
```

### 2. **Floating Action Bar** (Context-Aware)

Appears at bottom of screen when user selects a meeting:

```typescript
<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
  <div className="bg-lux-surface shadow-lux-strong rounded-xl p-4 
                  flex items-center gap-4 backdrop-blur-lg 
                  border border-lux animate-in slide-in-from-bottom">
    <Avatar>{selectedMeeting.icon}</Avatar>
    <div>
      <p className="font-semibold">{selectedMeeting.title}</p>
      <p className="text-xs text-muted-foreground">{selectedMeeting.caseId}</p>
    </div>
    <Separator orientation="vertical" className="h-8" />
    <Button variant="outline" size="sm">View Case</Button>
    <Button size="sm" className="btn-gold-lux">
      {selectedMeeting.type === 'video' ? 'Join Meeting' : 'Start Meeting'}
    </Button>
  </div>
</div>
```

### 3. **Calendar Heatmap** (Activity Visualization)

Visual representation of meeting density:

```typescript
function CalendarHeatmap({ meetings }: { meetings: Meeting[] }) {
  const heatmapData = generateHeatmapData(meetings);
  
  return (
    <div className="grid grid-cols-7 gap-1">
      {heatmapData.map((day) => (
        <Tooltip key={day.date}>
          <TooltipTrigger asChild>
            <button
              className={cn(
                "aspect-square rounded-sm transition-all hover:scale-110",
                getHeatIntensity(day.count)
              )}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p className="font-semibold">{format(day.date, 'PP')}</p>
            <p className="text-sm">{day.count} meeting(s)</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

function getHeatIntensity(count: number) {
  if (count === 0) return 'bg-muted';
  if (count <= 2) return 'bg-primary/30';
  if (count <= 4) return 'bg-primary/60';
  return 'bg-primary';
}
```

### 4. **Vertical Tabs with Icons** (Detail Page)

More space-efficient and visually appealing:

```typescript
<div className="flex h-full">
  {/* Vertical Sidebar Tabs */}
  <div className="w-16 border-r bg-muted/30 flex flex-col items-center gap-2 py-4">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={cn(
          "relative w-12 h-12 rounded-lg flex items-center justify-center",
          "transition-all duration-lux-base",
          activeTab === tab.id
            ? "bg-primary text-primary-foreground shadow-lux"
            : "hover:bg-muted text-muted-foreground hover:text-foreground"
        )}
      >
        {tab.icon}
        {tab.badge && (
          <span className="absolute -top-1 -right-1 bg-danger text-white 
                         text-xs rounded-full w-5 h-5 flex items-center 
                         justify-center font-semibold">
            {tab.badge}
          </span>
        )}
      </button>
    ))}
  </div>
  
  {/* Main Content */}
  <div className="flex-1 overflow-auto p-6">
    {renderTabContent()}
  </div>
</div>
```

### 5. **MagicToDo Sheet** (Quick Action Creation)

Slide-in sheet from right with smart defaults:

```typescript
<Sheet>
  <SheetContent side="right" className="w-[600px] sm:w-[700px] overflow-y-auto">
    <SheetHeader>
      <SheetTitle className="flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-lux-gold" />
        Create Action from Meeting
      </SheetTitle>
      <SheetDescription>
        Convert decisions into actionable tasks with approval workflow
      </SheetDescription>
    </SheetHeader>
    
    <div className="space-y-6 py-6">
      {/* Smart Context Card */}
      <Alert className="bg-lux-gold-soft border-lux-gold">
        <Lightbulb className="h-4 w-4" />
        <AlertTitle>Smart Suggestion</AlertTitle>
        <AlertDescription>
          Based on your meeting minutes, we detected a budget approval request.
          This will be auto-linked to your approval workflow.
        </AlertDescription>
      </Alert>
      
      {/* Task Type Selection (Visual Cards) */}
      <div className="grid grid-cols-2 gap-3">
        {taskTypes.map((type) => (
          <Card
            key={type.id}
            className={cn(
              "cursor-pointer card-glow-lux",
              selectedType === type.id && "border-primary ring-2 ring-lux"
            )}
            onClick={() => setSelectedType(type.id)}
          >
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">{type.icon}</div>
              <p className="font-semibold">{type.label}</p>
              <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {/* Dynamic Form Based on Selection */}
      {selectedType && renderTaskForm(selectedType)}
    </div>
    
    <SheetFooter>
      <Button variant="outline" onClick={onCancel}>Cancel</Button>
      <Button className="btn-gold-lux">
        Create Action & Link to Case
      </Button>
    </SheetFooter>
  </SheetContent>
</Sheet>
```

### 6. **Case Trail Timeline** (Visual History)

Vertical timeline with expandable cards:

```typescript
function CaseTrailTimeline({ events }: { events: CaseEvent[] }) {
  const groupedEvents = groupEventsByPhase(events);
  
  return (
    <div className="space-y-12">
      {['past', 'present', 'future'].map((phase) => (
        <div key={phase} className="space-y-4">
          {/* Phase Header */}
          <div className="flex items-center gap-3">
            <Badge variant={getPhaseVariant(phase)} className="text-sm px-3 py-1">
              {phase === 'past' && '⏪ Past'}
              {phase === 'present' && '🟢 Present'}
              {phase === 'future' && '⏩ Future'}
            </Badge>
            <Separator className="flex-1" />
          </div>
          
          {/* Events in Phase */}
          <div className="relative pl-8 border-l-2 border-primary/30 space-y-6">
            {groupedEvents[phase].map((event, idx) => (
              <div key={event.id} className="relative">
                {/* Timeline Dot */}
                <div className={cn(
                  "absolute -left-[37px] w-8 h-8 rounded-full border-2",
                  "border-background flex items-center justify-center",
                  "shadow-lux transition-all hover:scale-110",
                  getEventColor(event.type)
                )}>
                  {getEventIcon(event.type)}
                </div>
                
                {/* Event Card */}
                <Card className="card-glow-lux">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline">{event.type}</Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatRelativeTime(event.timestamp)}
                          </span>
                        </div>
                        <p className="font-medium">{event.description}</p>
                        {event.metadata && (
                          <div className="mt-2 text-sm text-muted-foreground">
                            {renderEventMetadata(event.metadata)}
                          </div>
                        )}
                      </div>
                      <Button size="sm" variant="ghost">View</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 7. **Live Meeting Experience** (Enhanced Room Tab)

Split-pane layout with live notes and video:

```typescript
<div className="grid grid-cols-2 gap-6 h-full">
  {/* Left: Video/Meeting */}
  <div className="space-y-4">
    {/* Jitsi Embed */}
    <Card className="aspect-video bg-black rounded-xl overflow-hidden">
      <JitsiMeeting roomId={meeting.locationDetails.jitsiRoomId} />
    </Card>
    
    {/* Participants Panel */}
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Participants ({attendees.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {attendees.map((attendee) => (
            <div key={attendee.id} className="text-center">
              <Avatar className="w-12 h-12 mx-auto mb-1">
                <AvatarImage src={attendee.avatar} />
                <AvatarFallback>{attendee.initials}</AvatarFallback>
              </Avatar>
              <p className="text-xs font-medium truncate">{attendee.name}</p>
              <div className={cn(
                "w-2 h-2 rounded-full mx-auto mt-1",
                attendee.joined ? "bg-success" : "bg-muted"
              )} />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
  
  {/* Right: Live Notes */}
  <div className="space-y-4">
    {/* Collaborative Whiteboard */}
    <Card className="flex-1 overflow-hidden">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Pen className="h-4 w-4" />
          Live Notes
          <Badge variant="secondary" className="ml-auto">
            {collaborators.length} editing
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[400px]">
        <TldrawBoard
          boardId={meeting.whiteboardId}
          readOnly={false}
          showCollaborators={true}
        />
      </CardContent>
    </Card>
    
    {/* AI Suggestions */}
    <Card className="bg-lux-gold-soft border-lux-gold">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-lux-gold" />
          AI Detected Action Items
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {aiSuggestions.map((suggestion) => (
          <div key={suggestion.id} className="flex items-start gap-2 text-sm">
            <Checkbox id={suggestion.id} />
            <label htmlFor={suggestion.id} className="flex-1">
              {suggestion.text}
            </label>
            <Button size="sm" variant="ghost">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  </div>
</div>
```

### 8. **Minutes Completion Flow** (Streamlined)

Pre-filled form with smart defaults:

```typescript
function MinutesCompletionDialog({ meeting }: { meeting: Meeting }) {
  return (
    <Dialog>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Complete Meeting Minutes
          </DialogTitle>
          <DialogDescription>
            Review and confirm what was discussed. This is auto-filled from your agenda.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Attendance (Auto-detected from Jitsi) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">✅ Attendance</CardTitle>
              <CardDescription>
                Auto-detected from video call participants
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {meeting.participants.map((p) => (
                  <div key={p.id} className="flex items-center gap-3">
                    <Checkbox
                      id={p.id}
                      defaultChecked={p.joined}
                    />
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{p.initials}</AvatarFallback>
                    </Avatar>
                    <Label htmlFor={p.id} className="flex-1 font-normal">
                      {p.name}
                    </Label>
                    {p.joined && (
                      <Badge variant="secondary" className="text-xs">
                        Attended
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Discussed Items (From Agenda) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">💬 What Was Discussed</CardTitle>
              <CardDescription>
                Check off agenda items that were covered
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {meeting.agendaItems.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Checkbox
                      id={`agenda-${idx}`}
                      defaultChecked={true}
                    />
                    <Label
                      htmlFor={`agenda-${idx}`}
                      className="flex-1 font-normal leading-relaxed"
                    >
                      {item}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Decisions (Multi-select Pills) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">✨ Decisions Made</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {decisionOptions.map((decision) => (
                  <Badge
                    key={decision}
                    variant={selectedDecisions.includes(decision) ? "default" : "outline"}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => toggleDecision(decision)}
                  >
                    {decision}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          
          {/* Outcome (Radio Cards) */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">🎯 Meeting Outcome</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="successful" className="grid grid-cols-3 gap-3">
                {outcomeOptions.map((outcome) => (
                  <label
                    key={outcome.value}
                    className={cn(
                      "flex flex-col items-center gap-2 rounded-lg border-2 p-4",
                      "cursor-pointer transition-all hover:border-primary",
                      "has-[:checked]:border-primary has-[:checked]:bg-primary/5"
                    )}
                  >
                    <RadioGroupItem value={outcome.value} className="sr-only" />
                    <div className="text-3xl">{outcome.icon}</div>
                    <span className="font-medium text-sm">{outcome.label}</span>
                  </label>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button variant="outline">Save Draft</Button>
          <Button className="btn-gold-lux">
            Complete Minutes & Create Actions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 🎭 Micro-interactions

### Pulse Animation for Urgent Meetings

```css
@keyframes urgent-pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.urgent-meeting {
  animation: urgent-pulse 2s ease-in-out infinite;
}
```

### Shimmer Effect on Hover

```typescript
<Card className="relative overflow-hidden group">
  <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full 
                  transition-transform duration-1000 ease-out
                  bg-gradient-to-r from-transparent via-white/10 to-transparent" />
  {/* Card content */}
</Card>
```

### Confetti on Meeting Completion

```typescript
import confetti from 'canvas-confetti';

function handleMinutesComplete() {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#D4AF37', '#FFD700', '#FFA500'], // Gold theme
  });
  
  toast.success('Minutes completed! Actions are being created...', {
    icon: '✨',
    duration: 5000,
  });
}
```

---

## 📊 Data Visualization Components

### Meeting Density Chart

```typescript
<ChartContainer config={chartConfig} className="h-[200px]">
  <AreaChart data={meetingDensityData}>
    <defs>
      <linearGradient id="meetingGradient" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8}/>
        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0}/>
      </linearGradient>
    </defs>
    <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
    <XAxis dataKey="date" />
    <Area
      type="monotone"
      dataKey="count"
      stroke="var(--primary)"
      fillOpacity={1}
      fill="url(#meetingGradient)"
    />
    <ChartTooltip content={<ChartTooltipContent />} />
  </AreaChart>
</ChartContainer>
```

### Completion Rate Radial Chart

```typescript
<ChartContainer config={radialConfig} className="h-[200px]">
  <RadialBarChart data={completionData} innerRadius="60%" outerRadius="100%">
    <RadialBar
      dataKey="value"
      fill="var(--success)"
      background
      cornerRadius={10}
    />
    <ChartTooltip content={<ChartTooltipContent />} />
  </RadialBarChart>
</ChartContainer>
```

---

## 🎯 Mobile Responsiveness

### Mobile-First Meeting Card

```typescript
<Card className="card-glow-lux">
  <CardContent className="p-0">
    {/* Header */}
    <div className="p-4 bg-lux-surface">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {getMeetingIcon(meeting.type)}
              <span className="ml-1">{meeting.type}</span>
            </Badge>
            {meeting.needsMinutes && (
              <Badge variant="destructive" className="text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                Action Required
              </Badge>
            )}
          </div>
          <h3 className="font-semibold text-base truncate">
            {meeting.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {meeting.caseId}
          </p>
        </div>
        <Button size="sm" variant="ghost" className="shrink-0">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
    </div>
    
    {/* Metadata */}
    <div className="p-4 space-y-3">
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{formatRelative(meeting.scheduledStart)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{meeting.duration}m</span>
        </div>
      </div>
      
      {/* Participants (Compact) */}
      <div className="flex items-center gap-2">
        <div className="flex -space-x-2">
          {meeting.participants.slice(0, 3).map((p) => (
            <Avatar key={p.id} className="h-6 w-6 border-2 border-background">
              <AvatarFallback className="text-xs">{p.avatar}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        <span className="text-xs text-muted-foreground">
          {meeting.participants.length} participant(s)
        </span>
      </div>
    </div>
    
    {/* Actions */}
    <div className="p-4 pt-0 flex gap-2">
      <Button size="sm" variant="outline" className="flex-1">
        View Details
      </Button>
      <Button size="sm" className="flex-1 btn-gold-lux">
        {meeting.type === 'video' ? 'Join' : 'Start'}
      </Button>
    </div>
  </CardContent>
</Card>
```

---

## 🔧 Implementation Priority

### Phase 1: Foundation (Week 1-2)
- ✅ Timeline view with grouped meetings
- ✅ Enhanced meeting cards with luxury styling
- ✅ Floating action bar
- ✅ Vertical tabs layout for detail page

### Phase 2: Smart Features (Week 3-4)
- ✅ Calendar heatmap
- ✅ MagicToDo sheet with visual task types
- ✅ Smart minutes completion flow
- ✅ AI-powered suggestions

### Phase 3: Polish & Real-time (Week 5-6)
- ✅ Live meeting experience with split-pane
- ✅ Collaborative notes integration (tldraw)
- ✅ WebSocket for real-time updates
- ✅ Micro-interactions and animations

### Phase 4: Analytics & Optimization (Week 7-8)
- ✅ Meeting density charts
- ✅ Completion rate metrics
- ✅ Performance optimization
- ✅ Mobile responsiveness refinement

---

## 📚 Component Library Reference

### From shadcn Blocks to Use

```typescript
// Calendar widgets
import Calendar from '@/lib/ui/Blocks-shadcn/calendar-01';

// Data tables for past meetings
import DataTable from '@/lib/ui/Blocks-shadcn/data-table';

// Charts for analytics
import { AreaChart } from '@/lib/ui/Blocks-shadcn/chart-area-interactive';
import { RadialChart } from '@/lib/ui/Blocks-shadcn/chart-radial-text';

// Command palette for quick actions
import CommandPalette from '@/lib/ui/Blocks-shadcn/command-demo';
```

### Custom Components to Build

```
app/components/consultations/
  ├── timeline-view.tsx           # Smart timeline grouping
  ├── meeting-card-enhanced.tsx   # Luxury meeting cards
  ├── floating-action-bar.tsx     # Context-aware actions
  ├── calendar-heatmap.tsx        # Activity visualization
  ├── vertical-tabs.tsx           # Space-efficient tabs
  ├── magic-todo-sheet.tsx        # Quick action creation
  ├── case-trail-timeline.tsx     # Visual history
  ├── live-meeting-room.tsx       # Enhanced meeting experience
  ├── minutes-completion.tsx      # Streamlined minutes
  └── ai-suggestions-panel.tsx    # Smart recommendations
```

---

## 🎨 Design Tokens Usage

```typescript
// Color system
const meetingColors = {
  upcoming: 'hsl(var(--info))',
  inProgress: 'hsl(var(--warn))',
  completed: 'hsl(var(--success))',
  needsAttention: 'hsl(var(--danger))',
};

// Spacing system (consistent rhythm)
const spacing = {
  cardGap: 'var(--layout-gap)',
  sectionPy: 'var(--layout-section-py)',
  containerMax: 'var(--layout-container-max)',
};

// Motion system
const motion = {
  fast: 'var(--ax-motion-fast)',
  base: 'var(--ax-motion-base)',
  slow: 'var(--ax-motion-slow)',
};
```

---

## 🚀 Next Steps

1. **Copy shadcn blocks** to `app/components/consultations/blocks/`
2. **Implement timeline view** as primary interface
3. **Build MagicToDo sheet** with visual task type cards
4. **Integrate tldraw** for live collaborative notes
5. **Add AI suggestions panel** for action item detection
6. **Implement case trail timeline** with phase grouping
7. **Polish micro-interactions** with luxury utilities
8. **Test mobile responsiveness** and optimize

---

*This redesign transforms the consultations system from a basic meeting scheduler into a powerful, intelligent workflow tool that guides users through the entire meeting lifecycle with luxury and sophistication.*
