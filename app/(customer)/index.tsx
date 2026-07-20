import {
  View, Text, StyleSheet, ActivityIndicator, RefreshControl, ScrollView, Platform
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';
import { Spacing, Typography } from '@/constants/theme';
import type { Business } from '@/types/business';

// Import modular sections
import HeroSection from '@/components/home/HeroSection';
import StatsCard from '@/components/home/StatsCard';
import FeaturedProviders from '@/components/home/FeaturedProviders';
import PromoSlider from '@/components/home/PromoSlider';
import PopularCategories from '@/components/home/PopularCategories';
import TrendingServices from '@/components/home/TrendingServices';
import TopRatedSpecialists from '@/components/home/TopRatedSpecialists';
import HowItWorks from '@/components/home/HowItWorks';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import DualCTA from '@/components/home/DualCTA';

const MOCK_FEATURED_PROVIDERS: Business[] = [
  {
    _id: 'mock-1',
    owner: 'mock-owner-1',
    email: 'rizwan@example.com',
    phone: '+923001234561',
    whatsapp: '+923001234561',
    name: 'Muhammad Rizwan',
    title: 'AC Repair & Installation Specialist',
    category: 'AC Repair',
    city: 'Islamabad',
    area: 'G-11',
    about: 'Professional AC technician with 8+ years of experience in repairing, installing, and servicing all types of air conditioners.',
    services: ['AC Repair', 'AC Installation', 'Gas Charging'],
    experience: 8,
    completedProjects: 240,
    specializations: ['Inverter AC', 'Split AC'],
    serviceAreas: ['Islamabad', 'Rawalpindi'],
    pricing: {
      calloutFee: '500',
      hourlyRate: '1000',
      minCharge: '800'
    },
    availability: 'Available',
    responseTime: '15 mins',
    socialLinks: { facebook: '', instagram: '', youtube: '', website: '', linkedin: '', tiktok: '' },
    profileImage: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=150',
    bannerImage: '',
    status: 'active',
    rating: 4.9,
    reviewsCount: 38,
    verification: true,
    featured: true,
    viewCount: 120,
    weeklyViews: 15,
    monthlyViews: 65,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-2',
    owner: 'mock-owner-2',
    email: 'yasir@example.com',
    phone: '+923001234562',
    whatsapp: '+923001234562',
    name: 'Yasir Khan',
    title: 'Professional Electrician & Wiring Expert',
    category: 'Electrician',
    city: 'Islamabad',
    area: 'F-8',
    about: 'Expert electrician specializing in home wiring, short circuit repairs, UPS installation, and appliance maintenance.',
    services: ['Home Wiring', 'UPS Repair', 'Breaker Fixing'],
    experience: 5,
    completedProjects: 150,
    specializations: ['Home Automation', 'Industrial Wiring'],
    serviceAreas: ['Islamabad'],
    pricing: {
      calloutFee: '0',
      hourlyRate: '800',
      minCharge: '500'
    },
    availability: 'Available',
    responseTime: '30 mins',
    socialLinks: { facebook: '', instagram: '', youtube: '', website: '', linkedin: '', tiktok: '' },
    profileImage: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150',
    bannerImage: '',
    status: 'active',
    rating: 4.8,
    reviewsCount: 26,
    verification: true,
    featured: true,
    viewCount: 95,
    weeklyViews: 10,
    monthlyViews: 40,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    _id: 'mock-3',
    owner: 'mock-owner-3',
    email: 'sajid@example.com',
    phone: '+923001234563',
    whatsapp: '+923001234563',
    name: 'Sajid Mehmood',
    title: 'Master Plumber & Leakage Fixer',
    category: 'Plumber',
    city: 'Islamabad',
    area: 'I-9',
    about: '20+ years of plumbing experience. Leakage detection, pipe fittings, geyser installation, and bathroom renovations.',
    services: ['Leakage Repair', 'Geyser Install', 'Drain Unclogging'],
    experience: 12,
    completedProjects: 450,
    specializations: ['Leakage Detection', 'Modern Bathroom Fit-outs'],
    serviceAreas: ['Islamabad', 'Rawalpindi'],
    pricing: {
      calloutFee: '400',
      hourlyRate: '1200',
      minCharge: '700'
    },
    availability: 'Available',
    responseTime: '20 mins',
    socialLinks: { facebook: '', instagram: '', youtube: '', website: '', linkedin: '', tiktok: '' },
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    bannerImage: '',
    status: 'active',
    rating: 4.7,
    reviewsCount: 54,
    verification: true,
    featured: true,
    viewCount: 180,
    weeklyViews: 25,
    monthlyViews: 90,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
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

  // Filter top-rated providers for horizontal slider
  const topRatedProviders = businesses.filter(b => b.rating >= 4.0).slice(0, 6);

  // Filter featured providers for the horizontal slider (fallback to high rated, top rated, any, or mock featured if none exist)
  const featuredProviders = businesses.filter(b => b.featured === true);
  const displayFeatured = featuredProviders.length > 0 
    ? featuredProviders.slice(0, 6) 
    : businesses.filter(b => b.rating >= 4.2).length > 0
      ? businesses.filter(b => b.rating >= 4.2).slice(0, 6)
      : topRatedProviders.length > 0
        ? topRatedProviders.slice(0, 6)
        : businesses.length > 0
          ? businesses.slice(0, 6)
          : MOCK_FEATURED_PROVIDERS;

  const handleSearch = () => {
    setActiveSearch(search);
    if (search.trim()) {
      router.push({
        pathname: '/(customer)/search',
        params: { q: search }
      });
    }
  };

  const selectCategory = (categoryName: string) => {
    setSelectedCategory(categoryName);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <HeroSection
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
        onClearSearch={() => { setSearch(''); setActiveSearch(''); }}
      />
      <StatsCard />
      <FeaturedProviders displayFeatured={displayFeatured} />
      <PromoSlider />
      <PopularCategories selectedCategory={selectedCategory} onSelectCategory={selectCategory} />
      <TrendingServices />
      <TopRatedSpecialists topRatedProviders={topRatedProviders} />
      <HowItWorks />
      <WhyChooseUs />
      <DualCTA />
    </View>
  );

  return (
    <View style={styles.root}>
      {isLoading && businesses.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ScrollView
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
          >
            {renderHeader()}
            <View style={styles.centered}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Loading experts...</Text>
            </View>
          </ScrollView>
        </View>
      ) : (
        <ScrollView
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
        >
          {renderHeader()}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  loadingContainer: { flex: 1 },
  headerContainer: {
    paddingBottom: Spacing.sm,
  },
  listContent: {
    paddingBottom: 110,
    gap: Spacing.md,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    paddingBottom: 60,
  },
  loadingText: {
    color: Colors.textSecondary,
    marginTop: Spacing.md,
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
  },
});
