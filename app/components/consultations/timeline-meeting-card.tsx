'use client';

import { format, differenceInMinutes } from 'date-fns';
import {
  Video,
  MapPin,
  Phone,
  Calendar,
  Clock,
  Users,
  CheckCircle2,
  Zap,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Meeting } from './types';

interface TimelineMeetingCardProps {
  meeting: Meeting;
  onClick?: () => void;
  onJoinMeeting?: () => void;
  onCompleteMinutes?: () => void;
  onCreateTask?: () => void;
}

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
      badge: 'bg-danger text-destructive-foreground',
      accent: 'bg-danger',
      shouldPulse: true,
    };
  }
  if (minutesUntil <= 30 && minutesUntil > 0) {
    return {
      badge: 'bg-warn text-white',
      accent: 'bg-warn',
      shouldPulse: false,
    };
  }
  if (minutesUntil <= 120 && minutesUntil > 0) {
    return {
      badge: 'bg-info text-white',
      accent: 'bg-info',
      shouldPulse: false,
    };
  }
  return {
    badge: 'bg-muted text-muted-foreground',
    accent: 'bg-muted',
    shouldPulse: false,
  };
}

export function TimelineMeetingCard({
  meeting,
  onClick,
  onJoinMeeting,
  onCompleteMinutes,
  onCreateTask,
}: TimelineMeetingCardProps) {
  const proximityStyle = getProximityStyle(meeting.scheduledStart);
  const minutesUntil = differenceInMinutes(meeting.scheduledStart, new Date());

  return (
    <TooltipProvider>
      <Card
        className={cn(
          'card-glow-lux overflow-hidden cursor-pointer transition-all duration-lux-base',
          proximityStyle.shouldPulse && 'animate-pulse'
        )}
        data-interactive="true"
        onClick={onClick}
      >
        {/* Top accent bar */}
        <div
          className={cn(
            'h-1 w-full transition-all duration-[var(--ax-motion-slow)]',
            proximityStyle.accent
          )}
        />

        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            {/* Time Badge */}
            <div
              className={cn(
                'flex flex-col items-center justify-center rounded-lg px-3 py-2 min-w-20',
                proximityStyle.badge
              )}
            >
              <span className="text-xl font-bold">
                {format(meeting.scheduledStart, 'HH:mm')}
              </span>
              <span className="text-xs opacity-80">{meeting.duration}m</span>
            </div>

            {/* Meeting Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <Badge variant="outline" className="gap-1">
                  {getMeetingIcon(meeting.type)}
                  <span className="capitalize">{meeting.type}</span>
                </Badge>
                <Badge variant="secondary">{meeting.caseId}</Badge>
                {meeting.minutesCompleted && (
                  <Badge variant="default" className="gap-1 bg-success text-white hover:bg-success/90">
                    <CheckCircle2 className="h-3 w-3" />
                    Complete
                  </Badge>
                )}
              </div>

              <h4 className="font-semibold text-base mb-2">{meeting.title}</h4>

              <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                {meeting.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {meeting.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {meeting.participants.length} participant
                  {meeting.participants.length !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Participants Avatars */}
              <div className="mt-3 flex items-center gap-2">
                <div className="flex -space-x-2">
                  {meeting.participants.slice(0, 4).map((p) => (
                    <Tooltip key={p.id}>
                      <TooltipTrigger asChild>
                        <Avatar className="h-7 w-7 border-2 border-background ring-1 ring-border hover:scale-110 transition-transform cursor-pointer">
                          <AvatarFallback className="text-xs">
                            {p.avatar}
                          </AvatarFallback>
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
                <Button
                  size="sm"
                  className="btn-gold-lux animate-pulse-glow"
                  onClick={(e) => {
                    e.stopPropagation();
                    onJoinMeeting?.();
                  }}
                >
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
                <Button
                  size="sm"
                  variant="default"
                  className="bg-danger hover:bg-danger/90 text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCompleteMinutes?.();
                  }}
                >
                  <FileCheck className="h-4 w-4 mr-1" />
                  Add Minutes
                </Button>
              )}
              {meeting.status === 'completed' && meeting.minutesCompleted && onCreateTask && (
                <Button
                  size="sm"
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    onCreateTask();
                  }}
                >
                  <Sparkles className="h-4 w-4 mr-1" />
                  Create Task
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
    </TooltipProvider>
  );
}
