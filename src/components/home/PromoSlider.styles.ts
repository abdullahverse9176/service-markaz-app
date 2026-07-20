import { StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius } from '@/constants/theme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const styles = StyleSheet.create({
  promoContainer: {
    marginBottom: Spacing.xl,
  },
  promoScroll: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  promoCard: {
    width: SCREEN_WIDTH - Spacing.base * 2,
    height: 140,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
    zIndex: 2,
  },
  promoTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
    fontFamily: Typography.fontFamily.bold,
  },
  promoDesc: {
    fontSize: Typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: Spacing.md,
    lineHeight: 16,
    fontFamily: Typography.fontFamily.regular,
  },
  promoBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  promoBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
  },
  promoIconWrap: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  pagerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: 6,
  },
  pagerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  pagerDotActive: {
    backgroundColor: Colors.primary,
    width: 12,
  },
});
export { SCREEN_WIDTH };
