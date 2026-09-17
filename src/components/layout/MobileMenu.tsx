'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ArrowRight, User, Search, Phone } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { BrandLogo } from '@/components/common/BrandLogo';
import { THEME } from '@/constants/theme';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
  const { openSearch, openAuthModal } = useUI();
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
      }, 450);
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

  const links = [
    { label: 'Home', href: '/' },
    { label: 'Shop All', href: '/shop' },
    { label: 'Oversized T-Shirts', href: '/shop?fit=oversized' },
    { label: 'Regular Fit T-Shirts', href: '/shop?fit=regular' },
    { label: 'Graphic T-Shirts', href: '/shop?category=graphic' },
    { label: 'Hoodie Collection', href: '/shop?category=hoodies' },
    { label: 'Blogs', href: '/blogs' },
    { label: 'Contact', href: '/contact' },
    { label: 'Returns Policy', href: '/faq#returns' },
  ];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-white transform transition-all duration-300 ease-out ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'
      }`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-white">
        <BrandLogo size="sm" />
        <button
          onClick={onClose}
          className="p-1 text-neutral-800 hover:text-black transition-colors cursor-pointer"
          aria-label="Close navigation menu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Navigation Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col justify-between">
        <div className="space-y-6">
          <nav className="divide-y divide-neutral-100">
            {links.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={onClose}
                className="flex items-center justify-between py-3.5 text-base font-bold tracking-tight text-neutral-900 hover:text-sky-600 transition-colors group"
              >
                <span>{link.label}</span>
                <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-black group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Utility & Support Phone */}
        <div className="pt-6 border-t border-neutral-200 space-y-4">
          <a
            href={`tel:${THEME.store.supportPhone}`}
            className="flex items-center justify-center gap-2 py-3 bg-neutral-100 rounded-xl text-xs font-bold text-neutral-900 hover:bg-neutral-200 transition-colors"
          >
            <Phone className="w-4 h-4 text-neutral-700" />
            <span>Support: {THEME.store.supportPhone}</span>
          </a>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onClose();
                openSearch();
              }}
              className="flex items-center justify-center gap-2 py-2.5 bg-neutral-100 rounded-lg text-xs font-semibold text-neutral-800"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
            <button
              onClick={() => {
                onClose();
                openAuthModal();
              }}
              className="flex items-center justify-center gap-2 py-2.5 bg-neutral-100 rounded-lg text-xs font-semibold text-neutral-800"
            >
              <User className="w-3.5 h-3.5" />
              <span>Account</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-neutral-400">
            © {new Date().getFullYear()} {THEME.store.name} • {THEME.store.tagline}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MobileMenu;
