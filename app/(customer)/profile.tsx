import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius } from '@/constants/theme';
import { getInitials } from '@/utils/format';

export default function CustomerProfileScreen() {
  const { user, signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.guestRoot}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Manage your account settings</Text>
        </View>
        <View style={styles.guestContent}>
          <Text style={styles.guestEmoji}>👤</Text>
          <Text style={styles.guestTitle}>Sign in to view profile</Text>
          <Text style={styles.guestText}>Sign in to access your profile details, manage active leads, and customize your experience.</Text>
          <TouchableOpacity style={styles.primaryBtn} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.primaryBtnText}>Sign In / Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.root} contentContainerStyle={styles.container}>
      {/* Avatar */}
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{getInitials(user.name)}</Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{user.role.toUpperCase()}</Text>
        </View>
      </View>

      {/* Info Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Info</Text>
        {[
          { label: 'Email', value: user.email },
          { label: 'Phone', value: user.phone ?? 'Not set' },
          { label: 'Email Verified', value: user.isEmailVerified ? '✅ Verified' : '❌ Not Verified' },
          { label: 'Role', value: user.role },
        ].map(({ label, value }) => (
          <View key={label} style={styles.infoRow}>
            <Text style={styles.infoLabel}>{label}</Text>
            <Text style={styles.infoValue}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Sign Out */}
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
    marginTop: Spacing.sm, backgroundColor: Colors.primaryMuted,
    paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full,
  },
  roleText: { color: Colors.primary, fontSize: Typography.fontSize.xs, fontWeight: '700' },
  section: {
    backgroundColor: Colors.surface, borderRadius: BorderRadius.lg,
    borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.lg, overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: Typography.fontSize.sm, fontWeight: '700', color: Colors.textSecondary,
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.sm,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  infoLabel: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  infoValue: { fontSize: Typography.fontSize.sm, color: Colors.textPrimary, fontWeight: '500', maxWidth: '60%', textAlign: 'right' },
  signOutBtn: {
    backgroundColor: Colors.dangerMuted, borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, alignItems: 'center',
    borderWidth: 1, borderColor: Colors.danger,
  },
  signOutText: { color: Colors.danger, fontWeight: '700', fontSize: Typography.fontSize.md },
  guestRoot: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.surface, paddingTop: 60, paddingBottom: Spacing.md,
    paddingHorizontal: Spacing.base, borderBottomWidth: 1, borderBottomColor: Colors.border,
  },
  title: { fontSize: Typography.fontSize.xl, fontWeight: '700', color: Colors.textPrimary },
  subtitle: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary },
  guestContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  guestEmoji: { fontSize: 64, marginBottom: Spacing.md },
  guestTitle: { fontSize: Typography.fontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
  guestText: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 20 },
  primaryBtn: {
    backgroundColor: Colors.primary, borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, alignItems: 'center', width: '100%',
  },
  primaryBtnText: { color: Colors.white, fontWeight: '700', fontSize: Typography.fontSize.md },
});
