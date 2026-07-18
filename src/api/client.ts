import axios from 'axios';
import { Config } from '@/constants/config';
import { getToken } from '@/utils/storage';

// ─── Axios Instance ────────────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: Config.API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// ─── Request Interceptor — attach JWT token ────────────────────────────────

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — normalize errors ──────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ??
      error.message ??
      'Something went wrong';

    // Return a clean error so hooks can display it
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
