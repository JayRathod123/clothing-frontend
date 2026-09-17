'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUI } from '@/context/UIContext';
import { useSearch } from '@/hooks/useSearch';
import { useCategories } from '@/hooks/useCategories';
import { useCollections } from '@/hooks/useCollections';
import { formatPrice } from '@/utils/formatters';
import { Search, X, ArrowRight } from 'lucide-react';

export function SearchOverlay() {
  const { isSearchOpen, closeSearch } = useUI();
  const { searchTerm, setSearchTerm, results, isLoading, total } = useSearch('');
  const { data: categories = [] } = useCategories();
  const { data: collections = [] } = useCollections();
  const inputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isSearchOpen) {
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
      // Softly focus input after the smooth slide begins to avoid initial layout jump
      const focusTimer = setTimeout(() => {
        inputRef.current?.focus();
      }, 180);
      document.body.style.overflow = 'hidden';
      return () => {
        cancelAnimationFrame(frame);
        clearTimeout(focusTimer);
      };
    } else {
      setVisible(false);
      // Unmount after smooth 480ms exit transition
      const timer = setTimeout(() => {
        setMounted(false);
        setSearchTerm('');
      }, 480);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isSearchOpen, setSearchTerm]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) {
        closeSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, closeSearch]);

  if (!mounted) return null;

  const popularSearches = [
    'Heavyweight Tee',
    'Overshirt',
    'Pleated Trouser',
    'French Terry Hoodie',
    '240 GSM',
    'Camp Collar',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimming Backdrop with Graceful 500ms Fade */}
      <div
        className={`fixed inset-0 bg-black/45 backdrop-blur-xs transition-opacity duration-500 ease-out will-change-opacity ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={closeSearch}
        aria-hidden="true"
      />

      {/* Slide-Down Search Panel with Gentle 500ms Luxury Deceleration */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-[#F7F6F2] border-b border-[#E6E3DD] shadow-[-0_10px_40px_rgba(0,0,0,0.12)] flex flex-col max-h-[92vh] sm:max-h-[85vh] transform transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform ${
          visible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Top Search Input Bar */}
        <div className="border-b border-[#E6E3DD] bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 flex items-center gap-4">
            <Search className="w-5 h-5 text-[#929292] shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder="SEARCH PRODUCTS, FABRICS, SILHOUETTES..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 text-base sm:text-lg font-medium tracking-tight bg-transparent text-[#171717] placeholder:text-[#929292] focus:outline-none uppercase"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="text-xs uppercase tracking-widest text-[#929292] hover:text-[#171717] p-1 cursor-pointer transition-colors"
              >
                Clear
              </button>
            )}
            <button
              onClick={closeSearch}
              className="p-1 text-[#171717] hover:text-[#8A6A45] transition-colors cursor-pointer"
              aria-label="Close search"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search Body Content */}
        <div className="flex-1 overflow-y-auto max-w-4xl w-full mx-auto px-4 sm:px-6 py-8">
          {searchTerm.trim().length >= 2 ? (
            /* Live Results */
            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm text-neutral-600 border-b border-[#E6E3DD] pb-3">
                <span>
                  {isLoading ? 'Searching...' : `Found ${total} pieces for "${searchTerm}"`}
                </span>
                <Link
                  href={`/shop?search=${encodeURIComponent(searchTerm)}`}
                  onClick={closeSearch}
                  className="text-xs font-bold tracking-wider uppercase text-neutral-900 hover:text-sky-600 transition-colors"
                >
                  View all in shop →
                </Link>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {results.map((product) => (
                    <Link
                      key={product.id}
                      href={`/product/${product.slug}`}
                      onClick={closeSearch}
                      className="group flex items-center gap-3.5 bg-white p-3 border border-neutral-200 hover:border-black transition-all shadow-2xs"
                    >
                      <div className="relative w-16 h-20 bg-[#EFEEE9] shrink-0 overflow-hidden">
                        {product.primaryImage ? (
                          <Image
                            src={product.primaryImage}
                            alt={product.name}
                            fill
                            sizes="70px"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : null}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                          {product.categoryName || 'Garment'}
                        </p>
                        <h4 className="text-sm font-bold text-neutral-900 group-hover:text-sky-600 transition-colors truncate">
                          {product.name}
                        </h4>
                        <p className="text-sm font-extrabold text-neutral-900 mt-1">
                          {formatPrice(product.discountPrice || product.basePrice)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center space-y-2">
                  <p className="text-base font-bold text-neutral-900">No pieces found</p>
                  <p className="text-sm text-neutral-500">
                    Try searching for keywords like "tee", "cotton", "overshirt", or "trouser".
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Default Suggestions, Categories & Collections */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Popular Searches */}
              <div className="space-y-4">
                <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-neutral-900">
                  Trending Searches
                </h4>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchTerm(term)}
                      className="text-xs sm:text-sm font-medium px-3.5 py-2 bg-white border border-neutral-300 text-neutral-900 hover:border-black hover:bg-black hover:text-white transition-all cursor-pointer"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Categories */}
              {categories.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-neutral-900">
                    Categories
                  </h4>
                  <div className="space-y-2.5 text-sm">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        onClick={closeSearch}
                        className="flex items-center justify-between py-1.5 text-neutral-800 hover:text-black font-medium transition-colors border-b border-neutral-200/50"
                      >
                        <span>{cat.name}</span>
                        <ArrowRight className="w-4 h-4 text-neutral-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Featured Series */}
              {collections.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-neutral-900">
                    Curated Series
                  </h4>
                  <div className="space-y-2.5 text-sm">
                    {collections.map((col) => (
                      <Link
                        key={col.id}
                        href={`/collections/${col.slug}`}
                        onClick={closeSearch}
                        className="flex items-center justify-between py-1.5 text-neutral-800 hover:text-black font-medium transition-colors border-b border-neutral-200/50"
                      >
                        <span>{col.name}</span>
                        <ArrowRight className="w-4 h-4 text-neutral-400" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
