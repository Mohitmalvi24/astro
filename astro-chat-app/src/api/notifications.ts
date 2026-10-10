import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { api } from './auth';

// Helper to safely get Notifications module
const getNotificationsModule = () => {
  try {
    return require('expo-notifications');
  } catch (e) {
    return null;
  }
};

// Configure Notification Handler for Foreground Notifications
const Notifications = getNotificationsModule();
if (Notifications?.setNotificationHandler) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}

export const notificationsApi = {
  /**
   * Request Push Notification permissions and retrieve device FCM token / Expo Push Token
   */
  registerPushToken: async () => {
    if (!Device.isDevice) {
      console.log('Push notifications require a physical device.');
      return null;
    }

    try {
      const NotificationsModule = getNotificationsModule();
      if (!NotificationsModule) {
        console.warn('expo-notifications module is not available');
        return null;
      }

      // Android Notification Channel Setup
      if (Platform.OS === 'android') {
        await NotificationsModule.setNotificationChannelAsync('default', {
          name: 'Default Notifications',
          importance: NotificationsModule.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#6200EE',
        });
      }

      // Check / Request Permissions
      const { status: existingStatus } = await NotificationsModule.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await NotificationsModule.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Push notification permission denied by user.');
        return null;
      }

      // Fetch Token (Safely try Expo Push Token first, then native fallback)
      let token = '';
      try {
        const projectId = Constants.expoConfig?.extra?.eas?.projectId;
        const tokenData = await NotificationsModule.getExpoPushTokenAsync({
          projectId: projectId,
        });
        token = tokenData.data;
        console.log('Push Token:', token);
      } catch (err: any) {
        console.warn('Expo push token failed (Firebase setup required):', err?.message || err);
        try {
          const deviceToken = await NotificationsModule.getDevicePushTokenAsync();
          token = deviceToken.data;
          console.log('Device Native FCM Token:', token);
        } catch (fcmErr: any) {
          console.warn('Native FCM token error (google-services.json missing):', fcmErr?.message || fcmErr);
          return null;
        }
      }

      // Send token to backend API if token was acquired
      if (token) {
        await api.post('/notifications/register-token', {
          token: token,
          platform: Platform.OS,
        });
        console.log('Push Token successfully registered with backend server.');
      }

      return token;
    } catch (error: any) {
      console.warn('Push notification initialization warning:', error?.message || error);
      return null;
    }
  },

  /**
   * Listen for incoming notifications when app is open or clicked
   */
  setupNotificationListeners: (
    onNotificationReceived?: (notification: any) => void,
    onNotificationResponse?: (response: any) => void
  ) => {
    const NotificationsModule = getNotificationsModule();
    if (!NotificationsModule) return () => {};

    const receivedSubscription = NotificationsModule.addNotificationReceivedListener(
      (notification: any) => {
        console.log('Notification received in foreground:', notification);
        onNotificationReceived?.(notification);
      }
    );

    const responseSubscription = NotificationsModule.addNotificationResponseReceivedListener(
      (response: any) => {
        console.log('User tapped on notification:', response);
        onNotificationResponse?.(response);
      }
    );

    // Return cleanup function
    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  },

  getNotificationSettings: async () => {
    try {
      const response = await api.get('/notifications/settings');
      return response.data;
    } catch (e) {
      return null;
    }
  },

  toggleDailyReminder: async (enabled: boolean) => {
    try {
      const response = await api.post('/notifications/settings', {
        daily_reminder_enabled: enabled,
      });
      return response.data;
    } catch (e) {
      return null;
    }
  },
};
