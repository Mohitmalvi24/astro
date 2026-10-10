import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  ScrollView,
  StatusBar,
  Platform,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path, Circle, Polygon } from 'react-native-svg';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/authStore';
import { ZodiacIcon } from './CategoriesScreen';
import { astroApi, ZodiacCategory, Astrologer, AstroService, FALLBACK_CATEGORIES, FALLBACK_ASTROLOGERS, FALLBACK_SERVICES } from '../api/astro';

// Top Right Icon: Translate / Language (Red/Pink Coral)
const LanguageIcon = ({ color = '#EE6B6E', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M5 8l6 6" />
    <Path d="M4 14e1 1 0 0 0 1.4 0l4-4" />
    <Path d="M2 5h12" />
    <Path d="M7 2v3" />
    <Path d="M22 22l-5-10-5 10" />
    <Path d="M14 18h6" />
  </Svg>
);

// Top Right Icon: Settings Gear
const SettingsIcon = ({ color = '#EE6B6E', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="12" cy="12" r="3" />
    <Path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </Svg>
);

// Top Right Icon: Notification Bell
const BellIcon = ({ color = '#EE6B6E', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={1} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </Svg>
);

const SearchIcon = ({ color = '#8E8880', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

const ChevronRight = ({ color = '#B0472B', size = 14 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M9 18l6-6-6-6" />
  </Svg>
);

// Sacred Astro Emblem Icon matching target image
const SacredAstroEmblem = ({ size = 60 }: { size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 100 100">
    <Circle cx="50" cy="50" r="47" stroke="#D1D5DB" strokeWidth="0.8" fill="none" strokeDasharray="2 2" />
    <Circle cx="50" cy="50" r="41" stroke="#E5E7EB" strokeWidth="1.2" fill="none" />
    <Circle cx="50" cy="50" r="32" stroke="#D1D5DB" strokeWidth="1" fill="none" />

    <Circle cx="50" cy="3" r="3" fill="#374151" />
    <Circle cx="50" cy="97" r="3" fill="#374151" />
    <Circle cx="3" cy="50" r="3" fill="#374151" />
    <Circle cx="96" cy="50" r="3" fill="#374151" />
    <Circle cx="17" cy="17" r="2.5" fill="#EE6B6E" />
    <Circle cx="83" cy="83" r="2.5" fill="#EE6B6E" />
    <Circle cx="83" cy="17" r="2.5" fill="#EE6B6E" />
    <Circle cx="17" cy="83" r="2.5" fill="#EE6B6E" />

    <Circle cx="50" cy="50" r="25" fill="#EE6B6E" />
    <Circle cx="50" cy="50" r="22" stroke="#FFFFFF" strokeWidth="0.8" fill="none" opacity={0.6} />

    <Polygon points="50,29 67,59 33,59" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
    <Polygon points="50,71 67,41 33,41" fill="none" stroke="#FFFFFF" strokeWidth="1.8" />
    <Circle cx="50" cy="50" r="2.5" fill="#FFFFFF" />
  </Svg>
);

export const HomeScreen = ({ navigation }: any) => {
  const { user } = useAuthStore();
  const username = user?.username || 'Hailey Nguyen';
  const [searchQuery, setSearchQuery] = useState('');

  const [categories, setCategories] = useState<ZodiacCategory[]>(FALLBACK_CATEGORIES);
  const [astrologers, setAstrologers] = useState<Astrologer[]>(FALLBACK_ASTROLOGERS);
  const [services, setServices] = useState<AstroService[]>(FALLBACK_SERVICES);
  const [isLoadingData, setIsLoadingData] = useState(true);

  React.useEffect(() => {
    let isMounted = true;
    const timeout = setTimeout(() => {
      // If API takes more than 5s, stop loading and use fallback data
      if (isMounted) setIsLoadingData(false);
    }, 5000);

    async function fetchData() {
      try {
        const [catsRes, astrosRes, servicesRes] = await Promise.all([
          astroApi.getCategories(),
          astroApi.getAstrologers(),
          astroApi.getServices(),
        ]);
        if (isMounted) {
          setCategories(catsRes);
          setAstrologers(astrosRes);
          setServices(servicesRes);
        }
      } catch (err) {
        console.warn('Using fallback home data:', err);
      } finally {
        clearTimeout(timeout);
        if (isMounted) setIsLoadingData(false);
      }
    }
    fetchData();
    return () => { isMounted = false; clearTimeout(timeout); };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          {/* Left: User Profile */}
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <Image
                source={{
                  uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
                }}
                style={styles.avatar}
              />
            </View>
            <View style={styles.userTextContainer}>
              <Text style={styles.welcomeText}>Welcome back</Text>
              <Text style={styles.usernameText}>{username}</Text>
            </View>
          </View>

          {/* Right: Soft Floating Actions Card */}
          <View style={styles.topActionsCard}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => navigation.navigate('Profile')}
              activeOpacity={0.7}
            >
              <SettingsIcon size={20} color="#EE6B6E" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
              <BellIcon size={20} color="#EE6B6E" />
            </TouchableOpacity>
          </View>
        </View>

        {/* 1. Zodiac Categories Bar */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => navigation.navigate('Categories')}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={13} color="#B0472B" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
          {categories.map((cat, idx) => (
            <TouchableOpacity
              key={cat.name}
              style={[styles.categoryCircleCard, idx === 0 && styles.categoryCircleCardActive]}
              onPress={() => navigation.navigate('HoroscopeDetail', { sign: cat.name, dates: cat.dates })}
              activeOpacity={0.8}
            >
              <View style={[styles.categoryIconCircle, idx === 0 && styles.categoryIconCircleActive]}>
                <ZodiacIcon sign={cat.name} size={28} color={idx === 0 ? '#FFFFFF' : '#B0472B'} />
              </View>
              <Text style={styles.categoryName}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* 2. Featured Card (Guru & Ghat Sketch background) */}
        <View style={styles.featuredSectionHeader}>
          <Text style={styles.featuredHeading}>Featured</Text>
        </View>
        <View style={styles.featuredCardWrapper}>
          {/* Main Card Box */}
          <TouchableOpacity
            style={styles.featuredCard}
            onPress={() => navigation.navigate('Chat')}
            activeOpacity={0.9}
          >
            <ImageBackground
              source={require('../../assets/ghat_sketch_recolored.png')}
              style={styles.cardBackground}
              imageStyle={styles.cardBackgroundImage}
              resizeMode="cover"
            />
          </TouchableOpacity>

          {/* Guru Character Illustration popping out ABOVE card top */}
          <Image
            source={require('../../assets/guru_recolored_v2.png')}
            style={styles.guruPopoutImage}
            resizeMode="contain"
          />

          {/* White Floating Bottom Card OVERLAPPING on top of Guru */}
          <TouchableOpacity
            style={styles.overlayCardAbsolute}
            onPress={() => navigation.navigate('Chat')}
            activeOpacity={0.9}
          >
            <View style={styles.overlayTextContainer}>
              <Text style={styles.overlayTitle}>Explore the world</Text>
              <Text style={styles.overlaySubtitle}>Get offers and discount today</Text>
            </View>
            <View style={styles.emblemContainer}>
              <SacredAstroEmblem size={56} />
            </View>
          </TouchableOpacity>
        </View>

        {/* 3. Astrologers Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Astrologers</Text>
          <TouchableOpacity
            style={styles.seeAllBtn}
            onPress={() => navigation.navigate('AstrologersList')}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <ChevronRight size={13} color="#B0472B" />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.astrologersScroll}>
          {astrologers.slice(0, 5).map((astro) => (
            <TouchableOpacity
              key={astro.id}
              style={styles.astroMiniCard}
              onPress={() => navigation.navigate('AstrologerDetail', { astrologer: astro })}
              activeOpacity={0.85}
            >
              <Image source={{ uri: astro.avatar }} style={styles.astroMiniAvatar} />
              <Text style={styles.astroMiniName} numberOfLines={1}>{astro.name}</Text>
              <TouchableOpacity
                style={styles.astroMiniChatBtn}
                onPress={() => navigation.navigate('Chat')}
              >
                <Text style={styles.astroMiniChatText}>Chat</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 24 : 16,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EAE6DF',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userTextContainer: {
    justifyContent: 'center',
  },
  welcomeText: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 12,
    color: '#827C75',
    fontWeight: '400',
  },
  usernameText: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 16,
    fontWeight: '700',
    color: '#1F1B18',
    marginTop: 2,
  },
  topActionsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 14,
    borderWidth: 1,
    borderColor: '#EAE6DF',
  },
  actionBtn: {
    padding: 2,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderWidth: 1,
    borderColor: '#EAE6DF',
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#1F1B18',
    padding: 0,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
    marginTop: 8,
  },
  sectionTitle: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F1B18',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#B0472B',
  },
  categoriesScroll: {
    gap: 16,
    marginBottom: 24,
  },
  categoryCircleCard: {
    alignItems: 'center',
    width: 68,
  },
  categoryCircleCardActive: {},
  categoryIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#F3EFE6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#EAE6DF',
  },
  categoryIconCircleActive: {
    backgroundColor: '#B0472B',
    borderColor: '#B0472B',
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F1B18',
    textAlign: 'center',
  },
  featuredSectionHeader: {
    marginTop: 8,
    marginBottom: 12,
  },
  featuredHeading: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 22,
    fontWeight: '800',
    color: '#1F1B18',
  },
  featuredCardWrapper: {
    marginBottom: 28,
    position: 'relative',
    height: 170,
  },
  featuredCard: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    overflow: 'hidden',
    backgroundColor: '#CBC5B9',
  },
  cardBackground: {
    flex: 1,
  },
  cardBackgroundImage: {
    opacity: 0.45,
    borderRadius: 22,
  },
  guruPopoutImage: {
    position: 'absolute',
    top: -55,
    right: 10,
    width: 155,
    height: 175,
    zIndex: 2,
  },
  overlayCardAbsolute: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
    minHeight: 74,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  overlayTextContainer: {
    flex: 1,
    paddingRight: 10,
  },
  overlayTitle: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 17,
    fontWeight: '700',
    color: '#24201D',
    marginBottom: 2,
  },
  overlaySubtitle: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 12,
    color: '#8A847C',
    fontWeight: '400',
  },
  emblemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  astrologersScroll: {
    gap: 14,
    marginBottom: 24,
  },
  astroMiniCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 14,
    width: 130,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAE6DF',
  },
  astroMiniAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 8,
  },
  astroMiniName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F1B18',
    marginBottom: 8,
    textAlign: 'center',
  },
  astroMiniChatBtn: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#B0472B',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  astroMiniChatText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B0472B',
  },
  freeBannerCard: {
    backgroundColor: '#FFF7F3',
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#FBD2C8',
    marginBottom: 28,
  },
  freeBannerLeft: {},
  freeBannerSub: {
    fontSize: 12,
    fontWeight: '600',
    color: '#827C75',
    marginBottom: 2,
  },
  freeBannerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#B0472B',
    marginBottom: 10,
  },
  freeBannerBtn: {
    backgroundColor: '#B0472B',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  freeBannerBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  freeBannerRight: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  serviceGridCard: {
    width: '48%',
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAE6DF',
  },
  serviceGridIcon: {
    fontSize: 30,
    marginBottom: 6,
  },
  serviceGridTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F1B18',
  },
});
