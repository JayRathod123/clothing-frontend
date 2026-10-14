import axiosInstance from '@/lib/axiosInstance';
import { ApiResponse } from '@/types/api.types';

export interface RazorpayOrderData {
  id?: string;
  razorpayOrderId?: string;
  orderId?: string;
  amount?: number;
  currency?: string;
  keyId?: string;
  key?: string;
  [key: string]: any;
}

export interface VerifyPaymentDto {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}

/**
 * Load Razorpay Checkout script dynamically
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export const paymentService = {
  // Initialize Razorpay order on backend
  async createPaymentOrder(orderId: string): Promise<RazorpayOrderData> {
    const response = await axiosInstance.post<ApiResponse<RazorpayOrderData>>(
      '/api/payments/create-order',
      { orderId }
    );
    if (response.data.success && response.data.data) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Failed to initialize payment gateway');
  },

  // Verify HMAC-SHA256 signature after client payment
  async verifyPayment(dto: VerifyPaymentDto): Promise<any> {
    const response = await axiosInstance.post<ApiResponse<any>>('/api/payments/verify', dto);
    if (response.data.success) {
      return response.data.data || true;
    }
    throw new Error(response.data.message || 'Payment signature verification failed');
  },
};

export default paymentService;
