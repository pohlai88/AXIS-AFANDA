'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { TemplateSelector } from '@/app/components/approvals/template-selector';
import { TemplateForm } from '@/app/components/approvals/template-form';
import { AttachmentUpload } from '@/app/components/approvals/attachment-upload';
import { DuplicateDetectionDialog } from '@/app/components/approvals/duplicate-detection-dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Save } from 'lucide-react';
import { toast } from 'sonner';
import type { ApprovalTemplate, Attachment, Approval } from '@/app/lib/stores/approvals-store';

// Mock templates - replace with API call
const MOCK_TEMPLATES: ApprovalTemplate[] = [
  {
    id: 'tpl-1',
    code: 'REQ_EXPENSE',
    type: 'REQ',
    name: 'Expense Claim',
    description: 'Submit an expense claim for reimbursement',
    category: 'Finance',
    requiredFields: [
      { key: 'amount', label: 'Amount', type: 'number', validation: { required: true, min: 0 } },
      { key: 'category', label: 'Category', type: 'select', validation: { options: ['Travel', 'Meals', 'Equipment', 'Other'] } },
      { key: 'date', label: 'Expense Date', type: 'date', validation: { required: true } },
      { key: 'description', label: 'Description', type: 'textarea', validation: { required: true } },
    ],
    optionalFields: [
      { key: 'project', label: 'Project Code', type: 'text' },
      { key: 'notes', label: 'Additional Notes', type: 'textarea' },
    ],
    evidencePolicy: 'required',
    approvalPolicy: {
      type: 'sequential',
      approvers: [
        { step: 1, roleKey: 'manager', required: true },
        { step: 2, roleKey: 'finance_director', required: true },
      ],
    },
    privacyDefault: 'PRIVATE',
    tagsSchema: ['LBL_FIN_EXPENSE', 'LBL_FIN_TRAVEL'],
    slaPolicy: {
      ackTarget: 240,
      resolveTarget: 2880,
    },
    outputContract: [],
    version: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl-2',
    code: 'APR_BUDGET',
    type: 'APR',
    name: 'Budget Approval',
    description: 'Request approval for budget allocation',
    category: 'Finance',
    requiredFields: [
      { key: 'budget_line', label: 'Budget Line', type: 'select', validation: { options: ['Marketing', 'Engineering', 'Operations', 'Sales'] } },
      { key: 'amount', label: 'Amount', type: 'number', validation: { required: true, min: 0 } },
      { key: 'quarter', label: 'Quarter', type: 'select', validation: { options: ['Q1', 'Q2', 'Q3', 'Q4'] } },
      { key: 'justification', label: 'Justification', type: 'textarea', validation: { required: true } },
    ],
    optionalFields: [],
    evidencePolicy: 'optional',
    approvalPolicy: {
      type: 'quorum',
      approvers: [
        { roleKey: 'finance_director', required: true },
        { roleKey: 'ceo', required: true },
      ],
      quorumCount: 2,
    },
    privacyDefault: 'RESTRICTED',
    tagsSchema: ['LBL_FIN_BUDGET'],
    slaPolicy: {
      ackTarget: 480,
      resolveTarget: 4320,
    },
    outputContract: [],
    version: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'tpl-3',
    code: 'CON_EXCEPTION',
    type: 'CON',
    name: 'Exception Approval',
    description: 'Request an exception to standard policy',
    category: 'Operations',
    requiredFields: [
      { key: 'policy', label: 'Policy Being Excepted', type: 'text', validation: { required: true } },
      { key: 'reason', label: 'Reason for Exception', type: 'textarea', validation: { required: true } },
      { key: 'duration', label: 'Exception Duration', type: 'select', validation: { options: ['One-time', '1 week', '1 month', '3 months', 'Permanent'] } },
      { key: 'impact', label: 'Impact Assessment', type: 'textarea', validation: { required: true } },
    ],
    optionalFields: [],
    evidencePolicy: 'required',
    approvalPolicy: {
      type: 'parallel',
      approvers: [
        { roleKey: 'legal', required: true },
        { roleKey: 'compliance', required: true },
        { roleKey: 'ceo', required: true },
      ],
    },
    privacyDefault: 'RESTRICTED',
    tagsSchema: ['LBL_OPS_EXCEPTION', 'LBL_OPS_URGENT'],
    slaPolicy: {
      ackTarget: 120,
      resolveTarget: 1440,
    },
    outputContract: [],
    version: 1,
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export default function NewApprovalPage() {
  const router = useRouter();
  const [step, setStep] = useState<'template' | 'form' | 'attachments' | 'review'>(
    'template'
  );
  const [selectedTemplate, setSelectedTemplate] = useState<ApprovalTemplate | null>(null);
  const [formValues, setFormValues] = useState<Record<string, string | number | Date | string[]>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [duplicate, setDuplicate] = useState<Approval | null>(null);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);

  const progressPercentage =
    step === 'template' ? 25 :
      step === 'form' ? 50 :
        step === 'attachments' ? 75 :
          100;

  const handleTemplateSelect = (template: ApprovalTemplate) => {
    setSelectedTemplate(template);
    setStep('form');
  };

  const validateForm = (): boolean => {
    if (!selectedTemplate) return false;

    const errors: Record<string, string> = {};

    // Validate required fields
    for (const field of selectedTemplate.requiredFields) {
      const value = formValues[field.key];
      if (!value || (typeof value === 'string' && !value.trim())) {
        errors[field.key] = `${field.label} is required`;
      }

      // Additional validation
      if (field.validation) {
        if (field.type === 'number' && typeof value === 'number') {
          if (field.validation.min !== undefined && value < field.validation.min) {
            errors[field.key] = `Must be at least ${field.validation.min}`;
          }
          if (field.validation.max !== undefined && value > field.validation.max) {
            errors[field.key] = `Must be at most ${field.validation.max}`;
          }
        }
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormNext = () => {
    if (validateForm()) {
      if (selectedTemplate?.evidencePolicy === 'none') {
        setStep('review');
      } else {
        setStep('attachments');
      }
    }
  };

  const handleAttachmentsNext = () => {
    // Check evidence policy
    if (selectedTemplate?.evidencePolicy === 'required' && attachments.length === 0) {
      toast.error('At least one attachment is required');
      return;
    }
    setStep('review');
  };

  const handleUpload = async (files: File[]) => {
    setUploading(true);
    try {
      // Simulate upload - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newAttachments: Attachment[] = files.map((file) => ({
        id: `att-${Date.now()}-${Math.random()}`,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        url: URL.createObjectURL(file),
        contentHash: `sha256-${Date.now()}`, // Replace with actual SHA256
        uploadedBy: 'current-user',
        uploadedAt: new Date(),
      }));

      setAttachments([...attachments, ...newAttachments]);
      toast.success(`${files.length} file(s) uploaded`);
    } catch (error) {
      toast.error('Upload failed');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Simulate submission - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Check for duplicates (mock)
      const isDuplicate = false; // Replace with actual dedup check

      if (isDuplicate) {
        // Show duplicate dialog
        setDuplicate({
          id: 'dup-123',
          tenantId: 'tenant-1',
          templateId: selectedTemplate!.id,
          templateCode: selectedTemplate!.code,
          templateVersion: 1,
          title: 'Duplicate Request',
          purpose: 'Test',
          fields: formValues,
          contentHash: 'hash-123',
          scope: 'individual',
          scopeId: 'user-1',
          type: selectedTemplate!.type,
          status: 'submitted',
          requestedBy: 'user-1',
          requestedByName: 'John Doe',
          privacy: 'PRIVATE',
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Approval);
        setShowDuplicateDialog(true);
        return;
      }

      toast.success('Approval request created successfully');
      router.push('/app/approvals');
    } catch {
      toast.error('Failed to create approval');
    } finally {
      setSubmitting(false);
    }
  };

  const handleOpenExisting = () => {
    if (duplicate) {
      router.push(`/app/approvals/${duplicate.id}`);
    }
  };

  const handleForwardExisting = () => {
    // Implement forward logic
    toast.info('Forward functionality coming soon');
  };

  const handleOverride = async (reason: string) => {
    // TODO: Submit with override reason
    console.log('Override reason:', reason);
    toast.success('Creating duplicate with override reason');
    setShowDuplicateDialog(false);
    await handleSubmit();
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (step === 'template') {
                  router.push('/app/approvals');
                } else if (step === 'form') {
                  setStep('template');
                } else if (step === 'attachments') {
                  setStep('form');
                } else {
                  setStep('attachments');
                }
              }}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">New Approval Request</h1>
              <p className="text-sm text-muted-foreground">
                {step === 'template' && 'Select a template to get started'}
                {step === 'form' && selectedTemplate?.name}
                {step === 'attachments' && 'Upload supporting documents'}
                {step === 'review' && 'Review and submit'}
              </p>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <Progress value={progressPercentage} className="h-2" />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span className={step === 'template' ? 'font-medium text-foreground' : ''}>
              Template
            </span>
            <span className={step === 'form' ? 'font-medium text-foreground' : ''}>
              Details
            </span>
            <span className={step === 'attachments' ? 'font-medium text-foreground' : ''}>
              Attachments
            </span>
            <span className={step === 'review' ? 'font-medium text-foreground' : ''}>
              Review
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-[var(--layout-container-narrow)]">
          {/* Step 1: Template selection */}
          {step === 'template' && (
            <TemplateSelector
              templates={MOCK_TEMPLATES}
              onSelect={handleTemplateSelect}
            />
          )}

          {/* Step 2: Form */}
          {step === 'form' && selectedTemplate && (
            <div className="space-y-6">
              <TemplateForm
                template={selectedTemplate}
                values={formValues}
                onChange={setFormValues}
                errors={formErrors}
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStep('template')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleFormNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Attachments */}
          {step === 'attachments' && selectedTemplate && (
            <div className="space-y-6">
              <AttachmentUpload
                attachments={attachments}
                onUpload={handleUpload}
                onRemove={handleRemoveAttachment}
                evidencePolicy={selectedTemplate.evidencePolicy}
                uploading={uploading}
              />

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setStep('form')}>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleAttachmentsNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 'review' && selectedTemplate && (
            <div className="space-y-6">
              {/* Review summary */}
              <div className="rounded-lg border bg-card p-6">
                <h3 className="text-lg font-semibold mb-4">Review Your Request</h3>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Template</p>
                    <p className="text-sm">{selectedTemplate.name}</p>
                  </div>

                  {Object.entries(formValues).map(([key, value]) => {
                    const field = [...selectedTemplate.requiredFields, ...selectedTemplate.optionalFields]
                      .find((f) => f.key === key);
                    if (!field || !value) return null;

                    return (
                      <div key={key}>
                        <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
                        <p className="text-sm">
                          {field.type === 'date' && (typeof value === 'string' || value instanceof Date)
                            ? format(new Date(value), 'PPP')
                            : Array.isArray(value)
                              ? value.join(', ')
                              : String(value)}
                        </p>
                      </div>
                    );
                  })}

                  {attachments.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Attachments</p>
                      <p className="text-sm">{attachments.length} file(s)</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() =>
                    setStep(selectedTemplate.evidencePolicy === 'none' ? 'form' : 'attachments')
                  }
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
                <Button onClick={handleSubmit} disabled={submitting}>
                  {submitting ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Duplicate detection dialog */}
      {duplicate && (
        <DuplicateDetectionDialog
          open={showDuplicateDialog}
          onOpenChange={setShowDuplicateDialog}
          duplicate={duplicate}
          onOpenExisting={handleOpenExisting}
          onForwardExisting={handleForwardExisting}
          onOverride={handleOverride}
          processing={submitting}
        />
      )}
    </div>
  );
}
