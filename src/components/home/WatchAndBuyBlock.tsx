'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Script from 'next/script';
import { Play, ShoppingBag, X, Maximize2 } from 'lucide-react';
import { formatPrice } from '@/utils/formatters';
import { useReels } from '@/hooks/useReels';

interface DisplayReelItem {
  id: string;
  reelUrl: string;
  title: string;
  thumbnail: string;
  creator: string;
  productName: string;
  productPrice: number;
  productSlug: string;
  productImage: string;
}

const STREETWEAR_COVERS = [
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
];

const PRODUCT_COVERS = [
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
  'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600',
  'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=600',
  'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
];

/**
 * Converts any Instagram Reel / Post URL from the backend API into its embed URL.
 * Preserves /reel/ or /p/ path accurately.
 */
function getEmbedUrl(rawUrl: string): string {
  if (!rawUrl) return '';
  // Strip query string and trailing slashes
  const clean = rawUrl.split('?')[0].split('#')[0].replace(/\/+$/, '');
  if (clean.endsWith('/embed')) {
    return `${clean}/`;
  }
  return `${clean}/embed/`;
}

/**
 * Checks if URL is a direct video link (.mp4, .webm)
 */
function isDirectVideoUrl(url: string): boolean {
  if (!url) return false;
  return /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
}

export function WatchAndBuyBlock() {
  const { data: apiReels, isLoading } = useReels();
  const [activeReel, setActiveReel] = useState<DisplayReelItem | null>(null);
  const [playingInlineId, setPlayingInlineId] = useState<string | null>(null);

  // Close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveReel(null);
        setPlayingInlineId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Process Instagram embeds if embed.js is present
  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).instgrm?.Embeds) {
      try {
        (window as any).instgrm.Embeds.process();
      } catch (e) {
        // Ignore embed processing error
      }
    }
  }, [activeReel, playingInlineId]);

  // Map ONLY dynamic API reels from backend
  const displayReels: DisplayReelItem[] = React.useMemo(() => {
    if (!apiReels || apiReels.length === 0) {
      return [];
    }

    const activeList = apiReels.filter((r) => r.isActive !== false);
    if (activeList.length === 0) {
      return [];
    }

    return activeList.map((apiItem, idx) => {
      const cover = STREETWEAR_COVERS[idx % STREETWEAR_COVERS.length];
      const prodImg = PRODUCT_COVERS[idx % PRODUCT_COVERS.length];
      const title = apiItem.title || 'InkStyles Streetwear';
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || 'shop';

      return {
        id: apiItem.id,
        reelUrl: apiItem.reelUrl,
        title: title,
        thumbnail: apiItem.thumbnailUrl || cover,
        creator: '@inkstyles',
        productName: title,
        productPrice: 799,
        productSlug: slug,
        productImage: prodImg,
      };
    });
  }, [apiReels]);

  // Loading skeleton
  if (isLoading) {
    return (
      <section className="w-full bg-[#FFFFFF] py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 uppercase">
              WATCH AND BUY
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
              See how our community styles their favorite InkStyles streetwear pieces in real life.
            </p>
          </div>
          <div className="flex justify-center gap-4">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="aspect-9/16 w-[230px] sm:w-[250px] rounded-2xl bg-neutral-200 animate-pulse border border-neutral-300"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Do not display if no reels in backend
  if (displayReels.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#FFFFFF] py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-100">
      <Script
        src="//www.instagram.com/embed.js"
        strategy="lazyOnload"
        onLoad={() => {
          if (typeof window !== 'undefined' && (window as any).instgrm?.Embeds) {
            (window as any).instgrm.Embeds.process();
          }
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 uppercase">
            WATCH AND BUY
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
            See how our community styles their favorite InkStyles streetwear pieces in real life.
          </p>
        </div>

        {/* Dynamic Reels Container */}
        <div
          className={
            displayReels.length >= 5
              ? 'flex md:grid md:grid-cols-5 gap-4 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0'
              : 'flex flex-wrap justify-center gap-6 pb-4 pt-1'
          }
        >
          {displayReels.map((reel) => {
            const isDirectVideo = isDirectVideoUrl(reel.reelUrl);
            const isPlayingInline = playingInlineId === reel.id;
            const embedUrl = getEmbedUrl(reel.reelUrl);

            return (
              <div
                key={reel.id}
                className="group relative aspect-9/16 w-[230px] sm:w-[250px] md:w-[260px] shrink-0 snap-start rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-200 shadow-xs hover:shadow-lg transition-all duration-300"
              >
                {/* 1. Playing Inline on the Card */}
                {isPlayingInline ? (
                  <div className="absolute inset-0 bg-black z-20 flex items-center justify-center">
                    {isDirectVideo ? (
                      <video
                        src={reel.reelUrl}
                        controls
                        autoPlay
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <iframe
                        src={embedUrl}
                        className="w-full h-full border-0"
                        scrolling="no"
                        allowTransparency={true}
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        allowFullScreen
                        title={reel.title}
                      />
                    )}

                    {/* Controls on Top */}
                    <div className="absolute top-2.5 right-2.5 z-30 flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveReel(reel);
                        }}
                        className="w-7 h-7 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                        title="Expand"
                        aria-label="Expand"
                      >
                        <Maximize2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingInlineId(null);
                        }}
                        className="w-7 h-7 rounded-full bg-black/80 hover:bg-black text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                        title="Close"
                        aria-label="Close"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* 2. Original Card UI */
                  <div
                    onClick={() => setPlayingInlineId(reel.id)}
                    className="relative w-full h-full cursor-pointer"
                  >
                    <Image
                      src={reel.thumbnail}
                      alt={reel.creator}
                      fill
                      sizes="(max-width: 640px) 100vw, 260px"
                      className="object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Central Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setPlayingInlineId(reel.id);
                        }}
                        className="w-12 h-12 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-black group-hover:scale-110 group-hover:bg-white transition-all shadow-lg cursor-pointer"
                        aria-label="Play Reel"
                        title="Play on website"
                      >
                        <Play className="w-5 h-5 ml-0.5 fill-black text-black" />
                      </button>
                    </div>

                    {/* Creator Handle */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="text-[10px] font-bold text-white/95 bg-black/60 backdrop-blur-xs px-2.5 py-0.5 rounded-full tracking-wide">
                        {reel.creator}
                      </span>
                    </div>

                    {/* Expand icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveReel(reel);
                      }}
                      className="absolute top-3 right-3 z-10 w-7 h-7 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-xs text-white flex items-center justify-center transition-all cursor-pointer opacity-80 hover:opacity-100"
                      title="Open full player"
                      aria-label="Open full player"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Bottom Product Pill */}
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveReel(reel);
                      }}
                      className="absolute bottom-3 left-3 right-3 z-10 bg-white/95 backdrop-blur-md rounded-xl p-2 flex items-center gap-2 border border-white/40 shadow-sm"
                    >
                      <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                        <Image
                          src={reel.productImage}
                          alt={reel.productName}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold text-neutral-900 truncate leading-tight capitalize">
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
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Player */}
      {activeReel && (() => {
        const isDirectVideo = isDirectVideoUrl(activeReel.reelUrl);
        const embedUrl = getEmbedUrl(activeReel.reelUrl);

        return (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4"
            onClick={() => setActiveReel(null)}
          >
            <div
              className="relative bg-neutral-950 w-full max-w-sm sm:max-w-md rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 flex flex-col max-h-[94vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Bar */}
              <div className="flex items-center justify-between px-4 py-3 bg-neutral-900 border-b border-neutral-800 text-white shrink-0">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 fill-white" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </span>
                  <p className="text-xs font-bold truncate capitalize">
                    {activeReel.title || activeReel.productName}
                  </p>
                </div>
                <button
                  onClick={() => setActiveReel(null)}
                  className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Player Body */}
              <div className="relative w-full h-[540px] sm:h-[580px] bg-black flex items-center justify-center overflow-hidden">
                {isDirectVideo ? (
                  <video
                    src={activeReel.reelUrl}
                    controls
                    autoPlay
                    playsInline
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <iframe
                    src={embedUrl}
                    className="w-full h-full border-0"
                    scrolling="no"
                    allowTransparency={true}
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    allowFullScreen
                    title={activeReel.title}
                  />
                )}
              </div>

              {/* Bottom Action Bar */}
              <div className="p-3.5 bg-neutral-900 border-t border-neutral-800 flex items-center justify-between gap-3 shrink-0">
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate max-w-[200px]">
                    {activeReel.productName}
                  </p>
                  <p className="text-xs font-extrabold text-white mt-0.5">
                    {formatPrice(activeReel.productPrice)}
                  </p>
                </div>
                <Link
                  href={`/product/${activeReel.productSlug}`}
                  className="px-4 py-2 bg-white text-black text-xs font-bold rounded-lg hover:bg-neutral-200 transition-colors shrink-0"
                >
                  Buy Now
                </Link>
              </div>
            </div>
          </div>
        );
      })()}
    </section>
  );
}

export default WatchAndBuyBlock;
