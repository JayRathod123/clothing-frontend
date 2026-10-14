'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ArrowRight, User, Search, Phone, ChevronRight } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { THEME } from '@/constants/theme';
import { useCategories } from '@/hooks/useCategories';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { openSearch, openAuthModal } = useUI();
  const { data: categories = [] } = useCategories();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
      document.body.style.overflow = 'hidden';
      return () => cancelAnimationFrame(frame);
    } else {
      setVisible(false);
      const timer = setTimeout(() => {
        setMounted(false);
      }, 350);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Dimmed Backdrop Overlay (Click to dismiss on tablet/mobile) */}
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide-in Drawer Container */}
      <div
        className={`relative w-full max-w-sm sm:max-w-md bg-white h-full shadow-2xl flex flex-col z-10 transform transition-transform duration-300 ease-out ${visible ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-neutral-200 bg-white">
          <BrandLogo size="sm" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-800 hover:text-black transition-colors cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Main Navigation Content */}
        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col justify-between scrollbar-none">
          <div className="space-y-6">
            {/* Primary Navigation */}
            <nav className="divide-y divide-neutral-100">
              <Link
                href="/"
                onClick={onClose}
                className="flex items-center justify-between py-3 text-sm sm:text-base font-bold text-neutral-900 hover:text-sky-600 transition-colors"
              >
                <span>Home</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>

              <Link
                href="/shop"
                onClick={onClose}
                className="flex items-center justify-between py-3 text-sm sm:text-base font-bold text-neutral-900 hover:text-sky-600 transition-colors"
              >
                <span>Shop All</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>

              {/* Dynamic Categories derived from live API */}
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/shop?categoryId=${cat.id}`}
                    onClick={onClose}
                    className="flex items-center justify-between py-3 text-sm sm:text-base font-semibold text-neutral-800 hover:text-sky-600 transition-colors capitalize"
                  >
                    <span>{cat.name}</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                ))
              ) : (
                <>
                  <Link
                    href="/shop?fit=oversized"
                    onClick={onClose}
                    className="flex items-center justify-between py-3 text-sm sm:text-base font-semibold text-neutral-800 hover:text-sky-600 transition-colors"
                  >
                    <span>Oversized T-Shirts</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                  <Link
                    href="/shop?fit=regular"
                    onClick={onClose}
                    className="flex items-center justify-between py-3 text-sm sm:text-base font-semibold text-neutral-800 hover:text-sky-600 transition-colors"
                  >
                    <span>Regular Fit T-Shirts</span>
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </Link>
                </>
              )}

              <Link
                href="/blogs"
                onClick={onClose}
                className="flex items-center justify-between py-3 text-sm sm:text-base font-semibold text-neutral-800 hover:text-sky-600 transition-colors"
              >
                <span>Stories & Blogs</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>

              <Link
                href="/contact"
                onClick={onClose}
                className="flex items-center justify-between py-3 text-sm sm:text-base font-semibold text-neutral-800 hover:text-sky-600 transition-colors"
              >
                <span>Contact Us</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>

              <Link
                href="/faq#returns"
                onClick={onClose}
                className="flex items-center justify-between py-3 text-sm sm:text-base font-semibold text-neutral-800 hover:text-sky-600 transition-colors"
              >
                <span>Damage Returns Policy</span>
                <ChevronRight className="w-4 h-4 text-neutral-400" />
              </Link>
            </nav>
          </div>

          {/* Bottom Utility & Quick Links */}
          <div className="pt-6 mt-6 border-t border-neutral-200 space-y-3.5">
            <a
              href={`tel:${THEME.store.supportPhone}`}
              className="flex items-center justify-center gap-2 py-2.5 bg-neutral-100 rounded-xl text-xs font-bold text-neutral-900 hover:bg-neutral-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-neutral-700" />
              <span>Support: {THEME.store.supportPhone}</span>
            </a>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  openSearch();
                }}
                className="flex items-center justify-center gap-2 py-2.5 bg-neutral-100 rounded-xl text-xs font-bold text-neutral-800 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  openAuthModal();
                }}
                className="flex items-center justify-center gap-2 py-2.5 bg-neutral-100 rounded-xl text-xs font-bold text-neutral-800 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                <User className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-[11px] text-center text-neutral-400 pt-1">
              © {new Date().getFullYear()} {THEME.store.name} • All rights reserved
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
