export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  dueDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;

  // Source tracking (where task came from)
  source: 'manual' | 'approval' | 'omnichannel' | 'consultation' | 'whiteboard';
  sourceId?: string;

  // Assignment
  assignedTo: string;
  assignedBy?: string;

  // Organization
  tags?: string[];
  projectId?: string;

  // Metadata
  estimatedMinutes?: number;
  actualMinutes?: number;
  subtasks?: Subtask[];
  attachments?: Attachment[];
  comments?: Comment[];
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
}

export interface Comment {
  id: string;
  text: string;
  author: string;
  authorName: string;
  createdAt: Date;
}
