import apiClient from './client';
import type { ApiResponse, SigninPayload, SigninResponse, SignupPayload } from '@/types/api';

// ─── Sign Up ───────────────────────────────────────────────────────────────

export const signUp = async (payload: SignupPayload) => {
  const { data } = await apiClient.post<ApiResponse<{ user: any }>>(
    '/api/auth/signup',
    payload
  );
  return data;
};

// ─── Sign In ───────────────────────────────────────────────────────────────

export const signIn = async (payload: SigninPayload) => {
  const { data } = await apiClient.post<ApiResponse<SigninResponse>>(
    '/api/auth/signin',
    payload
  );
  return data;
};

// ─── Send OTP ──────────────────────────────────────────────────────────────

export const sendOtp = async (email: string) => {
  const { data } = await apiClient.post<ApiResponse<null>>('/api/auth/send-otp', { email });
  return data;
};

// ─── Verify OTP ────────────────────────────────────────────────────────────

export const verifyOtp = async (email: string, otp: string) => {
  const { data } = await apiClient.post<ApiResponse<null>>('/api/auth/verify-otp', {
    email,
    otp,
  });
  return data;
};

// ─── Forgot Password ───────────────────────────────────────────────────────

export const forgotPassword = async (email: string) => {
  const { data } = await apiClient.post<ApiResponse<null>>('/api/auth/forgot-password', {
    email,
  });
  return data;
};

// ─── Reset Password ────────────────────────────────────────────────────────

export const resetPassword = async (email: string, otp: string, password: string) => {
  const { data } = await apiClient.post<ApiResponse<null>>('/api/auth/reset-password', {
    email,
    otp,
    password,
  });
  return data;
};
