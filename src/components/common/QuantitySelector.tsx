'use client';

import React from 'react';
import { Minus, Plus } from 'lucide-react';

export interface QuantitySelectorProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (quantity: number) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  min = 1,
  max = 99,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-8 text-xs',
    md: 'h-10 text-sm',
    lg: 'h-12 text-base',
  };

  const btnWidths = {
    sm: 'w-8',
    md: 'w-10',
    lg: 'w-12',
  };

  const handleDecrement = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

  return (
    <div
      className={`inline-flex items-center border border-neutral-300 bg-white ${sizeClasses[size]} ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= min || disabled}
        aria-label="Decrease quantity"
        className={`${btnWidths[size]} h-full flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition-colors`}
      >
        <Minus className="w-3.5 h-3.5" />
      </button>

      <span className="min-w-8 text-center font-bold text-neutral-900 select-none px-2">
        {quantity}
      </span>

      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= max || disabled}
        aria-label="Increase quantity"
        className={`${btnWidths[size]} h-full flex items-center justify-center text-neutral-600 hover:text-black hover:bg-neutral-100 disabled:opacity-30 disabled:pointer-events-none transition-colors`}
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default QuantitySelector;
