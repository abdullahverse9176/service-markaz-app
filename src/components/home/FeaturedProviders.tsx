import {
  View, Text, ScrollView, TouchableOpacity, Image
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { formatRating } from '@/utils/format';
import type { Business } from '@/types/business';
import { styles, FEATURED_CARD_WIDTH, FEATURED_GAP } from './FeaturedProviders.styles';

interface FeaturedProvidersProps {
  displayFeatured: Business[];
}

export default function FeaturedProviders({ displayFeatured }: FeaturedProvidersProps) {
  return (
    <View style={styles.featuredContainer}>
      <View style={styles.featuredHeaderRow}>
        <View style={styles.featuredTitleWrap}>
          <View style={styles.featuredTitleBadge}>
            <Ionicons name="sparkles" size={11} color={Colors.accentDark} />
            <Text style={styles.featuredBadgeText}>FEATURED EXPERTS</Text>
          </View>
          <Text style={styles.featuredSectionTitle}>Top Rated Specialists</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(customer)/services')}>
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
  );
}
