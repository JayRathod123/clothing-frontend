'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { ProductCard } from '@/components/product/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { ArrowRight, Loader2 } from 'lucide-react';

export function FeaturedProductsBlock() {
  const [activeTab, setActiveTab] = useState<'all' | 'oversized' | 'regular' | 'graphic'>('all');

  const { data, isLoading } = useProducts({
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  });

  const products = data?.items || [];

  const filteredProducts = products.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'oversized') return p.fit?.toLowerCase().includes('oversized') || p.name.toLowerCase().includes('oversized');
    if (activeTab === 'regular') return p.fit?.toLowerCase().includes('regular') || p.name.toLowerCase().includes('regular');
    if (activeTab === 'graphic') return p.categoryName?.toLowerCase().includes('graphic') || p.name.toLowerCase().includes('graphic');
    return true;
  });

  return (
    <section id="featured-products" className="py-14 md:py-18 bg-white">
      <Container>
        <div className="space-y-8">
          {/* Section Header */}
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 tracking-tight font-heading">
              New Arrivals
            </h2>
            <p className="text-sm sm:text-base text-neutral-600 max-w-lg mx-auto leading-relaxed">
              Freshly dropped streetwear silhouettes, tactile graphic prints, and everyday comfortable fits.
            </p>

            {/* Filter Tabs matching Inkstyles */}
            <div className="flex items-center justify-center gap-2.5 pt-2 flex-wrap">
              {[
                { id: 'all', label: 'All Arrivals' },
                { id: 'oversized', label: 'Oversized T-Shirts' },
                { id: 'regular', label: 'Regular Fit' },
                { id: 'graphic', label: 'Graphic Prints' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-full transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="py-16 flex items-center justify-center text-neutral-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-black" />
              <span className="text-sm font-semibold uppercase tracking-wider">Loading new arrivals...</span>
            </div>
          )}

          {/* 4-Column InkStyles Product Grid */}
          {!isLoading && filteredProducts.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product, idx) => (
                <ProductCard key={product.id} product={product} priority={idx < 2} />
              ))}
            </div>
          )}

          {!isLoading && filteredProducts.length === 0 && (
            <div className="text-center py-12 border border-neutral-100 bg-neutral-50">
              <p className="text-sm text-neutral-500 font-medium">No pieces found in this category.</p>
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
