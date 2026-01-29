/**
 * Consultations & Meetings — Type Definitions
 */

export interface Meeting {
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
  organizerId?: string;
}

export interface MeetingStats {
  needsMinutes: number;
  thisWeek: number;
  completedThisQuarter: number;
  todayDuration: number;
}

export interface HeatmapDay {
  date: string;
  count: number;
}
