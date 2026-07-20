import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { styles } from './SearchFiltersCard.styles';

interface SearchFiltersCardProps {
  nearMe: boolean;
  onToggleNearMe: () => void;
  rating4Plus: boolean;
  setRating4Plus: (val: boolean) => void;
  verified: boolean;
  setVerified: (val: boolean) => void;
  featured: boolean;
  setFeatured: (val: boolean) => void;
  available: boolean;
  setAvailable: (val: boolean) => void;
  sort: 'rating' | 'newest' | 'experience';
  onCycleSort: () => void;
  sortLabel: string;
  priceRange: 'All' | 'budget' | 'mid' | 'premium';
  onSelectPriceRange: (range: 'All' | 'budget' | 'mid' | 'premium') => void;
}

export default function SearchFiltersCard({
  nearMe,
  onToggleNearMe,
  rating4Plus,
  setRating4Plus,
  verified,
  setVerified,
  featured,
  setFeatured,
  available,
  setAvailable,
  sort,
  onCycleSort,
  sortLabel,
  priceRange,
  onSelectPriceRange
}: SearchFiltersCardProps) {
  return (
    <View>
      {/* Advanced Filters Card Wrap */}
      <View style={styles.settingsCard}>
        <Text style={styles.cardHeading}>Quick Criteria</Text>
        
        {/* Quick Filters Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
          <TouchableOpacity 
            style={[styles.chip, nearMe && styles.chipActive]} 
            onPress={onToggleNearMe}
          >
            <Ionicons 
              name="navigate-outline" 
              size={14} 
              color={nearMe ? Colors.white : Colors.primary} 
              style={styles.chipIcon} 
            />
            <Text style={[styles.chipText, nearMe && styles.chipTextActive]}>Near Me</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.chip, rating4Plus && styles.chipActive]} 
            onPress={() => setRating4Plus(!rating4Plus)}
          >
            <Ionicons 
              name="star" 
              size={14} 
              color={rating4Plus ? Colors.white : Colors.accent} 
              style={styles.chipIcon} 
            />
            <Text style={[styles.chipText, rating4Plus && styles.chipTextActive]}>4.5+</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.chip, verified && styles.chipActive]} 
            onPress={() => setVerified(!verified)}
          >
            <Ionicons 
              name="checkmark-circle" 
              size={14} 
              color={verified ? Colors.white : '#10B981'} 
              style={styles.chipIcon} 
            />
            <Text style={[styles.chipText, verified && styles.chipTextActive]}>Verified</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.chip, featured && styles.chipActive]} 
            onPress={() => setFeatured(!featured)}
          >
            <Ionicons 
              name="flame" 
              size={14} 
              color={featured ? Colors.white : '#EF4444'} 
              style={styles.chipIcon} 
            />
            <Text style={[styles.chipText, featured && styles.chipTextActive]}>Featured</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.chip, available && styles.chipActive]} 
            onPress={() => setAvailable(!available)}
          >
            <View style={[
              styles.statusDotIcon, 
              { backgroundColor: available ? Colors.white : '#10B981' }
            ]} />
            <Text style={[styles.chipText, available && styles.chipTextActive]}>Open Now</Text>
          </TouchableOpacity>
        </ScrollView>

        <View style={styles.divider} />

        {/* Sort Results */}
        <Text style={styles.cardHeading}>Sort Order</Text>
        <TouchableOpacity style={styles.sortRowBtn} onPress={onCycleSort}>
          <Ionicons name="funnel-outline" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
          <Text style={styles.sortLabel}>Active Sorting: <Text style={styles.sortValueText}>{sortLabel}</Text></Text>
          <Ionicons name="swap-vertical" size={16} color={Colors.textSecondary} style={{ marginLeft: 'auto' }} />
        </TouchableOpacity>
      </View>

      {/* Budget Filters Card */}
      <View style={styles.settingsCard}>
        <Text style={styles.cardHeading}>Specialist Visit Fee Budget</Text>
        <Text style={styles.cardSubtext}>Filter experts based on home consultation check-up fees</Text>
        
        <View style={styles.budgetGrid}>
          <TouchableOpacity 
            style={[styles.budgetTab, priceRange === 'All' && styles.budgetTabActive]}
            onPress={() => onSelectPriceRange('All')}
          >
            <Text style={[styles.budgetTabText, priceRange === 'All' && styles.budgetTabTextActive]}>Any Price</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.budgetTab, priceRange === 'budget' && styles.budgetTabActive]}
            onPress={() => onSelectPriceRange('budget')}
          >
            <Text style={[styles.budgetTabText, priceRange === 'budget' && styles.budgetTabTextActive]}>≤ Rs.400</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.budgetTab, priceRange === 'mid' && styles.budgetTabActive]}
            onPress={() => onSelectPriceRange('mid')}
          >
            <Text style={[styles.budgetTabText, priceRange === 'mid' && styles.budgetTabTextActive]}>Rs.401 - 800</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.budgetTab, priceRange === 'premium' && styles.budgetTabActive]}
            onPress={() => onSelectPriceRange('premium')}
          >
            <Text style={[styles.budgetTabText, priceRange === 'premium' && styles.budgetTabTextActive]}>Rs.800+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
