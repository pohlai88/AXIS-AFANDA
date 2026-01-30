'use client';

/**
 * Whiteboards Store
 * State management for whiteboards with Zustand
 */

import { create } from 'zustand';
import {
  Whiteboard,
  WhiteboardFilters,
  CreateWhiteboardData,
  UpdateWhiteboardData,
  WhiteboardSnapshot,
  CreateSnapshotData,
  WhiteboardView,
} from '@/app/lib/types';
import * as whiteboardsApi from '@/app/lib/api/whiteboards';

// ============================================================================
// Store State Interface
// ============================================================================

interface WhiteboardsState {
  // Data
  whiteboards: Whiteboard[];
  selectedWhiteboard: Whiteboard | null;
  selectedWhiteboards: string[]; // IDs for multi-select
  snapshots: WhiteboardSnapshot[];
  filters: WhiteboardFilters;
  viewMode: WhiteboardView;

  // UI State
  loading: boolean;
  error: string | null;

  // Actions - Fetching
  fetchWhiteboards: (filters?: WhiteboardFilters) => Promise<void>;
  fetchWhiteboard: (id: string) => Promise<void>;
  fetchSnapshots: (whiteboardId: string) => Promise<void>;

  // Actions - CRUD
  createWhiteboard: (data: CreateWhiteboardData) => Promise<Whiteboard>;
  updateWhiteboard: (id: string, data: UpdateWhiteboardData) => Promise<Whiteboard>;
  deleteWhiteboard: (id: string) => Promise<void>;
  duplicateWhiteboard: (id: string, name?: string) => Promise<Whiteboard>;

  // Actions - Collaboration
  addCollaborator: (whiteboardId: string, userId: string, role?: 'owner' | 'editor' | 'viewer') => Promise<Whiteboard>;
  removeCollaborator: (whiteboardId: string, userId: string) => Promise<Whiteboard>;
  updateCollaboratorRole: (whiteboardId: string, userId: string, role: 'owner' | 'editor' | 'viewer') => Promise<Whiteboard>;

  // Actions - Snapshots
  createSnapshot: (whiteboardId: string, data: CreateSnapshotData) => Promise<WhiteboardSnapshot>;
  restoreSnapshot: (whiteboardId: string, snapshotId: string) => Promise<Whiteboard>;
  deleteSnapshot: (whiteboardId: string, snapshotId: string) => Promise<void>;

  // Actions - Selection
  selectWhiteboard: (whiteboard: Whiteboard | null) => void;
  toggleWhiteboardSelection: (whiteboardId: string) => void;
  selectMultipleWhiteboards: (whiteboardIds: string[]) => void;
  clearSelection: () => void;

  // Actions - State Management
  setWhiteboards: (whiteboards: Whiteboard[]) => void;
  addWhiteboard: (whiteboard: Whiteboard) => void;
  updateWhiteboardInStore: (id: string, updates: Partial<Whiteboard>) => void;
  removeWhiteboard: (id: string) => void;
  setFilters: (filters: WhiteboardFilters) => void;
  setViewMode: (viewMode: WhiteboardView) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// ============================================================================
// Store Implementation
// ============================================================================

export const useWhiteboardsStore = create<WhiteboardsState>((set, get) => ({
  // Initial State
  whiteboards: [],
  selectedWhiteboard: null,
  selectedWhiteboards: [],
  snapshots: [],
  filters: {},
  viewMode: 'all',
  loading: false,
  error: null,

  // Fetch whiteboards with filters
  fetchWhiteboards: async (filters) => {
    set({ loading: true, error: null });
    try {
      const whiteboards = await whiteboardsApi.getWhiteboards(filters);
      set({ whiteboards, loading: false });
      if (filters) {
        set({ filters });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch whiteboards';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Fetch single whiteboard
  fetchWhiteboard: async (id) => {
    set({ loading: true, error: null });
    try {
      const whiteboard = await whiteboardsApi.getWhiteboard(id);
      set({ selectedWhiteboard: whiteboard, loading: false });

      // Update in list if exists
      const { whiteboards } = get();
      const index = whiteboards.findIndex((w) => w.id === id);
      if (index !== -1) {
        const updatedWhiteboards = [...whiteboards];
        updatedWhiteboards[index] = whiteboard;
        set({ whiteboards: updatedWhiteboards });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch whiteboard';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Fetch snapshots for a whiteboard
  fetchSnapshots: async (whiteboardId) => {
    try {
      const snapshots = await whiteboardsApi.getSnapshots(whiteboardId);
      set({ snapshots });
    } catch (error) {
      console.error('Failed to fetch snapshots:', error);
      // Don't set error state for snapshots failures
    }
  },

  // Create new whiteboard
  createWhiteboard: async (data) => {
    set({ loading: true, error: null });
    try {
      const whiteboard = await whiteboardsApi.createWhiteboard(data);
      set((state) => ({
        whiteboards: [whiteboard, ...state.whiteboards],
        selectedWhiteboard: whiteboard,
        loading: false,
      }));
      return whiteboard;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create whiteboard';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Update whiteboard
  updateWhiteboard: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const whiteboard = await whiteboardsApi.updateWhiteboard(id, data);
      set((state) => ({
        whiteboards: state.whiteboards.map((w) => (w.id === id ? whiteboard : w)),
        selectedWhiteboard: state.selectedWhiteboard?.id === id ? whiteboard : state.selectedWhiteboard,
        loading: false,
      }));
      return whiteboard;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update whiteboard';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Delete whiteboard
  deleteWhiteboard: async (id) => {
    set({ loading: true, error: null });
    try {
      await whiteboardsApi.deleteWhiteboard(id);
      set((state) => ({
        whiteboards: state.whiteboards.filter((w) => w.id !== id),
        selectedWhiteboard: state.selectedWhiteboard?.id === id ? null : state.selectedWhiteboard,
        selectedWhiteboards: state.selectedWhiteboards.filter((wId) => wId !== id),
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete whiteboard';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Duplicate whiteboard
  duplicateWhiteboard: async (id, name) => {
    set({ loading: true, error: null });
    try {
      const whiteboard = await whiteboardsApi.duplicateWhiteboard(id, name);
      set((state) => ({
        whiteboards: [whiteboard, ...state.whiteboards],
        loading: false,
      }));
      return whiteboard;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to duplicate whiteboard';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Add collaborator
  addCollaborator: async (whiteboardId, userId, role) => {
    try {
      const whiteboard = await whiteboardsApi.addCollaborator(whiteboardId, userId, role);
      set((state) => ({
        whiteboards: state.whiteboards.map((w) => (w.id === whiteboardId ? whiteboard : w)),
        selectedWhiteboard: state.selectedWhiteboard?.id === whiteboardId ? whiteboard : state.selectedWhiteboard,
      }));
      return whiteboard;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add collaborator';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Remove collaborator
  removeCollaborator: async (whiteboardId, userId) => {
    try {
      const whiteboard = await whiteboardsApi.removeCollaborator(whiteboardId, userId);
      set((state) => ({
        whiteboards: state.whiteboards.map((w) => (w.id === whiteboardId ? whiteboard : w)),
        selectedWhiteboard: state.selectedWhiteboard?.id === whiteboardId ? whiteboard : state.selectedWhiteboard,
      }));
      return whiteboard;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove collaborator';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Update collaborator role
  updateCollaboratorRole: async (whiteboardId, userId, role) => {
    try {
      const whiteboard = await whiteboardsApi.updateCollaboratorRole(whiteboardId, userId, role);
      set((state) => ({
        whiteboards: state.whiteboards.map((w) => (w.id === whiteboardId ? whiteboard : w)),
        selectedWhiteboard: state.selectedWhiteboard?.id === whiteboardId ? whiteboard : state.selectedWhiteboard,
      }));
      return whiteboard;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update collaborator role';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Create snapshot
  createSnapshot: async (whiteboardId, data) => {
    try {
      const snapshot = await whiteboardsApi.createSnapshot(whiteboardId, data);
      set((state) => ({
        snapshots: [snapshot, ...state.snapshots],
      }));
      return snapshot;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create snapshot';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Restore snapshot
  restoreSnapshot: async (whiteboardId, snapshotId) => {
    try {
      const whiteboard = await whiteboardsApi.restoreSnapshot(whiteboardId, snapshotId);
      set((state) => ({
        whiteboards: state.whiteboards.map((w) => (w.id === whiteboardId ? whiteboard : w)),
        selectedWhiteboard: state.selectedWhiteboard?.id === whiteboardId ? whiteboard : state.selectedWhiteboard,
      }));
      return whiteboard;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to restore snapshot';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Delete snapshot
  deleteSnapshot: async (whiteboardId, snapshotId) => {
    try {
      await whiteboardsApi.deleteSnapshot(whiteboardId, snapshotId);
      set((state) => ({
        snapshots: state.snapshots.filter((s) => s.id !== snapshotId),
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete snapshot';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Selection management
  selectWhiteboard: (whiteboard) => set({ selectedWhiteboard: whiteboard }),

  toggleWhiteboardSelection: (whiteboardId) =>
    set((state) => ({
      selectedWhiteboards: state.selectedWhiteboards.includes(whiteboardId)
        ? state.selectedWhiteboards.filter((id) => id !== whiteboardId)
        : [...state.selectedWhiteboards, whiteboardId],
    })),

  selectMultipleWhiteboards: (whiteboardIds) => set({ selectedWhiteboards: whiteboardIds }),

  clearSelection: () => set({ selectedWhiteboards: [] }),

  // State management
  setWhiteboards: (whiteboards) => set({ whiteboards }),

  addWhiteboard: (whiteboard) =>
    set((state) => ({
      whiteboards: [whiteboard, ...state.whiteboards],
    })),

  updateWhiteboardInStore: (id, updates) =>
    set((state) => ({
      whiteboards: state.whiteboards.map((w) => (w.id === id ? { ...w, ...updates } : w)),
      selectedWhiteboard:
        state.selectedWhiteboard?.id === id
          ? { ...state.selectedWhiteboard, ...updates }
          : state.selectedWhiteboard,
    })),

  removeWhiteboard: (id) =>
    set((state) => ({
      whiteboards: state.whiteboards.filter((w) => w.id !== id),
      selectedWhiteboard: state.selectedWhiteboard?.id === id ? null : state.selectedWhiteboard,
      selectedWhiteboards: state.selectedWhiteboards.filter((wId) => wId !== id),
    })),

  setFilters: (filters) => set({ filters }),

  setViewMode: (viewMode) => set({ viewMode }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      whiteboards: [],
      selectedWhiteboard: null,
      selectedWhiteboards: [],
      snapshots: [],
      filters: {},
      viewMode: 'all',
      loading: false,
      error: null,
    }),
}));
