import axiosInstance from '@/lib/axiosInstance';
import { Collection, CollectionFilterParams } from '@/types/collection.types';
import { Product } from '@/types/product.types';
import { ApiResponse, PaginatedData } from '@/types/api.types';
import { normalizeProduct, productService } from './product.service';

export const collectionService = {
  // Get all collections directly from live API (with embedded products enriched via product details API)
  async getCollections(params?: CollectionFilterParams): Promise<Collection[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>('/api/collections', {
        params,
      });
      const items = response.data?.data?.data || response.data?.data?.items || [];
      if (response.data.success && Array.isArray(items)) {
        return Promise.all(
          items.map(async (col: any) => {
            let products: Product[] | undefined = undefined;
            if (Array.isArray(col.products) && col.products.length > 0) {
              products = await Promise.all(
                col.products.map(async (p: any) => {
                  if (p.slug) {
                    const detail = await productService.getProductBySlug(p.slug);
                    if (detail) return detail;
                  }
                  return normalizeProduct(p);
                })
              );
            }
            return {
              ...col,
              products,
            };
          })
        );
      }
    } catch (err) {
      console.error('API /api/collections error:', err);
    }

    return [];
  },

  // Get collection by slug directly from live API
  async getCollectionBySlug(slug: string): Promise<Collection | null> {
    try {
      // First check all collections as /api/collections provides embedded products
      const all = await this.getCollections();
      const found = all.find((c) => c.slug === slug || c.id === slug);
      if (found && Array.isArray(found.products) && found.products.length > 0) {
        return found;
      }

      const response = await axiosInstance.get<any>(`/api/collections/slug/${slug}`);
      const resData = response.data;
      const collection = resData?.data?.data || resData?.data || resData;
      if (collection && (collection.id || collection.name)) {
        const products = await this.getCollectionProducts(slug);
        return {
          ...collection,
          products,
        };
      }
    } catch (err) {
      console.warn(`API /api/collections/slug/${slug} error:`, err);
    }

    return null;
  },

  // Get products in a collection by slug directly from live API
  async getCollectionProducts(slug: string): Promise<Product[]> {
    try {
      const response = await axiosInstance.get<any>(`/api/collections/slug/${slug}/products`);
      const resData = response.data;
      const data = resData?.data;
      const rawProducts = data?.data || data?.items || (Array.isArray(data) ? data : []);
      if (Array.isArray(rawProducts) && rawProducts.length > 0) {
        return Promise.all(
          rawProducts.map(async (p: any) => {
            if (p.slug) {
              const detail = await productService.getProductBySlug(p.slug);
              if (detail) return detail;
            }
            return normalizeProduct(p);
          })
        );
      }

      // Fallback: check all collections for embedded products
      const all = await this.getCollections();
      const found = all.find((c) => c.slug === slug || c.id === slug);
      if (found?.products && found.products.length > 0) {
        return found.products;
      }
    } catch (err) {
      console.warn(`API /api/collections/slug/${slug}/products error:`, err);
    }

    return [];
  }
};

export default collectionService;
