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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TemplateForm } from '@/app/components/templates/template-form';
import { Badge } from '@/components/ui/badge';
import { Calendar, FileText, Sparkles } from 'lucide-react';

interface MeetingRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
}

// Default templates
const salesCallTemplate = [
  {
    id: 'meeting_type',
    label: 'Meeting Type',
    type: 'select' as const,
    required: true,
    options: ['Sales Call', 'Product Demo', 'Follow-up', 'Contract Discussion'],
    defaultValue: 'Sales Call',
  },
  {
    id: 'client_name',
    label: 'Client Name',
    type: 'text' as const,
    required: true,
  },
  {
    id: 'urgency',
    label: 'Urgency',
    type: 'select' as const,
    required: true,
    options: ['Low', 'Medium', 'High', 'Urgent'],
    defaultValue: 'Medium',
  },
  {
    id: 'duration',
    label: 'Duration',
    type: 'select' as const,
    required: true,
    options: ['15 min', '30 min', '45 min', '60 min'],
    defaultValue: '30 min',
  },
  {
    id: 'location_type',
    label: 'Meeting Format',
    type: 'radio' as const,
    required: true,
    options: ['Video Call', 'In-Person', 'Phone'],
    defaultValue: 'Video Call',
  },
  {
    id: 'physical_location',
    label: 'Physical Location',
    type: 'text' as const,
    required: true,
    conditional: {
      field: 'location_type',
      value: 'In-Person',
    },
  },
  {
    id: 'agenda',
    label: 'Agenda Items',
    type: 'multiselect' as const,
    required: true,
    options: ['Product Demo', 'Pricing Discussion', 'Requirements Gathering', 'Q&A', 'Next Steps'],
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

const internalMeetingTemplate = [
  {
    id: 'meeting_type',
    label: 'Meeting Type',
    type: 'select' as const,
    required: true,
    options: ['Team Sync', 'Project Review', 'Planning', '1-on-1', 'Training'],
    defaultValue: 'Team Sync',
  },
  {
    id: 'urgency',
    label: 'Priority',
    type: 'select' as const,
    required: true,
    options: ['Low', 'Medium', 'High', 'Urgent'],
    defaultValue: 'Medium',
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
    options: ['Video Call', 'In-Person'],
    defaultValue: 'Video Call',
  },
  {
    id: 'agenda',
    label: 'Topics',
    type: 'multiselect' as const,
    required: true,
    options: ['Status Update', 'Blockers', 'Planning', 'Decision Required', 'Brainstorming'],
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

const supportMeetingTemplate = [
  {
    id: 'meeting_type',
    label: 'Meeting Type',
    type: 'select' as const,
    required: true,
    options: ['Customer Support', 'Technical Issue', 'Training', 'Escalation'],
    defaultValue: 'Customer Support',
  },
  {
    id: 'customer_name',
    label: 'Customer Name',
    type: 'text' as const,
    required: true,
  },
  {
    id: 'issue_type',
    label: 'Issue Type',
    type: 'select' as const,
    required: true,
    options: ['Technical', 'Billing', 'Feature Request', 'Bug Report', 'General'],
  },
  {
    id: 'urgency',
    label: 'Urgency',
    type: 'select' as const,
    required: true,
    options: ['Low', 'Medium', 'High', 'Critical'],
    defaultValue: 'Medium',
  },
  {
    id: 'duration',
    label: 'Duration',
    type: 'select' as const,
    required: true,
    options: ['15 min', '30 min', '45 min', '60 min'],
    defaultValue: '30 min',
  },
  {
    id: 'location_type',
    label: 'Meeting Format',
    type: 'radio' as const,
    required: true,
    options: ['Video Call', 'Phone'],
    defaultValue: 'Video Call',
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

export function MeetingRequestDialog({ open, onOpenChange, onSubmit }: MeetingRequestDialogProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<'sales' | 'internal' | 'support'>('sales');

  const getTemplate = () => {
    switch (selectedTemplate) {
      case 'sales':
        return salesCallTemplate;
      case 'internal':
        return internalMeetingTemplate;
      case 'support':
        return supportMeetingTemplate;
      default:
        return salesCallTemplate;
    }
  };

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      templateType: selectedTemplate,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Meeting</DialogTitle>
          <DialogDescription>
            Select a template and fill in the details. All fields are quick-select.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedTemplate} onValueChange={(v: any) => setSelectedTemplate(v)}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="sales" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Sales/Client
            </TabsTrigger>
            <TabsTrigger value="internal" className="gap-2">
              <Calendar className="h-4 w-4" />
              Internal
            </TabsTrigger>
            <TabsTrigger value="support" className="gap-2">
              <FileText className="h-4 w-4" />
              Support
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sales" className="mt-6">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="secondary">Sales Template</Badge>
              <span className="text-sm text-muted-foreground">
                For client meetings, demos, and sales calls
              </span>
            </div>
            <TemplateForm
              fields={salesCallTemplate}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
              submitLabel="Schedule Meeting"
            />
          </TabsContent>

          <TabsContent value="internal" className="mt-6">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="secondary">Internal Template</Badge>
              <span className="text-sm text-muted-foreground">
                For team meetings and internal discussions
              </span>
            </div>
            <TemplateForm
              fields={internalMeetingTemplate}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
              submitLabel="Schedule Meeting"
            />
          </TabsContent>

          <TabsContent value="support" className="mt-6">
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="secondary">Support Template</Badge>
              <span className="text-sm text-muted-foreground">
                For customer support and technical issues
              </span>
            </div>
            <TemplateForm
              fields={supportMeetingTemplate}
              onSubmit={handleSubmit}
              onCancel={() => onOpenChange(false)}
              submitLabel="Schedule Meeting"
            />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
