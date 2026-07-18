import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyLeads, getReceivedLeads, createLead, respondToLead, confirmLead } from '@/api/leads';
import type { LeadSource } from '@/types/api';

export const leadKeys = {
  all: ['leads'] as const,
  mine: () => [...leadKeys.all, 'mine'] as const,
  received: () => [...leadKeys.all, 'received'] as const,
};

export const useMyLeads = () => {
  return useQuery({
    queryKey: leadKeys.mine(),
    queryFn: getMyLeads,
  });
};

export const useReceivedLeads = () => {
  return useQuery({
    queryKey: leadKeys.received(),
    queryFn: getReceivedLeads,
  });
};

export const useCreateLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ businessId, source }: { businessId: string; source: LeadSource }) =>
      createLead(businessId, source),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leadKeys.mine() });
    },
  });
};

export const useRespondToLead = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ leadId, confirmed }: { leadId: string; confirmed: 'yes' | 'no' }) =>
      respondToLead(leadId, confirmed),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: leadKeys.received() });
    },
  });
};
