'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TemplateForm } from '@/app/components/templates/template-form';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, ArrowRight, Sparkles } from 'lucide-react';

interface MeetingFlowDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: (data: any) => void;
}

// Unified template that flows through: Agenda → Minutes → Actions
const meetingFlowTemplate = [
  // STEP 1: Meeting Request (becomes Agenda)
  {
    id: 'meeting_type',
    label: 'Meeting Type',
    type: 'select' as const,
    required: true,
    options: ['Sales Call', 'Product Demo', 'Team Sync', 'Customer Support', 'Planning', 'Review'],
  },
  {
    id: 'agenda_items',
    label: 'Agenda (What to discuss?)',
    type: 'multiselect' as const,
    required: true,
    options: [
      'Budget Review',
      'Timeline Discussion',
      'Resource Planning',
      'Risk Assessment',
      'Quality Check',
      'Scope Review',
      'Technical Discussion',
      'Decision Required',
    ],
  },
  {
    id: 'duration',
    label: 'Duration',
    type: 'select' as const,
    required: true,
    options: ['15 min', '30 min', '45 min', '60 min', '90 min'],
    defaultValue: '30 min',
  },
  {
    id: 'location_type',
    label: 'Meeting Format',
    type: 'radio' as const,
    required: true,
    options: ['Video Call (Jitsi)', 'In-Person', 'Phone'],
    defaultValue: 'Video Call (Jitsi)',
  },
  {
    id: 'scheduled_date',
    label: 'Date',
    type: 'date' as const,
    required: true,
  },
  {
    id: 'scheduled_time',
    label: 'Time',
    type: 'time' as const,
    required: true,
  },
];

// STEP 2: Minutes (reuses agenda items)
const minutesTemplate = [
  {
    id: 'attendance',
    label: 'Who Attended?',
    type: 'checkbox' as const,
    required: true,
    options: [], // Populated from participants
  },
  {
    id: 'discussed_items',
    label: 'What Was Discussed? (from Agenda)',
    type: 'checkbox' as const,
    required: true,
    options: [], // REUSED from agenda_items!
  },
  {
    id: 'decisions',
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
      'Go to Approval',
    ],
  },
  {
    id: 'blockers',
    label: 'Blockers',
    type: 'multiselect' as const,
    required: false,
    options: ['Budget', 'Resources', 'Technical', 'Timeline', 'Dependencies', 'None'],
    defaultValue: ['None'],
  },
  {
    id: 'outcome',
    label: 'Meeting Outcome',
    type: 'select' as const,
    required: true,
    options: ['Successful', 'Needs Follow-up', 'Rescheduled'],
  },
];

// STEP 3: Actions (auto-generated from decisions)
const actionsTemplate = [
  {
    id: 'action_type',
    label: 'Action Type',
    type: 'select' as const,
    required: true,
    options: ['Self-Reminder', 'Push to Someone', 'Push to Department', 'Link to Approval'],
  },
  {
    id: 'assignee',
    label: 'Assign To',
    type: 'user_select' as const,
    required: true,
    conditional: {
      field: 'action_type',
      value: 'Push to Someone',
    },
  },
  {
    id: 'department',
    label: 'Department',
    type: 'department_select' as const,
    required: true,
    conditional: {
      field: 'action_type',
      value: 'Push to Department',
    },
  },
  {
    id: 'priority',
    label: 'Priority',
    type: 'select' as const,
    required: true,
    options: ['Low', 'Medium', 'High', 'Urgent'],
    defaultValue: 'Medium',
  },
  {
    id: 'due_date',
    label: 'Due Date',
    type: 'date' as const,
    required: true,
  },
];

export function MeetingFlowDialog({ open, onOpenChange, onComplete }: MeetingFlowDialogProps) {
  const [step, setStep] = useState<'agenda' | 'minutes' | 'actions'>('agenda');
  const [agendaData, setAgendaData] = useState<any>(null);
  const [minutesData, setMinutesData] = useState<any>(null);

  const handleAgendaSubmit = (data: any) => {
    setAgendaData(data);
    setStep('minutes');
  };

  const handleMinutesSubmit = (data: any) => {
    setMinutesData(data);
    setStep('actions');
  };

  const handleActionsSubmit = (data: any) => {
    // Combine all data
    const completeData = {
      agenda: agendaData,
      minutes: minutesData,
      actions: data,
      caseId: `CASE-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
    };
    onComplete(completeData);
    onOpenChange(false);
    // Reset
    setStep('agenda');
    setAgendaData(null);
    setMinutesData(null);
  };

  // Prepare minutes template with reused agenda items
  const preparedMinutesTemplate = minutesTemplate.map((field) => {
    if (field.id === 'discussed_items' && agendaData?.agenda_items) {
      return {
        ...field,
        options: agendaData.agenda_items, // REUSE agenda!
      };
    }
    return field;
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {step === 'agenda' && '📋 Step 1: Meeting Agenda'}
            {step === 'minutes' && '✍️ Step 2: Meeting Minutes'}
            {step === 'actions' && '⚡ Step 3: Create Actions'}
          </DialogTitle>
          <DialogDescription>
            {step === 'agenda' && 'Define what you want to discuss'}
            {step === 'minutes' && 'Check off what was discussed (reused from agenda!)'}
            {step === 'actions' && 'Turn decisions into actionable tasks'}
          </DialogDescription>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="mb-6 flex items-center gap-2">
          <Badge variant={step === 'agenda' ? 'default' : 'secondary'} className="gap-1">
            {step !== 'agenda' && <CheckCircle2 className="h-3 w-3" />}
            Agenda
          </Badge>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <Badge variant={step === 'minutes' ? 'default' : 'secondary'} className="gap-1">
            {step === 'actions' && <CheckCircle2 className="h-3 w-3" />}
            Minutes
          </Badge>
          <ArrowRight className="h-4 w-4 text-muted-foreground" />
          <Badge variant={step === 'actions' ? 'default' : 'secondary'}>Actions</Badge>
        </div>

        {/* Reuse Alert */}
        {step === 'minutes' && (
          <Alert className="mb-4">
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <strong>Smart Reuse:</strong> Your agenda items are now checkboxes. Just check what was
              discussed!
            </AlertDescription>
          </Alert>
        )}

        {step === 'actions' && (
          <Alert className="mb-4">
            <Sparkles className="h-4 w-4" />
            <AlertDescription>
              <strong>Auto-linked:</strong> This action will be linked to CASE ID and approval system
              automatically.
            </AlertDescription>
          </Alert>
        )}

        {/* Forms */}
        {step === 'agenda' && (
          <TemplateForm
            fields={meetingFlowTemplate}
            onSubmit={handleAgendaSubmit}
            onCancel={() => onOpenChange(false)}
            submitLabel="Next: Add Minutes →"
          />
        )}

        {step === 'minutes' && (
          <TemplateForm
            fields={preparedMinutesTemplate}
            onSubmit={handleMinutesSubmit}
            onCancel={() => setStep('agenda')}
            submitLabel="Next: Create Actions →"
          />
        )}

        {step === 'actions' && (
          <TemplateForm
            fields={actionsTemplate}
            onSubmit={handleActionsSubmit}
            onCancel={() => setStep('minutes')}
            submitLabel="Complete & Create Case Trail"
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
