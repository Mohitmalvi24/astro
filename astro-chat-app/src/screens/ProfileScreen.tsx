import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Switch,
  Alert,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/authStore';
import { notificationsApi } from '../api/notifications';

const UserAvatarPlaceholder = ({ size = 80, color = '#DBEAFE', iconColor = '#2563EB' }: { size?: number; color?: string; iconColor?: string }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
    <Svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  </View>
);

const ChevronRightIcon = ({ color = '#64748B', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

const WalletIcon = ({ color = '#2563EB', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="2" y="5" width="20" height="14" rx="3" />
    <Path d="M16 12h.01" />
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
      setReminderEnabled(!val);
    }
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'Password change feature will be available in the next update.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.content}>
        {/* Profile Heading */}
        <Text style={styles.heading}>Profile</Text>

        {/* Centered Avatar Card */}
        <View style={styles.avatarSection}>
          <UserAvatarPlaceholder size={84} color="#DBEAFE" iconColor="#2563EB" />
          <Text style={styles.userName}>{user?.username || 'manoti'}</Text>
          <Text style={styles.userEmail}>{user?.email || 'user@example.com'}</Text>
        </View>

        {/* Wallet Balance Card */}
        <View style={styles.walletCard}>
          <View style={styles.walletLeft}>
            <View style={styles.walletIconCircle}>
              <WalletIcon size={20} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.walletTitle}>Wallet Balance</Text>
              <Text style={styles.walletSub}>Available for chats</Text>
            </View>
          </View>
          <Text style={styles.walletValue}>₹ 150</Text>
        </View>

        {/* Settings Rows */}
        <View style={styles.rowsContainer}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Daily reminder</Text>
            <Switch
              value={reminderEnabled}
              onValueChange={handleToggleReminder}
              trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
              thumbColor={'#FFFFFF'}
            />
          </View>

          <TouchableOpacity style={styles.row} onPress={handleChangePassword} activeOpacity={0.7}>
            <Text style={styles.rowLabel}>Change password</Text>
            <ChevronRightIcon color="#64748B" size={18} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={logout} activeOpacity={0.7}>
            <Text style={[styles.rowLabel, styles.logoutLabel]}>Log out</Text>
            <ChevronRightIcon color="#DC2626" size={18} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  heading: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 12,
  },
  userEmail: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  walletCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  walletIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  walletTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  walletSub: {
    fontSize: 12,
    color: '#64748B',
  },
  walletValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#2563EB',
  },
  rowsContainer: {
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  rowLabel: {
    fontSize: 15,
    color: '#0F172A',
    fontWeight: '600',
  },
  logoutLabel: {
    color: '#DC2626',
    fontWeight: '600',
  },
});
