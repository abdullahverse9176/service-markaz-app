import { View, ScrollView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useLocation } from '@/hooks/useLocation';
import type { Business } from '@/types/business';
import { styles } from '@/components/search/search.styles';

// Import modular search components
import SearchHeader from '@/components/search/SearchHeader';
import SearchInputBox from '@/components/search/SearchInputBox';
import SearchLocationBar from '@/components/search/SearchLocationBar';
import SearchHistorySection from '@/components/search/SearchHistorySection';
import SearchCategoriesScroll from '@/components/search/SearchCategoriesScroll';
import SearchFiltersCard from '@/components/search/SearchFiltersCard';
import SearchStickyFooter from '@/components/search/SearchStickyFooter';

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
    priceRange?: string;
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
  
  const [recentSearches, setRecentSearches] = useState<string[]>(['AC Servicing', 'Plumber Visit']);
  const [priceRange, setPriceRange] = useState<'All' | 'budget' | 'mid' | 'premium'>('All');

  const { lat, lng, requestLocation } = useLocation();

  // Sync state values with query parameters
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
    if (params.priceRange !== undefined) {
      setPriceRange(params.priceRange as any);
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

  // Apply filters to combined data
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

    // Price Budget filter
    if (priceRange !== 'All') {
      const fee = parseInt(b.pricing?.calloutFee || '0');
      if (priceRange === 'budget' && fee > 400) return false;
      if (priceRange === 'mid' && (fee <= 400 || fee > 800)) return false;
      if (priceRange === 'premium' && fee <= 800) return false;
    }

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
    if (search.trim() && !recentSearches.includes(search.trim())) {
      setRecentSearches(prev => [search.trim(), ...prev.slice(0, 3)]);
    }
  };

  const triggerDirectTagSearch = (tag: string) => {
    setSearch(tag);
    setActiveSearch(tag);
    if (!recentSearches.includes(tag)) {
      setRecentSearches(prev => [tag, ...prev.slice(0, 3)]);
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setActiveSearch('');
    setSelectedCategory('All');
    setSort('rating');
    setVerified(false);
    setAvailable(false);
    setNearMe(false);
    setRating4Plus(false);
    setFeatured(false);
    setPriceRange('All');
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

  const handleShowResults = () => {
    router.push({
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
        priceRange: priceRange,
      }
    });
  };

  return (
    <View style={styles.root}>
      {/* Scrollable Filters Block */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
        {/* Search Header Component */}
        <SearchHeader onReset={handleResetFilters} />

        {/* Search Input Box */}
        <SearchInputBox
          search={search}
          setSearch={setSearch}
          onClear={() => { setSearch(''); setActiveSearch(''); }}
          onSubmit={handleSearch}
        />

        {/* Location display Bar */}
        <SearchLocationBar onToggleNearMe={handleToggleNearMe} />

        {/* Recent & Popular Search history Tag list */}
        <SearchHistorySection
          recentSearches={recentSearches}
          onClearRecent={() => setRecentSearches([])}
          onTagPress={triggerDirectTagSearch}
        />

        {/* Categories slider */}
        <SearchCategoriesScroll
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Settings Filter Details (Quick criteria, Sort options, Budgets) */}
        <SearchFiltersCard
          nearMe={nearMe}
          onToggleNearMe={handleToggleNearMe}
          rating4Plus={rating4Plus}
          setRating4Plus={setRating4Plus}
          verified={verified}
          setVerified={setVerified}
          featured={featured}
          setFeatured={setFeatured}
          available={available}
          setAvailable={setAvailable}
          sort={sort}
          onCycleSort={cycleSort}
          sortLabel={getSortLabel()}
          priceRange={priceRange}
          onSelectPriceRange={setPriceRange}
        />
      </ScrollView>

      {/* Sticky Bottom Show Results Button */}
      <SearchStickyFooter
        totalFound={filteredBusinesses.length}
        onPress={handleShowResults}
      />
    </View>
  );
}
