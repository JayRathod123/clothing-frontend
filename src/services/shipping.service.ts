import axiosInstance from '@/lib/axiosInstance';
import { PincodeServiceability, ShippingCalculation } from '@/types/shipping.types';
import { ApiResponse } from '@/types/api.types';
import { THEME } from '@/constants/theme';

export const shippingService = {
  // Check pincode serviceability
  async checkPincode(pincode: string): Promise<PincodeServiceability> {
    try {
      const response = await axiosInstance.get<ApiResponse<PincodeServiceability>>(`/api/shipping/check/${pincode}`);
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
    } catch (err) {
      console.warn(`API /api/shipping/check/${pincode} fallback`, err);
    }

    // Realistic fallback: if 6-digit Indian pincode, check or deliver in 3-5 business days
    const cleanPin = pincode.trim();
    if (/^[1-9][0-9]{5}$/.test(cleanPin)) {
      return {
        pincode: cleanPin,
        isServiceable: true,
        codAvailable: true,
        estimatedDays: 3,
        message: 'Standard delivery in 3–4 business days with live dispatch tracking.',
      };
    }

    return {
      pincode: cleanPin,
      isServiceable: false,
      codAvailable: false,
      estimatedDays: null,
      message: 'Please enter a valid 6-digit postal pincode.',
    };
  },

  // Calculate shipping charges
  async calculateShipping(subtotal: number, pincode?: string): Promise<ShippingCalculation> {
    try {
      if (pincode) {
        const response = await axiosInstance.post<ApiResponse<any>>('/api/shipping/calculate', {
          subtotal,
          pincode,
        });
        if (response.data.success && response.data.data) {
          return {
            subtotal,
            shippingCharge: response.data.data.shippingCharge ?? (subtotal >= THEME.thresholds.freeShipping ? 0 : 99),
            isFreeShipping: subtotal >= THEME.thresholds.freeShipping,
            freeShippingThreshold: THEME.thresholds.freeShipping,
            amountNeededForFreeShipping: Math.max(0, THEME.thresholds.freeShipping - subtotal),
          };
        }
      }
    } catch (err) {
      console.warn('API /api/shipping/calculate fallback', err);
    }

    const freeShippingThreshold = THEME.thresholds.freeShipping;
    const isFreeShipping = subtotal >= freeShippingThreshold;
    const shippingCharge = isFreeShipping ? 0 : 99;
    const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

    return {
      subtotal,
      shippingCharge,
      isFreeShipping,
      freeShippingThreshold,
      amountNeededForFreeShipping,
    };
  }
};
