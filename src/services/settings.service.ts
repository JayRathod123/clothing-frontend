import axiosInstance from '@/lib/axiosInstance';
import { ApiResponse } from '@/types/api.types';

export interface StoreSettings {
  store_info?: {
    name: string;
    logoUrl?: string;
    contactEmail?: string;
    contactPhone?: string;
    address?: string;
    currency?: string;
    description?: string;
  };
  social_links?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    youtube?: string;
    linkedin?: string;
  };
  shipping_settings?: {
    defaultFreeShippingThreshold?: number;
    defaultFlatRate?: number;
  };
  payment_settings?: {
    enabledGateways?: string[];
    codAvailable?: boolean;
    minCodOrderValue?: number;
    maxCodOrderValue?: number;
  };
}

export const settingsService = {
  async getPublicSettings(): Promise<StoreSettings | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<StoreSettings>>('/api/settings/public');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('API /api/settings/public fallback', err);
    }
    return null;
  }
};

export default settingsService;
