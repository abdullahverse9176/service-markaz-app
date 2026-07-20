import { StyleSheet, Platform } from 'react-native';
import { Colors } from '@/constants/colors';
import { Spacing, Typography } from '@/constants/theme';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.surface,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    justifyContent: 'space-between',
  },
  backBtn: {
    padding: Spacing.xs,
  },
  headerTitleWrap: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  headerTitle: {
    fontSize: Typography.fontSize.md + 1,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
    fontFamily: Typography.fontFamily.regular,
  },
  filterAdjustBtn: {
    padding: Spacing.xs,
  },
});
