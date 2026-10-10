import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { theme } from '../theme/theme';
import { astroApi, ZodiacCategory } from '../api/astro';

const BackIcon = ({ color = '#1F1B18', size = 22 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5" />
    <Path d="M12 19l-7-7 7-7" />
  </Svg>
);

const SearchIcon = ({ color = '#8E8880', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

// Zodiac Icons SVG representations
export const ZodiacIcon = ({ sign, size = 32, color = '#B0472B' }: { sign: string; size?: number; color?: string }) => {
  switch (sign.toLowerCase()) {
    case 'aries':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M12 21V9a4 4 0 0 0-4-4H5a3 3 0 0 0 0 6h3" />
          <Path d="M12 9a4 4 0 0 1 4-4h3a3 3 0 0 1 0 6h-3" />
        </Svg>
      );
    case 'taurus':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="14" r="6" />
          <Path d="M6 4a6 6 0 0 0 12 0" />
        </Svg>
      );
    case 'gemini':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M4 4a16 16 0 0 0 16 0" />
          <Path d="M4 20a16 16 0 0 1 16 0" />
          <Path d="M8 5v14" />
          <Path d="M16 5v14" />
        </Svg>
      );
    case 'cancer':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="6" cy="10" r="4" />
          <Circle cx="18" cy="14" r="4" />
          <Path d="M10 10a8 8 0 0 1 8-8" />
          <Path d="M14 14a8 8 0 0 1-8 8" />
        </Svg>
      );
    case 'leo':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="7" cy="12" r="3" />
          <Path d="M10 12c2 0 3-4 6-4s3 3 1 6-4 4-4 7" />
        </Svg>
      );
    case 'virgo':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M4 4v12a3 3 0 0 0 6 0V4" />
          <Path d="M10 4v12a3 3 0 0 0 6 0V4" />
          <Path d="M16 12c1 0 3 1 3 4s-2 5-4 5" />
        </Svg>
      );
    case 'libra':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M4 20h16" />
          <Path d="M4 16h16" />
          <Path d="M9 16a3 3 0 0 1 6 0" />
        </Svg>
      );
    case 'scorpio':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Path d="M4 4v11a2 2 0 0 0 4 0V4" />
          <Path d="M8 4v11a2 2 0 0 0 4 0V4" />
          <Path d="M12 4v11a2 2 0 0 0 4 0l3 3m-3-3l3-3" />
        </Svg>
      );
    default:
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
          <Circle cx="12" cy="12" r="9" />
          <Path d="M12 8v8" />
          <Path d="M8 12h8" />
        </Svg>
      );
  }
};



export const CategoriesScreen = ({ navigation }: any) => {
  const [categories, setCategories] = React.useState<ZodiacCategory[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await astroApi.getCategories();
        if (isMounted) setCategories(res);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />
      {/* Top Bar */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <BackIcon size={22} color="#1F1B18" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <SearchIcon size={20} color="#1F1B18" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {categories.map((item, index) => {
            const isFeatured = index === 0;
            return (
              <TouchableOpacity
                key={item.name}
                style={[styles.card, isFeatured && styles.cardFeatured]}
                onPress={() => navigation.navigate('HoroscopeDetail', { sign: item.name, dates: item.dates })}
                activeOpacity={0.8}
              >
                <View style={[styles.iconWrapper, isFeatured && styles.iconWrapperFeatured]}>
                  <ZodiacIcon sign={item.name} size={36} color={isFeatured ? '#FFFFFF' : '#B0472B'} />
                </View>
                <Text style={[styles.cardTitle, isFeatured && styles.cardTitleFeatured]}>{item.name}</Text>
                <Text style={[styles.cardDates, isFeatured && styles.cardDatesFeatured]}>{item.dates}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF9F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#EAE6DF',
  },
  iconBtn: {
    padding: 6,
  },
  headerTitle: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 20,
    fontWeight: '700',
    color: '#1F1B18',
  },
  scrollContent: {
    padding: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    width: '47%',
    backgroundColor: '#F3EFE6',
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  cardFeatured: {
    backgroundColor: '#B0472B',
  },
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6DEC9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconWrapperFeatured: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  cardTitle: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 17,
    fontWeight: '700',
    color: '#1F1B18',
    marginBottom: 4,
  },
  cardTitleFeatured: {
    color: '#FFFFFF',
  },
  cardDates: {
    fontFamily: theme.typography.fontFamilyBody,
    fontSize: 12,
    color: '#827C75',
  },
  cardDatesFeatured: {
    color: '#F6F1E7',
  },
});
