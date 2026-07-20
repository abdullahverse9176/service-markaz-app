import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { styles } from './SearchHistorySection.styles';

const POPULAR_TAGS = ['AC Cleaning', 'UPS Install', 'Wiring Fix', 'Sofa Washing', 'Leakage Pipe'];

interface SearchHistorySectionProps {
  recentSearches: string[];
  onClearRecent: () => void;
  onTagPress: (tag: string) => void;
}

export default function SearchHistorySection({
  recentSearches,
  onClearRecent,
  onTagPress
}: SearchHistorySectionProps) {
  return (
    <View>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <View style={styles.recentWrap}>
          <View style={styles.recentHeaderRow}>
            <Text style={styles.sectionHeadingMini}>Recent Searches</Text>
            <TouchableOpacity onPress={onClearRecent}>
              <Text style={styles.clearRecentLink}>Clear</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.recentTagsRow}>
            {recentSearches.map((item, idx) => (
              <TouchableOpacity 
                key={idx} 
                style={styles.recentTag} 
                onPress={() => onTagPress(item)}
              >
                <Ionicons name="time-outline" size={12} color={Colors.textSecondary} style={{ marginRight: 4 }} />
                <Text style={styles.recentTagText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Popular Tags */}
      <View style={styles.popularWrap}>
        <Text style={styles.sectionHeadingMini}>Popular Searches</Text>
        <View style={styles.popularTagsRow}>
          {POPULAR_TAGS.map((tag, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.popularTag} 
              onPress={() => onTagPress(tag)}
            >
              <Ionicons name="trending-up-outline" size={12} color={Colors.primary} style={{ marginRight: 4 }} />
              <Text style={styles.popularTagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
}
