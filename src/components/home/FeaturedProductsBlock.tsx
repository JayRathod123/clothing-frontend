'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { ProductCard } from '@/components/product/ProductCard';
import { MOCK_PRODUCTS } from '@/constants/mockData';
import { ArrowRight } from 'lucide-react';

export function FeaturedProductsBlock() {
  const [activeTab, setActiveTab] = useState<'all' | 'oversized' | 'regular' | 'graphic'>('all');

  const filteredProducts = MOCK_PRODUCTS.filter((p) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'oversized') return p.fit?.toLowerCase().includes('oversized') || p.name.toLowerCase().includes('oversized');
    if (activeTab === 'regular') return p.fit?.toLowerCase().includes('regular') || p.name.toLowerCase().includes('regular');
    if (activeTab === 'graphic') return p.categoryName?.toLowerCase().includes('graphic') || p.name.toLowerCase().includes('graphic');
    return true;
  }).slice(0, 8);

  return (
    <section id="featured-products" className="py-14 md:py-18 bg-white">
      <Container>
        <div className="space-y-8">
          {/* Section Header */}
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              New Arrivals
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto">
              Freshly dropped streetwear silhouettes, tactile graphic prints, and everyday comfortable fits.
            </p>

            {/* Filter Tabs matching Inkstyles */}
            <div className="flex items-center justify-center gap-2 pt-2 flex-wrap">
              {[
                { id: 'all', label: 'All Arrivals' },
                { id: 'oversized', label: 'Oversized T-Shirts' },
                { id: 'regular', label: 'Regular Fit' },
                { id: 'graphic', label: 'Graphic Prints' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-1.5 text-xs font-bold rounded-full transition-all ${
                    activeTab === tab.id
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 4-Column InkStyles Product Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 2} />
            ))}
          </div>

          <div className="pt-4 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-sm transition-colors shadow-sm"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default FeaturedProductsBlock;
