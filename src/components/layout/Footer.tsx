'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { useUI } from '@/context/UIContext';
import { ArrowRight } from 'lucide-react';

export function Footer() {
  const [email, setEmail] = useState('');
  const { showToast } = useUI();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    showToast('Thank you for subscribing to our private list.');
    setEmail('');
  };

  return (
    <footer className="bg-white border-t border-[#E6E3DD] pt-16 pb-12 text-[#171717]">
      <Container>
        {/* Main Grid Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-14 border-b border-[#E6E3DD]">
          {/* Col 1: Shop */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#171717]">
              Shop
            </h4>
            <ul className="space-y-2.5 text-xs text-[#686868]">
              <li>
                <Link href="/shop" className="hover:text-[#171717] transition-colors">
                  All Pieces
                </Link>
              </li>
              <li>
                <Link href="/category/outerwear" className="hover:text-[#171717] transition-colors">
                  Minimal Outerwear
                </Link>
              </li>
              <li>
                <Link href="/category/t-shirts" className="hover:text-[#171717] transition-colors">
                  240 GSM T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/category/shirts" className="hover:text-[#171717] transition-colors">
                  Boxy Overshirts
                </Link>
              </li>
              <li>
                <Link href="/category/bottoms" className="hover:text-[#171717] transition-colors">
                  Tailored Bottoms
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 2: Help */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#171717]">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-xs text-[#686868]">
              <li>
                <Link href="/shop" className="hover:text-[#171717] transition-colors">
                  Shipping & Logistics
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#171717] transition-colors">
                  Doorstep Returns (7 Days)
                </Link>
              </li>
              <li>
                <Link href="/shop" className="hover:text-[#171717] transition-colors">
                  International Duties
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-[#171717] transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <a href="mailto:concierge@aurastudio.in" className="hover:text-[#171717] transition-colors">
                  Concierge Service
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: About */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#171717]">
              Atelier
            </h4>
            <ul className="space-y-2.5 text-xs text-[#686868]">
              <li>
                <span className="hover:text-[#171717] transition-colors cursor-pointer">
                  The Design Philosophy
                </span>
              </li>
              <li>
                <span className="hover:text-[#171717] transition-colors cursor-pointer">
                  Heavyweight Fabrics & GSM
                </span>
              </li>
              <li>
                <span className="hover:text-[#171717] transition-colors cursor-pointer">
                  Studio Archive Journal
                </span>
              </li>
              <li>
                <span className="hover:text-[#171717] transition-colors cursor-pointer">
                  Sustainable Small Batches
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: Social */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#171717]">
              Community
            </h4>
            <ul className="space-y-2.5 text-xs text-[#686868]">
              <li>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#171717] transition-colors">
                  Instagram @aurastudio
                </a>
              </li>
              <li>
                <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-[#171717] transition-colors">
                  Pinterest Moodboards
                </a>
              </li>
              <li>
                <a href="https://x.com" target="_blank" rel="noreferrer" className="hover:text-[#171717] transition-colors">
                  X / Editorial Drops
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="space-y-4 lg:col-span-1">
            <h4 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#171717]">
              Join The List
            </h4>
            <p className="text-xs text-[#686868] leading-relaxed">
              Receive private preview access to limited series, seasonal drops, and studio journals.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full bg-[#F7F6F2] border border-[#E6E3DD] px-3.5 py-2.5 pr-10 text-xs focus:border-[#171717] focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-2.5 text-[#171717] hover:text-[#8A6A45] transition-colors flex items-center justify-center"
                  aria-label="Subscribe"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-[#929292]">
                Zero spam. Only intentional releases.
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#929292]">
          <p>© 2026 AURA STUDIO INC. ALL RIGHTS RESERVED.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#171717] cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-[#171717] cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-[#171717] cursor-pointer transition-colors">Refund Policy</span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
