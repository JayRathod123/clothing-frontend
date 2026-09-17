import axiosInstance from '@/lib/axiosInstance';
import { Category, CategoryFilterParams, CategoryTree } from '@/types/category.types';
import { ApiResponse, PaginatedData } from '@/types/api.types';

export const categoryService = {
  // Get all categories directly from live API
  async getCategories(params?: CategoryFilterParams): Promise<Category[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<PaginatedData<Category>>>('/api/categories', {
        params,
      });
      if (response.data.success && response.data.data?.items) {
        return response.data.data.items;
      }
    } catch (err) {
      console.error('API /api/categories error:', err);
    }

    return [];
  },

  // Get category tree directly from live API
  async getCategoryTree(): Promise<CategoryTree[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<CategoryTree[]>>('/api/categories/tree');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.error('API /api/categories/tree error:', err);
    }

    return [];
  },

  // Get category by slug directly from live API
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<Category>>(`/api/categories/slug/${slug}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`API /api/categories/slug/${slug} error:`, err);
    }

    try {
      const categories = await this.getCategories();
      return categories.find(c => c.slug === slug) || null;
    } catch {
      return null;
    }
  },
};

export default categoryService;
