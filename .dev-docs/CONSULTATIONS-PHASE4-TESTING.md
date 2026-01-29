# Phase 4 Testing Guide — Real-time Updates

> Test SSE connections, live updates, and toast notifications

---

## 🚀 Quick Test (3 minutes)

### Step 1: Start Dev Server
```bash
npm run dev
```

### Step 2: Test Real-time Features
```
1. Open: http://localhost:3000/app/consultations
2. Look for [🟢 Live] badge in header
3. Open detail page: http://localhost:3000/app/consultations/1
4. Watch for toast notifications (every 15-30s)
```

---

## ✅ Feature 1: Connection Status Indicator

### On Main Consultations Page:

#### Visual Check:
- [ ] Badge visible in top-right header area
- [ ] Shows one of: [🟢 Live], [⚙️ Connecting...], [📡 Offline], [❌ Error]
- [ ] Badge has icon + label
- [ ] Badge color matches state:
  - Green for connected
  - Gray for connecting/disconnected
  - Red for error

#### Test Connection States:

**1. Connected State** (should appear within 2-3 seconds):
- [ ] Badge shows "🟢 Live" (green)
- [ ] Hover shows tooltip: "Live - Real-time updates active"
- [ ] No spinning animation

**2. Connecting State** (appears briefly on page load):
- [ ] Badge shows "⚙️ Connecting..." (gray)
- [ ] Icon spins continuously
- [ ] Tooltip: "Connecting... - Establishing connection..."

**3. To Test Disconnected:**
```
1. Open DevTools → Network tab
2. Filter by "updates"
3. Right-click SSE request → "Block request URL"
4. Refresh page
5. Badge should show "📡 Offline" or "❌ Error"
```

### On Detail Page:

#### Visual Check:
- [ ] Badge visible in header metadata row
- [ ] Positioned after "X participants"
- [ ] Same states as main page
- [ ] Updates independently

---

## ✅ Feature 2: Toast Notifications

### Setup for Testing:
Toast notifications appear when SSE events are received. The mock API sends events every 15-30 seconds.

### On Detail Page (Meeting-Specific):

**Wait for toasts to appear** (15s intervals):

#### Participant Joined:
```
Expected Toast:
┌─────────────────────────────────┐
│ 👋 Alex Smith joined the meeting│
└─────────────────────────────────┘
```

**Check:**
- [ ] Toast appears bottom-right or top-right
- [ ] Icon: 👋 (wave emoji)
- [ ] Message includes user name
- [ ] Auto-dismisses after 3-5 seconds
- [ ] Can be manually dismissed (X button)

#### Participant Left:
```
Expected Toast:
┌─────────────────────────────────┐
│ 👋 Emma Wilson left the meeting │
└─────────────────────────────────┘
```

**Check:**
- [ ] Same format as "joined"
- [ ] Different user name

#### Status Changed:
```
Expected Toast:
┌─────────────────────────────────┐
│ 📅 Meeting status: in-progress  │
└─────────────────────────────────┘
```

**Check:**
- [ ] Icon: 📅 (calendar)
- [ ] Shows new status

### On Main Page (Global):

**Wait for global toasts** (30s intervals):

#### Meeting Started:
```
Expected Toast:
┌──────────────────────────────────────┐
│ 🎥 Meeting "Sprint Planning" has    │
│    started                     [Join]│
└──────────────────────────────────────┘
```

**Check:**
- [ ] Icon: 🎥 (video camera)
- [ ] Shows meeting title
- [ ] Has "Join" button
- [ ] Clicking "Join" navigates to meeting

#### Meeting Created:
```
Expected Toast:
┌──────────────────────────────────────┐
│ 📅 New meeting scheduled             │
│    Budget Review Q2                  │
└──────────────────────────────────────┘
```

**Check:**
- [ ] Icon: 📅 (calendar)
- [ ] Shows meeting title in description

---

## ✅ Feature 3: Real-time State Updates

### Participant Status (Detail Page):

The mock API sends `participant_joined` and `participant_left` events.

**Test Flow:**
```
1. Open detail page
2. Check current participants (Room tab or Plan tab)
3. Wait for toast: "Alex Smith joined"
4. Check if new participant appears (may not in mock)
5. Wait for toast: "Emma Wilson left"
```

**Note:** The current implementation updates state but mock data may not show visual changes. Check console logs:

**Open Console (F12):**
```javascript
// Should see logs like:
Meeting update: {
  meetingId: "1",
  type: "participant_joined",
  data: { userId: "4", userName: "Alex Smith" },
  timestamp: "2026-01-29T12:00:00Z"
}
```

**Check:**
- [ ] Console logs appear when events received
- [ ] State update code executes (check logs)
- [ ] No errors in console

---

## ✅ Feature 4: SSE Connection Stability

### Test Reconnection:

**Steps:**
```
1. Open detail page with DevTools → Network tab
2. Watch for SSE connection (filter: "updates")
3. See connection established (status: pending/200)
4. Right-click connection → "Cancel request"
5. Watch connection indicator
6. Should see:
   - Badge changes to "Connecting..."
   - After 3 seconds: New connection attempt
   - Badge changes back to "Live"
```

**Check:**
- [ ] Reconnection happens automatically
- [ ] Max 5 reconnection attempts
- [ ] 3-second delay between attempts
- [ ] Connection indicator updates correctly

### Test Multiple Attempts:

**Steps:**
```
1. Block the SSE endpoint completely
2. Refresh page
3. Watch connection attempts (check console)
```

**Console should show:**
```
[SSE] Connection error: ...
[SSE] Reconnecting (attempt 1/5)...
[SSE] Reconnecting (attempt 2/5)...
[SSE] Reconnecting (attempt 3/5)...
...
[SSE] Max reconnect attempts reached
```

**Check:**
- [ ] Attempts shown in console
- [ ] Stops at 5 attempts
- [ ] Badge shows error state after max attempts

---

## ✅ Feature 5: API Endpoints

### Test Meeting-Specific Endpoint:

**Browser Test:**
```
1. Open new tab
2. Navigate to: http://localhost:3000/api/v1/meetings/1/updates
3. Should see text stream
```

**Expected Response:**
```
data: {"type":"connected","data":{"meetingId":"1"},"timestamp":"2026-01-29T..."}

data: {"type":"participant_joined","data":{...},"timestamp":"2026-01-29T..."}

(continues every 15 seconds)
```

**Check:**
- [ ] Response streams (doesn't finish)
- [ ] Events appear every ~15 seconds
- [ ] Format: `data: {JSON}\n\n`
- [ ] Headers: `Content-Type: text/event-stream`

### Test Global Endpoint:

**Browser Test:**
```
Navigate to: http://localhost:3000/api/v1/meetings/updates
```

**Expected Response:**
```
data: {"type":"connected","data":{"timestamp":"2026-01-29T..."},"timestamp":"..."}

data: {"type":"meeting_started","data":{...},"timestamp":"2026-01-29T..."}

(continues every 30 seconds)
```

**Check:**
- [ ] Streams continuously
- [ ] Events every ~30 seconds
- [ ] Proper SSE format

---

## ✅ Feature 6: Multiple Pages/Tabs

### Test Concurrent Connections:

**Steps:**
```
1. Open main consultations page (Tab 1)
2. Open detail page in new tab (Tab 2)
3. Both should show "Live" status
4. Both should receive toasts
```

**Check:**
- [ ] Both tabs connect independently
- [ ] Main page gets global updates
- [ ] Detail page gets meeting-specific updates
- [ ] No interference between tabs
- [ ] Toasts appear in each tab

### Test Tab Switching:

**Steps:**
```
1. Open detail page
2. Wait for connection (Live badge)
3. Switch to different tab (e.g., email)
4. Wait 30 seconds
5. Switch back to consultations
6. Check if connection still alive
```

**Check:**
- [ ] Connection persists when tab inactive
- [ ] Toasts queued while away (may auto-dismiss)
- [ ] Badge still shows "Live"

---

## 🐛 Edge Cases to Test

### 1. Rapid Page Navigation:
```
1. Load detail page
2. Immediately click back
3. Quickly click another meeting
4. Check for memory leaks (DevTools → Memory)
```

**Check:**
- [ ] Old connections cleaned up
- [ ] No duplicate connections
- [ ] No console errors

### 2. Network Interruption:
```
1. Open detail page
2. Turn off WiFi/disconnect network
3. Badge should show "Offline" or "Error"
4. Reconnect network
5. Should auto-reconnect within 3 seconds
```

**Check:**
- [ ] Error state shown during disconnect
- [ ] Auto-reconnect on network restore
- [ ] No manual refresh needed

### 3. Long-Running Connection:
```
1. Open detail page
2. Leave open for 5+ minutes
3. Check if still receiving events
```

**Check:**
- [ ] Connection stays alive
- [ ] Events continue to arrive
- [ ] No timeout errors

---

## 📊 Console Checks

### Expected Console Logs:

**On Page Load:**
```
[Meeting Updates] Connected to 1
[Global Meeting Updates] Connected
```

**When Event Received:**
```
Meeting update: {
  meetingId: "1",
  type: "participant_joined",
  data: { userId: "4", userName: "Alex Smith", ... },
  timestamp: Date
}
```

**On Error:**
```
[SSE] Connection error: ...
[SSE] Reconnecting (attempt 1/5)...
```

### Check For:
- [ ] No unhandled errors
- [ ] No warnings
- [ ] Clean connect/disconnect logs
- [ ] Event data properly formatted

---

## 🎨 Visual Quality Checks

### Connection Indicator:
- [ ] Badge size consistent (h-6 or similar)
- [ ] Icon aligned with text
- [ ] Color matches state semantically
- [ ] Tooltip readable
- [ ] Smooth transitions between states
- [ ] Spinner smooth (no jank)

### Toast Notifications:
- [ ] Positioned consistently (bottom-right or top-right)
- [ ] Readable text (not too small)
- [ ] Icons visible and appropriate
- [ ] Auto-dismiss timing reasonable
- [ ] Stackable (multiple toasts don't overlap badly)
- [ ] Dismissible (X button works)
- [ ] Actions clickable (Join button)

---

## ⚡ Performance Checks

### Connection Overhead:
- [ ] Page load not significantly slower
- [ ] Connection establishes quickly (< 2s)
- [ ] No lag when navigating
- [ ] Minimal memory increase

### Event Handling:
- [ ] Toast appears instantly (< 100ms after event)
- [ ] State updates fast
- [ ] No UI freezing
- [ ] Smooth animations

### Memory:
```
Open DevTools → Performance → Memory
1. Load page
2. Wait 2 minutes (receive events)
3. Check memory graph
4. Should be flat or minor increase
```

**Check:**
- [ ] No memory leaks
- [ ] Stable memory usage
- [ ] Old events garbage collected

---

## ✅ Success Checklist

**Pass if ALL checked:**
- [ ] Connection indicator shows on both pages
- [ ] Indicator shows "Live" (green) when connected
- [ ] Toasts appear for events (15-30s intervals)
- [ ] Toast messages correct and readable
- [ ] Icons appropriate for each event type
- [ ] Auto-dismiss works
- [ ] Manual dismiss works
- [ ] Reconnection works after disconnect
- [ ] Multiple tabs work independently
- [ ] No console errors
- [ ] No memory leaks
- [ ] Performance acceptable
- [ ] API endpoints stream correctly

---

## 🆘 Common Issues

### Issue: No toasts appearing
**Cause:** Sonner not installed or Toaster not mounted
**Fix:**
```bash
npm install sonner
```
```typescript
// Add to root layout
import { Toaster } from 'sonner';
<Toaster />
```

### Issue: Badge always shows "Connecting..."
**Cause:** API endpoint not reachable
**Fix:** Check endpoint exists and returns SSE stream

### Issue: "Max reconnect attempts reached"
**Cause:** Server not responding or endpoint blocked
**Fix:** Check server running and no CORS issues

### Issue: Multiple toasts for same event
**Cause:** Multiple hook instances or duplicate subscriptions
**Fix:** Check only one `useMeetingUpdates` per page

### Issue: Connection drops after 60s
**Cause:** Nginx or proxy timeout
**Fix:** Add `X-Accel-Buffering: no` header (already in code)

---

## 📸 Screenshot Checklist

Take these for documentation:

1. **Connection indicator** (Live state, green)
2. **Connection indicator** (Connecting state, spinning)
3. **Connection indicator** (Error state, red)
4. **Toast notification** (participant joined)
5. **Toast notification** (meeting started with Join button)
6. **Multiple toasts** (stack of 2-3)
7. **DevTools Network** (SSE connection active)
8. **Console logs** (event received)

---

## 🎯 Quick Validation (30 seconds)

**Bare Minimum Test:**
```
1. npm run dev
2. Open http://localhost:3000/app/consultations
3. Look for [🟢 Live] badge
4. Wait 30 seconds
5. See toast notification
```

**If all 5 steps work:** Phase 4 is functional! ✅

---

## 🎉 Phase 4 Test Results

### If all checks pass:
✅ **SSE Connection** — Working  
✅ **Connection Indicator** — Working  
✅ **Toast Notifications** — Working  
✅ **Real-time Updates** — Working  
✅ **Reconnection** — Working  
✅ **API Endpoints** — Working  
✅ **No Errors** — Clean  
✅ **Performance** — Good  

**Phase 4 is production-ready!** 🚀

### If issues found:
1. Check console for errors
2. Verify Sonner installed and Toaster mounted
3. Test API endpoints directly in browser
4. Check network tab for SSE connections
5. Try different browsers

---

*Testing guide v4.0 — January 29, 2026*
*Phase 4 features: Real-time Updates via SSE*
