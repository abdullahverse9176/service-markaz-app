import { create } from 'zustand';
import { signIn as apiSignIn, signUp as apiSignUp } from '@/api/auth';
import { saveToken, saveUser, clearAuthStorage, getToken, getSavedUser } from '@/utils/storage';
import type { AuthUser } from '@/types/user';
import type { SigninPayload, SignupPayload } from '@/types/api';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;

  // Actions
  hydrate: () => Promise<void>;
  signIn: (payload: SigninPayload) => Promise<void>;
  signUp: (payload: SignupPayload) => Promise<void>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  isHydrated: false,

  // ── Hydrate from SecureStore on app launch ───────────────────────────────
  hydrate: async () => {
    try {
      const [token, user] = await Promise.all([getToken(), getSavedUser()]);
      if (token && user) {
        set({ user, token, isAuthenticated: true });
      }
    } catch {
      // If SecureStore fails, stay logged out
    } finally {
      set({ isHydrated: true });
    }
  },

  // ── Sign In ──────────────────────────────────────────────────────────────
  signIn: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await apiSignIn(payload);
      if (!res.success || !res.data) throw new Error(res.message ?? 'Sign in failed');

      const { user, token } = res.data;
      await Promise.all([saveToken(token), saveUser(user)]);
      set({ user, token, isAuthenticated: true });
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Sign Up ──────────────────────────────────────────────────────────────
  signUp: async (payload) => {
    set({ isLoading: true });
    try {
      const res = await apiSignUp(payload);
      if (!res.success) throw new Error(res.message ?? 'Sign up failed');
    } finally {
      set({ isLoading: false });
    }
  },

  // ── Sign Out ─────────────────────────────────────────────────────────────
  signOut: async () => {
    await clearAuthStorage();
    set({ user: null, token: null, isAuthenticated: false });
  },

  // ── Update user locally (e.g., after profile edit) ──────────────────────
  updateUser: (updates) => {
    const current = get().user;
    if (!current) return;
    const updated = { ...current, ...updates };
    set({ user: updated });
    saveUser(updated); // persist to SecureStore
  },
}));
