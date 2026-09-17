'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

export interface HeroSlide {
  id: string;
  image: string;
  kicker: string;
  heading: string;
  highlightText?: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
}

const DEFAULT_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=2000&auto=format&fit=crop',
    kicker: 'NEW DROP // 240 GSM ESSENTIALS',
    heading: 'WEAR YOUR ATTITUDE.',
    highlightText: 'DROP 04 LIVE NOW',
    subtitle: 'Heavyweight French Terry silhouettes engineered with an intentional boxy drop shoulder, structured ribbed collar, and zero post-wash shrinkage.',
    primaryCtaText: 'SHOP NOW',
    primaryCtaLink: '/shop',
    secondaryCtaText: 'EXPLORE COLLECTION',
    secondaryCtaLink: '/shop?fit=oversized',
  },
  {
    id: 'slide-2',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=85&w=2000&auto=format&fit=crop',
    kicker: 'STREETWEAR MERCHANDISE // 100% COTTON',
    heading: 'OVERSIZED SILHOUETTES.',
    highlightText: 'ENGINEERED DRAPE',
    subtitle: 'Cut with high-density architectural proportions that drape cleanly without clinging. The foundation of everyday modern rotation.',
    primaryCtaText: 'SHOP OVERSIZED',
    primaryCtaLink: '/shop?fit=oversized',
    secondaryCtaText: 'VIEW SIZE GUIDE',
    secondaryCtaLink: '/size-chart',
  },
  {
    id: 'slide-3',
    image: 'https://images.unsplash.com/photo-1544441893-675973e31985?q=85&w=2000&auto=format&fit=crop',
    kicker: 'GRAPHIC CAPSULE // LIMITED DROP',
    heading: 'RAW TACTILE PRINTS.',
    highlightText: 'LIMITED RUNS',
    subtitle: 'Screen printed with high-density plastisol and silicon softeners on bio-washed heavyweight cotton.',
    primaryCtaText: 'SHOP GRAPHIC TEES',
    primaryCtaLink: '/shop?category=graphic',
    secondaryCtaText: 'ALL PRODUCTS',
    secondaryCtaLink: '/shop',
  },
];

export interface HeroBlockProps {
  slides?: HeroSlide[];
}

export function HeroBlock({ slides = DEFAULT_SLIDES }: HeroBlockProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  const scrollToNext = () => {
    const nextSection = document.getElementById('featured-drop') || document.getElementById('categories-split');
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const slide = slides[currentSlide];

  return (
    <section
      className="relative w-full h-[88vh] min-h-[600px] max-h-[920px] overflow-hidden bg-black select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Slides with Cross-Fade */}
      {slides.map((s, index) => {
        const isActive = index === currentSlide;
        return (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              isActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'
            }`}
          >
            <Image
              src={s.image}
              alt={s.heading}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover object-[center_30%]"
            />
            {/* Cinematic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/25" />
          </div>
        );
      })}

      {/* Hero Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-12 md:py-16 text-white">
        {/* Eyebrow Kicker */}
        <div className="pt-2">
          <div className="inline-flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-white/95 border border-white/30 bg-black/40 backdrop-blur-md px-3.5 py-1.5 shadow-xs">
            <Sparkles className="w-3 h-3 text-red-500 animate-pulse" />
            <span>{slide.kicker}</span>
          </div>
        </div>

        {/* Heading & CTAs */}
        <div className="space-y-6 max-w-2xl">
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[1.02] text-white">
              {slide.heading}
            </h1>
            <p className="text-sm sm:text-base text-neutral-200 font-normal tracking-wide max-w-lg leading-relaxed">
              {slide.subtitle}
            </p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <Link
              href={slide.primaryCtaLink}
              className="inline-flex items-center justify-center px-8 py-3.5 bg-white text-black font-extrabold text-xs uppercase tracking-widest hover:bg-neutral-200 transition-colors shadow-lg active:scale-95"
            >
              {slide.primaryCtaText}
            </Link>

            <Link
              href={slide.secondaryCtaLink}
              className="inline-flex items-center justify-center px-7 py-3.5 border border-white/70 bg-black/30 backdrop-blur-sm text-white font-extrabold text-xs uppercase tracking-widest hover:bg-white hover:text-black transition-all active:scale-95"
            >
              {slide.secondaryCtaText}
            </Link>

            {/* Slide navigation buttons */}
            <div className="flex items-center gap-1 ml-auto sm:ml-2">
              <button
                type="button"
                onClick={prevSlide}
                className="w-10 h-10 border border-white/30 bg-black/40 backdrop-blur-xs text-white hover:bg-white hover:text-black transition-all flex items-center justify-center cursor-pointer"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                className="w-10 h-10 border border-white/30 bg-black/40 backdrop-blur-xs text-white hover:bg-white hover:text-black transition-all flex items-center justify-center cursor-pointer"
                aria-label="Next slide"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Banner Indicators */}
        <div className="flex items-center justify-between border-t border-white/20 pt-4 text-xs text-neutral-300">
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-1.5 transition-all duration-300 ${
                  idx === currentSlide ? 'w-8 bg-white' : 'w-2.5 bg-white/40 hover:bg-white/70'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={scrollToNext}
            className="flex items-center gap-2 text-[10px] tracking-widest uppercase font-bold text-neutral-300 hover:text-white transition-colors group cursor-pointer"
            aria-label="Scroll down"
          >
            <span>SCROLL TO EXPLORE</span>
            <ArrowDown className="w-3.5 h-3.5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroBlock;
