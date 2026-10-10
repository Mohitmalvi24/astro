export const theme = {
  colors: {
    background: '#F6F1E7', // warm cream
    textPrimary: '#1F1B18', // charcoal
    textSecondary: '#7A7266',
    accent: '#B0472B', // terracotta/rust
    chatBubbleIncoming: '#EDE7DA', // light beige
    chatBubbleOutgoingBg: '#B0472B',
    chatBubbleOutgoingText: '#F6F1E7',
    border: '#E3DBC9',
  },
  typography: {
    fontFamilyHeading: 'Georgia', // Serif font for app name "Astro" & screen headings
    fontFamilyBody: 'System', // Clean sans-serif for body text
  },
  borderRadius: {
    card: 12, // 10-14px range
    button: 8, // 8px on standard buttons
    circular: 999, // fully rounded for send buttons / icons
  },
  icons: {
    style: 'outline', // Line-style/outline icons (e.g., Feather / Tabler style)
  },
};

export type Theme = typeof theme;
