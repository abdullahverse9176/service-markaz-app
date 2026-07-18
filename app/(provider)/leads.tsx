import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useReceivedLeads, useRespondToLead } from '@/hooks/useLeads';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius } from '@/constants/theme';
import { formatLeadStatus, formatRelativeTime } from '@/utils/format';
import type { Lead } from '@/types/api';

export default function ProviderLeadsScreen() {
  const { data, isLoading, refetch } = useReceivedLeads();
  const respondMutation = useRespondToLead();
  const leads: Lead[] = (data?.data as any) ?? [];

  const handleRespond = (leadId: string, confirmed: 'yes' | 'no') => {
    respondMutation.mutate(
      { leadId, confirmed },
      { onError: (err: any) => Alert.alert('Error', err.message) }
    );
  };

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Received Leads</Text>
        <Text style={styles.subtitle}>{leads.length} total inquiries</Text>
      </View>

      <FlatList
        data={leads}
        keyExtractor={(l) => l._id}
        contentContainerStyle={styles.list}
        onRefresh={refetch}
        refreshing={false}
        renderItem={({ item }: { item: Lead }) => {
          const customer = typeof item.customer === 'object' ? item.customer as any : null;
          const isPending = item.status === 'pending' || item.status === 'awaiting_response';

          return (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{customer?.name?.charAt(0) ?? '?'}</Text>
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.customerName}>{customer?.name ?? 'Customer'}</Text>
                  <Text style={styles.customerPhone}>{customer?.phone ?? ''}</Text>
                </View>
                <View style={styles.statusWrap}>
                  <Text style={styles.statusText}>{formatLeadStatus(item.status)}</Text>
                </View>
              </View>

              <View style={styles.metaRow}>
                <Text style={styles.metaText}>Via {item.source} · {formatRelativeTime(item.createdAt)}</Text>
              </View>

              {/* Actions — only show if pending */}
              {isPending && (
                <View style={styles.actionRow}>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => handleRespond(item._id, 'yes')}
                    disabled={respondMutation.isPending}
                  >
                    <Text style={styles.acceptText}>✅ Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectBtn}
                    onPress={() => handleRespond(item._id, 'no')}
                    disabled={respondMutation.isPending}
                  >
                    <Text style={styles.rejectText}>❌ Reject</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyText}>No leads yet</Text>
            <Text style={styles.emptySubtext}>Customers who contact you will appear here</Text>
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
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: Colors.primaryMuted, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.primary },
  cardInfo: { flex: 1 },
  customerName: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.textPrimary },
  customerPhone: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  statusWrap: { backgroundColor: Colors.surfaceHigh, paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.full },
  statusText: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, fontWeight: '600' },
  metaRow: { marginBottom: Spacing.sm },
  metaText: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, textTransform: 'capitalize' },
  actionRow: { flexDirection: 'row', gap: Spacing.sm },
  acceptBtn: { flex: 1, backgroundColor: Colors.secondary + '22', borderRadius: BorderRadius.md, paddingVertical: Spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: Colors.secondary },
  acceptText: { color: Colors.secondary, fontWeight: '700', fontSize: Typography.fontSize.sm },
  rejectBtn: { flex: 1, backgroundColor: Colors.dangerMuted, borderRadius: BorderRadius.md, paddingVertical: Spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: Colors.danger },
  rejectText: { color: Colors.danger, fontWeight: '700', fontSize: Typography.fontSize.sm },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyEmoji: { fontSize: 48, marginBottom: Spacing.md },
  emptyText: { fontSize: Typography.fontSize.lg, fontWeight: '600', color: Colors.textPrimary },
  emptySubtext: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center' },
});
