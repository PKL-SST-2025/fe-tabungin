import { createStore } from "solid-js/store";

export type Notification = {
  id: number;
  message: string;
  type: "info" | "success" | "error";
  read: boolean;
  timestamp: string;
};

const [notifications, setNotifications] = createStore<Notification[]>([]);

export function addNotification(message: string, type: "info" | "success" | "error") {
  setNotifications([
    ...notifications,
    {
      id: Date.now(),
      message,
      type,
      read: false,
      timestamp: new Date().toISOString(),
    },
  ]);
}

export function markAsRead(id: number) {
  setNotifications(
    notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
  );
}

export function clearNotifications() {
  setNotifications([]);
}

export { notifications, setNotifications };
