import axiosInstance from '@/lib/axiosInstance';
import { Wishlist, WishlistItem } from '@/types/wishlist.types';
import { ApiResponse } from '@/types/api.types';
import { productService } from './product.service';
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
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      // 401 unauthenticated users use local storage wishlist
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
      // Guest fallback to local storage
    }

    const wl = getLocalWishlist();
    const product = await productService.getProductById(productId);
    if (!product) return wl;

    const variant = variantId ? product.variants.find(v => v.id === variantId) : product.variants[0];

    if (!wl.items.some(i => i.productId === productId)) {
      const item: WishlistItem = {
        id: `wli_${Date.now()}`,
        wishlistId: wl.id,
        productId,
        variantId: variant?.id,
        product,
        variant,
        addedAt: new Date().toISOString(),
      };
      const updated = {
        ...wl,
        items: [...wl.items, item],
        totalItems: wl.items.length + 1,
      };
      saveLocalWishlist(updated);
      return updated;
    }

    return wl;
  },

  // Remove item from wishlist
  async removeItem(productId: string): Promise<Wishlist> {
    try {
      const response = await axiosInstance.delete<ApiResponse<Wishlist>>(`/api/wishlist/items/${productId}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      // Fallback to local
    }

    const wl = getLocalWishlist();
    const updated = {
      ...wl,
      items: wl.items.filter(i => i.productId !== productId),
      totalItems: Math.max(0, wl.items.length - 1),
    };
    saveLocalWishlist(updated);
    return updated;
  },

  // Clear wishlist
  async clearWishlist(): Promise<void> {
    try {
      await axiosInstance.delete('/api/wishlist');
    } catch {}
    saveLocalWishlist({ id: 'wl-local', items: [], totalItems: 0 });
  },

  // Move item to cart
  async moveToCart(itemId: string, variantId?: string): Promise<void> {
    try {
      await axiosInstance.post(`/api/wishlist/items/${itemId}/move-to-cart`, { variantId });
      return;
    } catch {}

    const targetVariantId = variantId || 'var-1';
    await cartService.addItem({ variantId: targetVariantId, quantity: 1 });
    const wl = getLocalWishlist();
    const updated = {
      ...wl,
      items: wl.items.filter(i => i.id !== itemId),
      totalItems: Math.max(0, wl.items.length - 1),
    };
    saveLocalWishlist(updated);
  },
};

export default wishlistService;
