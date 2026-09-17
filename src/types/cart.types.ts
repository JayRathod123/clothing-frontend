export interface CartItem {
  id: string;
  cartId?: string;
  variantId: string;
  quantity: number;
  priceAtAdd?: number;
  currentPrice: number;
  variant?: {
    id: string;
    productId: string;
    sku: string;
    size: string;
    color: string;
    price: number;
    discountPrice?: number | null;
    stockQuantity: number;
    product?: {
      id: string;
      name: string;
      slug: string;
      primaryImage?: string;
    };
  };
  productName?: string;
  productSlug?: string;
  productImage?: string;
  size?: string;
  color?: string;
  isAvailable?: boolean;
  availableStock?: number;
}

export interface Cart {
  id: string;
  userId?: string | null;
  sessionId?: string;
  status: string;
  subtotal: number;
  subtotalAtAdd?: number;
  totalUniqueItems: number;
  totalQuantity: number;
  hasPriceChanges?: boolean;
  items: CartItem[];
  discountAmount?: number;
  couponCode?: string | null;
  estimatedShipping?: number;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface AddCartItemDto {
  variantId: string;
  quantity: number;
}

export interface UpdateCartItemDto {
  quantity: number;
}
