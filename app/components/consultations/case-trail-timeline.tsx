'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import {
  Calendar,
  FileText,
  CheckSquare,
  AlertCircle,
  Clock,
  User,
  TrendingUp,
  GitBranch
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface CaseEvent {
  id: string;
  type: 'meeting' | 'note' | 'task' | 'approval' | 'status' | 'document';
  timestamp: Date;
  description: string;
  userName: string;
  metadata?: Record<string, any>;
}

interface CaseTrailTimelineProps {
  caseId: string;
  events: CaseEvent[];
}

function getEventIcon(type: string) {
  switch (type) {
    case 'meeting':
      return <Calendar className="h-4 w-4" />;
    case 'note':
      return <FileText className="h-4 w-4" />;
    case 'task':
      return <CheckSquare className="h-4 w-4" />;
    case 'approval':
      return <TrendingUp className="h-4 w-4" />;
    case 'status':
      return <AlertCircle className="h-4 w-4" />;
    case 'document':
      return <FileText className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
}

function getEventColor(type: string) {
  switch (type) {
    case 'meeting':
      return 'bg-blue-500 text-white';
    case 'note':
      return 'bg-purple-500 text-white';
    case 'task':
      return 'bg-green-500 text-white';
    case 'approval':
      return 'bg-amber-500 text-white';
    case 'status':
      return 'bg-orange-500 text-white';
    case 'document':
      return 'bg-cyan-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

function groupEventsByPhase(events: CaseEvent[]) {
  const now = new Date();
  const past: CaseEvent[] = [];
  const present: CaseEvent[] = [];
  const future: CaseEvent[] = [];

  events.forEach((event) => {
    const daysDiff = Math.floor(
      (event.timestamp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysDiff < -1) {
      past.push(event);
    } else if (daysDiff <= 1) {
      present.push(event);
    } else {
      future.push(event);
    }
  });

  // Sort each group by timestamp (most recent first)
  past.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  present.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  future.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());

  return { past, present, future };
}

export function CaseTrailTimeline({ caseId, events }: CaseTrailTimelineProps) {
  const grouped = groupEventsByPhase(events);
  const phases = [
    { id: 'present', label: '🟢 Present', events: grouped.present, badgeVariant: 'default' as const },
    { id: 'past', label: '⏪ Past', events: grouped.past, badgeVariant: 'secondary' as const },
    { id: 'future', label: '⏩ Future', events: grouped.future, badgeVariant: 'outline' as const },
  ];

  return (
    <div className="space-y-12">
      {phases.map((phase) => {
        if (phase.events.length === 0) return null;

        return (
          <div key={phase.id} className="space-y-4">
            {/* Phase Header */}
            <div className="flex items-center gap-3">
              <Badge variant={phase.badgeVariant} className="text-sm px-3 py-1">
                {phase.label}
              </Badge>
              <Separator className="flex-1" />
            </div>

            {/* Events in Phase */}
            <div className="relative pl-8 border-l-2 border-primary/30 space-y-6">
              {phase.events.map((event, idx) => (
                <div key={event.id} className="relative">
                  {/* Timeline Dot */}
                  <div
                    className={cn(
                      'absolute -left-[37px] w-8 h-8 rounded-full',
                      'border-2 border-background',
                      'flex items-center justify-center',
                      'shadow-lux transition-all hover:scale-110 cursor-pointer',
                      getEventColor(event.type)
                    )}
                    title={event.type}
                  >
                    {getEventIcon(event.type)}
                  </div>

                  {/* Event Card */}
                  <Card className="card-glow-lux hover:shadow-lux-strong transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="capitalize text-xs">
                              {event.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                            </span>
                          </div>
                          <p className="font-medium mb-1">{event.description}</p>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            {event.userName}
                          </div>
                          {event.metadata && Object.keys(event.metadata).length > 0 && (
                            <div className="mt-2 pt-2 border-t text-xs text-muted-foreground">
                              {Object.entries(event.metadata).map(([key, value]) => (
                                <div key={key} className="flex gap-2">
                                  <span className="font-medium capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}:
                                  </span>
                                  <span>{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button size="sm" variant="ghost" className="shrink-0">
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {events.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-12">
            <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Case Trail Yet</h3>
            <p className="text-sm text-muted-foreground text-center mt-2">
              Events will appear here as the case progresses
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
