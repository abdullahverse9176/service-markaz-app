import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius, Shadow } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const FEATURED_CARD_WIDTH = SCREEN_WIDTH - 64;
export const FEATURED_GAP = 12;

export const styles = StyleSheet.create({
  featuredContainer: {
    marginBottom: Spacing.xl,
  },
  featuredHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  featuredTitleWrap: {
    gap: 3,
  },
  featuredTitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    gap: 4,
  },
  featuredBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.accentDark,
    letterSpacing: 0.5,
    fontFamily: Typography.fontFamily.extraBold,
  },
  featuredSectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  featuredSeeAll: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },
  featuredScroll: {
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
  },
  featuredCard: {
    width: FEATURED_CARD_WIDTH,
    height: 170,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginRight: FEATURED_GAP,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FEF3C7', // soft golden border
    ...Shadow.md,
  },
  featCardLeft: {
    flex: 1.3,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  featCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featCategoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Typography.fontFamily.bold,
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  featNameText: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    marginTop: 4,
  },
  featTitleText: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.regular,
    marginTop: 2,
    lineHeight: 14,
  },
  featRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  featStarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  featRatingVal: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  featReviewsCount: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  featExpText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.medium,
  },
  featFooterDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  featFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featPriceLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.regular,
  },
  featPriceVal: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
  },
  featBookBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  featBookBtnText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },
  featCardRight: {
    flex: 1,
    position: 'relative',
    height: '100%',
    backgroundColor: Colors.surfaceHigh,
  },
  featImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.secondaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featPlaceholderText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.secondary,
  },
  featStatusBadge: {
    position: 'absolute',
    top: Spacing.xs + 2,
    right: Spacing.xs + 2,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.sm,
    opacity: 0.9,
  },
  featStatusText: {
    fontSize: 9,
    color: Colors.white,
    fontWeight: '800',
    fontFamily: Typography.fontFamily.bold,
  },
});
