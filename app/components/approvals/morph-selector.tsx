'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  GitBranch,
  Info,
  Building2,
  Users,
  User,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Approval } from '@/app/lib/stores/approvals-store';

interface MorphSelectorProps {
  approval: Approval;
  onMorph: (targetScope: 'org' | 'team' | 'individual', targetId: string, reason: string) => Promise<void>;
  processing?: boolean;
}

// Mock data - replace with actual API calls
const MOCK_TEAMS = [
  { id: 'team-eng', name: 'Engineering', memberCount: 12 },
  { id: 'team-fin', name: 'Finance', memberCount: 8 },
  { id: 'team-hr', name: 'Human Resources', memberCount: 5 },
  { id: 'team-ops', name: 'Operations', memberCount: 10 },
];

const MOCK_USERS = [
  { id: 'user-1', name: 'Sarah Chen', role: 'Product Manager', initials: 'SC' },
  { id: 'user-2', name: 'Mike Johnson', role: 'Engineering Lead', initials: 'MJ' },
  { id: 'user-3', name: 'Emma Wilson', role: 'Finance Director', initials: 'EW' },
  { id: 'user-4', name: 'Alex Rodriguez', role: 'HR Manager', initials: 'AR' },
];

export function MorphSelector({ approval, onMorph, processing = false }: MorphSelectorProps) {
  const [targetScope, setTargetScope] = useState<'org' | 'team' | 'individual'>(
    approval.scope === 'org' ? 'team' : approval.scope === 'team' ? 'individual' : 'team'
  );
  const [targetId, setTargetId] = useState('');
  const [targetName, setTargetName] = useState('');
  const [morphReason, setMorphReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users by search
  const filteredUsers = MOCK_USERS.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMorph = async () => {
    if (!targetId || !morphReason.trim()) return;
    await onMorph(targetScope, targetId, morphReason);
  };

  const getScopeIcon = (scope: string) => {
    switch (scope) {
      case 'org':
        return Building2;
      case 'team':
        return Users;
      case 'individual':
        return User;
      default:
        return GitBranch;
    }
  };

  const getScopeLabel = (scope: string) => {
    switch (scope) {
      case 'org':
        return 'Organization';
      case 'team':
        return 'Team';
      case 'individual':
        return 'Individual';
      default:
        return scope;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
          Morph to Different Scope
        </CardTitle>
        <CardDescription>
          Forward this approval to a different organizational scope while preserving lineage
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current scope */}
        <div className="rounded-lg border bg-muted/50 p-3">
          <p className="text-xs font-medium text-muted-foreground mb-1">Current Scope</p>
          <div className="flex items-center gap-2">
            {(() => {
              const Icon = getScopeIcon(approval.scope);
              return <Icon className="h-4 w-4" />;
            })()}
            <span className="text-sm font-medium">{getScopeLabel(approval.scope)}</span>
            <Badge variant="outline" className="text-xs">
              {approval.scopeId}
            </Badge>
          </div>
        </div>

        {/* Target scope selector */}
        <div className="space-y-2">
          <Label htmlFor="target-scope">Target Scope</Label>
          <Select
            value={targetScope}
            onValueChange={(value) => {
              setTargetScope(value as 'org' | 'team' | 'individual');
              setTargetId('');
              setTargetName('');
            }}
          >
            <SelectTrigger id="target-scope">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="org">
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Organization
                </div>
              </SelectItem>
              <SelectItem value="team">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Team
                </div>
              </SelectItem>
              <SelectItem value="individual">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Individual
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Target selector based on scope */}
        {targetScope === 'org' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Organization Level</AlertTitle>
            <AlertDescription>
              This will be visible to all members of your organization
            </AlertDescription>
          </Alert>
        )}

        {targetScope === 'team' && (
          <div className="space-y-2">
            <Label htmlFor="target-team">Select Team</Label>
            <Select
              value={targetId}
              onValueChange={(value) => {
                setTargetId(value);
                const team = MOCK_TEAMS.find((t) => t.id === value);
                setTargetName(team?.name || '');
              }}
            >
              <SelectTrigger id="target-team">
                <SelectValue placeholder="Choose team" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_TEAMS.map((team) => (
                  <SelectItem key={team.id} value={team.id}>
                    <div className="flex items-center justify-between gap-2">
                      <span>{team.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {team.memberCount} members
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {targetScope === 'individual' && (
          <div className="space-y-2">
            <Label htmlFor="target-user">Select Person</Label>
            <div className="space-y-2">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>

              {/* User list */}
              <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border p-2">
                {filteredUsers.length === 0 ? (
                  <p className="p-2 text-center text-sm text-muted-foreground">
                    No users found
                  </p>
                ) : (
                  filteredUsers.map((user) => (
                    <button
                      key={user.id}
                      onClick={() => {
                        setTargetId(user.id);
                        setTargetName(user.name);
                      }}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-muted',
                        targetId === user.id && 'bg-primary/10'
                      )}
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="text-xs">{user.initials}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.role}</p>
                      </div>
                      {targetId === user.id && (
                        <Badge variant="default" className="text-xs">
                          Selected
                        </Badge>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Morph reason */}
        <div className="space-y-2">
          <Label htmlFor="morph-reason">
            Reason for Morphing <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="morph-reason"
            placeholder="Explain why this approval is being forwarded to a different scope..."
            value={morphReason}
            onChange={(e) => setMorphReason(e.target.value)}
            rows={3}
            disabled={processing}
          />
          <p className="text-xs text-muted-foreground">
            This reason will be recorded in the audit trail
          </p>
        </div>

        {/* Preview */}
        {targetId && morphReason && (
          <Alert>
            <GitBranch className="h-4 w-4" />
            <AlertTitle>Morph Preview</AlertTitle>
            <AlertDescription>
              <div className="mt-2 space-y-1 text-sm">
                <p>
                  <strong>From:</strong> {getScopeLabel(approval.scope)} ({approval.scopeId})
                </p>
                <p>
                  <strong>To:</strong> {getScopeLabel(targetScope)}{' '}
                  {targetName && `(${targetName})`}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  A new {targetScope}-level approval will be created. The original approval
                  remains unchanged and will be linked to the new one.
                </p>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={handleMorph}
            disabled={processing || !targetId || !morphReason.trim()}
            className="flex-1"
          >
            {processing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Morphing...
              </>
            ) : (
              <>
                <GitBranch className="mr-2 h-4 w-4" />
                Morph to {getScopeLabel(targetScope)}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
