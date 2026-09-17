import axiosInstance from '@/lib/axiosInstance';
import { ApiResponse } from '@/types/api.types';

export interface Banner {
  id: string;
  title: string;
  linkUrl?: string;
  position: 'homepage_hero' | 'category_top' | 'promo_strip';
  sortOrder: number;
  isActive: boolean;
  imageUrl?: string;
  startsAt?: string;
  endsAt?: string;
}

export const bannerService = {
  async getActiveBanners(position?: string): Promise<Banner[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<Banner[]>>('/api/banners', {
        params: position ? { position } : undefined,
      });
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('API /api/banners fallback', err);
    }
    return [];
  },
};

export default bannerService;
