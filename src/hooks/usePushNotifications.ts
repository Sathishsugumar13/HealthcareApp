import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Colors } from '../theme/colors';

const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

try {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
} catch (e) {
  console.log('Error configuring notification handler:', e);
}

export interface PushNotificationState {
  expoPushToken?: Notifications.ExpoPushToken;
  notifications: Notifications.Notification[];
}

export const usePushNotifications = (): PushNotificationState => {
  const [expoPushToken, setExpoPushToken] = useState<
    Notifications.ExpoPushToken | undefined
  >();
  const [notifications, setNotifications] = useState<Notifications.Notification[]>([]);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  async function registerForPushNotificationsAsync() {
    let token;

    try {
      // In Expo Go on SDK 53+, remote push tokens and native channels are not supported on Android
      if (isExpoGo) {
        console.log('Skipping remote push token registration in Expo Go (not supported in SDK 53+)');
        return undefined;
      }

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: Colors.colorFF231F7C,
        });
      }

      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          console.log('Push notification permission not granted');
          return undefined;
        }
        
        const projectId =
          Constants?.expoConfig?.extra?.eas?.projectId ??
          Constants?.easConfig?.projectId ?? "27238de2-cd8c-445f-ad5c-db22da1d219a";
          
        const tokenPromise = Notifications.getExpoPushTokenAsync({ projectId });
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Push token timeout')), 4000)
        );

        token = await Promise.race([tokenPromise, timeoutPromise]) as Notifications.ExpoPushToken;
        console.log('Expo Push Token obtained:', token?.data);
      }
    } catch (e: any) {
      console.log('Notice: Push token not available in current environment:', e.message);
    }

    return token;
  }

  useEffect(() => {
    let isMounted = true;

    registerForPushNotificationsAsync().then((token) => {
      if (isMounted && token) {
        setExpoPushToken(token);
      }
    }).catch(() => {});

    try {
      notificationListener.current = Notifications.addNotificationReceivedListener(
        (notification) => {
          if (isMounted) {
            setNotifications((prev) => [notification, ...prev]);
          }
        }
      );
    } catch (err) {
      console.log('Failed to add notificationListener:', err);
    }

    try {
      responseListener.current = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          if (!isMounted) return;
          setNotifications((prev) => {
            const exists = prev.find((n) => n.request.identifier === response.notification.request.identifier);
            if (!exists) {
              return [response.notification, ...prev];
            }
            return prev;
          });
        }
      );
    } catch (err) {
      console.log('Failed to add responseListener:', err);
    }

    return () => {
      isMounted = false;
      try {
        if (notificationListener.current) {
          notificationListener.current.remove();
        }
      } catch (e) {}
      try {
        if (responseListener.current) {
          responseListener.current.remove();
        }
      } catch (e) {}
    };
  }, []);

  return {
    expoPushToken,
    notifications,
  };
};
