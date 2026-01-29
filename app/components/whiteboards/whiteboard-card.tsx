'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  Pencil,
  Copy,
  Trash2,
  Users,
  FileImage,
  MessageSquare,
} from 'lucide-react';
import Link from 'next/link';

export interface Whiteboard {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  thumbnailUrl?: string;
  collaborators?: Array<{ id: string; name: string }>;
  isTemplate?: boolean;
  tags?: Array<{ id: string; name: string; color: string }>;
  commentCount?: number;
}

interface WhiteboardCardProps {
  whiteboard: Whiteboard;
  onDuplicate?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function WhiteboardCard({ whiteboard, onDuplicate, onDelete }: WhiteboardCardProps) {
  const collaboratorCount = whiteboard.collaborators?.length || 0;

  return (
    <Card className="group relative overflow-hidden transition-all hover:shadow-lg">
      {/* Thumbnail */}
      <Link href={`/app/whiteboards/${whiteboard.id}`}>
        <div className="aspect-video w-full overflow-hidden bg-muted">
          {whiteboard.thumbnailUrl ? (
            <img
              src={whiteboard.thumbnailUrl}
              alt={whiteboard.name}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <FileImage className="h-12 w-12 text-muted-foreground/50" />
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 space-y-1">
            <Link href={`/app/whiteboards/${whiteboard.id}`}>
              <CardTitle className="line-clamp-1 text-base hover:underline">
                {whiteboard.name}
              </CardTitle>
            </Link>
            {whiteboard.description && (
              <CardDescription className="line-clamp-2 text-xs">
                {whiteboard.description}
              </CardDescription>
            )}
          </div>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/app/whiteboards/${whiteboard.id}`}>
                  <Pencil className="mr-2 h-4 w-4" />
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
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Tags */}
        {whiteboard.tags && whiteboard.tags.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {whiteboard.tags.slice(0, 3).map((tag) => (
              <Badge key={tag.id} variant="outline" className="h-5 gap-1 px-1.5 text-xs">
                <span className={`h-2 w-2 rounded-full ${tag.color}`} />
                {tag.name}
              </Badge>
            ))}
            {whiteboard.tags.length > 3 && (
              <Badge variant="outline" className="h-5 px-1.5 text-xs">
                +{whiteboard.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          {/* Last Updated */}
          <span>
            Updated {formatDistanceToNow(new Date(whiteboard.updatedAt), { addSuffix: true })}
          </span>

          {/* Stats */}
          <div className="flex items-center gap-3">
            {/* Comments */}
            {whiteboard.commentCount !== undefined && whiteboard.commentCount > 0 && (
              <div className="flex items-center gap-1">
                <MessageSquare className="h-3 w-3" />
                <span>{whiteboard.commentCount}</span>
              </div>
            )}
            {/* Collaborators */}
            {collaboratorCount > 0 && (
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{collaboratorCount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Template Badge */}
        {whiteboard.isTemplate && (
          <Badge variant="secondary" className="mt-2">
            Template
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
