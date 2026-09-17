import { Product, ProductVariant } from './product.types';

export interface WishlistItem {
  id: string;
  wishlistId: string;
  productId: string;
  variantId?: string | null;
  product: Product;
  variant?: ProductVariant | null;
  addedAt: string;
}

export interface Wishlist {
  id: string;
  userId?: string;
  items: WishlistItem[];
  totalItems: number;
}
