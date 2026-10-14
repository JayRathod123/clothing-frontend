import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import {
  getOrCreateGuestSessionId,
  getStoredAccessToken,
  getStoredRefreshToken,
  setStoredAuthTokens,
  clearStoredAuthTokens,
} from '@/utils/storage';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://192.168.1.15:5012';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
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

// Concurrency queue for handling multiple requests during token refresh
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response Interceptor: Format errors, refresh expired token on 401, and retry
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 Unauthorized if not already retried
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      const requestUrl = originalRequest.url || '';

      // Skip refresh for auth endpoints to prevent infinite loops
      if (
        requestUrl.includes('/api/auth/login') ||
        requestUrl.includes('/api/auth/register') ||
        requestUrl.includes('/api/auth/refresh')
      ) {
        return Promise.reject(error);
      }

      const refreshToken = getStoredRefreshToken();
      if (!refreshToken) {
        clearStoredAuthTokens();
        return Promise.reject(error);
      }

      // If a refresh is already in progress, enqueue this request
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Direct call to refresh endpoint using standalone axios to avoid interceptor recursion
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/api/auth/refresh`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            timeout: 10000,
          }
        );

        const resData = refreshResponse.data;
        const data = resData?.data?.data || resData?.data || resData;
        const newAccessToken = data?.accessToken;
        const newRefreshToken = data?.refreshToken || refreshToken;

        if (newAccessToken) {
          setStoredAuthTokens(newAccessToken, newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          processQueue(null, newAccessToken);
          return axiosInstance(originalRequest);
        } else {
          throw new Error('No access token received from refresh endpoint');
        }
      } catch (refreshErr) {
        processQueue(refreshErr, null);
        clearStoredAuthTokens();
        if (typeof window !== 'undefined') {
          localStorage.removeItem('aura_cached_user_profile');
          window.dispatchEvent(new CustomEvent('auth:expired'));
        }
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
