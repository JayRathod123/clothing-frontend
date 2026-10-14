import axiosInstance from '@/lib/axiosInstance';
import { Wishlist, WishlistItem } from '@/types/wishlist.types';
import { ApiResponse } from '@/types/api.types';
import { isUserLoggedIn } from '@/utils/storage';

export { isUserLoggedIn };

export const wishlistService = {
  // Check if current user is logged in
  isLoggedIn(): boolean {
    return isUserLoggedIn();
  },

  // Get customer wishlist - Only call backend API if user is logged in
  async getWishlist(): Promise<Wishlist> {
    if (!isUserLoggedIn()) {
      return { id: 'wl-guest', items: [], totalItems: 0 };
    }

    try {
      const response = await axiosInstance.get<ApiResponse<Wishlist>>('/api/wishlist');
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return { id: 'wl-guest', items: [], totalItems: 0 };
      }
      console.warn('API /api/wishlist error', err);
    }
    return { id: 'wl-empty', items: [], totalItems: 0 };
  },

  // Add item to wishlist - Only call backend API if user is logged in
  async addItem(productId: string, variantId?: string): Promise<Wishlist> {
    if (!isUserLoggedIn()) {
      throw new Error('Authentication required: Please sign in to add items to your wishlist');
    }

    const response = await axiosInstance.post<ApiResponse<Wishlist>>('/api/wishlist/items', {
      productId,
      variantId,
    });
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to add item to wishlist');
  },

  // Remove item from wishlist - Only call backend API if user is logged in
  async removeItem(productId: string): Promise<Wishlist> {
    if (!isUserLoggedIn()) {
      throw new Error('Authentication required');
    }

    const response = await axiosInstance.delete<ApiResponse<Wishlist>>(`/api/wishlist/items/${productId}`);
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to remove item from wishlist');
  },

  // Clear wishlist - Only call backend API if user is logged in
  async clearWishlist(): Promise<void> {
    if (!isUserLoggedIn()) return;
    try {
      await axiosInstance.delete('/api/wishlist');
    } catch (err) {
      console.warn('API /api/wishlist clear failed', err);
    }
  },

  // Move item to cart - Only call backend API if user is logged in
  async moveToCart(itemId: string, variantId?: string): Promise<void> {
    if (!isUserLoggedIn()) {
      throw new Error('Authentication required');
    }
    await axiosInstance.post(`/api/wishlist/items/${itemId}/move-to-cart`, { variantId });
  },
};

export default wishlistService;
