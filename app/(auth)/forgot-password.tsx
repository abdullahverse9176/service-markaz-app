import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPassword, resetPassword } from '@/api/auth';
import { Colors } from '@/constants/colors';
import { Spacing, Typography, BorderRadius } from '@/constants/theme';

const emailSchema = z.object({ email: z.string().email() });
const resetSchema = z.object({
  otp: z.string().length(6, 'Enter the 6-digit code'),
  password: z.string().min(6, 'At least 6 characters'),
});

type EmailForm = z.infer<typeof emailSchema>;
type ResetForm = z.infer<typeof resetSchema>;

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [email, setEmailVal] = useState('');
  const [loading, setLoading] = useState(false);

  const emailForm = useForm<EmailForm>({ resolver: zodResolver(emailSchema) });
  const resetForm = useForm<ResetForm>({ resolver: zodResolver(resetSchema) });

  const onSendOtp = async (data: EmailForm) => {
    setLoading(true);
    try {
      await forgotPassword(data.email);
      setEmailVal(data.email);
      setStep('reset');
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  const onReset = async (data: ResetForm) => {
    setLoading(true);
    try {
      await resetPassword(email, data.otp, data.password);
      Alert.alert('Password Reset!', 'Your password has been updated. Please sign in.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>
          {step === 'email' ? 'Forgot Password' : 'Reset Password'}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'email'
            ? 'Enter your email to receive a reset code'
            : `Enter the code sent to ${email}`}
        </Text>

        {step === 'email' ? (
          <>
            <Controller
              control={emailForm.control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  style={styles.input}
                  placeholder="you@example.com"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {emailForm.formState.errors.email && (
              <Text style={styles.errorText}>{emailForm.formState.errors.email.message}</Text>
            )}
            <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={emailForm.handleSubmit(onSendOtp)} disabled={loading}>
              {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.btnText}>Send Reset Code</Text>}
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Controller
              control={resetForm.control}
              name="otp"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput style={styles.input} placeholder="6-digit code" placeholderTextColor={Colors.textMuted} keyboardType="number-pad" maxLength={6} onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
            <Controller
              control={resetForm.control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput style={[styles.input, { marginTop: Spacing.sm }]} placeholder="New Password" placeholderTextColor={Colors.textMuted} secureTextEntry onBlur={onBlur} onChangeText={onChange} value={value} />
              )}
            />
            {resetForm.formState.errors.password && (
              <Text style={styles.errorText}>{resetForm.formState.errors.password.message}</Text>
            )}
            <TouchableOpacity style={[styles.btn, loading && styles.btnDisabled]} onPress={resetForm.handleSubmit(onReset)} disabled={loading}>
              {loading ? <ActivityIndicator color={Colors.white} /> : <Text style={styles.btnText}>Reset Password</Text>}
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back to Sign In</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, justifyContent: 'center', padding: Spacing.xl },
  title: { fontSize: Typography.fontSize['2xl'], fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.xs },
  subtitle: { fontSize: Typography.fontSize.base, color: Colors.textSecondary, marginBottom: Spacing.xl },
  input: {
    backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border,
    borderRadius: BorderRadius.md, paddingHorizontal: Spacing.base, paddingVertical: Spacing.md,
    color: Colors.textPrimary, fontSize: Typography.fontSize.base, marginBottom: Spacing.sm,
  },
  errorText: { color: Colors.danger, fontSize: Typography.fontSize.xs, marginBottom: Spacing.sm },
  btn: { backgroundColor: Colors.primary, borderRadius: BorderRadius.md, paddingVertical: Spacing.md, alignItems: 'center', marginTop: Spacing.md },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontSize: Typography.fontSize.md, fontWeight: '700', color: Colors.white },
  backBtn: { alignItems: 'center', marginTop: Spacing.xl },
  backText: { color: Colors.primaryLight, fontSize: Typography.fontSize.sm },
});
