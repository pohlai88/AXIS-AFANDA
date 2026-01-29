'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ArrowRight,
  Calendar as CalendarIcon,
  Zap,
  User,
  Users,
  Inbox,
  Search,
  AlertTriangle,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { Approval } from '@/app/lib/stores/approvals-store';

interface PushHandoffProps {
  approval: Approval;
  onPush: (
    type: 'PUSH_TO_PERSON' | 'PUSH_TO_ROLE' | 'PUSH_TO_QUEUE',
    targetId: string,
    targetName: string,
    nextAction: string,
    dueAt: Date | undefined,
    priority: 'low' | 'medium' | 'high' | 'urgent'
  ) => Promise<void>;
  processing?: boolean;
}

// Mock data - replace with actual API calls
const MOCK_USERS = [
  { id: 'user-1', name: 'Sarah Chen', role: 'Product Manager', initials: 'SC', workload: 'medium' },
  { id: 'user-2', name: 'Mike Johnson', role: 'Engineering Lead', initials: 'MJ', workload: 'high' },
  { id: 'user-3', name: 'Emma Wilson', role: 'Finance Director', initials: 'EW', workload: 'low' },
  { id: 'user-4', name: 'Alex Rodriguez', role: 'HR Manager', initials: 'AR', workload: 'low' },
];

const MOCK_ROLES = [
  { id: 'manager', name: 'Manager', description: 'Team managers', count: 8 },
  { id: 'finance_director', name: 'Finance Director', description: 'Financial oversight', count: 2 },
  { id: 'ceo', name: 'CEO', description: 'Executive approval', count: 1 },
  { id: 'hr_lead', name: 'HR Lead', description: 'Human resources', count: 3 },
];

const MOCK_QUEUES = [
  { id: 'finance_ap', name: 'Finance AP Queue', description: 'Accounts payable', pending: 12 },
  { id: 'hr_requests', name: 'HR Requests Queue', description: 'HR inquiries', pending: 5 },
  { id: 'it_support', name: 'IT Support Queue', description: 'Technical support', pending: 23 },
  { id: 'ops_general', name: 'Operations Queue', description: 'General operations', pending: 8 },
];

export function PushHandoff({ onPush, processing = false }: PushHandoffProps) {
  const [pushType, setPushType] = useState<'person' | 'role' | 'queue'>('person');
  const [targetId, setTargetId] = useState('');
  const [targetName, setTargetName] = useState('');
  const [nextAction, setNextAction] = useState('');
  const [dueAt, setDueAt] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users by search
  const filteredUsers = MOCK_USERS.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePush = async () => {
    if (!targetId || !nextAction.trim()) return;

    const type =
      pushType === 'person'
        ? 'PUSH_TO_PERSON'
        : pushType === 'role'
          ? 'PUSH_TO_ROLE'
          : 'PUSH_TO_QUEUE';

    await onPush(type, targetId, targetName, nextAction, dueAt, priority);
  };

  const getWorkloadColor = (workload: string) => {
    switch (workload) {
      case 'low':
        return 'text-green-600';
      case 'medium':
        return 'text-yellow-600';
      case 'high':
        return 'text-red-600';
      default:
        return 'text-muted-foreground';
    }
  };

  const getPriorityColor = (p: string) => {
    switch (p) {
      case 'urgent':
        return 'bg-red-500/10 text-red-600 border-red-500/20';
      case 'high':
        return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'low':
        return 'bg-gray-500/10 text-gray-600 border-gray-500/20';
      default:
        return '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowRight className="h-4 w-4" />
          PUSH to Someone
        </CardTitle>
        <CardDescription>
          Create an explicit handoff with assigned owner and next action
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Target type tabs */}
        <Tabs value={pushType} onValueChange={(value) => {
          setPushType(value as 'person' | 'role' | 'queue');
          setTargetId('');
          setTargetName('');
        }}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="person">
              <User className="mr-2 h-4 w-4" />
              Person
            </TabsTrigger>
            <TabsTrigger value="role">
              <Users className="mr-2 h-4 w-4" />
              Role
            </TabsTrigger>
            <TabsTrigger value="queue">
              <Inbox className="mr-2 h-4 w-4" />
              Queue
            </TabsTrigger>
          </TabsList>

          {/* Person selector */}
          <TabsContent value="person" className="space-y-2">
            <Label>Select Person</Label>
            <div className="space-y-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* User list */}
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border p-2">
                {filteredUsers.length === 0 ? (
                  <p className="p-2 text-center text-sm text-muted-foreground">
                    No users found
                  </p>
                ) : (
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setTargetId(user.id);
                        setTargetName(user.name);
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted',
                        targetId === user.id && 'bg-primary/10'
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                      <Badge variant="outline" className={cn('text-xs', getWorkloadColor(user.workload))}>
                        {user.workload} load
                      </Badge>
                    </button>
                  ))
                )}
              </div>
            </div>
          </TabsContent>

          {/* Role selector */}
          <TabsContent value="role" className="space-y-2">
            <Label>Select Role</Label>
            <Select
              value={targetId}
              onValueChange={(value) => {
                setTargetId(value);
                const role = MOCK_ROLES.find((r) => r.id === value);
                setTargetName(role?.name || '');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose role" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_ROLES.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{role.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {role.description} · {role.count} {role.count === 1 ? 'person' : 'people'}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Will be assigned to first available person with this role
            </p>
          </TabsContent>

          {/* Queue selector */}
          <TabsContent value="queue" className="space-y-2">
            <Label>Select Queue</Label>
            <Select
              value={targetId}
              onValueChange={(value) => {
                setTargetId(value);
                const queue = MOCK_QUEUES.find((q) => q.id === value);
                setTargetName(queue?.name || '');
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose queue" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_QUEUES.map((queue) => (
                  <SelectItem key={queue.id} value={queue.id}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{queue.name}</span>
                        <span className="text-xs text-muted-foreground">{queue.description}</span>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {queue.pending} pending
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Will be added to team queue for assignment
            </p>
          </TabsContent>
        </Tabs>

        {/* Next action */}
        <div className="space-y-2">
          <Label htmlFor="next-action">
            Next Action <span className="text-destructive">*</span>
          </Label>
          <Input
            id="next-action"
            placeholder="What should they do? (e.g., Review and approve budget)"
            value={nextAction}
            onChange={(e) => setNextAction(e.target.value)}
            disabled={processing}
          />
        </div>

        {/* Due date */}
        <div className="space-y-2">
          <Label>Due Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !dueAt && 'text-muted-foreground'
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueAt ? format(dueAt, 'PPP') : 'Pick a date (optional)'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dueAt} onSelect={setDueAt} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label>Priority</Label>
          <Select value={priority} onValueChange={(value) => setPriority(value as 'low' | 'medium' | 'high' | 'urgent')}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">
                <Badge variant="outline" className={getPriorityColor('low')}>
                  Low
                </Badge>
              </SelectItem>
              <SelectItem value="medium">
                <Badge variant="outline" className={getPriorityColor('medium')}>
                  Medium
                </Badge>
              </SelectItem>
              <SelectItem value="high">
                <Badge variant="outline" className={getPriorityColor('high')}>
                  High
                </Badge>
              </SelectItem>
              <SelectItem value="urgent">
                <Badge variant="outline" className={getPriorityColor('urgent')}>
                  🔥 Urgent
                </Badge>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Preview */}
        {targetId && nextAction && (
          <Alert>
            <Zap className="h-4 w-4" />
            <AlertTitle>PUSH Preview</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-1 text-sm">
                <p>
                  <strong>{targetName}</strong> will receive:
                </p>
                <ul className="ml-4 list-disc space-y-1 text-xs">
                  <li>Task card in their inbox</li>
                  <li>Link to this approval</li>
                  <li>Next action: {nextAction}</li>
                  {dueAt && <li>Due date: {format(dueAt, 'PPP')}</li>}
                  <li>Priority: {priority}</li>
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Warning for urgent */}
        {priority === 'urgent' && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Urgent Priority</AlertTitle>
            <AlertDescription>
              This will send an immediate notification and appear at the top of their inbox
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <Button
          onClick={handlePush}
          disabled={processing || !targetId || !nextAction.trim()}
          className="w-full"
        >
          {processing ? (
            <>
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Pushing...
            </>
          ) : (
            <>
              <ArrowRight className="mr-2 h-4 w-4" />
              PUSH to {targetName || 'Selected'}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
