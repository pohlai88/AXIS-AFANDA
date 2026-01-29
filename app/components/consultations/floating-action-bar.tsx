'use client';

import { X } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Video, MapPin, Phone, Calendar } from 'lucide-react';
import type { Meeting } from './types';

interface FloatingActionBarProps {
  meeting: Meeting | null;
  onClose: () => void;
  onViewCase: () => void;
  onJoinMeeting: () => void;
}

function getMeetingIcon(type: string) {
  switch (type) {
    case 'video':
      return <Video className="h-5 w-5" />;
    case 'physical':
      return <MapPin className="h-5 w-5" />;
    case 'phone':
      return <Phone className="h-5 w-5" />;
    default:
      return <Calendar className="h-5 w-5" />;
  }
}

export function FloatingActionBar({
  meeting,
  onClose,
  onViewCase,
  onJoinMeeting,
}: FloatingActionBarProps) {
  if (!meeting) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
      <Card className="bg-lux-surface/95 backdrop-blur-lg shadow-lux-strong border-lux min-w-[400px] max-w-[600px]">
        <CardContent className="p-4 flex items-center gap-4">
          {/* Meeting Icon */}
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-primary/10 text-primary">
              {getMeetingIcon(meeting.type)}
            </AvatarFallback>
          </Avatar>

          {/* Meeting Info */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{meeting.title}</p>
            <p className="text-xs text-muted-foreground">{meeting.caseId}</p>
          </div>

          <Separator orientation="vertical" className="h-10" />

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={onViewCase}>
              View Case
            </Button>
            <Button size="sm" className="btn-gold-lux" onClick={onJoinMeeting}>
              {meeting.type === 'video' ? 'Join Meeting' : 'Start Meeting'}
            </Button>
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
