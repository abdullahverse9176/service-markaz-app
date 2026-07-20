import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useAuthStore } from '@/store/authStore';
import { styles } from './DualCTA.styles';

export default function DualCTA() {
  const { isAuthenticated } = useAuthStore();

  return (
    <View style={styles.dualCTAWrap}>
      <View style={styles.ctaBoxLeft}>
        <Text style={styles.ctaTitle}>Looking for Services?</Text>
        <Text style={styles.ctaDesc}>Get high-quality service providers for your home instantly.</Text>
        <TouchableOpacity 
          style={[styles.ctaBtn, { backgroundColor: Colors.primary }]}
          onPress={() => router.push('/(customer)/services')}
          activeOpacity={0.8}
        >
          <Text style={styles.ctaBtnText}>Find Specialist</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.ctaBoxRight}>
        <Text style={[styles.ctaTitle, { color: Colors.white }]}>Want to Offer Services?</Text>
        <Text style={[styles.ctaDesc, { color: 'rgba(255,255,255,0.8)' }]}>Join as a service partner and grow your local business today.</Text>
        <TouchableOpacity 
          style={[styles.ctaBtn, { backgroundColor: Colors.white }]}
          onPress={() => {
            if (isAuthenticated) {
              router.push('/(customer)/profile');
            } else {
              router.push('/(auth)/login');
            }
          }}
          activeOpacity={0.8}
        >
          <Text style={[styles.ctaBtnText, { color: Colors.secondary }]}>Become Provider</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
