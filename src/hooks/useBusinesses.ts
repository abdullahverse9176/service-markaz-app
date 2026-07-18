import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBusinesses,
  getBusinessById,
  getMyBusiness,
  createBusiness,
  updateBusiness,
  toggleAvailability,
} from '@/api/businesses';
import type { BusinessFilters } from '@/types/api';
import { Config } from '@/constants/config';

// ─── Query Keys ───────────────────────────────────────────────────────────

export const businessKeys = {
  all: ['businesses'] as const,
  list: (filters: BusinessFilters) => [...businessKeys.all, 'list', filters] as const,
  detail: (id: string) => [...businessKeys.all, 'detail', id] as const,
  mine: () => [...businessKeys.all, 'mine'] as const,
};

// ─── Hooks ────────────────────────────────────────────────────────────────

export const useBusinesses = (filters: BusinessFilters = {}) => {
  return useQuery({
    queryKey: businessKeys.list(filters),
    queryFn: () => getBusinesses(filters),
    staleTime: Config.STALE_TIME_SHORT,
  });
};

export const useBusiness = (id: string) => {
  return useQuery({
    queryKey: businessKeys.detail(id),
    queryFn: () => getBusinessById(id),
    staleTime: Config.STALE_TIME_MEDIUM,
    enabled: !!id,
  });
};

export const useMyBusiness = () => {
  return useQuery({
    queryKey: businessKeys.mine(),
    queryFn: getMyBusiness,
    staleTime: Config.STALE_TIME_MEDIUM,
    retry: false, // Don't retry 404 — provider may not have a business yet
  });
};

export const useCreateBusiness = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createBusiness,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: businessKeys.mine() });
    },
  });
};

export const useUpdateBusiness = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateBusiness,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: businessKeys.mine() });
    },
  });
};

export const useToggleAvailability = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: toggleAvailability,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: businessKeys.mine() });
    },
  });
};
