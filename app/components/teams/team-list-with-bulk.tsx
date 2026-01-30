'use client';

import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Users,
  MoreVertical,
  Eye,
  Settings,
  UserPlus,
  UserMinus,
  Trash2,
  CheckSquare,
  Shield,
  Globe,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSelectionSet } from '@/app/components/shared';
import { NoTeamsState } from '@/app/components/common/empty-states';

interface Team {
  id: string;
  name: string;
  description: string;
  visibility: 'public' | 'private';
  memberCount: number;
  role: 'owner' | 'admin' | 'member';
  createdAt: string;
  members?: TeamMember[];
}

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member';
  avatar?: string;
}

interface TeamListWithBulkProps {
  teams: Team[];
  loading?: boolean;
  onSelectTeam?: (team: Team) => void;
  onInviteMembers?: (teamIds: string[], memberEmails: string[]) => void;
  onRemoveMembers?: (teamIds: string[], memberIds: string[]) => void;
  onDeleteTeams?: (teamIds: string[]) => void;
}

const VISIBILITY_CONFIG = {
  public: { icon: Globe, label: 'Public', className: 'text-changes-fg' },
  private: { icon: Lock, label: 'Private', className: 'text-status-warn-fg' },
};

const ROLE_CONFIG = {
  owner: { label: 'Owner', className: 'bg-primary/10 text-primary' },
  admin: { label: 'Admin', className: 'bg-changes-bg text-changes-fg' },
  member: { label: 'Member', className: 'bg-muted text-muted-foreground' },
};

export function TeamListWithBulk({
  teams,
  loading,
  onSelectTeam,
  onInviteMembers,
  onRemoveMembers,
  onDeleteTeams,
}: TeamListWithBulkProps) {
  const allIds = teams.map((t) => t.id);
  const {
    selected,
    selectedCount,
    isAllSelected,
    toggleAll,
    toggleOne,
    clear,
  } = useSelectionSet(allIds);

  const handleBulkInvite = () => {
    if (selectedCount > 0 && onInviteMembers) {
      // In a real implementation, this would open a dialog to enter emails
      const mockEmails = ['new-user@example.com', 'another@example.com'];
      onInviteMembers(Array.from(selected), mockEmails);
      clear();
    }
  };

  const handleBulkRemove = () => {
    if (selectedCount > 0 && onRemoveMembers) {
      // In a real implementation, this would show member selection
      const mockMemberIds = ['member-1', 'member-2'];
      onRemoveMembers(Array.from(selected), mockMemberIds);
      clear();
    }
  };

  const handleBulkDelete = () => {
    if (selectedCount > 0 && onDeleteTeams) {
      onDeleteTeams(Array.from(selected));
      clear();
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-2 text-sm text-muted-foreground">Loading teams...</p>
        </div>
      </div>
    );
  }

  if (teams.length === 0) {
    return <NoTeamsState />;
  }

  return (
    <div className="space-y-4">
      {/* Bulk Actions Bar */}
      {selectedCount > 0 && (
        <Card className="border-l-4 border-l-primary">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">
                {selectedCount} team{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkInvite}
                disabled={!onInviteMembers}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Invite Members
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkRemove}
                disabled={!onRemoveMembers}
              >
                <UserMinus className="mr-2 h-4 w-4" />
                Remove Members
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleBulkDelete}
                disabled={!onDeleteTeams}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Teams
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={clear}
              >
                Clear
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Select All */}
      <div className="flex items-center gap-2 p-2 border rounded-lg bg-muted/20">
        <Checkbox
          checked={isAllSelected}
          onCheckedChange={toggleAll}
          aria-label="Select all teams"
        />
        <span className="text-sm font-medium">Select All</span>
        <span className="text-sm text-muted-foreground">
          ({selectedCount} of {teams.length} selected)
        </span>
      </div>

      {/* Team List */}
      <div className="grid gap-4">
        {teams.map((team) => {
          const visibilityConfig = VISIBILITY_CONFIG[team.visibility];
          const roleConfig = ROLE_CONFIG[team.role];

          return (
            <Card
              key={team.id}
              className={cn(
                'transition-all hover:shadow-md',
                selected.has(team.id) && 'ring-2 ring-primary ring-offset-2'
              )}
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  {/* Checkbox */}
                  <Checkbox
                    checked={selected.has(team.id)}
                    onCheckedChange={(checked) => toggleOne(team.id, !!checked)}
                    aria-label={`Select ${team.name}`}
                  />

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold truncate">{team.name}</h3>
                          <Badge variant="outline" className={roleConfig.className}>
                            {roleConfig.label}
                          </Badge>
                          <div className="flex items-center gap-1">
                            <visibilityConfig.icon className={cn('h-4 w-4', visibilityConfig.className)} />
                            <span className="text-xs text-muted-foreground">
                              {visibilityConfig.label}
                            </span>
                          </div>
                        </div>

                        {team.description && (
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {team.description}
                          </p>
                        )}

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{team.memberCount} member{team.memberCount !== 1 ? 's' : ''}</span>
                          </div>
                          <span>•</span>
                          <span>Created {team.createdAt}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => onSelectTeam?.(team)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Team
                            </DropdownMenuItem>
                            {team.role === 'owner' && (
                              <DropdownMenuItem>
                                <Settings className="mr-2 h-4 w-4" />
                                Settings
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onInviteMembers?.([team.id], ['new@example.com'])}>
                              <UserPlus className="mr-2 h-4 w-4" />
                              Invite Members
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onRemoveMembers?.([team.id], ['member-1'])}>
                              <UserMinus className="mr-2 h-4 w-4" />
                              Remove Members
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => onDeleteTeams?.([team.id])}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Team
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
