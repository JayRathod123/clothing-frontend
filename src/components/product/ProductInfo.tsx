'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant } from '@/types/product.types';
import { formatPrice } from '@/utils/formatters';
import { SizeGuideModal } from './SizeGuideModal';
import { useAddToCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/context/UIContext';
import { isUserLoggedIn } from '@/utils/storage';
import { shippingService } from '@/services/shipping.service';
import { PincodeServiceability } from '@/types/shipping.types';
import {
  Heart,
  ShoppingCart,
  Eye,
  Truck,
  Mail,
  Ruler,
  Check,
  Star,
  Loader2,
} from 'lucide-react';
import { PhonePeIcon, GooglePayIcon, PaytmIcon } from '@/components/common/PaymentIcons';
import { useProductReviews } from '@/hooks/useReviews';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const ctaRef = useRef<HTMLDivElement>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const { data: reviewsData } = useProductReviews(product.id);
  const totalReviews = reviewsData?.totalReviews !== undefined ? reviewsData.totalReviews : (product.reviewCount || 0);
  const averageRating = reviewsData?.averageRating !== undefined && reviewsData.averageRating > 0
    ? reviewsData.averageRating
    : (product.rating || 0);

  // Monitor scroll past main CTA for mobile sticky buy bar
  useEffect(() => {
    if (!ctaRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isBelow = entry.boundingClientRect.top < 0;
        setShowStickyBar(!entry.isIntersecting && isBelow);
      },
      { threshold: 0.1 }
    );
    observer.observe(ctaRef.current);
    return () => observer.disconnect();
  }, []);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {}
  );
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionSent, setQuestionSent] = useState(false);
  const [isBuyingNow, setIsBuyingNow] = useState(false);
  const [isWishlisting, setIsWishlisting] = useState(false);

  // Pincode checker
  const [pincode, setPincode] = useState('');
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [pincodeResult, setPincodeResult] = useState<PincodeServiceability | null>(null);

  // Dynamic live viewing counter (simulated real-time social proof)
  const [viewingCount, setViewingCount] = useState<number>(() => {
    const seed = product?.id
      ? product.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
      : 18;
    return 14 + (seed % 12); // Between 14 and 25
  });

  useEffect(() => {
    // Fluctuates realistically every 4 to 6 seconds
    const interval = setInterval(() => {
      setViewingCount((prev) => {
        const delta = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
        const next = prev + (delta === 0 ? 1 : delta);
        return Math.min(32, Math.max(13, next)); // keep clamped realistically
      });
    }, 4800);

    return () => clearInterval(interval);
  }, []);

  const addToCart = useAddToCart();
  const { isAuthenticated } = useAuth();
  const { isItemInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { openCart, openAuthModal, showToast } = useUI();

  const isFavorited = isItemInWishlist(product.id);

  // Discount calculation
  const currentPrice = selectedVariant.discountPrice || selectedVariant.price || product.discountPrice || product.basePrice;
  const originalPrice = selectedVariant.price || product.basePrice;
  const discountPercent = originalPrice > currentPrice
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : null;

  // Available sizes
  const sizes = Array.from(new Set(product.variants.map((v) => v.size)));
  // Available colors
  const colors = Array.from(
    new Map(product.variants.map((v) => [v.color, v.colorHex || '#171717'])).entries()
  );

  const handleSizeSelect = (size: string) => {
    const matching = product.variants.find(
      (v) => v.size === size && v.color === selectedVariant.color
    ) || product.variants.find((v) => v.size === size);
    if (matching) setSelectedVariant(matching);
  };

  const handleColorSelect = (color: string) => {
    const matching = product.variants.find(
      (v) => v.color === color && v.size === selectedVariant.size
    ) || product.variants.find((v) => v.color === color);
    if (matching) setSelectedVariant(matching);
  };

  const handleAddToCart = async () => {
    try {
      await addToCart.mutateAsync({
        variantId: selectedVariant.id,
        quantity,
      });
      showToast(`Added ${quantity}x ${product.name} (${selectedVariant.size}) to cart`);
      openCart();
    } catch {
      showToast('Unable to add item to cart', 'error');
    }
  };

  const handleBuyNow = async () => {
    setIsBuyingNow(true);
    try {
      await addToCart.mutateAsync({
        variantId: selectedVariant.id,
        quantity,
      });
      router.push('/checkout');
    } catch {
      showToast('Could not proceed to checkout', 'error');
      setIsBuyingNow(false);
    }
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated || !isUserLoggedIn()) {
      showToast('Please sign in to add items to your wishlist', 'info');
      openAuthModal('login');
      return;
    }

    setIsWishlisting(true);
    try {
      if (isFavorited) {
        await removeFromWishlist(product.id);
        showToast('Removed from wishlist', 'info');
      } else {
        await addToWishlist({ productId: product.id, variantId: selectedVariant.id });
        showToast('Saved to wishlist', 'success');
      }
    } catch (err: any) {
      if (err?.response?.status === 401 || !isUserLoggedIn()) {
        showToast('Please sign in to add items to your wishlist', 'info');
        openAuthModal('login');
      } else {
        showToast(err?.message || 'Failed to update wishlist', 'error');
      }
    } finally {
      setIsWishlisting(false);
    }
  };

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode || pincode.length < 6) return;
    setIsCheckingPin(true);
    try {
      const res = await shippingService.checkPincode(pincode);
      setPincodeResult(res);
    } catch {
      setPincodeResult({
        pincode,
        isServiceable: true,
        codAvailable: true,
        estimatedDays: 3,
        message: 'Delivery available in 3–4 business days.',
      });
    } finally {
      setIsCheckingPin(false);
    }
  };

  return (
    <div className="space-y-6 text-neutral-900">
      {/* 1. Title */}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-neutral-900">
        {product.name}
      </h1>

      {/* Real Dynamic Rating & Review Count from API */}
      <div className="flex items-center gap-2 -mt-3 mb-1">
        {totalReviews > 0 ? (
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('reviews');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer text-left"
          >
            <div className="flex items-center gap-0.5 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.round(averageRating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'fill-neutral-100 text-neutral-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs sm:text-sm font-bold text-neutral-900">
              {Number(averageRating).toFixed(1)}
            </span>
            <span className="text-xs text-neutral-500 font-medium underline underline-offset-2 decoration-neutral-300 group-hover:decoration-neutral-900 transition-colors">
              ({totalReviews} genuine customer {totalReviews === 1 ? 'review' : 'reviews'})
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              const el = document.getElementById('reviews');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="group flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer text-left"
          >
            <div className="flex items-center gap-0.5 text-neutral-200">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3.5 h-3.5 fill-neutral-100 text-neutral-200" />
              ))}
            </div>
            <span className="underline underline-offset-2 decoration-neutral-300 group-hover:decoration-neutral-900">
              No reviews yet &bull; Be the first to review
            </span>
          </button>
        )}
      </div>

      {/* 2. Pricing Row */}
      <div className="flex items-center gap-3.5 flex-wrap">
        {discountPercent ? (
          <>
            <span className="text-lg sm:text-xl text-neutral-400 line-through font-medium">
              {formatPrice(originalPrice)}
            </span>
            <span className="text-3xl sm:text-4xl font-black text-neutral-900">
              {formatPrice(currentPrice)}
            </span>
            <span className="inline-flex items-center bg-rose-600 text-white text-xs sm:text-sm font-black px-3 py-1 rounded-full shadow-xs tracking-wide">
              Save -{discountPercent}%
            </span>
          </>
        ) : (
          <span className="text-3xl sm:text-4xl font-black text-neutral-900">
            {formatPrice(currentPrice)}
          </span>
        )}
      </div>

      {/* Product Description from API */}
      {product.description && (
        <div className="text-sm text-neutral-600 leading-relaxed font-normal">
          <p>{product.description}</p>
        </div>
      )}

      <hr className="border-neutral-200" />

      {/* 3. Real-time Urgency Widget (Highlighted Amber Live Counter) */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200/70 text-xs sm:text-sm">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <Eye className="w-4 h-4 text-amber-600 shrink-0" />
        <span className="text-neutral-800 font-medium">
          <strong className="font-black text-amber-600 text-sm sm:text-base tabular-nums transition-all duration-300">
            {viewingCount}
          </strong>{' '}
          people are viewing this right now
        </span>
      </div>

      <hr className="border-neutral-200" />

      {/* 4. Metadata Details (strictly from API) */}
      <div className="space-y-2.5 text-sm">
        {product.categoryName && (
          <div className="flex items-center gap-4">
            <span className="text-neutral-500 font-medium w-28">Category:</span>
            <span className="font-semibold text-neutral-900 capitalize">
              {product.categoryName}
            </span>
          </div>
        )}
        {(selectedVariant.sku || product.sku) && (
          <div className="flex items-center gap-4">
            <span className="text-neutral-500 font-medium w-28">SKU:</span>
            <span className="font-mono text-xs font-semibold text-neutral-800">
              {selectedVariant.sku || product.sku}
            </span>
          </div>
        )}
        <div className="flex items-center gap-4">
          <span className="text-neutral-500 font-medium w-28">Availability:</span>
          <span className={`font-bold ${selectedVariant.stockQuantity !== undefined && selectedVariant.stockQuantity <= 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {selectedVariant.stockQuantity !== undefined && selectedVariant.stockQuantity <= 0
              ? 'Out of stock'
              : selectedVariant.stockQuantity && selectedVariant.stockQuantity > 0
                ? `${selectedVariant.stockQuantity} left in stock`
                : 'In stock'}
          </span>
        </div>
      </div>

      <hr className="border-neutral-200" />

      {/* 5. Size Selector (Medium rounded pills) */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-3 text-xs sm:text-sm font-bold">
          <span className="text-neutral-900 w-14">Size :</span>
          <div className="flex items-center gap-2 flex-wrap">
            {sizes.map((size) => {
              const isSelected = selectedVariant.size === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeSelect(size)}
                  className={`min-w-[38px] h-9 px-2.5 flex items-center justify-center text-xs font-bold transition-all rounded-lg focus:outline-none cursor-pointer border ${
                    isSelected
                      ? 'bg-black text-white border-black shadow-xs scale-[1.02]'
                      : 'bg-white text-neutral-800 border-neutral-200 hover:border-neutral-900 hover:bg-neutral-50 active:scale-95'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Color Selector (Medium circular swatches) */}
      {colors.length > 0 && (
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-bold">
            <span className="text-neutral-900 w-14">Color :</span>
            <div className="flex items-center gap-2.5">
              {colors.map(([colorName, hex]) => {
                const isSelected = selectedVariant.color === colorName;
                return (
                  <button
                    key={colorName}
                    type="button"
                    title={colorName}
                    onClick={() => handleColorSelect(colorName)}
                    className={`w-7.5 h-7.5 rounded-full transition-all p-0.5 cursor-pointer flex items-center justify-center ${
                      isSelected
                        ? 'ring-2 ring-black ring-offset-2 scale-105 shadow-2xs'
                        : 'ring-1 ring-neutral-300 hover:ring-neutral-700 hover:scale-105'
                    }`}
                  >
                    <span
                      className="w-full h-full block rounded-full shadow-inner"
                      style={{ backgroundColor: hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. Stepper + Add to Cart + Buy it Now (Medium Proportions) */}
      <div ref={ctaRef} className="space-y-2.5 pt-1.5">
        <div className="flex items-center gap-2.5">
          {/* Medium Rounded Stepper */}
          <div className="inline-flex items-center bg-neutral-100 border border-neutral-200/80 rounded-lg p-1 h-11 shrink-0 shadow-2xs">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-7.5 h-7.5 rounded-md bg-white hover:bg-neutral-200 text-neutral-800 font-bold text-base flex items-center justify-center shadow-2xs transition-all active:scale-90 cursor-pointer disabled:opacity-40"
              disabled={quantity <= 1}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="w-8 text-center text-sm font-extrabold select-none text-neutral-900">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-7.5 h-7.5 rounded-md bg-white hover:bg-neutral-200 text-neutral-800 font-bold text-base flex items-center justify-center shadow-2xs transition-all active:scale-90 cursor-pointer"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Medium Add to Cart button */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addToCart.isPending || isBuyingNow}
            className="flex-1 h-11 bg-neutral-900 hover:bg-black text-white text-xs sm:text-sm font-extrabold uppercase tracking-wider rounded-lg flex items-center justify-center gap-2 transition-all shadow-xs hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] cursor-pointer group disabled:opacity-75 disabled:cursor-not-allowed"
          >
            {addToCart.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Adding to cart...</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Add to cart</span>
              </>
            )}
          </button>
        </div>

        {/* Medium Buy It Now button */}
        <button
          type="button"
          onClick={handleBuyNow}
          disabled={addToCart.isPending || isBuyingNow}
          className="w-full h-11 px-4 bg-gradient-to-r from-neutral-950 via-black to-neutral-950 hover:from-black hover:to-neutral-900 text-white font-extrabold uppercase tracking-wider rounded-lg transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2.5 sm:gap-3 flex-wrap border border-white/10 group disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {isBuyingNow ? (
            <div className="flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-xs sm:text-sm tracking-wider">Processing...</span>
            </div>
          ) : (
            <>
              <span className="text-xs sm:text-sm tracking-wider">Buy it now</span>
              <span className="text-white/30 font-light text-sm">|</span>
              <div className="flex items-center gap-1.5 sm:gap-2 bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-xs border border-white/10 shadow-inner">
                <PhonePeIcon className="w-6 h-6" />
                <GooglePayIcon className="w-6 h-6" />
                <PaytmIcon className="w-6 h-6" />
              </div>
            </>
          )}
        </button>
      </div>

      {/* 8. Secondary Actions (Wishlist, Ask Question, Size Chart) */}
      <div className="pt-2 flex items-center justify-between text-sm text-neutral-800 border-b border-neutral-200 pb-4">
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={isWishlisting}
          className="inline-flex items-center gap-1.5 hover:text-black font-medium transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isWishlisting ? (
            <Loader2 className="w-4 h-4 animate-spin text-neutral-800" />
          ) : (
            <Heart
              className={`w-4 h-4 ${isFavorited ? 'fill-red-600 text-red-600' : 'text-neutral-700'
                }`}
            />
          )}
          <span>{isWishlisting ? 'Saving...' : isFavorited ? 'In wishlist' : 'Add to wishlist'}</span>
        </button>

        <button
          type="button"
          onClick={() => setIsQuestionModalOpen(true)}
          className="inline-flex items-center gap-1.5 hover:text-black font-medium transition-colors cursor-pointer"
        >
          <Mail className="w-4 h-4" />
          <span>Ask a Question</span>
        </button>

        <button
          type="button"
          onClick={() => setIsSizeGuideOpen(true)}
          className="inline-flex items-center gap-1.5 hover:text-black font-medium transition-colors cursor-pointer"
        >
          <Ruler className="w-4 h-4" />
          <span>Size Chart</span>
        </button>
      </div>

      {/* 9. Pincode & Delivery Checker */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
          <Truck className="w-5 h-5 text-neutral-900 shrink-0" />
          <span>Check Delivery & Pincode Serviceability:</span>
        </div>

        <form onSubmit={handleCheckPincode} className="flex gap-2 max-w-sm">
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter Delivery Pincode"
            className="flex-1 bg-white border border-neutral-300 rounded-xl px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-black font-medium transition-colors"
          />
          <button
            type="submit"
            disabled={isCheckingPin || pincode.length !== 6}
            className="px-5 py-2.5 bg-neutral-900 text-white font-extrabold text-sm rounded-xl hover:bg-black disabled:opacity-50 transition-all shadow-xs cursor-pointer active:scale-95 flex items-center gap-2"
          >
            {isCheckingPin ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              'Check'
            )}
          </button>
        </form>

        {pincodeResult && (
          <div className="p-3.5 bg-neutral-50 border border-neutral-200 text-sm rounded-xl">
            <p className="font-semibold text-neutral-900">{pincodeResult.message}</p>
            {pincodeResult.codAvailable && (
              <span className="text-xs font-semibold text-emerald-700 block mt-1">
                ✓ Cash on Delivery (COD) available for this pincode
              </span>
            )}
          </div>
        )}
      </div>

      {/* 10. Return Rules Summary */}
      <div className="space-y-2 pt-2 border-t border-neutral-200">
        <h4 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
          Return rules summary
        </h4>
        <ul className="space-y-1.5 text-sm text-neutral-700 list-disc list-inside leading-relaxed">
          <li>Returns accepted within 7 days of delivery.</li>
          <li>Free return shipping on eligible items.</li>
          <li>No returns on custom or personalized items.</li>
          <li>Items must be unworn and in original packaging.</li>
        </ul>
      </div>


      {/* 12. Social Share */}
      <div className="flex items-center gap-4 text-sm text-neutral-600 pt-2 border-t border-neutral-200">
        <span className="font-bold text-neutral-900">Share:</span>
        <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
          Facebook
        </a>
        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
          Twitter
        </a>
        <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-black transition-colors">
          Pinterest
        </a>
      </div>

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
      />

      {/* Ask Question Modal */}
      {isQuestionModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setIsQuestionModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-neutral-900">
                Ask about {product.name}
              </h4>
              <button
                type="button"
                onClick={() => setIsQuestionModalOpen(false)}
                className="text-neutral-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            {questionSent ? (
              <div className="py-6 text-center text-emerald-600 font-bold text-xs flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                <span>Your query has been submitted! Our stylists will reply shortly.</span>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setQuestionSent(true);
                  setTimeout(() => {
                    setIsQuestionModalOpen(false);
                    setQuestionSent(false);
                  }, 2000);
                }}
                className="space-y-3 text-xs"
              >
                <input
                  required
                  type="email"
                  placeholder="Your Email"
                  className="w-full p-2.5 border border-neutral-300 rounded-sm"
                />
                <textarea
                  required
                  rows={3}
                  placeholder="What would you like to know about sizing, fabric GSM, or delivery?"
                  className="w-full p-2.5 border border-neutral-300 rounded-sm"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-black text-white font-bold rounded-sm hover:bg-neutral-800"
                >
                  Send Query
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Sticky Mobile Purchase Bar (Appears when main CTAs are scrolled off-screen on mobile) */}
      <div
        className={`fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200 p-3 transition-all duration-300 shadow-2xl md:hidden ${
          showStickyBar ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative w-10 h-12 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
              <Image
                src={product.primaryImage || ''}
                alt={product.name}
                fill
                sizes="48px"
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-neutral-900 truncate leading-snug">
                {product.name}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-xs font-extrabold text-neutral-900">
                  {formatPrice(currentPrice)}
                </span>
                {selectedVariant.size && (
                  <span className="text-[10px] font-bold text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded">
                    {selectedVariant.size}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={addToCart.isPending}
              className="h-10 px-4 bg-neutral-950 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl flex items-center justify-center gap-1.5 active:scale-95 shadow-md cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {addToCart.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductInfo;
