import { Platform } from 'react-native';

export const theme = {
  colors: {
    background: '#FFFFFF', // Clean white
    backgroundAlt: '#F8FAFC', // Very soft cool grey/slate
    cardBackground: '#FFFFFF',
    textPrimary: '#0F172A', // Deep slate/black
    textSecondary: '#64748B', // Cool slate secondary
    textMuted: '#94A3B8',
    primary: '#2B57D8', // Royal Indigo / Blue
    primaryLight: '#EEF2FF',
    accent: '#2B57D8',
    danger: '#DC2626', // Red timer bar
    timerRed: '#C91C36',
    success: '#10B981', // Online green dot
    warning: '#F59E0B',
    chatBubbleIncoming: '#FFFFFF', // White card for incoming
    chatBubbleOutgoingBg: '#2B57D8', // Rich blue outgoing
    chatBubbleOutgoingText: '#FFFFFF',
    border: '#E2E8F0',
    borderSubtle: '#F1F5F9',
    badgeBlue: '#2B57D8',
    pillActive: '#2B57D8',
    pillInactive: '#FFFFFF',
  },
  typography: {
    fontFamilyHeading: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    fontFamilyBody: Platform.OS === 'ios' ? 'System' : 'normal',
  },
  borderRadius: {
    card: 16,
    pill: 24,
    button: 12,
    circular: 999,
  },
};

export type Theme = typeof theme;
