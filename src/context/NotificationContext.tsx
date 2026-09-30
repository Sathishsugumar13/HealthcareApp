import React, { createContext, useContext, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { usePushNotifications } from '../hooks/usePushNotifications';

interface NotificationContextProps {
  notifications: Notifications.Notification[];
  unreadCount: number;
  readIds: string[];
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  unreadCount: 0,
  readIds: [],
  markAsRead: () => {},
  deleteNotification: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { notifications: rawNotifications } = usePushNotifications();
  const [readIds, setReadIds] = React.useState<string[]>([]);
  const [deletedIds, setDeletedIds] = React.useState<string[]>([]);

  const notifications = rawNotifications.filter(
    (n) => !deletedIds.includes(n.request.identifier)
  );

  const unreadCount = notifications.filter(
    (n) => !readIds.includes(n.request.identifier)
  ).length;

  const markAsRead = (id: string) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const deleteNotification = (id: string) => {
    setDeletedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, readIds, markAsRead, deleteNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useGlobalNotifications = () => useContext(NotificationContext);
