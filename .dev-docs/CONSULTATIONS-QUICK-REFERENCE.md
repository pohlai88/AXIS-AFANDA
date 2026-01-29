# Consultations Redesign — Quick Reference Card

> One-page guide to navigate the redesign docs

---

## 📚 Document Map

| Document                                                          | Lines | Purpose           | When to Use                          |
| ----------------------------------------------------------------- | ----- | ----------------- | ------------------------------------ |
| [**REDESIGN-SUMMARY**](CONSULTATIONS-REDESIGN-SUMMARY.md)         | 650   | Overview & impact | **START HERE** — Get the big picture |
| [**UI-REDESIGN**](CONSULTATIONS-UI-REDESIGN.md)                   | 1,200 | Design details    | Need design patterns & principles    |
| [**COMPONENT-EXAMPLES**](CONSULTATIONS-COMPONENT-EXAMPLES.tsx)    | 650   | Copy-paste code   | Ready to implement components        |
| [**IMPLEMENTATION-GUIDE**](CONSULTATIONS-IMPLEMENTATION-GUIDE.md) | 1,000 | Step-by-step      | Following a structured approach      |
| [**VISUAL-MOCKUPS**](CONSULTATIONS-VISUAL-MOCKUPS.md)             | 900   | ASCII mockups     | Need to visualize final product      |

**Total:** 4,400+ lines of production-ready documentation

---

## 🎯 Quick Navigation

### "I want to understand what changed"
→ Read: **REDESIGN-SUMMARY.md** (Sections: Key Innovations, Design System Integration)

### "I want to see how it looks"
→ Read: **VISUAL-MOCKUPS.md** (All sections)

### "I want to start coding"
→ Read: **COMPONENT-EXAMPLES.tsx** + **IMPLEMENTATION-GUIDE.md** (Phase 1)

### "I need design patterns"
→ Read: **UI-REDESIGN.md** (Sections: Design System Integration, Key Innovations)

### "I need mobile layouts"
→ Read: **VISUAL-MOCKUPS.md** (Section: Mobile View)

### "I need color/spacing reference"
→ Read: **UI-REDESIGN.md** (Section: Design System Integration)  
→ Also: `app/globals.css` and `app/styles/luxury.utilities.css`

---

## 🚀 Implementation Fast Track

### Option 1: Weekend Sprint (2 days)

**Day 1 (4-6 hours):**
```
1. Copy TimelineView component (30min)
2. Copy QuickStatsBar component (30min)
3. Update main page layout (1hr)
4. Apply luxury styling to cards (1hr)
5. Test responsiveness (1hr)
```

**Day 2 (4-6 hours):**
```
1. Copy MagicTodoSheet component (1hr)
2. Add floating action bar (1hr)
3. Implement calendar heatmap (1hr)
4. Polish animations (1hr)
5. Mobile testing (1hr)
```

**Result:** Core features live with luxury design

---

### Option 2: One Week Sprint (5 days)

**Mon:** Foundation (Timeline + Stats)  
**Tue:** Enhanced cards + Heatmap  
**Wed:** MagicToDo + Floating bar  
**Thu:** Detail page (Vertical tabs)  
**Fri:** Polish + Testing

**Result:** Full redesign implemented

---

### Option 3: Two Week Sprint (10 days)

**Week 1:** Foundation + Smart features  
**Week 2:** Detail page + Polish + Testing

**Result:** Production-ready with all innovations

---

## 🎨 Design Token Quick Reference

```typescript
// Status Colors
'var(--info)'      // Blue - upcoming
'var(--warn)'      // Amber - starting soon
'var(--danger)'    // Red - urgent
'var(--success)'   // Green - completed

// Luxury Classes
'card-glow-lux'           // Gold glow on hover
'bg-lux-surface'          // Sheen effect
'shadow-lux'              // Soft shadow
'btn-gold-lux'            // Shimmer button
'text-hero-lux'           // Hero typography

// Layout
'var(--layout-gap)'           // 1.5rem
'var(--layout-section-py)'    // clamp(3rem, 6vw, 5rem)
'var(--layout-container-max)' // 80rem

// Motion
'duration-lux-fast'  // 150ms
'duration-lux-base'  // 250ms
'duration-lux-slow'  // 350ms
```

---

## 📦 Component Inventory

### Ready to Copy (COMPONENT-EXAMPLES.tsx)

| Component               | Lines | Purpose                                   |
| ----------------------- | ----- | ----------------------------------------- |
| `TimelineView`          | 120   | Smart date grouping with proximity alerts |
| `QuickStatsBar`         | 80    | KPI dashboard with metrics                |
| `CalendarHeatmap`       | 60    | Activity visualization                    |
| `MagicTodoSheet`        | 150   | Quick action creation                     |
| `MinutesCompletionCard` | 80    | Streamlined minutes                       |

**Total:** 490 lines of production code

### To Build (from shadcn blocks)

| Component            | Source         | Purpose               |
| -------------------- | -------------- | --------------------- |
| `FloatingActionBar`  | Custom         | Context-aware actions |
| `VerticalTabs`       | Custom         | Space-efficient tabs  |
| `CaseTrailTimeline`  | Custom         | Visual history        |
| `AISuggestionsPanel` | Custom         | Smart recommendations |
| `LiveMeetingRoom`    | Custom + Jitsi | Enhanced experience   |

---

## 🎭 Key Patterns

### Proximity-Based Styling
```typescript
const minutesUntil = differenceInMinutes(scheduledStart, new Date());

if (minutesUntil <= 5) return 'bg-danger animate-pulse';
if (minutesUntil <= 30) return 'bg-warn';
if (minutesUntil <= 120) return 'bg-info';
return 'bg-muted';
```

### Luxury Card Pattern
```tsx
<Card className="card-glow-lux bg-lux-surface shadow-lux hover:shadow-lux-strong">
  {/* Content */}
</Card>
```

### Floating Action Bar
```tsx
<div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 
                animate-in slide-in-from-bottom">
  <Card className="bg-lux-surface/95 backdrop-blur-lg shadow-lux-strong">
    {/* Actions */}
  </Card>
</div>
```

### Timeline Grouping
```typescript
const grouped = meetings.reduce((acc, meeting) => {
  const dateKey = format(meeting.scheduledStart, 'yyyy-MM-dd');
  const label = isToday(meeting.scheduledStart) 
    ? `Today • ${format(meeting.scheduledStart, 'EEE MMM d')}`
    : format(meeting.scheduledStart, 'PPP');
  
  if (!acc[dateKey]) acc[dateKey] = { label, meetings: [] };
  acc[dateKey].meetings.push(meeting);
  return acc;
}, {});
```

---

## ✅ Pre-Flight Checklist

Before starting implementation:

- [ ] Read **REDESIGN-SUMMARY.md** (understand impact)
- [ ] Review **VISUAL-MOCKUPS.md** (see final product)
- [ ] Check `app/globals.css` (understand tokens)
- [ ] Review `AGENTS.md` (project conventions)
- [ ] Explore `lib/ui/Blocks-shadcn/` (available blocks)
- [ ] Test existing consultations page (baseline)

Ready to code:

- [ ] TypeScript configured
- [ ] shadcn/ui installed
- [ ] Tailwind v4 working
- [ ] Development server running
- [ ] Component folder created

---

## 🐛 Common Issues

### Issue: "Luxury classes not working"
**Solution:** Import in `globals.css`:
```css
@import "./styles/luxury.utilities.css";
```

### Issue: "Timeline not grouping correctly"
**Solution:** Check date formatting:
```typescript
const dateKey = format(meeting.scheduledStart, 'yyyy-MM-dd');
```

### Issue: "Cards not hovering smoothly"
**Solution:** Add transition:
```tsx
className="card-glow-lux transition-all duration-lux-base"
```

### Issue: "Mobile layout broken"
**Solution:** Use responsive classes:
```tsx
className="grid grid-cols-1 lg:grid-cols-2 gap-6"
```

---

## 📞 Need Help?

### Documentation
1. Check this quick reference first
2. Search IMPLEMENTATION-GUIDE.md for your topic
3. Look at COMPONENT-EXAMPLES.tsx for code
4. Review VISUAL-MOCKUPS.md for layout

### Project Resources
- Design tokens: `app/globals.css`
- Luxury utilities: `app/styles/luxury.utilities.css`
- Project patterns: `AGENTS.md`
- Architecture: `.dev-docs/PROJECT-SPEC.md`

### shadcn Blocks
- Library: `lib/ui/Blocks-shadcn/`
- Available: `.dev-docs/AVAILABLE-BLOCKS-SUMMARY.md`
- Guide: `.dev-docs/BLOCKS-MIX-MATCH-GUIDE.md`

---

## 🎯 Success Checklist

After implementation:

### Functionality
- [ ] Timeline groups by date
- [ ] Proximity alerts work
- [ ] KPI stats accurate
- [ ] Heatmap reflects activity
- [ ] MagicToDo creates tasks
- [ ] Minutes save correctly
- [ ] Case trail shows history

### UX
- [ ] Cards hover smoothly
- [ ] Loading states show
- [ ] Errors display helpful messages
- [ ] Empty states guide users
- [ ] Mobile nav intuitive
- [ ] Keyboard navigation works

### Design
- [ ] Luxury effects applied
- [ ] Colors match system
- [ ] Typography hierarchy clear
- [ ] Spacing consistent
- [ ] Animations smooth
- [ ] Dark mode works

### Performance
- [ ] Load time < 2s
- [ ] Animations 60fps
- [ ] Lazy loading works
- [ ] Images optimized
- [ ] No layout shifts

---

## 📊 Metrics to Track

### User Experience
- Meeting minutes completion rate (target: 100%)
- Time to complete minutes (target: <5min)
- Tasks created via MagicToDo (target: 90%)
- User satisfaction (target: 9/10)

### Technical
- Page load time (target: <2s)
- Mobile usage (target: 40%+)
- Accessibility score (target: 95+)
- Error rate (target: <1%)

---

## 🚀 Start Here

1. Read **REDESIGN-SUMMARY.md** (10min)
2. Review **VISUAL-MOCKUPS.md** (15min)
3. Copy first component from **COMPONENT-EXAMPLES.tsx** (30min)
4. Test and iterate

**Total time to first working feature: ~1 hour**

---

*Keep this reference handy while implementing. Good luck! 🎉*
