'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Filter,
  X,
  Calendar as CalendarIcon,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export interface ApprovalFilters {
  status?: string;
  type?: string;
  priority?: string;
  requestedBy?: string;
  dateFrom?: Date;
  dateTo?: Date;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

interface ApprovalFiltersProps {
  filters: ApprovalFilters;
  onFiltersChange: (filters: ApprovalFilters) => void;
  onReset?: () => void;
}

// Predefined filter presets
const FILTER_PRESETS = [
  {
    id: 'pending',
    name: 'Pending',
    icon: Clock,
    filters: { status: 'submitted', sortBy: 'createdAt', sortOrder: 'desc' as const },
  },
  {
    id: 'approved',
    name: 'Approved',
    icon: CheckCircle2,
    filters: { status: 'approved', sortBy: 'approvedAt', sortOrder: 'desc' as const },
  },
  {
    id: 'rejected',
    name: 'Rejected',
    icon: XCircle,
    filters: { status: 'rejected', sortBy: 'rejectedAt', sortOrder: 'desc' as const },
  },
  {
    id: 'urgent',
    name: 'Urgent',
    icon: AlertTriangle,
    filters: { status: 'submitted', priority: 'urgent', sortBy: 'createdAt', sortOrder: 'asc' as const },
  },
  {
    id: 'escalated',
    name: 'Escalated',
    icon: Zap,
    filters: { type: 'ceo_approval', status: 'submitted', sortBy: 'createdAt', sortOrder: 'desc' as const },
  },
];

// Approval types
const APPROVAL_TYPES = [
  { value: 'ceo_approval', label: 'CEO Approval' },
  { value: 'consultation_room', label: 'Consultation Room' },
  { value: 'budget_approval', label: 'Budget Approval' },
  { value: 'access_request', label: 'Access Request' },
  { value: 'other', label: 'Other' },
];

// Priority levels
const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'text-pending-fg' },
  { value: 'medium', label: 'Medium', color: 'text-changes-fg' },
  { value: 'high', label: 'High', color: 'text-status-warn-fg' },
  { value: 'urgent', label: 'Urgent', color: 'text-reject-fg' },
];

export function ApprovalFilters({ filters, onFiltersChange, onReset }: ApprovalFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handlePresetClick = (preset: typeof FILTER_PRESETS[0]) => {
    onFiltersChange(preset.filters);
  };

  const handleFilterChange = (key: keyof ApprovalFilters, value: string | Date | undefined) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    } else {
      onFiltersChange({});
    }
    setShowAdvanced(false);
  };

  const activeFilterCount = Object.keys(filters).filter(
    (key) => filters[key as keyof ApprovalFilters] !== undefined
  ).length;

  return (
    <div className="space-y-4">
      {/* Quick Filters (Presets) */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-muted-foreground">Quick filters:</span>
        {FILTER_PRESETS.map((preset) => {
          const Icon = preset.icon;
          const isActive =
            filters.status === preset.filters.status &&
            (!preset.filters.type || filters.type === preset.filters.type) &&
            (!preset.filters.priority || filters.priority === preset.filters.priority);

          return (
            <Button
              key={preset.id}
              variant={isActive ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetClick(preset)}
              className="gap-2"
            >
              <Icon className="h-4 w-4" />
              {preset.name}
            </Button>
          );
        })}

        <Separator orientation="vertical" className="h-6" />

        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="gap-2"
        >
          <Filter className="h-4 w-4" />
          Advanced
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 px-1.5">
              {activeFilterCount}
            </Badge>
          )}
        </Button>

        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="rounded-lg border bg-card p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('status', value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={filters.type || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('type', value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All types</SelectItem>
                  {APPROVAL_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={filters.priority || 'all'}
                onValueChange={(value) =>
                  handleFilterChange('priority', value === 'all' ? undefined : value)
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="All priorities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All priorities</SelectItem>
                  {PRIORITY_LEVELS.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <span className={priority.color}>{priority.label}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <Label htmlFor="sortBy">Sort by</Label>
              <Select
                value={filters.sortBy || 'createdAt'}
                onValueChange={(value) => handleFilterChange('sortBy', value)}
              >
                <SelectTrigger id="sortBy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt">Created date</SelectItem>
                  <SelectItem value="updatedAt">Updated date</SelectItem>
                  <SelectItem value="approvedAt">Approved date</SelectItem>
                  <SelectItem value="rejectedAt">Rejected date</SelectItem>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="space-y-2 md:col-span-2">
              <Label>Date range</Label>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'flex-1 justify-start text-left font-normal',
                        !filters.dateFrom && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateFrom ? format(filters.dateFrom, 'PPP') : 'From date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateFrom}
                      onSelect={(date) => handleFilterChange('dateFrom', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'flex-1 justify-start text-left font-normal',
                        !filters.dateTo && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {filters.dateTo ? format(filters.dateTo, 'PPP') : 'To date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={filters.dateTo}
                      onSelect={(date) => handleFilterChange('dateTo', date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Requested By (Search) */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="requestedBy">Requested by</Label>
              <Input
                id="requestedBy"
                placeholder="Search by name or email..."
                value={filters.requestedBy || ''}
                onChange={(e) => handleFilterChange('requestedBy', e.target.value || undefined)}
              />
            </div>
          </div>

          {/* Active Filters Summary */}
          {activeFilterCount > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t pt-4">
              <span className="text-sm font-medium text-muted-foreground">Active filters:</span>
              {filters.status && (
                <Badge variant="secondary" className="gap-1">
                  Status: {filters.status}
                  <button
                    onClick={() => handleFilterChange('status', undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.type && (
                <Badge variant="secondary" className="gap-1">
                  Type: {APPROVAL_TYPES.find((t) => t.value === filters.type)?.label}
                  <button
                    onClick={() => handleFilterChange('type', undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.priority && (
                <Badge variant="secondary" className="gap-1">
                  Priority: {filters.priority}
                  <button
                    onClick={() => handleFilterChange('priority', undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.dateFrom && (
                <Badge variant="secondary" className="gap-1">
                  From: {format(filters.dateFrom, 'PP')}
                  <button
                    onClick={() => handleFilterChange('dateFrom', undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.dateTo && (
                <Badge variant="secondary" className="gap-1">
                  To: {format(filters.dateTo, 'PP')}
                  <button
                    onClick={() => handleFilterChange('dateTo', undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
              {filters.requestedBy && (
                <Badge variant="secondary" className="gap-1">
                  Requested by: {filters.requestedBy}
                  <button
                    onClick={() => handleFilterChange('requestedBy', undefined)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
