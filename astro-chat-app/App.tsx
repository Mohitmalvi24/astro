import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { RootNavigator } from './src/navigation/RootNavigator';
import { notificationsApi } from './src/api/notifications';

export default function App() {
  useEffect(() => {
    // Push Notification Token Register & Listener Setup
    notificationsApi.registerPushToken();

    const cleanup = notificationsApi.setupNotificationListeners(
      (notification) => {
        console.log('Foreground notification:', notification.request.content.title);
      },
      (response) => {
        console.log('Clicked notification data:', response.notification.request.content.data);
      }
    );

    return () => {
      cleanup();
    };
  }, []);

  return (
    <>
      <StatusBar style="dark" />
      <RootNavigator />
    </>
  );
}
