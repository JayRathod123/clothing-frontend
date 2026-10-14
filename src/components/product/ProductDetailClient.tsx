'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductReviewsSection } from '@/components/product/ProductReviewsSection';
import { ProductDetailSkeleton } from '@/components/product/ProductDetailSkeleton';
import { useProductBySlug, useProducts } from '@/hooks/useProducts';
import { Product } from '@/types/product.types';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface ProductDetailClientProps {
  slug: string;
  initialProduct?: Product | null;
}

export function ProductDetailClient({ slug, initialProduct }: ProductDetailClientProps) {
  // Call GET /api/products/slug/:slug via TanStack Query
  const { data: product, isLoading, isPending } = useProductBySlug(slug, initialProduct);

  // Fetch related products based on product category
  const { data: relatedData } = useProducts({
    categoryId: product?.categoryId,
    limit: 5,
  });

  const isWaiting = (isLoading || isPending) && !product;

  // Show skeleton UI when API is in pending state (no static data shown)
  if (isWaiting) {
    return <ProductDetailSkeleton />;
  }

  // Not found state if API completed and returned null
  if (!product) {
    return (
      <div className="py-20 bg-white">
        <Container>
          <div className="max-w-md mx-auto text-center space-y-4">
            <h1 className="text-2xl font-bold uppercase text-neutral-900">
              Product Not Found
            </h1>
            <p className="text-sm text-neutral-500">
              We couldn't find the piece you're looking for. It may have been archived or removed from the catalog.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-neutral-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Shop</span>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  const relatedProducts = (relatedData?.items || [])
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="py-8 md:py-12 bg-white">
      <Container>
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Shop', href: '/shop' },
            {
              label: product.categoryName || 'Collection',
              href: product.categoryId ? `/shop?categoryId=${product.categoryId}` : '/shop',
            },
            { label: product.name },
          ]}
        />

        {/* Main PDP Grid: Left Gallery + Right Product Info */}
        <div className="pt-4 sm:pt-6 grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-14 items-start">
          {/* Left Column: Gallery */}
          <div className="md:col-span-6 lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Details, Sizes, Pincode & Actions */}
          <div className="md:col-span-6 lg:col-span-5">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Product Details & Specifications Section (from API only) */}
        <div className="mt-14 sm:mt-20 pt-10 sm:pt-16 border-t border-neutral-200">
          <div className="max-w-4xl space-y-8">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-neutral-500">
                PRODUCT OVERVIEW
              </span>
              <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-900 mt-1">
                Details & Specifications
              </h2>
            </div>

            {product.description && (
              <div className="p-6 sm:p-8 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
                  Description
                </h4>
                <p className="text-sm sm:text-base text-neutral-800 leading-relaxed font-normal whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            {/* Dynamic Product Specifications Grid from API */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6 sm:p-8 bg-white border border-neutral-200 rounded-2xl">
              {product.categoryName && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Category
                  </span>
                  <span className="text-sm font-bold text-neutral-900 capitalize">
                    {product.categoryName}
                  </span>
                </div>
              )}

              {product.sku && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    SKU Code
                  </span>
                  <span className="text-sm font-mono font-bold text-neutral-900">
                    {product.sku}
                  </span>
                </div>
              )}

              {product.variants.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Available Sizes
                  </span>
                  <span className="text-sm font-bold text-neutral-900">
                    {Array.from(new Set(product.variants.map((v) => v.size).filter(Boolean))).join(', ') || 'Standard'}
                  </span>
                </div>
              )}

              {product.variants.length > 0 && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Available Colors
                  </span>
                  <span className="text-sm font-bold text-neutral-900">
                    {Array.from(new Set(product.variants.map((v) => v.color).filter(Boolean))).join(', ') || 'Default'}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                  Status
                </span>
                <span className="text-sm font-bold capitalize text-emerald-700">
                  {product.status || 'Active'}
                </span>
              </div>

              {product.gsm && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    GSM
                  </span>
                  <span className="text-sm font-bold text-neutral-900">
                    {product.gsm} GSM
                  </span>
                </div>
              )}

              {product.fabric && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Fabric
                  </span>
                  <span className="text-sm font-bold text-neutral-900">
                    {product.fabric}
                  </span>
                </div>
              )}

              {product.fit && (
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block">
                    Fit
                  </span>
                  <span className="text-sm font-bold text-neutral-900">
                    {product.fit}
                  </span>
                </div>
              )}
            </div>

            {/* Custom details list from API if present */}
            {product.details && product.details.length > 0 && (
              <div className="p-6 sm:p-8 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
                  Key Features
                </h4>
                <ul className="space-y-2 text-sm text-neutral-700 list-disc list-inside">
                  {product.details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Care instructions from API if present */}
            {product.careInstructions && product.careInstructions.length > 0 && (
              <div className="p-6 sm:p-8 bg-neutral-50 border border-neutral-200 rounded-2xl space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
                  Care Instructions
                </h4>
                <ul className="space-y-2 text-sm text-neutral-700 list-disc list-inside">
                  {product.careInstructions.map((instruction, idx) => (
                    <li key={idx}>{instruction}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Customer Reviews Section */}
        <ProductReviewsSection
          productId={product.id}
          productName={product.name}
        />

        {/* Related Products Grid */}
        {relatedProducts.length > 0 && (
          <div className="mt-14 sm:mt-20 pt-10 sm:pt-16 border-t border-neutral-200 space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-red-600">
                  CURATED COMPLEMENTS
                </span>
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900 mt-1">
                  Complete The Fit
                </h3>
              </div>
              <Link
                href="/shop"
                className="text-xs uppercase tracking-widest font-bold text-neutral-900 hover:text-red-600 transition-colors inline-flex items-center gap-1.5"
              >
                <span>Explore All</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 items-start">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}

export default ProductDetailClient;
