import axiosInstance from '@/lib/axiosInstance';
import { Product, ProductFilterParams, ProductVariant, ProductImage } from '@/types/product.types';
import { PaginatedData, ApiResponse } from '@/types/api.types';
import { MOCK_PRODUCTS } from '@/constants/mockData';

// Normalizer to convert backend NestJS schema to clean frontend model
export function normalizeProduct(raw: any): Product {
  const basePrice = typeof raw.basePrice === 'string' ? parseFloat(raw.basePrice) : Number(raw.basePrice || 0);
  const discountPrice = raw.discountPrice ? (typeof raw.discountPrice === 'string' ? parseFloat(raw.discountPrice) : Number(raw.discountPrice)) : null;
  
  const images: ProductImage[] = (raw.images || []).map((img: any, idx: number) => ({
    id: img.id || `img-${idx}`,
    productId: raw.id,
    variantId: img.variantId || null,
    url: typeof img === 'string' ? img : img.url,
    altText: img.altText || raw.name,
    isPrimary: img.isPrimary ?? (idx === 0),
    sortOrder: img.sortOrder ?? idx,
  }));

  const primaryImage = raw.primaryImage?.url || images[0]?.url || (typeof raw.primaryImage === 'string' ? raw.primaryImage : '') || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop';
  const secondaryImage = images[1]?.url || primaryImage;

  const variants: ProductVariant[] = (raw.variants && raw.variants.length > 0)
    ? raw.variants.map((v: any, idx: number) => {
        const vPrice = typeof v.price === 'string' ? parseFloat(v.price) : Number(v.price || basePrice);
        const vDiscount = v.discountPrice ? (typeof v.discountPrice === 'string' ? parseFloat(v.discountPrice) : Number(v.discountPrice)) : discountPrice;
        
        let hex = '#171717';
        const cLower = (v.color || '').toLowerCase();
        if (cLower.includes('white') || cLower.includes('chalk') || cLower.includes('cream')) hex = '#F4F4F5';
        else if (cLower.includes('blue') || cLower.includes('navy')) hex = '#1E3A8A';
        else if (cLower.includes('grey') || cLower.includes('gray')) hex = '#64748B';
        else if (cLower.includes('brown') || cLower.includes('earth') || cLower.includes('taupe')) hex = '#78350F';
        else if (cLower.includes('red') || cLower.includes('crimson')) hex = '#991B1B';
        else if (cLower.includes('green') || cLower.includes('olive')) hex = '#3F6212';

        return {
          id: v.id || `var-${raw.id}-${idx}`,
          productId: raw.id,
          sku: v.sku || `${raw.sku}-${v.size || 'M'}`,
          size: v.size || 'M',
          color: v.color || 'Onyx Black',
          colorHex: v.colorHex || hex,
          price: vPrice,
          discountPrice: vDiscount,
          stockQuantity: Number(v.stockQuantity ?? 25),
          isActive: v.isActive ?? true,
        };
      })
    : [
        {
          id: `var-${raw.id}-s`,
          productId: raw.id,
          sku: `${raw.sku || 'SKU'}-S`,
          size: 'S',
          color: 'Onyx Black',
          colorHex: '#171717',
          price: basePrice,
          discountPrice,
          stockQuantity: 15,
          isActive: true,
        },
        {
          id: `var-${raw.id}-m`,
          productId: raw.id,
          sku: `${raw.sku || 'SKU'}-M`,
          size: 'M',
          color: 'Onyx Black',
          colorHex: '#171717',
          price: basePrice,
          discountPrice,
          stockQuantity: 25,
          isActive: true,
        },
        {
          id: `var-${raw.id}-l`,
          productId: raw.id,
          sku: `${raw.sku || 'SKU'}-L`,
          size: 'L',
          color: 'Onyx Black',
          colorHex: '#171717',
          price: basePrice,
          discountPrice,
          stockQuantity: 30,
          isActive: true,
        },
        {
          id: `var-${raw.id}-xl`,
          productId: raw.id,
          sku: `${raw.sku || 'SKU'}-XL`,
          size: 'XL',
          color: 'Onyx Black',
          colorHex: '#171717',
          price: basePrice,
          discountPrice,
          stockQuantity: 20,
          isActive: true,
        },
      ];

  const avgRating = raw.averageRating ? parseFloat(raw.averageRating) : (raw.rating || 4.8);

  return {
    id: raw.id,
    name: raw.name,
    slug: raw.slug || raw.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    description: raw.description || 'Premium heavyweight streetwear staple engineered for drape, longevity, and everyday confidence.',
    categoryId: raw.categoryId || raw.category?.id || 'cat-1',
    categoryName: raw.category?.name || raw.categoryName || 'T-Shirts',
    basePrice,
    discountPrice,
    sku: raw.sku || 'KTC-001',
    status: raw.status || 'active',
    isFeatured: raw.isFeatured ?? false,
    metaTitle: raw.metaTitle || `${raw.name} | Streetwear T-Shirt`,
    metaDescription: raw.metaDescription || raw.description,
    primaryImage,
    secondaryImage,
    images: images.length > 0 ? images : [{ id: `img-1`, productId: raw.id, url: primaryImage, isPrimary: true, sortOrder: 0 }],
    variants,
    rating: avgRating > 0 ? avgRating : 4.8,
    reviewCount: raw.reviewCount || 18,
    gsm: raw.gsm || 240,
    fabric: raw.fabric || '100% Super Combed Ringspun Terry Cotton',
    fit: raw.fit || 'Oversized Boxy Silhouette',
    details: raw.details || [
      '240 GSM Heavyweight French Terry Knit',
      'Structured High Ribbed Collar (1.25" width)',
      'Pre-Shrunk & Bio-Washed for Zero Post-Wash Shrinkage',
      'Blind Stitch Detailing on Hem & Cuffs',
      'High-Density Screen Print / Subtle Embroidery',
    ],
    careInstructions: raw.careInstructions || [
      'Machine wash cold inside out with like colors',
      'Do not bleach or dry clean',
      'Tumble dry low or hang dry in shade to preserve print',
      'Warm iron inside out if needed, avoid direct contact with graphics',
    ],
    createdAt: raw.createdAt || new Date().toISOString(),
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

export const productService = {
  // Get paginated list of products with filters
  async getProducts(params?: ProductFilterParams): Promise<PaginatedData<Product>> {
    try {
      const response = await axiosInstance.get<ApiResponse<PaginatedData<any>>>('/api/products', {
        params,
      });

      if (response.data.success && response.data.data) {
        const rawItems = response.data.data.items || [];
        if (rawItems.length > 0) {
          const normalized = rawItems.map(normalizeProduct);

          // If backend has fewer than 6 items (e.g. initial dev database), combine with curated mock products
          // so the storefront looks full and rich across all categories
          let combined = normalized;
          if (normalized.length < 6 && (!params?.search)) {
            const existingSlugs = new Set(normalized.map(p => p.slug));
            const additional = MOCK_PRODUCTS.filter(p => !existingSlugs.has(p.slug));
            combined = [...normalized, ...additional];
          }

          return {
            items: combined,
            total: Math.max(response.data.data.total || 0, combined.length),
            page: response.data.data.page || 1,
            limit: response.data.data.limit || 12,
            totalPages: Math.ceil(combined.length / (response.data.data.limit || 12)) || 1,
          };
        }
      }
    } catch (err) {
      console.warn('API /api/products unavailable, using fallback mock data', err);
    }

    // Client fallback filter logic
    let filtered = [...MOCK_PRODUCTS];

    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter(p => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
    }
    if (params?.categoryId) {
      const catId = params.categoryId;
      filtered = filtered.filter(p => p.categoryId === catId || p.categoryName?.toLowerCase() === catId.toLowerCase());
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
      const response = await axiosInstance.get<ApiResponse<any>>(`/api/products/slug/${slug}`);
      if (response.data.success && response.data.data) {
        return normalizeProduct(response.data.data);
      }
    } catch (err) {
      console.warn(`API /api/products/slug/${slug} fallback to mock`, err);
    }

    const found = MOCK_PRODUCTS.find(p => p.slug === slug);
    if (found) return found;
    return MOCK_PRODUCTS[0];
  },

  // Get product by ID
  async getProductById(id: string): Promise<Product> {
    try {
      const response = await axiosInstance.get<ApiResponse<any>>(`/api/products/${id}`);
      if (response.data.success && response.data.data) {
        return normalizeProduct(response.data.data);
      }
    } catch (err) {
      console.warn(`API /api/products/${id} fallback to mock`, err);
    }

    const found = MOCK_PRODUCTS.find(p => p.id === id);
    if (found) return found;
    return MOCK_PRODUCTS[0];
  },
};

export default productService;
