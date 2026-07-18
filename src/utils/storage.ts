import * as SecureStore from 'expo-secure-store';
import { Config } from '@/constants/config';
import type { AuthUser } from '@/types/user';

// ─── Token ────────────────────────────────────────────────────────────────

export const saveToken = async (token: string): Promise<void> => {
  await SecureStore.setItemAsync(Config.TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return SecureStore.getItemAsync(Config.TOKEN_KEY);
};

export const deleteToken = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(Config.TOKEN_KEY);
};

// ─── User ─────────────────────────────────────────────────────────────────

export const saveUser = async (user: AuthUser): Promise<void> => {
  await SecureStore.setItemAsync(Config.USER_KEY, JSON.stringify(user));
};

export const getSavedUser = async (): Promise<AuthUser | null> => {
  const raw = await SecureStore.getItemAsync(Config.USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
};

export const deleteUser = async (): Promise<void> => {
  await SecureStore.deleteItemAsync(Config.USER_KEY);
};

// ─── Clear all auth data ──────────────────────────────────────────────────

export const clearAuthStorage = async (): Promise<void> => {
  await Promise.all([deleteToken(), deleteUser()]);
};
