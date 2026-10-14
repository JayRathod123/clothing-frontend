import axiosInstance from '@/lib/axiosInstance';
import { Cart, CartItem, AddCartItemDto } from '@/types/cart.types';
import { ApiResponse } from '@/types/api.types';

export function createEmptyCart(): Cart {
  return {
    id: '',
    status: 'active',
    subtotal: 0,
    totalUniqueItems: 0,
    totalQuantity: 0,
    items: [],
  };
}

export function normalizeCart(raw: any): Cart {
  if (!raw) return createEmptyCart();

  // Support direct object, { data: ... }, or { data: { data: ... } }
  const data = raw.data ? (raw.data.data ? raw.data.data : raw.data) : raw;
  if (!data || typeof data !== 'object') return createEmptyCart();

  const rawItems = Array.isArray(data.items) ? data.items : [];

  const items: CartItem[] = rawItems.map((i: any) => {
    const currentPrice = typeof i.currentPrice === 'string' ? parseFloat(i.currentPrice) : Number(i.currentPrice ?? i.priceAtAdd ?? i.price ?? i.variant?.price ?? 0);
    const priceAtAdd = typeof i.priceAtAdd === 'string' ? parseFloat(i.priceAtAdd) : Number(i.priceAtAdd ?? currentPrice);

    return {
      id: i.id,
      cartId: data.id || '',
      variantId: i.variantId,
      quantity: Number(i.quantity || 1),
      currentPrice,
      priceAtAdd,
      productName: i.productName || i.product?.name || i.variant?.product?.name || i.productNameSnapshot || 'Product',
      productSlug: i.productSlug || i.product?.slug || i.variant?.product?.slug || '',
      productImage: i.productImage || i.variant?.imageUrl || i.variant?.images?.[0]?.url || i.product?.primaryImage?.url || i.product?.images?.[0]?.url || i.imageUrlSnapshot || undefined,
      size: i.size || i.variant?.size || undefined,
      color: i.color || i.variant?.color || undefined,
      variant: i.variant,
      product: i.product,
      isAvailable: i.isAvailable !== false,
      availableStock: Number(i.availableStock ?? i.variant?.stockQuantity ?? 0),
    };
  });

  const subtotal = typeof data.subtotal === 'string' ? parseFloat(data.subtotal) : Number(data.subtotal || 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    id: data.id || '',
    sessionId: data.sessionId,
    userId: data.userId,
    status: data.status || 'active',
    subtotal: subtotal || items.reduce((sum, item) => sum + (item.currentPrice * item.quantity), 0),
    totalUniqueItems: items.length,
    totalQuantity: data.totalQuantity !== undefined ? Number(data.totalQuantity) : totalQuantity,
    items,
  };
}

export const cartService = {
  // Get active cart strictly from live API
  async getCart(): Promise<Cart> {
    try {
      // Clear any legacy client-side storage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('aura_local_cart_state');
      }

      const response = await axiosInstance.get<any>('/api/cart');
      const resData = response.data;
      const cartData = resData?.data?.data || resData?.data || resData;

      if (cartData && typeof cartData === 'object' && (cartData.items !== undefined || cartData.id)) {
        return normalizeCart(cartData);
      }
      return createEmptyCart();
    } catch (err: any) {
      // If 404/400 (no active cart found) or other error, cart is empty on backend
      return createEmptyCart();
    }
  },

  // Add item to cart strictly via live API
  async addItem(dto: AddCartItemDto): Promise<Cart> {
    try {
      const response = await axiosInstance.post<any>('/api/cart/items', {
        variantId: dto.variantId,
        quantity: dto.quantity || 1,
      });
      const resData = response.data;
      const cartData = resData?.data?.data || resData?.data || resData;
      if (cartData && typeof cartData === 'object' && (cartData.items !== undefined || cartData.id)) {
        return normalizeCart(cartData);
      }
      return this.getCart();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to add item to cart';
      throw new Error(msg);
    }
  },

  // Update item quantity strictly via live API
  async updateItemQuantity(itemId: string, quantity: number): Promise<Cart> {
    try {
      const response = await axiosInstance.patch<any>(`/api/cart/items/${itemId}`, { quantity });
      const resData = response.data;
      const cartData = resData?.data?.data || resData?.data || resData;
      if (cartData && typeof cartData === 'object' && (cartData.items !== undefined || cartData.id)) {
        return normalizeCart(cartData);
      }
      return this.getCart();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to update item quantity';
      throw new Error(msg);
    }
  },

  // Remove item from cart strictly via live API
  async removeItem(itemId: string): Promise<Cart> {
    try {
      const response = await axiosInstance.delete<any>(`/api/cart/items/${itemId}`);
      const resData = response.data;
      const cartData = resData?.data?.data || resData?.data || resData;
      if (cartData && typeof cartData === 'object' && (cartData.items !== undefined || cartData.id)) {
        return normalizeCart(cartData);
      }
      return this.getCart();
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to remove item';
      throw new Error(msg);
    }
  },

  // Clear entire cart strictly via live API
  async clearCart(): Promise<void> {
    try {
      await axiosInstance.delete('/api/cart');
    } catch (err) {
      console.warn('API /api/cart clear error', err);
    }
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('aura_local_cart_state');
      } catch {}
    }
  },

  // Apply Coupon code strictly via live API
  async applyCoupon(code: string, cartSubtotal: number): Promise<{ valid: boolean; discountAmount: number; message: string }> {
    try {
      const response = await axiosInstance.post<any>('/api/coupons/apply', {
        code,
        cartSubtotal,
      });
      const resData = response.data;
      const data = resData?.data?.data || resData?.data || resData;
      if (data && (resData.success || data.valid !== false || data.discountAmount !== undefined)) {
        return {
          valid: true,
          discountAmount: Number(data.discountAmount || 0),
          message: data.message || `Coupon ${code.toUpperCase()} applied successfully!`
        };
      }
      return {
        valid: false,
        discountAmount: 0,
        message: data?.message || resData?.message || 'Invalid coupon code'
      };
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Invalid or expired coupon code.';
      return { valid: false, discountAmount: 0, message: msg };
    }
  }
};

export default cartService;
