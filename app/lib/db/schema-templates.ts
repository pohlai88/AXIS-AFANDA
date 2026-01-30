import { pgTable, text, timestamp, jsonb, boolean, pgEnum } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { tenants } from './schema';

// Template types
export const templateTypeEnum = pgEnum('template_type', [
  'meeting_request',
  'meeting_minutes',
  'approval_request',
  'task_template',
]);

export const fieldTypeEnum = pgEnum('field_type', [
  'text',
  'textarea',
  'select',
  'multiselect',
  'checkbox',
  'radio',
  'date',
  'time',
  'datetime',
  'number',
  'email',
  'phone',
  'user_select',
  'department_select',
]);

// Templates table
export const templates = pgTable('templates', {
  id: text('id').primaryKey(),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  
  // Basic info
  name: text('name').notNull(),
  description: text('description'),
  type: templateTypeEnum('type').notNull(),
  category: text('category'), // 'Sales', 'HR', 'Engineering', etc.
  
  // Template structure
  fields: jsonb('fields').notNull().$type<TemplateField[]>(),
  
  // Usage
  isDefault: boolean('is_default').notNull().default(false),
  isActive: boolean('is_active').notNull().default(true),
  usageCount: jsonb('usage_count').notNull().default(0),
  
  // Metadata
  createdBy: text('created_by').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Template field definition
export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'multiselect' | 'checkbox' | 'radio' | 'date' | 'time' | 'datetime' | 'number' | 'email' | 'phone' | 'user_select' | 'department_select';
  required: boolean;
  placeholder?: string;
  options?: string[]; // For select, multiselect, radio
  defaultValue?: any;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
  conditional?: {
    field: string; // Field ID to watch
    value: any; // Show this field when watched field has this value
  };
}

// Template instances (filled forms)
export const templateInstances = pgTable('template_instances', {
  id: text('id').primaryKey(),
  templateId: text('template_id').notNull().references(() => templates.id),
  tenantId: text('tenant_id').notNull().references(() => tenants.id),
  
  // Link to entity
  entityType: text('entity_type').notNull(), // 'meeting', 'approval', 'task'
  entityId: text('entity_id').notNull(),
  
  // Filled data
  data: jsonb('data').notNull().$type<Record<string, any>>(),
  
  // Metadata
  filledBy: text('filled_by').notNull(),
  filledAt: timestamp('filled_at').notNull().defaultNow(),
});

// Relations
export const templatesRelations = relations(templates, ({ one, many }) => ({
  tenant: one(tenants, {
    fields: [templates.tenantId],
    references: [tenants.id],
  }),
  instances: many(templateInstances),
}));

export const templateInstancesRelations = relations(templateInstances, ({ one }) => ({
  tenant: one(tenants, {
    fields: [templateInstances.tenantId],
    references: [tenants.id],
  }),
  template: one(templates, {
    fields: [templateInstances.templateId],
    references: [templates.id],
  }),
}));

// Default templates
export const defaultMeetingRequestTemplate: TemplateField[] = [
  {
    id: 'meeting_type',
    label: 'Meeting Type',
    type: 'select',
    required: true,
    options: ['Sales Call', 'Product Demo', 'Customer Support', 'Internal Review', 'Training', 'Other'],
  },
  {
    id: 'urgency',
    label: 'Urgency',
    type: 'select',
    required: true,
    options: ['Low', 'Medium', 'High', 'Urgent'],
    defaultValue: 'Medium',
  },
  {
    id: 'participants',
    label: 'Participants',
    type: 'user_select',
    required: true,
  },
  {
    id: 'duration',
    label: 'Duration',
    type: 'select',
    required: true,
    options: ['15 min', '30 min', '45 min', '60 min', '90 min', '2 hours'],
    defaultValue: '30 min',
  },
  {
    id: 'location_type',
    label: 'Location',
    type: 'radio',
    required: true,
    options: ['Video Call', 'In-Person', 'Phone'],
    defaultValue: 'Video Call',
  },
  {
    id: 'physical_location',
    label: 'Physical Location',
    type: 'text',
    required: true,
    conditional: {
      field: 'location_type',
      value: 'In-Person',
    },
  },
  {
    id: 'agenda',
    label: 'Agenda Items',
    type: 'multiselect',
    required: false,
    options: ['Budget Review', 'Project Update', 'Decision Required', 'Brainstorming', 'Problem Solving', 'Status Check'],
  },
];

export const defaultMeetingMinutesTemplate: TemplateField[] = [
  {
    id: 'attendance',
    label: 'Attendance',
    type: 'checkbox',
    required: true,
    options: [], // Populated from meeting participants
  },
  {
    id: 'discussion_topics',
    label: 'Discussion Topics',
    type: 'multiselect',
    required: true,
    options: ['Budget', 'Timeline', 'Resources', 'Risks', 'Quality', 'Scope', 'Other'],
  },
  {
    id: 'key_decisions',
    label: 'Key Decisions',
    type: 'multiselect',
    required: true,
    options: [
      'Approved',
      'Rejected',
      'Deferred',
      'Needs More Info',
      'Budget Allocated',
      'Timeline Extended',
      'Scope Changed',
    ],
  },
  {
    id: 'action_items',
    label: 'Action Items',
    type: 'multiselect',
    required: true,
    options: [
      'Follow-up Meeting',
      'Document Required',
      'Approval Needed',
      'Task Assignment',
      'Research Required',
      'Budget Request',
    ],
  },
  {
    id: 'blockers',
    label: 'Blockers/Issues',
    type: 'multiselect',
    required: false,
    options: ['Budget', 'Resources', 'Technical', 'Timeline', 'Dependencies', 'None'],
  },
  {
    id: 'next_steps',
    label: 'Next Steps',
    type: 'multiselect',
    required: true,
    options: [
      'Schedule Follow-up',
      'Send to Approval',
      'Assign Tasks',
      'Update Case',
      'Notify Stakeholders',
    ],
  },
  {
    id: 'meeting_outcome',
    label: 'Meeting Outcome',
    type: 'select',
    required: true,
    options: ['Successful', 'Partially Complete', 'Needs Follow-up', 'Cancelled'],
  },
];

export const defaultApprovalRequestTemplate: TemplateField[] = [
  {
    id: 'approval_type',
    label: 'Approval Type',
    type: 'select',
    required: true,
    options: ['Budget', 'Purchase', 'Contract', 'Hire', 'Policy Change', 'Project', 'Other'],
  },
  {
    id: 'amount',
    label: 'Amount (if applicable)',
    type: 'number',
    required: false,
    conditional: {
      field: 'approval_type',
      value: 'Budget',
    },
  },
  {
    id: 'urgency',
    label: 'Urgency',
    type: 'select',
    required: true,
    options: ['Low', 'Medium', 'High', 'Critical'],
    defaultValue: 'Medium',
  },
  {
    id: 'justification',
    label: 'Justification',
    type: 'select',
    required: true,
    options: [
      'Business Growth',
      'Cost Savings',
      'Risk Mitigation',
      'Compliance',
      'Customer Request',
      'Operational Need',
    ],
  },
  {
    id: 'impact',
    label: 'Impact',
    type: 'multiselect',
    required: true,
    options: ['Revenue', 'Cost', 'Timeline', 'Quality', 'Team', 'Customer'],
  },
  {
    id: 'approvers',
    label: 'Approvers',
    type: 'user_select',
    required: true,
  },
];
