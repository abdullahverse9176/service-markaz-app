import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './SearchStickyFooter.styles';

interface SearchStickyFooterProps {
  totalFound: number;
  onPress: () => void;
}

export default function SearchStickyFooter({ totalFound, onPress }: SearchStickyFooterProps) {
  return (
    <View style={styles.footerContainer}>
      <TouchableOpacity 
        style={styles.showResultsBtn}
        onPress={onPress}
      >
        <Text style={styles.showResultsBtnText}>
          Show Results ({totalFound} Specialists)
        </Text>
      </TouchableOpacity>
    </View>
  );
}
