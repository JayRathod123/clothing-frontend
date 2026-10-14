'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types/product.types';
import { Maximize2, ChevronLeft, ChevronRight, X, Eye } from 'lucide-react';

interface ProductGalleryProps {
  images: ProductImage[];
  productName: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);

  // Normalize, deduplicate, and ensure valid images
  const displayImages = React.useMemo(() => {
    if (!images || images.length === 0) {
      return [
        {
          id: 'default-1',
          productId: 'default',
          url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
          isPrimary: true,
          sortOrder: 1,
        },
      ];
    }

    const seenUrls = new Set<string>();
    const unique: ProductImage[] = [];

    images.forEach((img, idx) => {
      const url = typeof img === 'string' ? img : (img.url || (img as any).imageUrl || '');
      if (url && !seenUrls.has(url)) {
        seenUrls.add(url);
        unique.push({
          id: img.id || `img-${idx}`,
          productId: img.productId || 'default',
          url,
          altText: img.altText || `${productName} view ${idx + 1}`,
          isPrimary: img.isPrimary ?? (idx === 0),
          sortOrder: img.sortOrder ?? idx,
        });
      }
    });

    return unique.length > 0
      ? unique
      : [
          {
            id: 'default-1',
            productId: 'default',
            url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop',
            isPrimary: true,
            sortOrder: 1,
          },
        ];
  }, [images, productName]);

  // Keep selected index valid if images list updates
  useEffect(() => {
    if (selectedIndex >= displayImages.length) {
      setSelectedIndex(0);
    }
  }, [displayImages.length, selectedIndex]);

  const totalImages = displayImages.length;
  const currentImage = displayImages[selectedIndex] || displayImages[0];

  const goToNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % totalImages);
  }, [totalImages]);

  const goToPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + totalImages) % totalImages);
  }, [totalImages]);

  // Auto-scroll active thumbnail into view
  useEffect(() => {
    if (!thumbnailContainerRef.current) return;
    const container = thumbnailContainerRef.current;
    const activeThumb = container.children[selectedIndex] as HTMLElement;
    if (activeThumb) {
      const thumbLeft = activeThumb.offsetLeft;
      const thumbWidth = activeThumb.offsetWidth;
      const containerWidth = container.offsetWidth;
      container.scrollTo({
        left: thumbLeft - containerWidth / 2 + thumbWidth / 2,
        behavior: 'smooth',
      });
    }
  }, [selectedIndex]);

  // Keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape' && isZoomOpen) setIsZoomOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev, isZoomOpen]);

  // Mobile/Tablet Touch Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
    touchStartYRef.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null || touchStartYRef.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartXRef.current;
    const deltaY = e.changedTouches[0].clientY - touchStartYRef.current;

    // Only register horizontal swipe if horizontal movement is dominant
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 40) {
      if (deltaX < 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    touchStartXRef.current = null;
    touchStartYRef.current = null;
  };

  return (
    <div className="flex flex-col gap-3.5 w-full">
      {/* Main Showcase Image Frame */}
      <div
        className="group relative aspect-4/5 max-h-[540px] sm:max-h-[600px] md:max-h-[640px] w-full overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-200 select-none shadow-2xs"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={currentImage.url}
          alt={currentImage.altText || `${productName} photo ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 55vw"
          className="object-cover object-center transition-all duration-300 ease-out"
        />

        {/* Zoom Lightbox Button (Top-Right) */}
        <button
          type="button"
          onClick={() => setIsZoomOpen(true)}
          className="absolute top-3.5 right-3.5 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/80 hover:bg-white text-neutral-800 hover:text-black flex items-center justify-center backdrop-blur-md shadow-xs border border-white/50 transition-all active:scale-95 cursor-pointer"
          title="Zoom image fullscreen"
          aria-label="Zoom image fullscreen"
        >
          <Maximize2 className="w-4 h-4" />
        </button>

        {/* Floating Navigation Chevrons (Visible on mobile touch and desktop hover) */}
        {totalImages > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-neutral-800 hover:text-black flex items-center justify-center backdrop-blur-md shadow-md border border-neutral-200/50 transition-all active:scale-90 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
              aria-label="Previous product image"
            >
              <ChevronLeft className="w-5 h-5 -ml-0.5" />
            </button>

            <button
              type="button"
              onClick={goToNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/85 hover:bg-white text-neutral-800 hover:text-black flex items-center justify-center backdrop-blur-md shadow-md border border-neutral-200/50 transition-all active:scale-90 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 cursor-pointer"
              aria-label="Next product image"
            >
              <ChevronRight className="w-5 h-5 ml-0.5" />
            </button>
          </>
        )}

        {/* Floating Position Pill (Bottom-Right) */}
        {totalImages > 1 && (
          <div className="absolute bottom-3.5 right-3.5 z-20 bg-black/65 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-sm tracking-wider pointer-events-none">
            {selectedIndex + 1} / {totalImages}
          </div>
        )}

        {/* Mobile Swipe Indicators Dots (Bottom Center) */}
        {totalImages > 1 && totalImages <= 8 && (
          <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:hidden bg-black/30 backdrop-blur-xs px-2.5 py-1 rounded-full">
            {displayImages.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  selectedIndex === idx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails Filmstrip with Auto-Scroll */}
      {totalImages > 1 && (
        <div
          ref={thumbnailContainerRef}
          className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1.5 pt-0.5 px-0.5 scrollbar-none snap-x snap-mandatory"
        >
          {displayImages.map((img, idx) => {
            const isSelected = selectedIndex === idx;
            return (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative aspect-4/5 w-16 sm:w-18 md:w-20 overflow-hidden rounded-xl bg-neutral-100 shrink-0 transition-all duration-200 focus:outline-none cursor-pointer snap-start ${
                  isSelected
                    ? 'ring-2 ring-black ring-offset-1 border-transparent shadow-xs scale-[1.02]'
                    : 'border border-neutral-200 hover:border-neutral-400 opacity-70 hover:opacity-100'
                }`}
                aria-label={`View image ${idx + 1}`}
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

      {/* Fullscreen Lightbox Zoom Modal */}
      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-between p-4 sm:p-6 select-none animate-fadeIn"
          onClick={() => setIsZoomOpen(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Modal Header */}
          <div
            className="w-full flex items-center justify-between z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white text-xs sm:text-sm font-semibold tracking-wide">
              {productName} &bull; Image {selectedIndex + 1} of {totalImages}
            </div>
            <button
              type="button"
              onClick={() => setIsZoomOpen(false)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Close zoom view"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Main Image & Controls */}
          <div
            className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={currentImage.url}
              alt={productName}
              fill
              className="object-contain"
              sizes="100vw"
            />

            {totalImages > 1 && (
              <>
                <button
                  type="button"
                  onClick={goToPrev}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                  aria-label="Previous zoomed image"
                >
                  <ChevronLeft className="w-6 h-6 -ml-0.5" />
                </button>

                <button
                  type="button"
                  onClick={goToNext}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md transition-all active:scale-90 cursor-pointer"
                  aria-label="Next zoomed image"
                >
                  <ChevronRight className="w-6 h-6 ml-0.5" />
                </button>
              </>
            )}
          </div>

          {/* Modal Bottom Thumbnails Filmstrip */}
          {totalImages > 1 && (
            <div
              className="flex items-center gap-2 max-w-full overflow-x-auto py-2 px-4 z-10 scrollbar-none"
              onClick={(e) => e.stopPropagation()}
            >
              {displayImages.map((img, idx) => {
                const isSelected = selectedIndex === idx;
                return (
                  <button
                    key={img.id || idx}
                    type="button"
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative w-12 h-14 sm:w-14 sm:h-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      isSelected
                        ? 'border-white ring-2 ring-white/50 scale-105'
                        : 'border-white/20 opacity-50 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="60px"
                      className="object-cover"
                    />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProductGallery;
