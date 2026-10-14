import axiosInstance from '@/lib/axiosInstance';
import axios from 'axios';
import { User, LoginDto, RegisterDto } from '@/types/auth.types';
import { ApiResponse } from '@/types/api.types';
import {
  setStoredAuthTokens,
  clearStoredAuthTokens,
  getStoredAccessToken,
  getStoredRefreshToken,
} from '@/utils/storage';

const LOCAL_USER_KEY = 'aura_cached_user_profile';
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'http://192.168.1.15:5012';

export const authService = {
  // Login with backend API
  async login(dto: LoginDto): Promise<User> {
    const response = await axiosInstance.post<any>('/api/auth/login', dto);
    const resData = response.data;
    const data = resData?.data?.data || resData?.data || resData;

    if (data?.accessToken) {
      setStoredAuthTokens(data.accessToken, data.refreshToken);
      const profile = await this.getProfile();
      if (profile) return profile;
      return data.user;
    }
    throw new Error(resData?.message || 'Login failed');
  },

  // Register with backend API
  async register(dto: RegisterDto): Promise<User> {
    const response = await axiosInstance.post<any>('/api/auth/register', dto);
    const resData = response.data;
    const data = resData?.data?.data || resData?.data || resData;

    if (data?.accessToken) {
      setStoredAuthTokens(data.accessToken, data.refreshToken);
      const profile = await this.getProfile();
      if (profile) return profile;
      return data.user;
    }
    throw new Error(resData?.message || 'Registration failed');
  },

  // Refresh access token via /api/auth/refresh
  async refreshToken(): Promise<{ accessToken: string; refreshToken: string } | null> {
    const refreshToken = getStoredRefreshToken();
    if (!refreshToken) return null;

    try {
      const response = await axios.post(
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

      const resData = response.data;
      const data = resData?.data?.data || resData?.data || resData;
      const newAccessToken = data?.accessToken;
      const newRefreshToken = data?.refreshToken || refreshToken;

      if (newAccessToken) {
        setStoredAuthTokens(newAccessToken, newRefreshToken);
        return { accessToken: newAccessToken, refreshToken: newRefreshToken };
      }
    } catch {
      clearStoredAuthTokens();
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_USER_KEY);
      }
      return null;
    }

    return null;
  },

  // Get current user profile from /api/auth/me
  async getProfile(): Promise<User | null> {
    const token = getStoredAccessToken();
    if (!token || token === 'mock_jwt_token_aura') {
      return null;
    }

    try {
      const response = await axiosInstance.get<any>('/api/auth/me');
      const resData = response.data;
      const profile = resData?.data?.data || resData?.data || resData;

      if (profile && (profile.id || profile.email)) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
        }
        return profile;
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        clearStoredAuthTokens();
        if (typeof window !== 'undefined') {
          localStorage.removeItem(LOCAL_USER_KEY);
        }
        return null;
      }
    }

    return null;
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await axiosInstance.post('/api/auth/logout');
    } catch {}
    clearStoredAuthTokens();
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_USER_KEY);
    }
  },
};

export default authService;
