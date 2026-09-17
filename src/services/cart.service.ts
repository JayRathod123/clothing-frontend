import axiosInstance from '@/lib/axiosInstance';
import { Cart, CartItem, AddCartItemDto } from '@/types/cart.types';
import { ApiResponse } from '@/types/api.types';
import { MOCK_PRODUCTS } from '@/constants/mockData';

const LOCAL_CART_KEY = 'aura_local_cart_state';

function getLocalCart(): Cart {
  if (typeof window === 'undefined') {
    return {
      id: 'mock-cart-server',
      status: 'active',
      subtotal: 0,
      totalUniqueItems: 0,
      totalQuantity: 0,
      items: []
    };
  }
  try {
    const raw = localStorage.getItem(LOCAL_CART_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    id: `cart_${Date.now()}`,
    status: 'active',
    subtotal: 0,
    totalUniqueItems: 0,
    totalQuantity: 0,
    items: []
  };
}

function saveLocalCart(cart: Cart): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cart));
  } catch {}
}

export const cartService = {
  // Get active cart
  async getCart(): Promise<Cart> {
    try {
      const response = await axiosInstance.get<ApiResponse<Cart>>('/api/cart');
      if (response.data.success && response.data.data) {
        // If API cart has items, return it
        if (response.data.data.items && response.data.data.items.length > 0) {
          return response.data.data;
        }
      }
    } catch (err) {
      console.warn('API /api/cart fallback to client cache', err);
    }

    return getLocalCart();
  },

  // Add item to cart
  async addItem(dto: AddCartItemDto): Promise<Cart> {
    try {
      const response = await axiosInstance.post<ApiResponse<Cart>>('/api/cart/items', dto);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn('API /api/cart/items fallback to local simulation', err);
    }

    // Local cart simulation fallback
    const cart = getLocalCart();
    
    // Find matching variant across mock products
    let foundProduct = MOCK_PRODUCTS[0];
    let foundVariant = foundProduct.variants[0];

    for (const p of MOCK_PRODUCTS) {
      const v = p.variants.find(item => item.id === dto.variantId || item.sku === dto.variantId);
      if (v) {
        foundProduct = p;
        foundVariant = v;
        break;
      }
    }

    const price = foundVariant.discountPrice || foundVariant.price || foundProduct.discountPrice || foundProduct.basePrice;
    const existingIndex = cart.items.findIndex(i => i.variantId === dto.variantId);

    if (existingIndex > -1) {
      cart.items[existingIndex].quantity += dto.quantity;
    } else {
      const newItem: CartItem = {
        id: `item_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        cartId: cart.id,
        variantId: dto.variantId,
        quantity: dto.quantity,
        currentPrice: price,
        priceAtAdd: price,
        productName: foundProduct.name,
        productSlug: foundProduct.slug,
        productImage: foundProduct.primaryImage,
        size: foundVariant.size,
        color: foundVariant.color,
        variant: foundVariant,
      };
      cart.items.push(newItem);
    }

    // Recompute totals
    cart.totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.totalUniqueItems = cart.items.length;
    cart.subtotal = cart.items.reduce((sum, i) => sum + (i.currentPrice * i.quantity), 0);

    saveLocalCart(cart);
    return cart;
  },

  // Update item quantity
  async updateItemQuantity(itemId: string, quantity: number): Promise<Cart> {
    try {
      const response = await axiosInstance.patch<ApiResponse<Cart>>(`/api/cart/items/${itemId}`, { quantity });
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`API /api/cart/items/${itemId} fallback`, err);
    }

    const cart = getLocalCart();
    const item = cart.items.find(i => i.id === itemId);
    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter(i => i.id !== itemId);
      } else {
        item.quantity = quantity;
      }
      cart.totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
      cart.totalUniqueItems = cart.items.length;
      cart.subtotal = cart.items.reduce((sum, i) => sum + (i.currentPrice * i.quantity), 0);
      saveLocalCart(cart);
    }
    return cart;
  },

  // Remove item from cart
  async removeItem(itemId: string): Promise<Cart> {
    try {
      const response = await axiosInstance.delete<ApiResponse<Cart>>(`/api/cart/items/${itemId}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`API /api/cart/items/${itemId} fallback`, err);
    }

    const cart = getLocalCart();
    cart.items = cart.items.filter(i => i.id !== itemId);
    cart.totalQuantity = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    cart.totalUniqueItems = cart.items.length;
    cart.subtotal = cart.items.reduce((sum, i) => sum + (i.currentPrice * i.quantity), 0);
    saveLocalCart(cart);
    return cart;
  },

  // Clear entire cart
  async clearCart(): Promise<void> {
    try {
      await axiosInstance.delete('/api/cart');
    } catch (err) {
      console.warn('API /api/cart clear fallback', err);
    }
    const empty: Cart = {
      id: `cart_${Date.now()}`,
      status: 'active',
      subtotal: 0,
      totalUniqueItems: 0,
      totalQuantity: 0,
      items: []
    };
    saveLocalCart(empty);
  },

  // Apply Coupon code
  async applyCoupon(code: string, cartSubtotal: number): Promise<{ valid: boolean; discountAmount: number; message: string }> {
    try {
      const response = await axiosInstance.post<ApiResponse<any>>('/api/coupons/apply', {
        code,
        cartSubtotal,
      });
      if (response.data.success && response.data.data) {
        return {
          valid: true,
          discountAmount: response.data.data.discountAmount || 200,
          message: response.data.data.message || `Coupon ${code.toUpperCase()} applied successfully!`
        };
      }
    } catch (err: any) {
      console.warn('API /api/coupons/apply fallback', err);
    }

    // Default test coupon codes: AURA10 (10% off), WELCOME200 (₹200 off)
    const upper = code.trim().toUpperCase();
    if (upper === 'AURA10') {
      const discount = Math.round(cartSubtotal * 0.1);
      return { valid: true, discountAmount: discount, message: '10% editorial discount applied.' };
    }
    if (upper === 'WELCOME200' || upper === 'STUDIO') {
      const discount = Math.min(200, cartSubtotal);
      return { valid: true, discountAmount: discount, message: '₹200 welcome voucher applied.' };
    }

    return { valid: false, discountAmount: 0, message: 'Invalid or expired promotional code.' };
  }
};
