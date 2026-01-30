# Phase 2 Testing Guide — New Features

> Test the floating action bar and MagicToDo sheet

---

## 🚀 Quick Test (5 minutes)

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Navigate
```
http://localhost:3000/app/consultations
```

### Step 3: Test Features

---

## ✅ Feature 1: Floating Action Bar

### Test Flow:
1. **Click any meeting card** in the timeline
2. Look at **bottom center** of screen
3. Should see floating bar slide up

### What to Check:
- [ ] Bar appears at bottom center
- [ ] Shows meeting title ("Q1 Budget Review" or selected)
- [ ] Shows case ID (CASE-2024-XXX)
- [ ] Has meeting icon (🎥 or 📍)
- [ ] "View Case" button visible
- [ ] "Join Meeting" button is GOLD
- [ ] X button in top right
- [ ] Backdrop blur visible (glass effect)
- [ ] Gold border accent

### Interactions:
- [ ] Click "Join Meeting" → console logs meeting ID
- [ ] Click "View Case" → console logs meeting ID
- [ ] Click X → bar disappears
- [ ] Click another meeting → bar updates

### Visual Check:
```
Bottom of screen:
┌──────────────────────────────────────────────────┐
│  [🎥]  Q1 Budget Review                          │
│        CASE-2024-001                             │
│  │  [View Case]  [Join Meeting]  [×]            │
└──────────────────────────────────────────────────┘
 ^                                                  ^
 Gold border                            Gold button
```

---

## ✅ Feature 2: MagicToDo Sheet

### Finding the Button:
Look for the **"Marketing Strategy Session"** card in the timeline.
This meeting has:
- Status: Completed ✅
- Minutes: Completed ✅
- Should show **"Create Task"** button with sparkles ✨

### Test Flow:
1. **Scroll to find** "Marketing Strategy Session"
2. **Click "Create Task"** button (sparkles icon)
3. Sheet slides in from **right side**

### What to Check in Sheet:

#### 1. **Header** (Top)
- [ ] Title: "✨ Create Action from Meeting"
- [ ] Description visible
- [ ] X button in corner

#### 2. **Context Card** (Blue/amber background)
- [ ] Shows "Marketing Strategy Session"
- [ ] Shows "CASE-2024-008"
- [ ] Badge: "Auto-linked to case trail"

#### 3. **Task Type Cards** (4 cards in 2x2 grid)
- [ ] 📝 Self-Reminder (blue)
- [ ] 👤 Push to Someone (purple)
- [ ] 👥 Push to Department (green)
- [ ] ✅ Link to Approval (amber)

**Test selection:**
- [ ] Click any card → gets ring outline
- [ ] Click another → first deselects
- [ ] Selected card has primary ring

#### 4. **Smart Alert** (Only for Approval type)
- [ ] Click "✅ Link to Approval"
- [ ] Alert appears with lightbulb icon
- [ ] Says "Smart Detection"
- [ ] Mentions "CEO approval workflow"

#### 5. **Task Details Form** (After selection)
- [ ] Title input appears
- [ ] Description textarea (3 rows)
- [ ] Priority selector (Low/Medium/High/Urgent)
- [ ] Due date picker (type="date")
- [ ] All fields editable

#### 6. **Watchers Section**
- [ ] Shows "3. Watchers (Optional)"
- [ ] Lists 3 participants:
  - [ ] Sarah Chen
  - [ ] Emma Wilson
  - [ ] John Doe
- [ ] Checkboxes work
- [ ] Hover effect on rows

#### 7. **Info Alert** (Bottom)
- [ ] Shows sparkles icon
- [ ] Says "Smart Linking"
- [ ] Mentions case ID

#### 8. **Footer Buttons**
- [ ] "Cancel" button (outline)
- [ ] "Create Action & Link" button (GOLD)
- [ ] Gold button has Zap icon ⚡
- [ ] Gold button disabled until title filled

### Interactions:
```
1. Select task type → Form appears ✓
2. Fill title → Submit enables ✓
3. Check watchers → Checkboxes work ✓
4. Click "Create Action" → Console logs ✓
5. Sheet closes → Form resets ✓
6. Click "Cancel" → Sheet closes ✓
```

### Visual Check:
```
Right side of screen (600px+ wide):

┌─────────────────────────────────────────────────┐
│  ✨ Create Action from Meeting           [×]    │
│  Convert decisions into actionable tasks        │
├─────────────────────────────────────────────────┤
│                                                  │
│  [Context Card with meeting info]               │
│                                                  │
│  1. Select Task Type                            │
│  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐          │
│  │  📝  │ │  👤  │ │  👥  │ │  ✅  │          │
│  │      │ │      │ │      │ │      │          │
│  └──────┘ └──────┘ └──────┘ └──────┘          │
│     ^                                            │
│   Selected (ring visible)                       │
│                                                  │
│  2. Task Details                                │
│  [Form fields...]                               │
│                                                  │
│  3. Watchers                                    │
│  [x] Sarah Chen                                 │
│  [x] Emma Wilson                                │
│  [ ] John Doe                                   │
│                                                  │
│  [Info alert about auto-linking]               │
│                                                  │
│  [Cancel]  [⚡ Create Action & Link]            │
│                                ^                 │
│                              Gold button         │
└─────────────────────────────────────────────────┘
```

---

## ✅ Feature 3: Enhanced Timeline Cards

### Before Phase 2:
```
Completed meeting card:
[Add Minutes] button only
```

### After Phase 2:
```
Completed meeting WITH minutes:
[Create Task] button (sparkles icon)
```

### Test:
1. Find "Marketing Strategy Session"
2. Should show "Create Task" button
3. Button has sparkles icon ✨
4. Button has primary border color
5. Hover → background changes

---

## 🎨 Visual Quality Checks

### Luxury Effects:
- [ ] Task type cards glow on hover
- [ ] Floating bar has backdrop blur
- [ ] Gold buttons have shimmer
- [ ] Animations smooth (no jank)
- [ ] Transitions 250ms

### Colors:
- [ ] Gold: Primary actions, accents
- [ ] Blue: Self-reminder card
- [ ] Purple: Assign card  
- [ ] Green: Department card
- [ ] Amber: Approval card, alerts

### Typography:
- [ ] Headers bold and clear
- [ ] Body text readable
- [ ] Muted text for secondary info
- [ ] Icons aligned with text

---

## 📱 Responsive Checks

### Desktop (> 1024px):
- [ ] Floating bar 400-600px wide
- [ ] MagicToDo sheet 600-700px wide
- [ ] Task cards 2x2 grid
- [ ] All content visible

### Tablet (768-1024px):
- [ ] Floating bar responsive
- [ ] Sheet full height
- [ ] Task cards still 2x2
- [ ] Scrolling works

### Mobile (< 768px):
- [ ] Floating bar adapts
- [ ] Sheet full width
- [ ] Task cards stack?
- [ ] Forms usable

---

## 🐛 Edge Cases to Test

### 1. No Meeting Selected:
- [ ] Floating bar NOT visible
- [ ] Click meeting → appears
- [ ] Click X → disappears

### 2. Multiple Clicks:
- [ ] Click meeting A → bar shows A
- [ ] Click meeting B → bar updates to B
- [ ] No multiple bars

### 3. Sheet Interactions:
- [ ] Open sheet → can't interact with page behind
- [ ] Close sheet → page interactive again
- [ ] Open, close, reopen → works each time

### 4. Form Validation:
- [ ] No type selected → no form
- [ ] Type selected → form appears
- [ ] No title → submit disabled
- [ ] Has title → submit enabled

### 5. Console Logs:
```javascript
// When clicking "Create Action & Link":
Creating task: {
  type: "self",
  title: "Follow up on campaign",
  description: "...",
  priority: "high",
  dueDate: "2026-02-05",
  watchers: ["1", "3"]
}
for meeting: 8
```

---

## ⚡ Performance Checks

### Load Time:
- [ ] Sheet opens instantly (< 100ms)
- [ ] Floating bar appears smoothly
- [ ] No lag when selecting cards

### Animations:
- [ ] Slide-in smooth (no stutter)
- [ ] Hover effects responsive
- [ ] Ring selection immediate
- [ ] Submit button state instant

### Memory:
- [ ] Open/close sheet 10x → no leaks
- [ ] Select different meetings → updates clean
- [ ] Form resets properly

---

## ✅ Success Checklist

**Pass if ALL checked:**
- [ ] Floating bar appears on click
- [ ] Bar shows correct meeting info
- [ ] Gold buttons visible
- [ ] MagicToDo sheet opens
- [ ] 4 task type cards selectable
- [ ] Form appears after selection
- [ ] Watchers checkable
- [ ] Submit button gold with shimmer
- [ ] Smart alerts show (approval)
- [ ] No console errors
- [ ] Animations smooth
- [ ] Dark mode works

---

## 🆘 Common Issues

### Issue: Floating bar not appearing
**Cause:** Meeting not found in state
**Fix:** Check mock data has meeting with that ID

### Issue: Create Task button not showing
**Cause:** Meeting not completed OR no minutes
**Fix:** Update mock data:
```typescript
status: 'completed',
minutesCompleted: true,
```

### Issue: Sheet empty
**Cause:** No meeting passed
**Fix:** Check `magicTodoMeeting` state

### Issue: Styles not loading
**Cause:** Luxury utilities not imported
**Fix:** Check `globals.css`:
```css
@import "./styles/luxury.utilities.css";
```

---

## 🎉 Phase 2 Test Results

### If all checks pass:
✅ **Floating Action Bar** — Working  
✅ **MagicToDo Sheet** — Working  
✅ **Timeline Integration** — Working  
✅ **No Errors** — Clean  
✅ **Design Consistency** — Perfect  

**Phase 2 is production-ready!** 🚀

### If issues found:
1. Check mock data
2. Verify imports
3. Check console for errors
4. Review state management
5. Test in different browsers

---

## 📸 Screenshot Checklist

Take these for documentation:

1. **Floating bar visible** (bottom center)
2. **MagicToDo sheet open** (full view)
3. **Task type selected** (ring visible)
4. **Form filled out** (all fields)
5. **Smart alert** (approval type)
6. **Watchers section** (checked boxes)
7. **Mobile view** (responsive)
8. **Dark mode** (if available)

---

*Testing guide v2.0 — January 29, 2026*
*Phase 2 features: Floating Action Bar + MagicToDo Sheet*
