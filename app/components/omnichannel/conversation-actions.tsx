'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  MoreVertical,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserPlus,
  Tag,
  Archive,
} from 'lucide-react';
import { escalateConversation, updateConversation } from '@/app/lib/api/conversations';
import { toast } from 'sonner';
import type { Conversation } from '@/app/lib/stores/conversations-store';

interface ConversationActionsProps {
  conversation: Conversation;
}

export function ConversationActions({ conversation }: ConversationActionsProps) {
  const [escalateDialogOpen, setEscalateDialogOpen] = useState(false);
  const [escalateReason, setEscalateReason] = useState('');
  const [escalating, setEscalating] = useState(false);

  const handleEscalate = async () => {
    try {
      setEscalating(true);
      await escalateConversation(conversation.id);
      toast.success('Conversation escalated to CEO approval');
      setEscalateDialogOpen(false);
      setEscalateReason('');
    } catch (error) {
      console.error('Failed to escalate:', error);
      toast.error('Failed to escalate conversation');
    } finally {
      setEscalating(false);
    }
  };

  const handleStatusChange = async (status: string) => {
    try {
      await updateConversation(conversation.id, { status });
      toast.success(`Conversation ${status}`);
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update conversation');
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {/* Status Actions */}
          {conversation.status !== 'resolved' && (
            <DropdownMenuItem onClick={() => handleStatusChange('resolved')}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Resolve
            </DropdownMenuItem>
          )}
          {conversation.status !== 'pending' && (
            <DropdownMenuItem onClick={() => handleStatusChange('pending')}>
              <Clock className="mr-2 h-4 w-4" />
              Mark as Pending
            </DropdownMenuItem>
          )}
          {conversation.status !== 'open' && (
            <DropdownMenuItem onClick={() => handleStatusChange('open')}>
              <Archive className="mr-2 h-4 w-4" />
              Reopen
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />

          {/* Assignment Actions */}
          <DropdownMenuItem>
            <UserPlus className="mr-2 h-4 w-4" />
            Assign to...
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Tag className="mr-2 h-4 w-4" />
            Add Label...
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* Escalate */}
          <DropdownMenuItem
            onClick={() => setEscalateDialogOpen(true)}
            className="text-amber-600 focus:text-amber-600"
          >
            <AlertTriangle className="mr-2 h-4 w-4" />
            Escalate to CEO
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Escalate Dialog */}
      <Dialog open={escalateDialogOpen} onOpenChange={setEscalateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Escalate to CEO Approval</DialogTitle>
            <DialogDescription>
              This will create an approval request for the CEO to review this conversation.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="reason">Reason for escalation</Label>
              <Textarea
                id="reason"
                placeholder="Explain why this conversation needs CEO approval..."
                value={escalateReason}
                onChange={(e) => setEscalateReason(e.target.value)}
                rows={4}
              />
            </div>

            {/* Conversation Info */}
            <div className="rounded-lg border bg-muted/50 p-3 text-sm">
              <p className="font-medium">{conversation.contactName || 'Unknown'}</p>
              <p className="text-muted-foreground">{conversation.contactEmail}</p>
              <div className="mt-2 flex gap-2">
                <Badge variant="outline">{conversation.status}</Badge>
                {conversation.priority && (
                  <Badge variant="outline">{conversation.priority}</Badge>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEscalateDialogOpen(false)}
              disabled={escalating}
            >
              Cancel
            </Button>
            <Button onClick={handleEscalate} disabled={escalating}>
              {escalating ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Escalating...
                </>
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Escalate
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
