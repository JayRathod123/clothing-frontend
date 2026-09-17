import axiosInstance from '@/lib/axiosInstance';
import { User, LoginDto, RegisterDto } from '@/types/auth.types';
import { ApiResponse } from '@/types/api.types';
import { setStoredAuthTokens, clearStoredAuthTokens, getStoredAccessToken } from '@/utils/storage';

const LOCAL_USER_KEY = 'aura_cached_user_profile';

export const authService = {
  // Login
  async login(dto: LoginDto): Promise<User> {
    try {
      const response = await axiosInstance.post<ApiResponse<any>>('/api/auth/login', dto);
      if (response.data.success && response.data.data?.accessToken) {
        setStoredAuthTokens(response.data.data.accessToken, response.data.data.refreshToken);
        const profile = await this.getProfile();
        if (profile) return profile;
      }
    } catch (err: any) {
      console.warn('API /api/auth/login failed, simulating customer login', err);
    }

    // Local simulation fallback
    const simulatedUser: User = {
      id: `usr_${Date.now()}`,
      email: dto.email,
      role: 'customer',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(simulatedUser));
      setStoredAuthTokens('mock_jwt_token_aura');
    }
    return simulatedUser;
  },

  // Register
  async register(dto: RegisterDto): Promise<User> {
    try {
      const response = await axiosInstance.post<ApiResponse<any>>('/api/auth/register', dto);
      if (response.data.success && response.data.data?.accessToken) {
        setStoredAuthTokens(response.data.data.accessToken, response.data.data.refreshToken);
        const profile = await this.getProfile();
        if (profile) return profile;
      }
    } catch (err: any) {
      console.warn('API /api/auth/register failed, simulating registration', err);
    }

    const simulatedUser: User = {
      id: `usr_${Date.now()}`,
      email: dto.email,
      phone: dto.phone,
      role: 'customer',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(simulatedUser));
      setStoredAuthTokens('mock_jwt_token_aura');
    }
    return simulatedUser;
  },

  // Get current user profile
  async getProfile(): Promise<User | null> {
    const token = getStoredAccessToken();
    if (!token) {
      if (typeof window !== 'undefined') {
        const cached = localStorage.getItem(LOCAL_USER_KEY);
        if (cached) return JSON.parse(cached);
      }
      return null;
    }

    try {
      const response = await axiosInstance.get<ApiResponse<User>>('/api/auth/me');
      if (response.data.success && response.data.data) {
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(response.data.data));
        }
        return response.data.data;
      }
    } catch (err) {
      console.warn('API /api/auth/me fallback', err);
    }

    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(LOCAL_USER_KEY);
      if (cached) return JSON.parse(cached);
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
  }
};
