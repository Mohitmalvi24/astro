import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import { theme } from '../theme/theme';
import { useAuthStore } from '../store/authStore';
import { SafeStorage } from '../utils/storage';

const TOTAL_STEPS = 3;
const NAVY = '#1E2A5E';
const NAVY_LIGHT = '#2B57D8';
const PROGRESS_BG = '#D6DAE5';
const BORDER_COLOR = '#B0B8D1';
const SUBTITLE_COLOR = '#6B7280';
const LABEL_COLOR = '#1F2937';

const BackArrow = ({ color = NAVY, size = 24 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
    <Path d="M15 18l-6-6 6-6" />
  </Svg>
);

const SearchIcon = ({ color = '#94A3B8', size = 20 }: { color?: string; size?: number }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <Circle cx="11" cy="11" r="8" />
    <Path d="M21 21l-4.35-4.35" />
  </Svg>
);

// ------ Progress Bar ------
const ProgressBar = ({ current, total }: { current: number; total: number }) => (
  <View style={styles.progressContainer}>
    <View style={styles.progressBarRow}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.progressSegment,
            i <= current - 1 ? styles.progressFilled : styles.progressEmpty,
          ]}
        />
      ))}
    </View>
    <Text style={styles.stepCounter}>{current}/{total}</Text>
  </View>
);

// ------ Popular City Chips ------
const POPULAR_CITIES = ['Delhi', 'Mumbai', 'Lucknow', 'Jaipur', 'Patna'];

export const OnboardingScreen = ({ navigation }: any) => {
  const { completeOnboarding } = useAuthStore();
  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState('');

  // Step 2
  const [birthDay, setBirthDay] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [birthYear, setBirthYear] = useState('');

  // Step 3
  const [birthPlace, setBirthPlace] = useState('');

  const canContinue = () => {
    if (step === 1) return name.trim().length > 0;
    if (step === 2) return birthDay.trim().length > 0 && birthMonth.trim().length > 0 && birthYear.trim().length >= 4;
    if (step === 3) return birthPlace.trim().length > 0;
    return false;
  };

  const handleContinue = async () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    } else {
      // Save onboarding data locally
      try {
        const onboardingData = {
          name: name.trim(),
          birthDate: `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`,
          birthPlace: birthPlace.trim(),
        };
        await SafeStorage.setItem('onboarding_data', JSON.stringify(onboardingData));
      } catch (e) {
        console.warn('Failed to save onboarding data:', e);
      }
      // Complete onboarding → sets isAuthenticated = true
      completeOnboarding();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  // ============================
  //  Step 1: Name
  // ============================
  const renderStep1 = () => (
    <>
      <Text style={styles.heading}>What is your name?</Text>
      <Text style={styles.subtitle}>Your astrologer will use this name.</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Your name</Text>
        <TextInput
          style={styles.textInputField}
          value={name}
          onChangeText={setName}
          placeholder="Enter your name"
          placeholderTextColor="#94A3B8"
          autoFocus
        />
      </View>
    </>
  );

  // ============================
  //  Step 2: Birth Date
  // ============================
  const renderStep2 = () => (
    <>
      <Text style={styles.heading}>What is your date of birth?</Text>
      <Text style={styles.subtitle}>Astrologers need this to read your chart.</Text>

      <View style={styles.dateRow}>
        <View style={styles.dateCol}>
          <Text style={styles.fieldLabel}>Day</Text>
          <TextInput
            style={styles.dateInput}
            value={birthDay}
            onChangeText={(t) => {
              const num = t.replace(/[^0-9]/g, '');
              if (num.length <= 2) setBirthDay(num);
            }}
            placeholder="DD"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
        <View style={styles.dateCol}>
          <Text style={styles.fieldLabel}>Month</Text>
          <TextInput
            style={styles.dateInput}
            value={birthMonth}
            onChangeText={(t) => {
              const num = t.replace(/[^0-9]/g, '');
              if (num.length <= 2) setBirthMonth(num);
            }}
            placeholder="MM"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
        <View style={styles.dateCol}>
          <Text style={styles.fieldLabel}>Year</Text>
          <TextInput
            style={styles.dateInput}
            value={birthYear}
            onChangeText={(t) => {
              const num = t.replace(/[^0-9]/g, '');
              if (num.length <= 4) setBirthYear(num);
            }}
            placeholder="YYYY"
            placeholderTextColor="#94A3B8"
            keyboardType="number-pad"
            maxLength={4}
          />
        </View>
      </View>
    </>
  );

  // ============================
  //  Step 3: Birth Place
  // ============================
  const renderStep3 = () => (
    <>
      <Text style={styles.heading}>Where were you born?</Text>
      <Text style={styles.subtitle}>This helps astrologers read your chart.</Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Birth place</Text>
        <View style={styles.searchInputWrapper}>
          <SearchIcon size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            value={birthPlace}
            onChangeText={setBirthPlace}
            placeholder="City or town"
            placeholderTextColor="#94A3B8"
          />
        </View>
      </View>

      <View style={styles.popularSection}>
        <Text style={styles.popularLabel}>Popular</Text>
        <View style={styles.chipsRow}>
          {POPULAR_CITIES.map((city) => (
            <TouchableOpacity
              key={city}
              style={[
                styles.chip,
                birthPlace === city && styles.chipSelected,
              ]}
              onPress={() => setBirthPlace(city)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  birthPlace === city && styles.chipTextSelected,
                ]}
              >
                {city}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header row: Back arrow + Progress bar */}
          <View style={styles.headerRow}>
            {step > 1 ? (
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <BackArrow size={24} color={NAVY} />
              </TouchableOpacity>
            ) : (
              <View style={styles.backPlaceholder} />
            )}
            <View style={styles.progressWrapper}>
              <ProgressBar current={step} total={TOTAL_STEPS} />
            </View>
          </View>

          {/* Step Content */}
          <View style={styles.stepContent}>
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </View>
        </ScrollView>

        {/* Bottom CTA */}
        <View style={styles.bottomCta}>
          <TouchableOpacity
            style={[styles.ctaButton, !canContinue() && styles.ctaButtonDisabled]}
            onPress={handleContinue}
            disabled={!canContinue()}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaButtonText}>
              {step === TOTAL_STEPS ? 'Finish' : 'Continue'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: Platform.OS === 'android' ? 40 : 16,
  },

  // ---- Header / Progress ----
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 32,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 4,
  },
  backPlaceholder: {
    width: 44,
  },
  progressWrapper: {
    flex: 1,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBarRow: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  progressSegment: {
    flex: 1,
    height: 5,
    borderRadius: 3,
  },
  progressFilled: {
    backgroundColor: NAVY,
  },
  progressEmpty: {
    backgroundColor: PROGRESS_BG,
  },
  stepCounter: {
    fontSize: 14,
    fontWeight: '600',
    color: NAVY,
    marginLeft: 14,
  },

  // ---- Step Content ----
  stepContent: {
    flex: 1,
  },
  heading: {
    fontSize: 30,
    fontWeight: '400',
    fontFamily: theme.typography.fontFamilyHeading,
    color: NAVY,
    marginBottom: 10,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 16,
    color: SUBTITLE_COLOR,
    marginBottom: 32,
    lineHeight: 22,
  },

  // ---- Field Group ----
  fieldGroup: {
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: LABEL_COLOR,
    marginBottom: 10,
  },
  textInputField: {
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0F172A',
    backgroundColor: '#FFFFFF',
  },

  // ---- Date Row ----
  dateRow: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 4,
  },
  dateCol: {
    flex: 1,
  },
  dateInput: {
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#0F172A',
    textAlign: 'left',
    backgroundColor: '#FFFFFF',
  },

  // ---- Search Input ----
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    backgroundColor: '#FFFFFF',
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A',
    paddingVertical: 12,
  },

  // ---- Popular Chips ----
  popularSection: {
    marginTop: 20,
  },
  popularLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: NAVY_LIGHT,
    marginBottom: 14,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  chipSelected: {
    borderColor: NAVY,
    backgroundColor: '#EEF2FF',
  },
  chipText: {
    fontSize: 14,
    fontWeight: '500',
    color: NAVY,
  },
  chipTextSelected: {
    color: NAVY,
    fontWeight: '600',
  },

  // ---- Bottom CTA ----
  bottomCta: {
    paddingHorizontal: 28,
    paddingBottom: Platform.OS === 'android' ? 54 : 16,
    paddingTop: 12,
    backgroundColor: '#FFFFFF',
  },
  ctaButton: {
    backgroundColor: NAVY,
    borderRadius: 30,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaButtonDisabled: {
    opacity: 0.5,
  },
  ctaButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
