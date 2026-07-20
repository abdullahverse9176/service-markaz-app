import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius, Shadow } from '@/constants/theme';

export const styles = StyleSheet.create({
  dualCTAWrap: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  ctaBoxLeft: {
    flex: 1,
    backgroundColor: '#E6F6F0',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    justifyContent: 'space-between',
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#C2EADB',
    ...Shadow.sm,
  },
  ctaBoxRight: {
    flex: 1,
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    justifyContent: 'space-between',
    minHeight: 140,
    ...Shadow.sm,
  },
  ctaTitle: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: '800',
    color: Colors.secondary,
    fontFamily: Typography.fontFamily.bold,
  },
  ctaDesc: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    lineHeight: 13,
    fontFamily: Typography.fontFamily.regular,
  },
  ctaBtn: {
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  ctaBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.white,
    fontFamily: Typography.fontFamily.bold,
  },
});
