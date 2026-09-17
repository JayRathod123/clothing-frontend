'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { X, ArrowRight, User, Search } from 'lucide-react';
import { useUI } from '@/context/UIContext';
import { MOCK_CATEGORIES, MOCK_COLLECTIONS } from '@/constants/mockData';

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

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-[#F7F6F2] transform transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform will-change-opacity ${
        visible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'
      }`}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-[#E6E3DD] bg-white">
        <Link
          href="/"
          onClick={onClose}
          className="text-sm font-bold tracking-[0.2em] text-[#171717] uppercase"
        >
          AURA STUDIO
        </Link>
        <button
          onClick={onClose}
          className="p-1 text-[#171717] hover:text-[#8A6A45] transition-colors cursor-pointer"
          aria-label="Close navigation menu"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Navigation Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-between">
        <div className="space-y-8">
          {/* Primary Editorial Links */}
          <nav className="space-y-4">
            <Link
              href="/shop"
              onClick={onClose}
              className="flex items-center justify-between text-2xl font-semibold tracking-tight text-[#171717] hover:text-[#8A6A45] transition-colors group"
            >
              <span>SHOP ALL</span>
              <ArrowRight className="w-5 h-5 text-[#929292] group-hover:text-[#171717] group-hover:translate-x-1 transition-all" />
            </Link>

            {MOCK_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                onClick={onClose}
                className="flex items-center justify-between text-2xl font-semibold tracking-tight text-[#171717] hover:text-[#8A6A45] transition-colors group"
              >
                <span>{cat.name.toUpperCase()}</span>
                <ArrowRight className="w-5 h-5 text-[#929292] group-hover:text-[#171717] group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </nav>

          {/* Curated Collections */}
          <div className="pt-6 border-t border-[#E6E3DD] space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#929292]">
              Curated Series
            </p>
            <div className="space-y-2">
              {MOCK_COLLECTIONS.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.slug}`}
                  onClick={onClose}
                  className="block text-xs font-medium text-[#686868] hover:text-[#171717] transition-colors"
                >
                  {col.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Utility Drawer */}
        <div className="pt-8 border-t border-[#E6E3DD] space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                onClose();
                openSearch();
              }}
              className="flex items-center justify-center gap-2 py-3 bg-white border border-[#E6E3DD] text-xs font-medium text-[#171717] uppercase tracking-wider cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search</span>
            </button>
            <button
              onClick={() => {
                onClose();
                openAuthModal();
              }}
              className="flex items-center justify-center gap-2 py-3 bg-white border border-[#E6E3DD] text-xs font-medium text-[#171717] uppercase tracking-wider cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>Account</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-[#929292]">
            <span>NEW DELHI • BANGALORE • MUMBAI</span>
            <span>SHIPS GLOBALLY</span>
          </div>
        </div>
      </div>
    </div>
  );
}
