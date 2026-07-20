import {
  View, Text, StyleSheet, ActivityIndicator, RefreshControl, ScrollView
} from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';
import { Spacing, Typography } from '@/constants/theme';
import { MOCK_FEATURED_PROVIDERS } from '@/constants/mockData';

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
        pathname: '/(customer)/services',
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
