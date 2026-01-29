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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Filter,
  X,
  Calendar as CalendarIcon,
  Tag,
  Users,
  AlertCircle,
  Mail,
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  Bookmark,
  RotateCcw,
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { getAllChannels } from '@/app/lib/utils/channel-icons';

interface InboxFiltersProps {
  filters: {
    status?: string;
    priority?: string;
    assigneeId?: number;
    teamId?: number;
    labels?: string[];
    hasEscalation?: boolean;
    unreadOnly?: boolean;
    dateFrom?: Date;
    dateTo?: Date;
    sortBy?: string;
    sortOrder?: string;
    channelType?: string; // Omnichannel filter
  };
  onFiltersChange: (filters: any) => void;
}

// Predefined filter presets
const FILTER_PRESETS = [
  {
    id: 'my-open',
    name: 'My Open',
    icon: Mail,
    filters: { status: 'open', assigneeId: 'me' },
  },
  {
    id: 'urgent',
    name: 'Urgent',
    icon: AlertCircle,
    filters: { status: 'open', priority: 'urgent' },
  },
  {
    id: 'escalated',
    name: 'Escalated',
    icon: Zap,
    filters: { hasEscalation: true, status: 'open' },
  },
  {
    id: 'unread',
    name: 'Unread',
    icon: Mail,
    filters: { unreadOnly: true },
  },
  {
    id: 'pending',
    name: 'Pending',
    icon: Clock,
    filters: { status: 'pending' },
  },
  {
    id: 'resolved',
    name: 'Resolved',
    icon: CheckCircle2,
    filters: { status: 'resolved' },
  },
];

// Common labels (in production, fetch from API)
const AVAILABLE_LABELS = [
  'bug',
  'feature-request',
  'billing',
  'technical',
  'sales',
  'support',
  'vip',
  'urgent',
];

export function InboxFilters({ filters, onFiltersChange }: InboxFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(filters.labels || []);

  // Count active filters
  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value !== undefined && value !== 'all' && key !== 'sortBy' && key !== 'sortOrder'
  ).length;

  // Reset all filters
  const handleReset = () => {
    setSelectedLabels([]);
    onFiltersChange({});
  };

  // Apply preset
  const applyPreset = (preset: typeof FILTER_PRESETS[0]) => {
    onFiltersChange(preset.filters);
  };

  // Toggle label
  const toggleLabel = (label: string) => {
    const newLabels = selectedLabels.includes(label)
      ? selectedLabels.filter(l => l !== label)
      : [...selectedLabels, label];

    setSelectedLabels(newLabels);
    onFiltersChange({
      ...filters,
      labels: newLabels.length > 0 ? newLabels : undefined,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 px-1.5 text-xs">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="h-7 px-2 text-xs"
          >
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset
          </Button>
        )}
      </div>

      <Separator />

      {/* Quick Presets */}
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Quick Filters</Label>
        <div className="grid grid-cols-2 gap-2">
          {FILTER_PRESETS.map((preset) => {
            const Icon = preset.icon;
            const isActive = JSON.stringify(filters) === JSON.stringify(preset.filters);

            return (
              <Button
                key={preset.id}
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                onClick={() => applyPreset(preset)}
                className="h-auto flex-col items-start gap-1 p-2"
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="text-xs">{preset.name}</span>
              </Button>
            );
          })}
        </div>
      </div>

      <Separator />

      {/* Status Filter */}
      <div className="space-y-2">
        <Label htmlFor="status-filter" className="text-xs">
          Status
        </Label>
        <Select
          value={filters.status || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              status: value === 'all' ? undefined : value,
            })
          }
        >
          <SelectTrigger id="status-filter" className="h-9">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="open">
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" />
                Open
              </div>
            </SelectItem>
            <SelectItem value="pending">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                Pending
              </div>
            </SelectItem>
            <SelectItem value="resolved">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Resolved
              </div>
            </SelectItem>
            <SelectItem value="snoozed">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                Snoozed
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Priority Filter */}
      <div className="space-y-2">
        <Label htmlFor="priority-filter" className="text-xs">
          Priority
        </Label>
        <Select
          value={filters.priority || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              priority: value === 'all' ? undefined : value,
            })
          }
        >
          <SelectTrigger id="priority-filter" className="h-9">
            <SelectValue placeholder="All priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value="urgent">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-red-500" />
                Urgent
              </div>
            </SelectItem>
            <SelectItem value="high">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-orange-500" />
                High
              </div>
            </SelectItem>
            <SelectItem value="medium">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-yellow-500" />
                Medium
              </div>
            </SelectItem>
            <SelectItem value="low">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-blue-500" />
                Low
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Channel Filter */}
      <div className="space-y-2">
        <Label htmlFor="channel-filter" className="text-xs">
          Channel
        </Label>
        <Select
          value={filters.channelType || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              channelType: value === 'all' ? undefined : value,
            })
          }
        >
          <SelectTrigger id="channel-filter" className="h-9">
            <SelectValue placeholder="All channels" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All channels</SelectItem>
            {getAllChannels().map((channel) => {
              const ChannelIcon = channel.icon;
              return (
                <SelectItem key={channel.value} value={channel.value}>
                  <div className="flex items-center gap-2">
                    <ChannelIcon className={`h-3.5 w-3.5 ${channel.color}`} />
                    {channel.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Assignee Filter */}
      <div className="space-y-2">
        <Label htmlFor="assignee-filter" className="text-xs">
          Assignee
        </Label>
        <Select
          value={filters.assigneeId?.toString() || 'all'}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              assigneeId: value === 'all' ? undefined : value === 'me' ? 'me' : parseInt(value),
            })
          }
        >
          <SelectTrigger id="assignee-filter" className="h-9">
            <SelectValue placeholder="All assignees" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All assignees</SelectItem>
            <SelectItem value="me">
              <div className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5" />
                Assigned to me
              </div>
            </SelectItem>
            <SelectItem value="unassigned">Unassigned</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Special Filters */}
      <div className="space-y-3">
        <Label className="text-xs">Special Filters</Label>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="escalation-filter"
            checked={filters.hasEscalation || false}
            onCheckedChange={(checked) =>
              onFiltersChange({
                ...filters,
                hasEscalation: checked ? true : undefined,
              })
            }
          />
          <label
            htmlFor="escalation-filter"
            className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Zap className="h-3.5 w-3.5 text-orange-500" />
            Has Escalation
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="unread-filter"
            checked={filters.unreadOnly || false}
            onCheckedChange={(checked) =>
              onFiltersChange({
                ...filters,
                unreadOnly: checked ? true : undefined,
              })
            }
          />
          <label
            htmlFor="unread-filter"
            className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            <Mail className="h-3.5 w-3.5 text-blue-500" />
            Unread Only
          </label>
        </div>
      </div>

      {/* Advanced Filters Toggle */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="w-full justify-start text-xs"
      >
        <Filter className="mr-2 h-3.5 w-3.5" />
        {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
      </Button>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="space-y-4 rounded-lg border p-3">
          {/* Labels */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs">
              <Tag className="h-3.5 w-3.5" />
              Labels
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {AVAILABLE_LABELS.map((label) => (
                <Badge
                  key={label}
                  variant={selectedLabels.includes(label) ? 'default' : 'outline'}
                  className="cursor-pointer text-xs"
                  onClick={() => toggleLabel(label)}
                >
                  {label}
                  {selectedLabels.includes(label) && (
                    <X className="ml-1 h-3 w-3" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Date Range */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-xs">
              <CalendarIcon className="h-3.5 w-3.5" />
              Date Range
            </Label>
            <div className="grid gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'h-9 w-full justify-start text-left font-normal',
                      !filters.dateFrom && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {filters.dateFrom ? format(filters.dateFrom, 'PPP') : 'From date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateFrom}
                    onSelect={(date) =>
                      onFiltersChange({
                        ...filters,
                        dateFrom: date,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      'h-9 w-full justify-start text-left font-normal',
                      !filters.dateTo && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                    {filters.dateTo ? format(filters.dateTo, 'PPP') : 'To date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.dateTo}
                    onSelect={(date) =>
                      onFiltersChange({
                        ...filters,
                        dateTo: date,
                      })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <Separator />

          {/* Sort Options */}
          <div className="space-y-2">
            <Label className="text-xs">Sort By</Label>
            <Select
              value={filters.sortBy || 'lastMessage'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  sortBy: value,
                })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lastMessage">Last Message</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="created">Created Date</SelectItem>
                <SelectItem value="unread">Unread Count</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Sort Order</Label>
            <Select
              value={filters.sortOrder || 'desc'}
              onValueChange={(value) =>
                onFiltersChange({
                  ...filters,
                  sortOrder: value,
                })
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {activeFilterCount > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Active Filters</Label>
            <div className="flex flex-wrap gap-1.5">
              {filters.status && (
                <Badge variant="secondary" className="text-xs">
                  Status: {filters.status}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => onFiltersChange({ ...filters, status: undefined })}
                  />
                </Badge>
              )}
              {filters.priority && (
                <Badge variant="secondary" className="text-xs">
                  Priority: {filters.priority}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => onFiltersChange({ ...filters, priority: undefined })}
                  />
                </Badge>
              )}
              {filters.channelType && (
                <Badge variant="secondary" className="text-xs">
                  Channel: {filters.channelType}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => onFiltersChange({ ...filters, channelType: undefined })}
                  />
                </Badge>
              )}
              {filters.hasEscalation && (
                <Badge variant="secondary" className="text-xs">
                  Escalated
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => onFiltersChange({ ...filters, hasEscalation: undefined })}
                  />
                </Badge>
              )}
              {filters.unreadOnly && (
                <Badge variant="secondary" className="text-xs">
                  Unread
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => onFiltersChange({ ...filters, unreadOnly: undefined })}
                  />
                </Badge>
              )}
              {selectedLabels.map((label) => (
                <Badge key={label} variant="secondary" className="text-xs">
                  {label}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() => toggleLabel(label)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
