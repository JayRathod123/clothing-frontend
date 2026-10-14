import React from 'react';
import { Container } from '@/components/layout/Container';

export function ProductDetailSkeleton() {
  return (
    <div className="py-8 md:py-12 bg-white animate-pulse">
      <Container>
        {/* Breadcrumb Skeleton */}
        <div className="flex items-center gap-2 mb-6">
          <div className="h-4 w-12 bg-neutral-200 rounded" />
          <div className="h-4 w-3 bg-neutral-200 rounded" />
          <div className="h-4 w-20 bg-neutral-200 rounded" />
          <div className="h-4 w-3 bg-neutral-200 rounded" />
          <div className="h-4 w-36 bg-neutral-200 rounded" />
        </div>

        {/* Main PDP Grid: Left Gallery Skeleton + Right Info Skeleton */}
        <div className="pt-4 sm:pt-6 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Gallery Skeleton */}
          <div className="md:col-span-6 lg:col-span-7 space-y-4">
            <div className="aspect-[3/4] sm:aspect-[4/5] w-full rounded-2xl bg-neutral-200" />
            <div className="flex gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-20 h-24 rounded-xl bg-neutral-200 shrink-0" />
              ))}
            </div>
          </div>

          {/* Right Column: Info Skeleton */}
          <div className="md:col-span-6 lg:col-span-5 space-y-6">
            {/* Category & Title */}
            <div className="space-y-3">
              <div className="h-3.5 w-24 bg-neutral-200 rounded" />
              <div className="h-8 sm:h-10 w-4/5 bg-neutral-200 rounded" />
              <div className="flex items-center gap-3 pt-1">
                <div className="h-4 w-28 bg-neutral-200 rounded" />
                <div className="h-4 w-20 bg-neutral-200 rounded" />
              </div>
              {/* Price */}
              <div className="flex items-center gap-3 pt-2">
                <div className="h-8 w-28 bg-neutral-200 rounded" />
                <div className="h-6 w-20 bg-neutral-200 rounded" />
              </div>
            </div>

            {/* Sizes Skeleton */}
            <div className="space-y-2 pt-4 border-t border-neutral-100">
              <div className="h-4 w-24 bg-neutral-200 rounded" />
              <div className="flex gap-2.5">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-12 h-11 rounded-xl bg-neutral-200" />
                ))}
              </div>
            </div>

            {/* Colors Skeleton */}
            <div className="space-y-2 pt-2">
              <div className="h-4 w-20 bg-neutral-200 rounded" />
              <div className="flex gap-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-neutral-200" />
                ))}
              </div>
            </div>

            {/* Action Buttons Skeleton */}
            <div className="space-y-3 pt-4">
              <div className="h-12 w-full bg-neutral-200 rounded-xl" />
              <div className="h-12 w-full bg-neutral-200 rounded-xl" />
            </div>

            {/* Pincode & Info Card Skeleton */}
            <div className="h-28 w-full bg-neutral-100 rounded-xl mt-6 border border-neutral-200/60" />
          </div>
        </div>

        {/* Fabric Craftsmanship Skeleton */}
        <div className="mt-14 sm:mt-20 pt-10 sm:pt-16 border-t border-neutral-200">
          <div className="h-64 w-full bg-neutral-100 rounded-2xl border border-neutral-200/60" />
        </div>

        {/* Related Products Skeleton */}
        <div className="mt-14 sm:mt-20 pt-10 sm:pt-16 border-t border-neutral-200 space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-2">
              <div className="h-3 w-28 bg-neutral-200 rounded" />
              <div className="h-6 w-44 bg-neutral-200 rounded" />
            </div>
            <div className="h-4 w-20 bg-neutral-200 rounded" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] w-full rounded-2xl bg-neutral-200" />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ProductDetailSkeleton;
