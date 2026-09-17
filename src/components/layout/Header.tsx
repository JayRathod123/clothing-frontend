'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from './Container';
import { MobileMenu } from './MobileMenu';
import { useUI } from '@/context/UIContext';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { Search, ShoppingBag, Heart, User, Menu } from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { openCart, openSearch, openAuthModal } = useUI();
  const { data: cart } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  const totalCartCount = cart?.totalQuantity ?? 0;
  const isHomepage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-colors duration-200 border-b py-3.5 sm:py-4 ${
          isScrolled
            ? 'bg-[#F7F6F2]/95 backdrop-blur-md border-[#E6E3DD] shadow-xs'
            : isHomepage
            ? 'bg-[#F7F6F2]/90 backdrop-blur-xs border-[#E6E3DD]/60'
            : 'bg-[#F7F6F2] border-[#E6E3DD]'
        }`}
      >
        <Container>
          <div className="flex items-center justify-between">
            {/* Left: Mobile Menu Trigger / Desktop Nav */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-1 text-[#171717] hover:text-[#8A6A45] transition-colors"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              {/* Desktop Navigation Links */}
              <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-widest font-medium text-[#171717]">
                <Link
                  href="/shop"
                  className="hover:text-[#8A6A45] transition-colors relative py-1"
                >
                  Shop All
                </Link>
                <Link
                  href="/category/t-shirts"
                  className="hover:text-[#8A6A45] transition-colors relative py-1"
                >
                  T-Shirts
                </Link>
                <Link
                  href="/category/shirts"
                  className="hover:text-[#8A6A45] transition-colors relative py-1"
                >
                  Shirts
                </Link>
                <Link
                  href="/category/bottoms"
                  className="hover:text-[#8A6A45] transition-colors relative py-1"
                >
                  Bottoms
                </Link>
                <Link
                  href="/category/outerwear"
                  className="hover:text-[#8A6A45] transition-colors relative py-1"
                >
                  Outerwear
                </Link>
              </nav>
            </div>

            {/* Center: Brand Logo */}
            <div className="text-center">
              <Link
                href="/"
                className="text-base sm:text-lg font-extrabold tracking-[0.25em] text-[#171717] uppercase select-none inline-block hover:opacity-85 transition-opacity"
              >
                AURA STUDIO
              </Link>
            </div>

            {/* Right: Quick Action Icons */}
            <div className="flex items-center gap-4 sm:gap-5 text-[#171717]">
              {/* Search Toggle */}
              <button
                type="button"
                onClick={openSearch}
                className="p-1 hover:text-[#8A6A45] transition-colors focus:outline-none"
                aria-label="Search catalog"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                className="relative p-1 hover:text-[#8A6A45] transition-colors hidden sm:block focus:outline-none"
                aria-label="View Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {wishlistCount > 0 ? (
                  <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-[#8A6A45] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                ) : null}
              </Link>

              {/* Account Trigger */}
              <button
                type="button"
                onClick={openAuthModal}
                className="p-1 hover:text-[#8A6A45] transition-colors hidden sm:block focus:outline-none"
                aria-label="Customer account"
              >
                <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              {/* Cart Drawer Trigger */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-1 hover:text-[#8A6A45] transition-colors focus:outline-none"
                aria-label="Open shopping bag"
              >
                <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                {totalCartCount > 0 ? (
                  <span className="absolute -top-1 -right-1.5 min-w-4 h-4 px-1 bg-[#171717] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                ) : null}
              </button>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile Drawer Navigation */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}
