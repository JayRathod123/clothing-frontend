'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { ProductCard } from '@/components/product/ProductCard';
import { useProducts } from '@/hooks/useProducts';
import { ArrowRight } from 'lucide-react';

export function BestsellersBlock() {
  const { data } = useProducts({ limit: 4, sortBy: 'popularity', sortOrder: 'DESC' });
  const bestsellers = data?.items || [];

  if (bestsellers.length === 0) return null;

  return (
    <section className="py-16 md:py-20 bg-white">
      <Container>
        <div className="space-y-8">
          <div className="flex items-center justify-between border-b border-neutral-200 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 uppercase">
                Best Sellers
              </h2>
            </div>
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-bold text-neutral-900 hover:text-sky-600 transition-colors"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default BestsellersBlock;
