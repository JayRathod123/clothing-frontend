'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { useProducts } from '@/hooks/useProducts';
import { ArrowRight } from 'lucide-react';

export function FeaturedProductsBlock() {
  const { data, isLoading, isPending } = useProducts({
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  const isProductsPending = isLoading || isPending || data === undefined;
  const products = data?.items || [];

  return (
    <section id="featured-products" className="py-14 md:py-18 bg-white">
      <Container>
        <div className="space-y-8">
          {/* Section Header */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-semibold text-neutral-900 tracking-tight font-heading">
              New Arrivals
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 max-w-lg mx-auto leading-relaxed">
              Freshly dropped streetwear silhouettes, tactile graphic prints, and everyday comfortable fits.
            </p>
          </div>

          {/* Skeleton Grid when API is in pending state */}
          {isProductsPending && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 items-start">
              {[...Array(8)].map((_, idx) => (
                <ProductCardSkeleton key={idx} />
              ))}
            </div>
          )}

          {/* Responsive Product Grid: 2 cols on mobile, 3 cols on tablet, 4 cols on desktop */}
          {!isProductsPending && products.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5 lg:gap-6 items-start">
              {products.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 2} />
              ))}
            </div>
          )}

          {!isProductsPending && products.length === 0 && (
            <div className="text-center py-12 border border-neutral-100 bg-neutral-50">
              <p className="text-sm text-neutral-500 font-medium">No new arrivals found at this time.</p>
            </div>
          )}

          {/* View All Button */}
          <div className="text-center pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-9 py-3.5 bg-black hover:bg-neutral-900 text-white text-xs sm:text-sm font-extrabold uppercase tracking-widest transition-colors rounded-xs shadow-xs"
            >
              <span>Explore All Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FeaturedProductsBlock;
