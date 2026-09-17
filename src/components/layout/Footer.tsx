'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { THEME } from '@/constants/theme';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setTimeout(() => {
        setIsSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <footer className="w-full bg-black text-white pt-16 pb-10 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8 mb-12">
          {/* COLUMN 1: About Us */}
          <div className="space-y-4">
            <h4 className="text-lg font-black text-white tracking-tight font-heading">
              About Us.
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed font-normal">
              Inkstyles is your premier destination for custom streetwear, heavyweight oversized t-shirts, and unique graphic designs. We specialize in providing both oversized and regular fit unisex tees engineered for supreme comfort and enduring style.
            </p>

            {/* Social Media Icons */}
            <div className="flex items-center gap-3 pt-2 text-neutral-400">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center hover:text-white hover:border-white transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center hover:text-white hover:border-white transition-colors"
                aria-label="Pinterest"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center hover:text-white hover:border-white transition-colors"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center hover:text-white hover:border-white transition-colors"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full border border-neutral-800 flex items-center justify-center hover:text-white hover:border-white transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* COLUMN 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-black text-white tracking-tight font-heading">
              Quick Link
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-300 font-medium">
              <li>
                <Link href="/search" className="hover:text-white transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/about#privacy" className="hover:text-white transition-colors">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/faq#shipping" className="hover:text-white transition-colors">
                  Shipping policy
                </Link>
              </li>
              <li>
                <Link href="/faq#returns" className="hover:text-white transition-colors">
                  Return &amp; Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/about#terms" className="hover:text-white transition-colors">
                  Terms of service
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-white transition-colors">
                  My Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-black text-white tracking-tight font-heading">
              Information
            </h4>
            <ul className="space-y-2.5 text-sm text-neutral-300 font-medium">
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="hover:text-white transition-colors">
                  Blogs
                </Link>
              </li>
              <li>
                <Link href="/size-chart" className="hover:text-white transition-colors">
                  Size Chart
                </Link>
              </li>
              <li>
                <Link href="/account/orders" className="hover:text-white transition-colors">
                  Where&apos;s My Order?
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: Newsletter & We Accept */}
          <div className="space-y-4">
            <h4 className="text-lg font-black text-white tracking-tight font-heading">
              Newsletter
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed font-normal">
              Subscribe to our weekly Newsletter and receive updates via email.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2.5">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="bg-white text-black px-4 py-3 text-sm rounded-sm focus:outline-none flex-1 placeholder:text-neutral-500 font-medium"
                />
                <button
                  type="submit"
                  className="bg-neutral-800 text-white font-extrabold text-sm px-5 py-3 rounded-sm hover:bg-neutral-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {isSubscribed ? 'Subscribed!' : 'Get 20% off'}
                </button>
              </div>
            </form>

            <div className="pt-4 space-y-2">
              <h5 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider">
                We Accept
              </h5>
              <div className="flex items-center gap-2 flex-wrap">
                {/* Amazon Pay Badge */}
                <span className="bg-white text-black text-xs font-black px-3 py-1 rounded-sm">
                  amazon pay
                </span>
                {/* GPay */}
                <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-sm">
                  G Pay
                </span>
                {/* Mastercard */}
                <span className="bg-white text-black text-xs font-bold px-3 py-1 rounded-sm">
                  Mastercard
                </span>
                {/* Visa */}
                <span className="bg-[#1A1F71] text-white text-xs font-extrabold px-3 py-1 rounded-sm">
                  VISA
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SUB-FOOTER */}
        <div className="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-neutral-400">
          <p>© {new Date().getFullYear()}, {THEME.store.name}. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/about#privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <span>•</span>
            <Link href="/about#terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <span>•</span>
            <Link href="/faq#shipping" className="hover:text-white transition-colors">
              Shipping
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
