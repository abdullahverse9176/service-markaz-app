import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl, Image, ScrollView,
  Dimensions, LayoutAnimation, Platform, UIManager
} from 'react-native';
import { router } from 'expo-router';
import { useState, useRef } from 'react';
import { useBusinesses } from '@/hooks/useBusinesses';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius, Shadow } from '@/constants/theme';
import { formatRating, getInitials } from '@/utils/format';
import type { Business } from '@/types/business';
import { Ionicons } from '@expo/vector-icons';

// Enable layout animations for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const FEATURED_CARD_WIDTH = SCREEN_WIDTH - 64;
const FEATURED_GAP = 12;

// 8 Popular categories with custom icon backgrounds and theme colors
const POPULAR_CATEGORIES = [
  { name: 'All', icon: 'grid-outline' as const, bg: '#E6F6F0', color: Colors.primary },
  { name: 'AC Repair', icon: 'snow-outline' as const, bg: '#E0F2FE', color: '#0284C7' },
  { name: 'Electrician', icon: 'flash-outline' as const, bg: '#FEF3C7', color: '#D97706' },
  { name: 'Plumber', icon: 'build-outline' as const, bg: '#E2F8F5', color: '#0D9488' },
  { name: 'Carpenter', icon: 'construct-outline' as const, bg: '#FFEDD5', color: '#EA580C' },
  { name: 'Cleaning', icon: 'sparkles-outline' as const, bg: '#DCFCE7', color: '#15803D' },
  { name: 'Painter', icon: 'color-palette-outline' as const, bg: '#F3E8FF', color: '#7E22CE' },
  { name: 'Tutor', icon: 'book-outline' as const, bg: '#FEE2E2', color: '#B91C1C' },
  { name: 'Beautician', icon: 'cut-outline' as const, bg: '#FCE7F3', color: '#BE185D' },
];

const PROMO_SLIDES = [
  {
    title: 'Verified Professionals',
    desc: 'Get up to 20% off on your first service booking today!',
    btnText: 'Browse Services',
    icon: 'sparkles' as const,
    bg: Colors.secondary,
  },
  {
    title: 'Satisfaction Guaranteed',
    desc: '100% money-back or free re-service if you are not satisfied.',
    btnText: 'Learn More',
    icon: 'shield-checkmark' as const,
    bg: Colors.primary,
  },
  {
    title: '24/7 Priority Support',
    desc: 'Our customer support team is always online to help you.',
    btnText: 'Contact Support',
    icon: 'headset' as const,
    bg: '#D97706',
  }
];

const HOW_IT_WORKS = [
  { step: '1', title: 'Select Service', desc: 'Choose from 25+ trusted services', icon: 'search-outline' as const },
  { step: '2', title: 'Book Provider', desc: 'Choose the best specialist near you', icon: 'calendar-outline' as const },
  { step: '3', title: 'Pay & Enjoy', desc: 'Pay securely after task completion', icon: 'happy-outline' as const },
];

const WHY_CHOOSE_US = [
  { title: 'Verified Experts', desc: '100% background checked & vetted profiles', icon: 'shield-outline' as const, color: '#00A76D' },
  { title: 'Quick Booking', desc: 'Connect with available experts in 30 mins', icon: 'flash-outline' as const, color: '#F59E0B' },
  { title: '24/7 Support', desc: 'Live agent assistance whenever you need', icon: 'chatbubbles-outline' as const, color: '#002D62' },
  { title: 'Budget Friendly', desc: 'Transparent upfront pricing. No hidden fees', icon: 'cash-outline' as const, color: '#EF4444' },
];

const FAQS = [
  { q: 'How do I book a service provider?', a: 'Just search for your required service or tap a category. Choose a top-rated provider, view their rates and customer reviews, and tap "Contact" or "Request Service" to submit an inquiry.' },
  { q: 'Are there any visit or callout charges?', a: 'Some specialists may specify a nominal Callout Fee to cover travel costs, while others offer "Free Visit". The callout charges are visible upfront on the provider profile.' },
  { q: 'How are specialists verified on Service Markaz?', a: 'Every provider goes through a verification process where we check their identity documents (CNIC/license), experience, past customer feedback, and professional certifications.' },
  { q: 'Can I register as a service provider?', a: 'Absolutely! If you offer any services, you can register as a provider by clicking "Want to Offer Services" below or changing your role in your Profile settings.' },
];

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
  const [activePromo, setActivePromo] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

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

  const toggleFaq = (index: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* 1. Brand & Location Hero Section */}
      <View style={styles.heroBackground}>
        {/* Top Navbar */}
        <View style={styles.welcomeRow}>
          <View>
            <Text style={styles.brandTitle}>
              <Text style={styles.brandTextWhite}>Service </Text>
              <Text style={styles.brandTextGreen}>Markaz</Text>
            </Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={14} color={Colors.primary} />
              <Text style={styles.locationText}>Islamabad, PK</Text>
              <Ionicons name="chevron-down" size={12} color="rgba(255,255,255,0.6)" style={{ marginLeft: 2 }} />
            </View>
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
                <Ionicons name="person-outline" size={20} color={Colors.white} />
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Welcome Tagline */}
        <View style={styles.welcomeMainRow}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Text style={styles.greetingText}>
              {isAuthenticated ? `Salam, ${user?.name.split(' ')[0]}` : 'Salam, Guest'}
            </Text>
            <Ionicons name="hand-right" size={15} color="#F59E0B" style={{ marginLeft: 4 }} />
          </View>
          <Text style={styles.heroTitle}>Find Trusted Service Providers Near You</Text>
        </View>

        {/* Overlapping Search Box */}
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={Colors.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="What service do you need today?"
            placeholderTextColor={Colors.textMuted}
            value={search}
            onChangeText={setSearch}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          {search.length > 0 ? (
            <TouchableOpacity onPress={() => { setSearch(''); setActiveSearch(''); }} style={styles.clearSearchBtn}>
              <Ionicons name="close" size={18} color={Colors.textMuted} />
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
            <Ionicons name="arrow-forward" size={18} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Spacer to handle the search box offset */}
      <View style={styles.searchSpacer} />

      {/* 2. Quick Stats Counters */}
      <View style={styles.statsCard}>
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>50k+</Text>
          <Text style={styles.statLabel}>Happy Users</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>3,200+</Text>
          <Text style={styles.statLabel}>Verified Experts</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statCol}>
          <Text style={styles.statNumber}>4.8/5</Text>
          <Text style={styles.statLabel}>Avg Rating</Text>
        </View>
      </View>

      {/* Featured Providers Slider */}
      {displayFeatured.length > 0 && (
        <View style={styles.featuredContainer}>
          <View style={styles.featuredHeaderRow}>
            <View style={styles.featuredTitleWrap}>
              <View style={styles.featuredTitleBadge}>
                <Ionicons name="sparkles" size={11} color={Colors.accentDark} />
                <Text style={styles.featuredBadgeText}>FEATURED EXPERTS</Text>
              </View>
              <Text style={styles.featuredSectionTitle}>Top Rated Specialists</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(customer)/search')}>
              <Text style={styles.featuredSeeAll}>See All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={FEATURED_CARD_WIDTH + FEATURED_GAP}
            snapToAlignment="start"
            contentContainerStyle={styles.featuredScroll}
            scrollEventThrottle={16}
          >
            {displayFeatured.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.featuredCard}
                onPress={() => router.push({ pathname: '/business/[id]', params: { id: item._id } })}
                activeOpacity={0.95}
              >
                {/* Left Side: Info */}
                <View style={styles.featCardLeft}>
                  {/* Category & Verified Badge */}
                  <View style={styles.featCategoryRow}>
                    <Text style={styles.featCategoryText} numberOfLines={1}>{item.category}</Text>
                    {item.verification && (
                      <Ionicons name="checkmark-circle" size={13} color={Colors.primary} style={{ marginLeft: 4 }} />
                    )}
                  </View>

                  {/* Provider Name */}
                  <Text style={styles.featNameText} numberOfLines={1}>{item.name}</Text>
                  
                  {/* Title / Bio */}
                  <Text style={styles.featTitleText} numberOfLines={2}>{item.title || item.about}</Text>

                  {/* Rating / Experience Row */}
                  <View style={styles.featRatingRow}>
                    <View style={styles.featStarsContainer}>
                      <Ionicons name="star" size={12} color={Colors.accent} />
                      <Text style={styles.featRatingVal}>{formatRating(item.rating)}</Text>
                      <Text style={styles.featReviewsCount}>({item.reviewsCount})</Text>
                    </View>
                    {item.experience > 0 && (
                      <Text style={styles.featExpText}>{item.experience} yrs exp</Text>
                    )}
                  </View>

                  <View style={styles.featFooterDivider} />

                  {/* Cost & Booking CTA */}
                  <View style={styles.featFooterRow}>
                    <View>
                      <Text style={styles.featPriceLabel}>Callout Fee</Text>
                      <Text style={styles.featPriceVal}>
                        {item.pricing?.calloutFee && item.pricing.calloutFee !== '0'
                          ? `Rs. ${item.pricing.calloutFee}`
                          : 'Free Visit'}
                      </Text>
                    </View>
                    
                    <View style={styles.featBookBtn}>
                      <Text style={styles.featBookBtnText}>Book</Text>
                      <Ionicons name="arrow-forward-sharp" size={10} color={Colors.white} style={{ marginLeft: 2 }} />
                    </View>
                  </View>
                </View>

                {/* Right Side: Profile Image */}
                <View style={styles.featCardRight}>
                  {item.profileImage ? (
                    <Image source={{ uri: item.profileImage }} style={styles.featImage} />
                  ) : (
                    <View style={styles.featPlaceholder}>
                      <Text style={styles.featPlaceholderText}>
                        {item.name.charAt(0).toUpperCase()}
                      </Text>
                    </View>
                  )}
                  {/* Absolute Badge for availability status */}
                  <View style={[
                    styles.featStatusBadge,
                    { backgroundColor: item.availability === 'Available' ? Colors.primary : Colors.danger }
                  ]}>
                    <Text style={styles.featStatusText}>
                      {item.availability === 'Available' ? 'Online' : 'Offline'}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 3. Promo Slider (Paging Banners) */}
      <View style={styles.promoContainer}>
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={(e) => {
            const slide = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - Spacing.base * 2));
            if (slide !== activePromo) setActivePromo(slide);
          }}
          scrollEventThrottle={16}
          contentContainerStyle={styles.promoScroll}
        >
          {PROMO_SLIDES.map((slide, index) => (
            <View key={index} style={[styles.promoCard, { backgroundColor: slide.bg }]}>
              <View style={styles.promoContent}>
                <Text style={styles.promoTitle}>{slide.title}</Text>
                <Text style={styles.promoDesc}>{slide.desc}</Text>
                <TouchableOpacity 
                  style={styles.promoBtn} 
                  onPress={() => router.push(index === 2 ? '/(customer)/profile' : '/(customer)/search')}
                >
                  <Text style={styles.promoBtnText}>{slide.btnText}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.promoIconWrap}>
                <Ionicons name={slide.icon} size={64} color="rgba(255, 255, 255, 0.15)" />
              </View>
            </View>
          ))}
        </ScrollView>
        {/* Pager Indicators */}
        <View style={styles.pagerDots}>
          {PROMO_SLIDES.map((_, i) => (
            <View 
              key={i} 
              style={[
                styles.pagerDot, 
                i === activePromo && styles.pagerDotActive
              ]} 
            />
          ))}
        </View>
      </View>

      {/* 4. Popular Services Grid */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Services</Text>
        <Text style={styles.sectionSubtitle}>Find high quality experts for all your home needs</Text>
      </View>
      <View style={styles.categoriesGrid}>
        {POPULAR_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <TouchableOpacity
              key={cat.name}
              style={[
                styles.categoryGridItem,
                isActive && styles.categoryGridItemActive
              ]}
              onPress={() => selectCategory(cat.name)}
              activeOpacity={0.85}
            >
              <View style={[styles.categoryIconCircle, { backgroundColor: cat.bg }]}>
                <Ionicons name={cat.icon} size={22} color={cat.color} />
              </View>
              <Text style={[styles.categoryGridLabel, isActive && styles.categoryGridLabelActive]} numberOfLines={1}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 5. Top Rated Specialists Horizontal Slider */}
      {topRatedProviders.length > 0 && (
        <View style={styles.topRatedContainer}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={styles.sectionTitle}>Top Rated Specialists</Text>
              <Text style={styles.sectionSubtitle}>Verified professionals with excellent feedback</Text>
            </View>
            <TouchableOpacity onPress={() => router.push('/(customer)/search')}>
              <Text style={styles.seeAllLink}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.topRatedScroll}
          >
            {topRatedProviders.map((item) => (
              <TouchableOpacity
                key={item._id}
                style={styles.topRatedCard}
                onPress={() => router.push({ pathname: '/business/[id]', params: { id: item._id } })}
                activeOpacity={0.9}
              >
                <View style={styles.trImageWrap}>
                  {item.profileImage ? (
                    <Image source={{ uri: item.profileImage }} style={styles.trImage} />
                  ) : (
                    <View style={styles.trPlaceholder}>
                      <Text style={styles.trPlaceholderText}>{item.name.charAt(0).toUpperCase()}</Text>
                    </View>
                  )}
                  {item.verification && (
                    <View style={styles.trVerifyBadge}>
                      <Ionicons name="checkmark-sharp" size={10} color={Colors.white} />
                    </View>
                  )}
                </View>
                <View style={styles.trBody}>
                  <Text style={styles.trName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.trCategory}>{item.category}</Text>
                  
                  <View style={styles.trRatingRow}>
                    <Ionicons name="star" size={14} color={Colors.accent} />
                    <Text style={styles.trRatingVal}>{formatRating(item.rating)}</Text>
                    <Text style={styles.trReviewsCount}>({item.reviewsCount})</Text>
                  </View>

                  <View style={styles.trDivider} />

                  <View style={styles.trFooter}>
                    <Text style={styles.trPrice}>
                      {item.pricing?.calloutFee && item.pricing.calloutFee !== '0'
                        ? `Rs. ${item.pricing.calloutFee}`
                        : 'Free Visit'}
                    </Text>
                    <View style={[styles.trStatusDot, { backgroundColor: item.availability === 'Available' ? Colors.primary : Colors.danger }]} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* 6. How It Works Section */}
      <View style={styles.howItWorksWrap}>
        <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>How It Works</Text>
        <Text style={[styles.sectionSubtitle, { textAlign: 'center', marginBottom: Spacing.lg }]}>
          Get your job done in three easy steps
        </Text>
        <View style={styles.stepsRow}>
          {HOW_IT_WORKS.map((step, idx) => (
            <View key={idx} style={styles.stepCol}>
              <View style={styles.stepIconOuter}>
                <Ionicons name={step.icon} size={24} color={Colors.primary} />
                {/* <View style={styles.stepNumberBadge}>
                  <Text style={styles.stepNumberText}>{step.step}</Text>
                </View> */}
              </View>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 7. Why Choose Us Section */}
      <View style={styles.whyChooseWrap}>
        <Text style={styles.sectionTitle}>Why Choose Service Markaz?</Text>
        <Text style={[styles.sectionSubtitle, { marginBottom: Spacing.lg }]}>We ensure transparency, speed, and safety</Text>
        <View style={styles.whyGrid}>
          {WHY_CHOOSE_US.map((item, idx) => (
            <View key={idx} style={styles.whyCard}>
              <View style={[styles.whyIconWrap, { backgroundColor: item.color + '15' }]}>
                <Ionicons name={item.icon} size={22} color={item.color} />
              </View>
              <View style={styles.whyInfo}>
                <Text style={styles.whyCardTitle}>{item.title}</Text>
                <Text style={styles.whyCardDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 8. Collapsible FAQ Section */}
      {/* <View style={styles.faqWrap}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Text style={[styles.sectionSubtitle, { marginBottom: Spacing.md }]}>Have questions? Find quick answers below</Text>
        {FAQS.map((faq, index) => {
          const isOpen = expandedFaq === index;
          return (
            <View key={index} style={[styles.faqCard, isOpen && styles.faqCardOpen]}>
              <TouchableOpacity 
                style={styles.faqHeader} 
                onPress={() => toggleFaq(index)}
                activeOpacity={0.8}
              >
                <Text style={[styles.faqQuestion, isOpen && styles.faqQuestionActive]}>{faq.q}</Text>
                <Ionicons 
                  name={isOpen ? 'chevron-up' : 'chevron-down'} 
                  size={16} 
                  color={isOpen ? Colors.primary : Colors.textSecondary} 
                />
              </TouchableOpacity>
              {isOpen && (
                <View style={styles.faqAnswerContainer}>
                  <Text style={styles.faqAnswer}>{faq.a}</Text>
                </View>
              )}
            </View>
          );
        })}
      </View> */}

      {/* 9. Dual CTA Banners */}
      <View style={styles.dualCTAWrap}>
        <View style={styles.ctaBoxLeft}>
          <Text style={styles.ctaTitle}>Looking for Services?</Text>
          <Text style={styles.ctaDesc}>Get high-quality service providers for your home instantly.</Text>
          <TouchableOpacity 
            style={[styles.ctaBtn, { backgroundColor: Colors.primary }]}
            onPress={() => router.push('/(customer)/search')}
          >
            <Text style={styles.ctaBtnText}>Find Specialist</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.ctaBoxRight}>
          <Text style={[styles.ctaTitle, { color: Colors.white }]}>Want to Offer Services?</Text>
          <Text style={[styles.ctaDesc, { color: 'rgba(255,255,255,0.8)' }]}>Join as a service partner and grow your local business today.</Text>
          <TouchableOpacity 
            style={[styles.ctaBtn, { backgroundColor: Colors.white }]}
            onPress={() => {
              if (isAuthenticated) {
                router.push('/(customer)/profile');
              } else {
                router.push('/(auth)/login');
              }
            }}
          >
            <Text style={[styles.ctaBtnText, { color: Colors.secondary }]}>Become Provider</Text>
          </TouchableOpacity>
        </View>
      </View>
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
  
  // Hero Header Styles
  heroBackground: {
    backgroundColor: Colors.secondary,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    paddingTop: 30,
    paddingHorizontal: Spacing.base,
    paddingBottom: 40,
    position: 'relative',
  },
  welcomeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  brandTitle: {
    fontSize: Typography.fontSize.lg,
    fontWeight: '900',
    letterSpacing: 0.5,
    fontFamily: Typography.fontFamily.extraBold,
  },
  brandTextWhite: {
    color: Colors.white,
  },
  brandTextGreen: {
    color: Colors.primary,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  locationText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: Typography.fontSize.xs,
    fontWeight: '600',
    marginLeft: 3,
    fontFamily: Typography.fontFamily.semiBold,
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatar: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  guestAvatar: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  avatarText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
  },
  welcomeMainRow: {
    marginBottom: Spacing.lg,
  },
  greetingText: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.75)',
    marginBottom: 4,
    fontFamily: Typography.fontFamily.medium,
  },
  heroTitle: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: Colors.white,
    lineHeight: 28,
    fontFamily: Typography.fontFamily.extraBold,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    height: 52,
    position: 'absolute',
    bottom: -26,
    left: Spacing.base,
    right: Spacing.base,
    ...Shadow.md,
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
  clearSearchBtn: {
    padding: Spacing.xs,
  },
  searchBtn: {
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  searchSpacer: {
    height: 38,
  },

  // Stats Card Styles
  statsCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginHorizontal: Spacing.base,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    justifyContent: 'space-around',
    alignItems: 'center',
    ...Shadow.sm,
  },
  statCol: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    color: Colors.secondary,
    fontFamily: Typography.fontFamily.bold,
  },
  statLabel: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
    fontFamily: Typography.fontFamily.medium,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.border,
  },

  // Promo Banner Carousel Styles
  promoContainer: {
    marginBottom: Spacing.xl,
  },
  promoScroll: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
  },
  promoCard: {
    width: SCREEN_WIDTH - Spacing.base * 2,
    height: 140,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontFamily: Typography.fontFamily.bold,
  },
  promoDesc: {
    fontSize: Typography.fontSize.xs,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: Spacing.md,
    lineHeight: 16,
    fontFamily: Typography.fontFamily.regular,
  },
  promoBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  promoBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
  },
  promoIconWrap: {
    position: 'absolute',
    right: -10,
    bottom: -10,
  },
  pagerDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: 6,
  },
  pagerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.border,
  },
  pagerDotActive: {
    backgroundColor: Colors.primary,
    width: 12,
  },

  // Section Headers
  sectionHeader: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  sectionSubtitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginTop: 2,
    fontFamily: Typography.fontFamily.regular,
  },
  seeAllLink: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },

  // Popular Services Grid Styles
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: Spacing.base - 4,
    justifyContent: 'space-between',
    marginBottom: Spacing.xl,
  },
  categoryGridItem: {
    width: '22%',
    alignItems: 'center',
    marginBottom: Spacing.base,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.md,
  },
  categoryGridItemActive: {
    backgroundColor: Colors.surfaceHigh,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  categoryIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
    ...Shadow.sm,
  },
  categoryGridLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    fontFamily: Typography.fontFamily.medium,
  },
  categoryGridLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },

  // Top Rated Section Styles
  topRatedContainer: {
    marginBottom: Spacing.xl,
  },
  topRatedScroll: {
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base - Spacing.sm,
    gap: Spacing.md,
  },
  topRatedCard: {
    width: 175,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  trImageWrap: {
    height: 90,
    position: 'relative',
    backgroundColor: Colors.surfaceHigh,
  },
  trImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  trPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.secondaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trPlaceholderText: {
    fontSize: Typography.fontSize.xl,
    fontWeight: '800',
    color: Colors.secondary,
  },
  trVerifyBadge: {
    position: 'absolute',
    bottom: Spacing.sm,
    left: Spacing.sm,
    backgroundColor: Colors.primary,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  trBody: {
    padding: Spacing.sm,
  },
  trName: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  trCategory: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
    fontFamily: Typography.fontFamily.regular,
  },
  trRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 2,
  },
  trRatingVal: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  trReviewsCount: {
    fontSize: 10,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.regular,
  },
  trDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  trFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trPrice: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
  },
  trStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },

  // How It Works Styles
  howItWorksWrap: {
    backgroundColor: Colors.white,
    paddingVertical: Spacing.xl,
    paddingHorizontal: Spacing.base,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xl,
  },
  stepsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepCol: {
    width: '31%',
    alignItems: 'center',
  },
  stepIconOuter: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
    position: 'relative',
  },
  stepNumberBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.secondary,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },
  stepTitle: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
    textAlign: 'center',
    fontFamily: Typography.fontFamily.bold,
  },
  stepDesc: {
    fontSize: 9,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 12,
    fontFamily: Typography.fontFamily.regular,
  },

  // Why Choose Us Styles
  whyChooseWrap: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
  },
  whyGrid: {
    gap: Spacing.md,
  },
  whyCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    gap: Spacing.md,
    ...Shadow.sm,
  },
  whyIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  whyInfo: {
    flex: 1,
  },
  whyCardTitle: {
    fontSize: Typography.fontSize.sm,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 2,
    fontFamily: Typography.fontFamily.bold,
  },
  whyCardDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 15,
    fontFamily: Typography.fontFamily.regular,
  },

  // FAQ Section Styles
  faqWrap: {
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.xl,
  },
  faqCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    overflow: 'hidden',
  },
  faqCardOpen: {
    borderColor: Colors.primary,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  faqQuestion: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
    fontFamily: Typography.fontFamily.bold,
  },
  faqQuestionActive: {
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
  },
  faqAnswerContainer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  faqAnswer: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    lineHeight: 16,
    fontFamily: Typography.fontFamily.regular,
  },

  // Dual CTA Banners
  dualCTAWrap: {
    paddingHorizontal: Spacing.base,
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  ctaBoxLeft: {
    backgroundColor: Colors.secondaryMuted,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.secondaryLight + '15',
  },
  ctaBoxRight: {
    backgroundColor: Colors.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
  ctaTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    color: Colors.secondary,
    marginBottom: 4,
    fontFamily: Typography.fontFamily.bold,
  },
  ctaDesc: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 16,
    fontFamily: Typography.fontFamily.regular,
  },
  ctaBtn: {
    paddingVertical: 8,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignSelf: 'flex-start',
    ...Shadow.sm,
  },
  ctaBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.bold,
  },

  // Specialist Grid/List card
  listContent: {
    paddingBottom: 110,
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginHorizontal: Spacing.base,
    overflow: 'hidden',
    ...Shadow.sm,
  },
  cardImageWrap: {
    position: 'relative',
    height: 140,
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
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: '800',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
    fontFamily: Typography.fontFamily.bold,
  },
  cardPrice: {
    fontSize: Typography.fontSize.xs + 1,
    fontWeight: '800',
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
  },
  cardTitle: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    fontFamily: Typography.fontFamily.regular,
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
    fontFamily: Typography.fontFamily.regular,
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
    fontFamily: Typography.fontFamily.bold,
  },
  reviewText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textMuted,
    marginLeft: 2,
    fontFamily: Typography.fontFamily.regular,
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
    fontFamily: Typography.fontFamily.bold,
  },
  experienceText: {
    fontSize: Typography.fontSize.xs,
    color: Colors.textSecondary,
    fontWeight: '600',
    fontFamily: Typography.fontFamily.medium,
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
    fontFamily: Typography.fontFamily.bold,
  },
  emptySubtext: {
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: 'center',
    lineHeight: 16,
    fontSize: Typography.fontSize.xs,
    fontFamily: Typography.fontFamily.regular,
  },
  // Featured section styles
  featuredContainer: {
    marginBottom: Spacing.xl,
  },
  featuredHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    marginBottom: Spacing.sm,
  },
  featuredTitleWrap: {
    gap: 3,
  },
  featuredTitleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    paddingHorizontal: Spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
    gap: 4,
  },
  featuredBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: Colors.accentDark,
    letterSpacing: 0.5,
    fontFamily: Typography.fontFamily.extraBold,
  },
  featuredSectionTitle: {
    fontSize: Typography.fontSize.md,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  featuredSeeAll: {
    fontSize: Typography.fontSize.xs,
    color: Colors.primary,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },
  featuredScroll: {
    paddingLeft: Spacing.base,
    paddingRight: Spacing.base,
  },
  featuredCard: {
    width: FEATURED_CARD_WIDTH,
    height: 170,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    marginRight: FEATURED_GAP,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#FEF3C7', // soft golden border
    ...Shadow.md,
  },
  featCardLeft: {
    flex: 1.3,
    padding: Spacing.md,
    justifyContent: 'space-between',
  },
  featCategoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featCategoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: Typography.fontFamily.bold,
    backgroundColor: Colors.primaryMuted,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  featNameText: {
    fontSize: Typography.fontSize.sm + 1,
    fontWeight: '800',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
    marginTop: 4,
  },
  featTitleText: {
    fontSize: Typography.fontSize.xs - 1,
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.regular,
    marginTop: 2,
    lineHeight: 14,
  },
  featRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  featStarsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  featRatingVal: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
    fontFamily: Typography.fontFamily.bold,
  },
  featReviewsCount: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  featExpText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    fontFamily: Typography.fontFamily.medium,
  },
  featFooterDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 4,
  },
  featFooterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  featPriceLabel: {
    fontSize: 9,
    color: Colors.textMuted,
    fontFamily: Typography.fontFamily.regular,
  },
  featPriceVal: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
    fontFamily: Typography.fontFamily.bold,
  },
  featBookBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: Spacing.sm + 2,
    borderRadius: BorderRadius.sm,
    gap: 2,
  },
  featBookBtnText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Typography.fontFamily.bold,
  },
  featCardRight: {
    flex: 1,
    position: 'relative',
    height: '100%',
    backgroundColor: Colors.surfaceHigh,
  },
  featImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  featPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.secondaryMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featPlaceholderText: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.secondary,
  },
  featStatusBadge: {
    position: 'absolute',
    top: Spacing.xs + 2,
    right: Spacing.xs + 2,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: BorderRadius.sm,
    opacity: 0.9,
  },
  featStatusText: {
    fontSize: 9,
    color: Colors.white,
    fontWeight: '800',
    fontFamily: Typography.fontFamily.bold,
  },
});
