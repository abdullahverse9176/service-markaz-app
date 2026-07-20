import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { styles } from './SearchHeader.styles';

interface SearchHeaderProps {
  onReset: () => void;
}

export default function SearchHeader({ onReset }: SearchHeaderProps) {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.topBarTitle}>Filter Specialists</Text>
      <TouchableOpacity onPress={onReset}>
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
}
