import apiClient from './client';
import type { Category } from '@/types/business';
import type { City } from '@/types/business';
import type { ApiResponse } from '@/types/api';

export const getCategories = async () => {
  const { data } = await apiClient.get<ApiResponse<Category[]>>('/api/categories');
  return data;
};

export const getCities = async () => {
  const { data } = await apiClient.get<ApiResponse<City[]>>('/api/cities');
  return data;
};
