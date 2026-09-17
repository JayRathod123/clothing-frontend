import React from 'react';
import { formatPrice } from '@/utils/formatters';
import { THEME } from '@/constants/theme';
import { Sparkles, Check } from 'lucide-react';

interface ShippingProgressBarProps {
  subtotal: number;
}

export function ShippingProgressBar({ subtotal }: ShippingProgressBarProps) {
  const threshold = THEME.thresholds.freeShipping;
  const isFree = subtotal >= threshold;
  const remaining = Math.max(0, threshold - subtotal);
  const percent = Math.min(100, Math.round((subtotal / threshold) * 100));

  return (
    <div className="bg-white border border-[#E6E3DD] p-3.5 space-y-2">
      <div className="flex items-center justify-between text-xs">
        {isFree ? (
          <div className="flex items-center gap-1.5 text-[#171717] font-medium">
            <Check className="w-3.5 h-3.5 text-[#8A6A45]" />
            <span>You have unlocked complimentary shipping!</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-[#686868]">
            <Sparkles className="w-3.5 h-3.5 text-[#8A6A45]" />
            <span>
              Add <strong className="text-[#171717]">{formatPrice(remaining)}</strong> more for free shipping
            </span>
          </div>
        )}
        <span className="text-[10px] font-semibold text-[#8A6A45]">{percent}%</span>
      </div>

      {/* Minimal Progress Line */}
      <div className="w-full h-1 bg-[#EFEEE9] overflow-hidden">
        <div
          className="h-full bg-[#8A6A45] transition-all duration-300 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
