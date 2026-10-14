import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  Switch,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle } from 'react-native-svg';
import { theme } from '../theme/theme';

const SearchIcon = ({ color = '#64748B', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

const FilterAdjustIcon = ({ color = '#0F172A', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
  </Svg>
);

const UserAvatarPlaceholder = ({ size = 56, color = '#BFDBFE', iconColor = '#2563EB' }: { size?: number; color?: string; iconColor?: string }) => (
  <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, justifyContent: 'center', alignItems: 'center' }}>
    <Svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none" stroke={iconColor} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <Circle cx="12" cy="7" r="4" />
    </Svg>
  </View>
);

interface AstrologerItem {
  id: string;
  name: string;
  skills: string;
  languages: string;
  experience: string;
  rating: string;
  price: string;
  status: 'online' | 'busy' | 'offline';
  actionType: 'chat' | 'notify';
  avatarBg: string;
  avatarIconColor: string;
}

const ASTROLOGERS_DATA: AstrologerItem[] = [
  {
    id: '1',
    name: 'Meera',
    skills: 'Vedic · Love, Marriage',
    languages: 'Hindi, English',
    experience: '5 yrs',
    rating: '4.8',
    price: '₹xx/min',
    status: 'online',
    actionType: 'chat',
    avatarBg: '#DBEAFE',
    avatarIconColor: '#2563EB',
  },
  {
    id: '2',
    name: 'Rohan',
    skills: 'Vedic · Career, Money',
    languages: 'Hindi, Punjabi',
    experience: '7 yrs',
    rating: '4.9',
    price: '₹xx/min',
    status: 'online',
    actionType: 'chat',
    avatarBg: '#EDE9FE',
    avatarIconColor: '#7C3AED',
  },
  {
    id: '3',
    name: 'Kavya',
    skills: 'Tarot · Love',
    languages: 'Hindi, Tamil',
    experience: '4 yrs',
    rating: '4.7',
    price: '₹xx/min',
    status: 'online',
    actionType: 'chat',
    avatarBg: '#CFFAFE',
    avatarIconColor: '#0891B2',
  },
  {
    id: '4',
    name: 'Ishaan',
    skills: 'Numerology · Career',
    languages: 'Hindi, English',
    experience: '6 yrs',
    rating: '4.8',
    price: '₹xx/min',
    status: 'busy',
    actionType: 'notify',
    avatarBg: '#E0E7FF',
    avatarIconColor: '#4F46E5',
  },
];

const CATEGORIES = ['All', 'Love', 'Career', 'Marriage', 'Health'];

export const AstrologersListScreen = ({ navigation }: any) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isOnlineNow, setIsOnlineNow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredList = ASTROLOGERS_DATA.filter((item) => {
    if (isOnlineNow && item.status !== 'online') return false;
    if (searchQuery.trim() && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const renderAstrologerCard = ({ item }: { item: AstrologerItem }) => (
    <View style={styles.cardContainer}>
      <View style={styles.cardContent}>
        {/* Avatar with status indicator */}
        <View style={styles.avatarWrapper}>
          <UserAvatarPlaceholder size={58} color={item.avatarBg} iconColor={item.avatarIconColor} />
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: item.status === 'online' ? '#10B981' : '#F59E0B' },
            ]}
          />
        </View>

        {/* Details */}
        <View style={styles.detailsCol}>
          <Text style={styles.astrologerName}>{item.name}</Text>
          <Text style={styles.skillsText}>{item.skills}</Text>
          <Text style={styles.subInfoText}>
            {item.languages} · {item.experience} · ★ {item.rating}
          </Text>
        </View>

        {/* Right side Rate & Action Button */}
        <View style={styles.rightActionCol}>
          <Text style={styles.priceText}>{item.price}</Text>

          {item.actionType === 'chat' ? (
            <TouchableOpacity
              style={styles.chatButton}
              onPress={() => navigation.navigate('ChatRoom', { astrologerName: item.name })}
              activeOpacity={0.85}
            >
              <Text style={styles.chatButtonText}>Chat</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.notifyButton}
              onPress={() => {}}
              activeOpacity={0.85}
            >
              <Text style={styles.notifyButtonText}>Notify me</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Screen Title */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Astrologers</Text>
      </View>

      {/* Search Input Bar + Filter Icon */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <SearchIcon size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or topic"
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <FilterAdjustIcon size={20} color="#0F172A" />
        </TouchableOpacity>
      </View>

      {/* Topic Filter Chips */}
      <View style={styles.categoryScrollContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={CATEGORIES}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.categoryList}
          renderItem={({ item }) => {
            const isSelected = selectedCategory === item;
            return (
              <TouchableOpacity
                style={[styles.categoryChip, isSelected && styles.categoryChipActive]}
                onPress={() => setSelectedCategory(item)}
              >
                <Text style={[styles.categoryChipText, isSelected && styles.categoryChipTextActive]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Online now toggle + Sort bar */}
      <View style={styles.toggleBar}>
        <View style={styles.toggleLeft}>
          <Switch
            value={isOnlineNow}
            onValueChange={setIsOnlineNow}
            trackColor={{ false: '#E2E8F0', true: '#2563EB' }}
            thumbColor={'#FFFFFF'}
          />
          <Text style={styles.toggleLabel}>Online now</Text>
        </View>
        <Text style={styles.sortLabel}>Sort: <Text style={styles.sortValue}>Popular</Text></Text>
      </View>

      {/* Astrologers List */}
      <FlatList
        data={filteredList}
        keyExtractor={(item) => item.id}
        renderItem={renderAstrologerCard}
        contentContainerStyle={styles.cardsList}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 6,
  },
  screenTitle: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 32,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: -0.5,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 8,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 24,
    paddingHorizontal: 14,
    height: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  categoryScrollContainer: {
    marginTop: 14,
  },
  categoryList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  categoryChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  categoryChipTextActive: {
    color: '#FFFFFF',
  },
  toggleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  toggleLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  sortLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  sortValue: {
    color: '#334155',
    fontWeight: '600',
  },
  cardsList: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 12,
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'relative',
    marginRight: 12,
  },
  statusIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  detailsCol: {
    flex: 1,
    justifyContent: 'center',
  },
  astrologerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 2,
  },
  skillsText: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 2,
  },
  subInfoText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  rightActionCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 10,
    gap: 8,
  },
  priceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
  },
  chatButton: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 22,
    minWidth: 80,
    alignItems: 'center',
  },
  chatButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  notifyButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2563EB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 22,
    alignItems: 'center',
  },
  notifyButtonText: {
    color: '#2563EB',
    fontWeight: '600',
    fontSize: 12,
  },
});
