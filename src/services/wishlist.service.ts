import axiosInstance from '@/lib/axiosInstance';
import { Wishlist, WishlistItem } from '@/types/wishlist.types';
import { ApiResponse } from '@/types/api.types';
import { MOCK_PRODUCTS } from '@/constants/mockData';
import { cartService } from './cart.service';

const LOCAL_WISHLIST_KEY = 'aura_local_wishlist';

function getLocalWishlist(): Wishlist {
  if (typeof window === 'undefined') {
    return { id: 'wl-server', items: [], totalItems: 0 };
  }
  try {
    const raw = localStorage.getItem(LOCAL_WISHLIST_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { id: 'wl-local', items: [], totalItems: 0 };
}

function saveLocalWishlist(wl: Wishlist): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(wl));
  } catch {}
}

export const wishlistService = {
  // Get customer wishlist
  async getWishlist(): Promise<Wishlist> {
    try {
      const response = await axiosInstance.get<ApiResponse<Wishlist>>('/api/wishlist');
      if (response.data.success && response.data.data?.items?.length > 0) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('API /api/wishlist fallback', err);
    }
    return getLocalWishlist();
  },

  // Add item to wishlist
  async addItem(productId: string, variantId?: string): Promise<Wishlist> {
    try {
      const response = await axiosInstance.post<ApiResponse<Wishlist>>('/api/wishlist/items', {
        productId,
        variantId,
      });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('API /api/wishlist/items fallback', err);
    }

    const wl = getLocalWishlist();
    const product = MOCK_PRODUCTS.find(p => p.id === productId) || MOCK_PRODUCTS[0];
    const variant = variantId ? product.variants.find(v => v.id === variantId) : product.variants[0];

    if (!wl.items.some(i => i.productId === productId)) {
      const item: WishlistItem = {
        id: `wli_${Date.now()}`,
        wishlistId: wl.id,
        productId,
        variantId: variant?.id,
        product,
        variant,
        addedAt: new Date().toISOString()
      };
      wl.items.push(item);
      wl.totalItems = wl.items.length;
      saveLocalWishlist(wl);
    }
    return wl;
  },

  // Remove item from wishlist
  async removeItem(itemId: string): Promise<Wishlist> {
    try {
      const response = await axiosInstance.delete<ApiResponse<Wishlist>>(`/api/wishlist/items/${itemId}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`API /api/wishlist/items/${itemId} fallback`, err);
    }

    const wl = getLocalWishlist();
    wl.items = wl.items.filter(i => i.id !== itemId && i.productId !== itemId);
    wl.totalItems = wl.items.length;
    saveLocalWishlist(wl);
    return wl;
  },

  // Move item to cart
  async moveToCart(itemId: string): Promise<void> {
    const wl = getLocalWishlist();
    const item = wl.items.find(i => i.id === itemId || i.productId === itemId);
    if (item && item.variant) {
      await cartService.addItem({ variantId: item.variant.id, quantity: 1 });
      await this.removeItem(itemId);
    }
  },

  // Clear wishlist
  async clearWishlist(): Promise<void> {
    try {
      await axiosInstance.delete('/api/wishlist');
    } catch {}
    saveLocalWishlist({ id: 'wl-local', items: [], totalItems: 0 });
  }
};
