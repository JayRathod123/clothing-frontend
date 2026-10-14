'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useBanners } from '@/hooks/useBanners';
import { Banner } from '@/services/banner.service';

// Fallback promotional banner images when backend has no banners configured yet
const FALLBACK_BANNERS: Partial<Banner>[] = [
  {
    id: 'fallback-1',
    title: 'Streetwear Collection',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=2200&auto=format&fit=crop',
    linkUrl: '/shop',
  },
  {
    id: 'fallback-2',
    title: 'Oversized Silhouette Essentials',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=85&w=2200&auto=format&fit=crop',
    linkUrl: '/shop?fit=oversized',
  },
  {
    id: 'fallback-3',
    title: 'Minimalist Graphic Capsule',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=85&w=2200&auto=format&fit=crop',
    linkUrl: '/shop?category=graphic',
  },
  {
    id: 'fallback-4',
    title: 'Urban Heavyweight Drop',
    imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=85&w=2200&auto=format&fit=crop',
    linkUrl: '/shop',
  },
];

export function HeroBlock() {
  const { data: apiBanners, isLoading, isPending } = useBanners('homepage_hero');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const isBannerPending = isLoading || isPending || apiBanners === undefined;

  // Use API banners if available
  const activeBanners =
    apiBanners && apiBanners.length > 0
      ? apiBanners.filter((b) => b.isActive !== false && b.imageUrl)
      : [];

  const slides = activeBanners.length > 0 ? activeBanners : FALLBACK_BANNERS;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  // Autoplay slider (4.5s)
  useEffect(() => {
    if (isPaused || slides.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 4500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide, slides.length]);

  // Keep index within bounds if slide count changes
  useEffect(() => {
    if (currentIndex >= slides.length) {
      setCurrentIndex(0);
    }
  }, [slides.length, currentIndex]);

  // Mobile touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  // Show sleek skeleton banner while API is pending (after all hooks are called)
  if (isBannerPending) {
    return (
      <section className="relative w-full overflow-hidden bg-neutral-100">
        <div className="relative w-full aspect-[16/7] sm:aspect-[18/7] md:aspect-[21/8] lg:aspect-[24/8] min-h-[220px] sm:min-h-[320px] md:min-h-[420px] lg:min-h-[500px] bg-neutral-200 animate-pulse" />
      </section>
    );
  }

  return (
    <section
      aria-label="Promotional Hero Banners"
      className="relative w-full overflow-hidden bg-neutral-950 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Responsive Aspect Ratio Banner Container */}
      <div className="relative w-full aspect-[16/7] sm:aspect-[18/7] md:aspect-[21/8] lg:aspect-[24/8] min-h-[220px] sm:min-h-[320px] md:min-h-[420px] lg:min-h-[500px]">
        {/* Horizontal Sliding Track */}
        <div
          className="flex h-full w-full transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((banner, index) => {
            const linkHref = banner.linkUrl || '/shop';
            const imgUrl =
              banner.imageUrl ||
              'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=2200&auto=format&fit=crop';

            return (
              <div
                key={banner.id || `slide-${index}`}
                className="relative h-full w-full flex-shrink-0"
              >
                <Link
                  href={linkHref}
                  className="block relative w-full h-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
                  aria-label={banner.title || `Promotional Banner ${index + 1}`}
                  tabIndex={index === currentIndex ? 0 : -1}
                >
                  <Image
                    src={imgUrl}
                    alt={banner.title || 'Promotional Banner'}
                    fill
                    priority={index === 0}
                    sizes="100vw"
                    className="object-cover object-center transition-transform duration-700 hover:scale-[1.01]"
                  />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Prev / Next Chevrons */}
        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
              }}
              aria-label="Previous banner"
              className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all opacity-70 group-hover:opacity-100 hover:scale-105 shadow-md cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
              }}
              aria-label="Next banner"
              className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 rounded-full bg-black/40 hover:bg-black/80 text-white backdrop-blur-sm border border-white/20 flex items-center justify-center transition-all opacity-70 group-hover:opacity-100 hover:scale-105 shadow-md cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
            </button>

            {/* Bottom Dots Indicator */}
            <div className="absolute bottom-3 md:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/35 backdrop-blur-xs">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Go to slide ${idx + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentIndex
                      ? 'w-7 bg-white'
                      : 'w-2 bg-white/45 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default HeroBlock;
