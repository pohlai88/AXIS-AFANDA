'use client';

import { create } from "zustand";
import { z } from "zod";

export const notificationSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  type: z.enum(["info", "success", "warning", "error", "approval"]).default("info"),
  read: z.boolean().default(false),
  createdAt: z.string(),
  actionUrl: z.string().optional(),
});

export type Notification = z.infer<typeof notificationSchema>;

interface NotificationsStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, "id" | "createdAt" | "read">) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
  fetchNotifications: () => Promise<void>;
}

export const useNotificationsStore = create<NotificationsStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      read: false,
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    }));
  },

  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find((n) => n.id === id);
      return {
        notifications: state.notifications.filter((n) => n.id !== id),
        unreadCount: notification?.read ? state.unreadCount : Math.max(0, state.unreadCount - 1),
      };
    });
  },

  clearAll: () => {
    set({ notifications: [], unreadCount: 0 });
  },

  fetchNotifications: async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch("/api/v1/notifications");
      // const data = await response.json();
      // const validated = z.array(notificationSchema).parse(data);

      // Mock data for demonstration
      const mockNotifications: Notification[] = [
        {
          id: "1",
          title: "New approval request",
          description: "Customer escalation requires CEO approval",
          type: "approval",
          read: false,
          createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
          actionUrl: "/app/approvals",
        },
        {
          id: "2",
          title: "Approval approved",
          description: "Consultation room created successfully",
          type: "success",
          read: false,
          createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
          actionUrl: "/app/approvals",
        },
        {
          id: "3",
          title: "New message in inbox",
          description: "3 new customer messages waiting",
          type: "info",
          read: true,
          createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
          actionUrl: "/app/inbox",
        },
      ];
      const unread = mockNotifications.filter((n) => !n.read).length;
      set({ notifications: mockNotifications, unreadCount: unread });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  },
}));
