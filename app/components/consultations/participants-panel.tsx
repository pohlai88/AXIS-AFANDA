'use client';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { User, Users } from 'lucide-react';

interface Participant {
  id: string;
  name: string;
  avatar: string;
  role?: string;
  joined?: boolean;
}

interface ParticipantsPanelProps {
  participants: Participant[];
  showJoinStatus?: boolean;
}

export function ParticipantsPanel({
  participants,
  showJoinStatus = false
}: ParticipantsPanelProps) {
  const joinedCount = participants.filter(p => p.joined).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Users className="h-4 w-4" />
          Participants ({participants.length})
          {showJoinStatus && joinedCount > 0 && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {joinedCount} joined
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {participants.map((participant) => (
            <div
              key={participant.id}
              className="flex flex-col items-center text-center"
            >
              <div className="relative">
                <Avatar className="h-12 w-12 mb-2 border-2 border-muted">
                  <AvatarFallback className="text-sm font-semibold">
                    {participant.avatar}
                  </AvatarFallback>
                </Avatar>
                {showJoinStatus && (
                  <div
                    className={cn(
                      "absolute bottom-2 right-0 w-3 h-3 rounded-full border-2 border-background",
                      participant.joined ? "bg-success" : "bg-muted"
                    )}
                    title={participant.joined ? "Joined" : "Not joined"}
                  />
                )}
              </div>
              <p className="text-xs font-medium truncate w-full px-1">
                {participant.name}
              </p>
              {participant.role && (
                <p className="text-xs text-muted-foreground truncate w-full px-1">
                  {participant.role}
                </p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
