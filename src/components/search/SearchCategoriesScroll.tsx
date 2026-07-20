import { ScrollView, TouchableOpacity, View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { styles } from './SearchCategoriesScroll.styles';

const SEARCH_CATEGORIES = [
  { label: 'Home Repair', name: 'Carpenter', icon: 'hammer-outline' as const, bg: '#E0F8F5', color: '#0D9488' },
  { label: 'Auto Services', name: 'Auto', icon: 'car-outline' as const, bg: '#E6F6F0', color: Colors.primary },
  { label: 'Beauty & Salon', name: 'Beautician', icon: 'cut-outline' as const, bg: '#FCE7F3', color: '#BE185D' },
  { label: 'Electricians', name: 'Electrician', icon: 'flash-outline' as const, bg: '#FEF3C7', color: '#D97706' },
  { label: 'Plumbing', name: 'Plumber', icon: 'water-outline' as const, bg: '#E0F2FE', color: '#0284C7' },
  { label: 'Cleaning', name: 'Cleaning', icon: 'sparkles-outline' as const, bg: '#DCFCE7', color: '#15803D' },
];

interface SearchCategoriesScrollProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

export default function SearchCategoriesScroll({
  selectedCategory,
  onSelectCategory
}: SearchCategoriesScrollProps) {
  return (
    <View>
      <Text style={styles.sectionHeading}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        <TouchableOpacity 
          style={styles.categoryItem} 
          onPress={() => onSelectCategory('All')}
        >
          <View style={[
            styles.categoryCircle, 
            { backgroundColor: '#EBF1F7' }, 
            selectedCategory === 'All' && styles.categoryCircleActive
          ]}>
            <Ionicons name="grid-outline" size={20} color={Colors.secondary} />
          </View>
          <Text style={[styles.categoryLabel, selectedCategory === 'All' && styles.categoryLabelActive]}>All</Text>
        </TouchableOpacity>

        {SEARCH_CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.name;
          return (
            <TouchableOpacity 
              key={cat.name} 
              style={styles.categoryItem} 
              onPress={() => onSelectCategory(cat.name)}
            >
              <View style={[
                styles.categoryCircle, 
                { backgroundColor: cat.bg },
                isActive && styles.categoryCircleActive
              ]}>
                <Ionicons name={cat.icon} size={20} color={cat.color} />
              </View>
              <Text style={[styles.categoryLabel, isActive && styles.categoryLabelActive]} numberOfLines={1}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
