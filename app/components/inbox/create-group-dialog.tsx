'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Users2, X } from 'lucide-react';
import { toast } from 'sonner';

// Mock team members
const mockTeamMembers = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah@company.com',
    avatar: 'SC',
    department: 'Product',
    status: 'online' as const,
  },
  {
    id: '2',
    name: 'Mike Johnson',
    email: 'mike@company.com',
    avatar: 'MJ',
    department: 'Engineering',
    status: 'online' as const,
  },
  {
    id: '3',
    name: 'Emma Wilson',
    email: 'emma@company.com',
    avatar: 'EW',
    department: 'Product',
    status: 'away' as const,
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    email: 'alex@company.com',
    avatar: 'AR',
    department: 'Engineering',
    status: 'online' as const,
  },
  {
    id: '5',
    name: 'Lisa Park',
    email: 'lisa@company.com',
    avatar: 'LP',
    department: 'Design',
    status: 'online' as const,
  },
  {
    id: '6',
    name: 'David Kim',
    email: 'david@company.com',
    avatar: 'DK',
    department: 'Marketing',
    status: 'away' as const,
  },
  {
    id: '7',
    name: 'Rachel Green',
    email: 'rachel@company.com',
    avatar: 'RG',
    department: 'Sales',
    status: 'online' as const,
  },
  {
    id: '8',
    name: 'Tom Anderson',
    email: 'tom@company.com',
    avatar: 'TA',
    department: 'Engineering',
    status: 'online' as const,
  },
];

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateGroup: (group: {
    name: string;
    description: string;
    memberIds: string[];
  }) => void;
}

export function CreateGroupDialog({
  open,
  onOpenChange,
  onCreateGroup,
}: CreateGroupDialogProps) {
  const [step, setStep] = useState<'details' | 'members'>('details');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMembers = mockTeamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleRemoveMember = (memberId: string) => {
    setSelectedMembers((prev) => prev.filter((id) => id !== memberId));
  };

  const handleCreate = () => {
    if (!groupName.trim()) {
      toast.error('Please enter a group name');
      return;
    }

    if (selectedMembers.length === 0) {
      toast.error('Please select at least one member');
      return;
    }

    onCreateGroup({
      name: groupName,
      description: groupDescription,
      memberIds: selectedMembers,
    });

    // Reset form
    setGroupName('');
    setGroupDescription('');
    setSelectedMembers([]);
    setStep('details');
    onOpenChange(false);

    toast.success(`Group "${groupName}" created successfully!`);
  };

  const handleClose = () => {
    setGroupName('');
    setGroupDescription('');
    setSelectedMembers([]);
    setStep('details');
    onOpenChange(false);
  };

  const selectedMembersList = mockTeamMembers.filter((m) =>
    selectedMembers.includes(m.id)
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users2 className="h-5 w-5" />
            Create Group Conversation
          </DialogTitle>
          <DialogDescription>
            {step === 'details'
              ? 'Give your group a name and description'
              : 'Add team members to your group'}
          </DialogDescription>
        </DialogHeader>

        {step === 'details' ? (
          /* Step 1: Group Details */
          <div className="space-y-4 py-4">
            {/* Group Name */}
            <div className="space-y-2">
              <Label htmlFor="group-name">
                Group Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="group-name"
                placeholder="e.g., Engineering Team, Product Planning..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                autoFocus
              />
            </div>

            {/* Group Description */}
            <div className="space-y-2">
              <Label htmlFor="group-description">Description (Optional)</Label>
              <Textarea
                id="group-description"
                placeholder="What's this group for?"
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                rows={3}
              />
            </div>

            {/* Preview */}
            {groupName && (
              <div className="rounded-lg border bg-muted/50 p-4">
                <p className="text-xs font-medium text-muted-foreground">Preview</p>
                <div className="mt-2 flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {groupName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{groupName}</h4>
                    {groupDescription && (
                      <p className="text-sm text-muted-foreground">
                        {groupDescription}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Step 2: Add Members */
          <div className="space-y-4 py-4">
            {/* Selected Members */}
            {selectedMembers.length > 0 && (
              <div className="space-y-2">
                <Label>Selected Members ({selectedMembers.length})</Label>
                <div className="flex flex-wrap gap-2 rounded-lg border bg-muted/50 p-3">
                  {selectedMembersList.map((member) => (
                    <Badge
                      key={member.id}
                      variant="secondary"
                      className="gap-1.5 pr-1"
                    >
                      <span>{member.name}</span>
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="rounded-full hover:bg-muted"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Search */}
            <div className="space-y-2">
              <Label>Add Team Members</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or department..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Member List */}
            <ScrollArea className="h-80 rounded-lg border">
              <div className="divide-y">
                {filteredMembers.length === 0 ? (
                  <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
                    No team members found
                  </div>
                ) : (
                  filteredMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50"
                    >
                      <Checkbox
                        id={`member-${member.id}`}
                        checked={selectedMembers.includes(member.id)}
                        onCheckedChange={() => handleToggleMember(member.id)}
                      />
                      <label
                        htmlFor={`member-${member.id}`}
                        className="flex flex-1 cursor-pointer items-center gap-3"
                      >
                        <div className="relative">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-sm">
                              {member.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div
                            className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background ${member.status === 'online'
                                ? 'bg-approve-fg'
                                : 'bg-status-warn-fg'
                              }`}
                          />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium">{member.name}</p>
                            <Badge variant="outline" className="h-4 text-xs">
                              {member.department}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {member.email}
                          </p>
                        </div>
                      </label>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        <DialogFooter>
          {step === 'details' ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                onClick={() => setStep('members')}
                disabled={!groupName.trim()}
              >
                Next: Add Members
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setStep('details')}>
                Back
              </Button>
              <Button onClick={handleCreate} disabled={selectedMembers.length === 0}>
                Create Group ({selectedMembers.length} members)
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
