export interface ProductImage {
  id: string;
  productId: string;
  variantId?: string | null;
  url: string;
  altText?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string; // e.g. "S", "M", "L", "XL", "XXL"
  color: string; // e.g. "Washed Black", "Chalk White", "Earthy Taupe"
  colorHex?: string;
  price: number;
  discountPrice?: number | null;
  stockQuantity: number;
  isActive: boolean;
  images?: ProductImage[];
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  categoryName?: string;
  basePrice: number;
  discountPrice?: number | null;
  sku: string;
  status: 'active' | 'inactive';
  isFeatured: boolean;
  metaTitle?: string;
  metaDescription?: string;
  primaryImage?: string;
  secondaryImage?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  rating?: number;
  reviewCount?: number;
  // Editorial craftsmanship specs
  gsm?: number;
  fabric?: string;
  fit?: string;
  details?: string[];
  careInstructions?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  search?: string;
  categoryId?: string;
  status?: 'active' | 'inactive';
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  sortBy?: 'price' | 'createdAt' | 'popularity' | 'name';
  sortOrder?: 'ASC' | 'DESC';
}
