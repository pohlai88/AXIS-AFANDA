'use client';

import { useState } from 'react';
import { Sparkles, Zap, Lightbulb } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { celebrateWithConfetti } from './confetti-celebration';
import type { Meeting } from './types';

interface MagicTodoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting: Meeting | null;
  onCreateTask: (task: TaskData) => void;
}

interface TaskData {
  type: string;
  title: string;
  description: string;
  priority: string;
  dueDate: string;
  assignedTo?: string;
  department?: string;
  watchers: string[];
}

const taskTypes = [
  {
    id: 'self',
    icon: '📝',
    label: 'Self-Reminder',
    description: 'Personal task for me',
    color: 'bg-changes-bg border-changes-bd',
  },
  {
    id: 'assigned',
    icon: '👤',
    label: 'Push to Someone',
    description: 'Assign to a person',
    color: 'bg-primary/10 border-primary/20',
  },
  {
    id: 'department',
    icon: '👥',
    label: 'Push to Department',
    description: 'Team task',
    color: 'bg-approve-bg border-approve-bd',
  },
  {
    id: 'approval',
    icon: '✅',
    label: 'Link to Approval',
    description: 'Needs approval',
    color: 'bg-status-warn-bg border-status-warn-bd',
  },
];

export function MagicTodoSheet({
  open,
  onOpenChange,
  meeting,
  onCreateTask,
}: MagicTodoSheetProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [watchers, setWatchers] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!selectedType || !title || !meeting) return;

    const taskData: TaskData = {
      type: selectedType,
      title,
      description,
      priority,
      dueDate,
      watchers,
    };

    onCreateTask(taskData);

    // Celebrate success
    celebrateWithConfetti({
      particleCount: 50,
      spread: 60,
    });

    // Reset form
    setSelectedType(null);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setDueDate('');
    setWatchers([]);
    onOpenChange(false);
  };

  const handleCancel = () => {
    setSelectedType(null);
    setTitle('');
    setDescription('');
    onOpenChange(false);
  };

  const toggleWatcher = (watcherId: string) => {
    setWatchers((prev) =>
      prev.includes(watcherId)
        ? prev.filter((id) => id !== watcherId)
        : [...prev, watcherId]
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:w-[37.5rem] lg:w-[43.75rem] overflow-y-auto"
      >
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
          {/* Context Card */}
          {meeting && (
            <Card className="bg-lux-gold-soft border-lux-gold">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                    <Sparkles className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{meeting.title}</p>
                    <p className="text-sm text-muted-foreground">{meeting.caseId}</p>
                    <Badge variant="secondary" className="mt-2 text-xs">
                      Auto-linked to case trail
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Task Type Selection */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">1. Select Task Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {taskTypes.map((type) => (
                <Card
                  key={type.id}
                  className={cn(
                    'cursor-pointer card-glow-lux transition-all',
                    type.color,
                    selectedType === type.id &&
                    'ring-2 ring-primary shadow-lux-strong'
                  )}
                  onClick={() => setSelectedType(type.id)}
                  data-interactive="true"
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2">{type.icon}</div>
                    <p className="font-semibold text-sm mb-1">{type.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {type.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Smart Suggestion */}
          {selectedType === 'approval' && (
            <Alert className="bg-lux-gold-soft border-lux-gold">
              <Lightbulb className="h-4 w-4 text-lux-gold" />
              <AlertTitle>Smart Detection</AlertTitle>
              <AlertDescription>
                We detected a budget approval request in your meeting minutes.
                This will be auto-routed to your CEO approval workflow.
              </AlertDescription>
            </Alert>
          )}

          {/* Task Details Form */}
          {selectedType && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <div className="space-y-3">
                <Label className="text-base font-semibold">2. Task Details</Label>

                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter task title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Add task details..."
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Priority */}
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="priority">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="urgent">Urgent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Due Date */}
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Watchers */}
          {selectedType && meeting && (
            <div className="space-y-3">
              <Label className="text-base font-semibold">
                3. Watchers (Optional)
              </Label>
              <p className="text-sm text-muted-foreground">
                Who should be notified of updates?
              </p>
              <div className="space-y-2">
                {meeting.participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <Checkbox
                      id={`watcher-${participant.id}`}
                      checked={watchers.includes(participant.id)}
                      onCheckedChange={() => toggleWatcher(participant.id)}
                    />
                    <Label
                      htmlFor={`watcher-${participant.id}`}
                      className="flex-1 font-normal cursor-pointer"
                    >
                      {participant.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Alert */}
          {selectedType && meeting && (
            <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>Smart Linking</AlertTitle>
              <AlertDescription>
                This task will be auto-linked to {meeting.caseId} and appear in
                your case trail timeline.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <SheetFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button
            className="btn-gold-lux w-full sm:w-auto"
            onClick={handleSubmit}
            disabled={!selectedType || !title}
          >
            <Zap className="h-4 w-4 mr-2" />
            Create Action & Link
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
