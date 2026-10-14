import axiosInstance from '@/lib/axiosInstance';
import { Order, CheckoutDto } from '@/types/order.types';
import { ApiResponse, PaginatedData } from '@/types/api.types';
import { cartService } from './cart.service';
import { isUserLoggedIn } from '@/utils/storage';

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
  // Place checkout order (protected endpoint)
  async checkout(dto: CheckoutDto): Promise<Order> {
    if (!isUserLoggedIn()) {
      throw new Error('Authentication required: Please sign in before completing checkout');
    }

    try {
      // Send only fields accepted by backend CheckoutDto
      const payload = {
        shippingAddress: {
          fullName: dto.shippingAddress.fullName,
          phone: dto.shippingAddress.phone,
          addressLine1: dto.shippingAddress.addressLine1,
          addressLine2: dto.shippingAddress.addressLine2 || undefined,
          city: dto.shippingAddress.city,
          state: dto.shippingAddress.state,
          pincode: dto.shippingAddress.pincode,
          country: dto.shippingAddress.country || 'India',
        },
        billingAddress: dto.billingAddress
          ? {
              fullName: dto.billingAddress.fullName,
              phone: dto.billingAddress.phone,
              addressLine1: dto.billingAddress.addressLine1,
              addressLine2: dto.billingAddress.addressLine2 || undefined,
              city: dto.billingAddress.city,
              state: dto.billingAddress.state,
              pincode: dto.billingAddress.pincode,
              country: dto.billingAddress.country || 'India',
            }
          : undefined,
        couponCode: dto.couponCode?.trim() || undefined,
        notes: dto.notes?.trim() || undefined,
        paymentMethod: dto.paymentMethod || 'razorpay',
      };

      const response = await axiosInstance.post<any>('/api/orders/checkout', payload);
      const resData = response.data;
      const raw = resData?.data?.data || resData?.data || resData;
      if (raw && (raw.id || raw.orderNumber)) {
        // Backend clears cart atomically, sync client-side cache
        await cartService.clearCart().catch(() => {});
        return normalizeOrder(raw);
      }
      throw new Error(resData?.message || 'Failed to place order');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to place order';
      throw new Error(msg);
    }
  },

  // Get customer orders (protected endpoint)
  async getMyOrders(): Promise<Order[]> {
    if (!isUserLoggedIn()) {
      return [];
    }

    try {
      const response = await axiosInstance.get<any>('/api/orders/my-orders');
      const resData = response.data;
      // Handle both direct { data: [...], meta: {...} } and wrapped { success: true, data: ... }
      let list: any[] = [];
      if (Array.isArray(resData)) {
        list = resData;
      } else if (Array.isArray(resData?.data)) {
        list = resData.data;
      } else if (Array.isArray(resData?.data?.data)) {
        list = resData.data.data;
      } else if (Array.isArray(resData?.data?.items)) {
        list = resData.data.items;
      } else if (Array.isArray(resData?.items)) {
        list = resData.items;
      }
      return list.map(normalizeOrder);
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return [];
      }
      console.warn('API /api/orders/my-orders fallback', err);
    }

    return [];
  },

  // Get order by ID (protected endpoint)
  async getOrderById(id: string): Promise<Order | null> {
    if (!isUserLoggedIn()) {
      return null;
    }

    try {
      const response = await axiosInstance.get<any>(`/api/orders/my-orders/${id}`);
      const resData = response.data;
      const raw = resData?.data?.data || resData?.data || resData;
      return raw && typeof raw === 'object' && raw.id ? normalizeOrder(raw) : null;
    } catch (err: any) {
      if (err?.response?.status === 401) {
        return null;
      }
      console.warn(`API /api/orders/my-orders/${id} fallback`, err);
    }

    return null;
  }
};

export function normalizeOrderItem(item: any): any {
  const price = parseFloat(item.priceAtPurchase ?? item.price ?? 0);
  const qty = Number(item.quantity ?? 1);
  return {
    id: item.id,
    orderId: item.orderId,
    variantId: item.variantId,
    productName: item.productNameSnapshot || item.productName || 'Garment',
    productNameSnapshot: item.productNameSnapshot,
    sku: item.skuSnapshot || item.sku || '',
    skuSnapshot: item.skuSnapshot,
    size: item.size || item.variant?.size,
    color: item.color || item.variant?.color,
    price,
    priceAtPurchase: item.priceAtPurchase,
    quantity: qty,
    totalPrice: item.totalPrice ? parseFloat(item.totalPrice) : price * qty,
    productImage: item.imageUrlSnapshot || item.productImage || item.variant?.image || undefined,
    imageUrlSnapshot: item.imageUrlSnapshot,
  };
}

export function normalizeOrder(raw: any): Order {
  return {
    id: raw.id,
    orderNumber: raw.orderNumber || (raw.id ? `ORD-${raw.id.slice(-8)}` : 'ORDER'),
    userId: raw.userId,
    status: raw.status || 'pending',
    shippingAddress: raw.shippingAddress || undefined,
    billingAddress: raw.billingAddress || undefined,
    subtotal: parseFloat(raw.subtotal ?? 0),
    shippingCharge: parseFloat(raw.shippingCharge ?? 0),
    discountAmount: parseFloat(raw.discountAmount ?? 0),
    totalAmount: parseFloat(raw.totalAmount ?? 0),
    paymentStatus: raw.paymentStatus || (raw.status === 'confirmed' ? 'paid' : 'pending'),
    paymentMethod: raw.paymentMethod || 'Prepaid',
    items: Array.isArray(raw.items) ? raw.items.map(normalizeOrderItem) : [],
    placedAt: raw.placedAt || raw.createdAt,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}
