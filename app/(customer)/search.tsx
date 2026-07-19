import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, ScrollView, Image, Linking, Platform
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

const SEARCH_CATEGORIES = [
  { label: 'Home Repair', name: 'Carpenter', icon: 'hammer-outline' as const, bg: '#E0F8F5', color: '#0D9488' },
  { label: 'Auto Services', name: 'Auto', icon: 'car-outline' as const, bg: '#E6F6F0', color: Colors.primary },
  { label: 'Beauty & Salon', name: 'Beautician', icon: 'cut-outline' as const, bg: '#FCE7F3', color: '#BE185D' },
  { label: 'Electricians', name: 'Electrician', icon: 'flash-outline' as const, bg: '#FEF3C7', color: '#D97706' },
  { label: 'Plumbing', name: 'Plumber', icon: 'water-outline' as const, bg: '#E0F2FE', color: '#0284C7' },
  { label: 'Cleaning', name: 'Cleaning', icon: 'sparkles-outline' as const, bg: '#DCFCE7', color: '#15803D' },
];

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

export default function SearchScreen() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sort, setSort] = useState<'rating' | 'newest' | 'experience'>('rating');
  const [verified, setVerified] = useState(false);
  const [available, setAvailable] = useState(false);
  
  // Custom filters
  const [nearMe, setNearMe] = useState(false);
  const [rating4Plus, setRating4Plus] = useState(false);
  const [featured, setFeatured] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  const { lat, lng, requestLocation } = useLocation();

  // Load search query from params
  useEffect(() => {
    if (q) {
      setSearch(q);
      setActiveSearch(q);
    }
  }, [q]);

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

  const handleToggleNearMe = async () => {
    if (!nearMe) {
      await requestLocation();
      setNearMe(true);
    } else {
      setNearMe(false);
    }
  };

  const handleSearch = () => {
    setActiveSearch(search);
  };

  const cycleSort = () => {
    if (sort === 'rating') setSort('newest');
    else if (sort === 'newest') setSort('experience');
    else setSort('rating');
  };

  const getSortLabel = () => {
    if (sort === 'rating') return 'Rating';
    if (sort === 'newest') return 'Newest';
    return 'Experience';
  };

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

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Search Input and Filter */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services, business or area..."
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(''); setActiveSearch(''); }} style={styles.clearBtn}>
              <Ionicons name="close" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          )}
          <Ionicons name="mic-outline" size={20} color={Colors.textMuted} style={styles.micIcon} />
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={handleSearch}>
          <Ionicons name="options-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Location Row */}
      <View style={styles.locationRow}>
        <View style={styles.locationLeft}>
          <Ionicons name="location" size={16} color={Colors.primary} />
          <Text style={styles.locationText}>Rawalpindi, Pakistan</Text>
          <Ionicons name="chevron-down" size={12} color={Colors.textSecondary} style={{ marginLeft: 2 }} />
        </View>
        <TouchableOpacity onPress={handleToggleNearMe}>
          <Text style={styles.changeLocationLink}>Change Location</Text>
        </TouchableOpacity>
      </View>

      {/* Category Scroll Row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        <TouchableOpacity 
          style={styles.categoryItem} 
          onPress={() => setSelectedCategory('All')}
        >
          <View style={[
            styles.categoryCircle, 
            { backgroundColor: '#EBF1F7' }, 
            selectedCategory === 'All' && styles.categoryCircleActive
          ]}>
            <Ionicons name="grid-outline" size={20} color={Colors.secondary} />
          </View>
          <Text style={[styles.categoryLabel, selectedCategory === 'All' && styles.categoryLabelActive]}>All</Text>
        </TouchableOpacity>

        {SEARCH_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <TouchableOpacity 
              key={cat.name} 
              style={styles.categoryItem} 
              onPress={() => setSelectedCategory(cat.name)}
            >
              <View style={[
                styles.categoryCircle, 
                { backgroundColor: cat.bg },
                isActive && styles.categoryCircleActive
              ]}>
                <Ionicons name={cat.icon} size={20} color={cat.color} />
              </View>
              <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]} numberOfLines={1}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Filter Chips Scroll Row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
        {/* Near Me Chip */}
        <TouchableOpacity 
          style={[styles.chip, nearMe && styles.chipActive]} 
          onPress={handleToggleNearMe}
        >
          <Ionicons 
            name="navigate-outline" 
            size={14} 
            color={nearMe ? Colors.white : Colors.primary} 
            style={styles.chipIcon} 
          />
          <Text style={[styles.chipText, nearMe && styles.chipTextActive]}>Near Me</Text>
        </TouchableOpacity>

        {/* 4.5+ Star Chip */}
        <TouchableOpacity 
          style={[styles.chip, rating4Plus && styles.chipActive]} 
          onPress={() => setRating4Plus(!rating4Plus)}
        >
          <Ionicons 
            name="star" 
            size={14} 
            color={rating4Plus ? Colors.white : Colors.accent} 
            style={styles.chipIcon} 
          />
          <Text style={[styles.chipText, rating4Plus && styles.chipTextActive]}>4.5+</Text>
        </TouchableOpacity>

        {/* Verified Chip */}
        <TouchableOpacity 
          style={[styles.chip, verified && styles.chipActive]} 
          onPress={() => setVerified(!verified)}
        >
          <Ionicons 
            name="checkmark-circle" 
            size={14} 
            color={verified ? Colors.white : '#10B981'} 
            style={styles.chipIcon} 
          />
          <Text style={[styles.chipText, verified && styles.chipTextActive]}>Verified</Text>
        </TouchableOpacity>

        {/* Featured Chip */}
        <TouchableOpacity 
          style={[styles.chip, featured && styles.chipActive]} 
          onPress={() => setFeatured(!featured)}
        >
          <Ionicons 
            name="flame" 
            size={14} 
            color={featured ? Colors.white : '#EF4444'} 
            style={styles.chipIcon} 
          />
          <Text style={[styles.chipText, featured && styles.chipTextActive]}>Featured</Text>
        </TouchableOpacity>

        {/* Open Now Chip */}
        <TouchableOpacity 
          style={[styles.chip, available && styles.chipActive]} 
          onPress={() => setAvailable(!available)}
        >
          <View style={[
            styles.statusDotIcon, 
            { backgroundColor: available ? Colors.white : '#10B981' }
          ]} />
          <Text style={[styles.chipText, available && styles.chipTextActive]}>Open Now</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Results Header with Sort */}
      <View style={styles.resultsHeader}>
        <View>
          <Text style={styles.resultsTitle}>Providers near you</Text>
          <Text style={styles.resultsSubtitle}>{filteredBusinesses.length}+ providers found</Text>
        </View>
        <TouchableOpacity style={styles.sortBtn} onPress={cycleSort}>
          <Text style={styles.sortText}>Sort by: <Text style={styles.sortValueText}>{getSortLabel()}</Text></Text>
          <Ionicons name="chevron-down" size={12} color={Colors.primary} style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      </View>
    </View>
  );

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
      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredBusinesses}
          keyExtractor={(b) => b._id}
          ListHeaderComponent={renderHeader()}
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
  
  // Header Section Styles
  header: {
    backgroundColor: Colors.surface,
    paddingTop: 15,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.base,
    gap: Spacing.sm,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: Spacing.xs,
  },
  searchInput: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.sm,
    height: '100%',
    fontFamily: Typography.fontFamily.regular,
  },
  clearBtn: {
    padding: Spacing.xs,
  },
  micIcon: {
    marginLeft: Spacing.xs,
  },
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Location Row Styles
  locationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  locationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginLeft: 4,
    fontFamily: Typography.fontFamily.bold,
  },
  changeLocationLink: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },

  // Category Scroll Styles
  categoryScroll: {
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base - Spacing.sm,
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  categoryItem: {
    alignItems: 'center',
    width: 72,
  },
  categoryCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    ...Shadow.sm,
  },
  categoryCircleActive: {
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  categoryLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    fontFamily: Typography.fontFamily.medium,
  },
  categoryLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },

  // Chips Scroll Styles
  chipsScroll: {
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base - Spacing.xs,
    marginBottom: Spacing.sm,
    gap: Spacing.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipIcon: {
    marginRight: 4,
  },
  statusDotIcon: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  chipText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
    fontFamily: Typography.fontFamily.bold,
  },
  chipTextActive: {
    color: Colors.white,
  },

  // Results Header
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.sm,
  },
  resultsTitle: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  resultsSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    marginTop: 1,
    fontFamily: Typography.fontFamily.regular,
  },
  sortBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sortText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
    fontFamily: Typography.fontFamily.bold,
  },
  sortValueText: {
    color: Colors.primary,
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
    bottom: 96,
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
