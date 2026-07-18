import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius } from '@/constants/theme';
import { getInitials } from '@/utils/format';

export default function ProviderProfileScreen() {
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>SERVICE PROVIDER</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Info</Text>
        {[
          { label: 'Name', value: user.name },
          { label: 'Email', value: user.email },
          { label: 'Phone', value: user.phone ?? 'Not set' },
          { label: 'Email Verified', value: user.isEmailVerified ? '✅ Verified' : '❌ Not Verified' },
        ].map(({ label, value }) => (
          <View key={label} style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { padding: Spacing.base, paddingTop: 60 },
  avatarWrap: { alignItems: 'center', marginBottom: Spacing.xl },
  avatar: {
    width: 88, height: 88, borderRadius: 44,
    backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: { fontSize: Typography.fontSize['3xl'], fontWeight: '800', color: Colors.white },
  name: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  email: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  roleBadge: {
    marginTop: Spacing.sm, backgroundColor: Colors.secondary + '22',
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full,
    borderWidth: 1, borderColor: Colors.secondary,
  },
  roleText: { color: Colors.secondary, fontSize: Typography.fontSize.xs, fontWeight: '700' },
  section: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, overflow: 'hidden', marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.textSecondary,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  row: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  rowLabel: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm },
  rowValue: { color: Colors.textPrimary, fontWeight: '500', fontSize: Typography.fontSize.sm, maxWidth: '60%', textAlign: 'right' },
  signOutBtn: {
    backgroundColor: Colors.dangerMuted, borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.danger,
  },
  signOutText: { color: Colors.danger, fontWeight: '700', fontSize: Typography.fontSize.md },
});
