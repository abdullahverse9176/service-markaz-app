import apiClient from './client';
import type { ApiResponse } from '@/types/api';

interface UploadResult {
  url: string;
  key: string;
}

/**
 * Upload an image to S3 via the backend.
 * @param uri  Local file URI from expo-image-picker
 * @param type 'profile' | 'banner' | 'gallery'
 */
export const uploadImage = async (
  uri: string,
  type: 'profile' | 'banner' | 'gallery' = 'profile'
): Promise<string> => {
  const formData = new FormData();

  // React Native FormData accepts { uri, name, type } objects
  formData.append('file', {
    uri,
    name: `${type}-${Date.now()}.jpg`,
    type: 'image/jpeg',
  } as any);
  formData.append('type', type);

  const { data } = await apiClient.post<ApiResponse<UploadResult>>('/api/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  if (!data.success || !data.data?.url) {
    throw new Error(data.message ?? 'Upload failed');
  }

  return data.data.url;
};
