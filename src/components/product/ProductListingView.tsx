'use client';

import React, { useState, useMemo } from 'react';
import { Container } from '@/components/layout/Container';
import { ProductGrid } from './ProductGrid';
import { EmptyState } from '@/components/common/EmptyState';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { RangeSlider } from '@/components/ui/RangeSlider';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { SlidersHorizontal, Grid3X3, Grid2X2, X } from 'lucide-react';

interface ProductListingViewProps {
  title?: string;
  subtitle?: string;
  initialCategoryId?: string;
}

export function ProductListingView({
  title = 'ALL PIECES',
  subtitle = 'Everyday silhouettes, considered fits, and architectural cotton essentials.',
  initialCategoryId,
}: ProductListingViewProps) {
  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategoryId || 'all');
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(5000);
  const [sortBy, setSortBy] = useState<'createdAt' | 'price' | 'name'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [gridColumns, setGridColumns] = useState<2 | 3 | 4>(4);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  // TanStack Query Products
  const { data, isLoading } = useProducts({
    categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
    sortBy,
    sortOrder,
    maxPrice: priceRange,
  });

  // Dynamic Categories from Backend API
  const { data: categories = [] } = useCategories();

  // Client-side multi-tag filter refinement (size & color)
  const filteredProducts = useMemo(() => {
    const products = data?.items || [];
    return products.filter((product) => {
      // Filter by size
      if (selectedSizes.length > 0) {
        const hasSize = product.variants.some((v) => selectedSizes.includes(v.size));
        if (!hasSize) return false;
      }
      // Filter by color
      if (selectedColors.length > 0) {
        const hasColor = product.variants.some((v) =>
          selectedColors.some((c) => v.color.toLowerCase().includes(c.toLowerCase()))
        );
        if (!hasColor) return false;
      }
      return true;
    });
  }, [data?.items, selectedSizes, selectedColors]);

  const availableSizes = ['S', 'M', 'L', 'XL', 'XXL', '30', '32', '34'];
  const availableColors = [
    { name: 'Black', hex: '#171717' },
    { name: 'White', hex: '#EAE6DF' },
    { name: 'Slate', hex: '#4A5056' },
    { name: 'Olive', hex: '#474D3F' },
    { name: 'Taupe', hex: '#9E9282' },
  ];

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

  const handleClearFilters = () => {
    setSelectedCategory('all');
    setSelectedSizes([]);
    setSelectedColors([]);
    setPriceRange(5000);
    setSortBy('createdAt');
    setSortOrder('DESC');
  };

  const activeFilterCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedSizes.length +
    selectedColors.length +
    (priceRange < 5000 ? 1 : 0);

  // Shared Filter Controls markup
  const renderFilterControls = () => (
    <div className="space-y-8">
      {/* Category Filter */}
      <div className="space-y-3">
        <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-neutral-900">
          Category
        </h4>
        <div className="space-y-2 text-sm">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`block w-full text-left py-1 transition-colors ${
              selectedCategory === 'all'
                ? 'font-bold text-black'
                : 'text-neutral-600 hover:text-black'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`block w-full text-left py-1 transition-colors ${
                selectedCategory === cat.id
                  ? 'font-bold text-black'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-3 border-t border-neutral-200 pt-6">
        <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-neutral-900">
          Sizes
        </h4>
        <div className="flex flex-wrap gap-2">
          {availableSizes.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`min-w-10 h-10 px-3 text-xs sm:text-sm uppercase font-bold border transition-all ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-xs'
                    : 'bg-white text-neutral-800 border-neutral-300 hover:border-black'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-3 border-t border-neutral-200 pt-6">
        <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-neutral-900">
          Color
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {availableColors.map((col) => {
            const isSelected = selectedColors.includes(col.name);
            return (
              <button
                key={col.name}
                onClick={() => toggleColor(col.name)}
                title={col.name}
                className={`w-7 h-7 rounded-full border border-black/10 relative p-0.5 transition-all cursor-pointer ${
                  isSelected ? 'ring-2 ring-black ring-offset-2 scale-110' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: col.hex }}
              />
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="border-t border-neutral-200 pt-6">
        <RangeSlider
          min={1000}
          max={5000}
          step={250}
          value={priceRange}
          onChange={(val) => setPriceRange(val)}
          label="Max Price"
        />
      </div>

      {/* Reset Filters CTA */}
      {activeFilterCount > 0 && (
        <div className="border-t border-neutral-200 pt-6">
          <Button variant="outline" size="sm" fullWidth onClick={handleClearFilters}>
            Reset Filters ({activeFilterCount})
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="py-8 md:py-12 bg-white">
      <Container>
        {/* Top Title & Subtitle */}
        <div className="space-y-2 pb-6 border-b border-neutral-200">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 uppercase font-heading">
            {title}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-xl">
            {subtitle}
          </p>
        </div>

        {/* Toolbar: Filter Trigger, Sort Dropdown & Grid View Toggle */}
        <div className="py-4 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200">
          {/* Mobile Filter Toggle Button & Count */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-neutral-300 hover:border-black text-sm font-bold uppercase tracking-wider text-neutral-900 transition-colors cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>
            <span className="text-sm font-medium text-neutral-600">
              Showing <strong className="font-extrabold text-neutral-900">{filteredProducts.length}</strong> pieces
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Custom Luxury Sort Dropdown */}
            <div className="flex items-center gap-2.5">
              <span className="text-neutral-700 uppercase text-xs sm:text-sm font-bold tracking-wider hidden sm:inline select-none">
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
                triggerClassName="min-w-[200px] border-neutral-300 hover:border-black font-bold uppercase text-xs sm:text-sm tracking-wider py-2.5 bg-white shadow-2xs"
                menuClassName="w-[220px] shadow-2xl border-neutral-200"
              />
            </div>

            {/* Grid Toggle (Desktop) */}
            <div className="hidden sm:flex items-center gap-0.5 border border-neutral-200 bg-neutral-100 p-0.5">
              <button
                onClick={() => setGridColumns(3)}
                className={`p-1.5 transition-all ${
                  gridColumns === 3
                    ? 'bg-black text-white shadow-xs'
                    : 'text-neutral-500 hover:text-black hover:bg-neutral-200/50'
                }`}
                title="3 Columns"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridColumns(4)}
                className={`p-1.5 transition-all ${
                  gridColumns === 4
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
          <div className="py-3.5 flex flex-wrap items-center gap-2.5 border-b border-neutral-100">
            <span className="text-xs uppercase font-bold text-neutral-500 tracking-wider mr-1">
              Active Filters:
            </span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-900 text-xs sm:text-sm font-semibold">
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
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-900 text-xs sm:text-sm font-semibold"
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
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-neutral-100 border border-neutral-200 text-neutral-900 text-xs sm:text-sm font-semibold"
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

            {priceRange < 5000 && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-semibold">
                Max: ₹{priceRange.toLocaleString('en-IN')}
                <button
                  onClick={() => setPriceRange(5000)}
                  className="hover:text-black transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleClearFilters}
              className="text-[11px] font-semibold text-neutral-500 hover:text-black underline ml-2 transition-colors cursor-pointer"
            >
              Clear All
            </button>
          </div>
        )}

        {/* Main Content Area: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8">
          {/* Desktop Filter Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 pr-4">
            {renderFilterControls()}
          </aside>

          {/* Product Grid Area (9 cols on desktop, 12 on mobile) */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 && !isLoading ? (
              <EmptyState onAction={handleClearFilters} />
            ) : (
              <ProductGrid
                products={filteredProducts}
                isLoading={isLoading}
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
