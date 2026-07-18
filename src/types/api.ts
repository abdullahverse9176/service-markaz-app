// ─── Lead ──────────────────────────────────────────────────────────────────

export type LeadSource = 'call' | 'whatsapp' | 'form';
export type LeadStatus =
  | 'pending'
  | 'awaiting_response'
  | 'confirmed'
  | 'rejected'
  | 'disputed';

export interface StatusHistoryEntry {
  status: string;
  actor: string;
  actorRole: 'customer' | 'provider' | 'admin' | 'system';
  note: string;
  timestamp: string;
}

export interface Lead {
  _id: string;
  customer: string | { _id: string; name: string; phone: string };
  business: string | { _id: string; name: string; title: string; profileImage: string };
  source: LeadSource;
  status: LeadStatus;
  customerConfirmed: 'yes' | 'no' | null;
  providerConfirmed: 'yes' | 'no' | null;
  lastContactedAt: string | null;
  providerConfirmedAt: string | null;
  statusHistory: StatusHistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

// ─── API Generic Response ──────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items?: T[];
    businesses?: T[];
    total: number;
    page: number;
    totalPages: number;
  };
}

// ─── Auth ──────────────────────────────────────────────────────────────────

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  referralCode?: string;
}

export interface SigninPayload {
  email: string;
  password: string;
}

export interface SigninResponse {
  user: import('./user').AuthUser;
  token: string;
}

// ─── Business Filters ─────────────────────────────────────────────────────

export interface BusinessFilters {
  category?: string;
  city?: string;
  search?: string;
  sort?: 'rating' | 'newest' | 'experience';
  available?: boolean;
  verified?: boolean;
  lat?: number;
  lng?: number;
  page?: number;
  limit?: number;
}
