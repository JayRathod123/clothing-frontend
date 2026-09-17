import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductInfo } from '@/components/product/ProductInfo';
import { ProductCard } from '@/components/product/ProductCard';
import { productService } from '@/services/product.service';
import { MOCK_PRODUCTS } from '@/constants/mockData';
import { ChevronRight } from 'lucide-react';

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await productService.getProductBySlug(slug);
  return {
    title: `${product.name} | AURA STUDIO`,
    description: product.description,
    openGraph: {
      title: `${product.name} | AURA STUDIO`,
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

  // Related products from same category or different pieces
  const relatedProducts = MOCK_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="py-10 md:py-16 bg-[#F7F6F2]">
      <Container>
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-[#929292] pb-8 border-b border-[#E6E3DD] mb-10">
          <Link href="/" className="hover:text-[#171717] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 text-[#B6B1A6]" />
          <Link href="/shop" className="hover:text-[#171717] transition-colors">
            Shop
          </Link>
          <ChevronRight className="w-3 h-3 text-[#B6B1A6]" />
          <Link
            href={`/category/${product.categoryId === 'cat-2' ? 'shirts' : product.categoryId === 'cat-3' ? 'bottoms' : 't-shirts'}`}
            className="hover:text-[#171717] transition-colors"
          >
            {product.categoryName || 'Garment'}
          </Link>
          <ChevronRight className="w-3 h-3 text-[#B6B1A6]" />
          <span className="text-[#171717] font-semibold truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Main PDP Grid: Left Gallery, Right Product Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Gallery (7 Cols) */}
          <div className="lg:col-span-7">
            <ProductGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Column: Details & Actions (5 Cols) */}
          <div className="lg:col-span-5">
            <ProductInfo product={product} />
          </div>
        </div>

        {/* Editorial Storytelling Banner Below Fold */}
        <div className="mt-24 pt-16 border-t border-[#E6E3DD]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="editorial-kicker text-[#8A6A45]">
                ATELIER NOTES
              </span>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
                THE PROPORTIONAL HARMONY
              </h3>
              <p className="text-xs sm:text-sm text-[#686868] leading-relaxed">
                Every seam on {product.name} is placed to complement natural human posture.
                We avoid synthetic elastane blends in favor of natural textile density that relaxes to your body over time.
              </p>
              <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
                <div className="border-l-2 border-[#171717] pl-3">
                  <p className="font-semibold text-[#171717]">Custom Weave</p>
                  <p className="text-[#929292] text-[11px]">Ring-spun pure combed fiber</p>
                </div>
                <div className="border-l-2 border-[#171717] pl-3">
                  <p className="font-semibold text-[#171717]">Zero Roll Neck</p>
                  <p className="text-[#929292] text-[11px]">Reinforced elastane-free rib</p>
                </div>
              </div>
            </div>

            <div className="relative aspect-16/10 w-full overflow-hidden bg-[#EFEEE9] border border-[#E6E3DD]">
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

        {/* Related Products Carousel / Grid */}
        <div className="mt-24 pt-16 border-t border-[#E6E3DD] space-y-8">
          <div className="flex items-end justify-between">
            <div>
              <span className="editorial-kicker text-[#8A6A45]">CURATED COMPLEMENTS</span>
              <h3 className="text-2xl font-semibold tracking-tight text-[#171717] mt-1">
                COMPLETE THE CAPSULE
              </h3>
            </div>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-widest font-semibold text-[#171717] hover:text-[#8A6A45] transition-colors"
            >
              Shop All Pieces →
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
