import {
  View, Text, ScrollView, StyleSheet, Image,
  TouchableOpacity, Linking, Alert, ActivityIndicator, Platform
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState } from 'react';
import { useBusiness } from '@/hooks/useBusinesses';
import { useCreateLead, useMyLeads } from '@/hooks/useLeads';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius, Shadow } from '@/constants/theme';
import { formatRating } from '@/utils/format';
import { Ionicons } from '@expo/vector-icons';
import type { Business } from '@/types/business';

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
    about: 'Expert electrical installation, repairs and emergency services. 10+ years of experience in residential and commercial wiring, appliances repair, DB box installation and short circuit troubleshooting. Available 24/7 for emergency electrical issues.',
    services: ['Home Wiring', 'Appliance Repair', 'AC Installation', 'Ceiling Fan Fix', 'UPS Installation', 'Short Circuit Fix'],
    experience: 10,
    completedProjects: 132,
    specializations: ['Industrial Panels', 'Home Automation', 'Safety Auditing'],
    serviceAreas: ['Saddar', 'Westridge', 'Adyala', 'Bahria Town'],
    pricing: { calloutFee: '500', hourlyRate: '1000', minCharge: '500' },
    availability: 'Available',
    responseTime: '5 min',
    socialLinks: { facebook: '', instagram: '', youtube: '', website: '', linkedin: '', tiktok: '' },
    profileImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
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
    about: 'Professional plumbing services for homes and offices. We specialize in water tank cleaning, pipeline leakage repair, washroom renovation, faucet installation, water pump installation and geyser repairs. Reliable service with quality guarantees.',
    services: ['Leakage Repair', 'Bathroom Renovations', 'Water Pump Repair', 'Drain Cleaning', 'Geyser Service', 'Tank Cleaning'],
    experience: 8,
    completedProjects: 156,
    specializations: ['Kitchen Fitting', 'Commercial Sewage', 'Hydraulic Systems'],
    serviceAreas: ['Blue Area', 'F-6', 'G-11', 'Rawal Town', 'Saddar'],
    pricing: { calloutFee: '400', hourlyRate: '800', minCharge: '400' },
    availability: 'Available',
    responseTime: '7 min',
    socialLinks: { facebook: '', instagram: '', youtube: '', website: '', linkedin: '', tiktok: '' },
    profileImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
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
    about: 'Your trusted partner for all cooling needs. We install, repair, and service split units, window ACs, and inverter models. Special services include gas top-up, deep pressure washing, compressor replacements, and cooling coil repairs. Super fast response.',
    services: ['AC Servicing', 'Gas Charging', 'Inverter AC Repair', 'Split AC Installation', 'Compressor Fix', 'Leaks Check'],
    experience: 12,
    completedProjects: 112,
    specializations: ['Inverter Diagnostics', 'Central Chillers', 'Thermostat Setup'],
    serviceAreas: ['Lalkurti', 'Saddar', 'Chaklala Scheme', 'Peshawar Road'],
    pricing: { calloutFee: '600', hourlyRate: '1200', minCharge: '600' },
    availability: 'Available',
    responseTime: '10 min',
    socialLinks: { facebook: '', instagram: '', youtube: '', website: '', linkedin: '', tiktok: '' },
    profileImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=400&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800&auto=format&fit=crop',
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
    about: 'Expert cleaning crew ready to make your space shine. We provide deep house cleaning, post-construction cleaning, office janitorial services, sofa and carpet dry cleaning, glass window cleaning, and customized hygienic disinfection protocols.',
    services: ['Deep House Clean', 'Sofa Washing', 'Carpet Vacuuming', 'Office Janitor', 'Disinfection Service', 'Window Wash'],
    experience: 5,
    completedProjects: 84,
    specializations: ['Post-Construction Clean', 'Deep Sanitization', 'Upholstery Care'],
    serviceAreas: ['Bahria Town', 'DHA Phase 1-5', 'PWD', 'Media Town'],
    pricing: { calloutFee: '300', hourlyRate: '600', minCharge: '300' },
    availability: 'Available',
    responseTime: '15 min',
    socialLinks: { facebook: '', instagram: '', youtube: '', website: '', linkedin: '', tiktok: '' },
    profileImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=400&auto=format&fit=crop',
    bannerImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=800&auto=format&fit=crop',
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
  }
];

const MOCK_REVIEWS = [
  {
    id: 'rev-1',
    author: 'Muhammad Ahmed',
    rating: 5,
    date: '2 days ago',
    comment: 'Excellent work! Came on time, diagnosed the issue quickly and fixed it at a very reasonable price. Highly recommended.',
  },
  {
    id: 'rev-2',
    author: 'Ayesha Khan',
    rating: 4,
    date: '1 week ago',
    comment: 'Very professional behavior. Cleaned up the area after finishing the work. Price was as quoted.',
  },
  {
    id: 'rev-3',
    author: 'Zainab Bibi',
    rating: 5,
    date: '3 weeks ago',
    comment: 'Best service provider in Rawalpindi. Will definitely contact again for any future work.',
  }
];

export default function BusinessDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const isDummy = id?.startsWith('dummy-');
  const dummyBusiness = isDummy ? DUMMY_PROVIDERS.find(b => b._id === id) : null;

  const { data, isLoading: liveLoading } = useBusiness(isDummy ? '' : (id ?? ''));
  const isLoading = isDummy ? false : liveLoading;

  const business = isDummy ? dummyBusiness : data?.data;

  const createLeadMutation = useCreateLead();
  const { isAuthenticated } = useAuthStore();
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews'>('overview');

  const { data: leadsData } = useMyLeads();
  const myLeads = leadsData?.data ?? [];

  // Logic to determine if user has contacted the provider
  const hasContacted = isDummy 
    ? (id !== 'dummy-2' && id !== 'dummy-4') // Mock contacted state for dummy profiles (dummy-2, dummy-4 have not contacted, dummy-1, dummy-3 have)
    : myLeads.some((lead: any) => {
        const leadBizId = typeof lead.business === 'object' ? lead.business._id : lead.business;
        return leadBizId === business?._id;
      });

  const handleCall = () => {
    if (!business?.phone) return;
    trackLead('call');
    Linking.openURL(`tel:${business.phone}`);
  };

  const handleWhatsApp = () => {
    if (!business?.whatsapp && !business?.phone) return;
    const number = (business.whatsapp || business.phone).replace(/[^0-9]/g, '');
    trackLead('whatsapp');
    Linking.openURL(`https://wa.me/${number}`);
  };

  const handleMessage = () => {
    if (!isAuthenticated && !isDummy) {
      if (Platform.OS === 'web') {
        const accept = window.confirm('Sign In Required: Please sign in to message this specialist.');
        if (accept) {
          router.push('/(auth)/login');
        }
      } else {
        Alert.alert('Sign In Required', 'Please sign in to message this specialist', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Sign In', onPress: () => router.push('/(auth)/login') },
        ]);
      }
      return;
    }
    trackLead('form'); // Creates contact lead
    router.push(`/chat/${business?._id || ''}?name=${encodeURIComponent(business?.name || '')}` as any);
  };

  const trackLead = (source: 'call' | 'whatsapp' | 'form') => {
    if (!isAuthenticated || !business || isDummy) return;
    createLeadMutation.mutate({ businessId: business._id, source });
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!business) {
    return (
      <View style={styles.centered}>
        <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
        <Text style={styles.errorText}>Specialist not found</Text>
        <TouchableOpacity style={styles.errorBackBtn} onPress={() => router.back()}>
          <Text style={styles.errorBackText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isOpen = business.availability === 'Available';

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Banner Section */}
        <View style={styles.bannerWrap}>
          {business.bannerImage ? (
            <Image source={{ uri: business.bannerImage }} style={styles.banner} />
          ) : (
            <View style={[styles.banner, styles.bannerPlaceholder]}>
              <Ionicons name="image-outline" size={48} color={Colors.border} />
            </View>
          )}
          {/* Header Controls Overlay */}
          <View style={styles.headerControls}>
            <TouchableOpacity style={styles.circleBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color={Colors.white} />
            </TouchableOpacity>
            
            <View style={{ flexDirection: 'row', gap: Spacing.sm }}>
              <TouchableOpacity style={styles.circleBtn} onPress={() => setIsFavorite(!isFavorite)}>
                <Ionicons 
                  name={isFavorite ? 'heart' : 'heart-outline'} 
                  size={22} 
                  color={isFavorite ? '#EF4444' : Colors.white} 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.circleBtn} onPress={() => Alert.alert('Share', 'Share this specialist details')}>
                <Ionicons name="share-social-outline" size={22} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Profile Card Section */}
        <View style={styles.profileCard}>
          <View style={styles.profileRow}>
            {/* Avatar image with verified badge overlay */}
            <View style={styles.avatarContainer}>
              {business.profileImage ? (
                <Image source={{ uri: business.profileImage }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarText}>{business.name.charAt(0).toUpperCase()}</Text>
                </View>
              )}
              {business.verification && (
                <View style={styles.avatarVerifyBadge}>
                  <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                </View>
              )}
            </View>

            {/* Profile text data */}
            <View style={styles.profileInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.bizName} numberOfLines={1}>{business.name}</Text>
              </View>
              <Text style={styles.bizTitle}>{business.title}</Text>
              
              <View style={styles.badgesWrap}>
                {business.verification && (
                  <View style={styles.verifiedTextBadge}>
                    <Ionicons name="shield-checkmark" size={11} color={Colors.white} style={{ marginRight: 2 }} />
                    <Text style={styles.verifiedBadgeText}>Verified</Text>
                  </View>
                )}
                <View style={[
                  styles.availBadge,
                  { backgroundColor: isOpen ? '#E6F6F0' : '#FEE2E2' }
                ]}>
                  <View style={[styles.statusDot, { backgroundColor: isOpen ? '#10B981' : Colors.danger }]} />
                  <Text style={[
                    styles.availText,
                    { color: isOpen ? '#15803D' : Colors.danger }
                  ]}>
                    {isOpen ? 'Open Now' : 'Closed'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.cardDivider} />

          {/* Core rating and project statistics */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                <Ionicons name="star" size={16} color={Colors.accent} />
                <Text style={styles.statValue}>{formatRating(business.rating)}</Text>
              </View>
              <Text style={styles.statLabel}>{business.reviewsCount} Reviews</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{business.experience}+ Years</Text>
              <Text style={styles.statLabel}>Experience</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{business.completedProjects}</Text>
              <Text style={styles.statLabel}>Completed Jobs</Text>
            </View>
          </View>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'overview' && styles.tabButtonActive]}
            onPress={() => setActiveTab('overview')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'overview' && styles.tabButtonTextActive]}>
              Overview
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.tabButton, activeTab === 'reviews' && styles.tabButtonActive]}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={[styles.tabButtonText, activeTab === 'reviews' && styles.tabButtonTextActive]}>
              Reviews ({business.reviewsCount})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Panel Contents */}
        {activeTab === 'overview' ? (
          /* Overview Module content */
          <View style={styles.contentWrap}>
            {/* About Section */}
            {business.about ? (
              <InfoSection title="About Specialist" icon="information-circle-outline">
                <Text style={styles.aboutText}>{business.about}</Text>
              </InfoSection>
            ) : null}

            {/* Pricing Grid */}
            <InfoSection title="Services Pricing" icon="cash-outline">
              <View style={styles.pricingContainer}>
                <View style={styles.priceRow}>
                  <View style={styles.priceLeft}>
                    <Ionicons name="car-outline" size={16} color={Colors.primary} />
                    <Text style={styles.priceLabel}>Visit / Callout Fee</Text>
                  </View>
                  <Text style={styles.priceValue}>Rs. {business.pricing.calloutFee || 'Free'}</Text>
                </View>
                <View style={styles.priceRowDivider} />
                <View style={styles.priceRow}>
                  <View style={styles.priceLeft}>
                    <Ionicons name="time-outline" size={16} color={Colors.primary} />
                    <Text style={styles.priceLabel}>Hourly Charging Rate</Text>
                  </View>
                  <Text style={styles.priceValue}>Rs. {business.pricing.hourlyRate || 'Flexible'}</Text>
                </View>
                <View style={styles.priceRowDivider} />
                <View style={styles.priceRow}>
                  <View style={styles.priceLeft}>
                    <Ionicons name="wallet-outline" size={16} color={Colors.primary} />
                    <Text style={styles.priceLabel}>Minimum Project Charge</Text>
                  </View>
                  <Text style={styles.priceValue}>Rs. {business.pricing.minCharge || 'Negotiable'}</Text>
                </View>
              </View>
            </InfoSection>

            {/* Offered Services */}
            {business.services.length > 0 && (
              <InfoSection title="Offered Services" icon="briefcase-outline">
                <View style={styles.tagsContainer}>
                  {business.services.map((item, idx) => (
                    <View key={idx} style={styles.tagPill}>
                      <Ionicons name="checkmark" size={12} color={Colors.primary} style={{ marginRight: 4 }} />
                      <Text style={styles.tagText}>{item}</Text>
                    </View>
                  ))}
                </View>
              </InfoSection>
            )}

            {/* Specializations list */}
            {business.specializations.length > 0 && (
              <InfoSection title="Specializations" icon="sparkles-outline">
                <View style={styles.tagsContainer}>
                  {business.specializations.map((item, idx) => (
                    <View key={idx} style={[styles.tagPill, { backgroundColor: '#F0FDF4' }]}>
                      <Ionicons name="ribbon-outline" size={12} color="#15803D" style={{ marginRight: 4 }} />
                      <Text style={[styles.tagText, { color: '#15803D' }]}>{item}</Text>
                    </View>
                  ))}
                </View>
              </InfoSection>
            )}

            {/* Work Location Details */}
            <InfoSection title="Work Location & Coverage" icon="map-outline">
              <View style={styles.locationContainer}>
                <View style={styles.locationDetail}>
                  <Ionicons name="pin" size={16} color={Colors.primary} style={{ marginRight: Spacing.sm }} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.locationTitle}>Main Base Area</Text>
                    <Text style={styles.locationSub}>{business.area}, {business.city}</Text>
                  </View>
                </View>
                
                {business.serviceAreas.length > 0 && (
                  <>
                    <View style={styles.locationDivider} />
                    <View style={styles.locationDetail}>
                      <Ionicons name="navigate" size={16} color={Colors.secondary} style={{ marginRight: Spacing.sm }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.locationTitle}>Service Areas Served</Text>
                        <Text style={styles.locationSub}>{business.serviceAreas.join(', ')}</Text>
                      </View>
                    </View>
                  </>
                )}

                {business.responseTime && (
                  <>
                    <View style={styles.locationDivider} />
                    <View style={styles.locationDetail}>
                      <Ionicons name="time" size={16} color="#D97706" style={{ marginRight: Spacing.sm }} />
                      <View style={{ flex: 1 }}>
                        <Text style={styles.locationTitle}>Avg. Response Time</Text>
                        <Text style={styles.locationSub}>{business.responseTime}</Text>
                      </View>
                    </View>
                  </>
                )}
              </View>
            </InfoSection>
          </View>
        ) : (
          /* Reviews Module content */
          <View style={styles.contentWrap}>
            {!hasContacted ? (
              /* User has not contacted warning */
              <View style={styles.warningContainer}>
                <Ionicons name="chatbubble-ellipses-outline" size={48} color={Colors.primary} style={{ marginBottom: Spacing.sm }} />
                <Text style={styles.warningTitle}>Contact this provider first</Text>
                <Text style={styles.warningSub}>You can leave a review only after contacting this provider.</Text>
              </View>
            ) : (
              /* Review list layout */
              <View style={styles.reviewsListContainer}>
                <InfoSection title="Customer Reviews" icon="star">
                  {MOCK_REVIEWS.map((rev) => (
                    <View key={rev.id} style={styles.reviewItem}>
                      <View style={styles.reviewHeader}>
                        <Text style={styles.reviewAuthor}>{rev.author}</Text>
                        <Text style={styles.reviewDate}>{rev.date}</Text>
                      </View>
                      <View style={styles.reviewStarsRow}>
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Ionicons 
                            key={idx} 
                            name={idx < rev.rating ? 'star' : 'star-outline'} 
                            size={13} 
                            color={Colors.accent} 
                            style={{ marginRight: 2 }}
                          />
                        ))}
                      </View>
                      <Text style={styles.reviewComment}>{rev.comment}</Text>
                    </View>
                  ))}
                </InfoSection>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Persistent Bottom Call to Action Bar */}
      <View style={styles.actionBar}>
        <TouchableOpacity style={[styles.actionBtn, styles.callBtn]} onPress={handleCall}>
          <Ionicons name="call" size={18} color={Colors.white} style={{ marginRight: 6 }} />
          <Text style={styles.actionBtnText}>Call</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionBtn, styles.waBtn]} onPress={handleWhatsApp}>
          <Ionicons name="logo-whatsapp" size={18} color={Colors.white} style={{ marginRight: 6 }} />
          <Text style={styles.actionBtnText}>WhatsApp</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.actionBtn, styles.msgBtn]} onPress={handleMessage}>
          <Ionicons name="chatbubble-ellipses" size={18} color={Colors.white} style={{ marginRight: 6 }} />
          <Text style={styles.actionBtnText}>Message</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function InfoSection({ title, icon, children }: { title: string; icon: keyof typeof Ionicons.glyphMap; children: React.ReactNode }) {
  return (
    <View style={sectionStyles.wrap}>
      <View style={sectionStyles.headerRow}>
        <Ionicons name={icon} size={18} color={Colors.secondary} />
        <Text style={sectionStyles.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  wrap: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: 6,
  },
  title: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: '800',
    color: Colors.secondary,
    fontFamily: Typography.fontFamily.bold,
  },
});

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: {
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.md,
    fontWeight: '700',
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
    fontFamily: Typography.fontFamily.bold,
  },
  errorBackBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8,
    borderRadius: BorderRadius.md,
  },
  errorBackText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.bold,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  
  // Banner layout
  bannerWrap: { position: 'relative' },
  banner: { width: '100%', height: 260, resizeMode: 'cover' },
  bannerPlaceholder: {
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    height: 260,
  },
  headerControls: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 55 : 45,
    left: Spacing.base,
    right: Spacing.base,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleBtn: {
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Overlap Profile card
  profileCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    marginTop: -60,
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.8)',
    ...Shadow.md,
  },
  profileRow: { flexDirection: 'row', gap: Spacing.md, alignItems: 'center' },
  avatarContainer: {
    position: 'relative',
    width: 78,
    height: 78,
  },
  avatar: { 
    width: '100%', 
    height: '100%', 
    borderRadius: 39,
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.primaryMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Typography.fontSize['3xl'],
    fontWeight: '800',
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
  },
  avatarVerifyBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.surface,
    borderRadius: 10,
  },
  profileInfo: { flex: 1 },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bizName: {
    fontSize: Typography.fontSize.md + 1,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  bizTitle: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily.medium,
  },
  badgesWrap: {
    flexDirection: 'row',
    gap: Spacing.xs,
    alignItems: 'center',
  },
  verifiedTextBadge: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  verifiedBadgeText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '800',
    fontFamily: Typography.fontFamily.bold,
  },
  availBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  availText: {
    fontSize: 9,
    fontWeight: '800',
    fontFamily: Typography.fontFamily.bold,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: { alignItems: 'center' },
  statValue: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.textMuted,
    marginTop: 2,
    fontFamily: Typography.fontFamily.medium,
  },
  statDivider: { width: 1, height: 28, backgroundColor: Colors.border },

  // Navigation Tabs Styling
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  tabButton: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  tabButtonActive: {
    borderBottomWidth: 3,
    borderBottomColor: Colors.primary,
  },
  tabButtonText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '600',
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.medium,
  },
  tabButtonTextActive: {
    color: Colors.primary,
    fontWeight: '800',
    fontFamily: Typography.fontFamily.bold,
  },

  // Content wraps
  contentWrap: {
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.sm,
  },
  aboutText: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 22,
    fontFamily: Typography.fontFamily.regular,
  },

  // Pricing styling
  pricingContainer: {
    gap: Spacing.sm,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 2,
  },
  priceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  priceLabel: {
    fontSize: Typography.fontSize.sm,
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.medium,
  },
  priceValue: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  priceRowDivider: {
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.5,
  },

  // Offered services and tags
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  tagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMuted,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
  },

  // Location info grid
  locationContainer: {
    gap: Spacing.md,
  },
  locationDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationTitle: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
    fontFamily: Typography.fontFamily.bold,
  },
  locationSub: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
    fontFamily: Typography.fontFamily.regular,
  },
  locationDivider: {
    height: 1,
    backgroundColor: Colors.border,
    opacity: 0.5,
  },

  // Review Styles
  reviewsListContainer: {
    marginTop: Spacing.xs,
  },
  reviewItem: {
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reviewAuthor: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  reviewStarsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  reviewDate: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.regular,
  },
  reviewComment: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textSecondary,
    lineHeight: 18,
    fontFamily: Typography.fontFamily.regular,
  },

  // Contact Warning State
  warningContainer: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.sm,
    ...Shadow.sm,
  },
  warningTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
    fontFamily: Typography.fontFamily.bold,
  },
  warningSub: {
    fontSize: Typography.fontSize.xs + 1,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    fontFamily: Typography.fontFamily.regular,
  },

  // Bottom action bar
  actionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.base,
    paddingTop: Spacing.md,
    paddingBottom: Platform.OS === 'ios' ? 34 : Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    ...Shadow.md,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.md,
    height: 44,
  },
  callBtn: { backgroundColor: Colors.secondary, ...Shadow.sm },
  waBtn: { backgroundColor: '#10B981', ...Shadow.sm },
  msgBtn: { backgroundColor: Colors.primary, ...Shadow.sm },
  actionBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: Typography.fontSize.sm,
    fontFamily: Typography.fontFamily.bold,
  },
});
