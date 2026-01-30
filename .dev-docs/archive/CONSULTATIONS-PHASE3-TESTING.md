# Phase 3 Testing Guide — Enhanced Detail Page

> Test the vertical tabs, live meeting room, and case trail features

---

## 🚀 Quick Test (5 minutes)

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Navigate to Meeting Detail
```
1. Go to: http://localhost:3000/app/consultations
2. Click any meeting card in the timeline
3. OR go directly to: http://localhost:3000/app/consultations/1
```

### Step 3: Test Features

---

## ✅ Feature 1: Vertical Tabs Navigation

### Visual Check:
Look at the **left sidebar** (80px wide):
- [ ] 5 icon buttons stacked vertically
- [ ] 🎥 Room (with 🔴 badge)
- [ ] 📋 Plan
- [ ] ✏️ Minutes (with ! badge)
- [ ] ✅ Actions
- [ ] 🔗 Trail
- [ ] First tab (Room) is active (gold background)

### Interactions:
1. **Hover over each tab:**
   - [ ] Tooltip appears with full label
   - [ ] Icon scales slightly (105%)
   - [ ] Background changes to muted
   
2. **Click each tab:**
   - [ ] Active tab gets gold background + shadow
   - [ ] Content area changes immediately
   - [ ] Previous tab deactivates
   - [ ] Smooth transition (no flash)

3. **Keyboard navigation:**
   - [ ] Tab key focuses tabs
   - [ ] Focus ring visible (blue outline)
   - [ ] Enter/Space activates tab

### Badge Checks:
- [ ] Room tab has 🔴 emoji (meeting in-progress)
- [ ] Minutes tab has red "!" badge
- [ ] Actions tab has no badge (0 actions)
- [ ] Badges positioned top-right of icon

---

## ✅ Feature 2: Live Meeting Room (Room Tab)

### Layout Check:
- [ ] Split into 2 columns on desktop
- [ ] Left: Video interface + participants
- [ ] Right: Notes + AI suggestions
- [ ] Stacks vertically on mobile

### Left Column:

#### Video Interface Card:
- [ ] Black background (aspect-video)
- [ ] Video camera icon centered
- [ ] "Video Conference Room" title
- [ ] Description text below
- [ ] **"Join Video Meeting"** button (GOLD, prominent)
- [ ] "Open in new window" link below
- [ ] Status badge top-right ("in-progress")

**Test Join Button:**
- [ ] Click "Join Video Meeting"
- [ ] Console logs meeting ID
- [ ] Button has gold shimmer effect

#### Participants Panel:
- [ ] Card titled "👥 Participants (3)"
- [ ] Badge shows "2 joined"
- [ ] 3 avatars in grid (3 columns)
- [ ] Sarah Chen - SC - green dot (joined)
- [ ] Mike Johnson - MJ - green dot (joined)
- [ ] Emma Wilson - EW - gray dot (not joined)
- [ ] Names and roles display
- [ ] Avatars have border

### Right Column:

#### Collaborative Notes Card:
- [ ] Card titled "Live Notes"
- [ ] Badge shows "2 editing" with users icon
- [ ] Dashed border placeholder area
- [ ] Pen icon centered
- [ ] "Collaborative Whiteboard" title
- [ ] "Integration coming soon" message
- [ ] Board ID badge at bottom

#### AI Suggestions Panel:
- [ ] Gold card background
- [ ] Sparkles icon in header
- [ ] "AI Detected Action Items" title
- [ ] Loading spinner shows first (1.5s)
- [ ] Then 3 suggestions appear:
  1. "Submit budget approval request → Sarah Chen"
  2. "Post job listings for 2 developers → Mike Johnson"
  3. "Update product roadmap"
- [ ] Each has checkbox + text + "+" button
- [ ] Hover highlights row

**Test AI Suggestions:**
- [ ] Click checkbox → checks/unchecks
- [ ] Click "+" button → console logs
- [ ] Multiple checkboxes can be selected

### Alert Box:
- [ ] Blue info alert at bottom left
- [ ] "Active Meeting" title
- [ ] "Notes and AI suggestions are being captured..." text

---

## ✅ Feature 3: Agenda/Plan Tab

### Access:
- [ ] Click second tab icon (📋)
- [ ] Content switches to Plan view

### Agenda Section:
- [ ] Card titled "📋 Meeting Agenda"
- [ ] 3 agenda items in list:
  1. Budget Review
  2. Timeline Discussion
  3. Resource Planning
- [ ] Each has numbered circle (1, 2, 3)
- [ ] Background: muted gray

### Participants Section:
- [ ] Card titled "👥 Participants"
- [ ] 3 rows, each with:
  - Avatar (SC, MJ, EW)
  - Name
  - Role (CFO, CEO, Manager)
  - "Joined" badge (if applicable)
- [ ] Gray background on each row

---

## ✅ Feature 4: Minutes Tab

### Access:
- [ ] Click third tab icon (✏️)
- [ ] Notice "!" badge (minutes not complete)

### Content:
- [ ] Large card centered
- [ ] FileText icon (document)
- [ ] "Minutes Not Yet Completed" title
- [ ] Explanation text
- [ ] **Gold "Complete Minutes" button**
- [ ] Button has FileText icon

**Test Button:**
- [ ] Click "Complete Minutes"
- [ ] Button has gold shimmer effect
- [ ] (Currently placeholder - no action)

---

## ✅ Feature 5: Actions Tab

### Access:
- [ ] Click fourth tab icon (✅)
- [ ] Badge shows nothing (0 actions)

### Content:
- [ ] Large card centered
- [ ] CheckSquare icon
- [ ] "No Actions Yet" title
- [ ] "Actions from meeting minutes..." text
- [ ] "Create Action" button (outline style)

**If there were actions:**
- Would show cards with:
  - Priority badge
  - Type badge
  - Status badge
  - Title
  - Assignee
  - Due date
  - "Update Status" button

---

## ✅ Feature 6: Case Trail Tab

### Access:
- [ ] Click fifth tab icon (🔗)
- [ ] Content switches to Case Trail

### Header:
- [ ] "🔗 Case Trail: CASE-2024-001" title (2xl, bold)
- [ ] "Complete history..." subtitle (muted)

### Timeline Structure:
Should see **3 phases** with events:

#### 🟢 Present Phase:
- [ ] Badge: "🟢 Present" (gold/default variant)
- [ ] Horizontal separator line
- [ ] **Event 1: Meeting started**
  - Blue dot with calendar icon
  - "Meeting started: Q1 Budget Review"
  - "by System • 1 hour ago"
  - "meeting" badge (outline)
  - Card has glow effect
  - "View" button

#### ⏪ Past Phase:
- [ ] Badge: "⏪ Past" (secondary variant)
- [ ] **Event 2: Budget proposal approved**
  - Amber dot with trending up icon
  - "Budget proposal approved by CEO"
  - "by Mike Johnson • 1 day ago"
  - "approval" badge
  - Metadata section showing:
    - Amount: $50,000
    - Department: Engineering
  - "View" button
- [ ] **Event 3: Meeting scheduled**
  - Blue dot with calendar icon
  - "Meeting scheduled: Q1 Budget Review"
  - "by System • 2 days ago"
  - "meeting" badge

#### ⏩ Future Phase:
- [ ] Badge: "⏩ Future" (outline variant)
- [ ] **Event 4: Follow-up scheduled**
  - Green dot with checkmark icon
  - "Follow-up meeting scheduled"
  - "by Sarah Chen • in 1 day"
  - "task" badge

### Visual Effects:
- [ ] Vertical timeline line on left (2px, gray)
- [ ] Colored dots positioned on line
- [ ] Cards have hover effect (stronger shadow)
- [ ] Dots scale on hover (110%)
- [ ] Smooth transitions

---

## 🎨 Visual Quality Checks

### Color Coding:
- [ ] Room badge: 🔴 (active red)
- [ ] Minutes badge: Red ! (danger)
- [ ] Join dots: Green (success) / Gray (muted)
- [ ] AI card: Gold background
- [ ] Buttons: Gold primary, outline secondary
- [ ] Event dots: Blue (meeting), Amber (approval), Green (task)

### Luxury Effects:
- [ ] Active tab has shadow
- [ ] Tabs scale on hover/active
- [ ] Cards have glow on hover
- [ ] Gold buttons have shimmer
- [ ] Smooth transitions everywhere (250ms)
- [ ] No jank or stutter

### Typography:
- [ ] Headers bold and clear
- [ ] Body text readable (14px)
- [ ] Muted text lighter
- [ ] Icons aligned with text
- [ ] No text overflow

---

## 📱 Responsive Checks

### Desktop (> 1024px):
- [ ] Vertical tabs visible (80px)
- [ ] Live room: 2 columns
- [ ] All content readable
- [ ] No horizontal scroll
- [ ] Hover effects work

### Tablet (768-1024px):
- [ ] Vertical tabs still visible
- [ ] Live room stacks or 2 columns
- [ ] Touch targets adequate
- [ ] Scrolling smooth

### Mobile (< 768px):
- [ ] Vertical tabs visible (or horizontal?)
- [ ] Live room stacks vertically
- [ ] Buttons full width
- [ ] Text readable
- [ ] No tiny touch targets

---

## 🐛 Edge Cases to Test

### 1. Tab Switching Speed:
- [ ] Click tabs rapidly
- [ ] No lag or freeze
- [ ] Content updates immediately
- [ ] No memory leaks

### 2. Long Content:
- [ ] Scroll in each tab
- [ ] Tabs sidebar stays fixed
- [ ] Header stays visible
- [ ] Smooth scrolling

### 3. AI Suggestions Loading:
- [ ] Loads within 1.5 seconds
- [ ] Spinner visible during load
- [ ] No flash of content
- [ ] Transitions smooth

### 4. Empty States:
- [ ] Actions tab shows empty state
- [ ] Minutes tab shows prompt
- [ ] No broken layouts

### 5. Console Logs:
```javascript
// Expected logs:
- "Joining meeting: 1" (when clicking Join)
- "Add task from AI suggestion: {...}" (when clicking +)
- No error messages
- No warnings
```

---

## ⚡ Performance Checks

### Load Time:
- [ ] Page loads < 2 seconds
- [ ] Tabs switch instantly (< 100ms)
- [ ] No layout shift
- [ ] Images/icons load fast

### Animations:
- [ ] Tab transitions smooth (60fps)
- [ ] Hover effects responsive
- [ ] Scale animations clean
- [ ] No stuttering

### Memory:
- [ ] Switch tabs 20x → no slowdown
- [ ] Open/close page 10x → no leaks
- [ ] DevTools shows stable memory

---

## ✅ Success Checklist

**Pass if ALL checked:**
- [ ] Vertical tabs visible and clickable
- [ ] All 5 tabs functional
- [ ] Live meeting room shows video interface
- [ ] Participants panel shows join status
- [ ] AI suggestions load and display
- [ ] Case trail shows phased timeline
- [ ] Event dots colored correctly
- [ ] Badges show on tabs
- [ ] Gold buttons have shimmer
- [ ] Hover effects smooth
- [ ] Tooltips appear
- [ ] No console errors
- [ ] Responsive on mobile
- [ ] Dark mode works
- [ ] Keyboard accessible

---

## 🆘 Common Issues

### Issue: Tabs not showing
**Cause:** Import error or layout issue
**Fix:** Check `VerticalTabsNav` import and `flex` layout

### Issue: AI panel always loading
**Cause:** Timer not clearing
**Fix:** Check `useEffect` cleanup in `ai-suggestions-panel.tsx`

### Issue: Case trail empty
**Cause:** No events data
**Fix:** Check `mockCaseTrail.events` array has items

### Issue: Join dots not showing
**Cause:** Missing `joined` property
**Fix:** Add `joined: true/false` to participant objects

### Issue: Tooltips not appearing
**Cause:** `TooltipProvider` not wrapping
**Fix:** Check `VerticalTabsNav` has `TooltipProvider`

### Issue: Badges not positioned correctly
**Cause:** CSS positioning
**Fix:** Check `absolute` positioning on badge

---

## 📸 Screenshot Checklist

Take these for documentation:

1. **Vertical tabs** (all 5 tabs with badges)
2. **Room tab** (split-pane with video + notes)
3. **Participants panel** (with join dots)
4. **AI suggestions** (gold card with items)
5. **Case trail** (all 3 phases visible)
6. **Timeline dots** (colored dots on line)
7. **Mobile view** (stacked layout)
8. **Hover states** (tab hover, card hover)

---

## 🎉 Phase 3 Test Results

### If all checks pass:
✅ **Vertical Tabs Navigation** — Working  
✅ **Live Meeting Room** — Working  
✅ **Participants Panel** — Working  
✅ **AI Suggestions** — Working  
✅ **Case Trail Timeline** — Working  
✅ **Detail Page Integration** — Working  
✅ **No Errors** — Clean  
✅ **Design Consistency** — Perfect  

**Phase 3 is production-ready!** 🚀

### If issues found:
1. Check console for errors
2. Verify imports correct
3. Review mock data structure
4. Test in different browsers
5. Check responsive breakpoints

---

## 🎯 Quick Navigation Test

**2-Minute Speed Test:**
```
1. Load detail page
2. Click through all 5 tabs
3. Hover over elements
4. Click join button
5. Check console for errors
```

**Expected:** No errors, smooth transitions, all features visible

---

*Testing guide v3.0 — January 29, 2026*
*Phase 3 features: Vertical Tabs + Live Meeting + Case Trail*
