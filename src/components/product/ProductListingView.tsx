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
import { MOCK_CATEGORIES } from '@/constants/mockData';
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
        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#171717]">
          Category
        </h4>
        <div className="space-y-1.5 text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`block w-full text-left py-1 transition-colors ${
              selectedCategory === 'all'
                ? 'font-bold text-[#171717]'
                : 'text-[#686868] hover:text-[#171717]'
            }`}
          >
            All Categories
          </button>
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`block w-full text-left py-1 transition-colors ${
                selectedCategory === cat.id
                  ? 'font-bold text-[#171717]'
                  : 'text-[#686868] hover:text-[#171717]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-3 border-t border-neutral-200 pt-6">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#171717]">
          Sizes
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {availableSizes.map((size) => {
            const isSelected = selectedSizes.includes(size);
            return (
              <button
                key={size}
                onClick={() => toggleSize(size)}
                className={`min-w-8 h-8 px-2 text-[11px] uppercase font-semibold border transition-all ${
                  isSelected
                    ? 'bg-[#171717] text-white border-[#171717] shadow-xs'
                    : 'bg-white text-[#171717] border-neutral-200 hover:border-black'
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
        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#171717]">
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
                className={`w-6 h-6 rounded-full border border-black/10 relative p-0.5 transition-all ${
                  isSelected ? 'ring-2 ring-[#171717] ring-offset-2 scale-110' : 'hover:scale-110'
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
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 uppercase">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-xl">
            {subtitle}
          </p>
        </div>

        {/* Toolbar: Filter Trigger, Sort Dropdown & Grid View Toggle */}
        <div className="py-4 flex flex-wrap items-center justify-between gap-4 border-b border-neutral-200">
          {/* Mobile Filter Toggle Button & Count */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3 py-2 bg-white border border-neutral-300 hover:border-black text-xs font-bold uppercase tracking-wider text-[#171717] transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>
            <span className="text-xs text-[#686868]">
              Showing <strong className="text-neutral-900">{filteredProducts.length}</strong> pieces
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Custom Luxury Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#686868] uppercase text-[11px] font-bold tracking-wider hidden sm:inline select-none">
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
                triggerClassName="min-w-[190px] border-neutral-300 hover:border-black font-bold uppercase text-[11px] tracking-wider py-2 bg-white shadow-2xs"
                menuClassName="w-[210px] shadow-2xl border-neutral-200"
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
                <Grid2X2 className="w-3.5 h-3.5" />
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
                <Grid3X3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active Filter Chips Bar */}
        {activeFilterCount > 0 && (
          <div className="py-3 flex flex-wrap items-center gap-2 border-b border-neutral-100">
            <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mr-1">
              Active Filters:
            </span>

            {selectedCategory !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-semibold">
                Category:{' '}
                {MOCK_CATEGORIES.find((c) => c.id === selectedCategory)?.name || selectedCategory}
                <button
                  onClick={() => setSelectedCategory('all')}
                  className="hover:text-black transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}

            {selectedSizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-semibold"
              >
                Size: {size}
                <button
                  onClick={() => toggleSize(size)}
                  className="hover:text-black transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            {selectedColors.map((col) => (
              <span
                key={col}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 border border-neutral-200 text-neutral-800 text-[11px] font-semibold"
              >
                Color: {col}
                <button
                  onClick={() => toggleColor(col)}
                  className="hover:text-black transition-colors"
                >
                  <X className="w-3 h-3" />
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
