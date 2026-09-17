import axiosInstance from '@/lib/axiosInstance';
import { Product, ProductFilterParams } from '@/types/product.types';
import { PaginatedData, ApiResponse } from '@/types/api.types';
import { MOCK_PRODUCTS } from '@/constants/mockData';

export const productService = {
  // Get paginated list of products with filters
  async getProducts(params?: ProductFilterParams): Promise<PaginatedData<Product>> {
    try {
      const response = await axiosInstance.get<ApiResponse<PaginatedData<Product>>>('/api/products', {
        params,
      });
      if (response.data.success && response.data.data?.items?.length > 0) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('API /api/products unavailable, using fallback mock data', err);
    }

    // Fallback filter logic on mock data
    let filtered = [...MOCK_PRODUCTS];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (params?.categoryId) {
      filtered = filtered.filter(p => p.categoryId === params.categoryId);
    }
    if (params?.isFeatured !== undefined) {
      filtered = filtered.filter(p => p.isFeatured === params.isFeatured);
    }
    if (params?.minPrice !== undefined) {
      filtered = filtered.filter(p => (p.discountPrice || p.basePrice) >= params.minPrice!);
    }
    if (params?.maxPrice !== undefined) {
      filtered = filtered.filter(p => (p.discountPrice || p.basePrice) <= params.maxPrice!);
    }
    if (params?.size) {
      filtered = filtered.filter(p => p.variants?.some(v => v.size.toLowerCase() === params.size!.toLowerCase()));
    }
    if (params?.color) {
      filtered = filtered.filter(p => p.variants?.some(v => v.color.toLowerCase().includes(params.color!.toLowerCase())));
    }

    if (params?.sortBy === 'price') {
      filtered.sort((a, b) => {
        const priceA = a.discountPrice || a.basePrice;
        const priceB = b.discountPrice || b.basePrice;
        return params.sortOrder === 'ASC' ? priceA - priceB : priceB - priceA;
      });
    } else if (params?.sortBy === 'name') {
      filtered.sort((a, b) => params.sortOrder === 'DESC' ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name));
    }

    const page = params?.page || 1;
    const limit = params?.limit || 12;
    const startIndex = (page - 1) * limit;
    const paginatedItems = filtered.slice(startIndex, startIndex + limit);

    return {
      items: paginatedItems,
      total: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit) || 1,
    };
  },

  // Get product by slug
  async getProductBySlug(slug: string): Promise<Product> {
    try {
      const response = await axiosInstance.get<ApiResponse<Product>>(`/api/products/slug/${slug}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`API /api/products/slug/${slug} fallback to mock`, err);
    }

    const found = MOCK_PRODUCTS.find(p => p.slug === slug);
    if (found) return found;
    // Return first product as fallback if slug not found
    return MOCK_PRODUCTS[0];
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await axiosInstance.get<ApiResponse<Product>>(`/api/products/${id}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`API /api/products/${id} fallback to mock`, err);
    }

    const found = MOCK_PRODUCTS.find(p => p.id === id);
    if (found) return found;
    return MOCK_PRODUCTS[0];
  },
};
