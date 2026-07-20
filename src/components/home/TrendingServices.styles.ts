import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius, Shadow } from '@/constants/theme';

export const TRENDING_CARD_WIDTH = 200;
export const TRENDING_GAP = 12;

export const styles = StyleSheet.create({
  trendingContainer: {
    marginBottom: Spacing.xl,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    fontFamily: Typography.fontFamily.regular,
  },
  seeAllLink: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },
  trendingScroll: {
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
  },
  trendingCard: {
    width: TRENDING_CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginRight: TRENDING_GAP,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  trendImageWrap: {
    width: '100%',
    height: 110,
    position: 'relative',
    backgroundColor: Colors.surfaceHigh,
  },
  trendImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  trendPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondaryMuted,
  },
  trendDiscountBadge: {
    position: 'absolute',
    top: Spacing.xs + 2,
    left: Spacing.xs + 2,
    backgroundColor: Colors.danger,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  trendDiscountText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.white,
    fontFamily: Typography.fontFamily.bold,
  },
  trendBody: {
    padding: Spacing.sm,
    justifyContent: 'space-between',
  },
  trendCategory: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    fontFamily: Typography.fontFamily.bold,
  },
  trendTitle: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    marginTop: 2,
  },
  trendRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    marginTop: 4,
  },
  trendRatingVal: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  trendReviews: {
    fontSize: 9,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.regular,
  },
  trendFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: Spacing.sm,
  },
  trendPrice: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '800',
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
  },
  trendOriginalPrice: {
    fontSize: 9,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
    marginTop: 1,
    fontFamily: Typography.fontFamily.regular,
  },
  trendAddBtn: {
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.sm,
  },
});
