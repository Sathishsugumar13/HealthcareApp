import React, { createContext, useContext, ReactNode } from 'react';
import * as Notifications from 'expo-notifications';
import { usePushNotifications } from '../hooks/usePushNotifications';

interface NotificationContextProps {
  notifications: Notifications.Notification[];
  unreadCount: number;
  readIds: string[];
  markAsRead: (id: string) => void;
}

const NotificationContext = createContext<NotificationContextProps>({
  notifications: [],
  unreadCount: 0,
  readIds: [],
  markAsRead: () => {},
});

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const { notifications } = usePushNotifications();
  const [readIds, setReadIds] = React.useState<string[]>([]);

  const unreadCount = notifications.filter(
    (n) => !readIds.includes(n.request.identifier)
  ).length;

  const markAsRead = (id: string) => {
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, readIds, markAsRead }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useGlobalNotifications = () => useContext(NotificationContext);
