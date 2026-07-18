import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, Image
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useBusinesses } from '@/hooks/useBusinesses';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius, Shadow } from '@/constants/theme';
import { formatRating, truncate } from '@/utils/format';
import type { Business } from '@/types/business';

export default function CustomerHomeScreen() {
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const { data, isLoading, refetch, isRefetching } = useBusinesses({
    search: activeSearch,
    sort: 'rating',
    limit: 20,
  });

  const businesses = data?.data?.businesses ?? [];

  const handleSearch = () => setActiveSearch(search);

  const renderItem = ({ item }: { item: Business }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/business/[id]', params: { id: item._id } })}
      activeOpacity={0.8}
    >
      {/* Banner / Profile image */}
      <View style={styles.cardImageWrap}>
        {item.profileImage ? (
          <Image source={{ uri: item.profileImage }} style={styles.cardImage} />
        ) : (
          <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
            <Text style={styles.placeholderText}>
              {item.name.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        {/* Availability badge */}
        <View style={[
          styles.badge,
          { backgroundColor: item.availability === 'Available' ? Colors.secondary : Colors.danger }
        ]}>
          <Text style={styles.badgeText}>{item.availability}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>

        <View style={styles.cardMeta}>
          <Text style={styles.metaText}>📍 {item.city}, {item.area}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.starText}>⭐ {formatRating(item.rating)}</Text>
            <Text style={styles.reviewText}>({item.reviewsCount})</Text>
          </View>
        </View>

        <Text style={styles.cardCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Service Markaz</Text>
        <Text style={styles.headerSubtitle}>Find trusted service providers</Text>

        {/* Search Bar */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search businesses, services..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Text style={styles.searchBtnText}>Go</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Business List */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading businesses...</Text>
        </View>
      ) : (
        <FlatList
          data={businesses}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No businesses found</Text>
              <Text style={styles.emptySubtext}>Try a different search term</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.surface,
    paddingTop: 60,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: Typography.fontSize['2xl'],
    fontWeight: '800',
    color: Colors.primary,
  },
  headerSubtitle: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  searchRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.base,
  },
  searchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    justifyContent: 'center',
  },
  searchBtnText: { color: Colors.white, fontWeight: '700' },
  listContent: { padding: Spacing.base, gap: Spacing.md },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  cardImageWrap: { position: 'relative' },
  cardImage: { width: '100%', height: 120 },
  cardImagePlaceholder: {
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: Typography.fontSize['4xl'],
    color: Colors.primary,
    fontWeight: '800',
  },
  badge: {
    position: 'absolute', top: Spacing.sm, right: Spacing.sm,
    paddingHorizontal: Spacing.sm, paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  badgeText: { color: Colors.white, fontSize: Typography.fontSize.xs, fontWeight: '700' },
  cardBody: { padding: Spacing.md },
  cardName: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.textPrimary },
  cardTitle: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.xs },
  cardMeta: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xs },
  metaText: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  starText: { fontSize: Typography.fontSize.xs, color: Colors.accent, fontWeight: '600' },
  reviewText: { fontSize: Typography.fontSize.xs, color: Colors.textMuted },
  cardCategory: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: '600',
    backgroundColor: Colors.primaryMuted,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
  },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 100 },
  loadingText: { color: Colors.textSecondary, marginTop: Spacing.sm },
  empty: { alignItems: 'center', paddingTop: 80 },
  emptyText: { color: Colors.textPrimary, fontSize: Typography.fontSize.lg, fontWeight: '600' },
  emptySubtext: { color: Colors.textSecondary, marginTop: Spacing.xs },
});
