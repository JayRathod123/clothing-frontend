'use client';

import React, { useRef, useCallback } from 'react';

export interface RangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  formatValue?: (val: number) => string;
  label?: string;
  className?: string;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({
  min,
  max,
  step = 100,
  value,
  onChange,
  formatValue = (v) => `₹${v.toLocaleString('en-IN')}`,
  label,
  className = '',
}) => {
  const trackRef = useRef<HTMLDivElement>(null);

  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const track = trackRef.current;
      if (!track) return;

      const updateValue = (clientX: number) => {
        const rect = track.getBoundingClientRect();
        const rawPercent = (clientX - rect.left) / rect.width;
        const clampedPercent = Math.max(0, Math.min(1, rawPercent));
        const rawVal = min + clampedPercent * (max - min);
        const steppedVal = Math.round(rawVal / step) * step;
        const finalVal = Math.max(min, Math.min(max, steppedVal));
        onChange(finalVal);
      };

      updateValue(e.clientX);

      const handlePointerMove = (moveEvent: PointerEvent) => {
        updateValue(moveEvent.clientX);
      };

      const handlePointerUp = () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };

      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
    },
    [min, max, step, onChange]
  );

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Header Info */}
      <div className="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider text-[#171717]">
        <span>{label || 'Max Price'}</span>
        <span className="bg-neutral-100 text-black px-2 py-0.5 font-semibold text-xs border border-neutral-200">
          {formatValue(value)}
        </span>
      </div>

      {/* Interactive Track */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        className="relative h-6 flex items-center cursor-pointer select-none group touch-none"
      >
        {/* Track Background */}
        <div className="w-full h-1 bg-neutral-200 group-hover:h-1.5 transition-all" />

        {/* Active Fill Track */}
        <div
          className="absolute left-0 h-1 bg-black group-hover:h-1.5 transition-all"
          style={{ width: `${percentage}%` }}
        />

        {/* Drag Handle Thumb */}
        <div
          className="absolute w-4 h-4 bg-white border-2 border-black shadow-md top-1/2 -translate-y-1/2 -translate-x-1/2 transition-transform duration-75 group-hover:scale-125 focus:scale-125"
          style={{ left: `${percentage}%` }}
          tabIndex={0}
          role="slider"
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          onKeyDown={(e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
              onChange(Math.min(max, value + step));
            } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
              onChange(Math.max(min, value - step));
            }
          }}
        />
      </div>

      {/* Range Limits */}
      <div className="flex justify-between text-[10px] text-neutral-400 font-medium">
        <span>{formatValue(min)}</span>
        <span>{formatValue(max)}</span>
      </div>
    </div>
  );
};

export default RangeSlider;
