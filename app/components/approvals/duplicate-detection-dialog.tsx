'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  AlertTriangle,
  ExternalLink,
  Copy,
  ArrowRight,
  FileText,
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import type { Approval } from '@/app/lib/stores/approvals-store';

interface DuplicateDetectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  duplicate: Approval;
  onOpenExisting: () => void;
  onForwardExisting: () => void;
  onOverride: (reason: string) => void;
  processing?: boolean;
}

export function DuplicateDetectionDialog({
  open,
  onOpenChange,
  duplicate,
  onOpenExisting,
  onForwardExisting,
  onOverride,
  processing = false,
}: DuplicateDetectionDialogProps) {
  const [overrideReason, setOverrideReason] = useState('');
  const [showOverrideForm, setShowOverrideForm] = useState(false);

  const handleOverride = () => {
    if (overrideReason.trim()) {
      onOverride(overrideReason);
    }
  };

  const handleCancel = () => {
    setShowOverrideForm(false);
    setOverrideReason('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Duplicate Detected
          </DialogTitle>
          <DialogDescription>
            This request appears to be identical to an existing one
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Duplicate info card */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback>
                        {duplicate.requestedByName
                          ?.split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {duplicate.requestedByName || duplicate.requestedBy}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(duplicate.createdAt), { addSuffix: true })}
                        {' · '}
                        {format(new Date(duplicate.createdAt), 'MMM d, yyyy h:mm a')}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      duplicate.status === 'submitted'
                        ? 'default'
                        : duplicate.status === 'approved'
                          ? 'secondary'
                          : 'destructive'
                    }
                  >
                    {duplicate.status}
                  </Badge>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm font-medium">{duplicate.title || 'Untitled'}</p>
                  </div>
                  {duplicate.purpose && (
                    <p className="text-sm text-muted-foreground">{duplicate.purpose}</p>
                  )}
                  {duplicate.reason && (
                    <div className="rounded-lg bg-muted/50 p-3 text-sm">
                      {duplicate.reason}
                    </div>
                  )}
                </div>

                {/* Metadata */}
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span>ID: {duplicate.id.slice(0, 8)}</span>
                  <span>•</span>
                  <span>Template: {duplicate.templateCode}</span>
                  {duplicate.conversationId && (
                    <>
                      <span>•</span>
                      <span>Conversation: {duplicate.conversationId.slice(0, 8)}</span>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Warning */}
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Identical Content Detected</AlertTitle>
            <AlertDescription>
              The content of your request is identical to the one shown above.
              Creating a duplicate may cause confusion and delays. Please consider
              using the existing request instead.
            </AlertDescription>
          </Alert>

          {/* Override form */}
          {showOverrideForm && (
            <div className="space-y-2">
              <Label htmlFor="override-reason">
                Reason for Override <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="override-reason"
                placeholder="Explain why you need to create a duplicate request..."
                value={overrideReason}
                onChange={(e) => setOverrideReason(e.target.value)}
                rows={3}
                disabled={processing}
              />
              <p className="text-xs text-muted-foreground">
                A valid reason is required to create a duplicate request
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col gap-2 sm:flex-col">
          {!showOverrideForm ? (
            <>
              {/* Primary actions */}
              <div className="flex w-full gap-2">
                <Button
                  onClick={onOpenExisting}
                  className="flex-1"
                  disabled={processing}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Open Existing
                </Button>
                <Button
                  onClick={onForwardExisting}
                  variant="outline"
                  className="flex-1"
                  disabled={processing}
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Forward Existing
                </Button>
              </div>

              {/* Override option */}
              <div className="flex w-full gap-2">
                <Button
                  onClick={() => setShowOverrideForm(true)}
                  variant="destructive"
                  className="flex-1"
                  disabled={processing}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Override & Create Duplicate
                </Button>
                <Button
                  onClick={handleCancel}
                  variant="ghost"
                  disabled={processing}
                >
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              {/* Override actions */}
              <div className="flex w-full gap-2">
                <Button
                  onClick={handleOverride}
                  variant="destructive"
                  className="flex-1"
                  disabled={processing || !overrideReason.trim()}
                >
                  {processing ? (
                    <>
                      <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Create Duplicate
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => setShowOverrideForm(false)}
                  variant="outline"
                  disabled={processing}
                >
                  Back
                </Button>
              </div>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
