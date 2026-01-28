import { create } from "zustand";
import { z } from "zod";

export const activityItemSchema = z.object({
  id: z.string(),
  type: z.enum(["approval", "message", "team", "system"]),
  title: z.string(),
  description: z.string().optional(),
  actor: z.string().optional(), // User name
  timestamp: z.string(),
  metadata: z.record(z.string(), z.unknown()).optional(),
  url: z.string().optional(),
});

export type ActivityItem = z.infer<typeof activityItemSchema>;

interface ActivityStore {
  activities: ActivityItem[];
  isLoading: boolean;
  fetchActivities: (limit?: number) => Promise<void>;
  addActivity: (activity: Omit<ActivityItem, "id" | "timestamp">) => void;
  clearActivities: () => void;
}

export const useActivityStore = create<ActivityStore>((set) => ({
  activities: [],
  isLoading: false,

  fetchActivities: async (limit = 50) => {
    set({ isLoading: true });
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/v1/activity?limit=${limit}`);
      // const data = await response.json();
      // const validated = z.array(activityItemSchema).parse(data);

      // Mock data for demonstration
      const mockActivities: ActivityItem[] = [
        {
          id: "1",
          type: "approval",
          title: "New approval request created",
          description: "Customer escalation requires CEO approval",
          actor: "John Doe",
          timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
          url: "/app/approvals",
        },
        {
          id: "2",
          type: "message",
          title: "New message in inbox",
          description: "3 new customer messages waiting for response",
          actor: "System",
          timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
          url: "/app/inbox",
        },
        {
          id: "3",
          type: "team",
          title: "Team member added",
          description: "Jane Smith joined Engineering Team",
          actor: "Admin",
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
          url: "/app/settings/teams",
        },
        {
          id: "4",
          type: "approval",
          title: "Approval approved",
          description: "Consultation room created successfully",
          actor: "CEO",
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          url: "/app/approvals",
        },
        {
          id: "5",
          type: "system",
          title: "System update",
          description: "Module registry updated",
          actor: "System",
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        },
      ];
      set({ activities: mockActivities, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      set({ isLoading: false });
    }
  },

  addActivity: (activity) => {
    const newActivity: ActivityItem = {
      ...activity,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
    };
    set((state) => ({
      activities: [newActivity, ...state.activities].slice(0, 100), // Keep last 100
    }));
  },

  clearActivities: () => {
    set({ activities: [] });
  },
}));
