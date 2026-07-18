import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius } from '@/constants/theme';

export default function NotFound() {
  return (
    <View style={styles.root}>
      <Text style={styles.code}>404</Text>
      <Text style={styles.title}>Page Not Found</Text>
      <Text style={styles.subtitle}>This screen doesn't exist.</Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.replace('/(customer)')}>
        <Text style={styles.btnText}>Go Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  code: { fontSize: 80, fontWeight: '900', color: Colors.primary, opacity: 0.3 },
  title: { fontSize: Typography.fontSize['2xl'], fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: Typography.fontSize.base, color: Colors.textSecondary, marginTop: Spacing.xs, marginBottom: Spacing.xl },
  btn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.md, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl },
  btnText: { color: Colors.white, fontWeight: '700', fontSize: Typography.fontSize.md },
});
