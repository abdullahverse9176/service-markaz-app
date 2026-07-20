import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius, Shadow } from '@/constants/theme';

export const styles = StyleSheet.create({
  topRatedContainer: {
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
  topRatedScroll: {
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
  },
  topRatedCard: {
    width: 140,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginRight: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  trImageWrap: {
    width: '100%',
    height: 100,
    position: 'relative',
    backgroundColor: Colors.surfaceHigh,
  },
  trImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  trPlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondaryMuted,
  },
  trPlaceholderText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.secondary,
  },
  trVerifyBadge: {
    position: 'absolute',
    bottom: Spacing.xs,
    right: Spacing.xs,
    backgroundColor: Colors.primary,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  trBody: {
    padding: Spacing.sm,
  },
  trName: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  trCategory: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
    fontFamily: Typography.fontFamily.regular,
  },
  trRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 4,
  },
  trRatingVal: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  trReviewsCount: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  trDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  trFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trPrice: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
  },
  trStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
