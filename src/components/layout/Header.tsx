'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Container } from './Container';
import { MobileMenu } from './MobileMenu';
import { BrandLogo } from '@/components/common/BrandLogo';
import { useUI } from '@/context/UIContext';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useCategories } from '@/hooks/useCategories';
import { THEME } from '@/constants/theme';
import { formatPrice } from '@/utils/formatters';
import {
  Phone,
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  ChevronDown,
  X,
} from 'lucide-react';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const showSearchBar = pathname === '/' || pathname === '/shop';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const navRef = React.useRef<HTMLElement>(null);

  const { openCart, openSearch, openAuthModal } = useUI();
  const { user } = useAuth();
  const { data: cart } = useCart();
  const { totalItems: wishlistCount } = useWishlist();

  const totalCartCount = cart?.totalQuantity ?? 0;
  const cartSubtotal = cart?.subtotal ?? 0;

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (dropdownTimeoutRef.current) {
        clearTimeout(dropdownTimeoutRef.current);
      }
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
  }, [pathname]);

  const handleDropdownEnter = (name: string) => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
      dropdownTimeoutRef.current = null;
    }
    setActiveDropdown(name);
  };

  const handleDropdownLeave = () => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 250);
  };



  const { data: dynamicCategories = [] } = useCategories();

  const categories = dynamicCategories.length > 0
    ? dynamicCategories.map((cat) => ({
      label: cat.name,
      href: `/shop?categoryId=${cat.id}`,
    }))
    : [
      { label: 'Men T-Shirt', href: '/shop' },
    ];

  const policies = [
    { label: 'Shipping Policy', href: '/faq#shipping' },
    { label: 'Return & Refund Policy', href: '/faq#returns' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ];

  return (
    <>
      <header className="w-full sticky top-0 z-40 bg-white shadow-md">
        {/* TOP UTILITY & BRAND TIER (White) */}
        <div className="border-b border-neutral-200 py-3 md:py-4">
          <Container>
            <div className="flex items-center justify-between gap-4">
              {/* Mobile hamburger & Brand Logo */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="lg:hidden p-1.5 text-black hover:text-neutral-600 transition-colors"
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>

                <BrandLogo size="md" />
              </div>

              {/* Support Phone widget (Desktop) */}
              <div className="hidden xl:flex items-center gap-2.5 text-neutral-800">
                <div className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-700">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="text-left leading-tight">
                  <span className="text-neutral-500 block text-xs font-medium">Get Support</span>
                  <a
                    href={`tel:${THEME.store.supportPhone}`}
                    className="font-extrabold text-sm text-neutral-900 hover:text-sky-600 transition-colors"
                  >
                    {THEME.store.supportPhone}
                  </a>
                </div>
              </div>

              {/* Central Pill Search Bar (Desktop) */}
              {showSearchBar && (
                <Suspense fallback={<HeaderSearchBarFallback />}>
                  <HeaderSearchBar />
                </Suspense>
              )}

              {/* Right Side: Account, Wishlist & Cart */}
              <div className="flex items-center gap-2 sm:gap-4 text-neutral-800">
                {/* Mobile Search button */}
                {showSearchBar && (
                  <button
                    type="button"
                    onClick={openSearch}
                    className="md:hidden p-1.5 text-neutral-800 hover:text-black transition-colors"
                    aria-label="Search"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                )}

                {/* Account / Login Trigger */}
                {user ? (
                  <Link
                    href="/account"
                    className="flex items-center gap-1.5 p-1.5 text-sm font-semibold text-neutral-800 hover:text-black transition-colors"
                    aria-label="Account"
                  >
                    <User className="w-5 h-5" />
                    {/* <span className="hidden lg:inline text-sm font-medium">
                      {user.firstName || 'Account'}
                    </span> */}
                  </Link>
                ) : (
                  <button
                    type="button"
                    onClick={openAuthModal}
                    className="flex items-center gap-1.5 p-1.5 text-sm font-semibold text-neutral-800 hover:text-black transition-colors cursor-pointer"
                    aria-label="Login"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden lg:inline text-sm font-medium">Login</span>
                  </button>
                )}

                {/* Wishlist */}
                <Link
                  href="/wishlist"
                  className="relative hidden sm:flex p-1.5 text-neutral-800 hover:text-black transition-colors"
                  aria-label="Wishlist"
                >
                  <Heart className="w-5 h-5" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-sky-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                {/* Cart Trigger with InkStyles 'Your Cart / Rs. 0.00' style */}
                <button
                  type="button"
                  onClick={openCart}
                  className="flex items-center gap-2.5 p-1 text-left group"
                  aria-label="Shopping Cart"
                >
                  <div className="relative">
                    <div className="w-9 h-9 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-900 group-hover:border-black transition-colors">
                      <ShoppingBag className="w-4 h-4" />
                    </div>
                    {totalCartCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-black text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                        {totalCartCount}
                      </span>
                    )}
                  </div>
                  <div className="hidden lg:block leading-tight">
                    <span className="text-neutral-500 block text-xs font-medium">Your Cart</span>
                    <span className="font-extrabold text-sm text-neutral-900 group-hover:text-black transition-colors">
                      {formatPrice(cartSubtotal)}
                    </span>
                  </div>
                </button>
              </div>
            </div>
          </Container>
        </div>

        {/* BOTTOM SOLID BLACK NAVIGATION TIER (Desktop) */}
        <nav ref={navRef} className="hidden lg:block bg-black text-white">
          <Container>
            <ul className="flex items-center justify-center gap-8 py-3.5 text-sm font-bold uppercase tracking-wider">
              <li>
                <Link
                  href="/"
                  className={`hover:text-sky-400 transition-colors ${pathname === '/' ? 'text-sky-400' : 'text-white'
                    }`}
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/shop"
                  className={`hover:text-sky-400 transition-colors ${pathname === '/shop' ? 'text-sky-400' : 'text-white'
                    }`}
                >
                  Shop All
                </Link>
              </li>

              {/* Category Dropdown with Hover Bridge & Grace Period */}
              <li
                className="relative"
                onMouseEnter={() => handleDropdownEnter('category')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown((prev) => (prev === 'category' ? null : 'category'))
                  }
                  className={`flex items-center gap-1 uppercase transition-colors select-none cursor-pointer ${activeDropdown === 'category' ? 'text-sky-400' : 'text-white hover:text-sky-400'
                    }`}
                >
                  <span>Category</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'category' ? 'rotate-180 text-sky-400' : ''
                      }`}
                  />
                </button>

                {activeDropdown === 'category' && (
                  <div
                    className="absolute top-full left-0 pt-2 z-50 min-w-[240px]"
                    onMouseEnter={() => handleDropdownEnter('category')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <div className="bg-white text-neutral-900 shadow-2xl border border-neutral-200/90 py-2 rounded-xs animate-in fade-in-0 zoom-in-95 duration-150">
                      {categories.map((cat) => (
                        <Link
                          key={cat.label}
                          href={cat.href}
                          onClick={() => setActiveDropdown(null)}
                          className="block px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 hover:text-black transition-colors normal-case"
                        >
                          {cat.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>

              <li>
                <Link
                  href="/blogs"
                  className={`hover:text-sky-400 transition-colors ${pathname.startsWith('/blogs') ? 'text-sky-400' : 'text-white'
                    }`}
                >
                  Blogs
                </Link>
              </li>

              {/* Policy Dropdown with Hover Bridge & Grace Period */}
              <li
                className="relative"
                onMouseEnter={() => handleDropdownEnter('policy')}
                onMouseLeave={handleDropdownLeave}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveDropdown((prev) => (prev === 'policy' ? null : 'policy'))
                  }
                  className={`flex items-center gap-1 uppercase transition-colors select-none cursor-pointer ${activeDropdown === 'policy' ? 'text-sky-400' : 'text-white hover:text-sky-400'
                    }`}
                >
                  <span>Policy</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${activeDropdown === 'policy' ? 'rotate-180 text-sky-400' : ''
                      }`}
                  />
                </button>

                {activeDropdown === 'policy' && (
                  <div
                    className="absolute top-full left-0 pt-2 z-50 min-w-[240px]"
                    onMouseEnter={() => handleDropdownEnter('policy')}
                    onMouseLeave={handleDropdownLeave}
                  >
                    <div className="bg-white text-neutral-900 shadow-2xl border border-neutral-200/90 py-2 rounded-xs animate-in fade-in-0 zoom-in-95 duration-150">
                      {policies.map((pol) => (
                        <Link
                          key={pol.label}
                          href={pol.href}
                          onClick={() => setActiveDropdown(null)}
                          className="block px-4 py-2.5 text-sm font-semibold text-neutral-800 hover:bg-neutral-100 hover:text-black transition-colors normal-case"
                        >
                          {pol.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>

              <li>
                <Link
                  href="/contact"
                  className={`hover:text-sky-400 transition-colors ${pathname === '/contact' ? 'text-sky-400' : 'text-white'
                    }`}
                >
                  Contact
                </Link>
              </li>

              <li>
                <Link
                  href="/faq#returns"
                  className="hover:text-sky-400 transition-colors text-white"
                >
                  Returns
                </Link>
              </li>
            </ul>
          </Container>
        </nav>
      </header>

      {/* Mobile Navigation Drawer */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  );
}

function HeaderSearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const q = searchParams.get('search') || searchParams.get('q') || '';
    setQuery(q);
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed) {
      router.push(`/shop?search=${encodeURIComponent(trimmed)}`);
    } else {
      router.push('/shop');
    }
  };

  const handleClear = () => {
    setQuery('');
    router.push('/shop');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="hidden md:flex items-center flex-1 max-w-md mx-4 relative"
    >
      <input
        type="text"
        placeholder="Search our store"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full bg-[#FAFAFA] border border-neutral-300 rounded-full py-2.5 pl-4 pr-16 text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-black transition-colors"
      />
      {query && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-9 top-1 bottom-1 px-1.5 text-neutral-400 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
          title="Clear search"
          aria-label="Clear search"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
      <button
        type="submit"
        aria-label="Submit search"
        className="absolute right-1 top-1 bottom-1 px-3 text-neutral-600 hover:text-black flex items-center justify-center transition-colors cursor-pointer"
      >
        <Search className="w-4 h-4" />
      </button>
    </form>
  );
}

function HeaderSearchBarFallback() {
  return (
    <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative">
      <input
        type="text"
        placeholder="Search our store"
        disabled
        className="w-full bg-[#FAFAFA] border border-neutral-300 rounded-full py-2.5 pl-4 pr-11 text-sm text-neutral-900 placeholder:text-neutral-400"
      />
      <div className="absolute right-1 top-1 bottom-1 px-3 text-neutral-400 flex items-center justify-center">
        <Search className="w-4 h-4" />
      </div>
    </div>
  );
}

export default Header;
