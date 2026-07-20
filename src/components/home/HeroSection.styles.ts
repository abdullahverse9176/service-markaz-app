import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius, Shadow } from '@/constants/theme';

export const styles = StyleSheet.create({
  heroBackground: {
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: 30,
    paddingHorizontal: Spacing.base,
    paddingBottom: 40,
    position: 'relative',
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  brandTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '900',
    letterSpacing: 0.5,
    fontFamily: Typography.fontFamily.extraBold,
  },
  brandTextWhite: {
    color: Colors.white,
  },
  brandTextGreen: {
    color: Colors.primary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    marginLeft: 3,
    fontFamily: Typography.fontFamily.semiBold,
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatar: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestAvatar: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  avatarText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
  },
  welcomeMainRow: {
    marginBottom: Spacing.lg,
  },
  greetingText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 4,
    fontFamily: Typography.fontFamily.medium,
  },
  heroTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 28,
    fontFamily: Typography.fontFamily.extraBold,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 52,
    position: 'absolute',
    bottom: -26,
    left: Spacing.base,
    right: Spacing.base,
    ...Shadow.md,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.sm,
    height: '100%',
    fontFamily: Typography.fontFamily.regular,
  },
  clearSearchBtn: {
    padding: Spacing.xs,
  },
  searchBtn: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  searchSpacer: {
    height: 38,
  },
});
