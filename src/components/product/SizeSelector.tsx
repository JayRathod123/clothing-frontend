import React from 'react';
import { ProductVariant } from '@/types/product.types';

interface SizeSelectorProps {
  variants: ProductVariant[];
  selectedSize: string;
  onSelectSize: (size: string) => void;
  onOpenSizeGuide?: () => void;
}

export function SizeSelector({
  variants,
  selectedSize,
  onSelectSize,
  onOpenSizeGuide,
}: SizeSelectorProps) {
  // Unique available sizes
  const uniqueSizes = Array.from(new Set(variants.map((v) => v.size)));

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-widest font-medium text-[#171717]">
          Size : <span className="font-semibold">{selectedSize}</span>
        </span>
        {onOpenSizeGuide && (
          <button
            type="button"
            onClick={onOpenSizeGuide}
            className="text-[10px] uppercase tracking-widest text-[#686868] hover:text-[#171717] underline underline-offset-4 transition-colors"
          >
            Size Guide
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {uniqueSizes.map((size) => {
          const matchingVariant = variants.find((v) => v.size === size);
          const isOutOfStock = matchingVariant && matchingVariant.stockQuantity <= 0;
          const isSelected = selectedSize === size;

          return (
            <button
              key={size}
              type="button"
              disabled={isOutOfStock}
              onClick={() => onSelectSize(size)}
              className={`min-w-11 h-11 px-3 text-xs uppercase font-medium border transition-all duration-150 relative ${
                isSelected
                  ? 'bg-[#171717] text-white border-[#171717]'
                  : 'bg-white text-[#171717] border-[#E6E3DD] hover:border-[#171717]'
              } ${isOutOfStock ? 'opacity-30 cursor-not-allowed line-through' : ''}`}
            >
              {size}
            </button>
          );
        })}
      </div>
    </div>
  );
}
