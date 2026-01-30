'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import {
  MoreVertical,
  Copy,
  Trash2,
  ExternalLink,
  MessageSquare,
  ArrowUpDown,
} from 'lucide-react';
import Link from 'next/link';
import type { Whiteboard } from './whiteboard-card';
import { NoWhiteboardsState } from '@/app/components/common/empty-states';

interface WhiteboardsTableProps {
  whiteboards: Whiteboard[];
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

type SortField = 'name' | 'updatedAt' | 'collaborators' | 'comments';
type SortOrder = 'asc' | 'desc';

export function WhiteboardsTable({
  whiteboards,
  onDuplicate,
  onDelete,
}: WhiteboardsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('updatedAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Sort whiteboards
  const sortedWhiteboards = [...whiteboards].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
        break;
      case 'collaborators':
        comparison = (a.collaborators?.length || 0) - (b.collaborators?.length || 0);
        break;
      case 'comments':
        comparison = (a.commentCount || 0) - (b.commentCount || 0);
        break;
    }

    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(whiteboards.map((wb) => wb.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const isSelected = (id: string) => selectedIds.includes(id);
  const allSelected = whiteboards.length > 0 && selectedIds.length === whiteboards.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < whiteboards.length;

  // Render sort button inline instead of as a component
  const renderSortButton = (field: SortField, children: React.ReactNode) => (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 data-[state=open]:bg-accent"
      onClick={() => handleSort(field)}
    >
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="flex items-center gap-2 rounded-lg border bg-muted/50 p-3">
          <span className="text-sm font-medium">
            {selectedIds.length} selected
          </span>
          <Button variant="outline" size="sm">
            <Copy className="mr-2 h-4 w-4" />
            Duplicate
          </Button>
          <Button variant="outline" size="sm" className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={handleSelectAll}
                  aria-label="Select all"
                  className={someSelected ? 'data-[state=checked]:bg-primary' : ''}
                />
              </TableHead>
              <TableHead>
                {renderSortButton('name', 'Name')}
              </TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>
                {renderSortButton('collaborators', 'Collaborators')}
              </TableHead>
              <TableHead>
                {renderSortButton('comments', 'Comments')}
              </TableHead>
              <TableHead>
                {renderSortButton('updatedAt', 'Last Updated')}
              </TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedWhiteboards.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="p-8">
                  <NoWhiteboardsState />
                </TableCell>
              </TableRow>
            ) : (
              sortedWhiteboards.map((whiteboard) => (
                <TableRow
                  key={whiteboard.id}
                  className={isSelected(whiteboard.id) ? 'bg-muted/50' : ''}
                >
                  {/* Checkbox */}
                  <TableCell>
                    <Checkbox
                      checked={isSelected(whiteboard.id)}
                      onCheckedChange={(checked) =>
                        handleSelectOne(whiteboard.id, checked as boolean)
                      }
                      aria-label={`Select ${whiteboard.name}`}
                    />
                  </TableCell>

                  {/* Name */}
                  <TableCell>
                    <Link
                      href={`/app/whiteboards/${whiteboard.id}`}
                      className="flex items-center gap-2 hover:underline"
                    >
                      <div>
                        <div className="font-medium">{whiteboard.name}</div>
                        {whiteboard.description && (
                          <div className="text-sm text-muted-foreground line-clamp-1">
                            {whiteboard.description}
                          </div>
                        )}
                      </div>
                      {whiteboard.isTemplate && (
                        <Badge variant="secondary" className="ml-2">
                          Template
                        </Badge>
                      )}
                    </Link>
                  </TableCell>

                  {/* Tags */}
                  <TableCell>
                    {whiteboard.tags && whiteboard.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {whiteboard.tags.slice(0, 2).map((tag) => (
                          <Badge
                            key={tag.id}
                            variant="outline"
                            className="h-5 gap-1 px-1.5 text-xs"
                          >
                            <span className={`h-2 w-2 rounded-full ${tag.color}`} />
                            {tag.name}
                          </Badge>
                        ))}
                        {whiteboard.tags.length > 2 && (
                          <Badge variant="outline" className="h-5 px-1.5 text-xs">
                            +{whiteboard.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Collaborators */}
                  <TableCell>
                    {whiteboard.collaborators && whiteboard.collaborators.length > 0 ? (
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2">
                          {whiteboard.collaborators.slice(0, 3).map((user) => (
                            <Avatar key={user.id} className="h-6 w-6 border-2 border-background">
                              <AvatarFallback className="text-xs">
                                {user.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                          ))}
                        </div>
                        {whiteboard.collaborators.length > 3 && (
                          <span className="text-xs text-muted-foreground">
                            +{whiteboard.collaborators.length - 3}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Comments */}
                  <TableCell>
                    {whiteboard.commentCount !== undefined && whiteboard.commentCount > 0 ? (
                      <div className="flex items-center gap-1 text-sm">
                        <MessageSquare className="h-4 w-4 text-muted-foreground" />
                        <span>{whiteboard.commentCount}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground">—</span>
                    )}
                  </TableCell>

                  {/* Last Updated */}
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(whiteboard.updatedAt), {
                        addSuffix: true,
                      })}
                    </div>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/app/whiteboards/${whiteboard.id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open
                          </Link>
                        </DropdownMenuItem>
                        {onDuplicate && (
                          <DropdownMenuItem onClick={() => onDuplicate(whiteboard.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {onDelete && (
                          <DropdownMenuItem
                            onClick={() => onDelete(whiteboard.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
