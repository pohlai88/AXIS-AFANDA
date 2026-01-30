'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Video,
  MapPin,
  Phone,
  Calendar,
  Clock,
  Users,
  FileText,
  CheckSquare,
  GitBranch,
  ArrowLeft,
  Play,
  CheckCircle2,
  Pen,
  LayoutGrid,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { VerticalTabsNav, type TabConfig } from '@/app/components/consultations/vertical-tabs-nav';
import { LiveMeetingRoom } from '@/app/components/consultations/live-meeting-room';
import { CaseTrailTimeline } from '@/app/components/consultations/case-trail-timeline';
import { ConnectionStatusIndicator } from '@/app/components/consultations/connection-status-indicator';
import { useMeetingUpdates } from '@/app/hooks/use-meeting-updates';
import { DetailPageSkeleton } from '@/app/components/consultations/loading-skeleton';
import { useConsultationsStore } from '@/app/lib/stores/consultations-store';

// Mock meeting data (enhanced with joined status)
type MeetingStatus = 'scheduled' | 'in-progress' | 'completed' | 'cancelled';

// Generate mock data with stable timestamps
const generateMockData = () => {
  const now = Date.now();
  return {
    meeting: {
      id: '1',
      caseId: 'CASE-2024-001',
      title: 'Q1 Budget Review',
      type: 'video' as const,
      status: 'in-progress' as MeetingStatus,
      scheduledStart: new Date(now - 3600000), // 1 hour ago
      scheduledEnd: new Date(now + 3600000), // 1 hour from now
      duration: 120,
      organizerId: 'user-1',
      participants: [
        { id: '1', name: 'Sarah Chen', avatar: 'SC', role: 'CFO', joined: true },
        { id: '2', name: 'Mike Johnson', avatar: 'MJ', role: 'CEO', joined: true },
        { id: '3', name: 'Emma Wilson', avatar: 'EW', role: 'Manager', joined: false },
      ],
      agendaItems: ['Budget Review', 'Timeline Discussion', 'Resource Planning'],
      minutesCompleted: false,
      minutesData: null as { attendance: string[]; decisions: string[]; outcome: string } | null,
      todos: [] as Array<{
        id: string;
        title: string;
        priority: string;
        type: string;
        status: string;
        assignedTo?: string;
        dueDate: Date;
      }>,
    },
    caseTrail: {
      id: 'CASE-2024-001',
      events: [
        {
          id: 'event-1',
          type: 'meeting' as const,
          timestamp: new Date(now - 172800000), // 2 days ago
          description: 'Meeting scheduled: Q1 Budget Review',
          userName: 'System',
        },
        {
          id: 'event-2',
          type: 'approval' as const,
          timestamp: new Date(now - 86400000), // 1 day ago
          description: 'Budget proposal approved by CEO',
          userName: 'Mike Johnson',
          metadata: { amount: '$50,000', department: 'Engineering' },
        },
        {
          id: 'event-3',
          type: 'meeting' as const,
          timestamp: new Date(now - 3600000), // 1 hour ago
          description: 'Meeting started: Q1 Budget Review',
          userName: 'System',
        },
        {
          id: 'event-4',
          type: 'task' as const,
          timestamp: new Date(now + 86400000), // 1 day from now
          description: 'Follow-up meeting scheduled',
          userName: 'Sarah Chen',
        },
      ],
    },
  };
};

const { meeting: mockMeeting, caseTrail: mockCaseTrail } = generateMockData();

export default function MeetingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params.id as string;
  const [meeting, setMeeting] = useState(mockMeeting);
  const [caseTrail] = useState(mockCaseTrail);
  const [activeTab, setActiveTab] = useState('room');
  const [isLoading, setIsLoading] = useState(true);

  // Use Zustand store for state management
  const {
    selectedMeeting,
    fetchMeeting,
    startMeeting,
    completeMeeting,
  } = useConsultationsStore();

  // Fetch meeting on mount
  useEffect(() => {
    fetchMeeting(meetingId).then(() => {
      setIsLoading(false);
    }).catch((error) => {
      console.error('Failed to load meeting:', error);
      setIsLoading(false);
    });
  }, [meetingId, fetchMeeting]);

  // Real-time updates for this specific meeting
  const { isConnected, error } = useMeetingUpdates(meetingId, {
    enabled: true,
    showToasts: true,
    onUpdate: (update) => {
      console.log('Meeting update:', update);

      // Refresh meeting data from store
      fetchMeeting(meetingId).catch(console.error);

      // Update local UI state based on update type
      switch (update.type) {
        case 'participant_joined':
          setMeeting((prev) => ({
            ...prev,
            participants: prev.participants.map((p) =>
              p.id === update.data.userId
                ? { ...p, joined: true }
                : p
            ),
          }));
          break;
        case 'participant_left':
          setMeeting((prev) => ({
            ...prev,
            participants: prev.participants.map((p) =>
              p.id === update.data.userId
                ? { ...p, joined: false }
                : p
            ),
          }));
          break;
        case 'status_changed':
          setMeeting((prev) => {
            const newStatus = update.data.newStatus;
            if (newStatus === 'scheduled' || newStatus === 'in-progress' || newStatus === 'completed' || newStatus === 'cancelled') {
              return {
                ...prev,
                status: newStatus,
              };
            }
            return prev;
          });
          break;
        case 'minutes_completed':
          setMeeting((prev) => ({
            ...prev,
            minutesCompleted: true,
          }));
          break;
      }
    },
  });

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const getMeetingIcon = (type: string) => {
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
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-[hsl(var(--info))]';
      case 'in-progress':
        return 'bg-[hsl(var(--warn))]';
      case 'completed':
        return 'bg-[hsl(var(--success))]';
      case 'cancelled':
        return 'bg-muted';
      default:
        return 'bg-muted';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const tabs: TabConfig[] = [
    {
      id: 'room',
      icon: <Video className="h-5 w-5" />,
      label: 'Room',
      badge: meeting.status === 'in-progress' ? '🔴' : null,
    },
    {
      id: 'agenda',
      icon: <LayoutGrid className="h-5 w-5" />,
      label: 'Plan',
      badge: null,
    },
    {
      id: 'minutes',
      icon: <Pen className="h-5 w-5" />,
      label: 'Minutes',
      badge: meeting.minutesCompleted ? null : '!',
      badgeVariant: 'destructive',
    },
    {
      id: 'actions',
      icon: <CheckSquare className="h-5 w-5" />,
      label: 'Actions',
      badge: meeting.todos.length > 0 ? meeting.todos.length : null,
    },
    {
      id: 'trail',
      icon: <GitBranch className="h-5 w-5" />,
      label: 'Trail',
      badge: null,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'room':
        return (
          <LiveMeetingRoom
            meeting={meeting}
            onJoinMeeting={() => {
              console.log('Joining meeting:', meetingId);
              // TODO: Open Jitsi in fullscreen or new window
            }}
          />
        );

      case 'agenda':
        return (
          <div className="p-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>📋 Meeting Agenda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {meeting.agendaItems.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shrink-0">
                        {idx + 1}
                      </div>
                      <span className="flex-1">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Participants */}
            <Card>
              <CardHeader>
                <CardTitle>👥 Participants</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {meeting.participants.map((p) => (
                    <div key={p.id} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shrink-0">
                        {p.avatar}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{p.name}</div>
                        <div className="text-sm text-muted-foreground">{p.role}</div>
                      </div>
                      {p.joined && (
                        <Badge variant="secondary" className="text-xs">
                          Joined
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'minutes':
        return (
          <div className="p-6 space-y-6">
            {meeting.minutesCompleted && meeting.minutesData ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    Minutes Completed
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Attendance */}
                  <div>
                    <h3 className="mb-3 font-semibold">✅ Attendance</h3>
                    <div className="flex flex-wrap gap-2">
                      {meeting.minutesData.attendance.map((name) => (
                        <Badge key={name} variant="secondary">
                          {name}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Discussed Items */}
                  <div>
                    <h3 className="mb-3 font-semibold">💬 What Was Discussed</h3>
                    <div className="space-y-2">
                      {meeting.agendaItems.map((item) => (
                        <div key={item} className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-success" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Decisions */}
                  <div>
                    <h3 className="mb-3 font-semibold">✨ Decisions Made</h3>
                    <div className="flex flex-wrap gap-2">
                      {meeting.minutesData.decisions.map((decision) => (
                        <Badge key={decision} variant="default">
                          {decision}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Outcome */}
                  <div>
                    <h3 className="mb-3 font-semibold">🎯 Outcome</h3>
                    <Badge variant="default" className="text-base">
                      {meeting.minutesData.outcome}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">Minutes Not Yet Completed</h3>
                  <p className="mt-2 text-center text-sm text-muted-foreground max-w-md">
                    Complete the meeting minutes to create actions and update the case trail
                  </p>
                  <Button className="mt-6 btn-gold-lux">
                    <FileText className="h-4 w-4 mr-2" />
                    Complete Minutes
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'actions':
        return (
          <div className="p-6 space-y-4">
            {meeting.todos.length > 0 ? (
              meeting.todos.map((todo) => (
                <Card key={todo.id}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant={getPriorityColor(todo.priority)}>{todo.priority}</Badge>
                          <Badge variant="outline">{todo.type}</Badge>
                          <Badge variant={todo.status === 'completed' ? 'default' : 'secondary'}>
                            {todo.status}
                          </Badge>
                        </div>
                        <h3 className="font-semibold">{todo.title}</h3>
                        {todo.assignedTo && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            Assigned to: {todo.assignedTo}
                          </p>
                        )}
                        <p className="mt-2 text-sm text-muted-foreground">
                          Due: {format(todo.dueDate, 'PPP')}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        Update Status
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-12">
                  <CheckSquare className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold">No Actions Yet</h3>
                  <p className="mt-2 text-center text-sm text-muted-foreground max-w-md">
                    Actions from meeting minutes will appear here, or create new tasks using the AI suggestions
                  </p>
                  <Button className="mt-6" variant="outline">
                    <CheckSquare className="h-4 w-4 mr-2" />
                    Create Action
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 'trail':
        return (
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight mb-2">
                🔗 Case Trail: {meeting.caseId}
              </h2>
              <p className="text-sm text-muted-foreground">
                Complete history of all events related to this case
              </p>
            </div>
            <CaseTrailTimeline caseId={caseTrail.id} events={caseTrail.events} />
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4 shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              {getMeetingIcon(meeting.type)}
              <h1 className="text-2xl font-semibold tracking-tight">{meeting.title}</h1>
              <Badge variant="outline">{meeting.caseId}</Badge>
              <div className={cn('h-2 w-2 rounded-full', getStatusColor(meeting.status))} />
              <span className="text-sm capitalize text-muted-foreground">{meeting.status}</span>
            </div>
            <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(meeting.scheduledStart, 'PPP')}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {meeting.duration} min
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {meeting.participants.length} participants
              </div>
              <ConnectionStatusIndicator
                isConnected={isConnected}
                error={error}
                showLabel={true}
              />
            </div>
          </div>
          {meeting.type === 'video' &&
            (meeting.status === 'scheduled' || meeting.status === 'in-progress' || meeting.status === 'completed' || meeting.status === 'cancelled') &&
            (meeting.status === 'scheduled' || meeting.status === 'in-progress') && (
              <Button size="lg" className="btn-gold-lux shrink-0 hidden sm:flex">
                <Play className="mr-2 h-5 w-5" />
                Join Meeting
              </Button>
            )}
        </div>
      </div>

      {/* Content with Vertical Tabs */}
      <div className="flex flex-1 overflow-hidden">
        {/* Vertical Tabs Navigation */}
        <VerticalTabsNav tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Tab Content */}
        <div className="flex-1 overflow-auto bg-background">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
