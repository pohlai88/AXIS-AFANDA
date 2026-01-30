'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

export interface FilterGroup {
  key: string;
  label: string;
  options: FilterOption[];
  type?: 'select' | 'multiselect';
}

export interface EntityFiltersProps<T extends Record<string, any>> {
  filters: T;
  onFilterChange: (filters: T) => void;
  groups: FilterGroup[];
  searchPlaceholder?: string;
  className?: string;
}

export function EntityFilters<T extends Record<string, any>>({
  filters,
  onFilterChange,
  groups,
  searchPlaceholder = "Search...",
  className,
}: EntityFiltersProps<T>) {
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<string>>(new Set());

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    onFilterChange(newFilters);

    // Track active filters for display
    if (value && value !== 'all') {
      setActiveFilters(prev => new Set([...prev, key]));
    } else {
      setActiveFilters(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  const handleMultiSelectChange = (key: string, values: string[] | string) => {
    const newFilters = { ...filters, [key]: values };
    onFilterChange(newFilters);

    // Track active filters for display
    const valueArray = Array.isArray(values) ? values : [values].filter(v => v);
    if (valueArray.length > 0) {
      setActiveFilters(prev => new Set([...prev, key]));
    } else {
      setActiveFilters(prev => {
        const newSet = new Set(prev);
        newSet.delete(key);
        return newSet;
      });
    }
  };

  const clearFilter = (key: string) => {
    handleFilterChange(key, groups.find(g => g.key === key)?.options[0]?.value || 'all');
  };

  const clearAllFilters = () => {
    const defaultFilters = groups.reduce((acc, group) => {
      acc[group.key] = group.options[0]?.value || 'all';
      return acc;
    }, {} as Record<string, any>);
    onFilterChange(defaultFilters);
    setActiveFilters(new Set());
    setSearch('');
  };

  const getActiveFilterCount = () => {
    return activeFilters.size;
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        {getActiveFilterCount() > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {/* Filter Groups */}
      <div className="flex flex-wrap gap-2">
        {groups.map((group) => {
          const currentValue = filters[group.key];
          const isActive = activeFilters.has(group.key);

          return (
            <div key={group.key} className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">
                {group.label}:
              </span>

              {group.type === 'multiselect' ? (
                <div className="relative">
                  <Select
                    value={Array.isArray(currentValue) ? currentValue : []}
                    onValueChange={(values) => handleMultiSelectChange(group.key, values)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select..." />
                    </SelectTrigger>
                    <SelectContent>
                      {group.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center justify-between w-full">
                            <span>{option.label}</span>
                            {option.count && (
                              <Badge variant="secondary" className="ml-2">
                                {option.count}
                              </Badge>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
                <Select
                  value={currentValue || ''}
                  onValueChange={(value) => handleFilterChange(group.key, value)}
                >
                  <SelectTrigger className={cn('w-40', isActive && 'border-primary')}>
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                  <SelectContent>
                    {group.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{option.label}</span>
                          {option.count && (
                            <Badge variant="secondary" className="ml-2">
                              {option.count}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              {isActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => clearFilter(group.key)}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Active Filters Summary */}
      {getActiveFilterCount() > 0 && (
        <div className="flex items-center gap-2 p-2 bg-muted/20 rounded-lg">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">
            {getActiveFilterCount()} filter{getActiveFilterCount() !== 1 ? 's' : ''} active
          </span>
        </div>
      )}
    </div>
  );
}
