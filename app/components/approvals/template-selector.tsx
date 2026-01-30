'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FileText,
  CheckSquare,
  MessageSquare,
  Bell,
  AlertTriangle,
  Search,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NoFilteredResultsState } from '@/app/components/common/empty-states';
import type { ApprovalTemplate } from '@/app/lib/stores/approvals-store';

interface TemplateSelectorProps {
  templates: ApprovalTemplate[];
  onSelect: (template: ApprovalTemplate) => void;
  loading?: boolean;
}

// Template type icons
const TYPE_ICONS = {
  REQ: FileText,
  APR: CheckSquare,
  CON: MessageSquare,
  FYI: Bell,
  INC: AlertTriangle,
};

// Template type labels
const TYPE_LABELS = {
  REQ: 'Request',
  APR: 'Approval',
  CON: 'Consultation',
  FYI: 'Broadcast',
  INC: 'Incident',
};

// Template type colors - using semantic design tokens
const TYPE_COLORS = {
  REQ: 'bg-changes-bg text-changes-fg border-changes-bd',
  APR: 'bg-approve-bg text-approve-fg border-approve-bd',
  CON: 'bg-primary/10 text-primary border-primary/20',
  FYI: 'bg-status-warn-bg text-status-warn-fg border-status-warn-bd',
  INC: 'bg-reject-bg text-reject-fg border-reject-bd',
};

export function TemplateSelector({ templates, onSelect, loading }: TemplateSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Get unique categories
  const categories = Array.from(new Set(templates.map((t) => t.category))).sort();

  // Filter templates
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = selectedType === 'all' || template.type === selectedType;
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

    return matchesSearch && matchesType && matchesCategory && template.isActive;
  });

  // Group by category
  const groupedTemplates = filteredTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, ApprovalTemplate[]>);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Select Template</h2>
        <p className="text-sm text-muted-foreground">
          Choose a template to start your approval request
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Search */}
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
        </div>

        {/* Type filter */}
        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="REQ">Request</SelectItem>
              <SelectItem value="APR">Approval</SelectItem>
              <SelectItem value="CON">Consultation</SelectItem>
              <SelectItem value="FYI">Broadcast</SelectItem>
              <SelectItem value="INC">Incident</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Category filter */}
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Templates */}
      {filteredTemplates.length === 0 ? (
        <NoFilteredResultsState
          onClear={() => {
            setSearchQuery('');
            setSelectedType('all');
            setSelectedCategory('all');
          }}
        />
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
            <div key={category}>
              <h3 className="mb-3 text-lg font-semibold">{category}</h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {categoryTemplates.map((template) => {
                  const Icon = TYPE_ICONS[template.type];
                  const typeColor = TYPE_COLORS[template.type];

                  return (
                    <Card
                      key={template.id}
                      className="group cursor-pointer transition-all hover:shadow-lg"
                      onClick={() => onSelect(template)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className={cn('rounded-lg p-2', typeColor)}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {TYPE_LABELS[template.type]}
                            </Badge>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                        </div>
                        <CardTitle className="text-base">{template.name}</CardTitle>
                        <CardDescription className="line-clamp-2 text-xs">
                          {template.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-xs text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <span>Required fields:</span>
                            <span className="font-medium">{template.requiredFields.length}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span>Evidence:</span>
                            <Badge variant="outline" className="text-xs">
                              {template.evidencePolicy}
                            </Badge>
                          </div>
                          {template.slaPolicy.resolveTarget && (
                            <div className="flex items-center justify-between">
                              <span>SLA:</span>
                              <span className="font-medium">
                                {Math.floor(template.slaPolicy.resolveTarget / 60)}h
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
