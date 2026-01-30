/**
 * Application Constants
 * 
 * Centralized constants to eliminate hardcoded values across the codebase.
 * Import from @/app/lib/constants
 */

// =============================================================================
// STATUS CONSTANTS
// =============================================================================

export const APPROVAL_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  POSTED: 'posted',
  VOID: 'void',
} as const;

export type ApprovalStatus = typeof APPROVAL_STATUS[keyof typeof APPROVAL_STATUS];

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  REVIEW: 'review',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
} as const;

export type TaskStatus = typeof TASK_STATUS[keyof typeof TASK_STATUS];

export const CONVERSATION_STATUS = {
  OPEN: 'open',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  SNOOZED: 'snoozed',
} as const;

export type ConversationStatus = typeof CONVERSATION_STATUS[keyof typeof CONVERSATION_STATUS];

export const MEETING_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export type MeetingStatus = typeof MEETING_STATUS[keyof typeof MEETING_STATUS];

// =============================================================================
// PRIORITY CONSTANTS
// =============================================================================

export const PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export type Priority = typeof PRIORITY[keyof typeof PRIORITY];

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  urgent: 'Urgent',
};

// =============================================================================
// VISIBILITY CONSTANTS
// =============================================================================

export const VISIBILITY = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  RESTRICTED: 'restricted',
} as const;

export type Visibility = typeof VISIBILITY[keyof typeof VISIBILITY];

export const VISIBILITY_LABELS: Record<Visibility, string> = {
  public: 'Public',
  private: 'Private',
  restricted: 'Restricted',
};

// =============================================================================
// DIFFICULTY CONSTANTS
// =============================================================================

export const DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  ADVANCED: 'advanced',
} as const;

export type Difficulty = typeof DIFFICULTY[keyof typeof DIFFICULTY];

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Easy',
  medium: 'Medium',
  advanced: 'Advanced',
};

// =============================================================================
// HTTP STATUS CODES
// =============================================================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

export type HttpStatus = typeof HTTP_STATUS[keyof typeof HTTP_STATUS];

// =============================================================================
// TIMING CONSTANTS (in milliseconds)
// =============================================================================

export const TIMING = {
  /** SSE heartbeat interval */
  SSE_HEARTBEAT_MS: 15_000,
  /** Default debounce delay */
  DEBOUNCE_MS: 300,
  /** Default throttle delay */
  THROTTLE_MS: 100,
  /** Toast auto-dismiss duration */
  TOAST_DURATION_MS: 5_000,
  /** Invitation expiry (7 days) */
  INVITATION_EXPIRY_MS: 7 * 24 * 60 * 60 * 1000,
  /** Animation durations */
  MOTION_FAST_MS: 150,
  MOTION_BASE_MS: 250,
  MOTION_SLOW_MS: 350,
} as const;

// =============================================================================
// TEMPLATE CATEGORIES
// =============================================================================

export const TEMPLATE_CATEGORY = {
  PURCHASE: 'purchase',
  EXPENSE: 'expense',
  HR: 'hr',
  POLICY: 'policy',
  COMPLIANCE: 'compliance',
} as const;

export type TemplateCategory = typeof TEMPLATE_CATEGORY[keyof typeof TEMPLATE_CATEGORY];

export const TEMPLATE_CATEGORY_LABELS: Record<TemplateCategory, string> = {
  purchase: 'Purchase',
  expense: 'Expense',
  hr: 'HR',
  policy: 'Policy',
  compliance: 'Compliance',
};

// =============================================================================
// CHANNEL TYPES
// =============================================================================

export const CHANNEL_TYPE = {
  EMAIL: 'email',
  CHAT: 'chat',
  PHONE: 'phone',
  SOCIAL: 'social',
  WEB: 'web',
} as const;

export type ChannelType = typeof CHANNEL_TYPE[keyof typeof CHANNEL_TYPE];

// =============================================================================
// BULK ACTION TYPES
// =============================================================================

export const BULK_ACTION = {
  APPROVE: 'approve',
  REJECT: 'reject',
  DELETE: 'delete',
  ARCHIVE: 'archive',
  ASSIGN: 'assign',
  EXPORT: 'export',
} as const;

export type BulkAction = typeof BULK_ACTION[keyof typeof BULK_ACTION];

// =============================================================================
// COLOR TOKENS - Semantic mapping for status colors
// Use these instead of hardcoded Tailwind color classes
// =============================================================================

/**
 * Status color classes mapped to semantic tokens from globals.css
 * Use these instead of hardcoded colors like text-blue-600, bg-green-500, etc.
 */
export const STATUS_COLORS = {
  // Approval workflow
  approved: {
    bg: 'bg-approve-bg',
    fg: 'text-approve-fg',
    border: 'border-approve-bd',
  },
  rejected: {
    bg: 'bg-reject-bg',
    fg: 'text-reject-fg',
    border: 'border-reject-bd',
  },
  pending: {
    bg: 'bg-pending-bg',
    fg: 'text-pending-fg',
    border: 'border-pending-bd',
  },
  changes: {
    bg: 'bg-changes-bg',
    fg: 'text-changes-fg',
    border: 'border-changes-bd',
  },
  // Status tags
  draft: {
    bg: 'bg-status-draft-bg',
    fg: 'text-status-draft-fg',
    border: 'border-status-draft-bd',
  },
  posted: {
    bg: 'bg-status-posted-bg',
    fg: 'text-status-posted-fg',
    border: 'border-status-posted-bd',
  },
  void: {
    bg: 'bg-status-void-bg',
    fg: 'text-status-void-fg',
    border: 'border-status-void-bd',
  },
  warn: {
    bg: 'bg-status-warn-bg',
    fg: 'text-status-warn-fg',
    border: 'border-status-warn-bd',
  },
} as const;

/**
 * Priority color classes mapped to semantic tokens
 */
export const PRIORITY_COLORS = {
  low: {
    bg: 'bg-pending-bg',
    fg: 'text-pending-fg',
    border: 'border-pending-bd',
  },
  medium: {
    bg: 'bg-changes-bg',
    fg: 'text-changes-fg',
    border: 'border-changes-bd',
  },
  high: {
    bg: 'bg-status-warn-bg',
    fg: 'text-status-warn-fg',
    border: 'border-status-warn-bd',
  },
  urgent: {
    bg: 'bg-reject-bg',
    fg: 'text-reject-fg',
    border: 'border-reject-bd',
  },
} as const;

/**
 * KPI trend color classes
 */
export const KPI_COLORS = {
  up: {
    bg: 'bg-kpi-up-bg',
    fg: 'text-kpi-up-fg',
    border: 'border-kpi-up-bd',
  },
  down: {
    bg: 'bg-kpi-down-bg',
    fg: 'text-kpi-down-fg',
    border: 'border-kpi-down-bd',
  },
  flat: {
    bg: 'bg-kpi-flat-bg',
    fg: 'text-kpi-flat-fg',
    border: 'border-kpi-flat-bd',
  },
} as const;
