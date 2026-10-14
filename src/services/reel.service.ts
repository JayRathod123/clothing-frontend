import axiosInstance from '@/lib/axiosInstance';
import { ApiResponse } from '@/types/api.types';

export interface Reel {
  id: string;
  title: string;
  reelUrl: string;
  sortOrder?: number;
  isActive?: boolean;
  thumbnailUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateReelDto {
  title: string;
  reelUrl: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface UpdateReelDto {
  title?: string;
  reelUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface GetAdminReelsParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
  sortBy?: 'sortOrder' | 'createdAt' | 'title';
  sortOrder?: 'ASC' | 'DESC';
}

export const reelService = {
  /**
   * Public endpoint returning currently active Instagram reels for website display,
   * ordered by sortOrder.
   */
  async getActiveReels(): Promise<Reel[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<Reel[]>>('/api/reels');
      if (response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('API /api/reels fallback', err);
    }
    return [];
  },

  /**
   * Retrieve details of a single reel by UUID.
   */
  async getReelById(id: string): Promise<Reel | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<Reel>>(`/api/reels/${id}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`API /api/reels/${id} error`, err);
    }
    return null;
  },

  /**
   * Admin endpoint to list all reels with filtering, search, and pagination.
   */
  async getAdminReels(params?: GetAdminReelsParams): Promise<{ reels: Reel[]; total: number }> {
    try {
      const response = await axiosInstance.get<ApiResponse<{ items?: Reel[]; reels?: Reel[]; total?: number }>>('/api/reels/admin', {
        params,
      });
      if (response.data.success) {
        const raw = response.data.data as any;
        const list = Array.isArray(raw) ? raw : (raw.items || raw.reels || raw.data || []);
        const total = raw.total || list.length;
        return { reels: list, total };
      }
    } catch (err) {
      console.warn('API /api/reels/admin error', err);
    }
    return { reels: [], total: 0 };
  },

  /**
   * Create a new reel entry (Admin)
   */
  async createReel(dto: CreateReelDto): Promise<Reel> {
    const response = await axiosInstance.post<ApiResponse<Reel>>('/api/reels', dto);
    return response.data.data;
  },

  /**
   * Update reel (Admin)
   */
  async updateReel(id: string, dto: UpdateReelDto): Promise<Reel> {
    const response = await axiosInstance.patch<ApiResponse<Reel>>(`/api/reels/${id}`, dto);
    return response.data.data;
  },

  /**
   * Delete reel (Admin)
   */
  async deleteReel(id: string): Promise<boolean> {
    const response = await axiosInstance.delete<ApiResponse<{ deleted?: boolean }>>(`/api/reels/${id}`);
    return Boolean(response.data.success);
  },
};

export default reelService;
