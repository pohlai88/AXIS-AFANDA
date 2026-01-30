'use client';

/**
 * Hook for real-time team updates via SSE
 * 
 * Subscribes to team events and provides typed updates for membership changes,
 * invitations, role changes, and settings updates.
 */

import { useEffect } from 'react';
import { useSSEMulti } from './use-sse';
import { toast } from 'sonner';

export interface TeamUpdateData {
  teamId?: string;
  teamName?: string;
  memberId?: string;
  memberName?: string;
  memberEmail?: string;
  role?: 'owner' | 'admin' | 'member' | 'viewer';
  previousRole?: 'owner' | 'admin' | 'member' | 'viewer';
  invitationId?: string;
  invitedEmail?: string;
  invitedBy?: string;
  invitedByName?: string;
  settingsChanged?: string[];
}

export interface TeamUpdate {
  teamId: string;
  type:
  | 'team_created'
  | 'team_updated'
  | 'team_deleted'
  | 'member_added'
  | 'member_removed'
  | 'member_role_changed'
  | 'invitation_sent'
  | 'invitation_accepted'
  | 'invitation_declined'
  | 'invitation_cancelled'
  | 'settings_updated';
  data: TeamUpdateData;
  timestamp: Date;
}

export interface UseTeamUpdatesOptions {
  enabled?: boolean;
  showToasts?: boolean;
  onUpdate?: (update: TeamUpdate) => void;
}

/**
 * Subscribe to updates for all teams
 */
export function useTeamUpdates(options: UseTeamUpdatesOptions = {}) {
  const { enabled = true, showToasts = true, onUpdate } = options;

  const sseUrl = '/api/v1/teams/updates';

  const eventTypes = [
    'team_created',
    'team_updated',
    'team_deleted',
    'member_added',
    'member_removed',
    'member_role_changed',
    'invitation_sent',
    'invitation_accepted',
    'invitation_declined',
    'invitation_cancelled',
    'settings_updated',
  ];

  const { events, isConnected, error } = useSSEMulti(
    sseUrl,
    eventTypes,
    {
      enabled,
      onOpen: () => {
        console.log('[Team Updates] Connected');
      },
      onError: (err) => {
        console.error('[Team Updates] Error:', err);
        if (showToasts) {
          toast.error('Lost connection to team updates', {
            description: 'Attempting to reconnect...',
          });
        }
      },
    }
  );

  // Handle incoming events
  useEffect(() => {
    events.forEach((event, eventType) => {
      const data = event.data as TeamUpdateData;
      const update: TeamUpdate = {
        teamId: data.teamId || '',
        type: eventType as TeamUpdate['type'],
        data,
        timestamp: event.timestamp,
      };

      // Show toast notifications for important events
      if (showToasts) {
        switch (eventType) {
          case 'team_created':
            toast.success(`New team created: ${data.teamName || 'Untitled'}`, {
              icon: '👥',
              action: {
                label: 'View',
                onClick: () => {
                  window.location.href = `/app/teams/${data.teamId}`;
                },
              },
            });
            break;
          case 'member_added':
            toast.info(`${data.memberName || 'Someone'} joined the team`, {
              icon: '👋',
              description: data.teamName,
            });
            break;
          case 'member_removed':
            toast.info(`${data.memberName || 'Someone'} left the team`, {
              icon: '👋',
              description: data.teamName,
            });
            break;
          case 'member_role_changed':
            toast.info(`Role changed: ${data.memberName || 'Member'}`, {
              icon: '🔑',
              description: `${data.previousRole || 'Unknown'} → ${data.role || 'Unknown'}`,
            });
            break;
          case 'invitation_sent':
            toast.success('Team invitation sent', {
              icon: '📧',
              description: `to ${data.invitedEmail || 'someone'}`,
            });
            break;
          case 'invitation_accepted':
            toast.success('Team invitation accepted!', {
              icon: '🎉',
              description: data.memberName,
            });
            break;
          case 'invitation_declined':
            toast.info('Team invitation declined', {
              icon: 'ℹ️',
              description: data.invitedEmail,
            });
            break;
          case 'settings_updated':
            toast.info('Team settings updated', {
              icon: '⚙️',
              description: data.teamName,
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
