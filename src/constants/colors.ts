// App-wide color palette — dark-first design

export const Colors = {
  // Brand
  primary: '#00A76D',       // Logo Green
  primaryDark: '#008554',
  primaryLight: '#26C28B',
  primaryMuted: '#E6F6F0',   // Light green background tint

  secondary: '#002D62',     // Logo Navy Blue
  secondaryDark: '#001E42',
  secondaryLight: '#1A4D85',
  secondaryMuted: '#EBF1F7', // Light navy background tint

  accent: '#F59E0B',        // Amber — warnings, stars
  accentDark: '#D97706',

  danger: '#EF4444',        // Red — errors, unavailable
  dangerDark: '#DC2626',
  dangerMuted: '#FEE2E2',

  // Neutrals — CLEAN LIGHT THEME
  background: '#F8FAFC',    // Slate 50 — clean background
  surface: '#FFFFFF',       // White — cards
  surfaceHigh: '#F1F5F9',   // Slate 100 — elevated surface
  border: '#E2E8F0',        // Slate 200 — clean border
  borderLight: '#F1F5F9',   // Slate 100

  // Text
  textPrimary: '#0F172A',   // Slate 900 — dark text
  textSecondary: '#475569', // Slate 600 — medium text
  textMuted: '#94A3B8',     // Slate 400 — muted text
  textInverse: '#FFFFFF',   // Light on dark bg

  // Status colors
  statusPending: '#F59E0B',
  statusConfirmed: '#00A76D',
  statusRejected: '#EF4444',
  statusDisputed: '#8B5CF6',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Transparent
  transparent: 'transparent',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export type ColorKey = keyof typeof Colors;
