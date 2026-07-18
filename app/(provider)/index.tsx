import {
  View, Text, StyleSheet, Switch, TouchableOpacity,
  ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { useMyBusiness, useToggleAvailability } from '@/hooks/useBusinesses';
import { useReceivedLeads } from '@/hooks/useLeads';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius, Shadow } from '@/constants/theme';
import { formatRating } from '@/utils/format';

export default function ProviderDashboard() {
  const { user } = useAuthStore();
  const { data: bizData, isLoading: bizLoading } = useMyBusiness();
  const { data: leadsData } = useReceivedLeads();
  const toggleMutation = useToggleAvailability();

  const business = bizData?.data;
  const leads: any[] = (leadsData?.data as any) ?? [];
  const pendingLeads = leads.filter((l) => l.status === 'pending').length;

  const handleToggle = (val: boolean) => {
    const newVal = val ? 'Available' : 'Unavailable';
    toggleMutation.mutate(newVal, {
      onError: (err: any) => Alert.alert('Error', err.message),
    });
  };

  if (bizLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      {/* Greeting */}
      <View style={styles.greeting}>
        <Text style={styles.greetingText}>Hello, {user?.name?.split(' ')[0]} 👋</Text>
        <Text style={styles.greetingSubtext}>Provider Dashboard</Text>
      </View>

      {business ? (
        <>
          {/* Business Card */}
          <View style={styles.bizCard}>
            <Text style={styles.bizName}>{business.name}</Text>
            <Text style={styles.bizTitle}>{business.title}</Text>
            <Text style={styles.bizCity}>📍 {business.city}, {business.area}</Text>

            {/* Availability Toggle */}
            <View style={styles.toggleRow}>
              <Text style={styles.toggleLabel}>
                {business.availability === 'Available' ? '🟢 Available' : '🔴 Unavailable'}
              </Text>
              <Switch
                value={business.availability === 'Available'}
                onValueChange={handleToggle}
                trackColor={{ false: Colors.danger, true: Colors.secondary }}
                thumbColor={Colors.white}
                disabled={toggleMutation.isPending}
              />
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {[
              { label: 'Rating', value: formatRating(business.rating), icon: '⭐' },
              { label: 'Reviews', value: String(business.reviewsCount), icon: '💬' },
              { label: 'Views', value: String(business.viewCount), icon: '👁️' },
              { label: 'Pending Leads', value: String(pendingLeads), icon: '📨' },
            ].map(({ label, value, icon }) => (
              <View key={label} style={styles.statCard}>
                <Text style={styles.statIcon}>{icon}</Text>
                <Text style={styles.statValue}>{value}</Text>
                <Text style={styles.statLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Subscription Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Verification</Text>
              <Text style={[styles.rowValue, { color: business.verification ? Colors.secondary : Colors.textMuted }]}>
                {business.verification ? '✅ Verified' : 'Pending'}
              </Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.rowLabel}>Business Status</Text>
              <Text style={styles.rowValue}>{business.status}</Text>
            </View>
          </View>
        </>
      ) : (
        <View style={styles.noBiz}>
          <Text style={styles.noBizEmoji}>🏢</Text>
          <Text style={styles.noBizText}>No business listing yet</Text>
          <Text style={styles.noBizSubtext}>Go to "My Business" tab to create your listing</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.base, paddingTop: 60 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  greeting: { marginBottom: Spacing.xl },
  greetingText: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.textPrimary },
  greetingSubtext: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  bizCard: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.xl,
    padding: Spacing.xl, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg,
    ...Shadow.md,
  },
  bizName: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  bizTitle: { fontSize: Typography.fontSize.base, color: Colors.textSecondary, marginBottom: Spacing.xs },
  bizCity: { fontSize: Typography.fontSize.sm, color: Colors.textMuted, marginBottom: Spacing.lg },
  toggleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  toggleLabel: { fontSize: Typography.fontSize.md, fontWeight: '600', color: Colors.textPrimary },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  statCard: {
    flex: 1, minWidth: '45%', backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg, padding: Spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.border,
  },
  statIcon: { fontSize: 28, marginBottom: Spacing.xs },
  statValue: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.textPrimary },
  statLabel: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  section: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.textSecondary,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  rowLabel: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm },
  rowValue: { color: Colors.textPrimary, fontWeight: '500', fontSize: Typography.fontSize.sm },
  noBiz: { alignItems: 'center', paddingTop: 80 },
  noBizEmoji: { fontSize: 56, marginBottom: Spacing.md },
  noBizText: { fontSize: Typography.fontSize.xl, fontWeight: '600', color: Colors.textPrimary },
  noBizSubtext: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center' },
});
