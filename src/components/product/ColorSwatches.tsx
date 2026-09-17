import React from 'react';
import { ProductVariant } from '@/types/product.types';

interface ColorSwatchesProps {
  variants: ProductVariant[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
}

export function ColorSwatches({
  variants,
  selectedColor,
  onSelectColor,
}: ColorSwatchesProps) {
  // Unique colors with hex
  const colorsMap = new Map<string, string>();
  variants.forEach((v) => {
    if (!colorsMap.has(v.color)) {
      colorsMap.set(v.color, v.colorHex || '#171717');
    }
  });

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-widest font-medium text-[#171717]">
          Color : <span className="font-semibold">{selectedColor}</span>
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        {Array.from(colorsMap.entries()).map(([colorName, hex]) => {
          const isSelected = selectedColor === colorName;
          return (
            <button
              key={colorName}
              type="button"
              onClick={() => onSelectColor(colorName)}
              title={colorName}
              className={`relative w-7 h-7 rounded-full transition-all duration-150 p-0.5 flex items-center justify-center ${
                isSelected
                  ? 'ring-1 ring-[#171717] ring-offset-2'
                  : 'hover:ring-1 hover:ring-[#929292] hover:ring-offset-1'
              }`}
            >
              <span
                className="w-full h-full rounded-full border border-black/10 shadow-xs"
                style={{ backgroundColor: hex }}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
