import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginLeft: 4,
    fontFamily: Typography.fontFamily.bold,
  },
  changeLocationLink: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },
});
