import React from 'react';
import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  max?: number;
  count?: number;
  showText?: boolean;
}

export function RatingStars({ rating, max = 5, count, showText = true }: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center text-[#8A6A45]">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(rating);
          return (
            <Star
              key={i}
              className={`w-3.5 h-3.5 ${filled ? 'fill-[#8A6A45]' : 'fill-transparent text-[#D8D4CC]'}`}
            />
          );
        })}
      </div>
      {showText ? (
        <span className="text-[11px] font-medium text-[#686868]">
          {rating.toFixed(1)} {count !== undefined ? `(${count})` : ''}
        </span>
      ) : null}
    </div>
  );
}
