begin # Approvals Domain — Relationship UX Improvements

> Enhanced UI/UX for many-to-one and one-to-many approval relationships

**Date**: 2026-01-28  
**Status**: 🎯 Proposed Enhancements  
**Context**: Approvals often involve complex relationships requiring better visualization

---

## 🔗 Relationship Patterns in Approvals

### Many-to-One Relationships

1. **Many approvals → One conversation**
   - Multiple approval requests from same customer conversation
   - Example: Initial request → Follow-up → Budget increase

2. **Many approvals → One requester**
   - User's approval history
   - Pattern recognition (frequent requester, approval rate)

3. **Many approvals → One approver**
   - CEO's approval workload
   - Delegation needs, bottleneck identification

4. **Many approvals → One project/entity**
   - Multiple approvals for same project
   - Budget, access, resources for "Project Alpha"

### One-to-Many Relationships

1. **One approval → Many approvers** (multi-step)
   - Manager → Director → CEO chain
   - Parallel approvals (2 of 3 must approve)

2. **One approval → Many related items**
   - Approval affects multiple resources
   - Budget approval → Multiple line items

3. **One approval → Many notifications**
   - Stakeholders, watchers, audit trail

4. **One approval → Many actions**
   - Approved → Create room + Send email + Update permissions

---

## 🎨 UI/UX Improvements

### 1. **Conversation Thread View** (Many approvals → One conversation)

**Problem**: Multiple approvals from same conversation scattered across list.

**Solution**: Group by conversation with expandable thread.

```tsx
// New component: approval-conversation-thread.tsx

<Card>
  <CardHeader>
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <MessageSquare className="h-5 w-5" />
        <div>
          <CardTitle>Conversation #12345</CardTitle>
          <p className="text-sm text-muted-foreground">
            Customer: Sarah Chen · 3 approval requests
          </p>
        </div>
      </div>
      <Badge>3 pending</Badge>
    </div>
  </CardHeader>
  <CardContent>
    {/* Timeline of approvals */}
    <div className="space-y-3">
      <ApprovalThreadItem approval={approval1} />
      <ApprovalThreadItem approval={approval2} />
      <ApprovalThreadItem approval={approval3} />
    </div>
    
    {/* Bulk actions */}
    <div className="mt-4 flex gap-2">
      <Button>Approve All</Button>
      <Button variant="outline">View Conversation</Button>
    </div>
  </CardContent>
</Card>
```

**Features**:
- Chronological timeline
- Context from previous approvals
- Bulk approve/reject for related requests
- Jump to conversation
- Visual connection lines

---

### 2. **Requester Profile Panel** (Many approvals → One requester)

**Problem**: No visibility into requester's approval history.

**Solution**: Side panel with requester insights.

```tsx
// New component: approval-requester-profile.tsx

<Sheet>
  <SheetContent>
    <SheetHeader>
      <SheetTitle>Requester Profile</SheetTitle>
    </SheetHeader>
    
    <div className="space-y-6">
      {/* Profile */}
      <div className="flex items-center gap-3">
        <Avatar className="h-16 w-16">
          <AvatarFallback>SC</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">Sarah Chen</h3>
          <p className="text-sm text-muted-foreground">Product Manager</p>
        </div>
      </div>
      
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Total Requests" value="24" />
        <StatCard label="Approval Rate" value="92%" trend="+5%" />
        <StatCard label="Avg Response" value="2.3h" />
      </div>
      
      {/* Recent approvals */}
      <div>
        <h4 className="font-medium mb-2">Recent Requests</h4>
        <div className="space-y-2">
          <ApprovalHistoryItem approval={...} />
          <ApprovalHistoryItem approval={...} />
        </div>
      </div>
      
      {/* Patterns */}
      <div>
        <h4 className="font-medium mb-2">Request Patterns</h4>
        <div className="space-y-2">
          <Badge>Frequent: Budget Approvals</Badge>
          <Badge>Peak Time: Fridays 3-5pm</Badge>
          <Badge>Usually Urgent</Badge>
        </div>
      </div>
    </div>
  </SheetContent>
</Sheet>
```

**Features**:
- Approval history
- Success rate
- Request patterns
- Risk indicators
- Quick context for decision-making

---

### 3. **Multi-Step Approval Chain** (One approval → Many approvers)

**Problem**: No visibility into approval chain/workflow.

**Solution**: Visual workflow stepper with status.

```tsx
// New component: approval-chain.tsx

<Card>
  <CardHeader>
    <CardTitle>Approval Chain</CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {/* Stepper */}
      <div className="flex items-center">
        <ApprovalStep 
          step={1} 
          label="Manager" 
          approver="John Doe"
          status="approved" 
          timestamp="2h ago"
        />
        <div className="h-px flex-1 bg-border" />
        <ApprovalStep 
          step={2} 
          label="Director" 
          approver="Jane Smith"
          status="pending" 
        />
        <div className="h-px flex-1 bg-muted" />
        <ApprovalStep 
          step={3} 
          label="CEO" 
          status="waiting" 
        />
      </div>
      
      {/* Current step details */}
      <div className="rounded-lg border bg-muted/50 p-4">
        <p className="text-sm font-medium">Current Step: Director Approval</p>
        <p className="text-sm text-muted-foreground">
          Assigned to: Jane Smith · Waiting for 1h 23m
        </p>
        <div className="mt-2 flex gap-2">
          <Button size="sm">Approve & Forward</Button>
          <Button size="sm" variant="outline">Request Changes</Button>
        </div>
      </div>
      
      {/* Parallel approvals (if applicable) */}
      <div>
        <p className="text-sm font-medium mb-2">Parallel Approvals (2 of 3 required)</p>
        <div className="space-y-2">
          <ParallelApprover name="Alice" status="approved" />
          <ParallelApprover name="Bob" status="approved" />
          <ParallelApprover name="Carol" status="pending" />
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

**Features**:
- Visual workflow progress
- Current step highlighted
- Approver assignments
- Time in each step
- Parallel approval tracking
- Forward/delegate options

---

### 4. **Related Approvals Panel** (Many approvals → One project)

**Problem**: Can't see related approvals for same project/entity.

**Solution**: Related items section with grouping.

```tsx
// Enhanced approval-detail.tsx

<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Link2 className="h-4 w-4" />
      Related Approvals
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {/* Project grouping */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="outline">Project Alpha</Badge>
          <span className="text-sm text-muted-foreground">5 approvals</span>
        </div>
        <div className="space-y-2 pl-4 border-l-2">
          <RelatedApprovalItem 
            type="Budget Approval" 
            status="approved" 
            amount="$50k"
          />
          <RelatedApprovalItem 
            type="Access Request" 
            status="approved" 
            user="3 users"
          />
          <RelatedApprovalItem 
            type="Consultation Room" 
            status="pending" 
            highlight
          />
        </div>
      </div>
      
      {/* Context summary */}
      <div className="rounded-lg bg-muted/50 p-3">
        <p className="text-sm">
          <strong>Context:</strong> This is the 3rd approval for Project Alpha. 
          Previous approvals totaled $75k. All were approved within 24h.
        </p>
      </div>
      
      {/* Quick actions */}
      <div className="flex gap-2">
        <Button size="sm" variant="outline">View All Project Approvals</Button>
        <Button size="sm" variant="outline">Project Timeline</Button>
      </div>
    </div>
  </CardContent>
</Card>
```

**Features**:
- Group by project/entity
- Visual connection
- Context summary
- Cumulative metrics
- Pattern detection

---

### 5. **Bulk Action Panel** (One action → Many approvals)

**Problem**: Approving similar requests one-by-one is tedious.

**Solution**: Smart bulk actions with preview.

```tsx
// New component: approval-bulk-actions.tsx

<Sheet>
  <SheetContent className="w-full sm:max-w-3xl">
    <SheetHeader>
      <SheetTitle>Bulk Approve (5 selected)</SheetTitle>
    </SheetHeader>
    
    <div className="space-y-6">
      {/* Selection summary */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Selected</p>
              <p className="text-2xl font-bold">5</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-2xl font-bold">$125k</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Requesters</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Preview list */}
      <div>
        <h4 className="font-medium mb-2">Selected Approvals</h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {selectedApprovals.map(approval => (
            <BulkApprovalPreviewItem 
              key={approval.id}
              approval={approval}
              onRemove={() => removeFromSelection(approval.id)}
            />
          ))}
        </div>
      </div>
      
      {/* Bulk decision */}
      <div className="space-y-2">
        <Label>Comment (applied to all)</Label>
        <Textarea 
          placeholder="Add a comment for all approvals..."
          rows={3}
        />
      </div>
      
      {/* Actions */}
      <div className="flex gap-2">
        <Button className="flex-1">
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Approve All (5)
        </Button>
        <Button variant="destructive" className="flex-1">
          <XCircle className="mr-2 h-4 w-4" />
          Reject All (5)
        </Button>
      </div>
      
      {/* Warnings */}
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Review Required</AlertTitle>
        <AlertDescription>
          2 approvals exceed $50k threshold. Consider individual review.
        </AlertDescription>
      </Alert>
    </div>
  </SheetContent>
</Sheet>
```

**Features**:
- Multi-select with checkboxes
- Preview before action
- Aggregate metrics
- Warnings for outliers
- Unified comment
- Undo support

---

### 6. **Approver Workload Dashboard** (Many approvals → One approver)

**Problem**: No visibility into approver capacity/bottlenecks.

**Solution**: Workload dashboard with delegation.

```tsx
// New component: approval-workload-dashboard.tsx

<div className="space-y-6">
  {/* Workload stats */}
  <div className="grid gap-4 md:grid-cols-4">
    <StatCard 
      label="Pending" 
      value="12" 
      trend="+3 today"
      icon={Clock}
    />
    <StatCard 
      label="Overdue" 
      value="2" 
      variant="destructive"
      icon={AlertTriangle}
    />
    <StatCard 
      label="Avg Response" 
      value="3.2h" 
      trend="-0.5h"
      icon={Zap}
    />
    <StatCard 
      label="This Week" 
      value="45" 
      trend="+12%"
      icon={TrendingUp}
    />
  </div>
  
  {/* Workload by type */}
  <Card>
    <CardHeader>
      <CardTitle>Workload by Type</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <WorkloadBar 
          label="CEO Approvals" 
          count={8} 
          total={12} 
          color="red"
        />
        <WorkloadBar 
          label="Budget Approvals" 
          count={3} 
          total={12} 
          color="orange"
        />
        <WorkloadBar 
          label="Access Requests" 
          count={1} 
          total={12} 
          color="blue"
        />
      </div>
    </CardContent>
  </Card>
  
  {/* Delegation options */}
  <Card>
    <CardHeader>
      <CardTitle>Delegation</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        <p className="text-sm text-muted-foreground">
          You have 12 pending approvals. Consider delegating to:
        </p>
        <div className="space-y-2">
          <DelegationOption 
            name="Jane Smith" 
            role="Director"
            capacity="Low workload (3 pending)"
            canDelegate={['budget_approval', 'access_request']}
          />
          <DelegationOption 
            name="Bob Wilson" 
            role="Manager"
            capacity="Available (1 pending)"
            canDelegate={['access_request']}
          />
        </div>
      </div>
    </CardContent>
  </Card>
</div>
```

**Features**:
- Workload metrics
- Overdue alerts
- Type breakdown
- Delegation suggestions
- Capacity planning

---

### 7. **Impact Preview** (One approval → Many actions)

**Problem**: Unclear what happens after approval.

**Solution**: Impact preview before decision.

```tsx
// Enhanced approval-detail.tsx

<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Zap className="h-4 w-4" />
      Impact Preview
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        If approved, the following actions will be triggered:
      </p>
      
      {/* Action list */}
      <div className="space-y-3">
        <ImpactItem 
          icon={Video}
          title="Create Consultation Room"
          description="Jitsi room 'consultation-abc123' will be created"
          status="automatic"
        />
        <ImpactItem 
          icon={Mail}
          title="Send Notifications"
          description="Email to requester and 3 stakeholders"
          status="automatic"
        />
        <ImpactItem 
          icon={Shield}
          title="Update Permissions"
          description="Grant access to 2 team members"
          status="automatic"
        />
        <ImpactItem 
          icon={DollarSign}
          title="Budget Allocation"
          description="$50k allocated to Project Alpha"
          status="manual-review"
        />
      </div>
      
      {/* Warnings */}
      <Alert variant="warning">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Budget Threshold</AlertTitle>
        <AlertDescription>
          This approval will exceed quarterly budget by $5k. 
          <Button variant="link" size="sm">View Budget Report</Button>
        </AlertDescription>
      </Alert>
      
      {/* Affected entities */}
      <div>
        <p className="text-sm font-medium mb-2">Affected Entities</p>
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">Project Alpha</Badge>
          <Badge variant="outline">Engineering Team</Badge>
          <Badge variant="outline">Q1 Budget</Badge>
        </div>
      </div>
    </div>
  </CardContent>
</Card>
```

**Features**:
- Action preview
- Automatic vs manual actions
- Warnings and thresholds
- Affected entities
- Budget impact
- Rollback plan

---

### 8. **Approval Dependencies Graph** (Complex relationships)

**Problem**: Can't visualize approval dependencies.

**Solution**: Interactive dependency graph.

```tsx
// New component: approval-dependencies-graph.tsx

<Card>
  <CardHeader>
    <CardTitle>Approval Dependencies</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Visual graph */}
    <div className="relative h-96 rounded-lg border bg-muted/20 p-4">
      {/* Use react-flow or similar for graph visualization */}
      <DependencyGraph
        nodes={[
          { id: 'approval-1', type: 'budget', status: 'approved' },
          { id: 'approval-2', type: 'access', status: 'pending', blocked: true },
          { id: 'approval-3', type: 'room', status: 'waiting' },
        ]}
        edges={[
          { from: 'approval-1', to: 'approval-2', label: 'blocks' },
          { from: 'approval-2', to: 'approval-3', label: 'required' },
        ]}
      />
    </div>
    
    {/* Legend */}
    <div className="mt-4 flex flex-wrap gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-approve-bg" />
        <span>Approved</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-pending-bg" />
        <span>Pending</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="h-3 w-3 rounded-full bg-muted" />
        <span>Blocked</span>
      </div>
    </div>
    
    {/* Blocking info */}
    <Alert className="mt-4">
      <Info className="h-4 w-4" />
      <AlertTitle>Blocked Approvals</AlertTitle>
      <AlertDescription>
        2 approvals are waiting for this decision. 
        <Button variant="link" size="sm">View Blocked Items</Button>
      </AlertDescription>
    </Alert>
  </CardContent>
</Card>
```

**Features**:
- Visual dependency tree
- Blocking relationships
- Critical path highlighting
- Impact of delays
- Parallel vs sequential

---

## 🗄️ Data Model Enhancements

### Extended Approval Type

```typescript
interface Approval {
  // ... existing fields ...
  
  // Relationships
  conversationId?: string;
  projectId?: string;
  parentApprovalId?: string;  // For approval chains
  relatedApprovalIds?: string[];
  
  // Multi-step
  workflowId?: string;
  workflowStep?: number;
  totalSteps?: number;
  approvers?: {
    userId: string;
    name: string;
    role: string;
    step: number;
    status: 'pending' | 'approved' | 'rejected' | 'skipped';
    timestamp?: Date;
  }[];
  
  // Impact
  affectedEntities?: {
    type: 'project' | 'team' | 'budget' | 'user';
    id: string;
    name: string;
  }[];
  automatedActions?: {
    type: string;
    description: string;
    status: 'pending' | 'completed' | 'failed';
  }[];
  
  // Requester context
  requesterStats?: {
    totalRequests: number;
    approvalRate: number;
    avgResponseTime: string;
  };
}
```

---

## 🎯 Implementation Priority

### Phase 1 (High Impact, Low Effort)
1. ✅ **Related Approvals Panel** — Show grouped approvals
2. ✅ **Requester Profile Link** — Click to see history
3. ✅ **Impact Preview** — Show what happens after approval
4. ✅ **Bulk Selection** — Checkboxes + bulk actions

### Phase 2 (High Impact, Medium Effort)
5. ⏳ **Conversation Thread View** — Group by conversation
6. ⏳ **Multi-Step Approval Chain** — Visual workflow
7. ⏳ **Approver Workload Dashboard** — Capacity view

### Phase 3 (Medium Impact, High Effort)
8. ⏳ **Dependency Graph** — Complex visualization
9. ⏳ **AI-Powered Suggestions** — Smart grouping, risk detection
10. ⏳ **Real-time Collaboration** — Multiple approvers, chat

---

## 📊 Metrics to Track

- **Approval velocity**: Time from request to decision
- **Bottleneck identification**: Which approvers/steps slow down
- **Batch efficiency**: Time saved with bulk actions
- **Relationship insights**: Patterns in related approvals
- **Delegation effectiveness**: Workload distribution

---

## 🎨 Visual Design Patterns

### Connection Lines
```css
/* Visual connection between related items */
.approval-connection {
  position: relative;
}

.approval-connection::before {
  content: '';
  position: absolute;
  left: -1rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: hsl(var(--border));
}
```

### Grouping Cards
```tsx
<div className="space-y-2 rounded-lg border-2 border-primary/20 bg-primary/5 p-4">
  <div className="flex items-center gap-2 mb-3">
    <Badge>Group: Project Alpha</Badge>
    <span className="text-sm text-muted-foreground">5 items</span>
  </div>
  {/* Grouped items */}
</div>
```

### Stepper Progress
```tsx
<div className="flex items-center">
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-approve-bg">
    <Check className="h-4 w-4 text-approve-fg" />
  </div>
  <div className="h-px flex-1 bg-approve-bd" />
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-pending-bg animate-pulse">
    <span className="text-sm font-medium">2</span>
  </div>
  <div className="h-px flex-1 bg-muted" />
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
    <span className="text-sm font-medium text-muted-foreground">3</span>
  </div>
</div>
```

---

## 🚀 Next Steps

1. **Extend data model** — Add relationship fields to Approval type
2. **Update API** — Support relationship queries (related approvals, chains)
3. **Implement Phase 1** — Related panel, requester profile, bulk actions
4. **User testing** — Validate relationship visualizations
5. **Iterate** — Based on usage patterns and feedback

---

*Last updated: 2026-01-28*
