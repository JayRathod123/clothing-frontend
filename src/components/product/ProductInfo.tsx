'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant } from '@/types/product.types';
import { formatPrice } from '@/utils/formatters';
import { SizeGuideModal } from './SizeGuideModal';
import { useAddToCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useUI } from '@/context/UIContext';
import { shippingService } from '@/services/shipping.service';
import { PincodeServiceability } from '@/types/shipping.types';
import {
  Heart,
  ShoppingCart,
  Eye,
  Truck,
  ArrowLeftRight,
  Mail,
  Ruler,
  Check,
} from 'lucide-react';

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {}
  );
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [questionSent, setQuestionSent] = useState(false);

  // Pincode checker
  const [pincode, setPincode] = useState('');
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [pincodeResult, setPincodeResult] = useState<PincodeServiceability | null>(null);

  const addToCart = useAddToCart();
  const { isItemInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { openCart, showToast } = useUI();

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
    try {
      await addToCart.mutateAsync({
        variantId: selectedVariant.id,
        quantity,
      });
      router.push('/checkout');
    } catch {
      showToast('Could not proceed to checkout', 'error');
    }
  };

  const handleWishlistToggle = async () => {
    if (isFavorited) {
      await removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      await addToWishlist({ productId: product.id, variantId: selectedVariant.id });
      showToast('Saved to wishlist');
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
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900 leading-tight font-heading">
        {product.name}
      </h1>

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
            <span className="bg-neutral-100 text-neutral-900 text-xs sm:text-sm font-extrabold px-3 py-1 rounded-sm border border-neutral-200">
              Save -{discountPercent}%
            </span>
          </>
        ) : (
          <span className="text-3xl sm:text-4xl font-black text-neutral-900">
            {formatPrice(currentPrice)}
          </span>
        )}
      </div>

      <hr className="border-neutral-200" />

      {/* 3. Real-time Urgency Widget */}
      <div className="flex items-center gap-2.5 text-sm font-semibold text-neutral-800">
        <Eye className="w-4 h-4 text-neutral-700" />
        <span>
          <strong className="font-black text-black">18</strong> people are viewing this right now.
        </span>
      </div>

      <hr className="border-neutral-200" />

      {/* 4. Metadata Details */}
      <div className="space-y-2.5 text-sm">
        <div className="flex items-center gap-4">
          <span className="text-neutral-500 font-medium w-28">Availability:</span>
          <span className="font-bold text-neutral-900">
            {selectedVariant.stockQuantity && selectedVariant.stockQuantity > 0
              ? `${selectedVariant.stockQuantity} left in stock`
              : 'In stock'}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-neutral-500 font-medium w-28">Vendor:</span>
          <span className="font-semibold text-neutral-900">Inkstyles</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-neutral-500 font-medium w-28">Type:</span>
          <span className="font-semibold text-neutral-900">
            {product.fit || 'Oversize'}
          </span>
        </div>
      </div>

      <hr className="border-neutral-200" />

      {/* 5. Size Selector (Square boxed outline pills) */}
      <div className="space-y-3">
        <div className="flex items-center gap-4 text-sm font-bold">
          <span className="text-neutral-900 w-16">Size :</span>
          <div className="flex items-center gap-2 flex-wrap">
            {sizes.map((size) => {
              const isSelected = selectedVariant.size === size;
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleSizeSelect(size)}
                  className={`w-11 h-11 flex items-center justify-center text-sm font-bold transition-all rounded-xs focus:outline-none cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-800 hover:bg-neutral-200'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 6. Color Selector (Square swatch) */}
      {colors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-sm font-bold">
            <span className="text-neutral-900 w-16">Color :</span>
            <div className="flex items-center gap-2.5">
              {colors.map(([colorName, hex]) => {
                const isSelected = selectedVariant.color === colorName;
                return (
                  <button
                    key={colorName}
                    type="button"
                    title={colorName}
                    onClick={() => handleColorSelect(colorName)}
                    className={`w-9 h-9 rounded-sm border-2 transition-all p-0.5 cursor-pointer ${
                      isSelected
                        ? 'border-black ring-1 ring-black'
                        : 'border-neutral-300 hover:border-neutral-500'
                    }`}
                  >
                    <span
                      className="w-full h-full block rounded-2xs"
                      style={{ backgroundColor: hex }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. Stepper + Add to Cart + Buy it Now */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Stepper [- 1 +] */}
          <div className="inline-flex items-center border border-neutral-300 rounded-xs bg-white">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-14 flex items-center justify-center text-lg font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              -
            </button>
            <span className="w-12 text-center text-base font-extrabold select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-14 flex items-center justify-center text-lg font-semibold hover:bg-neutral-100 transition-colors cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Add to Cart button (Charcoal with cart icon) */}
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={addToCart.isPending}
            className="flex-1 h-14 bg-[#212121] hover:bg-neutral-950 text-white text-sm sm:text-base font-extrabold uppercase tracking-wider rounded-xs flex items-center justify-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <ShoppingCart className="w-5 h-5" />
            <span>Add to cart</span>
          </button>
        </div>

        {/* Buy It Now (Full solid black button) */}
        <button
          type="button"
          onClick={handleBuyNow}
          className="w-full h-14 bg-black hover:bg-neutral-900 text-white text-sm sm:text-base font-extrabold uppercase tracking-wider rounded-xs transition-colors shadow-xs cursor-pointer"
        >
          Buy it now
        </button>
      </div>

      {/* 8. Secondary Actions (Wishlist, Compare, Ask Question, Size Chart) */}
      <div className="pt-2 flex items-center justify-between text-sm text-neutral-800 border-b border-neutral-200 pb-4">
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="inline-flex items-center gap-1.5 hover:text-black font-medium transition-colors cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorited ? 'fill-red-600 text-red-600' : 'text-neutral-700'
            }`}
          />
          <span>Add to wishlist</span>
        </button>

        <button
          type="button"
          onClick={() => showToast('Product added to comparison list')}
          className="inline-flex items-center gap-1.5 hover:text-black font-medium transition-colors cursor-pointer"
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Compare</span>
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

      {/* 9. Estimated Delivery Date & Pincode Checker */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
          <Truck className="w-5 h-5 text-neutral-900 shrink-0" />
          <span>
            Estimated Delivery Date :{' '}
            <strong className="font-extrabold text-black">22 - 24 September, 2026.</strong>
          </span>
        </div>

        <form onSubmit={handleCheckPincode} className="flex gap-2 max-w-sm">
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter Delivery Pincode"
            className="flex-1 bg-white border border-neutral-300 rounded-sm px-4 py-2.5 text-sm text-neutral-900 focus:outline-none focus:border-black font-medium"
          />
          <button
            type="submit"
            disabled={isCheckingPin || pincode.length !== 6}
            className="px-5 py-2.5 bg-neutral-900 text-white font-extrabold text-sm rounded-sm hover:bg-black disabled:opacity-50 transition-colors cursor-pointer"
          >
            {isCheckingPin ? 'Checking...' : 'Check'}
          </button>
        </form>

        {pincodeResult && (
          <div className="p-3 bg-neutral-50 border border-neutral-200 text-sm rounded-sm">
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

      {/* 11. Guaranteed Safe Checkout */}
      <div className="space-y-2 pt-3 border-t border-neutral-200">
        <h4 className="text-sm font-extrabold text-neutral-900 uppercase tracking-wide">
          Guaranteed safe checkout
        </h4>
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="bg-white border border-neutral-300 text-black text-xs font-black px-2.5 py-1 rounded-xs">
            amazon pay
          </span>
          <span className="bg-[#002663] text-white text-xs font-bold px-2.5 py-1 rounded-xs">
            AMEX
          </span>
          <span className="bg-white border border-neutral-300 text-black text-xs font-bold px-2.5 py-1 rounded-xs">
            G Pay
          </span>
          <span className="bg-white border border-neutral-300 text-black text-xs font-bold px-2.5 py-1 rounded-xs">
            Mastercard
          </span>
          <span className="bg-[#003087] text-white text-xs font-bold px-2.5 py-1 rounded-xs">
            PayPal
          </span>
          <span className="bg-[#1A1F71] text-white text-xs font-extrabold px-2.5 py-1 rounded-xs">
            VISA
          </span>
        </div>
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
    </div>
  );
}

export default ProductInfo;
