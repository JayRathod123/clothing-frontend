import React from 'react';
import { formatPrice } from '@/utils/formatters';

interface PriceProps {
  price: number;
  discountPrice?: number | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Price({ price, discountPrice, size = 'md', className }: PriceProps) {
  const isDiscounted = discountPrice && discountPrice < price;
  const currentPrice = isDiscounted ? discountPrice : price;

  const fontSizes = {
    sm: 'text-xs',
    md: 'text-sm font-medium',
    lg: 'text-lg font-medium',
  };

  return (
    <div className={`flex items-center gap-2 ${className || ''}`}>
      <span className={`text-[#171717] ${fontSizes[size]}`}>
        {formatPrice(currentPrice)}
      </span>
      {isDiscounted ? (
        <span className="text-xs text-[#929292] line-through">
          {formatPrice(price)}
        </span>
      ) : null}
    </div>
  );
}
