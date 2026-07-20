import {
  View, Text, ScrollView, TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { styles } from './PopularCategories.styles';

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

interface PopularCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function PopularCategories({
  selectedCategory,
  onSelectCategory
}: PopularCategoriesProps) {
  return (
    <View>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Popular Services</Text>
        <Text style={styles.sectionSubtitle}>Find high quality experts for all your home needs</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesScroll}
      >
        {POPULAR_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <TouchableOpacity
              key={cat.name}
              style={[
                styles.categoryGridItem,
                isActive && styles.categoryGridItemActive
              ]}
              onPress={() => onSelectCategory(cat.name)}
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
      </ScrollView>
    </View>
  );
}
