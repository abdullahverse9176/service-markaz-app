import apiClient from './client';
import type { Business } from '@/types/business';
import type { ApiResponse, BusinessFilters, PaginatedResponse } from '@/types/api';

// ─── Get businesses list (public) ─────────────────────────────────────────

export const getBusinesses = async (filters: BusinessFilters = {}) => {
  const params = new URLSearchParams();
  if (filters.category) params.set('category', filters.category);
  if (filters.city) params.set('city', filters.city);
  if (filters.search) params.set('search', filters.search);
  if (filters.sort) params.set('sort', filters.sort);
  if (filters.available) params.set('available', '1');
  if (filters.verified) params.set('verified', '1');
  if (filters.lat !== undefined) params.set('lat', String(filters.lat));
  if (filters.lng !== undefined) params.set('lng', String(filters.lng));
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));

  const { data } = await apiClient.get<PaginatedResponse<Business>>(
    `/api/businesses?${params.toString()}`
  );
  return data;
};

// ─── Get single business (public) ─────────────────────────────────────────

export const getBusinessById = async (id: string) => {
  const { data } = await apiClient.get<ApiResponse<Business>>(`/api/businesses/${id}`);
  return data;
};

// ─── Get my business (provider — requires auth) ────────────────────────────

export const getMyBusiness = async () => {
  const { data } = await apiClient.get<ApiResponse<Business>>('/api/business');
  return data;
};

// ─── Create business (provider — requires auth) ────────────────────────────

export const createBusiness = async (payload: Partial<Business>) => {
  const { data } = await apiClient.post<ApiResponse<Business>>('/api/business', payload);
  return data;
};

// ─── Update business (provider — requires auth) ────────────────────────────

export const updateBusiness = async (payload: Partial<Business>) => {
  const { data } = await apiClient.put<ApiResponse<Business>>('/api/business', payload);
  return data;
};

// ─── Toggle availability (provider — requires auth) ────────────────────────

export const toggleAvailability = async (availability: 'Available' | 'Unavailable') => {
  const { data } = await apiClient.patch<ApiResponse<{ availability: string }>>(
    '/api/business',
    { availability }
  );
  return data;
};
