'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, ChevronLeft, ChevronRight, ShoppingBag, Eye } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';

interface ReelItem {
  id: string;
  thumbnail: string;
  creator: string;
  productName: string;
  productPrice: number;
  productSlug: string;
  productImage: string;
}

const REELS: ReelItem[] = [
  {
    id: 'reel-1',
    thumbnail: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop',
    creator: '@ananya_street',
    productName: 'Sneaky Cartoon Graphic Unisex Oversized Tee',
    productPrice: 799,
    productSlug: 'sneaky-cartoon-graphic-tee',
    productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
  },
  {
    id: 'reel-2',
    thumbnail: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
    creator: '@rohit_fits',
    productName: 'FIFA 10 Energy Graphic Oversized T-shirt',
    productPrice: 899,
    productSlug: 'fifa-10-energy-graphic-oversized-t-shirt',
    productImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600',
  },
  {
    id: 'reel-3',
    thumbnail: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
    creator: '@sid_kart',
    productName: 'GOAT Streetwear Graphic Heavyweight Tee',
    productPrice: 799,
    productSlug: 'goat-streetwear-graphic-tee',
    productImage: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
  },
  {
    id: 'reel-4',
    thumbnail: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    creator: '@tanya_fits',
    productName: 'Nimbus Night Flight Cute Wizard Graphic Tee',
    productPrice: 799,
    productSlug: 'nimbus-night-flight-cute-wizard-graphic-tee',
    productImage: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600',
  },
  {
    id: 'reel-5',
    thumbnail: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
    creator: '@kabir_vibe',
    productName: 'Seeker 07 Jersey-Style Unisex Tee',
    productPrice: 899,
    productSlug: 'seeker-07-jersey-style-unisex-tee',
    productImage: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600',
  },
];

export function WatchAndBuyBlock() {
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);

  return (
    <section className="w-full bg-[#FFFFFF] py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-serif tracking-widest text-neutral-900 uppercase">
            WATCH AND BUY
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
            See how our community styles their favorite InkStyles streetwear pieces in real life.
          </p>
        </div>

        {/* 5-Column Reels Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {REELS.map((reel) => (
            <div
              key={reel.id}
              onClick={() => setActiveReel(reel)}
              className="group relative aspect-9/16 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 cursor-pointer shadow-xs hover:shadow-lg transition-all duration-300"
            >
              {/* Thumbnail Image */}
              <Image
                src={reel.thumbnail}
                alt={reel.creator}
                fill
                sizes="(max-width: 640px) 50vw, 20vw"
                className="object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
              />

              {/* Gradient dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Central Play Pulse */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-black group-hover:scale-110 group-hover:bg-white transition-all shadow-md">
                  <Play className="w-5 h-5 ml-0.5 fill-black" />
                </div>
              </div>

              {/* Creator handle */}
              <div className="absolute top-3 left-3 z-10">
                <span className="text-[10px] font-bold text-white/90 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full">
                  {reel.creator}
                </span>
              </div>

              {/* Bottom Product Preview Card */}
              <div className="absolute bottom-3 left-3 right-3 z-10 bg-white/95 backdrop-blur-md rounded-xl p-2 flex items-center gap-2 border border-white/40 shadow-sm">
                <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                  <Image
                    src={reel.productImage}
                    alt={reel.productName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-neutral-900 truncate leading-tight">
                    {reel.productName}
                  </p>
                  <p className="text-[11px] font-extrabold text-neutral-900">
                    {formatPrice(reel.productPrice)}
                  </p>
                </div>
                <div className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center shrink-0">
                  <ShoppingBag className="w-3 h-3" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal viewer if a reel is clicked */}
      {activeReel && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveReel(null)}
        >
          <div
            className="relative bg-neutral-900 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border border-neutral-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-9/16 w-full">
              <Image
                src={activeReel.thumbnail}
                alt={activeReel.creator}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40" />

              <button
                onClick={() => setActiveReel(null)}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black"
              >
                ✕
              </button>

              <div className="absolute bottom-4 left-4 right-4 z-20 bg-white p-3 rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-neutral-900 truncate max-w-[200px]">
                    {activeReel.productName}
                  </p>
                  <p className="text-sm font-extrabold text-neutral-900">
                    {formatPrice(activeReel.productPrice)}
                  </p>
                </div>
                <Link
                  href={`/product/${activeReel.productSlug}`}
                  className="px-4 py-2 bg-black text-white text-xs font-bold rounded-lg hover:bg-neutral-800"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default WatchAndBuyBlock;
