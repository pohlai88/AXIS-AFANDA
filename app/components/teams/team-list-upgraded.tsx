'use client';

import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { formatDistanceToNow } from 'date-fns';
import {
  Users,
  MoreHorizontal,
  Eye,
  Settings,
  UserPlus,
  Trash2,
  Mail,
  Calendar,
} from 'lucide-react';
import type { Team } from '@/app/lib/types';
import { NoTeamsState } from '@/app/components/common/empty-states';

interface TeamListProps {
  teams: Team[];
  loading?: boolean;
  onTeamClick: (id: string) => void;
  onInvite?: (id: string) => void;
  onSettings?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// shadcn best practice: Use semantic variant mapping
const getStatusVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'default';
    case 'inactive':
      return 'secondary';
    case 'archived':
      return 'outline';
    default:
      return 'default';
  }
};

const getSizeVariant = (size: number) => {
  if (size >= 20) return 'default';
  if (size >= 10) return 'secondary';
  return 'outline';
};

export function TeamListUpgraded({
  teams,
  loading,
  onTeamClick,
  onInvite,
  onSettings,
  onDelete,
}: TeamListProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Card key={index} className="p-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-20 rounded-full" />
                </div>
              </div>
              <Skeleton className="h-8 w-8" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (teams.length === 0) {
    return <NoTeamsState />;
  }

  return (
    <div className="space-y-4">
      {teams.map((team) => {
        const statusVariant = getStatusVariant('active'); // Default to active
        const sizeVariant = getSizeVariant(team.members?.length || 0);

        return (
          <Card key={team.id} className="transition-shadow hover:shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                {/* Team Avatar */}
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="text-lg font-semibold">
                      {team.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {team.visibility === 'public' && (
                    <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-approve-fg rounded-full border-2 border-background" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-2">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{team.name}</h3>
                      <Badge variant={statusVariant} className="text-xs">
                        {team.visibility || 'public'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={sizeVariant} className="text-xs">
                        <Users className="mr-1 h-3 w-3" />
                        {team.members?.length || 0}
                      </Badge>
                    </div>
                  </div>

                  {/* Description */}
                  {team.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {team.description}
                    </p>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span>Created {formatDistanceToNow(new Date(team.createdAt), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onTeamClick(team.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Team
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Mail className="mr-2 h-4 w-4" />
                      Message Team
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule Meeting
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {onInvite && (
                      <DropdownMenuItem onClick={() => onInvite(team.id)}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite Members
                      </DropdownMenuItem>
                    )}
                    {onSettings && (
                      <DropdownMenuItem onClick={() => onSettings(team.id)}>
                        <Settings className="mr-2 h-4 w-4" />
                        Team Settings
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {onDelete && (
                      <DropdownMenuItem onClick={() => onDelete(team.id)} className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Team
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
