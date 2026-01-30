'use client';

/**
 * Hook for real-time approval updates via SSE
 * 
 * Subscribes to approval events and provides typed updates for submissions,
 * decisions, morphs, PUSH events, comments, and mentions.
 */

import { useEffect } from 'react';
import { useSSEMulti } from './use-sse';
import { toast } from 'sonner';

export interface ApprovalUpdateData {
  approvalId?: string;
  approvalTitle?: string;
  templateCode?: string;
  status?: 'draft' | 'submitted' | 'approved' | 'rejected' | 'cancelled';
  decision?: string;
  reason?: string;
  actorName?: string;
  actorId?: string;
  morphedTo?: string;
  pushedToSystem?: string;
  commentText?: string;
  mentionedUsers?: string[];
}

export interface ApprovalUpdate {
  approvalId: string;
  type:
  | 'approval_submitted'
  | 'approval_approved'
  | 'approval_rejected'
  | 'approval_cancelled'
  | 'approval_morphed'
  | 'approval_pushed'
  | 'approval_commented'
  | 'approval_mentioned'
  | 'approval_updated'
  | 'approval_deleted';
  data: ApprovalUpdateData;
  timestamp: Date;
}

export interface UseApprovalUpdatesOptions {
  enabled?: boolean;
  showToasts?: boolean;
  onUpdate?: (update: ApprovalUpdate) => void;
}

/**
 * Subscribe to updates for all approvals (e.g., for the main list page)
 */
export function useApprovalUpdates(options: UseApprovalUpdatesOptions = {}) {
  const { enabled = true, showToasts = true, onUpdate } = options;

  const sseUrl = '/api/v1/approvals/updates';

  const eventTypes = [
    'approval_submitted',
    'approval_approved',
    'approval_rejected',
    'approval_cancelled',
    'approval_morphed',
    'approval_pushed',
    'approval_commented',
    'approval_mentioned',
    'approval_updated',
    'approval_deleted',
  ];

  const { events, isConnected, error } = useSSEMulti(
    sseUrl,
    eventTypes,
    {
      enabled,
      onOpen: () => {
        console.log('[Approval Updates] Connected');
      },
      onError: (err) => {
        console.error('[Approval Updates] Error:', err);
        if (showToasts) {
          toast.error('Lost connection to approval updates', {
            description: 'Attempting to reconnect...',
          });
        }
      },
    }
  );

  // Handle incoming events
  useEffect(() => {
    events.forEach((event, eventType) => {
      const data = event.data as ApprovalUpdateData;
      const update: ApprovalUpdate = {
        approvalId: data.approvalId || '',
        type: eventType as ApprovalUpdate['type'],
        data,
        timestamp: event.timestamp,
      };

      // Show toast notifications for important events
      if (showToasts) {
        switch (eventType) {
          case 'approval_submitted':
            toast.info(`New approval submitted: ${data.approvalTitle || 'Untitled'}`, {
              icon: '📝',
              description: `by ${data.actorName || 'Unknown'}`,
            });
            break;
          case 'approval_approved':
            toast.success(`Approval approved: ${data.approvalTitle || 'Untitled'}`, {
              icon: '✅',
              description: data.decision || 'Approved',
            });
            break;
          case 'approval_rejected':
            toast.error(`Approval rejected: ${data.approvalTitle || 'Untitled'}`, {
              icon: '❌',
              description: data.reason || 'Rejected',
            });
            break;
          case 'approval_morphed':
            toast.info('Approval morphed to another approval', {
              icon: '🔄',
              description: data.approvalTitle,
            });
            break;
          case 'approval_pushed':
            toast.success(`Approval pushed to ${data.pushedToSystem || 'external system'}`, {
              icon: '🚀',
            });
            break;
          case 'approval_commented':
            toast.info('New comment on approval', {
              icon: '💬',
              description: data.commentText,
            });
            break;
          case 'approval_mentioned':
            toast.info('You were mentioned in an approval', {
              icon: '@',
              description: data.approvalTitle,
              action: {
                label: 'View',
                onClick: () => {
                  window.location.href = `/app/approvals/${data.approvalId}`;
                },
              },
            });
            break;
        }
      }

      // Call custom handler
      onUpdate?.(update);
    });
  }, [events, showToasts, onUpdate]);

  return {
    isConnected,
    error,
    updates: Array.from(events.values()),
  };
}
