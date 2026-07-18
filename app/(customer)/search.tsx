import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useBusinesses } from '@/hooks/useBusinesses';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius } from '@/constants/theme';
import { formatRating } from '@/utils/format';
import type { Business } from '@/types/business';

const SORT_OPTIONS = [
  { label: '⭐ Rating', value: 'rating' as const },
  { label: '🆕 Newest', value: 'newest' as const },
  { label: '💼 Experience', value: 'experience' as const },
];

export default function SearchScreen() {
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [sort, setSort] = useState<'rating' | 'newest' | 'experience'>('rating');
  const [verified, setVerified] = useState(false);
  const [available, setAvailable] = useState(false);

  const { data, isLoading } = useBusinesses({
    search: activeSearch, sort, verified, available, limit: 30,
  });

  const businesses = data?.data?.businesses ?? [];
  const total = data?.data?.total ?? 0;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search services, businesses..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={() => setActiveSearch(search)}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchBtn} onPress={() => setActiveSearch(search)}>
            <Text style={styles.searchBtnText}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Sort */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {SORT_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={[styles.chip, sort === opt.value && styles.chipActive]}
              onPress={() => setSort(opt.value)}
            >
              <Text style={[styles.chipText, sort === opt.value && styles.chipTextActive]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.chip, verified && styles.chipActive]}
            onPress={() => setVerified(!verified)}
          >
            <Text style={[styles.chipText, verified && styles.chipTextActive]}>✅ Verified</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, available && styles.chipActive]}
            onPress={() => setAvailable(!available)}
          >
            <Text style={[styles.chipText, available && styles.chipTextActive]}>🟢 Available</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Results */}
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={businesses}
          keyExtractor={(b) => b._id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            activeSearch ? (
              <Text style={styles.resultCount}>{total} results for "{activeSearch}"</Text>
            ) : null
          }
          renderItem={({ item }: { item: Business }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push({ pathname: '/business/[id]', params: { id: item._id } })}
            >
              <View style={styles.rowLeft}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
                </View>
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.rowName}>{item.name}</Text>
                <Text style={styles.rowTitle}>{item.title}</Text>
                <Text style={styles.rowMeta}>📍 {item.city} · ⭐ {formatRating(item.rating)} · {item.category}</Text>
              </View>
              <View style={[styles.dot, { backgroundColor: item.availability === 'Available' ? Colors.secondary : Colors.danger }]} />
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No results found</Text>
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
    paddingBottom: Spacing.sm,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  searchRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  searchInput: {
    flex: 1, backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
    color: Colors.textPrimary, fontSize: Typography.fontSize.base,
  },
  searchBtn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, justifyContent: 'center' },
  searchBtnText: { fontSize: Typography.fontSize.md },
  chipRow: { flexDirection: 'row' },
  chip: {
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full, borderWidth: 1, borderColor: Colors.border,
    marginRight: Spacing.xs, backgroundColor: Colors.background,
  },
  chipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  chipText: { fontSize: Typography.fontSize.xs, color: Colors.textSecondary, fontWeight: '500' },
  chipTextActive: { color: Colors.white },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  list: { padding: Spacing.base, gap: Spacing.sm },
  resultCount: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm, marginBottom: Spacing.sm },
  row: {
    flexDirection: 'row', alignItems: 'center', gap: Spacing.md,
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    padding: Spacing.md, borderWidth: 1, borderColor: Colors.border,
  },
  rowLeft: {},
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primaryMuted, justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: Typography.fontSize.xl, fontWeight: '800', color: Colors.primary },
  rowBody: { flex: 1 },
  rowName: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.textPrimary },
  rowTitle: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  rowMeta: { fontSize: Typography.fontSize.xs, color: Colors.textMuted, marginTop: 2 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyText: { color: Colors.textSecondary, fontSize: Typography.fontSize.md },
});
