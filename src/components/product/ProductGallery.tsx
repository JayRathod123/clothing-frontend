'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types/product.types';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const displayImages =
    images && images.length > 0
      ? images
      : [
          {
            id: 'default',
            productId: 'default',
            url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
            isPrimary: true,
            sortOrder: 1,
          },
        ];

  const currentImage = displayImages[selectedIndex] || displayImages[0];

  return (
    <div className="flex flex-col-reverse md:flex-row gap-4">
      {/* Thumbnail column (Desktop) */}
      <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto shrink-0 pb-2 md:pb-0 scrollbar-none">
        {displayImages.map((img, idx) => {
          const isSelected = selectedIndex === idx;
          return (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative w-18 h-24 md:w-20 md:h-26 overflow-hidden bg-[#EFEEE9] shrink-0 border transition-all duration-150 focus:outline-none ${
                isSelected
                  ? 'border-[#171717] ring-1 ring-[#171717]'
                  : 'border-[#E6E3DD] opacity-75 hover:opacity-100 hover:border-[#929292]'
              }`}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${idx + 1}`}
                fill
                sizes="80px"
                className="object-cover object-center"
              />
            </button>
          );
        })}
      </div>

      {/* Main Large Image */}
      <div className="relative aspect-3/4 w-full flex-1 overflow-hidden bg-[#EFEEE9] border border-[#E6E3DD]">
        <Image
          src={currentImage.url}
          alt={`${productName} main view`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 55vw"
          className="object-cover object-center transition-all duration-300"
        />
      </div>
    </div>
  );
}
