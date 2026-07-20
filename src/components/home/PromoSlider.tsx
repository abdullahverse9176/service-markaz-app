import { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/colors';
import { Spacing } from '@/constants/theme';
import { styles, SCREEN_WIDTH } from './PromoSlider.styles';

const PROMO_SLIDES = [
  {
    title: 'Verified Professionals',
    desc: 'Get up to 20% off on your first service booking today!',
    btnText: 'Browse Services',
    icon: 'sparkles' as const,
    bg: Colors.secondary,
  },
  {
    title: 'Satisfaction Guaranteed',
    desc: '100% money-back or free re-service if you are not satisfied.',
    btnText: 'Learn More',
    icon: 'shield-checkmark' as const,
    bg: Colors.primary,
  },
  {
    title: '24/7 Priority Support',
    desc: 'Our customer support team is always online to help you.',
    btnText: 'Contact Support',
    icon: 'headset' as const,
    bg: '#D97706',
  }
];

export default function PromoSlider() {
  const [activePromo, setActivePromo] = useState(0);

  return (
    <View style={styles.promoContainer}>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={(e) => {
          const slide = Math.round(e.nativeEvent.contentOffset.x / (SCREEN_WIDTH - Spacing.base * 2));
          if (slide !== activePromo) setActivePromo(slide);
        }}
        scrollEventThrottle={16}
        contentContainerStyle={styles.promoScroll}
      >
        {PROMO_SLIDES.map((slide, index) => (
          <View key={index} style={[styles.promoCard, { backgroundColor: slide.bg }]}>
            <View style={styles.promoContent}>
              <Text style={styles.promoTitle}>{slide.title}</Text>
              <Text style={styles.promoDesc}>{slide.desc}</Text>
              <TouchableOpacity 
                style={styles.promoBtn} 
                onPress={() => router.push(index === 2 ? '/(customer)/profile' : '/(customer)/search')}
              >
                <Text style={styles.promoBtnText}>{slide.btnText}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.promoIconWrap}>
              <Ionicons name={slide.icon} size={64} color="rgba(255, 255, 255, 0.15)" />
            </View>
          </View>
        ))}
      </ScrollView>
      {/* Pager Indicators */}
      <View style={styles.pagerDots}>
        {PROMO_SLIDES.map((_, i) => (
          <View 
            key={i} 
            style={[
              styles.pagerDot, 
              i === activePromo && styles.pagerDotActive
            ]} 
          />
        ))}
      </View>
    </View>
  );
}
