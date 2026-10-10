import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  StatusBar,
} from 'react-native';
import Svg, { Path, Circle, Star } from 'react-native-svg';
import { theme } from '../theme/theme';

const BackIcon = ({ color = '#1F1B18', size = 22 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M19 12H5" />
    <Path d="M12 19l-7-7 7-7" />
  </Svg>
);

const SearchIcon = ({ color = '#1F1B18', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

import { astroApi, Astrologer } from '../api/astro';

export const AstrologersListScreen = ({ navigation }: any) => {
  const [astrologers, setAstrologers] = React.useState<Astrologer[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await astroApi.getAstrologers();
        if (isMounted) setAstrologers(res);
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
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <BackIcon size={22} color="#1F1B18" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Astrologers</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <SearchIcon size={20} color="#1F1B18" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {astrologers.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.astroCard}
            onPress={() => navigation.navigate('AstrologerDetail', { astrologer: item })}
            activeOpacity={0.85}
          >
            {/* Free / Paid Ribbon Badge */}
            <View style={[styles.badgeRibbon, item.isFree ? styles.badgeFree : styles.badgePaid]}>
              <Text style={styles.badgeText}>{item.price}</Text>
            </View>

            <View style={styles.cardRow}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View style={styles.infoContainer}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.skills}>{item.skills}</Text>
                <Text style={styles.languages}>{item.languages}</Text>
                <Text style={styles.exp}>{item.exp}</Text>
                
                <View style={styles.ratingRow}>
                  <Text style={styles.stars}>★ ★ ★ ★ ★</Text>
                  <Text style={styles.ordersText}>{item.orders}</Text>
                </View>
              </View>
            </View>

            <View style={styles.actionRow}>
              <TouchableOpacity
                style={styles.chatBtn}
                onPress={() => navigation.navigate('Chat')}
              >
                <Text style={styles.chatBtnText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
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
    gap: 16,
  },
  astroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE6DF',
    position: 'relative',
    overflow: 'hidden',
  },
  badgeRibbon: {
    position: 'absolute',
    top: 12,
    right: -24,
    width: 90,
    paddingVertical: 4,
    alignItems: 'center',
    transform: [{ rotate: '30deg' }],
  },
  badgeFree: {
    backgroundColor: '#48BB78',
  },
  badgePaid: {
    backgroundColor: '#4299E1',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  cardRow: {
    flexDirection: 'row',
    gap: 14,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EAE6DF',
  },
  infoContainer: {
    flex: 1,
    paddingRight: 40,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1F1B18',
    marginBottom: 2,
  },
  skills: {
    fontSize: 12,
    color: '#827C75',
    marginBottom: 2,
  },
  languages: {
    fontSize: 11,
    color: '#A0988E',
    marginBottom: 2,
  },
  exp: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B0472B',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    fontSize: 12,
    color: '#ECC94B',
  },
  ordersText: {
    fontSize: 11,
    color: '#827C75',
  },
  actionRow: {
    alignItems: 'flex-end',
    marginTop: -20,
  },
  chatBtn: {
    backgroundColor: '#FAF5EE',
    borderWidth: 1,
    borderColor: '#B0472B',
    borderRadius: 18,
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  chatBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#B0472B',
  },
});
