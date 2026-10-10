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
import Svg, { Path, Circle } from 'react-native-svg';
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

const ChatIcon = ({ color = '#FFFFFF', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </Svg>
);

const VideoIcon = ({ color = '#FFFFFF', size = 18 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M23 7l-7 5 7 5V7z" />
    <Path d="M14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z" />
  </Svg>
);

import { astroApi, AstroService } from '../api/astro';

export const AstrologerDetailScreen = ({ route, navigation }: any) => {
  const astrologer = route.params?.astrologer || {
    name: 'Samiksha',
    skills: 'Vedic, Vastu',
    languages: 'English, Hindi, Punjabi, Gujarati',
    exp: 'Exp. 5 Years',
    orders: '1524 Orders',
    rating: '4.95',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  };

  const [services, setServices] = React.useState<AstroService[]>([]);

  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await astroApi.getServices();
        if (isMounted) setServices(res);
      } catch (e) {
        console.error(e);
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
        <Text style={styles.headerTitle}>{astrologer.name}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Profile Card Header */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            <Image source={{ uri: astrologer.avatar }} style={styles.avatar} />
            <View style={styles.profileDetails}>
              <Text style={styles.name}>{astrologer.name}</Text>
              <Text style={styles.skills}>{astrologer.skills}</Text>
              <Text style={styles.languages}>{astrologer.languages}</Text>
              <View style={styles.followRow}>
                <TouchableOpacity style={styles.followBtn}>
                  <Text style={styles.followText}>Follow</Text>
                </TouchableOpacity>
                <Text style={styles.exp}>{astrologer.exp}</Text>
              </View>
            </View>
          </View>

          {/* Consultation Action Buttons */}
          <View style={styles.consultButtonsRow}>
            <TouchableOpacity style={styles.consultBtn} onPress={() => navigation.navigate('Chat')}>
              <ChatIcon size={18} color="#FFFFFF" />
              <Text style={styles.consultBtnText}>Free Chat</Text>
            </TouchableOpacity>
          </View>
        </View>


        {/* Rating & Review Breakdown */}
        <Text style={styles.sectionHeading}>Rating & Review</Text>
        <View style={styles.ratingCard}>
          <View style={styles.ratingLeft}>
            <Text style={styles.ratingScore}>{astrologer.rating || '4.95'}</Text>
            <Text style={styles.ratingStars}>★ ★ ★ ★ ★</Text>
            <Text style={styles.totalOrders}>👥 1524 Orders</Text>
          </View>
          <View style={styles.ratingRight}>
            {[5, 4, 3, 2, 1].map((star, idx) => (
              <View key={star} style={styles.barRow}>
                <Text style={styles.starNum}>{star}</Text>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: idx === 0 ? '85%' : idx === 1 ? '60%' : '20%' }]} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* User Reviews */}
        <View style={styles.reviewHeader}>
          <Text style={styles.sectionHeading}>User Review</Text>
          <Text style={styles.viewAllText}>View All »</Text>
        </View>

        <View style={styles.userReviewCard}>
          <View style={styles.userReviewRow}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' }}
              style={styles.reviewerAvatar}
            />
            <View>
              <Text style={styles.reviewerName}>Pratyush</Text>
              <Text style={styles.reviewerStars}>★ ★ ★ ★ ★</Text>
            </View>
          </View>
          <Text style={styles.reviewBody}>
            It was a very nice experience, I will follow all his suggestions. Hope his prediction will come true.
          </Text>
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
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE6DF',
    marginBottom: 24,
  },
  profileRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 16,
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
  },
  profileDetails: {
    flex: 1,
  },
  name: {
    fontSize: 18,
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
    marginBottom: 8,
  },
  followRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  followBtn: {
    backgroundColor: '#B0472B',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 4,
  },
  followText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  exp: {
    fontSize: 11,
    fontWeight: '600',
    color: '#827C75',
  },
  consultButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  consultBtn: {
    flex: 1,
    backgroundColor: '#B0472B',
    borderRadius: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  consultBtnVideo: {
    backgroundColor: '#2B6CB0',
  },
  consultBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  sectionHeading: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F1B18',
    marginBottom: 14,
  },
  servicesScroll: {
    gap: 12,
    marginBottom: 24,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    width: 120,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAE6DF',
  },
  serviceIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  serviceTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F1B18',
    textAlign: 'center',
  },
  ratingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#EAE6DF',
    marginBottom: 24,
  },
  ratingLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 20,
    borderRightWidth: 1,
    borderRightColor: '#EAE6DF',
  },
  ratingScore: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1F1B18',
  },
  ratingStars: {
    fontSize: 12,
    color: '#ECC94B',
    marginVertical: 4,
  },
  totalOrders: {
    fontSize: 11,
    color: '#827C75',
  },
  ratingRight: {
    flex: 1,
    paddingLeft: 16,
    justifyContent: 'center',
    gap: 6,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  starNum: {
    fontSize: 11,
    fontWeight: '600',
    color: '#827C75',
    width: 10,
  },
  barTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#EAE6DF',
    borderRadius: 3,
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: '#ECC94B',
    borderRadius: 3,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B0472B',
  },
  userReviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EAE6DF',
    marginBottom: 20,
  },
  userReviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  reviewerAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  reviewerName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F1B18',
  },
  reviewerStars: {
    fontSize: 11,
    color: '#ECC94B',
  },
  reviewBody: {
    fontSize: 13,
    color: '#60584E',
    lineHeight: 18,
  },
});
