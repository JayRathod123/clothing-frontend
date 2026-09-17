import React from 'react';
import { ColorSwatches } from './ColorSwatches';
import { ProductVariant } from '@/types/product.types';

export interface ColorSelectorProps {
  variants: ProductVariant[];
  selectedColor: string;
  onSelectColor: (color: string) => void;
  className?: string;
}

export const ColorSelector: React.FC<ColorSelectorProps> = ({
  variants,
  selectedColor,
  onSelectColor,
  className = '',
}) => {
  return (
    <div className={className}>
      <ColorSwatches
        variants={variants}
        selectedColor={selectedColor}
        onSelectColor={onSelectColor}
      />
    </div>
  );
};

export default ColorSelector;
