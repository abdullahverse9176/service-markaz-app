import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useMyBusiness } from '@/hooks/useBusinesses';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius } from '@/constants/theme';
import { formatRating } from '@/utils/format';

export default function ProviderBusinessScreen() {
  const { data, isLoading } = useMyBusiness();
  const business = data?.data;

  if (isLoading) {
    return <View style={styles.centered}><ActivityIndicator size="large" color={Colors.primary} /></View>;
  }

  if (!business) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noBizEmoji}>🏢</Text>
        <Text style={styles.noBizTitle}>No Business Listing</Text>
        <Text style={styles.noBizSubtext}>Create your business profile to start receiving leads</Text>
        <TouchableOpacity style={styles.createBtn}>
          <Text style={styles.createBtnText}>Create Business Listing</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const sections = [
    {
      title: 'Basic Info',
      rows: [
        { label: 'Business Name', value: business.name },
        { label: 'Title', value: business.title },
        { label: 'Category', value: business.category },
        { label: 'City', value: business.city },
        { label: 'Area', value: business.area },
      ],
    },
    {
      title: 'Contact',
      rows: [
        { label: 'Phone', value: business.phone },
        { label: 'WhatsApp', value: business.whatsapp || 'Not set' },
        { label: 'Email', value: business.email || 'Not set' },
      ],
    },
    {
      title: 'Stats',
      rows: [
        { label: 'Rating', value: `⭐ ${formatRating(business.rating)} (${business.reviewsCount} reviews)` },
        { label: 'Experience', value: `${business.experience} years` },
        { label: 'Projects', value: String(business.completedProjects) },
        { label: 'Total Views', value: String(business.viewCount) },
      ],
    },
    {
      title: 'Pricing',
      rows: [
        { label: 'Callout Fee', value: business.pricing.calloutFee || 'Not set' },
        { label: 'Hourly Rate', value: business.pricing.hourlyRate || 'Not set' },
        { label: 'Min Charge', value: business.pricing.minCharge || 'Not set' },
      ],
    },
  ];

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Business</Text>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Services */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Services ({business.services.length})</Text>
        <View style={styles.tagsWrap}>
          {business.services.map((s, i) => (
            <View key={i} style={styles.tag}>
              <Text style={styles.tagText}>{s}</Text>
            </View>
          ))}
        </View>
      </View>

      {sections.map(({ title, rows }) => (
        <View key={title} style={styles.section}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {rows.map(({ label, value }) => (
            <View key={label} style={styles.row}>
              <Text style={styles.rowLabel}>{label}</Text>
              <Text style={styles.rowValue} numberOfLines={2}>{value}</Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.base, paddingTop: 60 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  noBizEmoji: { fontSize: 56, marginBottom: Spacing.md },
  noBizTitle: { fontSize: Typography.fontSize.xl, fontWeight: '600', color: Colors.textPrimary },
  noBizSubtext: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.xs, marginBottom: Spacing.xl },
  createBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.md, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
  createBtnText: { color: Colors.white, fontWeight: '700', fontSize: Typography.fontSize.md },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
  title: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  editBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs },
  editBtnText: { color: Colors.white, fontWeight: '600', fontSize: Typography.fontSize.sm },
  section: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.textSecondary,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  rowLabel: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm, flex: 1 },
  rowValue: { color: Colors.textPrimary, fontWeight: '500', fontSize: Typography.fontSize.sm, flex: 1.5, textAlign: 'right' },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs, padding: Spacing.md },
  tag: {
    backgroundColor: Colors.primaryMuted, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs,
  },
  tagText: { color: Colors.primary, fontSize: Typography.fontSize.xs, fontWeight: '600' },
});
