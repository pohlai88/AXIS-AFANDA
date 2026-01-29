'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Video, MapPin, Phone, ExternalLink, Info } from 'lucide-react';
import { ParticipantsPanel } from './participants-panel';
import { CollaborativeNotesCard } from './collaborative-notes-card';
import { AISuggestionsPanel } from './ai-suggestions-panel';
import { ShimmerButton } from '@/components/ui/shimmer-button';

interface Meeting {
  id: string;
  type: 'video' | 'physical' | 'phone';
  status: string;
  participants: Array<{
    id: string;
    name: string;
    avatar: string;
    role?: string;
    joined?: boolean;
  }>;
}

interface LiveMeetingRoomProps {
  meeting: Meeting;
  onJoinMeeting?: () => void;
}

function getMeetingTypeInfo(type: string) {
  switch (type) {
    case 'video':
      return {
        icon: <Video className="h-5 w-5" />,
        label: 'Video Conference',
        color: 'bg-blue-500',
      };
    case 'physical':
      return {
        icon: <MapPin className="h-5 w-5" />,
        label: 'In-Person Meeting',
        color: 'bg-green-500',
      };
    case 'phone':
      return {
        icon: <Phone className="h-5 w-5" />,
        label: 'Phone Call',
        color: 'bg-purple-500',
      };
    default:
      return {
        icon: <Video className="h-5 w-5" />,
        label: 'Meeting',
        color: 'bg-gray-500',
      };
  }
}

export function LiveMeetingRoom({ meeting, onJoinMeeting }: LiveMeetingRoomProps) {
  const typeInfo = getMeetingTypeInfo(meeting.type);
  const isActive = meeting.status === 'in-progress' || meeting.status === 'scheduled';
  const isCompleted = meeting.status === 'completed';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
      {/* Left Column: Video/Meeting Interface */}
      <div className="space-y-4">
        {/* Meeting Type Card */}
        <Card className="aspect-video bg-linear-to-br from-background to-muted rounded-xl overflow-hidden relative">
          <CardContent className="p-0 h-full flex flex-col items-center justify-center">
            {meeting.type === 'video' && isActive ? (
              <>
                {/* Placeholder for Jitsi embed */}
                <div className="w-full h-full bg-black flex flex-col items-center justify-center">
                  <Video className="h-16 w-16 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Video Conference Room
                  </h3>
                  <p className="text-sm text-gray-400 mb-6 text-center max-w-md px-4">
                    Jitsi Meet integration will appear here. Click below to join the meeting.
                  </p>
                  <ShimmerButton
                    size="lg"
                    className="btn-gold-lux"
                    onClick={onJoinMeeting}
                  >
                    <Video className="h-5 w-5 mr-2" />
                    Join Video Meeting
                  </ShimmerButton>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="mt-3 text-gray-400 hover:text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in new window
                  </Button>
                </div>
              </>
            ) : meeting.type === 'physical' ? (
              <div className="text-center p-8">
                <div className={`w-16 h-16 rounded-full ${typeInfo.color} flex items-center justify-center mx-auto mb-4`}>
                  {typeInfo.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{typeInfo.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {isCompleted
                    ? 'This was an in-person meeting.'
                    : 'Meeting location details will appear here.'
                  }
                </p>
              </div>
            ) : meeting.type === 'phone' ? (
              <div className="text-center p-8">
                <div className={`w-16 h-16 rounded-full ${typeInfo.color} flex items-center justify-center mx-auto mb-4`}>
                  {typeInfo.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{typeInfo.label}</h3>
                <p className="text-sm text-muted-foreground">
                  {isCompleted
                    ? 'This was a phone conference.'
                    : 'Conference dial-in details will appear here.'
                  }
                </p>
              </div>
            ) : (
              <div className="text-center p-8">
                <Video className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  Meeting interface will appear here
                </p>
              </div>
            )}

            {/* Status Badge */}
            <div className="absolute top-4 right-4">
              <Badge
                variant={isActive ? 'default' : 'secondary'}
                className="capitalize"
              >
                {meeting.status}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Participants Panel */}
        <ParticipantsPanel
          participants={meeting.participants}
          showJoinStatus={isActive}
        />

        {/* Meeting Info Alert */}
        {isActive && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Active Meeting</AlertTitle>
            <AlertDescription className="text-xs">
              Notes and AI suggestions are being captured in real-time.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Right Column: Notes & AI */}
      <div className="space-y-4">
        {/* Collaborative Notes */}
        <CollaborativeNotesCard
          boardId={`meeting-${meeting.id}`}
          collaborators={isActive ? 2 : 0}
          readOnly={isCompleted}
        />

        {/* AI Suggestions */}
        {isActive && (
          <AISuggestionsPanel
            meetingId={meeting.id}
            onAddTask={(suggestion) => {
              console.log('Add task from AI suggestion:', suggestion);
              // TODO: Open MagicToDo sheet or create task directly
            }}
          />
        )}
      </div>
    </div>
  );
}
