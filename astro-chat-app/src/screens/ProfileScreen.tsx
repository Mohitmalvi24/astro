import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/authStore';
import { notificationsApi } from '../api/notifications';

const UserAvatarIcon = ({ color = theme.colors.accent, size = 36 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <Circle cx="12" cy="7" r="4" />
  </Svg>
);

const ChevronRightIcon = ({ color = theme.colors.textSecondary, size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

export const ProfileScreen = () => {
  const { user, logout } = useAuthStore();
  const [reminderEnabled, setReminderEnabled] = useState(true);

  useEffect(() => {
    notificationsApi
      .getNotificationSettings()
      .then((data) => {
        if (data && typeof data.daily_reminder_enabled === 'boolean') {
          setReminderEnabled(data.daily_reminder_enabled);
        }
      })
      .catch(console.error);
  }, []);

  const handleToggleReminder = async (val: boolean) => {
    setReminderEnabled(val);
    try {
      await notificationsApi.toggleDailyReminder(val);
    } catch (e) {
      setReminderEnabled(!val); // revert on error
    }
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change feature will be available in settings update.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Profile Heading */}
        <Text style={styles.heading}>Profile</Text>

        {/* Centered Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarCircle}>
            <UserAvatarIcon color={theme.colors.accent} size={40} />
          </View>
          <Text style={styles.userName}>{user?.username || user?.email?.split('@')[0] || 'Explorer'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
        </View>

        {/* Action Rows */}
        <View style={styles.rowsContainer}>
          {/* Row 1: Daily Reminder */}
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Daily reminder</Text>
            <Switch
              value={reminderEnabled}
              onValueChange={handleToggleReminder}
              trackColor={{ false: theme.colors.border, true: theme.colors.accent }}
              thumbColor={theme.colors.background}
            />
          </View>

          {/* Row 2: Change Password */}
          <TouchableOpacity style={styles.row} onPress={handleChangePassword} activeOpacity={0.7}>
            <Text style={styles.rowLabel}>Change password</Text>
            <ChevronRightIcon color={theme.colors.textSecondary} size={18} />
          </TouchableOpacity>

          {/* Row 3: Log Out */}
          <TouchableOpacity style={styles.row} onPress={logout} activeOpacity={0.7}>
            <Text style={[styles.rowLabel, styles.logoutLabel]}>Log out</Text>
            <ChevronRightIcon color={theme.colors.accent} size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  heading: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 34,
    color: theme.colors.textPrimary,
    marginBottom: 24,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatarCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: theme.colors.chatBubbleIncoming, // beige circle
    borderWidth: 2,
    borderColor: theme.colors.accent, // terracotta border
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 22,
    color: theme.colors.textPrimary,
  },
  userEmail: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  rowsContainer: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.chatBubbleIncoming, // light beige row
    borderRadius: theme.borderRadius.card,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  rowLabel: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 16,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  logoutLabel: {
    color: theme.colors.accent,
    fontWeight: '600',
  },
});
