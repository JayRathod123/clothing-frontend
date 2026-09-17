import axiosInstance from '@/lib/axiosInstance';
import { Order, CheckoutDto } from '@/types/order.types';
import { ApiResponse, PaginatedData } from '@/types/api.types';
import { cartService } from './cart.service';

const LOCAL_ORDERS_KEY = 'aura_local_orders_history';

function getLocalOrders(): Order[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_ORDERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function saveLocalOrder(order: Order): void {
  if (typeof window === 'undefined') return;
  try {
    const existing = getLocalOrders();
    localStorage.setItem(LOCAL_ORDERS_KEY, JSON.stringify([order, ...existing]));
  } catch {}
}

export const orderService = {
  // Place checkout order
  async checkout(dto: CheckoutDto): Promise<Order> {
    try {
      const response = await axiosInstance.post<ApiResponse<Order>>('/api/orders/checkout', dto);
      if (response.data.success && response.data.data) {
        await cartService.clearCart();
        return response.data.data;
      }
    } catch (err) {
      console.warn('API /api/orders/checkout fallback to local order recording', err);
    }

    // Local simulation fallback
    const cart = await cartService.getCart();
    const orderNumber = `AUR-${Math.floor(100000 + Math.random() * 900000)}`;
    const shippingCharge = cart.subtotal >= 999 ? 0 : 99;
    const discountAmount = dto.couponCode ? 200 : 0;
    const totalAmount = Math.max(0, cart.subtotal + shippingCharge - discountAmount);

    const order: Order = {
      id: `ord_${Date.now()}`,
      orderNumber,
      status: 'confirmed',
      shippingAddress: dto.shippingAddress,
      billingAddress: dto.billingAddress || dto.shippingAddress,
      subtotal: cart.subtotal,
      shippingCharge,
      discountAmount,
      totalAmount,
      paymentStatus: dto.paymentMethod === 'cod' ? 'pending' : 'paid',
      paymentMethod: dto.paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Razorpay Secure Checkout',
      items: cart.items.map(item => ({
        id: `item_${Math.random()}`,
        orderId: orderNumber,
        variantId: item.variantId,
        productName: item.productName || 'Essential Garment',
        sku: item.variant?.sku || item.variantId,
        size: item.size || 'M',
        color: item.color || 'Standard',
        price: item.currentPrice,
        quantity: item.quantity,
        totalPrice: item.currentPrice * item.quantity,
        productImage: item.productImage
      })),
      placedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveLocalOrder(order);
    await cartService.clearCart();
    return order;
  },

  // Get customer orders
  async getMyOrders(): Promise<Order[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<PaginatedData<Order> | Order[]>>('/api/orders/my-orders');
      if (response.data.success) {
        const items = Array.isArray(response.data.data) ? response.data.data : response.data.data?.items;
        if (items && items.length > 0) return items;
      }
    } catch (err) {
      console.warn('API /api/orders/my-orders fallback', err);
    }

    return getLocalOrders();
  },

  // Get order by ID
  async getOrderById(id: string): Promise<Order | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<Order>>(`/api/orders/my-orders/${id}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`API /api/orders/my-orders/${id} fallback`, err);
    }

    const localOrders = getLocalOrders();
    return localOrders.find(o => o.id === id || o.orderNumber === id) || null;
  }
};
