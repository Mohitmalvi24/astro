import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/authStore';

// Top Wallet Icon (card/wallet)
const WalletIcon = ({ color = '#0F172A', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Rect x="2" y="5" width="20" height="14" rx="3" />
    <Path d="M16 12h.01" />
  </Svg>
);

// Top Bell Notification Icon
const BellIcon = ({ color = '#0F172A', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const UserAvatarPlaceholder = ({ size = 44, color = '#DBEAFE', iconColor = '#2563EB' }: { size?: number; color?: string; iconColor?: string }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
    <Svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  </View>
);

const ONLINE_ASTROLOGERS = [
  { id: '1', name: 'Meera', topic: 'Love', bg: '#DBEAFE', iconColor: '#2563EB' },
  { id: '2', name: 'Rohan', topic: 'Career', bg: '#EDE9FE', iconColor: '#7C3AED' },
  { id: '3', name: 'Kavya', topic: 'Marriage', bg: '#CFFAFE', iconColor: '#0891B2' },
  { id: '4', name: 'Ishaan', topic: 'Money', bg: '#E0E7FF', iconColor: '#4F46E5' },
  { id: '5', name: 'Neha', topic: 'Tarot', bg: '#FCE7F3', iconColor: '#DB2777' },
];

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const userName = user?.username || 'manoti';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Header: Avatar + Namaste name & Wallet + Bell */}
        <View style={styles.topHeader}>
          <View style={styles.userInfoLeft}>
            <UserAvatarPlaceholder size={44} color="#DBEAFE" iconColor="#2563EB" />
            <View style={styles.userNameBlock}>
              <Text style={styles.greetingText}>Namaste</Text>
              <Text style={styles.userNameText}>{userName}</Text>
            </View>
          </View>

          <View style={styles.headerRightActions}>
            <View style={styles.walletPill}>
              <WalletIcon size={16} color="#0F172A" />
              <Text style={styles.walletAmount}>₹xx</Text>
            </View>

            <TouchableOpacity style={styles.bellButton}>
              <BellIcon size={20} color="#0F172A" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Hero Card: Talk to an astrologer */}
        <View style={styles.heroCard}>
          <Text style={styles.heroTitle}>Talk to an{'\n'}astrologer.</Text>
          <Text style={styles.heroSubtitle}>
            Chat with an astrologer about love, career or marriage.
          </Text>

          <TouchableOpacity
            style={styles.heroButton}
            onPress={() => navigation.navigate('Astrologers')}
            activeOpacity={0.9}
          >
            <Text style={styles.heroButtonText}>Start a chat →</Text>
          </TouchableOpacity>
        </View>

        {/* Online Now Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Online now</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Astrologers')}>
            <Text style={styles.seeAllText}>See all</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.onlineList}>
          {ONLINE_ASTROLOGERS.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.onlineAstrologerCard}
              onPress={() => navigation.navigate('ChatRoom', { astrologerName: item.name })}
              activeOpacity={0.8}
            >
              <View style={styles.avatarWithDot}>
                <UserAvatarPlaceholder size={58} color={item.bg} iconColor={item.iconColor} />
                <View style={styles.greenDot} />
              </View>
              <Text style={styles.onlineName}>{item.name}</Text>
              <Text style={styles.onlineTopic}>{item.topic}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Daily Horoscope Card (Navy Blue Card) */}
        <View style={styles.horoscopeCard}>
          <View style={styles.horoscopeHeaderRow}>
            <Text style={styles.horoscopeCategory}>DAILY · TAURUS</Text>
            <TouchableOpacity>
              <Text style={styles.changeSignText}>Change sign</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.horoscopeInsight}>
            Today is a good day. Trust your instincts.
          </Text>

          <View style={styles.statsRow}>
            <View style={styles.statPill}>
              <Text style={styles.statPillText}>Love 70%</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statPillText}>Career 86%</Text>
            </View>
            <View style={styles.statPill}>
              <Text style={styles.statPillText}>Health 60%</Text>
            </View>
          </View>
        </View>

        {/* Recent Chat Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Recent chat</Text>
        </View>

        <TouchableOpacity
          style={styles.recentChatCard}
          onPress={() => navigation.navigate('ChatRoom', { astrologerName: 'Meera' })}
          activeOpacity={0.85}
        >
          <UserAvatarPlaceholder size={48} color="#DBEAFE" iconColor="#2563EB" />
          <View style={styles.recentChatContent}>
            <View style={styles.recentChatTop}>
              <Text style={styles.recentChatName}>Meera</Text>
              <Text style={styles.recentChatTime}>2m</Text>
            </View>
            <Text style={styles.recentChatMessage} numberOfLines={1}>
              Abhi Shani ki dasha chal rahi hai, thoda...
            </Text>
          </View>
          <View style={styles.recentChatDot} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userInfoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  userNameBlock: {
    justifyContent: 'center',
  },
  greetingText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  userNameText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walletPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    backgroundColor: '#FFFFFF',
  },
  walletAmount: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  bellButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  heroCard: {
    backgroundColor: '#2563EB', // Royal Blue
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 4,
  },
  heroTitle: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 30,
    fontWeight: '700',
    color: '#FFFFFF',
    lineHeight: 36,
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
    marginBottom: 20,
    maxWidth: '85%',
  },
  heroButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  heroButtonText: {
    color: '#1E40AF',
    fontWeight: '700',
    fontSize: 15,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
  },
  seeAllText: {
    fontSize: 13,
    color: '#2563EB',
    fontWeight: '600',
  },
  onlineList: {
    gap: 16,
    paddingBottom: 22,
  },
  onlineAstrologerCard: {
    alignItems: 'center',
    width: 68,
  },
  avatarWithDot: {
    position: 'relative',
    marginBottom: 6,
  },
  greenDot: {
    position: 'absolute',
    bottom: 0,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  onlineName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  onlineTopic: {
    fontSize: 12,
    color: '#64748B',
  },
  horoscopeCard: {
    backgroundColor: '#0F254B', // Navy blue
    borderRadius: 22,
    padding: 20,
    marginBottom: 24,
  },
  horoscopeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  horoscopeCategory: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  changeSignText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  horoscopeInsight: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  statPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  recentChatCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  recentChatContent: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  recentChatTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 3,
  },
  recentChatName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  recentChatTime: {
    fontSize: 11,
    color: '#64748B',
  },
  recentChatMessage: {
    fontSize: 13,
    color: '#64748B',
  },
  recentChatDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
  },
});
