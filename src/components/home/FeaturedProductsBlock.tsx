import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { ProductCard } from '@/components/product/ProductCard';
import { MOCK_PRODUCTS } from '@/constants/mockData';
import { ArrowRight } from 'lucide-react';

export function FeaturedProductsBlock() {
  const products = MOCK_PRODUCTS.slice(0, 4);

  return (
    <section id="featured-products" className="py-20 md:py-28 bg-[#F7F6F2]">
      <Container>
        <div className="space-y-10">
          {/* Clean Editorial Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6E3DD] pb-4">
            <div className="space-y-1">
              <span className="editorial-kicker text-[#8A6A45]">
                SIGNATURE ROTATION
              </span>
              <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
                NEW ARRIVALS
              </h2>
              <p className="text-xs text-[#686868] max-w-md pt-0.5">
                Everyday elevated essentials crafted with considered fits and heavyweight textiles.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-semibold text-[#171717] hover:text-[#8A6A45] transition-colors group"
            >
              <span>View All Pieces</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Clean 4-Column Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
            {products.map((product, idx) => (
              <ProductCard key={product.id} product={product} priority={idx < 2} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
