/**
 * CONSULTATIONS UI/UX REDESIGN — Component Examples
 * 
 * These are implementation examples showing the innovative UI patterns.
 * Copy these to app/components/consultations/ and adapt as needed.
 */

'use client';

import { useState, useMemo } from 'react';
import { format, formatDistanceToNow, differenceInMinutes, isToday, isTomorrow, parseISO } from 'date-fns';
import {
  Video,
  MapPin,
  Phone,
  Calendar,
  Clock,
  Users,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Plus,
  MoreVertical,
  ArrowRight,
  Zap,
  TrendingUp,
  FileCheck,
  Pen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';

// ============================================================================
// TYPES
// ============================================================================

interface Meeting {
  id: string;
  caseId: string;
  title: string;
  type: 'video' | 'physical' | 'phone';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  scheduledStart: Date;
  scheduledEnd: Date;
  duration: number;
  location?: string;
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
    joined?: boolean;
  }>;
  minutesCompleted: boolean;
  agendaItems?: string[];
}

// ============================================================================
// 1. SMART TIMELINE VIEW
// ============================================================================

export function TimelineView({ meetings }: { meetings: Meeting[] }) {
  // Group meetings by date
  const groupedMeetings = useMemo(() => {
    const groups: Record<string, { label: string; meetings: Meeting[] }> = {};

    meetings.forEach((meeting) => {
      const dateKey = format(meeting.scheduledStart, 'yyyy-MM-dd');

      let label = format(meeting.scheduledStart, 'PPP');
      if (isToday(meeting.scheduledStart)) label = `Today • ${format(meeting.scheduledStart, 'EEE MMM d')}`;
      if (isTomorrow(meeting.scheduledStart)) label = `Tomorrow • ${format(meeting.scheduledStart, 'EEE MMM d')}`;

      if (!groups[dateKey]) {
        groups[dateKey] = { label, meetings: [] };
      }
      groups[dateKey].meetings.push(meeting);
    });

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [meetings]);

  return (
    <div className="space-y-8">
      {groupedMeetings.map(([dateKey, { label, meetings }]) => (
        <div key={dateKey} className="space-y-3">
          {/* Date Header */}
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-semibold text-foreground">{label}</h3>
            <Separator className="flex-1" />
            <Badge variant="secondary" className="text-xs">
              {meetings.length} meeting{meetings.length !== 1 ? 's' : ''}
            </Badge>
          </div>

          {/* Meetings in this date */}
          <div className="space-y-3">
            {meetings.map((meeting) => (
              <TimelineMeetingCard key={meeting.id} meeting={meeting} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function TimelineMeetingCard({ meeting }: { meeting: Meeting }) {
  const proximityStyle = getProximityStyle(meeting.scheduledStart);
  const minutesUntil = differenceInMinutes(meeting.scheduledStart, new Date());

  return (
    <Card className="card-glow-lux overflow-hidden" data-interactive="true">
      {/* Top accent bar (gold glow on hover) */}
      <div className={cn(
        'h-1 w-full transition-all duration-500',
        proximityStyle.accent
      )} />

      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Time Badge */}
          <div className={cn(
            'flex flex-col items-center justify-center rounded-lg px-3 py-2 min-w-[80px]',
            proximityStyle.badge
          )}>
            <span className="text-xl font-bold">
              {format(meeting.scheduledStart, 'HH:mm')}
            </span>
            <span className="text-xs opacity-80">
              {meeting.duration}m
            </span>
          </div>

          {/* Meeting Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="gap-1">
                {getMeetingIcon(meeting.type)}
                <span className="capitalize">{meeting.type}</span>
              </Badge>
              <Badge variant="secondary">{meeting.caseId}</Badge>
              {meeting.minutesCompleted && (
                <Badge variant="default" className="gap-1 bg-success text-white">
                  <CheckCircle2 className="h-3 w-3" />
                  Complete
                </Badge>
              )}
            </div>

            <h4 className="font-semibold text-base mb-2">{meeting.title}</h4>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              {meeting.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {meeting.location}
                </div>
              )}
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {meeting.participants.length} participant{meeting.participants.length !== 1 ? 's' : ''}
              </div>
            </div>

            {/* Participants Avatars */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex -space-x-2">
                {meeting.participants.slice(0, 4).map((p) => (
                  <Tooltip key={p.id}>
                    <TooltipTrigger asChild>
                      <Avatar className="h-7 w-7 border-2 border-background ring-1 ring-border hover:scale-110 transition-transform">
                        <AvatarImage src={p.avatar} />
                        <AvatarFallback className="text-xs">{p.avatar}</AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent>{p.name}</TooltipContent>
                  </Tooltip>
                ))}
              </div>
              {meeting.participants.length > 4 && (
                <span className="text-xs text-muted-foreground">
                  +{meeting.participants.length - 4} more
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2">
            {minutesUntil <= 5 && minutesUntil > 0 && (
              <Button size="sm" className="btn-gold-lux animate-pulse">
                <Zap className="h-4 w-4 mr-1" />
                Join Now
              </Button>
            )}
            {minutesUntil > 5 && meeting.status === 'scheduled' && (
              <Button size="sm" variant="outline">
                View Details
              </Button>
            )}
            {meeting.status === 'completed' && !meeting.minutesCompleted && (
              <Button size="sm" variant="default" className="bg-danger hover:bg-danger/90">
                <FileCheck className="h-4 w-4 mr-1" />
                Add Minutes
              </Button>
            )}
          </div>
        </div>

        {/* Proximity Alert */}
        {minutesUntil <= 15 && minutesUntil > 0 && (
          <Alert className="mt-3 bg-warn/10 border-warn">
            <Clock className="h-4 w-4 text-warn" />
            <AlertDescription className="text-warn-foreground">
              Starting in {minutesUntil} minute{minutesUntil !== 1 ? 's' : ''}
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 2. QUICK STATS KPI CARDS
// ============================================================================

export function QuickStatsBar({ meetings }: { meetings: Meeting[] }) {
  const stats = useMemo(() => {
    const needsMinutes = meetings.filter(m => m.status === 'completed' && !m.minutesCompleted).length;
    const thisWeek = meetings.filter(m => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      return m.scheduledStart >= weekStart;
    }).length;
    const completedThisQuarter = meetings.filter(m => {
      const quarterStart = new Date();
      quarterStart.setMonth(Math.floor(quarterStart.getMonth() / 3) * 3, 1);
      return m.status === 'completed' && m.minutesCompleted && m.scheduledStart >= quarterStart;
    }).length;
    const todayDuration = meetings
      .filter(m => isToday(m.scheduledStart))
      .reduce((sum, m) => sum + m.duration, 0);

    return { needsMinutes, thisWeek, completedThisQuarter, todayDuration };
  }, [meetings]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Needs Minutes (Urgent) */}
      <Card className={cn(
        'card-glow-lux',
        stats.needsMinutes > 0 && 'border-danger bg-danger/5'
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Needs Minutes</p>
              <p className="text-3xl font-bold text-danger">{stats.needsMinutes}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-danger/10 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-danger" />
            </div>
          </div>
          {stats.needsMinutes > 0 && (
            <p className="text-xs text-danger mt-2">⚠️ Action required</p>
          )}
        </CardContent>
      </Card>

      {/* This Week */}
      <Card className="card-glow-lux">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">This Week</p>
              <p className="text-3xl font-bold text-foreground">{stats.thisWeek}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completed This Quarter */}
      <Card className="card-glow-lux">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Complete This Q</p>
              <p className="text-3xl font-bold text-success">{stats.completedThisQuarter}</p>
            </div>
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
          </div>
          <div className="flex items-center gap-1 mt-2">
            <TrendingUp className="h-3 w-3 text-success" />
            <p className="text-xs text-success">+12% vs last Q</p>
          </div>
        </CardContent>
      </Card>

      {/* Today's Duration */}
      <Card className="card-glow-lux">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Today</p>
              <p className="text-3xl font-bold text-foreground">
                {Math.floor(stats.todayDuration / 60)}h {stats.todayDuration % 60}m
              </p>
            </div>
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// 3. CALENDAR HEATMAP
// ============================================================================

export function CalendarHeatmap({ meetings }: { meetings: Meeting[] }) {
  const heatmapData = useMemo(() => {
    const data: Array<{ date: string; count: number }> = [];
    const startDate = new Date();
    startDate.setDate(1); // Start of current month

    for (let i = 0; i < 35; i++) { // 5 weeks
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      const dateKey = format(date, 'yyyy-MM-dd');

      const count = meetings.filter(m =>
        format(m.scheduledStart, 'yyyy-MM-dd') === dateKey
      ).length;

      data.push({ date: dateKey, count });
    }

    return data;
  }, [meetings]);

  return (
    <Card className="bg-lux-surface">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Meeting Activity</CardTitle>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-muted" />
              <span>0-1</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-primary/30" />
              <span>2-3</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-primary/60" />
              <span>4-5</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-primary" />
              <span>6+</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2">
          {heatmapData.map((day) => (
            <Tooltip key={day.date}>
              <TooltipTrigger asChild>
                <button
                  className={cn(
                    'aspect-square rounded-md transition-all hover:scale-110 hover:ring-2 hover:ring-primary',
                    getHeatIntensity(day.count)
                  )}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p className="font-semibold">{format(parseISO(day.date), 'PP')}</p>
                <p className="text-sm">{day.count} meeting{day.count !== 1 ? 's' : ''}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// 4. MAGIC TODO SHEET
// ============================================================================

interface MagicTodoSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting: Meeting;
  onCreateTask: (task: any) => void;
}

export function MagicTodoSheet({ open, onOpenChange, meeting, onCreateTask }: MagicTodoSheetProps) {
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const taskTypes = [
    {
      id: 'self',
      icon: '📝',
      label: 'Self-Reminder',
      description: 'Personal task for me',
      color: 'bg-blue-50 border-blue-200 dark:bg-blue-950/20',
    },
    {
      id: 'assigned',
      icon: '👤',
      label: 'Push to Someone',
      description: 'Assign to a person',
      color: 'bg-purple-50 border-purple-200 dark:bg-purple-950/20',
    },
    {
      id: 'department',
      icon: '👥',
      label: 'Push to Department',
      description: 'Team task',
      color: 'bg-green-50 border-green-200 dark:bg-green-950/20',
    },
    {
      id: 'approval',
      icon: '✅',
      label: 'Link to Approval',
      description: 'Needs approval',
      color: 'bg-amber-50 border-amber-200 dark:bg-amber-950/20',
    },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
          {/* Context Card */}
          <Card className="bg-lux-gold-soft border-lux-gold">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center shrink-0">
                  {getMeetingIcon(meeting.type)}
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
                    selectedType === type.id && 'ring-2 ring-primary shadow-lux-strong'
                  )}
                  onClick={() => setSelectedType(type.id)}
                  data-interactive="true"
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-4xl mb-2">{type.icon}</div>
                    <p className="font-semibold text-sm mb-1">{type.label}</p>
                    <p className="text-xs text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Smart Suggestions (if AI detected) */}
          {selectedType === 'approval' && (
            <Alert className="bg-lux-gold-soft border-lux-gold">
              <Sparkles className="h-4 w-4 text-lux-gold" />
              <AlertTitle>Smart Detection</AlertTitle>
              <AlertDescription>
                We detected a budget approval request in your meeting minutes.
                This will be auto-routed to your CEO approval workflow.
              </AlertDescription>
            </Alert>
          )}

          {/* Form would go here based on selectedType */}
          {selectedType && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm text-muted-foreground">
                [Task form for {selectedType} would render here]
              </p>
            </div>
          )}
        </div>

        <SheetFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            className="btn-gold-lux"
            disabled={!selectedType}
            onClick={() => {
              // Create task logic
              onOpenChange(false);
            }}
          >
            <Zap className="h-4 w-4 mr-2" />
            Create Action & Link to Case
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ============================================================================
// 5. MINUTES COMPLETION DIALOG (Compact Example)
// ============================================================================

export function MinutesCompletionCard({ meeting }: { meeting: Meeting }) {
  const [checkedItems, setCheckedItems] = useState<string[]>(meeting.agendaItems || []);

  return (
    <Card className="bg-lux-surface shadow-lux">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          Complete Meeting Minutes
        </CardTitle>
        <CardDescription>
          Review what was discussed (pre-filled from agenda)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Discussed Items */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold">💬 What Was Discussed</Label>
          {meeting.agendaItems?.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <Checkbox
                id={`item-${idx}`}
                checked={checkedItems.includes(item)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setCheckedItems([...checkedItems, item]);
                  } else {
                    setCheckedItems(checkedItems.filter(i => i !== item));
                  }
                }}
              />
              <Label htmlFor={`item-${idx}`} className="flex-1 font-normal cursor-pointer">
                {item}
              </Label>
              {checkedItems.includes(item) && (
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
              )}
            </div>
          ))}
        </div>

        <Button className="w-full btn-gold-lux">
          <Sparkles className="h-4 w-4 mr-2" />
          Complete & Create Actions
        </Button>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getMeetingIcon(type: string) {
  switch (type) {
    case 'video':
      return <Video className="h-4 w-4" />;
    case 'physical':
      return <MapPin className="h-4 w-4" />;
    case 'phone':
      return <Phone className="h-4 w-4" />;
    default:
      return <Calendar className="h-4 w-4" />;
  }
}

function getProximityStyle(scheduledStart: Date) {
  const minutesUntil = differenceInMinutes(scheduledStart, new Date());

  if (minutesUntil <= 5 && minutesUntil > 0) {
    return {
      badge: 'bg-danger text-danger-foreground',
      accent: 'bg-danger',
    };
  }
  if (minutesUntil <= 30 && minutesUntil > 0) {
    return {
      badge: 'bg-warn text-warn-foreground',
      accent: 'bg-warn',
    };
  }
  if (minutesUntil <= 120 && minutesUntil > 0) {
    return {
      badge: 'bg-info text-info-foreground',
      accent: 'bg-info',
    };
  }
  return {
    badge: 'bg-muted text-muted-foreground',
    accent: 'bg-muted',
  };
}

function getHeatIntensity(count: number) {
  if (count === 0) return 'bg-muted';
  if (count <= 2) return 'bg-primary/30';
  if (count <= 4) return 'bg-primary/60';
  return 'bg-primary';
}
