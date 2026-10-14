'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCategories } from '@/hooks/useCategories';

export function CategorySplitBlock() {
  const { data: categories = [], isLoading, isPending } = useCategories();
  const isCategoriesPending = isLoading || isPending;

  const displayCategories = categories.filter((c) => c.status !== 'inactive');
  const itemsToRender = displayCategories.length > 0 ? displayCategories : categories;

  // Show skeleton cards while API is pending
  if (isCategoriesPending) {
    return (
      <section className="w-full bg-[#FFFFFF] py-14 px-4 sm:px-6 lg:px-8 border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
              Shop by Collection
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto">
              Explore curated styles designed for everyday rotation, streetwear confidence, and all-day comfort.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 max-w-6xl mx-auto">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="aspect-[3/4] sm:aspect-[4/5] rounded-xl sm:rounded-2xl bg-neutral-200 animate-pulse border border-neutral-200"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // If no backend categories exist yet and not loading, do not render empty block
  if (!isCategoriesPending && itemsToRender.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#FFFFFF] py-14 px-4 sm:px-6 lg:px-8 border-t border-neutral-100">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 tracking-tight">
            Shop by Collection
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl mx-auto">
            Explore curated styles designed for everyday rotation, streetwear confidence, and all-day comfort.
          </p>
        </div>

        {/* Dynamic Categories Showcase Cards matching Reference UI */}
        <div
          className={`grid gap-5 sm:gap-6 lg:gap-8 mx-auto ${itemsToRender.length === 1
            ? 'max-w-sm'
            : itemsToRender.length === 2
              ? 'grid-cols-1 sm:grid-cols-2 max-w-2xl'
              : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 max-w-6xl'
            }`}
        >
          {itemsToRender.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.id}`}
              className="group relative aspect-[3/4] sm:aspect-[4/5] rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-900 shadow-sm hover:shadow-2xl transition-all duration-500 block"
            >
              {/* Background Image from Backend */}
              {cat.imageUrl ? (
                <Image
                  src={cat.imageUrl}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover object-center transform transition-transform duration-700 ease-out group-hover:scale-105"
                />
              ) : (
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center text-neutral-500">
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    {cat.name}
                  </span>
                </div>
              )}

              {/* Dark Gradient Overlay for High-Contrast Legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 pointer-events-none" />

              {/* Centered Typography Matching Reference UI with full name on first line */}
              <div className="absolute inset-x-0 bottom-0 pb-7 sm:pb-8 px-4 text-center z-20 flex flex-col items-center justify-end">
                <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-black tracking-wider text-white uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CategorySplitBlock;
