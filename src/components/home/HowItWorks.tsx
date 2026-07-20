import { View, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '@/constants/theme';
import { styles } from './HowItWorks.styles';

const HOW_IT_WORKS = [
  { step: '1', title: 'Select Service', desc: 'Choose from 25+ trusted services', icon: 'search-outline' as const },
  { step: '2', title: 'Book Provider', desc: 'Choose the best specialist near you', icon: 'calendar-outline' as const },
  { step: '3', title: 'Pay & Enjoy', desc: 'Pay securely after task completion', icon: 'happy-outline' as const },
];

export default function HowItWorks() {
  return (
    <View style={styles.howItWorksWrap}>
      <Text style={[styles.sectionTitle, { textAlign: 'center' }]}>How It Works</Text>
      <Text style={[styles.sectionSubtitle, { textAlign: 'center', marginBottom: Spacing.lg }]}>
        Get your job done in three easy steps
      </Text>
      <View style={styles.stepsRow}>
        {HOW_IT_WORKS.map((step, idx) => (
          <View key={idx} style={styles.stepCol}>
            <View style={styles.stepIconOuter}>
              <Ionicons name={step.icon} size={24} color={Colors.primary} />
            </View>
            <Text style={styles.stepTitle}>{step.title}</Text>
            <Text style={styles.stepDesc}>{step.desc}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
