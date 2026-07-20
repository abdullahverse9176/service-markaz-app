import {
  View, Text, ScrollView, TouchableOpacity, Image
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { formatRating } from '@/utils/format';
import type { Business } from '@/types/business';
import { styles } from './TopRatedSpecialists.styles';

interface TopRatedSpecialistsProps {
  topRatedProviders: Business[];
}

export default function TopRatedSpecialists({
  topRatedProviders
}: TopRatedSpecialistsProps) {
  if (topRatedProviders.length === 0) return null;

  return (
    <View style={styles.topRatedContainer}>
      <View style={styles.sectionHeaderRow}>
        <View>
          <Text style={styles.sectionTitle}>Top Rated Specialists</Text>
          <Text style={styles.sectionSubtitle}>Verified professionals with excellent feedback</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(customer)/services')}>
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
  );
}
