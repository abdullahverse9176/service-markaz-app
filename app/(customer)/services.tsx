import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, ActivityIndicator, Image, Linking, Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useLocation } from '@/hooks/useLocation';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius, Shadow } from '@/constants/theme';
import { formatRating } from '@/utils/format';
import type { Business } from '@/types/business';
import { Ionicons } from '@expo/vector-icons';

const DUMMY_PROVIDERS: Business[] = [
  {
    _id: 'dummy-1',
    owner: 'owner-1',
    name: 'Ali Electric Works',
    email: 'ali@example.com',
    phone: '+923001234567',
    whatsapp: '+923001234567',
    title: 'Senior Electrician Specialist',
    category: 'Electrician',
    city: 'Rawalpindi',
    area: 'Rawalpindi',
    about: 'Expert electrical installation, repairs and emergency services.',
    services: [],
    experience: 5,
    completedProjects: 132,
    specializations: [],
    serviceAreas: [],
    pricing: { calloutFee: '500', hourlyRate: '1000', minCharge: '500' },
    availability: 'Available',
    responseTime: '5 min',
    socialLinks: { facebook: '', instagram: '', youtube: '', website: '', linkedin: '', tiktok: '' },
    profileImage: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?q=80&w=400&auto=format&fit=crop',
    bannerImage: '',
    status: 'active',
    rating: 4.9,
    reviewsCount: 132,
    verification: true,
    featured: true,
    viewCount: 1200,
    weeklyViews: 0,
    monthlyViews: 0,
    createdAt: '',
    updatedAt: '',
    distanceKm: 2.3,
  },
  {
    _id: 'dummy-2',
    owner: 'owner-2',
    name: 'A1 Plumbing Services',
    email: 'plumber@example.com',
    phone: '+923007654321',
    whatsapp: '+923007654321',
    title: 'Professional Plumbing & Leakage Fixes',
    category: 'Plumber',
    city: 'Rawalpindi',
    area: 'Islamabad',
    about: 'Emergency plumber, pipe leak repairs, bathroom fittings and drain cleaning.',
    services: [],
    experience: 4,
    completedProjects: 156,
    specializations: [],
    serviceAreas: [],
    pricing: { calloutFee: '400', hourlyRate: '800', minCharge: '400' },
    availability: 'Available',
    responseTime: '7 min',
    socialLinks: { facebook: '', instagram: '', youtube: '', website: '', linkedin: '', tiktok: '' },
    profileImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop',
    bannerImage: '',
    status: 'active',
    rating: 4.8,
    reviewsCount: 98,
    verification: true,
    featured: false,
    viewCount: 850,
    weeklyViews: 0,
    monthlyViews: 0,
    createdAt: '',
    updatedAt: '',
    distanceKm: 1.8,
  },
  {
    _id: 'dummy-3',
    owner: 'owner-3',
    name: 'Cool Care AC Services',
    email: 'ac@example.com',
    phone: '+923001122334',
    whatsapp: '+923001122334',
    title: 'AC Maintenance & Air Conditioning Repair',
    category: 'AC Repair',
    city: 'Rawalpindi',
    area: 'Saddar, Rawalpindi',
    about: 'AC installation, gas charging, filter cleanups and expert cooling diagnostics.',
    services: [],
    experience: 6,
    completedProjects: 112,
    specializations: [],
    serviceAreas: [],
    pricing: { calloutFee: '600', hourlyRate: '1200', minCharge: '600' },
    availability: 'Available',
    responseTime: '10 min',
    socialLinks: { facebook: '', instagram: '', youtube: '', website: '', linkedin: '', tiktok: '' },
    profileImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop',
    bannerImage: '',
    status: 'active',
    rating: 4.7,
    reviewsCount: 76,
    verification: true,
    featured: true,
    viewCount: 940,
    weeklyViews: 0,
    monthlyViews: 0,
    createdAt: '',
    updatedAt: '',
    distanceKm: 2.5,
  },
  {
    _id: 'dummy-4',
    owner: 'owner-4',
    name: 'Sparkle Cleaners',
    email: 'cleaners@example.com',
    phone: '+923004455667',
    whatsapp: '+923004455667',
    title: 'Premium Home & Office Cleaning Solutions',
    category: 'Cleaning',
    city: 'Rawalpindi',
    area: 'Bahria Town, Rawalpindi',
    about: 'Deep cleaning, disinfection, sofa washing, and carpet vacuuming services.',
    services: [],
    experience: 3,
    completedProjects: 84,
    specializations: [],
    serviceAreas: [],
    pricing: { calloutFee: '300', hourlyRate: '600', minCharge: '300' },
    availability: 'Available',
    responseTime: '15 min',
    socialLinks: { facebook: '', instagram: '', youtube: '', website: '', linkedin: '', tiktok: '' },
    profileImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop',
    bannerImage: '',
    status: 'active',
    rating: 4.6,
    reviewsCount: 64,
    verification: true,
    featured: false,
    viewCount: 512,
    weeklyViews: 0,
    monthlyViews: 0,
    createdAt: '',
    updatedAt: '',
    distanceKm: 4.1,
  }
];

export default function ServicesScreen() {
  const params = useLocalSearchParams<{
    q?: string;
    category?: string;
    sort?: 'rating' | 'newest' | 'experience';
    verified?: string;
    available?: string;
    nearMe?: string;
    rating4Plus?: string;
    featured?: string;
  }>();

  const activeSearch = params.q || '';
  const selectedCategory = params.category || 'All';
  const sort = params.sort || 'rating';
  const verified = params.verified === 'true';
  const available = params.available === 'true';
  const nearMe = params.nearMe === 'true';
  const rating4Plus = params.rating4Plus === 'true';
  const featured = params.featured === 'true';

  const [favorites, setFavorites] = useState<string[]>([]);
  const { lat, lng, requestLocation } = useLocation();

  useEffect(() => {
    if (nearMe) {
      requestLocation();
    }
  }, [nearMe]);

  const { data, isLoading } = useBusinesses({
    search: activeSearch,
    category: selectedCategory === 'All' ? undefined : selectedCategory,
    sort,
    verified,
    available,
    lat: nearMe && lat ? lat : undefined,
    lng: nearMe && lng ? lng : undefined,
    limit: 30,
  });

  const businesses = data?.data?.businesses ?? [];

  // Combine real and dummy data
  const combined = [...businesses, ...DUMMY_PROVIDERS];
  const uniqueCombined = combined.filter((b, idx, self) => 
    self.findIndex(t => t._id === b._id) === idx
  );

  // Apply filters to combined data
  const filteredBusinesses = uniqueCombined.filter(b => {
    // Search query filter
    if (activeSearch.trim()) {
      const query = activeSearch.toLowerCase();
      const matchName = b.name.toLowerCase().includes(query);
      const matchDesc = b.about?.toLowerCase().includes(query);
      const matchCat = b.category.toLowerCase().includes(query);
      const matchArea = b.area?.toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchCat && !matchArea) return false;
    }

    // Category filter
    if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;

    // Verified filter
    if (verified && !b.verification) return false;

    // Availability filter
    if (available && b.availability !== 'Available') return false;

    // Rating filter
    if (rating4Plus && b.rating < 4.5) return false;

    // Featured filter
    if (featured && !b.featured) return false;

    return true;
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fId => fId !== id) : [...prev, id]
    );
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    Linking.openURL(`https://wa.me/${cleanPhone}`);
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const renderItem = ({ item }: { item: Business }) => {
    const isFav = favorites.includes(item._id);
    const isOpen = item.availability === 'Available';
    
    return (
      <View style={styles.providerCard}>
        {/* Main Content Area */}
        <TouchableOpacity 
          style={styles.cardHeader}
          onPress={() => router.push({ pathname: '/business/[id]', params: { id: item._id } })}
          activeOpacity={0.9}
        >
          {/* Left Image Section with Open Badge */}
          <View style={styles.imageContainer}>
            {item.profileImage ? (
              <Image source={{ uri: item.profileImage }} style={styles.providerImage} />
            ) : (
              <View style={styles.providerPlaceholderImage}>
                <Text style={styles.placeholderChar}>{item.name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <View style={[
              styles.openBadge, 
              { backgroundColor: isOpen ? '#10B981' : Colors.danger }
            ]}>
              <Text style={styles.openBadgeText}>{isOpen ? 'Open' : 'Closed'}</Text>
            </View>
          </View>

          {/* Right Info Section */}
          <View style={styles.infoContainer}>
            {/* Title and Fav Icon */}
            <View style={styles.titleRow}>
              <Text style={styles.providerName} numberOfLines={1}>{item.name}</Text>
              <TouchableOpacity onPress={() => toggleFavorite(item._id)} style={styles.favBtn}>
                <Ionicons 
                  name={isFav ? 'heart' : 'heart-outline'} 
                  size={20} 
                  color={isFav ? '#EF4444' : Colors.textMuted} 
                />
              </TouchableOpacity>
            </View>

            {/* Verification Checkmark */}
            {item.verification && (
              <View style={styles.verifiedRow}>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}

            {/* Rating Stars Row */}
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={14} color={Colors.accent} />
              <Text style={styles.ratingVal}>{formatRating(item.rating)}</Text>
              <Text style={styles.reviewsCount}>({item.reviewsCount} reviews)</Text>
            </View>

            {/* Category Icon Row */}
            <View style={styles.metaRow}>
              <Ionicons 
                name={item.category === 'Electrician' ? 'flash-outline' : 'construct-outline'} 
                size={13} 
                color={Colors.textSecondary} 
              />
              <Text style={styles.metaText}>{item.category}</Text>
            </View>

            {/* Distance Row */}
            <View style={styles.metaRow}>
              <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
              <Text style={styles.metaText}>
                {item.distanceKm ? `${item.distanceKm.toFixed(1)} km away` : `${item.area}`}
              </Text>
            </View>

            {/* Price Callout */}
            <Text style={styles.priceText}>
              Rs.{item.pricing?.calloutFee && item.pricing.calloutFee !== '0' 
                ? item.pricing.calloutFee 
                : 'Free'} <Text style={styles.priceLabelText}>Visit Charge</Text>
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.cardDivider} />

        {/* Bottom Metadata & CTA Action Section */}
        <View style={styles.cardFooter}>
          {/* Specs Rows */}
          <View style={styles.specColsRow}>
            <View style={styles.specCol}>
              <Text style={styles.specLabel}>Response Time</Text>
              <View style={styles.specValueRow}>
                <Ionicons name="flash" size={12} color={Colors.primary} />
                <Text style={styles.specValue}>{item.responseTime ?? '5 min'}</Text>
              </View>
            </View>
            <View style={styles.specColDivider} />
            <View style={styles.specCol}>
              <Text style={styles.specLabel}>Completed Jobs</Text>
              <View style={styles.specValueRow}>
                <Ionicons name="checkbox-outline" size={12} color="#10B981" />
                <Text style={styles.specValue}>{item.completedProjects ?? '120+'}</Text>
              </View>
            </View>
            <View style={styles.specColDivider} />
            <View style={styles.specCol}>
              <Text style={styles.specLabel}>Views</Text>
              <View style={styles.specValueRow}>
                <Ionicons name="eye-outline" size={12} color={Colors.secondary} />
                <Text style={styles.specValue}>{item.viewCount ? `${item.viewCount}` : '1.2k'}</Text>
              </View>
            </View>
          </View>

          {/* Action CTAs */}
          <View style={styles.actionsRow}>
            <TouchableOpacity 
              style={styles.whatsappBtn} 
              onPress={() => handleWhatsApp(item.whatsapp || item.phone)}
            >
              <Ionicons name="logo-whatsapp" size={16} color="#10B981" style={{ marginRight: 4 }} />
              <Text style={styles.whatsappBtnText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.callBtn} 
              onPress={() => handleCall(item.phone)}
            >
              <Ionicons name="call" size={14} color={Colors.white} style={{ marginRight: 4 }} />
              <Text style={styles.callBtnText}>Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.root}>
      {/* Header bar */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <View style={styles.headerTitleWrap}>
            <Text style={styles.headerTitle} numberOfLines={1}>
              {selectedCategory !== 'All' ? selectedCategory : activeSearch ? `Search: "${activeSearch}"` : 'All Specialists'}
            </Text>
            <Text style={styles.headerSubtitle}>{filteredBusinesses.length} specialists found</Text>
          </View>
          <TouchableOpacity 
            style={styles.filterAdjustBtn} 
            onPress={() => router.push({
              pathname: '/(customer)/search',
              params: {
                q: activeSearch,
                category: selectedCategory,
                sort,
                verified: verified ? 'true' : 'false',
                available: available ? 'true' : 'false',
                nearMe: nearMe ? 'true' : 'false',
                rating4Plus: rating4Plus ? 'true' : 'false',
                featured: featured ? 'true' : 'false',
              }
            })}
          >
            <Ionicons name="options-outline" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredBusinesses}
          keyExtractor={(b) => b._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No specialists found</Text>
              <Text style={styles.emptySubtext}>Try toggling different filters or location criteria.</Text>
            </View>
          }
        />
      )}

      {/* Floating Action Button (FAB) Map View */}
      <TouchableOpacity 
        style={styles.fabBtn}
        onPress={() => router.push('/(customer)/nearby')}
        activeOpacity={0.85}
      >
        <Ionicons name="map" size={18} color={Colors.white} style={{ marginRight: 6 }} />
        <Text style={styles.fabBtnText}>Map View</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  // Custom Header
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

  // Main Provider Card List Styles
  list: {
    paddingTop: Spacing.sm,
    paddingBottom: 110,
    gap: Spacing.md,
  },
  providerCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg + 2,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.base,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  cardHeader: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.md,
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
  },
  providerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  providerPlaceholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderChar: {
    fontSize: Typography.fontSize['3xl'],
    color: Colors.primary,
    fontWeight: '800',
    fontFamily: Typography.fontFamily.bold,
  },
  openBadge: {
    position: 'absolute',
    bottom: Spacing.xs,
    left: Spacing.xs,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
  },
  openBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },
  infoContainer: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  providerName: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.xs,
    fontFamily: Typography.fontFamily.bold,
  },
  favBtn: {
    padding: 2,
  },
  verifiedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 2,
  },
  verifiedText: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 2,
  },
  ratingVal: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  reviewsCount: {
    fontSize: 11,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.regular,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.regular,
  },
  priceText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 4,
    fontFamily: Typography.fontFamily.bold,
  },
  priceLabelText: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.regular,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.border,
  },
  cardFooter: {
    padding: Spacing.md,
    gap: Spacing.md,
  },

  // Stats in footer
  specColsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specCol: {
    flex: 1,
    alignItems: 'center',
  },
  specColDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  specLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    marginBottom: 2,
    fontFamily: Typography.fontFamily.regular,
  },
  specValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  specValue: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },

  // WhatsApp and Call Actions row
  actionsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  whatsappBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#10B981',
    borderRadius: BorderRadius.md,
    height: 38,
    backgroundColor: Colors.surface,
  },
  whatsappBtnText: {
    color: '#10B981',
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },
  callBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    height: 38,
    ...Shadow.sm,
  },
  callBtnText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },

  // Floating Action Button (FAB) Map View
  fabBtn: {
    position: 'absolute',
    bottom: 30,
    right: Spacing.base,
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    height: 46,
    ...Shadow.md,
  },
  fabBtnText: {
    color: Colors.white,
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.xs,
  },
  emptyText: {
    fontSize: Typography.fontSize.base,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  emptySubtext: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    fontFamily: Typography.fontFamily.regular,
  },
});
