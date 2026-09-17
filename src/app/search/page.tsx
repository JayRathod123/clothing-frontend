'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { SearchBar } from '@/components/common/SearchBar';
import { useProducts } from '@/hooks/useProducts';
import { Search, Sparkles, ArrowRight } from 'lucide-react';

const POPULAR_TAGS = [
  'Oversized',
  'Graphic',
  '240 GSM',
  'Acid Wash',
  'Heavyweight',
  'Noir Black',
  'Drop Shoulder',
];

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(searchParams.get('q') || '');
  }, [searchParams]);

  // Fetch results based on query
  const { data, isLoading } = useProducts({
    search: query || undefined,
    limit: 20,
  });

  const products = data?.items || [];
  const total = data?.total || 0;

  const handleSelectTag = (tag: string) => {
    router.push(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <div className="py-8 min-h-screen">
      <Container>
        <Breadcrumb items={[{ label: 'Search' }]} />

        {/* Search Header Bar */}
        <div className="pt-4 pb-8 max-w-2xl mx-auto text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900">
              Search Catalog
            </h1>
            <p className="text-xs text-neutral-500 font-medium tracking-wide">
              Find oversized silhouettes, heavyweight textiles, and limited series.
            </p>
          </div>

          <SearchBar
            initialValue={query}
            placeholder="Search by fit, color, SKU, or name..."
            autoFocus
            onSearch={(q) => router.push(`/search?q=${encodeURIComponent(q)}`)}
          />

          {/* Popular Tag Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 mr-1 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-red-500" /> Popular:
            </span>
            {POPULAR_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => handleSelectTag(tag)}
                className={`text-xs px-3 py-1 border transition-colors font-medium ${
                  query.toLowerCase() === tag.toLowerCase()
                    ? 'border-black bg-black text-white font-bold'
                    : 'border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="pt-8 border-t border-neutral-200">
          <div className="flex items-center justify-between pb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
              {query ? (
                <>
                  Showing results for <span className="text-neutral-900 font-extrabold">"{query}"</span> ({total})
                </>
              ) : (
                <>All Catalog Items ({total})</>
              )}
            </span>
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            /* No Results State */
            <div className="py-20 text-center space-y-4 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold uppercase tracking-wider text-neutral-900">
                No items found for "{query}"
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">
                Check for typos or try searching for broader keywords such as "oversized", "cotton", or "graphic".
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => router.push('/shop')}
                  className="px-6 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors inline-flex items-center gap-2"
                >
                  <span>Explore Full Catalog</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
