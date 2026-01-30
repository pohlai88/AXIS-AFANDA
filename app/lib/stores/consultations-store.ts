'use client';

/**
 * Consultations/Meetings Store
 * State management for meetings with Zustand
 */

import { create } from 'zustand';
import {
  Meeting,
  MeetingFilters,
  MeetingStats,
  CreateMeetingData,
  UpdateMeetingData,
} from '@/app/lib/types';
import * as consultationsApi from '@/app/lib/api/consultations';

// ============================================================================
// Store State Interface
// ============================================================================

interface ConsultationsState {
  // Data
  meetings: Meeting[];
  selectedMeeting: Meeting | null;
  stats: MeetingStats | null;
  filters: MeetingFilters;

  // UI State
  loading: boolean;
  error: string | null;

  // Actions - Fetching
  fetchMeetings: (filters?: MeetingFilters) => Promise<void>;
  fetchMeeting: (id: string) => Promise<void>;
  fetchStats: () => Promise<void>;

  // Actions - CRUD
  createMeeting: (data: CreateMeetingData) => Promise<Meeting>;
  updateMeeting: (id: string, data: UpdateMeetingData) => Promise<Meeting>;
  deleteMeeting: (id: string) => Promise<void>;

  // Actions - Domain-specific
  startMeeting: (id: string) => Promise<Meeting>;
  completeMeeting: (id: string) => Promise<Meeting>;
  cancelMeeting: (id: string, reason?: string) => Promise<Meeting>;
  joinMeeting: (id: string, participantId: string) => Promise<Meeting>;
  leaveMeeting: (id: string, participantId: string) => Promise<Meeting>;

  // Actions - State Management
  setMeetings: (meetings: Meeting[]) => void;
  addMeeting: (meeting: Meeting) => void;
  updateMeetingInStore: (id: string, updates: Partial<Meeting>) => void;
  removeMeeting: (id: string) => void;
  selectMeeting: (meeting: Meeting | null) => void;
  setFilters: (filters: MeetingFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// ============================================================================
// Store Implementation
// ============================================================================

export const useConsultationsStore = create<ConsultationsState>((set, get) => ({
  // Initial State
  meetings: [],
  selectedMeeting: null,
  stats: null,
  filters: {},
  loading: false,
  error: null,

  // Fetch meetings with filters
  fetchMeetings: async (filters) => {
    set({ loading: true, error: null });
    try {
      const meetings = await consultationsApi.getMeetings(filters);
      set({ meetings, loading: false });
      if (filters) {
        set({ filters });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch meetings';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Fetch single meeting
  fetchMeeting: async (id) => {
    set({ loading: true, error: null });
    try {
      const meeting = await consultationsApi.getMeeting(id);
      set({ selectedMeeting: meeting, loading: false });

      // Update in list if exists
      const { meetings } = get();
      const index = meetings.findIndex((m) => m.id === id);
      if (index !== -1) {
        const updatedMeetings = [...meetings];
        updatedMeetings[index] = meeting;
        set({ meetings: updatedMeetings });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch meeting';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Fetch statistics
  fetchStats: async () => {
    try {
      const stats = await consultationsApi.getMeetingStats();
      set({ stats });
    } catch (error) {
      console.error('Failed to fetch meeting stats:', error);
      // Don't set error state for stats failures
    }
  },

  // Create new meeting
  createMeeting: async (data) => {
    set({ loading: true, error: null });
    try {
      const meeting = await consultationsApi.createMeeting(data);
      set((state) => ({
        meetings: [meeting, ...state.meetings],
        selectedMeeting: meeting,
        loading: false,
      }));
      return meeting;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create meeting';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Update meeting
  updateMeeting: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const meeting = await consultationsApi.updateMeeting(id, data);
      set((state) => ({
        meetings: state.meetings.map((m) => (m.id === id ? meeting : m)),
        selectedMeeting: state.selectedMeeting?.id === id ? meeting : state.selectedMeeting,
        loading: false,
      }));
      return meeting;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update meeting';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Delete meeting
  deleteMeeting: async (id) => {
    set({ loading: true, error: null });
    try {
      await consultationsApi.deleteMeeting(id);
      set((state) => ({
        meetings: state.meetings.filter((m) => m.id !== id),
        selectedMeeting: state.selectedMeeting?.id === id ? null : state.selectedMeeting,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete meeting';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Start meeting
  startMeeting: async (id) => {
    try {
      const meeting = await consultationsApi.startMeeting(id);
      set((state) => ({
        meetings: state.meetings.map((m) => (m.id === id ? meeting : m)),
        selectedMeeting: state.selectedMeeting?.id === id ? meeting : state.selectedMeeting,
      }));
      return meeting;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start meeting';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Complete meeting
  completeMeeting: async (id) => {
    try {
      const meeting = await consultationsApi.completeMeeting(id);
      set((state) => ({
        meetings: state.meetings.map((m) => (m.id === id ? meeting : m)),
        selectedMeeting: state.selectedMeeting?.id === id ? meeting : state.selectedMeeting,
      }));
      return meeting;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to complete meeting';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Cancel meeting
  cancelMeeting: async (id, reason) => {
    try {
      const meeting = await consultationsApi.cancelMeeting(id, reason);
      set((state) => ({
        meetings: state.meetings.map((m) => (m.id === id ? meeting : m)),
        selectedMeeting: state.selectedMeeting?.id === id ? meeting : state.selectedMeeting,
      }));
      return meeting;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel meeting';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Join meeting
  joinMeeting: async (id, participantId) => {
    try {
      const meeting = await consultationsApi.joinMeeting(id, participantId);
      set((state) => ({
        meetings: state.meetings.map((m) => (m.id === id ? meeting : m)),
        selectedMeeting: state.selectedMeeting?.id === id ? meeting : state.selectedMeeting,
      }));
      return meeting;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to join meeting';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Leave meeting
  leaveMeeting: async (id, participantId) => {
    try {
      const meeting = await consultationsApi.leaveMeeting(id, participantId);
      set((state) => ({
        meetings: state.meetings.map((m) => (m.id === id ? meeting : m)),
        selectedMeeting: state.selectedMeeting?.id === id ? meeting : state.selectedMeeting,
      }));
      return meeting;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to leave meeting';
      set({ error: errorMessage });
      throw error;
    }
  },

  // State management
  setMeetings: (meetings) => set({ meetings }),

  addMeeting: (meeting) =>
    set((state) => ({
      meetings: [meeting, ...state.meetings],
    })),

  updateMeetingInStore: (id, updates) =>
    set((state) => ({
      meetings: state.meetings.map((m) => (m.id === id ? { ...m, ...updates } : m)),
      selectedMeeting:
        state.selectedMeeting?.id === id
          ? { ...state.selectedMeeting, ...updates }
          : state.selectedMeeting,
    })),

  removeMeeting: (id) =>
    set((state) => ({
      meetings: state.meetings.filter((m) => m.id !== id),
      selectedMeeting: state.selectedMeeting?.id === id ? null : state.selectedMeeting,
    })),

  selectMeeting: (meeting) => set({ selectedMeeting: meeting }),

  setFilters: (filters) => set({ filters }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      meetings: [],
      selectedMeeting: null,
      stats: null,
      filters: {},
      loading: false,
      error: null,
    }),
}));
