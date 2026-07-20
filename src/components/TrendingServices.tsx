import {
  View, Text, ScrollView, TouchableOpacity, Image
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { styles, TRENDING_CARD_WIDTH, TRENDING_GAP } from './TrendingServices.styles';

const TRENDING_SERVICES = [
  {
    id: 'trend-1',
    title: 'AC Jet Deep Cleaning',
    category: 'AC Repair',
    price: 'Rs. 1,499',
    originalPrice: 'Rs. 1,999',
    discount: '25% OFF',
    rating: '4.9',
    reviews: '142',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300',
  },
  {
    id: 'trend-2',
    title: 'Sofa Shampooing & Cleaning',
    category: 'Cleaning',
    price: 'Rs. 299/seat',
    originalPrice: 'Rs. 399/seat',
    discount: '25% OFF',
    rating: '4.8',
    reviews: '96',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=300',
  },
  {
    id: 'trend-3',
    title: 'Home DB Board Repair',
    category: 'Electrician',
    price: 'Rs. 799',
    originalPrice: 'Rs. 999',
    discount: '20% OFF',
    rating: '4.9',
    reviews: '88',
    image: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=300',
  },
  {
    id: 'trend-4',
    title: 'Kitchen Exhaust Cleaning',
    category: 'Cleaning',
    price: 'Rs. 1,799',
    originalPrice: 'Rs. 2,199',
    discount: '18% OFF',
    rating: '4.7',
    reviews: '67',
    image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=300',
  },
  {
    id: 'trend-5',
    title: 'Bathroom Water Leakage Fix',
    category: 'Plumber',
    price: 'Rs. 1,199',
    originalPrice: 'Rs. 1,499',
    discount: '20% OFF',
    rating: '4.8',
    reviews: '115',
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=300',
  }
];

export default function TrendingServices() {
  return (
    <View style={styles.trendingContainer}>
      <View style={styles.sectionHeaderRow}>
        <View>
          <Text style={styles.sectionTitle}>Trending Services</Text>
          <Text style={styles.sectionSubtitle}>Book popular services with exclusive discount rates</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(customer)/search')}>
          <Text style={styles.seeAllLink}>See All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={TRENDING_CARD_WIDTH + TRENDING_GAP}
        snapToAlignment="start"
        contentContainerStyle={styles.trendingScroll}
        scrollEventThrottle={16}
      >
        {TRENDING_SERVICES.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.trendingCard}
            onPress={() => {
              router.push({
                pathname: '/(customer)/search',
                params: { category: item.category }
              });
            }}
            activeOpacity={0.9}
          >
            {/* Card Image with discount badge */}
            <View style={styles.trendImageWrap}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.trendImage} />
              ) : (
                <View style={styles.trendPlaceholder}>
                  <Ionicons name="sparkles-outline" size={24} color={Colors.primary} />
                </View>
              )}
              <View style={styles.trendDiscountBadge}>
                <Text style={styles.trendDiscountText}>{item.discount}</Text>
              </View>
            </View>

            {/* Card Details */}
            <View style={styles.trendBody}>
              <Text style={styles.trendCategory} numberOfLines={1}>{item.category}</Text>
              <Text style={styles.trendTitle} numberOfLines={1}>{item.title}</Text>

              {/* Rating */}
              <View style={styles.trendRatingRow}>
                <Ionicons name="star" size={11} color={Colors.accent} />
                <Text style={styles.trendRatingVal}>{item.rating}</Text>
                <Text style={styles.trendReviews}>({item.reviews})</Text>
              </View>

              {/* Pricing & Add Button */}
              <View style={styles.trendFooter}>
                <View>
                  <Text style={styles.trendPrice}>{item.price}</Text>
                  <Text style={styles.trendOriginalPrice}>{item.originalPrice}</Text>
                </View>
                <View style={styles.trendAddBtn}>
                  <Ionicons name="add" size={14} color={Colors.white} />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
