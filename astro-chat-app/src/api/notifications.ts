import * as Device from 'expo-device';
import Constants, { ExecutionEnvironment } from 'expo-constants';
import { Platform } from 'react-native';
import { api } from './auth';

// Check if app is running in Expo Go (Push notifications were removed from Expo Go in SDK 53)
const isExpoGo = Constants.executionEnvironment === ExecutionEnvironment.StoreClient;

// Helper to safely get Notifications module
const getNotificationsModule = () => {
  if (isExpoGo) return null;
  try {
    return require('expo-notifications');
  } catch (e) {
    return null;
  }
};

// Configure notification behavior for native OS tray only (if supported)
if (!isExpoGo) {
  try {
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
  } catch (e) {
    console.warn('Failed to set notification handler:', e);
  }
}

export const notificationsApi = {
  registerPushToken: async () => {
    if (isExpoGo) {
      console.log('Push notifications are disabled in Expo Go. Use a development build for push notification support.');
      return;
    }

    if (!Device.isDevice) {
      console.log('Must use physical device for push notifications');
      return;
    }

    try {
      const Notifications = getNotificationsModule();
      if (!Notifications) return;

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Push notification permission denied');
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;

      // Register device token with backend
      await api.post('/notifications/register-token', {
        token: token,
        platform: Platform.OS,
      });

      console.log('Successfully registered device push token with backend');
    } catch (error) {
      console.error('Error fetching or registering push token:', error);
    }
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
