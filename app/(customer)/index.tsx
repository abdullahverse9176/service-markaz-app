import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, Image, ScrollView
} from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius, Shadow } from '@/constants/theme';
import { formatRating, getInitials } from '@/utils/format';
import type { Business } from '@/types/business';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
  { name: 'All', icon: 'grid-outline' as const },
  { name: 'AC Repair', icon: 'snow-outline' as const },
  { name: 'Electrician', icon: 'flash-outline' as const },
  { name: 'Plumber', icon: 'build-outline' as const },
  { name: 'Carpenter', icon: 'construct-outline' as const },
  { name: 'Cleaning', icon: 'sparkles-outline' as const },
  { name: 'Painter', icon: 'color-palette-outline' as const },
  { name: 'Tutor', icon: 'book-outline' as const },
  { name: 'Beautician', icon: 'cut-outline' as const },
];

export default function CustomerHomeScreen() {
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { user, isAuthenticated } = useAuthStore();

  const { data, isLoading, refetch, isRefetching } = useBusinesses({
    search: activeSearch,
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    sort: 'rating',
    limit: 20,
  });

  const businesses = data?.data?.businesses ?? [];

  const handleSearch = () => setActiveSearch(search);

  const selectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Top Welcome Bar */}
      <View style={styles.welcomeRow}>
        <View>
          <Text style={styles.greetingText}>
            {isAuthenticated ? `Salam, ${user?.name.split(' ')[0]} 👋` : 'Salam, Guest 👋'}
          </Text>
          <Text style={styles.welcomeSubtitle}>Find trusted experts near you</Text>
        </View>
        <TouchableOpacity 
          style={styles.avatarButton}
          onPress={() => router.push(isAuthenticated ? '/(customer)/profile' : '/(auth)/login')}
          activeOpacity={0.8}
        >
          {isAuthenticated ? (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(user?.name ?? '')}</Text>
            </View>
          ) : (
            <View style={[styles.avatar, styles.guestAvatar]}>
              <Ionicons name="person-outline" size={20} color={Colors.textSecondary} />
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Search Input Box */}
      <View style={styles.searchBox}>
        <Ionicons name="search-outline" size={20} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="What service are you looking for?"
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => { setSearch(''); setActiveSearch(''); }} style={styles.clearSearchBtn}>
            <Ionicons name="close" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Promo Banner Card */}
      <View style={styles.promoCard}>
        <View style={styles.promoContent}>
          <Text style={styles.promoTitle}>Verified Professionals</Text>
          <Text style={styles.promoDesc}>Get up to 20% off on your first service inquiry today!</Text>
          <TouchableOpacity style={styles.promoBtn} onPress={() => router.push('/(customer)/search')}>
            <Text style={styles.promoBtnText}>Browse Services</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.promoIconWrap}>
          <Ionicons name="sparkles" size={48} color="rgba(255, 255, 255, 0.2)" />
        </View>
      </View>

      {/* Categories Row */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Categories</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <TouchableOpacity
              key={cat.name}
              style={[styles.categoryChip, isActive && styles.categoryChipActive]}
              onPress={() => selectCategory(cat.name)}
              activeOpacity={0.8}
            >
              <Ionicons 
                name={cat.icon} 
                size={16} 
                color={isActive ? Colors.white : Colors.primary} 
                style={styles.categoryIcon} 
              />
              <Text style={[styles.categoryName, isActive && styles.categoryNameActive]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Recommended Providers Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {selectedCategory === 'All' ? 'Top Rated Providers' : `${selectedCategory} Experts`}
        </Text>
      </View>
    </View>
  );

  const renderItem = ({ item }: { item: Business }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push({ pathname: '/business/[id]', params: { id: item._id } })}
      activeOpacity={0.9}
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
        
        {/* Availability Badge */}
        <View style={[
          styles.badge,
          { backgroundColor: item.availability === 'Available' ? Colors.primaryMuted : Colors.dangerMuted }
        ]}>
          <View style={[
            styles.statusDot, 
            { backgroundColor: item.availability === 'Available' ? Colors.primary : Colors.danger }
          ]} />
          <Text style={[
            styles.badgeText,
            { color: item.availability === 'Available' ? Colors.primary : Colors.danger }
          ]}>
            {item.availability}
          </Text>
        </View>

        {/* Verification Checkmark */}
        {item.verification && (
          <View style={styles.verifiedIconWrap}>
            <Ionicons name="checkmark" size={12} color={Colors.white} />
          </View>
        )}
      </View>

      {/* Body Details */}
      <View style={styles.cardBody}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.cardPrice}>
            {item.pricing?.calloutFee && item.pricing.calloutFee !== '0' 
              ? `Rs. ${item.pricing.calloutFee}` 
              : 'Free Visit'}
          </Text>
        </View>
        
        <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>

        <View style={styles.cardDivider} />

        <View style={styles.cardMeta}>
          <View style={styles.locationWrap}>
            <Ionicons name="location-outline" size={12} color={Colors.textMuted} style={styles.metaIcon} />
            <Text style={styles.metaLocation} numberOfLines={1}>{item.area}, {item.city}</Text>
          </View>
          
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color={Colors.accent} style={styles.metaIcon} />
            <Text style={styles.starText}>{formatRating(item.rating)}</Text>
            <Text style={styles.reviewText}>({item.reviewsCount})</Text>
          </View>
        </View>

        <View style={styles.cardFooterRow}>
          <Text style={styles.cardCategory}>{item.category}</Text>
          {item.experience > 0 && (
            <Text style={styles.experienceText}>{item.experience} Years Exp.</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.root}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          {renderHeader()}
          <View style={styles.centered}>
            <ActivityIndicator size="large" color={Colors.primary} />
            <Text style={styles.loadingText}>Loading experts...</Text>
          </View>
        </View>
      ) : (
        <FlatList
          data={businesses}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          ListHeaderComponent={renderHeader()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={Colors.primary}
              colors={[Colors.primary]}
              progressBackgroundColor={Colors.surface}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={40} color={Colors.textMuted} style={styles.emptyIcon} />
              <Text style={styles.emptyText}>No specialists found</Text>
              <Text style={styles.emptySubtext}>Try selecting another category or check your spelling.</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1 },
  headerContainer: {
    paddingTop: 55,
    paddingHorizontal: Spacing.base,
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  greetingText: {
    fontSize: Typography.fontSize['xl'],
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  welcomeSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatar: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestAvatar: {
    backgroundColor: Colors.surfaceHigh,
  },
  avatarText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: Typography.fontSize.xs,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
    marginBottom: Spacing.lg,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.sm,
    height: '100%',
  },
  clearSearchBtn: {
    padding: Spacing.xs,
  },
  promoCard: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
    position: 'relative',
    overflow: 'hidden',
  },
  promoContent: {
    flex: 1,
    zIndex: 2,
  },
  promoTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    color: Colors.white,
    marginBottom: 4,
  },
  promoDesc: {
    fontSize: Typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: Spacing.md,
    lineHeight: 16,
  },
  promoBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
  },
  promoBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: Typography.fontSize.xs,
  },
  promoIconWrap: {
    position: 'absolute',
    right: 15,
    bottom: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  categoriesScroll: {
    paddingBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.full,
    marginRight: 6,
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryIcon: {
    marginRight: 6,
  },
  categoryName: {
    color: Colors.textSecondary,
    fontWeight: '600',
    fontSize: Typography.fontSize.xs,
  },
  categoryNameActive: {
    color: Colors.white,
  },
  listContent: {
    paddingBottom: 40,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.base,
    overflow: 'hidden',
  },
  cardImageWrap: {
    position: 'relative',
    height: 130,
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardImagePlaceholder: {
    backgroundColor: Colors.surfaceHigh,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: Typography.fontSize['4xl'],
    color: Colors.primaryLight,
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '700',
  },
  verifiedIconWrap: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: Spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardName: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  cardPrice: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '800',
    color: Colors.primary,
  },
  cardTitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  locationWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: Spacing.sm,
  },
  metaIcon: {
    marginRight: 4,
  },
  metaLocation: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textPrimary,
    fontWeight: '700',
    marginLeft: 2,
  },
  reviewText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    marginLeft: 2,
  },
  cardFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardCategory: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: '700',
    backgroundColor: Colors.primaryMuted,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.md,
  },
  experienceText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
  },
  loadingText: {
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.xs,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    marginBottom: Spacing.sm,
  },
  emptyText: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
  },
  emptySubtext: {
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
    lineHeight: 16,
    fontSize: Typography.fontSize.xs,
  },
});
