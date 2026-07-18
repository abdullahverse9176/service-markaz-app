import apiClient from './client';
import type { Lead, LeadSource } from '@/types/api';
import type { ApiResponse } from '@/types/api';

// ─── Create / send a lead (customer contacts a business) ──────────────────

export const createLead = async (businessId: string, source: LeadSource) => {
  const { data } = await apiClient.post<ApiResponse<Lead>>('/api/leads', {
    businessId,
    source,
  });
  return data;
};

// ─── Get my sent leads (customer) ─────────────────────────────────────────

export const getMyLeads = async () => {
  const { data } = await apiClient.get<ApiResponse<Lead[]>>('/api/leads/my');
  return data;
};

// ─── Get received leads (provider) ────────────────────────────────────────

export const getReceivedLeads = async () => {
  const { data } = await apiClient.get<ApiResponse<Lead[]>>('/api/leads/received');
  return data;
};

// ─── Provider responds to a lead ──────────────────────────────────────────

export const respondToLead = async (leadId: string, confirmed: 'yes' | 'no') => {
  const { data } = await apiClient.post<ApiResponse<Lead>>(
    `/api/leads/provider-respond`,
    { leadId, confirmed }
  );
  return data;
};

// ─── Customer confirms lead ────────────────────────────────────────────────

export const confirmLead = async (leadId: string, confirmed: 'yes' | 'no') => {
  const { data } = await apiClient.post<ApiResponse<Lead>>('/api/leads/confirm', {
    leadId,
    confirmed,
  });
  return data;
};
