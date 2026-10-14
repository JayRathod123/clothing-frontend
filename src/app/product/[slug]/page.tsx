import React, { Suspense } from 'react';
import { ProductDetailClient } from '@/components/product/ProductDetailClient';
import { ProductDetailSkeleton } from '@/components/product/ProductDetailSkeleton';
import { productService } from '@/services/product.service';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found | INKSTYLES' };

  return {
    title: `${product.name} | INKSTYLES`,
    description: product.description,
    openGraph: {
      title: `${product.name} | INKSTYLES`,
      description: product.description,
      images: [{ url: product.primaryImage || '' }],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const initialProduct = await productService.getProductBySlug(slug);

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailClient slug={slug} initialProduct={initialProduct} />
    </Suspense>
  );
}
