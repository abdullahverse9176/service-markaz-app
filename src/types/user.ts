// ─── User ──────────────────────────────────────────────────────────────────

export type UserRole = 'customer' | 'provider' | 'admin';
export type UserStatus = 'pending' | 'active' | 'blocked';
export type SubscriptionPlan = 'free' | 'basic' | 'pro' | 'lifetime';

export interface Subscription {
  plan: SubscriptionPlan;
  expiresAt: string | null;
  source: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  referralCode?: string;
  referredBy?: string | null;
  subscription: Subscription;
  badges: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  role: UserRole;
  isEmailVerified: boolean;
}
