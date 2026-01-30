'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Calendar as CalendarIcon, AlertTriangle, Info } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import type { ApprovalTemplate, TemplateField } from '@/app/lib/stores/approvals-store';

export type TemplateFormValue = string | number | string[] | Date;
export type TemplateFormData = Record<string, TemplateFormValue>;

interface TemplateFormProps {
  template: ApprovalTemplate;
  values: TemplateFormData;
  onChange: (values: TemplateFormData) => void;
  errors?: Record<string, string>;
}

export function TemplateForm({ template, values, onChange, errors = {} }: TemplateFormProps) {
  const handleFieldChange = (key: string, value: TemplateFormValue) => {
    onChange({ ...values, [key]: value });
  };

  const renderField = (field: TemplateField, required: boolean) => {
    const value = values[field.key];
    const error = errors[field.key];
    const fieldId = `field-${field.key}`;

    switch (field.type) {
      case 'text':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
            <Input
              id={fieldId}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.label}
              className={cn(error && 'border-destructive')}
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
            <Textarea
              id={fieldId}
              value={typeof value === 'string' ? value : ''}
              onChange={(e) => handleFieldChange(field.key, e.target.value)}
              placeholder={field.label}
              rows={4}
              className={cn(error && 'border-destructive')}
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
            <Input
              id={fieldId}
              type="number"
              value={typeof value === 'number' ? value : ''}
              onChange={(e) => handleFieldChange(field.key, parseFloat(e.target.value) || 0)}
              placeholder={field.label}
              min={field.validation?.min}
              max={field.validation?.max}
              className={cn(error && 'border-destructive')}
            />
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id={fieldId}
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !value && 'text-muted-foreground',
                    error && 'border-destructive'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value && (typeof value === 'string' || value instanceof Date) ? format(new Date(value), 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={value && (typeof value === 'string' || value instanceof Date) ? new Date(value) : undefined}
                  onSelect={(date) => handleFieldChange(field.key, date ? date.toISOString() : '')}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
            <Select
              value={typeof value === 'string' ? value : ''}
              onValueChange={(val) => handleFieldChange(field.key, val)}
            >
              <SelectTrigger id={fieldId} className={cn(error && 'border-destructive')}>
                <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
              </SelectTrigger>
              <SelectContent>
                {field.validation?.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>
        );

      case 'multiselect':
        return (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={fieldId}>
              {field.label}
              {required && <span className="text-destructive ml-1">*</span>}
            </Label>
            {field.helpText && (
              <p className="text-xs text-muted-foreground">{field.helpText}</p>
            )}
            <div className="space-y-2">
              {field.validation?.options?.map((option) => (
                <label key={option} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={Array.isArray(value) && value.includes(option)}
                    onChange={(e) => {
                      const current = Array.isArray(value) ? value : [];
                      const updated = e.target.checked
                        ? [...current, option]
                        : current.filter((v) => v !== option);
                      handleFieldChange(field.key, updated);
                    }}
                    className="h-4 w-4 rounded border-input"
                  />
                  <span className="text-sm">{option}</span>
                </label>
              ))}
            </div>
            {error && (
              <p className="text-xs text-destructive">{error}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Template info */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{template.name}</CardTitle>
              <CardDescription>{template.description}</CardDescription>
            </div>
            <Badge variant="outline">{template.code}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 text-sm md:grid-cols-3">
            <div>
              <p className="text-muted-foreground">Category</p>
              <p className="font-medium">{template.category}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Evidence</p>
              <Badge variant={template.evidencePolicy === 'required' ? 'default' : 'outline'}>
                {template.evidencePolicy}
              </Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Privacy</p>
              <Badge variant="outline">{template.privacyDefault}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SLA info */}
      {(template.slaPolicy.ackTarget || template.slaPolicy.resolveTarget) && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>Service Level Agreement</AlertTitle>
          <AlertDescription>
            {template.slaPolicy.ackTarget && (
              <p>
                Acknowledgement expected within{' '}
                <strong>{Math.floor(template.slaPolicy.ackTarget / 60)} hours</strong>
              </p>
            )}
            {template.slaPolicy.resolveTarget && (
              <p>
                Resolution expected within{' '}
                <strong>{Math.floor(template.slaPolicy.resolveTarget / 60)} hours</strong>
              </p>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Required fields */}
      {template.requiredFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Required Information</CardTitle>
            <CardDescription>All fields marked with * are required</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {template.requiredFields.map((field) => renderField(field, true))}
          </CardContent>
        </Card>
      )}

      {/* Optional fields */}
      {template.optionalFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Additional Information</CardTitle>
            <CardDescription>Optional fields to provide more context</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {template.optionalFields.map((field) => renderField(field, false))}
          </CardContent>
        </Card>
      )}

      {/* Evidence requirement */}
      {template.evidencePolicy === 'required' && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Evidence Required</AlertTitle>
          <AlertDescription>
            This template requires you to attach supporting documents or evidence.
            You&apos;ll be able to upload files in the next step.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
