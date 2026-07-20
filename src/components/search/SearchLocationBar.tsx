import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { styles } from './SearchLocationBar.styles';

interface SearchLocationBarProps {
  onToggleNearMe: () => void;
}

export default function SearchLocationBar({ onToggleNearMe }: SearchLocationBarProps) {
  return (
    <View style={styles.locationRow}>
      <View style={styles.locationLeft}>
        <Ionicons name="location" size={16} color={Colors.primary} />
        <Text style={styles.locationText}>Rawalpindi, Pakistan</Text>
        <Ionicons name="chevron-down" size={12} color={Colors.textSecondary} style={{ marginLeft: 2 }} />
      </View>
      <TouchableOpacity onPress={onToggleNearMe}>
        <Text style={styles.changeLocationLink}>Change Location</Text>
      </TouchableOpacity>
    </View>
  );
}
