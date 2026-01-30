/**
 * Centralized Type Definitions
 * Single source of truth for all domain types
 * 
 * Usage:
 *   import { Meeting, MeetingSchema, Task, ApprovalTemplate } from '@/app/lib/types';
 */

// ============================================================================
// Common Types (exported first as they're dependencies)
// ============================================================================

export * from './common';
export * from './api';

// ============================================================================
// Domain Types (alphabetical order)
// ============================================================================

export * from './activity';
export * from './approvals';
export * from './consultations';
export * from './conversations';
export * from './tasks';
export * from './teams';
export * from './whiteboards';

// ============================================================================
// Re-export commonly used schemas for convenience
// ============================================================================

export {
  // Activity
  ActivityItemSchema,
  ActivityListSchema,
  ActivityEventSchema,
} from './activity';

export {
  // Approvals
  ApprovalSchema,
  ApprovalListSchema,
  ApprovalTemplateSchema,
  CreateApprovalSchema,
  UpdateApprovalSchema,
  ApprovalFiltersSchema,
  ApprovalStatsSchema,
} from './approvals';

export {
  // Consultations
  MeetingSchema,
  MeetingListSchema,
  ParticipantSchema,
  CreateMeetingSchema,
  UpdateMeetingSchema,
  MeetingFiltersSchema,
  MeetingStatsSchema,
} from './consultations';

export {
  // Conversations
  ConversationSchema,
  ConversationListSchema,
  MessageSchema,
  MessageListSchema,
  CreateConversationSchema,
  SendMessageSchema,
  ConversationFiltersSchema,
  ConversationStatsSchema,
} from './conversations';

export {
  // Tasks
  TaskSchema,
  TaskListSchema,
  CreateTaskSchema,
  UpdateTaskSchema,
  TaskFiltersSchema,
  TaskStatsSchema,
} from './tasks';

export {
  // Teams
  TeamSchema,
  TeamListSchema,
  TeamMemberSchema,
  CreateTeamSchema,
  UpdateTeamSchema,
  TeamFiltersSchema,
  TeamStatsSchema,
} from './teams';

export {
  // Whiteboards
  WhiteboardSchema,
  WhiteboardListSchema,
  CreateWhiteboardSchema,
  UpdateWhiteboardSchema,
  WhiteboardFiltersSchema,
} from './whiteboards';

// ============================================================================
// Utility Type Helpers
// ============================================================================

/**
 * Extract the data type from a Create schema
 * Usage: CreateData<typeof MeetingSchema> => CreateMeetingData
 */
export type CreateData<T> = T extends { omit: (...args: any) => infer R } ? R : never;

/**
 * Extract the data type from an Update schema
 */
export type UpdateData<T> = T extends { partial: () => infer R } ? R : never;

/**
 * Make all properties of T optional except for K
 */
export type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Extract keys where the value is of a certain type
 */
export type KeysOfType<T, U> = {
  [K in keyof T]: T[K] extends U ? K : never;
}[keyof T];
