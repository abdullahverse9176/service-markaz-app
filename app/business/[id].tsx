import {
  View, Text, ScrollView, StyleSheet, Image,
  TouchableOpacity, Linking, Alert, ActivityIndicator
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useBusiness } from '@/hooks/useBusinesses';
import { useCreateLead } from '@/hooks/useLeads';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius, Shadow } from '@/constants/theme';
import { formatRating, formatRelativeTime } from '@/utils/format';

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading } = useBusiness(id);
  const createLeadMutation = useCreateLead();
  const { isAuthenticated, user } = useAuthStore();

  const business = data?.data;

  const handleCall = () => {
    if (!business?.phone) return;
    trackLead('call');
    Linking.openURL(`tel:${business.phone}`);
  };

  const handleWhatsApp = () => {
    if (!business?.whatsapp && !business?.phone) return;
    const number = (business.whatsapp || business.phone).replace(/[^0-9]/g, '');
    trackLead('whatsapp');
    Linking.openURL(`https://wa.me/${number}`);
  };

  const handleInquiry = () => {
    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'Please sign in to send an inquiry', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign In', onPress: () => router.push('/(auth)/login') },
      ]);
      return;
    }
    trackLead('form');
    Alert.alert('Inquiry Sent!', 'Your inquiry has been sent to this business.');
  };

  const trackLead = (source: 'call' | 'whatsapp' | 'form') => {
    if (!isAuthenticated || !business) return;
    createLeadMutation.mutate({ businessId: business._id, source });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Business not found</Text>
        <TouchableOpacity onPress={() => router.back()}><Text style={styles.backLink}>← Go Back</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerWrap}>
          {business.bannerImage ? (
            <Image source={{ uri: business.bannerImage }} style={styles.banner} />
          ) : (
            <View style={[styles.banner, styles.bannerPlaceholder]} />
          )}
          {/* Back button */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            {business.profileImage ? (
              <Image source={{ uri: business.profileImage }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatar, styles.avatarPlaceholder]}>
                <Text style={styles.avatarText}>{business.name.charAt(0)}</Text>
              </View>
            )}
            <View style={styles.profileInfo}>
              <Text style={styles.bizName}>{business.name}</Text>
              <Text style={styles.bizTitle}>{business.title}</Text>
              <View style={styles.badgeRow}>
                {business.verification && (
                  <View style={styles.verifiedBadge}>
                    <Text style={styles.verifiedText}>✅ Verified</Text>
                  </View>
                )}
                <View style={[
                  styles.availBadge,
                  { backgroundColor: business.availability === 'Available' ? Colors.secondary + '22' : Colors.dangerMuted }
                ]}>
                  <Text style={[
                    styles.availText,
                    { color: business.availability === 'Available' ? Colors.secondary : Colors.danger }
                  ]}>
                    {business.availability}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Rating & Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statValue}>⭐ {formatRating(business.rating)}</Text>
              <Text style={styles.statLabel}>{business.reviewsCount} reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{business.experience}y</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statValue}>{business.completedProjects}</Text>
              <Text style={styles.statLabel}>Projects</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Location */}
          <InfoSection title="📍 Location">
            <Text style={styles.infoText}>{business.area}, {business.city}</Text>
            {business.serviceAreas.length > 0 && (
              <Text style={styles.infoSubText}>Also serves: {business.serviceAreas.join(', ')}</Text>
            )}
          </InfoSection>

          {/* About */}
          {business.about ? (
            <InfoSection title="About">
              <Text style={styles.infoText}>{business.about}</Text>
            </InfoSection>
          ) : null}

          {/* Services */}
          <InfoSection title="Services">
            <View style={styles.tagsWrap}>
              {business.services.map((s, i) => (
                <View key={i} style={styles.tag}>
                  <Text style={styles.tagText}>{s}</Text>
                </View>
              ))}
            </View>
          </InfoSection>

          {/* Pricing */}
          {(business.pricing.calloutFee || business.pricing.hourlyRate || business.pricing.minCharge) && (
            <InfoSection title="💰 Pricing">
              {business.pricing.calloutFee && <Text style={styles.infoText}>Callout: {business.pricing.calloutFee}</Text>}
              {business.pricing.hourlyRate && <Text style={styles.infoText}>Per hour: {business.pricing.hourlyRate}</Text>}
              {business.pricing.minCharge && <Text style={styles.infoText}>Min charge: {business.pricing.minCharge}</Text>}
            </InfoSection>
          )}

          {/* Specializations */}
          {business.specializations.length > 0 && (
            <InfoSection title="Specializations">
              <View style={styles.tagsWrap}>
                {business.specializations.map((s, i) => (
                  <View key={i} style={[styles.tag, { backgroundColor: Colors.surface }]}>
                    <Text style={[styles.tagText, { color: Colors.textSecondary }]}>{s}</Text>
                  </View>
                ))}
              </View>
            </InfoSection>
          )}

          {/* Response Time */}
          {business.responseTime && (
            <InfoSection title="⏱️ Response Time">
              <Text style={styles.infoText}>{business.responseTime}</Text>
            </InfoSection>
          )}
        </View>
      </ScrollView>

      {/* Fixed Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={[styles.actionBtn, styles.callBtn]} onPress={handleCall}>
          <Text style={styles.actionBtnText}>📞 Call</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.waBtn]} onPress={handleWhatsApp}>
          <Text style={styles.actionBtnText}>💬 WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.inquiryBtn]} onPress={handleInquiry}>
          <Text style={styles.actionBtnText}>📩 Inquiry</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InfoSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.wrap}>
      <Text style={sectionStyles.title}>{title}</Text>
      {children}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.md, marginBottom: Spacing.sm,
    borderWidth: 1, borderColor: Colors.border,
  },
  title: { fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.sm },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: Colors.textPrimary, fontSize: Typography.fontSize.lg, marginBottom: Spacing.md },
  backLink: { color: Colors.primary, fontSize: Typography.fontSize.md },
  bannerWrap: { position: 'relative' },
  banner: { width: '100%', height: 200 },
  bannerPlaceholder: { backgroundColor: Colors.surface },
  backBtn: {
    position: 'absolute', top: 50, left: Spacing.base,
    backgroundColor: Colors.overlay, width: 40, height: 40,
    borderRadius: 20, justifyContent: 'center', alignItems: 'center',
  },
  backBtnText: { color: Colors.white, fontSize: 20, fontWeight: '700' },
  profileCard: {
    backgroundColor: Colors.surface, margin: Spacing.base,
    borderRadius: BorderRadius.xl, padding: Spacing.lg,
    borderWidth: 1, borderColor: Colors.border, ...Shadow.md,
  },
  profileRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  avatar: { width: 72, height: 72, borderRadius: 36 },
  avatarPlaceholder: {
    backgroundColor: Colors.primaryMuted, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: Typography.fontSize['2xl'], fontWeight: '800', color: Colors.primary },
  profileInfo: { flex: 1, justifyContent: 'center' },
  bizName: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  bizTitle: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xs },
  badgeRow: { flexDirection: 'row', gap: Spacing.xs },
  verifiedBadge: {
    backgroundColor: Colors.secondary + '22', paddingHorizontal: Spacing.sm, paddingVertical: 2,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.secondary,
  },
  verifiedText: { color: Colors.secondary, fontSize: Typography.fontSize.xs, fontWeight: '700' },
  availBadge: {
    paddingHorizontal: Spacing.sm, paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  availText: { fontSize: Typography.fontSize.xs, fontWeight: '700' },
  statsRow: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    paddingTop: Spacing.md, borderTopWidth: 1, borderTopColor: Colors.border,
  },
  stat: { alignItems: 'center' },
  statValue: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.textPrimary },
  statLabel: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary },
  statDivider: { width: 1, height: 40, backgroundColor: Colors.border },
  content: { paddingHorizontal: Spacing.base, paddingBottom: 100 },
  infoText: { fontSize: Typography.fontSize.sm, color: Colors.textPrimary, lineHeight: 22 },
  infoSubText: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, marginTop: Spacing.xs },
  tagsWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  tag: {
    backgroundColor: Colors.primaryMuted, borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs,
  },
  tagText: { color: Colors.primary, fontSize: Typography.fontSize.xs, fontWeight: '600' },
  actionBar: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    flexDirection: 'row', gap: Spacing.sm,
    backgroundColor: Colors.surface, padding: Spacing.base,
    borderTopWidth: 1, borderTopColor: Colors.border,
    paddingBottom: 30, // safe area
  },
  actionBtn: { flex: 1, borderRadius: BorderRadius.md, paddingVertical: Spacing.md, alignItems: 'center' },
  callBtn: { backgroundColor: Colors.secondary },
  waBtn: { backgroundColor: '#25D366' },
  inquiryBtn: { backgroundColor: Colors.primary },
  actionBtnText: { color: Colors.white, fontWeight: '700', fontSize: Typography.fontSize.sm },
});
