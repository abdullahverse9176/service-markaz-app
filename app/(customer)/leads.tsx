import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useMyLeads } from '@/hooks/useLeads';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius } from '@/constants/theme';
import { formatLeadStatus, formatRelativeTime } from '@/utils/format';
import type { Lead } from '@/types/api';

const STATUS_COLOR: Record<string, string> = {
  pending: Colors.statusPending,
  awaiting_response: Colors.primary,
  confirmed: Colors.statusConfirmed,
  rejected: Colors.statusRejected,
  disputed: Colors.statusDisputed,
};

export default function CustomerLeadsScreen() {
  const { data, isLoading, refetch } = useMyLeads();
  const leads: Lead[] = (data?.data as any) ?? [];

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>My Leads</Text>
        <Text style={styles.subtitle}>Businesses you've contacted</Text>
      </View>

      <FlatList
        data={leads}
        keyExtractor={(l) => l._id}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={false}
        renderItem={({ item }: { item: Lead }) => {
          const biz = typeof item.business === 'object' ? item.business : null;
          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {biz ? (biz as any).name?.charAt(0) ?? '?' : '?'}
                  </Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.bizName}>
                    {biz ? (biz as any).name : 'Business'}
                  </Text>
                  <Text style={styles.bizTitle}>
                    {biz ? (biz as any).title : ''}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: STATUS_COLOR[item.status] + '22' }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLOR[item.status] }]}>
                    {formatLeadStatus(item.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooter}>
                <Text style={styles.sourceText}>Via {item.source}</Text>
                <Text style={styles.dateText}>{formatRelativeTime(item.createdAt)}</Text>
              </View>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📋</Text>
            <Text style={styles.emptyText}>No leads yet</Text>
            <Text style={styles.emptySubtext}>Contact a business to see your leads here</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    backgroundColor: Colors.surface, paddingTop: 60, paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  list: { padding: Spacing.base, gap: Spacing.sm },
  card: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.md },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primaryMuted, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.primary },
  cardInfo: { flex: 1 },
  bizName: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.textPrimary },
  bizTitle: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  statusBadge: { paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.full },
  statusText: { fontSize: Typography.fontSize.xs, fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  sourceText: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, textTransform: 'capitalize' },
  dateText: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { fontSize: Typography.fontSize.lg, fontWeight: '600', color: Colors.textPrimary },
  emptySubtext: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center' },
});
