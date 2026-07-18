import { View, Text, TouchableOpacity, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { useLocation } from '@/hooks/useLocation';
import { useBusinesses } from '@/hooks/useBusinesses';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius } from '@/constants/theme';
import { formatRating, formatDistance } from '@/utils/format';
import type { Business } from '@/types/business';

export default function NearbyScreen() {
  const { lat, lng, loading, error, requestLocation } = useLocation();

  const { data, isLoading } = useBusinesses(
    lat && lng ? { lat, lng, limit: 20 } : {}
  );

  const businesses = data?.data?.businesses ?? [];

  if (!lat || !lng) {
    return (
      <View style={styles.root}>
        <View style={styles.centered}>
          <Text style={styles.emoji}>📍</Text>
          <Text style={styles.title}>Near Me</Text>
          <Text style={styles.subtitle}>
            Allow location access to find service providers within 50 km of you
          </Text>
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={requestLocation}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.btnText}>Allow Location</Text>
            )}
          </TouchableOpacity>
          {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📍 Near Me</Text>
        <Text style={styles.headerSub}>Showing providers within 50 km</Text>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Finding nearby providers...</Text>
        </View>
      ) : (
        <FlatList
          data={businesses}
          keyExtractor={(b) => b._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }: { item: Business }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push({ pathname: '/business/[id]', params: { id: item._id } })}
            >
              <View style={styles.cardLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                </View>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardMeta}>📍 {item.area}, {item.city}</Text>
                <Text style={styles.cardMeta}>⭐ {formatRating(item.rating)} · {item.category}</Text>
              </View>
              <View style={styles.cardRight}>
                <Text style={styles.distanceText}>{formatDistance(item.distanceKm)}</Text>
                <View style={[styles.dot, {
                  backgroundColor: item.availability === 'Available' ? Colors.secondary : Colors.danger
                }]} />
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No providers found nearby</Text>
              <Text style={styles.emptySubtext}>Try expanding your search or browse all</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  emoji: { fontSize: 64, marginBottom: Spacing.lg },
  title: { fontSize: Typography.fontSize['2xl'], fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm, textAlign: 'center' },
  subtitle: { fontSize: Typography.fontSize.base, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 22 },
  btn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.md, paddingVertical: Spacing.md, paddingHorizontal: Spacing['2xl'] },
  btnDisabled: { opacity: 0.6 },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: Typography.fontSize.md },
  errorText: { color: Colors.danger, marginTop: Spacing.md, textAlign: 'center' },
  header: {
    backgroundColor: Colors.surface, paddingTop: 60, paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  headerTitle: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  headerSub: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  loadingText: { color: Colors.textSecondary, marginTop: Spacing.sm },
  list: { padding: Spacing.base, gap: Spacing.sm },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  cardLeft: {},
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primaryMuted, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.primary },
  cardBody: { flex: 1 },
  cardName: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.textPrimary },
  cardTitle: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  cardMeta: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  cardRight: { alignItems: 'flex-end', gap: Spacing.xs },
  distanceText: { fontSize: Typography.fontSize.xs, color: Colors.primary, fontWeight: '600' },
  dot: { width: 10, height: 10, borderRadius: 5 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: Colors.textPrimary, fontSize: Typography.fontSize.md, fontWeight: '600' },
  emptySubtext: { color: Colors.textSecondary, marginTop: Spacing.xs },
});
