'use client';

import React, { useState, useMemo } from 'react';
import { Container } from '@/components/layout/Container';
import { ProductGrid } from './ProductGrid';
import { EmptyState } from '@/components/common/EmptyState';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { useProducts } from '@/hooks/useProducts';
import { MOCK_CATEGORIES } from '@/constants/mockData';
import { SlidersHorizontal, Grid3X3, Grid2X2, Check, X } from 'lucide-react';

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

  const allProducts = data?.items || [];

  // Client-side multi-tag filter refinement (size & color)
  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
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
  }, [allProducts, selectedSizes, selectedColors]);

  const availableSizes = ['S', 'M', 'L', 'XL', '30', '32', '34'];
  const availableColors = [
    { name: 'Black', hex: '#171717' },
    { name: 'White', hex: '#EAE6DF' },
    { name: 'Slate', hex: '#4A5056' },
    { name: 'Olive', hex: '#474D3F' },
    { name: 'Taupe', hex: '#9E9282' },
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
  const FilterControls = () => (
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
                ? 'font-semibold text-[#171717]'
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
                  ? 'font-semibold text-[#171717]'
                  : 'text-[#686868] hover:text-[#171717]'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div className="space-y-3 border-t border-[#E6E3DD] pt-6">
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
                className={`min-w-8 h-8 px-2 text-[11px] uppercase font-medium border transition-colors ${
                  isSelected
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-white text-[#171717] border-[#E6E3DD] hover:border-[#171717]'
                }`}
              >
                {size}
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Filter */}
      <div className="space-y-3 border-t border-[#E6E3DD] pt-6">
        <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#171717]">
          Colors
        </h4>
        <div className="flex flex-wrap gap-2">
          {availableColors.map((col) => {
            const isSelected = selectedColors.includes(col.name);
            return (
              <button
                key={col.name}
                onClick={() => toggleColor(col.name)}
                title={col.name}
                className={`w-6 h-6 rounded-full border border-black/10 relative p-0.5 transition-all ${
                  isSelected ? 'ring-2 ring-[#171717] ring-offset-2' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: col.hex }}
              />
            );
          })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="space-y-3 border-t border-[#E6E3DD] pt-6">
        <div className="flex items-center justify-between text-[11px] uppercase font-bold tracking-wider text-[#171717]">
          <span>Max Price</span>
          <span>₹{priceRange.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min={1000}
          max={5000}
          step={250}
          value={priceRange}
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full accent-[#171717] cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-[#929292]">
          <span>₹1,000</span>
          <span>₹5,000</span>
        </div>
      </div>

      {/* Reset Filters CTA */}
      {activeFilterCount > 0 && (
        <div className="border-t border-[#E6E3DD] pt-6">
          <Button variant="outline" size="sm" fullWidth onClick={handleClearFilters}>
            Reset Filters ({activeFilterCount})
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <div className="py-12 md:py-16 bg-[#F7F6F2]">
      <Container>
        {/* Editorial Top Title & Subtitle */}
        <div className="space-y-3 pb-8 border-b border-[#E6E3DD]">
          <span className="editorial-kicker text-[#8A6A45]">
            COLLECTION DIRECTORY
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#171717] uppercase">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-[#686868] max-w-xl">
            {subtitle}
          </p>
        </div>

        {/* Toolbar: Filter Trigger, Sort Dropdown & Grid View Toggle */}
        <div className="py-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#E6E3DD]">
          {/* Mobile Filter Toggle Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsFilterDrawerOpen(true)}
              className="lg:hidden inline-flex items-center gap-2 px-3 py-2 bg-white border border-[#E6E3DD] text-xs font-semibold uppercase tracking-wider text-[#171717]"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
            </button>
            <span className="text-xs text-[#686868]">
              Showing <strong>{filteredProducts.length}</strong> pieces
            </span>
          </div>

          <div className="flex items-center gap-4 ml-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-[#686868] uppercase text-[10px] tracking-wider hidden sm:inline">
                Sort By:
              </span>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-') as [any, any];
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="bg-white border border-[#E6E3DD] px-3 py-1.5 text-xs font-medium text-[#171717] focus:outline-none uppercase tracking-wider"
              >
                <option value="createdAt-DESC">Newest Arrivals</option>
                <option value="price-ASC">Price: Low to High</option>
                <option value="price-DESC">Price: High to Low</option>
                <option value="name-ASC">Alphabetical: A-Z</option>
              </select>
            </div>

            {/* Grid Toggle (Desktop) */}
            <div className="hidden sm:flex items-center gap-1 border border-[#E6E3DD] bg-white p-0.5">
              <button
                onClick={() => setGridColumns(3)}
                className={`p-1 transition-colors ${
                  gridColumns === 3 ? 'bg-[#171717] text-white' : 'text-[#686868]'
                }`}
                title="3 Columns"
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setGridColumns(4)}
                className={`p-1 transition-colors ${
                  gridColumns === 4 ? 'bg-[#171717] text-white' : 'text-[#686868]'
                }`}
                title="4 Columns"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-10">
          {/* Desktop Filter Sidebar (3 cols) */}
          <aside className="hidden lg:block lg:col-span-3 pr-4">
            <FilterControls />
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
          <FilterControls />
          <div className="pt-4 border-t border-[#E6E3DD]">
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
