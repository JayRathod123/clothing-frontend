import { useQuery, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/product.service';
import { Product, ProductFilterParams } from '@/types/product.types';

export function useProducts(params?: ProductFilterParams) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: ['products', params],
    queryFn: async () => {
      const data = await productService.getProducts(params);
      // Pre-seed individual product query caches with the product details API response
      data.items.forEach((p) => {
        if (p.slug) {
          queryClient.setQueryData(['product', p.slug], p);
        }
      });
      return data;
    },
  });
}

/**
 * Calls GET /api/products/slug/:slug (ProductsController_findBySlug)
 * and returns product data, loading, and error states.
 */
export function useProductBySlug(slug: string, initialData?: Product | null) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getProductBySlug(slug),
    initialData: initialData ?? undefined,
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 3, // 3 minutes cache
  });
}
