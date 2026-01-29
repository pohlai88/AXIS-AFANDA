'use client';

import { useMemo } from 'react';
import { format, isToday, isTomorrow, differenceInMinutes } from 'date-fns';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { Meeting } from './types';
import { TimelineMeetingCard } from './timeline-meeting-card';

interface TimelineViewProps {
  meetings: Meeting[];
  onMeetingClick?: (meetingId: string) => void;
  onJoinMeeting?: (meetingId: string) => void;
  onCompleteMinutes?: (meetingId: string) => void;
  onCreateTask?: (meetingId: string) => void;
}

interface GroupedMeetings {
  [dateKey: string]: {
    label: string;
    meetings: Meeting[];
  };
}

export function TimelineView({
  meetings,
  onMeetingClick,
  onJoinMeeting,
  onCompleteMinutes,
  onCreateTask
}: TimelineViewProps) {
  // Group meetings by date
  const groupedMeetings = useMemo(() => {
    const groups: GroupedMeetings = {};

    meetings.forEach((meeting) => {
      const dateKey = format(meeting.scheduledStart, 'yyyy-MM-dd');

      let label = format(meeting.scheduledStart, 'PPP');
      if (isToday(meeting.scheduledStart)) {
        label = `Today • ${format(meeting.scheduledStart, 'EEE MMM d')}`;
      } else if (isTomorrow(meeting.scheduledStart)) {
        label = `Tomorrow • ${format(meeting.scheduledStart, 'EEE MMM d')}`;
      }

      if (!groups[dateKey]) {
        groups[dateKey] = { label, meetings: [] };
      }
      groups[dateKey].meetings.push(meeting);
    });

    // Sort by date
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [meetings]);

  if (groupedMeetings.length === 0) {
    return null;
  }

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
              <TimelineMeetingCard
                key={meeting.id}
                meeting={meeting}
                onClick={() => onMeetingClick?.(meeting.id)}
                onJoinMeeting={() => onJoinMeeting?.(meeting.id)}
                onCompleteMinutes={() => onCompleteMinutes?.(meeting.id)}
                onCreateTask={() => onCreateTask?.(meeting.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
