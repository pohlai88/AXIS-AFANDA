'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  ColumnsIcon,
  Download,
  RefreshCw,
  Plus,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface DataTableToolbarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onRefresh?: () => void;
  onAddNew?: () => void;
  onExport?: () => void;
  columns?: {
    id: string;
    header: string;
    visible: boolean;
  }[];
  onColumnVisibilityChange?: (columnId: string, visible: boolean) => void;
  selectedCount?: number;
  totalCount?: number;
  loading?: boolean;
  className?: string;
}

export function DataTableToolbar({
  searchValue = '',
  onSearchChange,
  onRefresh,
  onAddNew,
  onExport,
  columns = [],
  onColumnVisibilityChange,
  selectedCount = 0,
  totalCount = 0,
  loading = false,
  className,
}: DataTableToolbarProps) {
  const visibleColumns = columns.filter(column => column.visible);

  return (
    <div className={cn('flex items-center justify-between gap-2 py-4', className)}>
      {/* Left side - Search and Add */}
      <div className="flex items-center gap-2 flex-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            className="pl-9"
          />
        </div>
        {onAddNew && (
          <Button onClick={onAddNew} disabled={loading}>
            <Plus className="mr-2 h-4 w-4" />
            Add New
          </Button>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-2">
        {selectedCount > 0 && (
          <div className="text-sm text-muted-foreground">
            {selectedCount} of {totalCount} selected
          </div>
        )}
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <ColumnsIcon className="mr-2 h-4 w-4" />
              Columns
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {columns.map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                checked={column.visible}
                onCheckedChange={(checked) => onColumnVisibilityChange?.(column.id, checked)}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="truncate">{column.header}</span>
                </div>
              </DropdownMenuCheckboxItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onColumnVisibilityChange?.('all', true)}>
              Show All
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onColumnVisibilityChange?.('all', false)}>
              Hide All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {onRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={loading}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        )}

        {onExport && (
          <Button
            variant="outline"
            size="sm"
            onClick={onExport}
            disabled={loading}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
      </div>
    </div>
  );
}

export interface DataTableBulkActionsProps {
  selectedCount: number;
  onBulkApprove?: () => void;
  onBulkReject?: () => void;
  onBulkDelete?: () => void;
  onBulkArchive?: () => void;
  onBulkAssign?: () => void;
  onBulkTag?: () => void;
  className?: string;
}

export function DataTableBulkActions({
  selectedCount,
  onBulkApprove,
  onBulkReject,
  onBulkDelete,
  onBulkArchive,
  onBulkAssign,
  onBulkTag,
  className,
}: DataTableBulkActionsProps) {
  if (selectedCount === 0) {
    return null;
  }

  return (
    <div className={cn('flex items-center gap-2 p-2 border rounded-lg bg-muted/20', className)}>
      <span className="text-sm font-medium">
        {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
      </span>
      
      <div className="flex items-center gap-2">
        {onBulkApprove && (
          <Button variant="outline" size="sm" onClick={onBulkApprove}>
            Approve
          </Button>
        )}
        {onBulkReject && (
          <Button variant="outline" size="sm" onClick={onBulkReject}>
            Reject
          </Button>
        )}
        {onBulkArchive && (
          <Button variant="outline" size="sm" onClick={onBulkArchive}>
            Archive
          </Button>
        )}
        {onBulkAssign && (
          <Button variant="outline" size="sm" onClick={onBulkAssign}>
            Assign
          </Button>
        )}
        {onBulkTag && (
          <Button variant="outline" size="sm" onClick={onBulkTag}>
            Add Tag
          </Button>
        )}
        {onBulkDelete && (
          <Button
            variant="outline"
            size="sm"
            onClick={onBulkDelete}
            className="text-destructive hover:text-destructive"
          >
            Delete
          </Button>
        )}
      </div>
    </div>
  );
}
