import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  ScrollView,
} from 'react-native';
import { router, Link } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius } from '@/constants/theme';

const schema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Enter a valid phone number').optional().or(z.literal('')),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
    referralCode: z.string().optional().or(z.literal('')),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type FormData = z.infer<typeof schema>;

export default function SignupScreen() {
  const { signUp, isLoading } = useAuthStore();

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await signUp({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone || undefined,
        referralCode: data.referralCode || undefined,
      });
      // After signup → go to OTP verification
      router.push({ pathname: '/(auth)/verify-otp', params: { email: data.email } });
    } catch (err: any) {
      Alert.alert('Sign Up Failed', err.message ?? 'Please try again');
    }
  };

  const fields: { name: keyof FormData; label: string; placeholder: string; secure?: boolean; keyboard?: any }[] = [
    { name: 'name', label: 'Full Name', placeholder: 'Muhammad Abdullah' },
    { name: 'email', label: 'Email', placeholder: 'you@example.com', keyboard: 'email-address' },
    { name: 'phone', label: 'Phone (optional)', placeholder: '+92 300 0000000', keyboard: 'phone-pad' },
    { name: 'password', label: 'Password', placeholder: '••••••••', secure: true },
    { name: 'confirmPassword', label: 'Confirm Password', placeholder: '••••••••', secure: true },
    { name: 'referralCode', label: 'Referral Code (optional)', placeholder: 'ABCD1234' },
  ];

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Text style={styles.logo}>Service Markaz</Text>
          <Text style={styles.tagline}>Create your free account</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Join Service Markaz</Text>
          <Text style={styles.subtitle}>Find or offer services in your city</Text>

          {fields.map(({ name, label, placeholder, secure, keyboard }) => (
            <View key={name} style={styles.fieldGroup}>
              <Text style={styles.label}>{label}</Text>
              <Controller
                control={control}
                name={name}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    style={[styles.input, errors[name] && styles.inputError]}
                    placeholder={placeholder}
                    placeholderTextColor={Colors.textMuted}
                    secureTextEntry={secure}
                    keyboardType={keyboard ?? 'default'}
                    autoCapitalize={name === 'referralCode' ? 'characters' : 'none'}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value as string}
                  />
                )}
              />
              {errors[name] && (
                <Text style={styles.errorText}>{errors[name]?.message as string}</Text>
              )}
            </View>
          ))}

          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitBtnDisabled]}
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <Text style={styles.submitText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={styles.linkText}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: Spacing.base },
  header: { alignItems: 'center', marginBottom: Spacing['2xl'] },
  logo: { fontSize: Typography.fontSize['3xl'], fontWeight: '800', color: Colors.primary },
  tagline: { fontSize: Typography.fontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: { fontSize: Typography.fontSize['2xl'], fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
  subtitle: { fontSize: Typography.fontSize.base, color: Colors.textSecondary, marginBottom: Spacing.xl },
  fieldGroup: { marginBottom: Spacing.md },
  label: { fontSize: Typography.fontSize.sm, fontWeight: '600', color: Colors.textSecondary, marginBottom: Spacing.xs },
  input: {
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    color: Colors.textPrimary,
    fontSize: Typography.fontSize.base,
  },
  inputError: { borderColor: Colors.danger },
  errorText: { fontSize: Typography.fontSize.xs, color: Colors.danger, marginTop: Spacing.xs },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: BorderRadius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.white },
  footer: { flexDirection: 'row', justifyContent: 'center' },
  footerText: { color: Colors.textSecondary, fontSize: Typography.fontSize.sm },
  linkText: { color: Colors.primary, fontSize: Typography.fontSize.sm, fontWeight: '600' },
});
