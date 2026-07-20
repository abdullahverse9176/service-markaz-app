import { View, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { Ionicons } from '@expo/vector-icons';
import { Spacing } from '@/constants/theme';
import { styles } from './WhyChooseUs.styles';

const WHY_CHOOSE_US = [
  { title: 'Verified Experts', desc: '100% background checked & vetted profiles', icon: 'shield-outline' as const, color: '#00A76D' },
  { title: 'Quick Booking', desc: 'Connect with available experts in 30 mins', icon: 'flash-outline' as const, color: '#F59E0B' },
  { title: '24/7 Support', desc: 'Live agent assistance whenever you need', icon: 'chatbubbles-outline' as const, color: '#002D62' },
  { title: 'Budget Friendly', desc: 'Transparent upfront pricing. No hidden fees', icon: 'cash-outline' as const, color: '#EF4444' },
];

export default function WhyChooseUs() {
  return (
    <View style={styles.whyChooseWrap}>
      <Text style={styles.sectionTitle}>Why Choose Service Markaz?</Text>
      <Text style={[styles.sectionSubtitle, { marginBottom: Spacing.lg }]}>
        We ensure transparency, speed, and safety
      </Text>
      <View style={styles.whyGrid}>
        {WHY_CHOOSE_US.map((item, idx) => (
          <View key={idx} style={styles.whyCard}>
            <View style={[styles.whyIconWrap, { backgroundColor: item.color + '15' }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <View style={styles.whyInfo}>
              <Text style={styles.whyCardTitle}>{item.title}</Text>
              <Text style={styles.whyCardDesc}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
