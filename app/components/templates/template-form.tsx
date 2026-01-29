'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X } from 'lucide-react';

interface TemplateField {
  id: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: string[];
  defaultValue?: any;
  conditional?: {
    field: string;
    value: any;
  };
}

interface TemplateFormProps {
  fields: TemplateField[];
  onSubmit: (data: Record<string, any>) => void;
  onCancel?: () => void;
  submitLabel?: string;
  initialData?: Record<string, any>;
}

export function TemplateForm({
  fields,
  onSubmit,
  onCancel,
  submitLabel = 'Submit',
  initialData = {},
}: TemplateFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const shouldShowField = (field: TemplateField) => {
    if (!field.conditional) return true;
    return formData[field.conditional.field] === field.conditional.value;
  };

  const renderField = (field: TemplateField) => {
    if (!shouldShowField(field)) return null;

    const value = formData[field.id] ?? field.defaultValue;

    switch (field.type) {
      case 'text':
      case 'email':
      case 'phone':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              required={field.required}
            />
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <Input
              id={field.id}
              type="number"
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              required={field.required}
            />
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={value || ''}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              required={field.required}
              rows={4}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <Select
              value={value}
              onValueChange={(val) => setFormData({ ...formData, [field.id]: val })}
              required={field.required}
            >
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder || 'Select...'} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'multiselect':
        const selectedValues = value || [];
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <Card>
              <CardContent className="p-3">
                <div className="mb-2 flex flex-wrap gap-2">
                  {selectedValues.map((val: string) => (
                    <Badge key={val} variant="secondary" className="gap-1">
                      {val}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData({
                            ...formData,
                            [field.id]: selectedValues.filter((v: string) => v !== val),
                          });
                        }}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                  {selectedValues.length === 0 && (
                    <span className="text-sm text-muted-foreground">No items selected</span>
                  )}
                </div>
                <Select
                  value=""
                  onValueChange={(val) => {
                    if (!selectedValues.includes(val)) {
                      setFormData({
                        ...formData,
                        [field.id]: [...selectedValues, val],
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Add item..." />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options
                      ?.filter((opt) => !selectedValues.includes(opt))
                      .map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <RadioGroup
              value={value}
              onValueChange={(val) => setFormData({ ...formData, [field.id]: val })}
              required={field.required}
            >
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${field.id}-${option}`} />
                  <Label htmlFor={`${field.id}-${option}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        );

      case 'checkbox':
        const checkedValues = value || [];
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option}`}
                    checked={checkedValues.includes(option)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setFormData({
                          ...formData,
                          [field.id]: [...checkedValues, option],
                        });
                      } else {
                        setFormData({
                          ...formData,
                          [field.id]: checkedValues.filter((v: string) => v !== option),
                        });
                      }
                    }}
                  />
                  <Label htmlFor={`${field.id}-${option}`} className="font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <Input
              id={field.id}
              type="date"
              value={value || ''}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              required={field.required}
            />
          </div>
        );

      case 'time':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <Input
              id={field.id}
              type="time"
              value={value || ''}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              required={field.required}
            />
          </div>
        );

      case 'datetime':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="text-destructive"> *</span>}
            </Label>
            <Input
              id={field.id}
              type="datetime-local"
              value={value || ''}
              onChange={(e) => setFormData({ ...formData, [field.id]: e.target.value })}
              required={field.required}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map(renderField)}

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">{submitLabel}</Button>
      </div>
    </form>
  );
}
