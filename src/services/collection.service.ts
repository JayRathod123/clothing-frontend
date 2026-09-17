import axiosInstance from '@/lib/axiosInstance';
import { Collection, CollectionFilterParams } from '@/types/collection.types';
import { Product } from '@/types/product.types';
import { ApiResponse, PaginatedData } from '@/types/api.types';
import { normalizeProduct } from './product.service';

export const collectionService = {
  // Get all collections directly from live API
  async getCollections(params?: CollectionFilterParams): Promise<Collection[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>('/api/collections', {
        params,
      });
      const items = response.data?.data?.data || response.data?.data?.items || [];
      if (response.data.success && Array.isArray(items)) {
        return items;
      }
    } catch (err) {
      console.error('API /api/collections error:', err);
    }

    return [];
  },

  // Get collection by slug directly from live API
  async getCollectionBySlug(slug: string): Promise<Collection | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<Collection>>(`/api/collections/slug/${slug}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`API /api/collections/slug/${slug} error:`, err);
    }

    try {
      const all = await this.getCollections();
      return all.find(c => c.slug === slug) || null;
    } catch {
      return null;
    }
  },

  // Get products in a collection by slug directly from live API
  async getCollectionProducts(slug: string): Promise<Product[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<PaginatedData<any>>>(`/api/collections/slug/${slug}/products`);
      if (response.data.success && response.data.data?.items) {
        return response.data.data.items.map(normalizeProduct);
      }
    } catch (err) {
      console.warn(`API /api/collections/slug/${slug}/products error:`, err);
    }

    return [];
  }
};

export default collectionService;
