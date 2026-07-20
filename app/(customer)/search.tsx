import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Platform
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useLocation } from '@/hooks/useLocation';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius, Shadow } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import type { Business } from '@/types/business';

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
  const params = useLocalSearchParams<{
    q?: string;
    category?: string;
    sort?: string;
    verified?: string;
    available?: string;
    nearMe?: string;
    rating4Plus?: string;
    featured?: string;
  }>();
  
  const [search, setSearch] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sort, setSort] = useState<'rating' | 'newest' | 'experience'>('rating');
  const [verified, setVerified] = useState(false);
  const [available, setAvailable] = useState(false);
  const [nearMe, setNearMe] = useState(false);
  const [rating4Plus, setRating4Plus] = useState(false);
  const [featured, setFeatured] = useState(false);

  const { lat, lng, requestLocation } = useLocation();

  // Load search query & options from navigation params
  useEffect(() => {
    if (params.q !== undefined) {
      setSearch(params.q);
      setActiveSearch(params.q);
    }
    if (params.category !== undefined) {
      setSelectedCategory(params.category);
    }
    if (params.sort !== undefined) {
      setSort(params.sort as any);
    }
    if (params.verified !== undefined) {
      setVerified(params.verified === 'true');
    }
    if (params.available !== undefined) {
      setAvailable(params.available === 'true');
    }
    if (params.nearMe !== undefined) {
      setNearMe(params.nearMe === 'true');
    }
    if (params.rating4Plus !== undefined) {
      setRating4Plus(params.rating4Plus === 'true');
    }
    if (params.featured !== undefined) {
      setFeatured(params.featured === 'true');
    }
  }, [params]);

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

  // Apply filters to combined data to display correct live match count
  const filteredBusinesses = uniqueCombined.filter(b => {
    if (activeSearch.trim()) {
      const query = activeSearch.toLowerCase();
      const matchName = b.name.toLowerCase().includes(query);
      const matchDesc = b.about?.toLowerCase().includes(query);
      const matchCat = b.category.toLowerCase().includes(query);
      const matchArea = b.area?.toLowerCase().includes(query);
      if (!matchName && !matchDesc && !matchCat && !matchArea) return false;
    }

    if (selectedCategory !== 'All' && b.category !== selectedCategory) return false;
    if (verified && !b.verification) return false;
    if (available && b.availability !== 'Available') return false;
    if (rating4Plus && b.rating < 4.5) return false;
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

  return (
    <View style={styles.root}>
      {/* Scrollable Filters Block */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Custom Header (Back arrow + Title) */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Filter Specialists</Text>
          <View style={{ width: 32 }} />
        </View>

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

        <Text style={styles.sectionHeading}>Categories</Text>
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

        <Text style={styles.sectionHeading}>Quick Filters</Text>
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

        <Text style={styles.sectionHeading}>Sort Result By</Text>
        <View style={styles.sortContainer}>
          <TouchableOpacity style={styles.sortRowBtn} onPress={cycleSort}>
            <Ionicons name="funnel-outline" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
            <Text style={styles.sortText}>Sorting Active: <Text style={styles.sortValueText}>{getSortLabel()}</Text></Text>
            <Ionicons name="swap-vertical" size={16} color={Colors.textSecondary} style={{ marginLeft: 'auto' }} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions footer */}
      <View style={styles.footerContainer}>
        <TouchableOpacity 
          style={styles.showResultsBtn}
          onPress={() => router.push({
            pathname: '/(customer)/services',
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
          <Text style={styles.showResultsBtnText}>
            Show Results ({filteredBusinesses.length} Specialists)
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scrollContainer: {
    paddingBottom: 120,
    backgroundColor: Colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingTop: Platform.OS === 'ios' ? 44 : 20,
    paddingBottom: Spacing.md,
    backgroundColor: Colors.surface,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: Spacing.md,
  },
  topBarTitle: {
    fontSize: Typography.fontSize.md + 1,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  backBtn: {
    padding: Spacing.xs,
  },
  sectionHeading: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },

  // Header Search Input Styles
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
    backgroundColor: Colors.surface,
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
  filterBtn: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.surface,
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
    marginBottom: Spacing.sm,
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
    paddingHorizontal: Spacing.base,
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
    paddingHorizontal: Spacing.base,
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

  // Sort Styles
  sortContainer: {
    paddingHorizontal: Spacing.base,
  },
  sortRowBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  sortText: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textPrimary,
    fontWeight: '600',
    fontFamily: Typography.fontFamily.bold,
  },
  sortValueText: {
    color: Colors.primary,
  },

  // Sticky bottom footer CTA
  footerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.lg,
  },
  showResultsBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.lg,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadow.md,
  },
  showResultsBtnText: {
    color: Colors.white,
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: '800',
    fontFamily: Typography.fontFamily.bold,
  },
});
