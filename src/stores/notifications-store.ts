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

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  markRead: (id: string) => void;
  markAllRead: () => void;
  addNotification: (n: Omit<Notification, "id" | "read" | "createdAt">) => void;
}

const INITIAL: Notification[] = [
  {
    id: "1",
    type: "booking",
    title: "New booking request",
    body: "Apex Fight League sent a booking request for Apex Fight League 47.",
    link: "/dashboard/bookings",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    type: "offer",
    title: "Offer viewed",
    body: "Marcus Steel Johnson viewed your offer.",
    link: "/dashboard/offers",
    read: false,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
];

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: INITIAL,
  unreadCount: INITIAL.filter((n) => !n.read).length,
  markRead: (id) =>
    set((s) => {
      const notifications = s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return {
        notifications,
        unreadCount: notifications.filter((n) => !n.read).length,
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
        unreadCount: notifications.filter((x) => !x.read).length,
      };
    }),
}));
