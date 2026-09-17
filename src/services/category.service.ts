import axiosInstance from '@/lib/axiosInstance';
import { Category, CategoryFilterParams, CategoryTree } from '@/types/category.types';
import { ApiResponse, PaginatedData } from '@/types/api.types';
import { MOCK_CATEGORIES } from '@/constants/mockData';

export const categoryService = {
  // Get all categories
  async getCategories(params?: CategoryFilterParams): Promise<Category[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<PaginatedData<Category>>>('/api/categories', {
        params,
      });
      if (response.data.success && response.data.data?.items?.length > 0) {
        return response.data.data.items;
      }
    } catch (err) {
      console.warn('API /api/categories unavailable, using fallback', err);
    }

    return MOCK_CATEGORIES;
  },

  // Get category tree
  async getCategoryTree(): Promise<CategoryTree[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<CategoryTree[]>>('/api/categories/tree');
      if (response.data.success && response.data.data?.length > 0) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('API /api/categories/tree fallback', err);
    }

    return MOCK_CATEGORIES as CategoryTree[];
  },

  // Get category by slug
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<Category>>(`/api/categories/slug/${slug}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`API /api/categories/slug/${slug} fallback`, err);
    }

    return MOCK_CATEGORIES.find(c => c.slug === slug) || MOCK_CATEGORIES[0];
  },
};
