import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { styles } from './ServicesHeader.styles';

interface ServicesHeaderProps {
  selectedCategory: string;
  activeSearch: string;
  totalFound: number;
  sort: string;
  verified: boolean;
  available: boolean;
  nearMe: boolean;
  rating4Plus: boolean;
  featured: boolean;
  priceRange: string;
}

export default function ServicesHeader({
  selectedCategory,
  activeSearch,
  totalFound,
  sort,
  verified,
  available,
  nearMe,
  rating4Plus,
  featured,
  priceRange
}: ServicesHeaderProps) {
  const handleAdjustFilters = () => {
    router.push({
      pathname: '/(customer)/search',
      params: {
        q: activeSearch,
        category: selectedCategory,
        sort,
        verified: verified ? 'true' : 'false',
        available: available ? 'true' : 'false',
        nearMe: nearMe ? 'true' : 'false',
        rating4Plus: rating4Plus ? 'true' : 'false',
        featured: featured ? 'true' : 'false',
        priceRange,
      }
    });
  };

  const getTitle = () => {
    if (selectedCategory !== 'All') return selectedCategory;
    if (activeSearch) return `Search: "${activeSearch}"`;
    return 'All Specialists';
  };

  return (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {getTitle()}
          </Text>
          <Text style={styles.headerSubtitle}>{totalFound} specialists found</Text>
        </View>
        <TouchableOpacity 
          style={styles.filterAdjustBtn} 
          onPress={handleAdjustFilters}
        >
          <Ionicons name="options-outline" size={22} color={Colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
