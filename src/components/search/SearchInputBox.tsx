import { View, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { styles } from './SearchInputBox.styles';

interface SearchInputBoxProps {
  search: string;
  setSearch: (text: string) => void;
  onClear: () => void;
  onSubmit: () => void;
}

export default function SearchInputBox({
  search,
  setSearch,
  onClear,
  onSubmit
}: SearchInputBoxProps) {
  return (
    <View style={styles.searchRow}>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search services, business or area..."
          placeholderTextColor={Colors.textMuted}
          value={search}
          onChangeText={setSearch}
          onSubmitEditing={onSubmit}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={onClear} style={styles.clearBtn}>
            <Ionicons name="close" size={18} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={styles.filterBtn} onPress={onSubmit}>
        <Ionicons name="search" size={20} color={Colors.primary} />
      </TouchableOpacity>
    </View>
  );
}
