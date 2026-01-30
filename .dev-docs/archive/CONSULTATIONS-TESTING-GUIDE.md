# Quick Testing Guide — Phase 1

> Test the new consultations UI in your browser

---

## 🚀 Start Testing (2 minutes)

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Open Browser
```
http://localhost:3000/app/consultations
```

### Step 3: What You Should See

```
┌────────────────────────────────────────────────────────────┐
│  🎯 Consultations & Meetings         [+ New Meeting]       │
├────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─ 4 KPI Cards ────────────────────────────────────────┐ │
│  │  [🔴 3 Needs]  [📅 12 Week]  [✅ 48 Q]  [⏱️ 2h 30m]  │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌─ Today • Thu Jan 29 ─────────┐  ┌─ Calendar Heatmap─┐ │
│  │                               │  │                    │ │
│  │  [RED PULSING CARD]          │  │  [35 squares]      │ │
│  │  9:00 AM - Q1 Budget         │  │  showing density   │ │
│  │  ⚠️ Starting in 5 minutes    │  │                    │ │
│  │  [Join Now] ← GOLD BUTTON    │  └────────────────────┘ │
│  │                               │                         │
│  │  [BLUE CARD]                 │  ┌─ Needs Minutes ───┐ │
│  │  2:00 PM - Product Planning  │  │  3 meetings        │ │
│  │  [In 5 hours]                │  │  listed compactly  │ │
│  │                               │  └────────────────────┘ │
│  │  Tomorrow • Fri Jan 30        │                         │
│  │  [CARD]                       │                         │
│  │  10:00 AM - Sprint Planning   │                         │
│  └───────────────────────────────┘                         │
└────────────────────────────────────────────────────────────┘
```

---

## ✅ Feature Checklist

### KPI Dashboard (Top)
- [ ] See 4 metric cards
- [ ] First card is RED (3 Needs Minutes)
- [ ] Second card shows "12 This Week"
- [ ] Third card shows "+12% vs last Q" trend
- [ ] Cards have subtle glow on hover

### Timeline View (Left)
- [ ] See "Today" section header
- [ ] First meeting has RED accent bar
- [ ] First meeting is PULSING (animate-pulse)
- [ ] Time badge shows "9:00 AM"
- [ ] See "Join Now" button (gold with shimmer)
- [ ] See proximity alert: "⚠️ Starting in 5 minutes"
- [ ] See "Tomorrow" section below
- [ ] Participant avatars visible

### Calendar Heatmap (Right)
- [ ] See 35 squares in 7×5 grid
- [ ] Different color intensities
- [ ] Hover shows tooltip with date
- [ ] Squares scale up on hover
- [ ] Legend shows: 0-1, 2-3, 4-5, 6+

### Needs Minutes Sidebar (Right)
- [ ] See compact list of 3 meetings
- [ ] Each shows title and case ID
- [ ] Clickable to complete minutes

---

## 🎨 Visual Tests

### Hover Effects
1. **Hover over KPI card**
   - Should see gold glow around edges
   - Subtle lift effect

2. **Hover over meeting card**
   - Gold glow appears
   - Card lifts slightly
   - Smooth transition

3. **Hover over heatmap square**
   - Square scales up (1.1x)
   - Ring appears
   - Tooltip shows

### Colors
- 🔴 Red: Urgent meeting (5 min) + Needs Minutes
- 🟡 Amber: Starting soon (30 min)
- 🔵 Blue: Upcoming (2 hours)
- 🟢 Green: Completed this quarter
- 🟡 Gold: Primary actions (Join Now, New Meeting)

### Animations
- ⚡ **Pulse**: First meeting (5 min urgency)
- ✨ **Shimmer**: "Join Now" button
- 🎭 **Scale**: Heatmap cells on hover
- 💫 **Glow**: All cards on hover

---

## 📱 Responsive Tests

### Desktop (> 1024px)
- [ ] 4 KPI cards in one row
- [ ] Timeline takes 2/3 width
- [ ] Sidebar takes 1/3 width

### Tablet (768-1024px)
- [ ] 2 KPI cards per row
- [ ] Timeline and sidebar stack

### Mobile (< 768px)
- [ ] 1 KPI card per column
- [ ] Timeline full width
- [ ] Sidebar below timeline

---

## 🎯 Interaction Tests

### Click Tests
1. **Click "Join Now"**
   - Opens console log
   - Shows meeting ID

2. **Click "Add Minutes"**
   - Opens meeting flow dialog
   - Shows step 1 (Agenda)

3. **Click meeting card**
   - Card gets primary border
   - Selected state visible

4. **Click heatmap cell**
   - Tooltip persists
   - No navigation (tooltip only)

### Button Tests
1. **"New Meeting"** (top right)
   - Opens meeting flow dialog
   - Gold styling visible

2. **"Join Now"** (urgent card)
   - Gold with shimmer effect
   - Has Zap icon

3. **"Add Minutes"** (completed card)
   - Red/danger styling
   - Has FileCheck icon

---

## 🌓 Dark Mode Test

1. Toggle theme (if available)
2. Check:
   - [ ] Cards readable
   - [ ] Accent colors visible
   - [ ] Glow effects work
   - [ ] Text contrast good

---

## ⚡ Performance Tests

### Load Time
- [ ] Page loads in < 2 seconds
- [ ] No flash of unstyled content
- [ ] Smooth initial render

### Animations
- [ ] No jank (maintain 60fps)
- [ ] Pulse animation smooth
- [ ] Hover transitions fluid
- [ ] No layout shifts

---

## 🐛 Edge Cases to Test

### Long Text
1. Try meeting with very long title
2. Should truncate gracefully

### Many Participants
1. Check meeting with 10+ participants
2. Should show "+N more" text

### No Meetings
1. Clear search to show empty state
2. Should see empty state message

### All Meetings Need Minutes
1. Check KPI card turns red
2. Alert banner shows

---

## 📸 Screenshots to Take

Recommended screenshots for documentation:

1. **Full page view** (shows all sections)
2. **Urgent meeting card** (red, pulsing)
3. **Hover state** (gold glow visible)
4. **Heatmap** (with tooltip)
5. **KPI cards** (all 4 visible)
6. **Mobile view** (responsive layout)

---

## ✅ Quick Pass/Fail

**PASS Criteria:**
- ✅ All visual elements render
- ✅ Colors match design tokens
- ✅ Hover effects work
- ✅ No console errors
- ✅ Responsive layout works
- ✅ Animations smooth

**FAIL Indicators:**
- ❌ Layout broken
- ❌ Missing components
- ❌ Console errors
- ❌ Hover not working
- ❌ Animations janky

---

## 🆘 Troubleshooting

### Issue: Styles not loading
**Fix:**
```bash
# Restart dev server
npm run dev
```

### Issue: Components not found
**Fix:**
Check imports in `page.tsx`:
```typescript
import { QuickStatsBar } from '@/app/components/consultations/quick-stats-bar';
import { TimelineView } from '@/app/components/consultations/timeline-view';
import { CalendarHeatmap } from '@/app/components/consultations/calendar-heatmap';
```

### Issue: Luxury classes not working
**Fix:**
Check `globals.css` has:
```css
@import "./styles/luxury.utilities.css";
```

### Issue: TypeScript errors
**Fix:**
```bash
npm run type-check
```

---

## 🎉 Success!

If you can check off all the boxes above, Phase 1 is working perfectly!

**Next:** Ready for Phase 2? Continue with enhanced detail page implementation.

---

*Testing guide v1.0 — January 29, 2026*
