'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ArrowDown, ChevronLeft, ChevronRight } from 'lucide-react';

interface HeroSlide {
  id: string;
  image: string;
  kicker: string;
  headlinePrefix: string;
  headlineSuffix: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=2000&auto=format&fit=crop',
    kicker: 'AUTUMN / WINTER 2026 EDITION',
    headlinePrefix: 'EVERYDAY,',
    headlineSuffix: 'ELEVATED.',
    subtitle: 'Premium heavyweight essentials engineered with considered fits for contemporary living.',
    ctaText: 'Shop New Arrivals',
    ctaLink: '/shop',
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=85&w=2000&auto=format&fit=crop',
    kicker: 'SIGNATURE TEXTILES // 240 GSM',
    headlinePrefix: 'ARCHITECTURAL',
    headlineSuffix: 'SILHOUETTES.',
    subtitle: '100% combed ringspun cotton tees cut with intentional drop-shoulder drape.',
    ctaText: 'Explore T-Shirts',
    ctaLink: '/category/t-shirts',
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=85&w=2000&auto=format&fit=crop',
    kicker: 'TAILORING & OVERSHIRTS',
    headlinePrefix: 'TEXTURE IN',
    headlineSuffix: 'MOTION.',
    subtitle: 'Brushed twill overshirts and fluid double-pleat trousers crafted for ease.',
    ctaText: 'Discover Shirts',
    ctaLink: '/category/shirts',
  },
  {
    id: 'slide-4',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=85&w=2000&auto=format&fit=crop',
    kicker: 'MINIMAL OUTERWEAR',
    headlinePrefix: 'QUIET',
    headlineSuffix: 'LUXURY.',
    subtitle: 'Clean lines, tactile finishes, and effortless versatility for modern rotation.',
    ctaText: 'View Outerwear',
    ctaLink: '/category/outerwear',
  },
];

export function HeroBlock() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  }, []);

  // Continuous auto slide with reduced duration (2.5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 2500);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const scrollToNext = () => {
    const nextSection = document.getElementById('featured-products');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section
      className="relative w-full h-[92vh] min-h-[640px] max-h-[960px] overflow-hidden bg-[#171717] select-none"
    >
      {/* Background Images Slider with Smooth Cross-Fade */}
      {HERO_SLIDES.map((s, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-500 ease-out will-change-opacity ${
              isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <Image
              src={s.image}
              alt={s.headlineSuffix}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-[center_35%]"
            />
            {/* Subtle gradient vignette for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/10" />
          </div>
        );
      })}

      {/* Hero Content Overlay */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-12 md:py-16 text-white">
        {/* Top Kicker */}
        <div className="pt-4">
          <span className="editorial-kicker text-white/80 border border-white/20 bg-black/20 backdrop-blur-xs px-3 py-1">
            {slide.kicker}
          </span>
        </div>

        {/* Headline & Primary CTA */}
        <div className="space-y-5 max-w-xl transition-all duration-300 ease-out">
          <div className="space-y-2">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-light tracking-tight leading-[1.02] text-white">
              {slide.headlinePrefix} <br />
              <span className="font-semibold">{slide.headlineSuffix}</span>
            </h1>
            <p className="text-sm sm:text-base text-white/85 font-light tracking-wide max-w-md leading-relaxed">
              {slide.subtitle}
            </p>
          </div>

          <div className="pt-2 flex items-center gap-4">
            <Link href={slide.ctaLink}>
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-[#171717] hover:bg-neutral-200 border-white font-semibold"
              >
                {slide.ctaText}
              </Button>
            </Link>

            {/* Slider Navigation Arrows */}
            <div className="flex items-center gap-1">
              <button
                onClick={prevSlide}
                className="w-10 h-10 border border-white/25 bg-black/20 backdrop-blur-xs text-white hover:bg-white hover:text-[#171717] transition-all flex items-center justify-center cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextSlide}
                className="w-10 h-10 border border-white/25 bg-black/20 backdrop-blur-xs text-white hover:bg-white hover:text-[#171717] transition-all flex items-center justify-center cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="flex items-center justify-between border-t border-white/20 pt-4 text-xs text-white/70">
          <span className="tracking-widest uppercase text-[10px]">
            SCROLL TO EXPLORE
          </span>
          <button
            onClick={scrollToNext}
            className="flex items-center gap-2 hover:text-white transition-colors group cursor-pointer"
            aria-label="Scroll to collection"
          >
            <span className="text-[10px] tracking-widest uppercase">EXPLORE COLLECTION</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
