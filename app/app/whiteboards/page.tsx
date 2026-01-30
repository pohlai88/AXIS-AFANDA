'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WhiteboardCard, type Whiteboard } from '@/app/components/whiteboards/whiteboard-card';
import { WhiteboardsTable } from '@/app/components/whiteboards/whiteboards-table';
import { Plus, Search, Grid3x3, List, FileImage, Table as TableIcon, Pencil } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useWhiteboardsStore } from '@/app/lib/stores/whiteboards-store';
import { ConnectionStatusIndicator } from '@/app/components/common/connection-status-indicator';
import { WhiteboardStatsCards, type WhiteboardStats } from '@/app/components/whiteboards/whiteboard-stats';
import { WhiteboardCardSkeleton, SimpleCardSkeleton, TableSkeleton } from '@/app/components/common/skeletons';
import { NoWhiteboardsState, NoSearchResultsState } from '@/app/components/common/empty-states';
import { useDebounce } from '@/app/hooks/use-debounce';
import { useActivityStream } from '@/app/hooks/use-activity-stream';
import { useTenant } from '@/app/providers/tenant-provider';

// Mock data for MVP (will be replaced with API calls)
const MOCK_WHITEBOARDS: Whiteboard[] = [
  {
    id: 'wb-1',
    name: 'Product Roadmap Q1 2026',
    description: 'Strategic planning for Q1 product releases',
    createdBy: 'user-1',
    createdAt: '2026-01-20T10:00:00Z',
    updatedAt: '2026-01-28T09:30:00Z',
    collaborators: [
      { id: 'user-1', name: 'John Doe' },
      { id: 'user-2', name: 'Jane Smith' },
    ],
    tags: [
      { id: 'tag-1', name: 'Planning', color: 'bg-primary' },
      { id: 'tag-2', name: 'Urgent', color: 'bg-reject-fg' },
    ],
    commentCount: 5,
  },
  {
    id: 'wb-2',
    name: 'Customer Journey Map',
    description: 'Mapping the customer experience from discovery to retention',
    createdBy: 'user-1',
    createdAt: '2026-01-25T14:00:00Z',
    updatedAt: '2026-01-27T16:45:00Z',
    collaborators: [
      { id: 'user-1', name: 'John Doe' },
    ],
    tags: [
      { id: 'tag-3', name: 'Design', color: 'bg-primary' },
      { id: 'tag-4', name: 'Review', color: 'bg-status-warn-fg' },
    ],
    commentCount: 3,
  },
  {
    id: 'wb-3',
    name: 'Architecture Diagram',
    description: 'System architecture and data flow',
    createdBy: 'user-1',
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-01-26T11:20:00Z',
    isTemplate: true,
    tags: [
      { id: 'tag-5', name: 'Draft', color: 'bg-muted-foreground' },
    ],
    commentCount: 0,
  },
];

export default function WhiteboardsPage() {
  const router = useRouter();
  const { tenant } = useTenant();
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Debounce search by 300ms
  const [filterBy, setFilterBy] = useState<'all' | 'my' | 'shared' | 'templates'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');

  // Use Zustand store for state management
  const {
    whiteboards: storeWhiteboards,
    loading,
    fetchWhiteboards,
    deleteWhiteboard,
    duplicateWhiteboard: duplicateInStore,
  } = useWhiteboardsStore();

  // Use store data, fallback to mock for development
  const whiteboards = storeWhiteboards.length > 0 ? storeWhiteboards : MOCK_WHITEBOARDS;

  // Calculate stats using useMemo
  const whiteboardStats = useMemo((): WhiteboardStats => {
    const total = whiteboards.length;
    const my = whiteboards.filter(w => !w.isTemplate).length;
    const shared = whiteboards.filter(w => (w.collaborators?.length || 0) > 1).length;
    // Mock calculation for active today - would check actual activity timestamps
    const activeToday = Math.floor(total * 0.3); // Simulate 30% being active today

    return {
      total,
      my,
      shared,
      activeToday,
    };
  }, [whiteboards]);

  // Whiteboards list doesn't have a dedicated SSE endpoint; use the global activity stream
  // as a connection health indicator (scoped by current tenant).
  const { isConnected, error } = useActivityStream(tenant?.id ?? '', !!tenant?.id);

  // Fetch whiteboards on mount
  useEffect(() => {
    fetchWhiteboards().catch(console.error);
  }, [fetchWhiteboards]);

  // Filter whiteboards (using debounced search query)
  const filteredWhiteboards = whiteboards.filter((wb) => {
    // Search filter (debounced)
    const matchesSearch = wb.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
      wb.description?.toLowerCase().includes(debouncedSearchQuery.toLowerCase());

    // Type filter
    const matchesFilter =
      filterBy === 'all' ||
      (filterBy === 'templates' && wb.isTemplate) ||
      (filterBy === 'my' && !wb.isTemplate) ||
      (filterBy === 'shared' && (wb.collaborators?.length || 0) > 1);

    return matchesSearch && matchesFilter;
  });

  const handleCreateNew = () => {
    // Generate a unique ID (in production, this would come from the API)
    const newId = `wb-${crypto.randomUUID()}`;
    router.push(`/app/whiteboards/${newId}`);
  };

  const handleDuplicate = async (id: string) => {
    try {
      const original = whiteboards.find((wb) => wb.id === id);
      if (!original) return;

      await duplicateInStore(id, `${original.name} (Copy)`);
      toast.success('Whiteboard duplicated');
    } catch (error) {
      console.error('Failed to duplicate whiteboard:', error);
      toast.error('Failed to duplicate whiteboard');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteWhiteboard(id);
      toast.success('Whiteboard deleted');
    } catch (error) {
      console.error('Failed to delete whiteboard:', error);
      toast.error('Failed to delete whiteboard');
    }
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-lux-gold-soft flex h-12 w-12 items-center justify-center rounded-xl">
              <Pencil className="h-6 w-6 text-lux-gold" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Whiteboards</h1>
              <p className="text-sm text-muted-foreground">
                Collaborative infinite canvas for brainstorming and design
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ConnectionStatusIndicator
              isConnected={isConnected}
              isConnecting={!tenant?.id}
              error={error}
              showLabel
              className="hidden sm:flex"
            />
            <Button onClick={handleCreateNew}>
              <Plus className="mr-2 h-4 w-4" />
              New Whiteboard
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-4">
          <WhiteboardStatsCards stats={whiteboardStats} loading={loading} />
        </div>

        {/* Filters */}
        <div className="mt-4 flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search whiteboards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Filter Dropdown */}
          <Select value={filterBy} onValueChange={(value) => setFilterBy(value as 'all' | 'my' | 'shared' | 'templates')}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Boards</SelectItem>
              <SelectItem value="my">My Boards</SelectItem>
              <SelectItem value="shared">Shared</SelectItem>
              <SelectItem value="templates">Templates</SelectItem>
            </SelectContent>
          </Select>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 rounded-md border p-1">
            <Button
              variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('grid')}
              title="Grid view"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('list')}
              title="List view"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'table' ? 'secondary' : 'ghost'}
              size="icon"
              className="h-7 w-7"
              onClick={() => setViewMode('table')}
              title="Table view"
            >
              <TableIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {loading && whiteboards.length === 0 ? (
          // Loading State
          viewMode === 'table' ? (
            <TableSkeleton rows={8} columns={5} showActions />
          ) : (
            <div
              className={
                viewMode === 'grid'
                  ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                  : 'space-y-4'
              }
            >
              {viewMode === 'grid' ? (
                <WhiteboardCardSkeleton count={8} />
              ) : (
                <SimpleCardSkeleton count={6} />
              )}
            </div>
          )
        ) : filteredWhiteboards.length === 0 ? (
          // Empty State
          debouncedSearchQuery ? (
            <NoSearchResultsState
              query={debouncedSearchQuery}
              onClear={() => setSearchQuery('')}
            />
          ) : (
            <NoWhiteboardsState onCreate={handleCreateNew} />
          )
        ) : viewMode === 'table' ? (
          // Table View
          <WhiteboardsTable
            whiteboards={filteredWhiteboards}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
          />
        ) : (
          // Grid/List View
          <div
            className={
              viewMode === 'grid'
                ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'space-y-4'
            }
          >
            {filteredWhiteboards.map((whiteboard) => (
              <WhiteboardCard
                key={whiteboard.id}
                whiteboard={whiteboard}
                onDuplicate={handleDuplicate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
