import { EmptyState } from './empty-state';
import {
  Calendar,
  CheckSquare,
  MessageSquare,
  Users,
  FileText,
  Pencil,
  Plus,
  Bell,
  Paperclip,
  Clock,
} from 'lucide-react';

/**
 * Empty state for meetings/consultations
 */
export function NoMeetingsState({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={Calendar}
      title="No meetings scheduled"
      description="Schedule your first meeting to get started with consultations and collaborative sessions."
      action={onCreate ? {
        label: 'Schedule Meeting',
        onClick: onCreate,
        icon: Plus,
      } : undefined}
    />
  );
}

/**
 * Empty state for tasks
 */
export function NoTasksState({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={CheckSquare}
      title="No tasks yet"
      description="Create your first task to start managing your work. You can also generate tasks from meetings, approvals, or conversations."
      action={onCreate ? {
        label: 'Create Task',
        onClick: onCreate,
        icon: Plus,
      } : undefined}
    />
  );
}

/**
 * Empty state for approvals
 */
export function NoApprovalsState() {
  return (
    <EmptyState
      icon={FileText}
      title="No pending approvals"
      description="You're all caught up! There are no approvals waiting for your review."
    />
  );
}

/**
 * Empty state for conversations/inbox
 */
export function NoConversationsState() {
  return (
    <EmptyState
      icon={MessageSquare}
      title="No conversations"
      description="Your inbox is empty. New customer conversations will appear here."
    />
  );
}

/**
 * Empty state for whiteboards
 */
export function NoWhiteboardsState({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={Pencil}
      title="No whiteboards yet"
      description="Create your first whiteboard for collaborative brainstorming, diagramming, and visual planning."
      action={onCreate ? {
        label: 'New Whiteboard',
        onClick: onCreate,
        icon: Plus,
      } : undefined}
    />
  );
}

/**
 * Empty state for teams
 */
export function NoTeamsState({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      icon={Users}
      title="No teams yet"
      description="Create your first team to organize members and manage permissions across your organization."
      action={onCreate ? {
        label: 'Create Team',
        onClick: onCreate,
        icon: Plus,
      } : undefined}
    />
  );
}

/**
 * Empty state for search results
 */
export function NoSearchResultsState({ query, onClear }: { query: string; onClear?: () => void }) {
  return (
    <EmptyState
      title="No results found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search terms or filters.`}
      action={onClear ? {
        label: 'Clear Search',
        onClick: onClear,
      } : undefined}
    />
  );
}

/**
 * Empty state for filtered results
 */
export function NoFilteredResultsState({ onClear }: { onClear?: () => void }) {
  return (
    <EmptyState
      title="No matches found"
      description="No items match your current filters. Try adjusting or clearing your filters."
      action={onClear ? {
        label: 'Clear Filters',
        onClick: onClear,
      } : undefined}
    />
  );
}

/**
 * Empty state for notifications
 */
export function NoNotificationsState() {
  return (
    <EmptyState
      icon={Bell}
      title="No notifications"
      description="You're all caught up! No new notifications to show."
    />
  );
}

/**
 * Empty state for attachments
 */
export function NoAttachmentsState({ onUpload }: { onUpload?: () => void }) {
  return (
    <EmptyState
      icon={Paperclip}
      title="No attachments"
      description="No files have been attached yet."
      action={onUpload ? {
        label: 'Upload Files',
        onClick: onUpload,
        icon: Plus,
      } : undefined}
    />
  );
}

/**
 * Empty state for timeline/activity
 */
export function NoTimelineState() {
  return (
    <EmptyState
      icon={Clock}
      title="No activity yet"
      description="There's no activity to show. Start by taking some actions."
    />
  );
}
