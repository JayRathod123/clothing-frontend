'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { ProductGrid } from './ProductGrid';
import { EmptyState } from '@/components/common/EmptyState';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useCollectionProducts } from '@/hooks/useCollections';
import { Product } from '@/types/product.types';
import { SlidersHorizontal, Grid3X3, Grid2X2, X, RotateCcw, Check } from 'lucide-react';

interface ProductListingViewProps {
  title?: string;
  subtitle?: string;
  initialCategoryId?: string;
  collectionSlug?: string;
  initialProducts?: Product[];
}

export function ProductListingView({
  title = 'ALL PIECES',
  subtitle = 'Everyday silhouettes, considered fits, and architectural cotton essentials.',
  initialCategoryId,
  collectionSlug,
  initialProducts,
}: ProductListingViewProps) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // URL Query Parameters
  const searchQuery = searchParams?.get('search') || searchParams?.get('q') || '';
  const categoryParam = searchParams?.get('category') || searchParams?.get('categoryId');

  const isUuid = (val?: string | null): val is string =>
    Boolean(val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val));

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    if (isUuid(categoryParam)) return categoryParam;
    if (isUuid(initialCategoryId)) return initialCategoryId;
    return 'all';
  });
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'createdAt' | 'price' | 'name'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4>(3);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // Dynamic Categories from Backend API
  const { data: categories = [], isLoading: isCategoriesLoading, isPending: isCategoriesPending } = useCategories();
  const isCategoriesWaiting = isCategoriesLoading || isCategoriesPending;

  const lastAppliedCategoryRef = React.useRef<string | null>(null);

  // Sync category selection if URL category/categoryId changes & remove from URL after applying
  useEffect(() => {
    if (!categoryParam) return;

    if (lastAppliedCategoryRef.current !== categoryParam) {
      const matched = categories.find(
        (c) => c.slug?.toLowerCase() === categoryParam.toLowerCase() || c.id === categoryParam
      );

      if (matched) {
        setSelectedCategory(matched.id);
        lastAppliedCategoryRef.current = categoryParam;
      } else if (isUuid(categoryParam)) {
        setSelectedCategory(categoryParam);
        lastAppliedCategoryRef.current = categoryParam;
      }

      // Remove category and categoryId from URL after applying filter
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has('category') || url.searchParams.has('categoryId')) {
          url.searchParams.delete('category');
          url.searchParams.delete('categoryId');
          window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''));
        }
      } catch {
        // ignore in non-browser context
      }
    }
  }, [categoryParam, categories]);

  // TanStack Query Products directly filtered via Backend API search query (store-wide)
  const {
    data: allProductsData,
    isLoading: isProductsLoading,
    isPending: isProductsPending,
  } = useProducts({
    search: searchQuery.trim() || undefined,
    categoryId: isUuid(selectedCategory) ? selectedCategory : undefined,
    sortBy,
    sortOrder,
  });

  // Query products specifically for this collection when in collection view
  const {
    data: collectionProductsData,
    isLoading: isCollectionLoading,
    isPending: isCollectionPending,
  } = useCollectionProducts(collectionSlug || '');

  const isCollectionMode = Boolean(collectionSlug || (initialProducts && initialProducts.length > 0));

  // When API is in pending state, isLoading is strictly true so skeletons are displayed
  const isLoading = isCollectionMode
    ? (isCollectionLoading || isCollectionPending || collectionProductsData === undefined) &&
    (!initialProducts || initialProducts.length === 0)
    : isProductsLoading || isProductsPending || allProductsData === undefined;

  const rawProducts: Product[] = useMemo(() => {
    if (isCollectionMode) {
      if (collectionProductsData && collectionProductsData.length > 0) {
        return collectionProductsData;
      }
      if (initialProducts && initialProducts.length > 0) {
        return initialProducts;
      }
      return [];
    }
    return allProductsData?.items || [];
  }, [isCollectionMode, collectionProductsData, initialProducts, allProductsData?.items]);

  // Fixed Price Limits (0 to 5000) - strictly fixed, not dynamically derived from products
  const MIN_PRICE_LIMIT = 0;
  const MAX_PRICE_LIMIT = 5000;

  // Price States (Min & Max with typed input support)
  const [minPrice, setMinPrice] = useState<number>(MIN_PRICE_LIMIT);
  const [maxPrice, setMaxPrice] = useState<number>(MAX_PRICE_LIMIT);
  const [minInput, setMinInput] = useState<string>('');
  const [maxInput, setMaxInput] = useState<string>('');

  // Dynamic Sizes derived from Products variants
  const availableSizes = useMemo(() => {
    const products = rawProducts;
    const sizeMap = new Map<string, number>();
    products.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.size && v.size.trim()) {
          const s = v.size.trim().toUpperCase();
          sizeMap.set(s, (sizeMap.get(s) || 0) + 1);
        }
      });
    });

    const standardOrder = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL', 'FREE'];
    return Array.from(sizeMap.entries())
      .map(([size, count]) => ({ size, count }))
      .sort((a, b) => {
        const idxA = standardOrder.indexOf(a.size);
        const idxB = standardOrder.indexOf(b.size);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA !== -1) return -1;
        if (idxB !== -1) return 1;
        const numA = parseFloat(a.size);
        const numB = parseFloat(b.size);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.size.localeCompare(b.size);
      });
  }, [rawProducts]);

  // Dynamic Colors derived from Products variants
  const availableColors = useMemo(() => {
    const products = rawProducts;
    const colorMap = new Map<string, { name: string; hex: string; count: number }>();

    products.forEach((p) => {
      p.variants?.forEach((v) => {
        if (v.color && v.color.trim()) {
          const rawName = v.color.trim();
          const key = rawName.toLowerCase();
          const hex = v.colorHex || '#171717';
          if (colorMap.has(key)) {
            colorMap.get(key)!.count += 1;
          } else {
            const formattedName = rawName.charAt(0).toUpperCase() + rawName.slice(1);
            colorMap.set(key, { name: formattedName, hex, count: 1 });
          }
        }
      });
    });

    return Array.from(colorMap.values()).sort((a, b) => b.count - a.count);
  }, [rawProducts]);

  // Dynamic Product Counts per Category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const products = rawProducts;
    products.forEach((p) => {
      if (p.categoryId) {
        counts[p.categoryId] = (counts[p.categoryId] || 0) + 1;
      }
    });
    return counts;
  }, [rawProducts]);

  // Client-side multi-tag filter refinement (size, color, price, search, sorting)
  const filteredProducts = useMemo(() => {
    const products = [...rawProducts];
    const result = products.filter((product) => {
      // Filter by search query if in collection mode
      if (searchQuery && isCollectionMode) {
        const q = searchQuery.toLowerCase();
        const matchesName = product.name?.toLowerCase().includes(q);
        const matchesSku = product.sku?.toLowerCase().includes(q);
        if (!matchesName && !matchesSku) return false;
      }
      // Filter by category
      if (selectedCategory !== 'all' && product.categoryId !== selectedCategory) {
        return false;
      }
      // Filter by size
      if (selectedSizes.length > 0) {
        const hasSize = product.variants?.some((v) =>
          selectedSizes.some((s) => v.size?.trim().toUpperCase() === s.toUpperCase())
        );
        if (!hasSize) return false;
      }
      // Filter by color
      if (selectedColors.length > 0) {
        const hasColor = product.variants?.some((v) =>
          selectedColors.some((c) => v.color?.toLowerCase().includes(c.toLowerCase()))
        );
        if (!hasColor) return false;
      }
      // Filter by price
      const price = product.discountPrice && product.discountPrice > 0 ? product.discountPrice : product.basePrice;
      if (minPrice > MIN_PRICE_LIMIT && price < minPrice) return false;
      if (maxPrice < MAX_PRICE_LIMIT && price > maxPrice) return false;

      return true;
    });

    // Client-side sorting for collection mode
    if (isCollectionMode) {
      result.sort((a, b) => {
        if (sortBy === 'price') {
          const priceA = a.discountPrice && a.discountPrice > 0 ? a.discountPrice : a.basePrice;
          const priceB = b.discountPrice && b.discountPrice > 0 ? b.discountPrice : b.basePrice;
          return sortOrder === 'ASC' ? priceA - priceB : priceB - priceA;
        }
        if (sortBy === 'name') {
          return sortOrder === 'ASC' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        }
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return sortOrder === 'ASC' ? dateA - dateB : dateB - dateA;
      });
    }

    return result;
  }, [rawProducts, selectedCategory, selectedSizes, selectedColors, minPrice, maxPrice, searchQuery, isCollectionMode, sortBy, sortOrder]);

  const sortOptions = [
    { value: 'createdAt-DESC', label: 'NEWEST ARRIVALS' },
    { value: 'price-ASC', label: 'PRICE: LOW TO HIGH' },
    { value: 'price-DESC', label: 'PRICE: HIGH TO LOW' },
    { value: 'name-ASC', label: 'ALPHABETICAL: A-Z' },
  ];

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleMinInputChange = (val: string) => {
    setMinInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num >= 0) {
      setMinPrice(num);
    } else if (val === '') {
      setMinPrice(MIN_PRICE_LIMIT);
    }
  };

  const handleMaxInputChange = (val: string) => {
    setMaxInput(val);
    const num = parseFloat(val);
    if (!isNaN(num) && num > 0) {
      setMaxPrice(num);
    } else if (val === '') {
      setMaxPrice(MAX_PRICE_LIMIT);
    }
  };

  const handleSliderChange = (val: number) => {
    setMaxPrice(val);
    setMaxInput(val === MAX_PRICE_LIMIT ? '' : String(val));
  };

  const applyPricePreset = (presetMin: number, presetMax: number) => {
    setMinPrice(presetMin);
    setMaxPrice(presetMax);
    setMinInput(presetMin > MIN_PRICE_LIMIT ? String(presetMin) : '');
    setMaxInput(presetMax < MAX_PRICE_LIMIT ? String(presetMax) : '');
  };

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setMinPrice(MIN_PRICE_LIMIT);
    setMaxPrice(MAX_PRICE_LIMIT);
    setMinInput('');
    setMaxInput('');
    setSortBy('createdAt');
    setSortOrder('DESC');
  };

  const handleClearSearch = () => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.delete('search');
    params.delete('q');
    const qStr = params.toString();
    router.push(qStr ? `/shop?${qStr}` : '/shop');
  };

  const handleClearAll = () => {
    handleClearFilters();
    handleClearSearch();
  };

  const isPriceFiltered = minPrice > MIN_PRICE_LIMIT || maxPrice < MAX_PRICE_LIMIT;
  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (isPriceFiltered ? 1 : 0) +
    (searchQuery ? 1 : 0);

  // Shared Filter Controls markup
  const renderFilterControls = () => (
    <div className="space-y-6">
      {/* Filter Header with Reset */}
      <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200/80">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-neutral-800" />
          <span className="font-extrabold text-xs uppercase tracking-wider text-neutral-900">
            Filters
          </span>
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={handleClearAll}
            className="inline-flex items-center gap-1 text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Category Section */}
      <div className="space-y-2.5">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
          Category
        </h4>
        {isCategoriesWaiting ? (
          <div className="space-y-1.5 py-1">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-9 w-full bg-neutral-100 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="space-y-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${selectedCategory === 'all'
                ? 'bg-neutral-950 text-white shadow-xs'
                : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-black'
                }`}
            >
              <span>All Categories</span>
              {selectedCategory === 'all' && <Check className="w-4 h-4 text-white" />}
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${isSelected
                    ? 'bg-neutral-950 text-white shadow-xs'
                    : 'text-neutral-700 hover:bg-neutral-100/80 hover:text-black'
                    }`}
                >
                  <span className="capitalize">{cat.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-white" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Sizes Section */}
      <div className="space-y-3 pt-5 border-t border-neutral-200/80">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
            Sizes
          </h4>
          {selectedSizes.length > 0 && (
            <button
              onClick={() => setSelectedSizes([])}
              className="text-[11px] font-semibold text-neutral-500 hover:text-black hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        {isLoading ? (
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="min-w-[42px] h-10 w-12 rounded-xl bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : availableSizes.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {availableSizes.map(({ size }) => {
              const isSelected = selectedSizes.includes(size);
              return (
                <button
                  key={size}
                  onClick={() => toggleSize(size)}
                  className={`min-w-[42px] h-10 px-3.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center cursor-pointer shadow-2xs ${isSelected
                    ? 'bg-neutral-950 text-white border-neutral-950 shadow-xs scale-102'
                    : 'bg-white text-neutral-800 border-neutral-200/90 hover:border-neutral-400 hover:bg-neutral-50'
                    }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-neutral-400 italic">No sizes found</p>
        )}
      </div>

      {/* Colors Section */}
      <div className="space-y-3 pt-5 border-t border-neutral-200/80">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
            Color
          </h4>
          {selectedColors.length > 0 && (
            <button
              onClick={() => setSelectedColors([])}
              className="text-[11px] font-semibold text-neutral-500 hover:text-black hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
        {isLoading ? (
          <div className="flex flex-wrap gap-2.5">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="w-8 h-8 rounded-full bg-neutral-100 animate-pulse" />
            ))}
          </div>
        ) : availableColors.length > 0 ? (
          <div className="flex flex-wrap gap-2.5">
            {availableColors.map((col) => {
              const isSelected = selectedColors.includes(col.name);
              const isLightColor =
                col.hex.toLowerCase() === '#ffffff' ||
                col.hex.toLowerCase().includes('#eae') ||
                col.hex.toLowerCase().includes('#f4f') ||
                col.name.toLowerCase().includes('white') ||
                col.name.toLowerCase().includes('chalk') ||
                col.name.toLowerCase().includes('cream');

              return (
                <button
                  key={col.name}
                  type="button"
                  onClick={() => toggleColor(col.name)}
                  title={col.name}
                  className={`w-8 h-8 rounded-full relative flex items-center justify-center transition-all cursor-pointer shadow-2xs border ${isSelected
                    ? 'ring-2 ring-neutral-950 ring-offset-2 scale-110 shadow-sm border-transparent'
                    : 'border-black/15 hover:scale-110 hover:shadow-xs'
                    }`}
                  style={{ backgroundColor: col.hex }}
                  aria-label={col.name}
                >
                  {isSelected && (
                    <Check
                      className={`w-3.5 h-3.5 stroke-[3] ${isLightColor ? 'text-neutral-950' : 'text-white'
                        }`}
                    />
                  )}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-neutral-400 italic">No colors found</p>
        )}
      </div>

      {/* Price Range Section with TYPE Option */}
      <div className="space-y-3 pt-5 border-t border-neutral-200/80">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-500">
            Price Range
          </h4>
          {isPriceFiltered && (
            <button
              onClick={() => {
                setMinPrice(MIN_PRICE_LIMIT);
                setMaxPrice(MAX_PRICE_LIMIT);
                setMinInput('');
                setMaxInput('');
              }}
              className="text-[11px] font-semibold text-neutral-500 hover:text-black hover:underline cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>

        {/* Type Inputs: Min & Max */}
        <div className="grid grid-cols-2 gap-2.5">
          <div>
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Min Price
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold select-none">
                ₹
              </span>
              <input
                type="number"
                value={minInput}
                onChange={(e) => handleMinInputChange(e.target.value)}
                placeholder={String(MIN_PRICE_LIMIT)}
                className="w-full pl-6 pr-2.5 py-1.5 text-xs font-bold bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Max Price
            </label>
            <div className="relative">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs font-bold select-none">
                ₹
              </span>
              <input
                type="number"
                value={maxInput}
                onChange={(e) => handleMaxInputChange(e.target.value)}
                placeholder={String(MAX_PRICE_LIMIT)}
                className="w-full pl-6 pr-2.5 py-1.5 text-xs font-bold bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Range Slider for visual fine-tuning */}
        <div className="pt-2">
          <RangeSlider
            min={MIN_PRICE_LIMIT}
            max={MAX_PRICE_LIMIT}
            step={100}
            value={maxPrice}
            onChange={handleSliderChange}
            label="Cap Limit"
          />
        </div>


      </div>
    </div>
  );

  return (
    <div className="py-8 md:py-12 bg-white">
      <Container>
        {/* Top Title & Subtitle */}
        <div className="space-y-2 pb-6 border-b border-neutral-200">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 uppercase font-heading">
              {searchQuery ? 'SEARCH RESULTS' : title}
            </h1>
            {searchQuery && (
              <span className="bg-neutral-100 text-neutral-800 text-xs font-bold px-3 py-1 rounded-full border border-neutral-200">
                "{searchQuery}"
              </span>
            )}
          </div>
          <p className="text-sm sm:text-base text-neutral-600 max-w-xl">
            {searchQuery
              ? `Found ${filteredProducts.length} piece${filteredProducts.length === 1 ? '' : 's'} matching your search query.`
              : subtitle}
          </p>
        </div>

        {/* Toolbar: Filter Trigger, Sort Dropdown & Grid View Toggle */}
        <div className="py-4 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200">
          {/* Mobile Filter Toggle Button & Count */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-neutral-200/90 hover:border-black text-xs font-bold uppercase tracking-wider text-neutral-900 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>
            <span className="text-xs sm:text-sm font-medium text-neutral-600 flex items-center gap-1.5">
              Showing{' '}
              {isLoading ? (
                <span className="inline-block w-8 h-4 bg-neutral-200 animate-pulse rounded" />
              ) : (
                <strong className="font-extrabold text-neutral-900">{filteredProducts.length}</strong>
              )}{' '}
              pieces
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Custom Luxury Sort Dropdown */}
            <div className="flex items-center gap-2.5">
              <span className="text-neutral-500 uppercase text-xs font-bold tracking-wider hidden sm:inline select-none">
                Sort By:
              </span>
              <Select
                value={`${sortBy}-${sortOrder}`}
                onChange={(val) => {
                  const [field, order] = val.split('-') as [any, any];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                options={sortOptions}
                size="sm"
                align="right"
                triggerClassName="min-w-[190px] border-neutral-200/90 hover:border-black font-bold uppercase text-xs tracking-wider py-2.5 px-3.5 bg-white rounded-xl shadow-2xs hover:shadow-xs transition-all"
                menuClassName="w-[210px] shadow-2xl border-neutral-200"
              />
            </div>

            {/* Grid Toggle (Desktop) */}
            <div className="hidden sm:flex items-center gap-0.5 border border-neutral-200 bg-neutral-100 p-0.5 rounded-xl">
              <button
                onClick={() => setGridColumns(3)}
                className={`p-1.5 rounded-lg transition-all ${gridColumns === 3
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-500 hover:text-black hover:bg-neutral-200/50'
                  }`}
                title="3 Columns"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridColumns(4)}
                className={`p-1.5 rounded-lg transition-all ${gridColumns === 4
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-500 hover:text-black hover:bg-neutral-200/50'
                  }`}
                title="4 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeFilterCount > 0 && (
          <div className="py-3.5 flex flex-wrap items-center gap-2 border-b border-neutral-100">
            <span className="text-xs uppercase font-extrabold text-neutral-400 tracking-wider mr-1">
              Active:
            </span>

            {searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-xs font-bold rounded-full shadow-2xs">
                Search: "{searchQuery}"
                <button
                  onClick={handleClearSearch}
                  className="hover:text-neutral-300 transition-colors ml-0.5 cursor-pointer"
                  title="Clear search"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 border border-neutral-200/80 text-neutral-900 text-xs font-semibold rounded-full shadow-2xs">
                Category:{' '}
                {categories.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-black transition-colors ml-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}

            {selectedSizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 border border-neutral-200/80 text-neutral-900 text-xs font-semibold rounded-full shadow-2xs"
              >
                Size: {size}
                <button
                  onClick={() => toggleSize(size)}
                  className="hover:text-black transition-colors ml-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {selectedColors.map((col) => (
              <span
                key={col}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 border border-neutral-200/80 text-neutral-900 text-xs font-semibold rounded-full shadow-2xs"
              >
                Color: {col}
                <button
                  onClick={() => toggleColor(col)}
                  className="hover:text-black transition-colors ml-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}

            {isPriceFiltered && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 border border-neutral-200/80 text-neutral-900 text-xs font-semibold rounded-full shadow-2xs">
                Price: ₹{minPrice.toLocaleString('en-IN')} - ₹{maxPrice.toLocaleString('en-IN')}
                <button
                  onClick={() => {
                    setMinPrice(MIN_PRICE_LIMIT);
                    setMaxPrice(MAX_PRICE_LIMIT);
                    setMinInput('');
                    setMaxInput('');
                  }}
                  className="hover:text-black transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleClearAll}
              className="text-xs font-bold text-neutral-500 hover:text-rose-600 underline ml-2 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content Area: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8">
          {/* Desktop Filter Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 pr-4">
            <div className="sticky top-24 bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-2xs">
              {renderFilterControls()}
            </div>
          </aside>

          {/* Product Grid Area (9 cols on desktop, 12 on mobile) */}
          <div className="lg:col-span-9">
            {isLoading ? (
              <ProductGrid
                products={[]}
                isLoading={true}
                columns={gridColumns}
              />
            ) : filteredProducts.length === 0 ? (
              <EmptyState
                title={searchQuery ? `No pieces found for "${searchQuery}"` : 'No pieces found.'}
                description={
                  searchQuery
                    ? `We couldn't find any products matching "${searchQuery}". Check the spelling or try searching for another style.`
                    : 'Try adjusting your filters or price range to find what you are looking for.'
                }
                actionText={searchQuery ? 'CLEAR SEARCH & VIEW ALL' : 'CLEAR ALL FILTERS'}
                onAction={handleClearAll}
              />
            ) : (
              <ProductGrid
                products={filteredProducts}
                isLoading={false}
                columns={gridColumns}
              />
            )}
          </div>
        </div>
      </Container>

      {/* Mobile Filters Slide-in Drawer */}
      <Drawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        title={`Filter & Refine (${activeFilterCount})`}
      >
        <div className="space-y-6">
          {renderFilterControls()}
          <div className="pt-4 border-t border-neutral-200">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => setIsFilterDrawerOpen(false)}
            >
              Show {filteredProducts.length} Results
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}

export default ProductListingView;
