'use client';

/**
 * Teams Store
 * State management for teams with Zustand
 */

import { create } from 'zustand';
import {
  Team,
  TeamMember,
  TeamInvitation,
  TeamFilters,
  TeamStats,
  CreateTeamData,
  UpdateTeamData,
  AddTeamMemberData,
  UpdateTeamMemberData,
  InviteTeamMembersData,
} from '@/app/lib/types';
import * as teamsApi from '@/app/lib/api/teams';

// ============================================================================
// Store State Interface
// ============================================================================

interface TeamsState {
  // Data
  teams: Team[];
  selectedTeam: Team | null;
  teamMembers: Record<string, TeamMember[]>; // teamId -> members
  teamInvitations: Record<string, TeamInvitation[]>; // teamId -> invitations
  stats: TeamStats | null;
  filters: TeamFilters;

  // UI State
  loading: boolean;
  error: string | null;

  // Actions - Fetching
  fetchTeams: (filters?: TeamFilters) => Promise<void>;
  fetchTeam: (id: string) => Promise<void>;
  fetchTeamMembers: (teamId: string) => Promise<void>;
  fetchTeamInvitations: (teamId: string, status?: 'pending' | 'accepted' | 'declined' | 'expired') => Promise<void>;
  fetchStats: () => Promise<void>;

  // Actions - CRUD
  createTeam: (data: CreateTeamData) => Promise<Team>;
  updateTeam: (id: string, data: UpdateTeamData) => Promise<Team>;
  deleteTeam: (id: string) => Promise<void>;

  // Actions - Members
  addTeamMember: (teamId: string, data: AddTeamMemberData) => Promise<TeamMember>;
  updateTeamMember: (teamId: string, memberId: string, data: UpdateTeamMemberData) => Promise<TeamMember>;
  removeTeamMember: (teamId: string, userId: string) => Promise<void>;

  // Actions - Invitations
  inviteTeamMembers: (teamId: string, data: InviteTeamMembersData) => Promise<{ invited: number; failed: number; invitations: TeamInvitation[] }>;
  cancelInvitation: (teamId: string, invitationId: string) => Promise<void>;
  resendInvitation: (teamId: string, invitationId: string) => Promise<TeamInvitation>;

  // Actions - State Management
  setTeams: (teams: Team[]) => void;
  addTeam: (team: Team) => void;
  updateTeamInStore: (id: string, updates: Partial<Team>) => void;
  removeTeam: (id: string) => void;
  selectTeam: (team: Team | null) => void;
  setFilters: (filters: TeamFilters) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

// ============================================================================
// Store Implementation
// ============================================================================

export const useTeamsStore = create<TeamsState>((set, get) => ({
  // Initial State
  teams: [],
  selectedTeam: null,
  teamMembers: {},
  teamInvitations: {},
  stats: null,
  filters: {},
  loading: false,
  error: null,

  // Fetch teams with filters
  fetchTeams: async (filters) => {
    set({ loading: true, error: null });
    try {
      const teams = await teamsApi.getTeams(filters);
      set({ teams, loading: false });
      if (filters) {
        set({ filters });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch teams';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Fetch single team
  fetchTeam: async (id) => {
    set({ loading: true, error: null });
    try {
      const team = await teamsApi.getTeam(id);
      set({ selectedTeam: team, loading: false });

      // Update in list if exists
      const { teams } = get();
      const index = teams.findIndex((t) => t.id === id);
      if (index !== -1) {
        const updatedTeams = [...teams];
        updatedTeams[index] = team;
        set({ teams: updatedTeams });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch team';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Fetch team members
  fetchTeamMembers: async (teamId) => {
    try {
      const members = await teamsApi.getTeamMembers(teamId);
      set((state) => ({
        teamMembers: {
          ...state.teamMembers,
          [teamId]: members,
        },
      }));
    } catch (error) {
      console.error('Failed to fetch team members:', error);
      // Don't set error state for member fetch failures
    }
  },

  // Fetch team invitations
  fetchTeamInvitations: async (teamId, status) => {
    try {
      const invitations = await teamsApi.getTeamInvitations(teamId, status);
      set((state) => ({
        teamInvitations: {
          ...state.teamInvitations,
          [teamId]: invitations,
        },
      }));
    } catch (error) {
      console.error('Failed to fetch team invitations:', error);
      // Don't set error state for invitation fetch failures
    }
  },

  // Fetch statistics
  fetchStats: async () => {
    try {
      const stats = await teamsApi.getTeamStats();
      set({ stats });
    } catch (error) {
      console.error('Failed to fetch team stats:', error);
      // Don't set error state for stats failures
    }
  },

  // Create new team
  createTeam: async (data) => {
    set({ loading: true, error: null });
    try {
      const team = await teamsApi.createTeam(data);
      set((state) => ({
        teams: [team, ...state.teams],
        selectedTeam: team,
        loading: false,
      }));
      return team;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create team';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Update team
  updateTeam: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const team = await teamsApi.updateTeam(id, data);
      set((state) => ({
        teams: state.teams.map((t) => (t.id === id ? team : t)),
        selectedTeam: state.selectedTeam?.id === id ? team : state.selectedTeam,
        loading: false,
      }));
      return team;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update team';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Delete team
  deleteTeam: async (id) => {
    set({ loading: true, error: null });
    try {
      await teamsApi.deleteTeam(id);
      set((state) => ({
        teams: state.teams.filter((t) => t.id !== id),
        selectedTeam: state.selectedTeam?.id === id ? null : state.selectedTeam,
        loading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete team';
      set({ error: errorMessage, loading: false });
      throw error;
    }
  },

  // Add team member
  addTeamMember: async (teamId, data) => {
    try {
      const member = await teamsApi.addTeamMember(teamId, data);

      // Update members list
      set((state) => ({
        teamMembers: {
          ...state.teamMembers,
          [teamId]: [...(state.teamMembers[teamId] || []), member],
        },
      }));

      // Refetch team to update member count
      await get().fetchTeam(teamId);

      return member;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add team member';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Update team member
  updateTeamMember: async (teamId, memberId, data) => {
    try {
      const member = await teamsApi.updateTeamMember(teamId, memberId, data);

      // Update members list
      set((state) => ({
        teamMembers: {
          ...state.teamMembers,
          [teamId]: (state.teamMembers[teamId] || []).map((m) =>
            m.id === memberId ? member : m
          ),
        },
      }));

      return member;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update team member';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Remove team member
  removeTeamMember: async (teamId, userId) => {
    try {
      await teamsApi.removeTeamMember(teamId, userId);

      // Update members list
      set((state) => ({
        teamMembers: {
          ...state.teamMembers,
          [teamId]: (state.teamMembers[teamId] || []).filter((m) => m.userId !== userId),
        },
      }));

      // Refetch team to update member count
      await get().fetchTeam(teamId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to remove team member';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Invite team members
  inviteTeamMembers: async (teamId, data) => {
    try {
      const result = await teamsApi.inviteTeamMembers(teamId, data);

      // Update invitations list
      set((state) => ({
        teamInvitations: {
          ...state.teamInvitations,
          [teamId]: [...(state.teamInvitations[teamId] || []), ...result.invitations],
        },
      }));

      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to invite team members';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Cancel invitation
  cancelInvitation: async (teamId, invitationId) => {
    try {
      await teamsApi.cancelTeamInvitation(teamId, invitationId);

      // Update invitations list
      set((state) => ({
        teamInvitations: {
          ...state.teamInvitations,
          [teamId]: (state.teamInvitations[teamId] || []).filter((i) => i.id !== invitationId),
        },
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to cancel invitation';
      set({ error: errorMessage });
      throw error;
    }
  },

  // Resend invitation
  resendInvitation: async (teamId, invitationId) => {
    try {
      const invitation = await teamsApi.resendTeamInvitation(teamId, invitationId);

      // Update invitations list
      set((state) => ({
        teamInvitations: {
          ...state.teamInvitations,
          [teamId]: (state.teamInvitations[teamId] || []).map((i) =>
            i.id === invitationId ? invitation : i
          ),
        },
      }));

      return invitation;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to resend invitation';
      set({ error: errorMessage });
      throw error;
    }
  },

  // State management
  setTeams: (teams) => set({ teams }),

  addTeam: (team) =>
    set((state) => ({
      teams: [team, ...state.teams],
    })),

  updateTeamInStore: (id, updates) =>
    set((state) => ({
      teams: state.teams.map((t) => (t.id === id ? { ...t, ...updates } : t)),
      selectedTeam:
        state.selectedTeam?.id === id
          ? { ...state.selectedTeam, ...updates }
          : state.selectedTeam,
    })),

  removeTeam: (id) =>
    set((state) => ({
      teams: state.teams.filter((t) => t.id !== id),
      selectedTeam: state.selectedTeam?.id === id ? null : state.selectedTeam,
    })),

  selectTeam: (team) => set({ selectedTeam: team }),

  setFilters: (filters) => set({ filters }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  reset: () =>
    set({
      teams: [],
      selectedTeam: null,
      teamMembers: {},
      teamInvitations: {},
      stats: null,
      filters: {},
      loading: false,
      error: null,
    }),
}));
