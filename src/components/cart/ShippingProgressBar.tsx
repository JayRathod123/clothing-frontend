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
    <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between text-xs">
        {isFree ? (
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
            <Check className="w-3.5 h-3.5 text-emerald-600" />
            <span>You have unlocked Free Shipping!</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-neutral-600">
            <Sparkles className="w-3.5 h-3.5 text-neutral-800" />
            <span>
              Add <strong className="text-black">{formatPrice(remaining)}</strong> more for Free Shipping
            </span>
          </div>
        )}
        <span className="text-[10px] font-bold text-neutral-800">{percent}%</span>
      </div>

      {/* Progress Line */}
      <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-black transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
