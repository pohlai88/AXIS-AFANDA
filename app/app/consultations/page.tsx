'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Search, Calendar, AlertCircle } from 'lucide-react';
import { MeetingFlowDialog } from '@/app/components/consultations/meeting-flow-dialog';
import { QuickStatsBar } from '@/app/components/consultations/quick-stats-bar';
import { TimelineView } from '@/app/components/consultations/timeline-view';
import { CalendarHeatmap } from '@/app/components/consultations/calendar-heatmap';
import { FloatingActionBar } from '@/app/components/consultations/floating-action-bar';
import { MagicTodoSheet } from '@/app/components/consultations/magic-todo-sheet';
import { ConnectionStatusIndicator } from '@/app/components/consultations/connection-status-indicator';
import { useGlobalMeetingUpdates } from '@/app/hooks/use-meeting-updates';
import { TimelineSkeletonLoader, StatsBarSkeleton, HeatmapSkeleton } from '@/app/components/consultations/loading-skeleton';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import type { Meeting } from '@/app/components/consultations/types';

// Mock data with more variety
const mockMeetings: Meeting[] = [
  {
    id: '1',
    caseId: 'CASE-2024-001',
    title: 'Q1 Budget Review',
    type: 'video',
    status: 'scheduled',
    scheduledStart: new Date(Date.now() + 300000), // 5 minutes from now (urgent!)
    scheduledEnd: new Date(Date.now() + 3900000),
    duration: 60,
    participants: [
      { id: '1', name: 'Sarah Chen', avatar: 'SC' },
      { id: '2', name: 'Mike Johnson', avatar: 'MJ' },
      { id: '3', name: 'Emma Wilson', avatar: 'EW' },
    ],
    minutesCompleted: false,
    agendaItems: ['Budget Review', 'Timeline Discussion', 'Resource Planning'],
  },
  {
    id: '2',
    caseId: 'CASE-2024-002',
    title: 'Product Planning',
    type: 'physical',
    status: 'scheduled',
    scheduledStart: new Date(Date.now() + 18000000), // 5 hours from now
    scheduledEnd: new Date(Date.now() + 21600000),
    duration: 60,
    location: 'Office 3B',
    participants: [
      { id: '3', name: 'Emma Wilson', avatar: 'EW' },
      { id: '4', name: 'Alex Rodriguez', avatar: 'AR' },
    ],
    minutesCompleted: false,
  },
  {
    id: '3',
    caseId: 'CASE-2024-003',
    title: 'Engineering Sync',
    type: 'video',
    status: 'completed',
    scheduledStart: new Date(Date.now() - 86400000), // Yesterday
    scheduledEnd: new Date(Date.now() - 82800000),
    duration: 60,
    participants: [
      { id: '2', name: 'Mike Johnson', avatar: 'MJ' },
      { id: '4', name: 'Alex Rodriguez', avatar: 'AR' },
    ],
    minutesCompleted: false, // Needs minutes!
  },
  {
    id: '4',
    caseId: 'CASE-2024-004',
    title: 'Client Onboarding',
    type: 'video',
    status: 'completed',
    scheduledStart: new Date(Date.now() - 172800000), // 2 days ago
    scheduledEnd: new Date(Date.now() - 169200000),
    duration: 45,
    participants: [
      { id: '1', name: 'Sarah Chen', avatar: 'SC' },
      { id: '5', name: 'John Doe', avatar: 'JD' },
    ],
    minutesCompleted: false, // Needs minutes!
  },
  {
    id: '5',
    caseId: 'CASE-2024-005',
    title: 'Team Standup',
    type: 'video',
    status: 'completed',
    scheduledStart: new Date(Date.now() - 259200000), // 3 days ago
    scheduledEnd: new Date(Date.now() - 257400000),
    duration: 30,
    participants: [
      { id: '2', name: 'Mike Johnson', avatar: 'MJ' },
      { id: '3', name: 'Emma Wilson', avatar: 'EW' },
      { id: '4', name: 'Alex Rodriguez', avatar: 'AR' },
    ],
    minutesCompleted: false, // Needs minutes!
  },
  {
    id: '6',
    caseId: 'CASE-2024-006',
    title: 'Sprint Planning',
    type: 'video',
    status: 'scheduled',
    scheduledStart: new Date(Date.now() + 86400000), // Tomorrow
    scheduledEnd: new Date(Date.now() + 93600000),
    duration: 120,
    participants: [
      { id: '1', name: 'Sarah Chen', avatar: 'SC' },
      { id: '2', name: 'Mike Johnson', avatar: 'MJ' },
      { id: '3', name: 'Emma Wilson', avatar: 'EW' },
      { id: '4', name: 'Alex Rodriguez', avatar: 'AR' },
    ],
    minutesCompleted: false,
  },
  {
    id: '7',
    caseId: 'CASE-2024-007',
    title: 'Executive Review',
    type: 'physical',
    status: 'completed',
    scheduledStart: new Date(Date.now() - 604800000), // 1 week ago
    scheduledEnd: new Date(Date.now() - 597600000),
    duration: 90,
    location: 'Boardroom',
    participants: [
      { id: '1', name: 'Sarah Chen', avatar: 'SC' },
      { id: '2', name: 'Mike Johnson', avatar: 'MJ' },
    ],
    minutesCompleted: true,
  },
  {
    id: '8',
    caseId: 'CASE-2024-008',
    title: 'Marketing Strategy Session',
    type: 'video',
    status: 'completed',
    scheduledStart: new Date(Date.now() + 7200000), // 2 hours from now (shows in timeline)
    scheduledEnd: new Date(Date.now() + 10800000),
    duration: 60,
    participants: [
      { id: '1', name: 'Sarah Chen', avatar: 'SC' },
      { id: '3', name: 'Emma Wilson', avatar: 'EW' },
      { id: '5', name: 'John Doe', avatar: 'JD' },
    ],
    minutesCompleted: true,
    agendaItems: ['Q2 Campaign Planning', 'Budget Allocation', 'Team Expansion'],
  },
];

export default function ConsultationsPage() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'upcoming' | 'past' | 'all'>('upcoming');
  const [selectedMeeting, setSelectedMeeting] = useState<string | null>(null);
  const [showMeetingFlow, setShowMeetingFlow] = useState(false);
  const [showMagicTodo, setShowMagicTodo] = useState(false);
  const [magicTodoMeeting, setMagicTodoMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Real-time updates
  const { isConnected, error } = useGlobalMeetingUpdates({
    enabled: true,
    showToasts: true,
    onUpdate: (update) => {
      console.log('Global meeting update:', update);
      // TODO: Refresh meetings list when updates received
      // This would call an API to fetch updated data
    },
  });

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const filteredMeetings = mockMeetings.filter((meeting) => {
    const matchesSearch = meeting.title.toLowerCase().includes(search.toLowerCase()) ||
      meeting.caseId.toLowerCase().includes(search.toLowerCase());

    const now = new Date();
    const matchesFilter =
      filter === 'all' ||
      (filter === 'upcoming' && meeting.scheduledStart > now) ||
      (filter === 'past' && meeting.scheduledStart < now);

    return matchesSearch && matchesFilter;
  });

  const now = new Date();
  const upcomingMeetings = filteredMeetings.filter(m => m.scheduledStart > now);
  const pastMeetingsNeedingMinutes = filteredMeetings.filter(
    m => m.scheduledStart < now && !m.minutesCompleted
  );

  const handleJoinMeeting = (meetingId: string) => {
    console.log('Join meeting:', meetingId);
    // TODO: Navigate to meeting detail page or open Jitsi
  };

  const handleCompleteMinutes = (meetingId: string) => {
    console.log('Complete minutes for:', meetingId);
    setShowMeetingFlow(true);
  };

  const handleMeetingClick = (meetingId: string) => {
    setSelectedMeeting(meetingId);
  };

  const handleClearSelection = () => {
    setSelectedMeeting(null);
  };

  const handleViewCase = () => {
    if (selectedMeeting) {
      console.log('View case for meeting:', selectedMeeting);
      // TODO: Navigate to case detail page
    }
  };

  const selectedMeetingData = selectedMeeting
    ? mockMeetings.find((m) => m.id === selectedMeeting)
    : null;

  const handleCreateTask = (taskData: any) => {
    console.log('Creating task:', taskData, 'for meeting:', magicTodoMeeting?.id);
    // TODO: API call to create task
  };

  const handleOpenMagicTodo = (meetingId: string) => {
    const meeting = mockMeetings.find((m) => m.id === meetingId);
    if (meeting) {
      setMagicTodoMeeting(meeting);
      setShowMagicTodo(true);
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Consultations & Meetings
            </h1>
            <p className="text-sm text-muted-foreground">
              Schedule and manage meetings with automatic minutes and task creation
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ConnectionStatusIndicator
              isConnected={isConnected}
              error={error}
              showLabel={true}
              className="hidden sm:flex"
            />
            <ShimmerButton onClick={() => setShowMeetingFlow(true)} className="btn-gold-lux">
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">New Meeting</span>
              <span className="sm:hidden">New</span>
            </ShimmerButton>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="mt-4 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search meetings or cases..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'upcoming' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('upcoming')}
            >
              Upcoming
            </Button>
            <Button
              variant={filter === 'past' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('past')}
            >
              Past
            </Button>
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              All
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* NEW: Quick Stats Bar */}
          {isLoading ? (
            <StatsBarSkeleton />
          ) : (
            <QuickStatsBar meetings={mockMeetings} />
          )}

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Timeline (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Needs Minutes Alert */}
              {pastMeetingsNeedingMinutes.length > 0 && (
                <Card className="border-[hsl(var(--warn))] bg-[hsl(var(--warn))]/5">
                  <CardContent className="flex items-start gap-3 p-4">
                    <AlertCircle className="h-5 w-5 text-[hsl(var(--warn))] shrink-0" />
                    <div className="flex-1">
                      <h3 className="font-semibold">
                        {pastMeetingsNeedingMinutes.length} meeting(s) need minutes
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Complete meeting minutes to unlock actions and update case trail
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* NEW: Timeline View */}
              {isLoading ? (
                <TimelineSkeletonLoader count={2} />
              ) : upcomingMeetings.length > 0 ? (
                <TimelineView
                  meetings={upcomingMeetings}
                  onMeetingClick={handleMeetingClick}
                  onJoinMeeting={handleJoinMeeting}
                  onCompleteMinutes={handleCompleteMinutes}
                  onCreateTask={handleOpenMagicTodo}
                />
              ) : (
                <div className="flex h-64 items-center justify-center">
                  <div className="text-center">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground/50" />
                    <h3 className="mt-4 text-lg font-semibold">No meetings found</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {search
                        ? 'Try adjusting your search'
                        : 'Schedule your first meeting to get started'}
                    </p>
                    <Button className="mt-4 btn-gold-lux" onClick={() => setShowMeetingFlow(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      New Meeting
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Sidebar (1/3 width on desktop) */}
            <div className="space-y-6">
              {/* NEW: Calendar Heatmap */}
              <CalendarHeatmap meetings={mockMeetings} />

              {/* Past Meetings Needing Minutes (Compact) */}
              {pastMeetingsNeedingMinutes.length > 0 && (
                <Card className="bg-lux-surface shadow-lux">
                  <CardContent className="p-4 space-y-3">
                    <h3 className="font-semibold text-sm">⚠️ Needs Minutes</h3>
                    <div className="space-y-2">
                      {pastMeetingsNeedingMinutes.slice(0, 3).map((meeting) => (
                        <button
                          key={meeting.id}
                          onClick={() => handleCompleteMinutes(meeting.id)}
                          className="w-full text-left p-3 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
                        >
                          <p className="font-medium text-sm truncate">{meeting.title}</p>
                          <p className="text-xs text-muted-foreground">{meeting.caseId}</p>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Unified Flow Dialog */}
      <MeetingFlowDialog
        open={showMeetingFlow}
        onOpenChange={setShowMeetingFlow}
        onComplete={(data) => {
          console.log('Complete meeting flow:', data);
          // TODO: API call to create meeting, minutes, tasks, and case trail
        }}
      />

      {/* Floating Action Bar */}
      <FloatingActionBar
        meeting={selectedMeetingData}
        onClose={handleClearSelection}
        onViewCase={handleViewCase}
        onJoinMeeting={() => selectedMeeting && handleJoinMeeting(selectedMeeting)}
      />

      {/* MagicToDo Sheet */}
      <MagicTodoSheet
        open={showMagicTodo}
        onOpenChange={setShowMagicTodo}
        meeting={magicTodoMeeting}
        onCreateTask={handleCreateTask}
      />
    </div>
  );
}
