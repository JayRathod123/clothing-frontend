export interface PincodeServiceability {
  pincode: string;
  isServiceable: boolean;
  codAvailable: boolean;
  estimatedDays?: number | null;
  message?: string;
  city?: string;
  state?: string;
}

export interface ShippingCalculation {
  subtotal: number;
  shippingCharge: number;
  isFreeShipping: boolean;
  freeShippingThreshold: number;
  amountNeededForFreeShipping: number;
}
