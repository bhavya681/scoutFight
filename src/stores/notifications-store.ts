import { create } from "zustand";

export interface Notification {
  id: string;
  type: "booking" | "message" | "verification" | "system" | "offer";
  title: string;
  body: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

function countUnread(notifications: Notification[]) {
  return notifications.filter((n) => !n.read).length;
}

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
}

export const useNotificationsStore = create<NotificationsState>((set) => ({
  notifications: [],
  unreadCount: 0,
  markRead: (id) =>
    set((s) => {
      const notifications = s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications,
        unreadCount: countUnread(notifications),
      };
    }),
  markAllRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  addNotification: (n) =>
    set((s) => {
      const notification: Notification = {
        ...n,
        id: crypto.randomUUID(),
        read: false,
        createdAt: new Date().toISOString(),
      };
      const notifications = [notification, ...s.notifications];
      return {
        notifications,
        unreadCount: countUnread(notifications),
      };
    }),
}));
