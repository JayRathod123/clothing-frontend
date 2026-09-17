export interface CheckoutAddressDto {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
}

export interface CheckoutDto {
  shippingAddress: CheckoutAddressDto;
  billingAddress?: CheckoutAddressDto;
  couponCode?: string;
  notes?: string;
  paymentMethod?: 'razorpay' | 'cod';
}

export interface OrderItem {
  id: string;
  orderId: string;
  variantId: string;
  productName: string;
  sku: string;
  size?: string;
  color?: string;
  price: number;
  quantity: number;
  totalPrice: number;
  productImage?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

export interface Order {
  id: string;
  orderNumber: string;
  userId?: string;
  status: OrderStatus;
  shippingAddress: CheckoutAddressDto;
  billingAddress?: CheckoutAddressDto;
  subtotal: number;
  shippingCharge: number;
  discountAmount: number;
  totalAmount: number;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  paymentMethod: string;
  items: OrderItem[];
  placedAt?: string;
  createdAt: string;
  updatedAt: string;
}
