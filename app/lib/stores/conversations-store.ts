'use client';

import { create } from 'zustand';

// ============================================================================
// Types
// ============================================================================
export interface Conversation {
  id: string;
  tenantId: string;
  chatwootId: number;
  status: string;
  priority?: string;
  contactName?: string;
  contactEmail?: string;
  assigneeId?: number;
  assigneeName?: string;
  teamId?: number;
  teamName?: string;
  labels?: string[];
  unreadCount: number;
  lastMessageAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Message {
  id: string;
  conversationId: string;
  chatwootId: number;
  content: string;
  messageType: string;
  senderType: string;
  senderId: number;
  senderName?: string;
  private: boolean;
  attachments?: any[];
  createdAt: Date;
}

interface ConversationsState {
  conversations: Conversation[];
  selectedConversation: Conversation | null;
  messages: Record<string, Message[]>;
  loading: boolean;
  error: string | null;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (id: string, updates: Partial<Conversation>) => void;
  selectConversation: (conversation: Conversation | null) => void;
  setMessages: (conversationId: string, messages: Message[]) => void;
  addMessage: (conversationId: string, message: Message) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// ============================================================================
// Store
// ============================================================================
export const useConversationsStore = create<ConversationsState>((set) => ({
  conversations: [],
  selectedConversation: null,
  messages: {},
  loading: false,
  error: null,

  setConversations: (conversations) => set({ conversations }),

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  updateConversation: (id, updates) =>
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv.id === id ? { ...conv, ...updates } : conv
      ),
      selectedConversation:
        state.selectedConversation?.id === id
          ? { ...state.selectedConversation, ...updates }
          : state.selectedConversation,
    })),

  selectConversation: (conversation) =>
    set({ selectedConversation: conversation }),

  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    })),

  addMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [
          ...(state.messages[conversationId] || []),
          message,
        ],
      },
    })),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      conversations: [],
      selectedConversation: null,
      messages: {},
      loading: false,
      error: null,
    }),
}));
