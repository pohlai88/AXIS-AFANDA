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
import { WhiteboardCard, type Whiteboard } from '@/app/components/whiteboards/whiteboard-card';
import { WhiteboardsTable } from '@/app/components/whiteboards/whiteboards-table';
import { Plus, Search, Grid3x3, List, FileImage, Table as TableIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
      { id: 'tag-1', name: 'Planning', color: 'bg-blue-500' },
      { id: 'tag-2', name: 'Urgent', color: 'bg-red-500' },
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
      { id: 'tag-3', name: 'Design', color: 'bg-purple-500' },
      { id: 'tag-4', name: 'Review', color: 'bg-orange-500' },
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
      { id: 'tag-5', name: 'Draft', color: 'bg-gray-500' },
    ],
    commentCount: 0,
  },
];

export default function WhiteboardsPage() {
  const router = useRouter();
  const [whiteboards, setWhiteboards] = useState<Whiteboard[]>(MOCK_WHITEBOARDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'my' | 'shared' | 'templates'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'table'>('grid');

  // Filter whiteboards
  const filteredWhiteboards = whiteboards.filter((wb) => {
    // Search filter
    const matchesSearch = wb.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wb.description?.toLowerCase().includes(searchQuery.toLowerCase());

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
    const newId = `wb-${Date.now()}`;
    router.push(`/app/whiteboards/${newId}`);
  };

  const handleDuplicate = (id: string) => {
    const original = whiteboards.find((wb) => wb.id === id);
    if (!original) return;

    const duplicate: Whiteboard = {
      ...original,
      id: `wb-${Date.now()}`,
      name: `${original.name} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setWhiteboards([duplicate, ...whiteboards]);
    toast.success('Whiteboard duplicated');
  };

  const handleDelete = (id: string) => {
    setWhiteboards(whiteboards.filter((wb) => wb.id !== id));
    toast.success('Whiteboard deleted');
  };

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Whiteboards</h1>
            <p className="text-sm text-muted-foreground">
              Collaborative infinite canvas for brainstorming and design
            </p>
          </div>
          <Button onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            New Whiteboard
          </Button>
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
          <Select value={filterBy} onValueChange={(value: any) => setFilterBy(value)}>
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
        {filteredWhiteboards.length === 0 ? (
          // Empty State
          <div className="flex h-full items-center justify-center">
            <div className="text-center">
              <FileImage className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">
                {searchQuery ? 'No whiteboards found' : 'No whiteboards yet'}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {searchQuery
                  ? 'Try adjusting your search or filters'
                  : 'Create your first whiteboard to get started'}
              </p>
              {!searchQuery && (
                <Button onClick={handleCreateNew} className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  New Whiteboard
                </Button>
              )}
            </div>
          </div>
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
