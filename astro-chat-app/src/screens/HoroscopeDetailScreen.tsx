import React, { useState } from 'react';
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
import { ZodiacIcon } from './CategoriesScreen';

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

import { astroApi, HoroscopeData } from '../api/astro';

export const HoroscopeDetailScreen = ({ route, navigation }: any) => {
  const sign = route.params?.sign || 'Aries';
  const dates = route.params?.dates || '21 Mar - 19 Apr';
  const [selectedDay, setSelectedDay] = useState('Today');
  
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await astroApi.getHoroscope(sign);
        if (isMounted) setHoroscope(data);
      } catch (e) {
        console.error(e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [sign]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FAF9F6" />
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
          <BackIcon size={22} color="#1F1B18" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{sign}</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <SearchIcon size={20} color="#1F1B18" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Banner with Celestial Theme */}
        <View style={styles.bannerContainer}>
          <View style={styles.bannerContent}>
            <View>
              <Text style={styles.bannerSubtitle}>Daily</Text>
              <Text style={styles.bannerTitle}>{sign}</Text>
              <Text style={styles.bannerDates}>{dates}</Text>
            </View>
            <View style={styles.bannerIconWrapper}>
              <ZodiacIcon sign={sign} size={48} color="#FFFFFF" />
            </View>
          </View>
        </View>

        {/* Prediction Main Card */}
        <View style={styles.predictionCard}>
          <Text style={styles.todayHeading}>{selectedDay}</Text>
          <Text style={styles.predictionText}>
            {horoscope?.prediction || `Today brings clarity and fresh cosmic motivation for ${sign}. Trust your natural instincts when navigating new opportunities in love and career.`}
          </Text>

          <View style={styles.luckyContainer}>
            <View style={styles.luckyBlock}>
              <Text style={styles.luckyLabel}>Lucky Colours</Text>
              <View style={styles.colorsRow}>
                {(horoscope?.lucky_colors || ['#E53E3E', '#DD6B20']).map((col, idx) => (
                  <View key={idx} style={[styles.colorDot, { backgroundColor: col }]} />
                ))}
              </View>
            </View>
            <View style={styles.luckyBlock}>
              <Text style={styles.luckyLabel}>Lucky Number</Text>
              <Text style={styles.luckyValue}>{horoscope?.lucky_numbers || '6, 9, 18'}</Text>
            </View>
          </View>
        </View>

        {/* Date Filter Pills */}
        <View style={styles.dateSelectorRow}>
          {['Yesterday', 'Today', 'Tomorrow'].map((day) => {
            const isSelected = selectedDay === day;
            return (
              <TouchableOpacity
                key={day}
                style={[styles.datePill, isSelected && styles.datePillSelected]}
                onPress={() => setSelectedDay(day)}
              >
                <Text style={[styles.datePillLabel, isSelected && styles.datePillLabelSelected]}>{day}</Text>
                <Text style={[styles.datePillSub, isSelected && styles.datePillSubSelected]}>
                  {day === 'Yesterday' ? '2 Oct' : day === 'Today' ? '3 Oct' : '4 Oct'}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Scores Section */}
        <Text style={styles.sectionHeading}>More Horoscope For {sign}</Text>
        <View style={styles.scoresRow}>
          <View style={styles.scoreCard}>
            <View style={[styles.circleBadge, { borderColor: '#E53E3E' }]}>
              <Text style={styles.scoreText}>{horoscope?.scores?.love || 70}%</Text>
            </View>
            <Text style={[styles.scoreLabel, { color: '#E53E3E' }]}>Love</Text>
          </View>
          <View style={styles.scoreCard}>
            <View style={[styles.circleBadge, { borderColor: '#3182CE' }]}>
              <Text style={styles.scoreText}>{horoscope?.scores?.career || 86}%</Text>
            </View>
            <Text style={[styles.scoreLabel, { color: '#3182CE' }]}>Career</Text>
          </View>
          <View style={styles.scoreCard}>
            <View style={[styles.circleBadge, { borderColor: '#38A169' }]}>
              <Text style={styles.scoreText}>{horoscope?.scores?.health || 60}%</Text>
            </View>
            <Text style={[styles.scoreLabel, { color: '#38A169' }]}>Health</Text>
          </View>
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
  bannerContainer: {
    backgroundColor: '#2A233C', // Dark space cosmic theme
    borderRadius: 22,
    padding: 20,
    marginBottom: -30,
  },
  bannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bannerSubtitle: {
    fontSize: 13,
    color: '#BDB3D9',
    fontWeight: '400',
  },
  bannerTitle: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginVertical: 2,
  },
  bannerDates: {
    fontSize: 12,
    color: '#D2C9E8',
  },
  bannerIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  predictionCard: {
    backgroundColor: '#B0472B', // Existing theme terracotta accent
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    marginTop: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  todayHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  predictionText: {
    fontSize: 14,
    color: '#F9F6F0',
    lineHeight: 20,
    marginBottom: 16,
  },
  luckyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    paddingTop: 14,
  },
  luckyBlock: {},
  luckyLabel: {
    fontSize: 12,
    color: '#F3EFE6',
    fontWeight: '600',
    marginBottom: 6,
  },
  colorsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  colorDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
  luckyValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dateSelectorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 10,
  },
  datePill: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EAE6DF',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  datePillSelected: {
    borderColor: '#B0472B',
    backgroundColor: '#FFF7F5',
  },
  datePillLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F1B18',
  },
  datePillLabelSelected: {
    color: '#B0472B',
  },
  datePillSub: {
    fontSize: 11,
    color: '#827C75',
    marginTop: 2,
  },
  datePillSubSelected: {
    color: '#B0472B',
  },
  sectionHeading: {
    fontFamily: theme.typography.fontFamilyHeading,
    fontSize: 18,
    fontWeight: '700',
    color: '#1F1B18',
    marginBottom: 16,
  },
  scoresRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  scoreCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EAE6DF',
  },
  circleBadge: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1F1B18',
  },
  scoreLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
});
