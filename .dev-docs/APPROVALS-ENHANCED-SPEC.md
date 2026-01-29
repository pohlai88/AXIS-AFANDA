# Approvals Domain — Enhanced Specification (AFANDA-Style)

> Template-first, hash-deduped, morphology-enabled, audit-trailed approval system for **internal organization/team workflows only**

**Date**: 2026-01-28  
**Status**: 🎯 Enhanced Specification  
**Scope**: Internal only (Omnichannel handles external incoming)

---

## 🎯 Core Philosophy

### The AFANDA Way

1. **Template-First**: Every approval must start from a template (no freeform chaos)
2. **Hash-Deduped**: SHA256 content fingerprinting prevents duplicate spam
3. **Morphology-Enabled**: Forward/escalate across org → team → individual
4. **Audit-Trailed**: Past-Present-Future tracking (what was, what is, what will be)
5. **PUSH-Capable**: Explicit handoffs like MagicTodo
6. **Internal-Only**: External requests come through Omnichannel first

### Never Invent Truth

- Templates define structure (registry law)
- Content hash ensures uniqueness (one truth thread)
- Audit trail is immutable (manifests)
- Morphology preserves lineage (no copy-paste)

---

## 📋 1. Template System (Template-First)

### Template Types

| Code    | Type         | Purpose               | Example                                   |
| ------- | ------------ | --------------------- | ----------------------------------------- |
| **REQ** | Request      | Ask for something     | Expense claim, leave request, procurement |
| **APR** | Approval     | Ratify/approve/reject | Budget approval, exception approval       |
| **CON** | Consultation | Needs decision        | Strategy discussion, design review        |
| **FYI** | Broadcast    | Inform with ack       | Policy update, announcement               |
| **INC** | Incident     | War-room trigger      | Production outage, security breach        |

### Template Structure

```typescript
interface ApprovalTemplate {
  id: string;
  code: string; // 'REQ_EXPENSE', 'APR_BUDGET', 'CON_EXCEPTION'
  type: 'REQ' | 'APR' | 'CON' | 'FYI' | 'INC';
  name: string;
  description: string;
  category: string;
  
  // Structure (what fields are required)
  requiredFields: TemplateField[];
  optionalFields: TemplateField[];
  
  // Policies (how it behaves)
  evidencePolicy: 'required' | 'optional' | 'none';
  approvalPolicy: ApprovalPolicy;
  privacyDefault: 'PUBLIC' | 'PRIVATE' | 'RESTRICTED';
  tagsSchema: string[]; // Allowed label IDs
  slaPolicy: SLAPolicy;
  
  // Output (what comes out)
  outputContract: TemplateField[];
  
  // Metadata
  version: number;
  isActive: boolean;
}
```

### Example Templates

#### 1. Expense Claim (REQ_EXPENSE)

```typescript
{
  code: 'REQ_EXPENSE',
  type: 'REQ',
  name: 'Expense Claim',
  category: 'Finance',
  
  requiredFields: [
    { key: 'amount', label: 'Amount', type: 'number', validation: { required: true, min: 0 } },
    { key: 'category', label: 'Category', type: 'select', validation: { options: ['Travel', 'Meals', 'Equipment', 'Other'] } },
    { key: 'date', label: 'Expense Date', type: 'date', validation: { required: true } },
    { key: 'description', label: 'Description', type: 'textarea', validation: { required: true } },
  ],
  
  optionalFields: [
    { key: 'project', label: 'Project Code', type: 'text' },
    { key: 'notes', label: 'Additional Notes', type: 'textarea' },
  ],
  
  evidencePolicy: 'required', // Must attach receipt
  
  approvalPolicy: {
    type: 'sequential',
    approvers: [
      { step: 1, roleKey: 'manager', required: true },
      { step: 2, roleKey: 'finance_director', required: true, condition: 'amount > 1000' },
      { step: 3, roleKey: 'ceo', required: true, condition: 'amount > 5000' },
    ],
  },
  
  privacyDefault: 'PRIVATE',
  
  tagsSchema: ['LBL_FIN_EXPENSE', 'LBL_FIN_TRAVEL', 'LBL_FIN_URGENT'],
  
  slaPolicy: {
    ackTarget: 240, // 4 hours
    resolveTarget: 2880, // 2 days
    escalationRules: [
      { afterMinutes: 1440, escalateTo: 'finance_director' }, // 1 day
      { afterMinutes: 2880, escalateTo: 'ceo' }, // 2 days
    ],
  },
  
  outputContract: [
    { key: 'approved_amount', label: 'Approved Amount', type: 'number' },
    { key: 'payment_method', label: 'Payment Method', type: 'select' },
    { key: 'payment_date', label: 'Payment Date', type: 'date' },
  ],
}
```

#### 2. Budget Approval (APR_BUDGET)

```typescript
{
  code: 'APR_BUDGET',
  type: 'APR',
  name: 'Budget Approval',
  category: 'Finance',
  
  requiredFields: [
    { key: 'budget_line', label: 'Budget Line', type: 'select' },
    { key: 'amount', label: 'Amount', type: 'number', validation: { required: true, min: 0 } },
    { key: 'quarter', label: 'Quarter', type: 'select', validation: { options: ['Q1', 'Q2', 'Q3', 'Q4'] } },
    { key: 'justification', label: 'Justification', type: 'textarea', validation: { required: true } },
  ],
  
  evidencePolicy: 'optional',
  
  approvalPolicy: {
    type: 'quorum',
    approvers: [
      { roleKey: 'finance_director', required: true },
      { roleKey: 'ceo', required: true },
      { roleKey: 'cfo', required: true },
    ],
    quorumCount: 2, // 2 of 3 must approve
  },
  
  privacyDefault: 'RESTRICTED',
  
  tagsSchema: ['LBL_FIN_BUDGET', 'LBL_FIN_Q1', 'LBL_FIN_Q2', 'LBL_FIN_Q3', 'LBL_FIN_Q4'],
  
  slaPolicy: {
    ackTarget: 480, // 8 hours
    resolveTarget: 4320, // 3 days
  },
}
```

#### 3. Exception Approval (CON_EXCEPTION)

```typescript
{
  code: 'CON_EXCEPTION',
  type: 'CON',
  name: 'Exception Approval',
  category: 'Operations',
  
  requiredFields: [
    { key: 'policy', label: 'Policy Being Excepted', type: 'text', validation: { required: true } },
    { key: 'reason', label: 'Reason for Exception', type: 'textarea', validation: { required: true } },
    { key: 'duration', label: 'Exception Duration', type: 'select', validation: { options: ['One-time', '1 week', '1 month', '3 months', 'Permanent'] } },
    { key: 'impact', label: 'Impact Assessment', type: 'textarea', validation: { required: true } },
  ],
  
  evidencePolicy: 'required',
  
  approvalPolicy: {
    type: 'parallel',
    approvers: [
      { roleKey: 'legal', required: true },
      { roleKey: 'compliance', required: true },
      { roleKey: 'ceo', required: true },
    ],
  },
  
  privacyDefault: 'RESTRICTED',
  
  tagsSchema: ['LBL_OPS_EXCEPTION', 'LBL_OPS_URGENT', 'LBL_OPS_LEGAL'],
  
  slaPolicy: {
    ackTarget: 120, // 2 hours
    resolveTarget: 1440, // 1 day
    escalationRules: [
      { afterMinutes: 480, escalateTo: 'ceo' }, // 8 hours
    ],
  },
}
```

---

## 🔒 2. SHA256 Deduplication (Content Fingerprint)

### Problem Solved

- Duplicate "same request, same content" spam
- Accidental resubmits
- Copy-paste proliferation

### How It Works

#### Step 1: Canonical Payload

When user submits, compute:

```typescript
function computeCanonicalPayload(approval: Approval): string {
  // Exclude volatile fields
  const { id, createdAt, updatedAt, traceId, ...stable } = approval;
  
  // Normalize strings
  const normalized = deepNormalize(stable, {
    trim: true,
    collapseWhitespace: true,
    casefold: false, // Keep case for content
  });
  
  // Stable sort keys (JCS-style)
  const canonical = JSON.stringify(normalized, Object.keys(normalized).sort());
  
  return canonical;
}
```

#### Step 2: Content Hash

```typescript
const contentHash = SHA256(canonicalPayload);
```

#### Step 3: Dedup Check

```typescript
interface DedupRecord {
  id: string;
  tenantId: string;
  templateId: string;
  contentHash: string;
  approvalId: string;
  createdAt: Date;
  expiresAt: Date; // 30 days window
}

// Check for duplicate
const existing = await db.dedupRecords.findOne({
  tenantId,
  templateId,
  contentHash,
  expiresAt: { $gt: new Date() },
});

if (existing) {
  return {
    isDuplicate: true,
    duplicateOfId: existing.approvalId,
    createdAt: existing.createdAt,
  };
}
```

### UX Flow

```
User submits
  ↓
Compute contentHash
  ↓
Check dedup table
  ↓
┌─ If duplicate found ────────────────────────────┐
│ ⚠️ Duplicate Detected                           │
│                                                  │
│ This looks identical to Request #12345          │
│ Created on Jan 25, 2026 by Sarah Chen           │
│                                                  │
│ [Open Existing] [Forward Existing] [Override]   │
│                                                  │
│ Override Reason (required):                      │
│ [_________________________________________]      │
└──────────────────────────────────────────────────┘
```

---

## 📎 3. Attachments (Evidence)

### Attachment Structure

```typescript
interface Attachment {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  url: string;
  contentHash: string; // SHA256 for dedup
  uploadedBy: string;
  uploadedAt: Date;
}
```

### Deduplication

- Same file uploaded twice → reuse existing
- Show "This file was already attached on [date]"
- Save storage, maintain audit trail

### Evidence Policy

Templates define:
- **required**: Must attach (e.g., expense receipt)
- **optional**: Can attach (e.g., supporting docs)
- **none**: No attachments allowed (e.g., simple approvals)

### UI

```tsx
<Card>
  <CardHeader>
    <CardTitle>Attachments {evidencePolicy === 'required' && '*'}</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Upload area */}
    <div className="border-2 border-dashed rounded-lg p-6">
      <input type="file" multiple onChange={handleUpload} />
      <p className="text-sm text-muted-foreground">
        {evidencePolicy === 'required' 
          ? 'Required: Upload receipt or supporting documents'
          : 'Optional: Drag and drop files here'}
      </p>
    </div>
    
    {/* Attached files */}
    <div className="mt-4 space-y-2">
      {attachments.map(file => (
        <div key={file.id} className="flex items-center justify-between p-2 border rounded">
          <div className="flex items-center gap-2">
            <Paperclip className="h-4 w-4" />
            <span className="text-sm">{file.filename}</span>
            <Badge variant="outline">{formatBytes(file.size)}</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

---

## 🏷️ 4. Labels & Mentions (Searchable, Governed)

### Two Layers

#### Labels (Controlled Vocabulary)

```typescript
interface Label {
  id: string; // Stable ID: 'LBL_FIN_AP', 'LBL_HR_LEAVE'
  displayName: string; // 'Accounts Payable', 'Leave Request'
  color: string;
  category: string;
}
```

**Rules**:
- Labels are stable IDs (prevents drift)
- Display names can change, ID stays
- Templates define allowed labels (`tagsSchema`)
- Registry-first (no ad-hoc creation)

#### Mentions (Actors)

```typescript
interface Mention {
  id: string;
  type: 'user' | 'role' | 'team';
  targetId: string;
  targetName: string;
  mentionedBy: string;
  mentionedAt: Date;
  notified: boolean; // Audit trail
}
```

**Rules**:
- Every mention creates notification record
- Audit event logged
- Can mention users, roles, or teams

### UI

```tsx
{/* Labels */}
<div className="flex flex-wrap gap-2">
  {labels.map(label => (
    <Badge key={label.id} style={{ backgroundColor: label.color }}>
      {label.displayName}
      <button onClick={() => removeLabel(label.id)}>
        <X className="ml-1 h-3 w-3" />
      </button>
    </Badge>
  ))}
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" size="sm">
        <Plus className="h-4 w-4 mr-1" />
        Add Label
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <Command>
        <CommandInput placeholder="Search labels..." />
        <CommandList>
          {allowedLabels.map(label => (
            <CommandItem key={label.id} onSelect={() => addLabel(label)}>
              <Tag className="mr-2 h-4 w-4" style={{ color: label.color }} />
              {label.displayName}
            </CommandItem>
          ))}
        </CommandList>
      </Command>
    </PopoverContent>
  </Popover>
</div>

{/* Mentions */}
<Textarea
  placeholder="Add comment... Use @name to mention"
  onChange={handleMentionDetection}
/>
{mentionSuggestions.length > 0 && (
  <div className="border rounded-lg mt-2">
    {mentionSuggestions.map(user => (
      <button
        key={user.id}
        onClick={() => insertMention(user)}
        className="flex items-center gap-2 p-2 hover:bg-muted w-full"
      >
        <Avatar className="h-6 w-6">
          <AvatarFallback>{user.initials}</AvatarFallback>
        </Avatar>
        <span>{user.name}</span>
      </button>
    ))}
  </div>
)}
```

---

## 🔄 5. Morphology (Forward Across Scopes)

### Concept

**Morph** = new thread derived from existing, with:
- New scope (org → team → individual)
- New participants / SLA / privacy
- Same canonical source reference

### Rules (Non-negotiable)

1. **Never move** the original (immutability)
2. Create `morphOfThreadId` link
3. Carry forward `contentHash` + `templateId`
4. Add `morphReason` (why escalated/handed off)

### Morph Types

```typescript
interface Morph {
  id: string;
  sourceApprovalId: string;
  sourceScope: 'org' | 'team' | 'individual';
  targetScope: 'org' | 'team' | 'individual';
  morphReason: string;
  morphedBy: string;
  morphedAt: Date;
  targetApprovalId: string;
}
```

### Examples

#### 1. Org Announcement → Team Tasks

```
Org: "Q1 Budget Review Required"
  ↓ morph
Team: "Engineering Team Budget Review"
  ↓ morph
Individual: "John: Submit team budget by Jan 31"
```

#### 2. Team Consultation → Individual Action

```
Team: "Design Review: New Dashboard"
  ↓ morph
Individual: "Sarah: Implement feedback from design review"
```

#### 3. Individual Request → Team Approval

```
Individual: "John: Expense Claim $500"
  ↓ morph
Team: "Finance Team: Approve John's expense"
```

### UI

```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <GitBranch className="h-4 w-4" />
      Morph to Different Scope
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {/* Scope selector */}
      <div>
        <Label>Target Scope</Label>
        <Select value={targetScope} onValueChange={setTargetScope}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="org">Organization</SelectItem>
            <SelectItem value="team">Team</SelectItem>
            <SelectItem value="individual">Individual</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Target selector */}
      <div>
        <Label>Target {targetScope}</Label>
        {targetScope === 'team' && (
          <Select value={targetId} onValueChange={setTargetId}>
            <SelectTrigger>
              <SelectValue placeholder="Select team" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="team-eng">Engineering</SelectItem>
              <SelectItem value="team-fin">Finance</SelectItem>
              <SelectItem value="team-hr">HR</SelectItem>
            </SelectContent>
          </Select>
        )}
        {targetScope === 'individual' && (
          <Input placeholder="Search user..." />
        )}
      </div>
      
      {/* Reason */}
      <div>
        <Label>Reason for Morphing</Label>
        <Textarea 
          placeholder="Explain why this is being forwarded to a different scope..."
          value={morphReason}
          onChange={(e) => setMorphReason(e.target.value)}
        />
      </div>
      
      {/* Preview */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Morph Preview</AlertTitle>
        <AlertDescription>
          This will create a new {targetScope}-level approval linked to this one.
          Original approval remains unchanged.
        </AlertDescription>
      </Alert>
      
      <Button onClick={handleMorph} className="w-full">
        <GitBranch className="mr-2 h-4 w-4" />
        Morph to {targetScope}
      </Button>
    </div>
  </CardContent>
</Card>
```

---

## 🚀 6. PUSH Function (Handoffs Like MagicTodo)

### What PUSH Means

Explicit **handoff event** that:
- Assigns an owner
- Sets SLA
- Pins next action
- Appears in OmniInbox immediately

### PUSH Types

```typescript
interface PushEvent {
  id: string;
  approvalId: string;
  type: 'PUSH_TO_PERSON' | 'PUSH_TO_ROLE' | 'PUSH_TO_QUEUE';
  targetId: string;
  targetName: string;
  nextAction: string;
  dueAt?: Date;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  pushedBy: string;
  pushedAt: Date;
  completedAt?: Date;
}
```

### PUSH Actions

1. **PUSH_TO_PERSON**: Assign to specific user
2. **PUSH_TO_ROLE**: Assign to role (first available)
3. **PUSH_TO_QUEUE**: Add to team queue

### UI

```tsx
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <ArrowRight className="h-4 w-4" />
      PUSH to Someone
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {/* Target type */}
      <Tabs value={pushType} onValueChange={setPushType}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="person">Person</TabsTrigger>
          <TabsTrigger value="role">Role</TabsTrigger>
          <TabsTrigger value="queue">Queue</TabsTrigger>
        </TabsList>
        
        <TabsContent value="person">
          <div className="space-y-2">
            <Label>Select Person</Label>
            <Command>
              <CommandInput placeholder="Search users..." />
              <CommandList>
                {users.map(user => (
                  <CommandItem key={user.id} onSelect={() => setTargetId(user.id)}>
                    <Avatar className="mr-2 h-6 w-6">
                      <AvatarFallback>{user.initials}</AvatarFallback>
                    </Avatar>
                    {user.name}
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </div>
        </TabsContent>
        
        <TabsContent value="role">
          <div className="space-y-2">
            <Label>Select Role</Label>
            <Select value={targetId} onValueChange={setTargetId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="finance_director">Finance Director</SelectItem>
                <SelectItem value="ceo">CEO</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
        
        <TabsContent value="queue">
          <div className="space-y-2">
            <Label>Select Queue</Label>
            <Select value={targetId} onValueChange={setTargetId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose queue" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="finance_ap">Finance AP Queue</SelectItem>
                <SelectItem value="hr_requests">HR Requests Queue</SelectItem>
                <SelectItem value="it_support">IT Support Queue</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Next action */}
      <div>
        <Label>Next Action</Label>
        <Input 
          placeholder="What should they do?"
          value={nextAction}
          onChange={(e) => setNextAction(e.target.value)}
        />
      </div>
      
      {/* Due date */}
      <div>
        <Label>Due Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start">
              <Calendar className="mr-2 h-4 w-4" />
              {dueAt ? format(dueAt, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <Calendar mode="single" selected={dueAt} onSelect={setDueAt} />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Priority */}
      <div>
        <Label>Priority</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="urgent">🔥 Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Preview */}
      <Alert>
        <Zap className="h-4 w-4" />
        <AlertTitle>PUSH Preview</AlertTitle>
        <AlertDescription>
          {targetName} will receive:
          • Task card in their inbox
          • Link to this approval
          • Due date: {dueAt ? format(dueAt, 'PPP') : 'Not set'}
        </AlertDescription>
      </Alert>
      
      <Button onClick={handlePush} className="w-full">
        <ArrowRight className="mr-2 h-4 w-4" />
        PUSH to {targetName}
      </Button>
    </div>
  </CardContent>
</Card>
```

### MagicTodo Integration

PUSH creates a task contract:

```typescript
interface MagicTodoTask {
  taskId: string;
  sourceThreadId: string; // Approval ID
  nextAction: string;
  dueAt: Date;
  priority: string;
  status: string;
  assignedTo: string;
}
```

When completed in MagicTodo:
- Writes back to approval as audit event
- Updates PUSH status to 'completed'
- Notifies original pusher

---

## 📜 7. Audit Trail (Past-Present-Future)

### Concept

Every event records:
- **Past**: What was before
- **Present**: What is now
- **Future**: What will be (predictions, SLA, next steps)

### Audit Event Structure

```typescript
interface AuditEvent {
  id: string;
  approvalId: string;
  eventType: 'created' | 'submitted' | 'approved' | 'rejected' | 'morphed' | 'pushed' | 'commented' | 'attached' | 'mentioned';
  actor: string;
  actorName: string;
  timestamp: Date;
  
  // Past: What was
  previousState?: {
    status?: string;
    assignedTo?: string;
    fields?: Record<string, any>;
  };
  
  // Present: What is
  currentState: {
    status: string;
    assignedTo?: string;
    fields: Record<string, any>;
  };
  
  // Future: What will be
  futureState?: {
    predictedCompletion?: Date;
    nextMilestone?: string;
    slaStatus?: 'on_track' | 'at_risk' | 'breached';
    blockedBy?: string[];
    blocking?: string[];
  };
  
  metadata?: Record<string, any>;
}
```

### UI - Timeline View

```tsx
<Card>
  <CardHeader>
    <CardTitle>Audit Trail</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-6">
      {auditTrail.map((event, index) => (
        <div key={event.id} className="relative">
          {/* Timeline line */}
          {index < auditTrail.length - 1 && (
            <div className="absolute left-4 top-8 h-full w-px bg-border" />
          )}
          
          <div className="flex gap-4">
            {/* Icon */}
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
              <EventIcon type={event.eventType} />
            </div>
            
            {/* Content */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {event.actorName} {getEventLabel(event.eventType)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                </p>
              </div>
              
              {/* Past-Present-Future */}
              <div className="grid gap-2 text-sm">
                {/* Past */}
                {event.previousState && (
                  <div className="rounded-lg bg-muted/50 p-2">
                    <p className="text-xs font-medium text-muted-foreground">Past</p>
                    <p className="text-xs">
                      Status: {event.previousState.status}
                    </p>
                  </div>
                )}
                
                {/* Present */}
                <div className="rounded-lg bg-primary/10 p-2">
                  <p className="text-xs font-medium text-primary">Present</p>
                  <p className="text-xs">
                    Status: {event.currentState.status}
                    {event.currentState.assignedTo && (
                      <> · Assigned to: {event.currentState.assignedTo}</>
                    )}
                  </p>
                </div>
                
                {/* Future */}
                {event.futureState && (
                  <div className="rounded-lg bg-blue-500/10 p-2">
                    <p className="text-xs font-medium text-blue-600">Future</p>
                    <div className="space-y-1 text-xs">
                      {event.futureState.predictedCompletion && (
                        <p>
                          Predicted completion: {format(event.futureState.predictedCompletion, 'PPP')}
                        </p>
                      )}
                      {event.futureState.nextMilestone && (
                        <p>Next: {event.futureState.nextMilestone}</p>
                      )}
                      {event.futureState.slaStatus && (
                        <Badge variant={
                          event.futureState.slaStatus === 'on_track' ? 'default' :
                          event.futureState.slaStatus === 'at_risk' ? 'warning' :
                          'destructive'
                        }>
                          SLA: {event.futureState.slaStatus}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>
```

---

## 🔐 8. Privacy & Scope (Internal Only)

### Privacy Levels

| Level          | Who Can See                                       | Use Case                          |
| -------------- | ------------------------------------------------- | --------------------------------- |
| **PUBLIC**     | Everyone in org                                   | Announcements, policies           |
| **PRIVATE**    | Sender + explicit recipients + required approvers | Personal requests, sensitive      |
| **RESTRICTED** | Sender + specific roles only                      | Executive decisions, confidential |

### Scope Hierarchy

```
Organization (Org)
  ├─ Team 1
  │   ├─ Individual A
  │   └─ Individual B
  └─ Team 2
      ├─ Individual C
      └─ Individual D
```

**Rules**:
- Org-level: Visible to all org members (unless PRIVATE/RESTRICTED)
- Team-level: Visible to team members only
- Individual-level: Visible to individual + their managers

### External Incoming

**Omnichannel handles external** → Internal approvals handle internal.

Flow:
```
External customer → Omnichannel (Chatwoot)
  ↓
Agent escalates → Creates internal approval
  ↓
Internal approval workflow → Decision
  ↓
Decision → Back to Omnichannel → Customer
```

---

## 🎯 Implementation Roadmap

### Phase 1: Template Foundation (Week 1-2)

1. ✅ **Template system**
   - Create template schema
   - Build 3 example templates (Expense, Budget, Exception)
   - Template selector UI
   - Field renderer (dynamic forms)

2. ✅ **SHA256 deduplication**
   - Canonical payload computation
   - Dedup table
   - Duplicate detection UI
   - Override flow

3. ✅ **Attachments**
   - Upload component
   - Content hash dedup
   - Evidence policy enforcement
   - File preview

### Phase 2: Relationships (Week 3-4)

4. ✅ **Labels & Mentions**
   - Label registry
   - Mention detection
   - Notification creation
   - Search integration

5. ✅ **Morphology**
   - Morph data model
   - Scope selector UI
   - Lineage tracking
   - Morph history view

6. ✅ **PUSH function**
   - Push event model
   - Target selector UI
   - MagicTodo integration
   - Completion tracking

### Phase 3: Audit & Polish (Week 5-6)

7. ✅ **Audit trail**
   - Past-Present-Future model
   - Timeline UI
   - SLA predictions
   - Dependency tracking

8. ✅ **Privacy & Scope**
   - Privacy enforcement
   - Scope-based filtering
   - Access control
   - Audit logging

---

## 📚 API Contracts (Zod Schemas)

### Template Contract

```typescript
import { z } from 'zod';

export const TemplateFieldSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(['text', 'number', 'date', 'select', 'multiselect', 'file', 'textarea']),
  validation: z.object({
    required: z.boolean().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    pattern: z.string().optional(),
    options: z.array(z.string()).optional(),
  }).optional(),
  helpText: z.string().optional(),
});

export const ApprovalTemplateSchema = z.object({
  id: z.string(),
  code: z.string(),
  type: z.enum(['REQ', 'APR', 'CON', 'FYI', 'INC']),
  name: z.string(),
  description: z.string(),
  category: z.string(),
  requiredFields: z.array(TemplateFieldSchema),
  optionalFields: z.array(TemplateFieldSchema),
  evidencePolicy: z.enum(['required', 'optional', 'none']),
  approvalPolicy: z.object({
    type: z.enum(['single', 'sequential', 'parallel', 'quorum']),
    approvers: z.array(z.object({
      step: z.number().optional(),
      userId: z.string().optional(),
      roleKey: z.string().optional(),
      queueKey: z.string().optional(),
      required: z.boolean(),
      condition: z.string().optional(),
    })),
    quorumCount: z.number().optional(),
  }),
  privacyDefault: z.enum(['PUBLIC', 'PRIVATE', 'RESTRICTED']),
  tagsSchema: z.array(z.string()),
  slaPolicy: z.object({
    ackTarget: z.number().optional(),
    resolveTarget: z.number().optional(),
    escalationRules: z.array(z.object({
      afterMinutes: z.number(),
      escalateTo: z.string(),
    })).optional(),
  }),
  outputContract: z.array(TemplateFieldSchema),
  version: z.number(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
```

### Approval Contract

```typescript
export const ApprovalSchema = z.object({
  id: z.string(),
  tenantId: z.string(),
  templateId: z.string(),
  templateCode: z.string(),
  templateVersion: z.number(),
  title: z.string(),
  purpose: z.string(),
  fields: z.record(z.any()),
  contentHash: z.string(),
  scope: z.enum(['org', 'team', 'individual']),
  scopeId: z.string(),
  type: z.string(),
  status: z.enum(['draft', 'submitted', 'approved', 'rejected', 'cancelled']),
  requestedBy: z.string(),
  requestedByName: z.string().optional(),
  approvedBy: z.string().optional(),
  approvedByName: z.string().optional(),
  reason: z.string().optional(),
  decision: z.string().optional(),
  attachments: z.array(AttachmentSchema).optional(),
  labels: z.array(LabelSchema).optional(),
  mentions: z.array(MentionSchema).optional(),
  morphs: z.array(MorphSchema).optional(),
  morphedFrom: z.string().optional(),
  pushEvents: z.array(PushEventSchema).optional(),
  auditTrail: z.array(AuditEventSchema).optional(),
  privacy: z.enum(['PUBLIC', 'PRIVATE', 'RESTRICTED']),
  sla: z.object({
    ackTarget: z.date().optional(),
    resolveTarget: z.date().optional(),
    status: z.enum(['on_track', 'at_risk', 'breached']),
  }).optional(),
  metadata: z.record(z.any()).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  submittedAt: z.date().optional(),
  approvedAt: z.date().optional(),
  rejectedAt: z.date().optional(),
  isDuplicate: z.boolean().optional(),
  duplicateOfId: z.string().optional(),
  duplicateOverrideReason: z.string().optional(),
});
```

---

## 🎉 Summary

### What We've Enhanced

1. ✅ **Template-First**: Every approval starts from a template (no chaos)
2. ✅ **SHA256 Dedup**: Content fingerprinting prevents duplicates
3. ✅ **Attachments**: Evidence support with deduplication
4. ✅ **Labels & Mentions**: Controlled vocabulary + actor tracking
5. ✅ **Morphology**: Forward across org/team/individual scopes
6. ✅ **PUSH Function**: Explicit handoffs like MagicTodo
7. ✅ **Audit Trail**: Past-Present-Future tracking
8. ✅ **Privacy & Scope**: Internal-only with hierarchy

### AFANDA Principles Applied

- ✅ Never invent truth (templates define structure)
- ✅ One truth thread (hash deduplication)
- ✅ Immutable audit (past-present-future)
- ✅ Morphology not copy-paste (lineage preserved)
- ✅ Registry-first (labels, templates, contracts)
- ✅ Internal-only (omnichannel handles external)

### Ready For

- MVP: Internal approval workflows
- Template library: Expense, Budget, Exception, Leave, etc.
- Multi-step approvals: Sequential, parallel, quorum
- Morphology: Org → Team → Individual
- PUSH handoffs: MagicTodo integration
- Full audit trail: Compliance-ready

---

*Last updated: 2026-01-28*
*Aligned with: CONSULTATIONS-MEETING-SYSTEM.md, PROJECT-SPEC.md, AGENTS.md*
