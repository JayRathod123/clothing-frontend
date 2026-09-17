import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductReviewsSection } from '@/components/product/ProductReviewsSection';
import { productService } from '@/services/product.service';
import { reviewService } from '@/services/review.service';
import { ChevronRight, ArrowRight } from 'lucide-react';
import type { Metadata } from 'next';

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
  const product = await productService.getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch reviews for this product
  const reviewsData = await reviewService.getProductReviews(product.id);
  const reviews = reviewsData.reviews || [];

  // Related products dynamically from backend API
  const relatedRes = await productService.getProducts({
    categoryId: product.categoryId,
    limit: 5,
  });
  const relatedProducts = (relatedRes.items || []).filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="py-8 md:py-12 bg-white">
      <Container>
        {/* Breadcrumb Navigation */}
        <Breadcrumb
          items={[
            { label: 'Shop', href: '/shop' },
            {
              label: product.categoryName || 'T-Shirts',
              href: `/category/${product.categoryId || 't-shirts'}`,
            },
            { label: product.name },
          ]}
        />

        {/* Main PDP Grid: Left Gallery (7 cols), Right Product Details (5 cols) */}
        <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Gallery */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Details, Sizes, Pincode & Actions */}
          <div className="lg:col-span-5">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Fabric Craftsmanship Narrative Section */}
        <div className="mt-20 pt-16 border-t border-neutral-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center bg-neutral-50 p-8 sm:p-12 border border-neutral-200">
            <div className="space-y-4">
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-red-600">
                FABRIC CRAFTSMANSHIP
              </span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
                Engineered In 240 GSM Combed Cotton
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                Every detail on {product.name} is calibrated for structural longevity. The French Terry knit retains its square boxy drape while the pre-shrunk bio-wash ensures zero post-wash distortion.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="border-l-2 border-black pl-3 space-y-0.5">
                  <p className="font-bold text-neutral-900 uppercase">Pre-Shrunk</p>
                  <p className="text-neutral-500 text-[11px]">Zero shrinkage guarantee</p>
                </div>
                <div className="border-l-2 border-black pl-3 space-y-0.5">
                  <p className="font-bold text-neutral-900 uppercase">1.25" High Rib</p>
                  <p className="text-neutral-500 text-[11px]">No-roll reinforced collar</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-16/10 w-full overflow-hidden border border-neutral-200">
              <Image
                src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=1000&auto=format&fit=crop"
                alt="Editorial styling look"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

        {/* Customer Reviews Section */}
        <ProductReviewsSection
          productId={product.id}
          productName={product.name}
          initialReviews={reviews}
        />

        {/* Related Products Grid */}
        <div className="mt-20 pt-16 border-t border-neutral-200 space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-red-600">
                CURATED COMPLEMENTS
              </span>
              <h3 className="text-2xl font-black uppercase tracking-tight text-neutral-900 mt-1">
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

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
