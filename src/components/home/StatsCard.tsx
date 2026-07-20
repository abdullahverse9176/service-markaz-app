import { View, Text } from 'react-native';
import { styles } from './StatsCard.styles';

export default function StatsCard() {
  return (
    <View style={styles.statsCard}>
      <View style={styles.statCol}>
        <Text style={styles.statNumber}>50k+</Text>
        <Text style={styles.statLabel}>Happy Users</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statCol}>
        <Text style={styles.statNumber}>3,200+</Text>
        <Text style={styles.statLabel}>Verified Experts</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statCol}>
        <Text style={styles.statNumber}>4.8/5</Text>
        <Text style={styles.statLabel}>Avg Rating</Text>
      </View>
    </View>
  );
}
