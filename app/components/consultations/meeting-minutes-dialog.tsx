'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { TemplateForm } from '@/app/components/templates/template-form';
import { Badge } from '@/components/ui/badge';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { TemplateFormData } from '@/app/components/templates/template-form';

/** Meeting participant type */
interface MeetingParticipant {
  name: string;
  email?: string;
  role?: string;
}

/** Meeting data for minutes dialog */
interface Meeting {
  id: string;
  title: string;
  caseId: string;
  participants?: MeetingParticipant[];
}

/** Meeting minutes submission data */
interface MeetingMinutesSubmitData extends TemplateFormData {
  meetingId: string;
  caseId: string;
}

interface MeetingMinutesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  meeting: Meeting;
  onSubmit: (data: MeetingMinutesSubmitData) => void;
}

const meetingMinutesTemplate = [
  {
    id: 'attendance',
    label: 'Who Attended?',
    type: 'checkbox' as const,
    required: true,
    options: [], // Will be populated from meeting participants
  },
  {
    id: 'discussion_topics',
    label: 'What Was Discussed?',
    type: 'multiselect' as const,
    required: true,
    options: [
      'Budget',
      'Timeline',
      'Resources',
      'Risks',
      'Quality',
      'Scope',
      'Technical',
      'Process',
      'Other',
    ],
  },
  {
    id: 'key_decisions',
    label: 'Decisions Made',
    type: 'multiselect' as const,
    required: true,
    options: [
      'Approved',
      'Rejected',
      'Deferred',
      'Needs More Info',
      'Budget Allocated',
      'Timeline Extended',
      'Scope Changed',
      'Go to Approval',
    ],
  },
  {
    id: 'action_items',
    label: 'Action Items (Auto-creates Tasks)',
    type: 'multiselect' as const,
    required: true,
    options: [
      'Follow-up Meeting',
      'Document Required',
      'Approval Needed',
      'Task Assignment',
      'Research Required',
      'Budget Request',
      'Send Proposal',
      'Update Client',
    ],
  },
  {
    id: 'blockers',
    label: 'Blockers/Issues',
    type: 'multiselect' as const,
    required: false,
    options: ['Budget', 'Resources', 'Technical', 'Timeline', 'Dependencies', 'External', 'None'],
    defaultValue: ['None'],
  },
  {
    id: 'next_steps',
    label: 'Next Steps',
    type: 'multiselect' as const,
    required: true,
    options: [
      'Schedule Follow-up',
      'Send to Approval',
      'Assign Tasks',
      'Update Case',
      'Notify Stakeholders',
      'Close Case',
    ],
  },
  {
    id: 'meeting_outcome',
    label: 'Meeting Outcome',
    type: 'select' as const,
    required: true,
    options: ['Successful', 'Partially Complete', 'Needs Follow-up', 'Rescheduled'],
  },
];

export function MeetingMinutesDialog({
  open,
  onOpenChange,
  meeting,
  onSubmit,
}: MeetingMinutesDialogProps) {
  // Populate attendance from meeting participants
  const templateWithParticipants = meetingMinutesTemplate.map((field) => {
    if (field.id === 'attendance' && meeting?.participants) {
      return {
        ...field,
        options: meeting.participants.map((p: MeetingParticipant) => p.name),
      };
    }
    return field;
  });

  const handleSubmit = (data: TemplateFormData) => {
    onSubmit({
      ...data,
      meetingId: meeting.id,
      caseId: meeting.caseId,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Meeting Minutes</DialogTitle>
          <DialogDescription>
            {meeting?.title} • {meeting?.caseId}
          </DialogDescription>
        </DialogHeader>

        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Required:</strong> Minutes must be completed to create tasks and update case trail.
            All action items will auto-create MagicToDo tasks.
          </AlertDescription>
        </Alert>

        <div className="mb-4 flex items-center gap-2">
          <Badge variant="secondary">Quick-Select Template</Badge>
          <span className="text-sm text-muted-foreground">
            No essay writing - just select from dropdowns
          </span>
        </div>

        <TemplateForm
          fields={templateWithParticipants}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          submitLabel="Complete Minutes & Create Tasks"
        />
      </DialogContent>
    </Dialog>
  );
}
