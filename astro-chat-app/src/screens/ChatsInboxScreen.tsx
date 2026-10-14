import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { theme } from '../theme/theme';

const SearchIcon = ({ color = '#0F172A', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

const UserAvatarPlaceholder = ({ size = 48, color = '#BFDBFE', iconColor = '#2563EB' }: { size?: number; color?: string; iconColor?: string }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
    <Svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  </View>
);

interface ChatThread {
  id: string;
  name: string;
  avatarBg: string;
  avatarIconColor: string;
  statusBadge?: {
    text: string;
    bg: string;
    textColor: string;
  };
  onlineStatus?: 'online' | 'ended' | 'live';
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isTyping?: boolean;
}

const MOCK_CHATS: ChatThread[] = [
  {
    id: '1',
    name: 'Meera',
    avatarBg: '#DBEAFE', // Soft blue
    avatarIconColor: '#2563EB',
    statusBadge: {
      text: 'Live 04:32',
      bg: '#DCFCE7', // Light green
      textColor: '#15803D',
    },
    onlineStatus: 'live',
    lastMessage: 'typing...',
    time: 'Now',
    unreadCount: 1,
    isTyping: true,
  },
  {
    id: '2',
    name: 'Rohan',
    avatarBg: '#EDE9FE', // Soft purple
    avatarIconColor: '#7C3AED',
    statusBadge: {
      text: 'Online',
      bg: '#E0E7FF',
      textColor: '#4338CA',
    },
    onlineStatus: 'online',
    lastMessage: 'Kal subah ka muhurat achha rahega.',
    time: '1h',
    unreadCount: 1,
  },
  {
    id: '3',
    name: 'Kavya',
    avatarBg: '#CFFAFE', // Soft cyan
    avatarIconColor: '#0891B2',
    statusBadge: {
      text: 'Ended',
      bg: '#F1F5F9',
      textColor: '#64748B',
    },
    onlineStatus: 'ended',
    lastMessage: 'Aapka session khatam hua. Thank...',
    time: 'Yesterday',
  },
  {
    id: '4',
    name: 'Ishaan',
    avatarBg: '#E0E7FF', // Soft indigo
    avatarIconColor: '#4F46E5',
    statusBadge: {
      text: 'Ended',
      bg: '#F1F5F9',
      textColor: '#64748B',
    },
    onlineStatus: 'ended',
    lastMessage: 'Chart ke hisaab se paisa...',
    time: 'Mon',
  },
];

export const ChatsInboxScreen = ({ navigation }: any) => {
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'past'>('all');

  const filterOptions = [
    { key: 'all', label: 'All' },
    { key: 'active', label: 'Active' },
    { key: 'past', label: 'Past' },
  ];

  const filteredChats = MOCK_CHATS.filter((chat) => {
    if (activeFilter === 'active') return chat.onlineStatus === 'live' || chat.onlineStatus === 'online';
    if (activeFilter === 'past') return chat.onlineStatus === 'ended';
    return true;
  });

  const renderChatItem = ({ item }: { item: ChatThread }) => (
    <TouchableOpacity
      style={styles.chatRow}
      onPress={() => navigation.navigate('ChatRoom', { astrologerName: item.name })}
      activeOpacity={0.7}
    >
      {/* Avatar Container with Online Indicator */}
      <View style={styles.avatarWrapper}>
        <UserAvatarPlaceholder size={52} color={item.avatarBg} iconColor={item.avatarIconColor} />
        {item.onlineStatus === 'live' || item.onlineStatus === 'online' ? (
          <View style={styles.onlineBadgeDot} />
        ) : (
          <View style={styles.offlineBadgeDot} />
        )}
      </View>

      {/* Center Details */}
      <View style={styles.chatInfo}>
        <View style={styles.titleRow}>
          <Text style={styles.chatName}>{item.name}</Text>
          {item.statusBadge && (
            <View style={[styles.statusPill, { backgroundColor: item.statusBadge.bg }]}>
              <Text style={[styles.statusPillText, { color: item.statusBadge.textColor }]}>
                {item.statusBadge.text}
              </Text>
            </View>
          )}
        </View>

        <Text
          style={[styles.lastMessageText, item.isTyping && styles.typingText]}
          numberOfLines={1}
        >
          {item.lastMessage}
        </Text>
      </View>

      {/* Right Column (Time & Unread Badge) */}
      <View style={styles.rightColumn}>
        <Text style={styles.timeText}>{item.time}</Text>
        {item.unreadCount ? (
          <View style={styles.unreadBadge}>
            <Text style={styles.unreadCountText}>{item.unreadCount}</Text>
          </View>
        ) : null}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Chats</Text>
        <TouchableOpacity style={styles.searchButton}>
          <SearchIcon size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        {filterOptions.map((opt) => {
          const isSelected = activeFilter === opt.key;
          return (
            <TouchableOpacity
              key={opt.key}
              style={[styles.filterChip, isSelected && styles.filterChipActive]}
              onPress={() => setActiveFilter(opt.key as any)}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Chat List */}
      <FlatList
        data={filteredChats}
        keyExtractor={(item) => item.id}
        renderItem={renderChatItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
      />

      {/* Floating Action Button (+ New chat) */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Astrologers')}
        activeOpacity={0.9}
      >
        <Text style={styles.floatingButtonText}>+ New chat</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 8,
  },
  screenTitle: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  searchButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 12,
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    paddingVertical: 4,
  },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 14,
  },
  onlineBadgeDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#10B981', // green
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  offlineBadgeDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#94A3B8', // grey
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  chatName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
  },
  statusPill: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 11,
    fontWeight: '600',
  },
  lastMessageText: {
    fontSize: 14,
    color: '#64748B',
  },
  typingText: {
    color: '#2563EB',
    fontStyle: 'italic',
  },
  rightColumn: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10,
    gap: 6,
  },
  timeText: {
    fontSize: 12,
    color: '#64748B',
  },
  unreadBadge: {
    backgroundColor: '#2563EB',
    borderRadius: 11,
    minWidth: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadCountText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginLeft: 86,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 15,
  },
});
