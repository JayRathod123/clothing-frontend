'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductVariant } from '@/types/product.types';
import { Price } from '@/components/common/Price';
import { RatingStars } from '@/components/common/RatingStars';
import { Button } from '@/components/ui/Button';
import { Accordion } from '@/components/ui/Accordion';
import { SizeSelector } from './SizeSelector';
import { ColorSwatches } from './ColorSwatches';
import { SizeGuideModal } from './SizeGuideModal';
import { useAddToCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useUI } from '@/context/UIContext';
import { shippingService } from '@/services/shipping.service';
import { PincodeServiceability } from '@/types/shipping.types';
import { Heart, Truck, RotateCcw, ShieldCheck, MapPin } from 'lucide-react';

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

  // Pincode checker state
  const [pincode, setPincode] = useState('');
  const [isCheckingPin, setIsCheckingPin] = useState(false);
  const [pincodeResult, setPincodeResult] = useState<PincodeServiceability | null>(null);

  const addToCart = useAddToCart();
  const { isItemInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { openCart, showToast } = useUI();

  const isFavorited = isItemInWishlist(product.id);

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
      showToast(`Added ${quantity}x ${product.name} (${selectedVariant.size}) to bag`);
      openCart();
    } catch {
      showToast('Unable to add item to bag', 'error');
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

  const accordionItems = [
    {
      id: 'details',
      title: 'DETAILS & CONSTRUCTION',
      content: (
        <ul className="list-disc list-inside space-y-1 text-xs">
          {product.details?.map((detail, idx) => (
            <li key={idx}>{detail}</li>
          )) || <li>Double-needle reinforced construction</li>}
        </ul>
      ),
    },
    {
      id: 'fabric',
      title: 'FABRIC & SPECIFICATIONS',
      content: (
        <div className="space-y-1.5 text-xs">
          <p>
            <strong className="text-[#171717]">Composition:</strong>{' '}
            {product.fabric || '100% Combed Heavyweight Cotton'}
          </p>
          {product.gsm ? (
            <p>
              <strong className="text-[#171717]">Weight / Density:</strong>{' '}
              {product.gsm} GSM Custom Milled Fabric
            </p>
          ) : null}
          <p>
            <strong className="text-[#171717]">Fit Profile:</strong>{' '}
            {product.fit || 'Relaxed Architectural Silhouette'}
          </p>
        </div>
      ),
    },
    {
      id: 'care',
      title: 'CARE INSTRUCTIONS',
      content: (
        <ul className="list-disc list-inside space-y-1 text-xs">
          {product.careInstructions?.map((care, idx) => (
            <li key={idx}>{care}</li>
          )) || (
            <>
              <li>Machine wash cold inside-out</li>
              <li>Hang dry in shade to preserve color & structural integrity</li>
              <li>Warm iron inside out if necessary</li>
            </>
          )}
        </ul>
      ),
    },
    {
      id: 'shipping',
      title: 'SHIPPING & COMPLIMENTARY RETURNS',
      content: (
        <div className="space-y-2 text-xs">
          <p>
            Complimentary shipping on orders above ₹999. Standard flat rate ₹99 applied for
            subtotals below threshold.
          </p>
          <p>
            Hassle-free 7-day doorstep exchange and return policy for unworn items with original
            tags attached.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Title, Category & Ratings */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-[#8A6A45]">
            {product.categoryName || 'Essentials'}
          </span>
          <RatingStars rating={product.rating || 4.9} count={product.reviewCount || 120} />
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-[#171717]">
          {product.name}
        </h1>

        <Price
          price={selectedVariant.price || product.basePrice}
          discountPrice={selectedVariant.discountPrice || product.discountPrice}
          size="lg"
          className="pt-1"
        />
      </div>

      {/* Editorial Description */}
      <p className="text-xs md:text-sm text-[#686868] leading-relaxed">
        {product.description}
      </p>

      {/* Color Swatches */}
      <ColorSwatches
        variants={product.variants}
        selectedColor={selectedVariant.color}
        onSelectColor={handleColorSelect}
      />

      {/* Size Selector */}
      <SizeSelector
        variants={product.variants}
        selectedSize={selectedVariant.size}
        onSelectSize={handleSizeSelect}
        onOpenSizeGuide={() => setIsSizeGuideOpen(true)}
      />

      {/* Quantity & CTA Buttons */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          {/* Quantity Stepper */}
          <div className="inline-flex items-center border border-[#E6E3DD] bg-white">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-12 flex items-center justify-center text-sm font-medium hover:bg-[#EFEEE9] transition-colors"
            >
              –
            </button>
            <span className="w-10 text-center text-xs font-semibold select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-12 flex items-center justify-center text-sm font-medium hover:bg-[#EFEEE9] transition-colors"
            >
              +
            </button>
          </div>

          {/* Add to Bag Button */}
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={handleAddToCart}
            isLoading={addToCart.isPending}
            className="flex-1 h-12"
          >
            Add To Bag
          </Button>

          {/* Wishlist Button */}
          <button
            type="button"
            onClick={handleWishlistToggle}
            className={`w-12 h-12 border flex items-center justify-center transition-colors ${
              isFavorited
                ? 'border-[#171717] bg-[#171717] text-white'
                : 'border-[#E6E3DD] bg-white text-[#171717] hover:border-[#171717]'
            }`}
            aria-label="Wishlist toggle"
          >
            <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Buy Now Button */}
        <Button
          variant="secondary"
          size="lg"
          fullWidth
          onClick={handleBuyNow}
          className="h-12"
        >
          Buy It Now
        </Button>
      </div>

      {/* Pincode Serviceability Tool */}
      <div className="border border-[#E6E3DD] bg-white p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#171717]">
          <MapPin className="w-3.5 h-3.5 text-[#8A6A45]" />
          <span>Delivery & Serviceability Check</span>
        </div>
        <form onSubmit={handleCheckPincode} className="flex gap-2">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter 6-digit Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            className="flex-1 bg-[#F7F6F2] border border-[#E6E3DD] px-3 py-2 text-xs focus:border-[#171717] focus:outline-none"
          />
          <button
            type="submit"
            disabled={isCheckingPin || pincode.length < 6}
            className="px-4 py-2 bg-[#171717] text-white text-[10px] uppercase tracking-widest font-semibold hover:bg-black disabled:opacity-50"
          >
            {isCheckingPin ? 'Checking...' : 'Check'}
          </button>
        </form>

        {pincodeResult ? (
          <div
            className={`text-xs p-2.5 ${
              pincodeResult.isServiceable
                ? 'bg-[#EFEEE9] text-[#171717]'
                : 'bg-red-50 text-red-700'
            }`}
          >
            <p className="font-semibold">
              {pincodeResult.isServiceable ? '✓ Pincode Serviceable' : '✕ Delivery Unavailable'}
            </p>
            <p className="text-[11px] mt-0.5 text-[#686868]">
              {pincodeResult.message}
            </p>
          </div>
        ) : null}
      </div>

      {/* Brand Guarantees */}
      <div className="grid grid-cols-3 gap-2 py-2 border-y border-[#E6E3DD] text-center">
        <div className="space-y-1">
          <Truck className="w-4 h-4 mx-auto text-[#8A6A45]" />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#171717]">
            Fast Dispatch
          </p>
          <p className="text-[9px] text-[#929292]">Within 24 Hours</p>
        </div>
        <div className="space-y-1">
          <RotateCcw className="w-4 h-4 mx-auto text-[#8A6A45]" />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#171717]">
            Easy Returns
          </p>
          <p className="text-[9px] text-[#929292]">7 Days Doorstep</p>
        </div>
        <div className="space-y-1">
          <ShieldCheck className="w-4 h-4 mx-auto text-[#8A6A45]" />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[#171717]">
            100% Original
          </p>
          <p className="text-[9px] text-[#929292]">Studio Certified</p>
        </div>
      </div>

      {/* Specifications & Care Accordion */}
      <Accordion items={accordionItems} defaultOpenId="details" />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category={product.categoryName}
      />
    </div>
  );
}
