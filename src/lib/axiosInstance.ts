import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { getOrCreateGuestSessionId, getStoredAccessToken } from '@/utils/storage';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://192.168.1.22:5012';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor: Attach Auth Token and Guest Session ID
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Attach guest session ID for cart and guest operations
    const guestSessionId = getOrCreateGuestSessionId();
    if (guestSessionId) {
      config.headers['x-session-id'] = guestSessionId;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format errors and handle status
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized if needed (e.g. token expired)
      console.warn('API 401 Unauthorized:', error.config?.url);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
