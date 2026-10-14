import React, { Suspense } from 'react';
import { ProductListingView } from '@/components/product/ProductListingView';
import { Container } from '@/components/layout/Container';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';

export const metadata = {
  title: 'All Contemporary Pieces | AURA STUDIO',
  description: 'Explore the complete capsule of heavyweight cotton tees, structured overshirts, and tailored trousers.',
};

function ShopFallback() {
  return (
    <div className="py-8 md:py-12 bg-white">
      <Container>
        <div className="space-y-2 pb-6 border-b border-neutral-200">
          <div className="h-9 w-48 bg-neutral-200 animate-pulse rounded" />
          <div className="h-4 w-96 bg-neutral-100 animate-pulse rounded" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 pt-8">
          {[...Array(8)].map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </Container>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ShopFallback />}>
      <ProductListingView
        title="ALL PIECES"
        subtitle="Contemporary silhouettes, considered cuts, and 240 GSM signature essentials."
      />
    </Suspense>
  );
}
