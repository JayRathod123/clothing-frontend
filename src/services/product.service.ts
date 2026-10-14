import axiosInstance from '@/lib/axiosInstance';
import { Product, ProductFilterParams, ProductVariant, ProductImage } from '@/types/product.types';
import { PaginatedData, ApiResponse } from '@/types/api.types';

// Normalizer to convert backend NestJS schema to clean frontend model
export function normalizeProduct(raw: any): Product {
  const basePrice = typeof raw.basePrice === 'string' ? parseFloat(raw.basePrice) : Number(raw.basePrice || 0);
  const discountPrice = raw.discountPrice ? (typeof raw.discountPrice === 'string' ? parseFloat(raw.discountPrice) : Number(raw.discountPrice)) : null;
  
  let rawImagesList: any[] = Array.isArray(raw.images) ? [...raw.images] : [];
  if (rawImagesList.length === 0 && raw.groupedImages && typeof raw.groupedImages === 'object') {
    Object.values(raw.groupedImages).forEach((list: any) => {
      if (Array.isArray(list)) {
        rawImagesList.push(...list);
      }
    });
  }
  const mappedImages: ProductImage[] = rawImagesList
    .map((img: any, idx: number) => ({
      id: String(img.id || `img-${idx}`),
      productId: raw.id,
      variantId: img.variantId || null,
      url: typeof img === 'string' ? img : (img.url || img.imageUrl || ''),
      altText: img.altText || raw.name,
      isPrimary: img.isPrimary ?? (idx === 0),
      sortOrder: img.sortOrder ?? idx,
    }))
    .filter((img: ProductImage) => Boolean(img.url));

  const primaryImage =
    raw.primaryImage?.url ||
    (typeof raw.primaryImage === 'string' ? raw.primaryImage : '') ||
    mappedImages[0]?.url ||
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop';

  const images: ProductImage[] = [...mappedImages];
  if (primaryImage && !images.some((img: ProductImage) => img.url === primaryImage)) {
    images.unshift({
      id: `img-primary`,
      productId: raw.id,
      url: primaryImage,
      isPrimary: true,
      sortOrder: 0,
    });
  }
  if (images.length === 0) {
    images.push({
      id: `img-1`,
      productId: raw.id,
      url: primaryImage,
      isPrimary: true,
      sortOrder: 0,
    });
  }

  const secondaryImage = images[1]?.url || primaryImage;

  const variants: ProductVariant[] = (Array.isArray(raw.variants) && raw.variants.length > 0)
    ? raw.variants.map((v: any, idx: number) => {
        const vPrice = typeof v.price === 'string' ? parseFloat(v.price) : Number(v.price || basePrice);
        const vDiscount = v.discountPrice ? (typeof v.discountPrice === 'string' ? parseFloat(v.discountPrice) : Number(v.discountPrice)) : discountPrice;
        
        let hex = v.colorHex || '#171717';
        const cLower = (v.color || '').toLowerCase();
        if (!v.colorHex) {
          if (cLower.includes('white') || cLower.includes('chalk') || cLower.includes('cream')) hex = '#F4F4F5';
          else if (cLower.includes('blue') || cLower.includes('navy')) hex = '#1E3A8A';
          else if (cLower.includes('grey') || cLower.includes('gray')) hex = '#64748B';
          else if (cLower.includes('brown') || cLower.includes('earth') || cLower.includes('taupe')) hex = '#78350F';
          else if (cLower.includes('red') || cLower.includes('crimson')) hex = '#991B1B';
          else if (cLower.includes('green') || cLower.includes('olive')) hex = '#3F6212';
        }

        return {
          id: v.id || `var-${raw.id}-${idx}`,
          productId: raw.id,
          sku: v.sku || `${raw.sku || ''}-${v.size || 'M'}`,
          size: v.size || '',
          color: v.color || '',
          colorHex: hex,
          price: vPrice,
          discountPrice: vDiscount,
          stockQuantity: Number(v.stockQuantity ?? 0),
          isActive: v.isActive ?? true,
        };
      })
    : [];

  const rawAvg = raw.averageRating ?? raw.rating ?? raw.avgRating;
  const avgRating = rawAvg !== undefined && rawAvg !== null && rawAvg !== '' ? parseFloat(String(rawAvg)) : 0;

  const rawReviewsCount = raw.reviewCount ?? raw.reviewsCount ?? raw.totalReviews ?? (Array.isArray(raw.reviews) ? raw.reviews.length : undefined);
  const reviewCount = rawReviewsCount !== undefined && rawReviewsCount !== null ? Number(rawReviewsCount) : 0;

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug || (raw.name ? raw.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') : ''),
    description: raw.description ? String(raw.description).trim() : '',
    categoryId: raw.categoryId || raw.category?.id || '',
    categoryName: raw.category?.name || raw.categoryName || '',
    basePrice,
    discountPrice,
    sku: raw.sku || '',
    status: raw.status || 'active',
    isFeatured: raw.isFeatured ?? false,
    metaTitle: raw.metaTitle || `${raw.name || 'Product'} | INKSTYLES`,
    metaDescription: raw.metaDescription || raw.description || '',
    primaryImage,
    secondaryImage,
    images: images.length > 0 ? images : [{ id: `img-1`, productId: raw.id, url: primaryImage, isPrimary: true, sortOrder: 0 }],
    variants,
    rating: avgRating,
    reviewCount,
    gsm: raw.gsm ? Number(raw.gsm) : undefined,
    fabric: raw.fabric || undefined,
    fit: raw.fit || undefined,
    details: Array.isArray(raw.details) && raw.details.length > 0 ? raw.details : undefined,
    careInstructions: Array.isArray(raw.careInstructions) && raw.careInstructions.length > 0 ? raw.careInstructions : undefined,
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

export const productService = {
  // Get paginated list of products directly from live API and enrich each with full product details
  async getProducts(params?: ProductFilterParams): Promise<PaginatedData<Product>> {
    try {
      const cleanParams: any = { ...params };
      // Backend requires categoryId to be a valid UUID; omit if not a UUID
      if (cleanParams.categoryId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(cleanParams.categoryId)) {
        delete cleanParams.categoryId;
      }

      const response = await axiosInstance.get<ApiResponse<PaginatedData<any>>>('/api/products', {
        params: cleanParams,
      });

      if (response.data.success && response.data.data) {
        const rawItems = response.data.data.items || [];

        // Call the product details API (ProductsController_findBySlug) for each product
        // to populate complete variants, sizes, colors, and gallery images
        const detailedItems: Product[] = await Promise.all(
          rawItems.map(async (rawItem: any) => {
            if (rawItem.slug) {
              const detail = await this.getProductBySlug(rawItem.slug);
              if (detail) return detail;
            }
            if (rawItem.id) {
              const detailById = await this.getProductById(rawItem.id);
              if (detailById) return detailById;
            }
            return normalizeProduct(rawItem);
          })
        );

        return {
          items: detailedItems,
          total: response.data.data.total ?? detailedItems.length,
          page: response.data.data.page ?? 1,
          limit: response.data.data.limit ?? (params?.limit || 12),
          totalPages: response.data.data.totalPages ?? Math.ceil(detailedItems.length / (params?.limit || 12)),
        };
      }
    } catch (err) {
      console.error('API /api/products request failed:', err);
    }

    return {
      items: [],
      total: 0,
      page: params?.page || 1,
      limit: params?.limit || 12,
      totalPages: 0,
    };
  },

  // Get product by slug directly from live API (ProductsController_findBySlug)
  async getProductBySlug(slug: string): Promise<Product | null> {
    if (!slug) return null;
    try {
      const response = await axiosInstance.get<ApiResponse<any>>(`/api/products/slug/${encodeURIComponent(slug)}`);
      if (response.data.success && response.data.data) {
        return normalizeProduct(response.data.data);
      }
    } catch (err) {
      console.warn(`API /api/products/slug/${slug} error:`, err);
    }
    return null;
  },

  // Get product by ID directly from live API (ProductsController_findOne)
  async getProductById(id: string): Promise<Product | null> {
    if (!id) return null;
    try {
      const response = await axiosInstance.get<ApiResponse<any>>(`/api/products/${encodeURIComponent(id)}`);
      if (response.data.success && response.data.data) {
        return normalizeProduct(response.data.data);
      }
    } catch (err) {
      console.warn(`API /api/products/${id} error:`, err);
    }

    return null;
  },
};

export default productService;
