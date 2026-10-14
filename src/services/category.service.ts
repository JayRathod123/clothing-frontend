import axiosInstance from '@/lib/axiosInstance';
import { Category, CategoryFilterParams, CategoryTree } from '@/types/category.types';
import { ApiResponse, PaginatedData } from '@/types/api.types';

export const categoryService = {
  // Get all categories directly from live API
  async getCategories(params?: CategoryFilterParams): Promise<Category[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>('/api/categories', {
        params,
      });
      const resData = response.data?.data;
      const items = resData?.data || resData?.items || (Array.isArray(resData) ? resData : []);
      if (response.data?.success && Array.isArray(items)) {
        return items;
      }
    } catch (err) {
      console.error('API /api/categories error:', err);
    }

    return [];
  },

  // Get category tree directly from live API
  async getCategoryTree(): Promise<CategoryTree[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>('/api/categories/tree');
      const resData = response.data?.data;
      const tree = resData?.data || resData?.items || (Array.isArray(resData) ? resData : []);
      if (response.data?.success && Array.isArray(tree)) {
        return tree;
      }
    } catch (err) {
      console.error('API /api/categories/tree error:', err);
    }

    return [];
  },

  // Get category by slug directly from live API
  async getCategoryBySlug(slug: string): Promise<Category | null> {
    try {
      const response = await axiosInstance.get<any>(`/api/categories/slug/${slug}`);
      const resData = response.data;
      const category = resData?.data?.data || resData?.data || resData;
      if (category && (category.id || category.name)) {
        return category;
      }
    } catch (err) {
      console.warn(`API /api/categories/slug/${slug} error:`, err);
    }

    try {
      const categories = await this.getCategories();
      return categories.find(c => c.slug === slug || c.id === slug) || null;
    } catch {
      return null;
    }
  },
};

export default categoryService;
