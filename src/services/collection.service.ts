import axiosInstance from '@/lib/axiosInstance';
import { Collection, CollectionFilterParams } from '@/types/collection.types';
import { Product } from '@/types/product.types';
import { ApiResponse, PaginatedData } from '@/types/api.types';
import { MOCK_COLLECTIONS, MOCK_PRODUCTS } from '@/constants/mockData';

export const collectionService = {
  // Get all collections
  async getCollections(params?: CollectionFilterParams): Promise<Collection[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>('/api/collections', {
        params,
      });
      const items = response.data?.data?.items || response.data?.data?.data || [];
      if (response.data.success && items.length > 0) {
        return items;
      }
    } catch (err) {
      console.warn('API /api/collections fallback', err);
    }

    return MOCK_COLLECTIONS;
  },

  // Get collection by slug
  async getCollectionBySlug(slug: string): Promise<Collection | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<Collection>>(`/api/collections/slug/${slug}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`API /api/collections/slug/${slug} fallback`, err);
    }

    return MOCK_COLLECTIONS.find(c => c.slug === slug) || MOCK_COLLECTIONS[0];
  },

  // Get products in a collection by slug
  async getCollectionProducts(slug: string): Promise<Product[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<PaginatedData<Product>>>(`/api/collections/slug/${slug}/products`);
      if (response.data.success && response.data.data?.items?.length > 0) {
        return response.data.data.items;
      }
    } catch (err) {
      console.warn(`API /api/collections/slug/${slug}/products fallback`, err);
    }

    return MOCK_PRODUCTS.slice(0, 6);
  }
};
