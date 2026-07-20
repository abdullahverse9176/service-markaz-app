import {
  View, Text, FlatList, TouchableOpacity, ActivityIndicator, Linking
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useLocation } from '@/hooks/useLocation';
import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import type { Business } from '@/types/business';
import { styles } from '@/components/services/services.styles';

// Import modular components
import ServicesHeader from '@/components/services/ServicesHeader';
import ProviderCard from '@/components/services/ProviderCard';

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
    priceRange?: string;
  }>();

  const activeSearch = params.q || '';
  const selectedCategory = params.category || 'All';
  const sort = params.sort || 'rating';
  const verified = params.verified === 'true';
  const available = params.available === 'true';
  const nearMe = params.nearMe === 'true';
  const rating4Plus = params.rating4Plus === 'true';
  const featured = params.featured === 'true';
  const priceRange = params.priceRange || 'All';

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

    // Price range budget filter
    if (priceRange !== 'All') {
      const fee = parseInt(b.pricing?.calloutFee || '0');
      if (priceRange === 'budget' && fee > 400) return false;
      if (priceRange === 'mid' && (fee <= 400 || fee > 800)) return false;
      if (priceRange === 'premium' && fee <= 800) return false;
    }

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

  return (
    <View style={styles.root}>
      {/* Services Header Component */}
      <ServicesHeader
        selectedCategory={selectedCategory}
        activeSearch={activeSearch}
        totalFound={filteredBusinesses.length}
        sort={sort}
        verified={verified}
        available={available}
        nearMe={nearMe}
        rating4Plus={rating4Plus}
        featured={featured}
        priceRange={priceRange}
      />

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredBusinesses}
          keyExtractor={(b) => b._id}
          renderItem={({ item }) => (
            <ProviderCard
              item={item}
              isFav={favorites.includes(item._id)}
              onToggleFavorite={toggleFavorite}
              onWhatsApp={handleWhatsApp}
              onCall={handleCall}
            />
          )}
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
