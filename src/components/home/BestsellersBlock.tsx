import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { ProductCard } from '@/components/product/ProductCard';
import { MOCK_PRODUCTS } from '@/constants/mockData';
import { ArrowRight } from 'lucide-react';

export function BestsellersBlock() {
  // Show complementary top favorites
  const bestsellers = MOCK_PRODUCTS.slice(4, 8);

  return (
    <section className="py-20 md:py-28 bg-[#F7F6F2]">
      <Container>
        <div className="space-y-10">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6E3DD] pb-4">
            <div className="space-y-1">
              <span className="editorial-kicker text-[#8A6A45]">
                TIMELESS CLASSICS
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
                MOST WANTED
              </h2>
              <p className="text-xs text-[#686868] max-w-md pt-0.5">
                Our most sought-after overshirts, tailored chinos, and knitwear.
              </p>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#171717] hover:text-[#8A6A45] transition-colors group"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* 4 Bestselling Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
