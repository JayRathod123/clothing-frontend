'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types/product.types';
import { Maximize2 } from 'lucide-react';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

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
    <div className="space-y-4">
      {/* Main Large Image with rounded corners & zoom button */}
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-2xl bg-[#F4F5F7] border border-neutral-200">
        <Image
          src={currentImage.url}
          alt={`${productName} main view`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover object-center transition-all duration-300"
        />

        {/* Zoom Expand Button top-left */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="absolute top-4 left-4 z-10 w-9 h-9 rounded-lg bg-black/40 hover:bg-black/70 text-white flex items-center justify-center backdrop-blur-xs transition-colors"
          aria-label="Zoom image"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal Thumbnails Directly Under Main Image */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {displayImages.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-20 h-24 overflow-hidden rounded-xl bg-[#F4F5F7] shrink-0 border-2 transition-all duration-150 focus:outline-none ${
                  isSelected
                    ? 'border-black ring-1 ring-black'
                    : 'border-neutral-200 hover:border-neutral-400 opacity-80 hover:opacity-100'
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
      )}

      {/* Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomOpen(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <Image
              src={currentImage.url}
              alt={productName}
              fill
              className="object-contain"
            />
            <button
              onClick={() => setIsZoomOpen(false)}
              className="absolute top-4 right-4 text-white text-xl bg-black/60 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
