import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';

export function CategorySplitBlock() {
  return (
    <section className="w-full bg-[#171717] text-white">
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E6E3DD]/20">
        {/* Left Side: 50% T-SHIRTS */}
        <Link
          href="/category/t-shirts"
          className="group relative h-[480px] sm:h-[580px] overflow-hidden flex flex-col justify-end p-8 sm:p-12 block"
        >
          {/* Background Image with subtle zoom */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200&auto=format&fit=crop"
              alt="T-Shirts Category"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10 transition-opacity group-hover:opacity-90" />
          </div>

          {/* Editorial Content */}
          <div className="relative z-10 space-y-3 transform transition-transform duration-300 group-hover:-translate-y-1">
            <div className="flex items-center gap-2">
              <span className="editorial-kicker text-[#8A6A45]">CATEGORY 01</span>
              <span className="text-white/50 text-xs">•</span>
              <span className="text-xs uppercase tracking-widest text-white/80">240 GSM COTTON</span>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight uppercase text-white">
                T-SHIRTS
              </h3>
              <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>

            <p className="text-xs text-white/70 max-w-sm">
              Boxy cuts, drop shoulders, and high-density necklines engineered for structural longevity.
            </p>
          </div>
        </Link>

        {/* Right Side: 50% SHIRTS */}
        <Link
          href="/category/shirts"
          className="group relative h-[480px] sm:h-[580px] overflow-hidden flex flex-col justify-end p-8 sm:p-12 block"
        >
          {/* Background Image with subtle zoom */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?q=80&w=1200&auto=format&fit=crop"
              alt="Shirts Category"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10 transition-opacity group-hover:opacity-90" />
          </div>

          {/* Editorial Content */}
          <div className="relative z-10 space-y-3 transform transition-transform duration-300 group-hover:-translate-y-1">
            <div className="flex items-center gap-2">
              <span className="editorial-kicker text-[#8A6A45]">CATEGORY 02</span>
              <span className="text-white/50 text-xs">•</span>
              <span className="text-xs uppercase tracking-widest text-white/80">BRUSHED TWILL</span>
            </div>

            <div className="flex items-center justify-between">
              <h3 className="text-3xl sm:text-4xl font-semibold tracking-tight uppercase text-white">
                SHIRTS
              </h3>
              <div className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                <ArrowRight className="w-4 h-4 text-white" />
              </div>
            </div>

            <p className="text-xs text-white/70 max-w-sm">
              Structured overshirts, Cuban camp collars, and utilitarian layers tailored for ease.
            </p>
          </div>
        </Link>
      </div>
    </section>
  );
}
