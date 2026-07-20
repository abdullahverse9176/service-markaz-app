import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { formatRating } from '@/utils/format';
import type { Business } from '@/types/business';
import { styles } from './ProviderCard.styles';

interface ProviderCardProps {
  item: Business;
  isFav: boolean;
  onToggleFavorite: (id: string) => void;
  onWhatsApp: (phone: string) => void;
  onCall: (phone: string) => void;
}

export default function ProviderCard({
  item,
  isFav,
  onToggleFavorite,
  onWhatsApp,
  onCall
}: ProviderCardProps) {
  const isOpen = item.availability === 'Available';

  return (
    <View style={styles.providerCard}>
      {/* Main Content Area */}
      <TouchableOpacity 
        style={styles.cardHeader}
        onPress={() => router.push({ pathname: '/business/[id]', params: { id: item._id } })}
        activeOpacity={0.9}
      >
        {/* Left Image Section with Open Badge */}
        <View style={styles.imageContainer}>
          {item.profileImage ? (
            <Image source={{ uri: item.profileImage }} style={styles.providerImage} />
          ) : (
            <View style={styles.providerPlaceholderImage}>
              <Text style={styles.placeholderChar}>{item.name.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View style={[
            styles.openBadge, 
            { backgroundColor: isOpen ? '#10B981' : Colors.danger }
          ]}>
            <Text style={styles.openBadgeText}>{isOpen ? 'Open' : 'Closed'}</Text>
          </View>
        </View>

        {/* Right Info Section */}
        <View style={styles.infoContainer}>
          {/* Title and Fav Icon */}
          <View style={styles.titleRow}>
            <Text style={styles.providerName} numberOfLines={1}>{item.name}</Text>
            <TouchableOpacity onPress={() => onToggleFavorite(item._id)} style={styles.favBtn}>
              <Ionicons 
                name={isFav ? 'heart' : 'heart-outline'} 
                size={20} 
                color={isFav ? '#EF4444' : Colors.textMuted} 
              />
            </TouchableOpacity>
          </View>

          {/* Verification Checkmark */}
          {item.verification && (
            <View style={styles.verifiedRow}>
              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          )}

          {/* Rating Stars Row */}
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={14} color={Colors.accent} />
            <Text style={styles.ratingVal}>{formatRating(item.rating)}</Text>
            <Text style={styles.reviewsCount}>({item.reviewsCount} reviews)</Text>
          </View>

          {/* Category Icon Row */}
          <View style={styles.metaRow}>
            <Ionicons 
              name={item.category === 'Electrician' ? 'flash-outline' : 'construct-outline'} 
              size={13} 
              color={Colors.textSecondary} 
            />
            <Text style={styles.metaText}>{item.category}</Text>
          </View>

          {/* Distance Row */}
          <View style={styles.metaRow}>
            <Ionicons name="location-outline" size={13} color={Colors.textSecondary} />
            <Text style={styles.metaText}>
              {item.distanceKm ? `${item.distanceKm.toFixed(1)} km away` : `${item.area}`}
            </Text>
          </View>

          {/* Price Callout */}
          <Text style={styles.priceText}>
            Rs.{item.pricing?.calloutFee && item.pricing.calloutFee !== '0' 
              ? item.pricing.calloutFee 
              : 'Free'} <Text style={styles.priceLabelText}>Visit Charge</Text>
          </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.cardDivider} />

      {/* Bottom Metadata & CTA Action Section */}
      <View style={styles.cardFooter}>
        {/* Specs Rows */}
        <View style={styles.specColsRow}>
          <View style={styles.specCol}>
            <Text style={styles.specLabel}>Response Time</Text>
            <View style={styles.specValueRow}>
              <Ionicons name="flash" size={12} color={Colors.primary} />
              <Text style={styles.specValue}>{item.responseTime ?? '5 min'}</Text>
            </View>
          </View>
          <View style={styles.specColDivider} />
          <View style={styles.specCol}>
            <Text style={styles.specLabel}>Completed Jobs</Text>
            <View style={styles.specValueRow}>
              <Ionicons name="checkbox-outline" size={12} color="#10B981" />
              <Text style={styles.specValue}>{item.completedProjects ?? '120+'}</Text>
            </View>
          </View>
          <View style={styles.specColDivider} />
          <View style={styles.specCol}>
            <Text style={styles.specLabel}>Views</Text>
            <View style={styles.specValueRow}>
              <Ionicons name="eye-outline" size={12} color={Colors.secondary} />
              <Text style={styles.specValue}>{item.viewCount ? `${item.viewCount}` : '1.2k'}</Text>
            </View>
          </View>
        </View>

        {/* Action CTAs */}
        <View style={styles.actionsRow}>
          <TouchableOpacity 
            style={styles.whatsappBtn} 
            onPress={() => onWhatsApp(item.whatsapp || item.phone)}
          >
            <Ionicons name="logo-whatsapp" size={16} color="#10B981" style={{ marginRight: 4 }} />
            <Text style={styles.whatsappBtnText}>WhatsApp</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.callBtn} 
            onPress={() => onCall(item.phone)}
          >
            <Ionicons name="call" size={14} color={Colors.white} style={{ marginRight: 4 }} />
            <Text style={styles.callBtnText}>Call</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
