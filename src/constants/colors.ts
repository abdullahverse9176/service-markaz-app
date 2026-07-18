// App-wide color palette — dark-first design

export const Colors = {
  // Brand
  primary: '#6366F1',       // Indigo
  primaryDark: '#4F46E5',
  primaryLight: '#818CF8',
  primaryMuted: '#EEF2FF',

  secondary: '#10B981',     // Emerald — success/available
  secondaryDark: '#059669',

  accent: '#F59E0B',        // Amber — warnings, stars
  accentDark: '#D97706',

  danger: '#EF4444',        // Red — errors, unavailable
  dangerDark: '#DC2626',
  dangerMuted: '#FEE2E2',

  // Neutrals
  background: '#0F172A',    // Slate 900 — main bg
  surface: '#1E293B',       // Slate 800 — cards
  surfaceHigh: '#334155',   // Slate 700 — elevated cards
  border: '#334155',        // Slate 700
  borderLight: '#475569',   // Slate 600

  // Text
  textPrimary: '#F8FAFC',   // Slate 50
  textSecondary: '#94A3B8', // Slate 400
  textMuted: '#64748B',     // Slate 500
  textInverse: '#0F172A',   // Dark on light bg

  // Status colors
  statusPending: '#F59E0B',
  statusConfirmed: '#10B981',
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
