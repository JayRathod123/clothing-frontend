'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, ProductVariant } from '@/types/product.types';
import { formatPrice } from '@/utils/formatters';
import { useAddToCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useUI } from '@/context/UIContext';
import { Heart, Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);

  const addToCart = useAddToCart();
  const { isItemInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { openCart, showToast } = useUI();

  const isFavorited = isItemInWishlist(product.id);

  // Fallback image handling
  const primaryImg = product.primaryImage || (product.images && product.images[0]?.url) || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=1200';
  const secondaryImg = product.secondaryImage || (product.images && product.images[1]?.url) || primaryImg;

  // Stock status
  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stockQuantity || 0), 0) ?? 25;
  const isSoldOut = totalStock <= 0;

  // Discount percentage
  const discountPercent = product.discountPrice && product.basePrice > product.discountPrice
    ? Math.round(((product.basePrice - product.discountPrice) / product.basePrice) * 100)
    : null;

  // Color options
  const uniqueColors = Array.from(
    new Map(
      (product.variants || []).map((v) => [v.color, v.colorHex || '#171717'])
    ).entries()
  );

  const handleQuickAdd = async (variant: ProductVariant, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      await addToCart.mutateAsync({
        variantId: variant.id,
        quantity: 1,
      });
      showToast(`Added ${product.name} (${variant.size}) to cart`);
      openCart();
      setShowQuickAdd(false);
    } catch {
      showToast('Could not add to cart', 'error');
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorited) {
      await removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      await addToWishlist({ productId: product.id, variantId: product.variants[0]?.id });
      showToast('Added to wishlist');
    }
  };

  return (
    <div
      className="group relative flex flex-col bg-white rounded-xl transition-all duration-200"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickAdd(false);
      }}
    >
      {/* Product Image Container with Soft Rounded Grey Box matching InkStyles */}
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-[#F2F4F7] border border-neutral-100">
        <Link href={`/product/${product.slug}`} className="block w-full h-full relative">
          {/* Primary Image */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              isHovered && secondaryImg ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Image
              src={primaryImg}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
            />
          </div>

          {/* Secondary Hover Image */}
          {secondaryImg && (
            <div
              className={`absolute inset-0 transition-opacity duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={secondaryImg}
                alt={`${product.name} alternate view`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className="object-cover object-center transform transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          )}
        </Link>

        {/* Top Badges (InkStyles Capsule Style) */}
        <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
          {isSoldOut ? (
            <span className="bg-[#E03A3A] text-white text-[10px] font-bold px-2.5 py-0.5 rounded-sm shadow-xs">
              Soldout
            </span>
          ) : discountPercent ? (
            <span className="bg-white/95 text-neutral-900 border border-neutral-200 text-[10px] font-bold px-2 py-0.5 rounded-sm shadow-xs">
              -{discountPercent}%
            </span>
          ) : null}
        </div>

        {/* Wishlist Toggle Button (Top-Left) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="absolute top-2.5 left-2.5 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-neutral-700 hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-xs"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-red-600 text-red-600' : 'text-neutral-700'
            }`}
          />
        </button>

        {/* Quick Add Overlay on Hover */}
        {!isSoldOut && (
          <div
            className={`absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-t border-neutral-100 p-2 transition-all duration-300 ${
              isHovered
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            {showQuickAdd ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[10px] uppercase font-bold text-neutral-500">
                  <span>Pick Size</span>
                  <button
                    type="button"
                    onClick={() => setShowQuickAdd(false)}
                    className="hover:text-black"
                  >
                    ✕
                  </button>
                </div>
                <div className="flex items-center gap-1.5 justify-center flex-wrap">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={(e) => handleQuickAdd(variant, e)}
                      disabled={variant.stockQuantity <= 0}
                      className={`h-7 px-2.5 text-[10px] font-bold border transition-all rounded-xs ${
                        variant.stockQuantity <= 0
                          ? 'border-neutral-200 text-neutral-300 opacity-40 cursor-not-allowed'
                          : 'border-neutral-800 text-neutral-900 hover:bg-black hover:text-white'
                      }`}
                    >
                      {variant.size}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowQuickAdd(true)}
                className="w-full py-1.5 flex items-center justify-center gap-1.5 text-xs font-bold text-neutral-900 hover:text-sky-600 transition-colors"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Info (Centered InkStyles Style) */}
      <div className="pt-3 pb-2 px-1 flex flex-col items-center text-center">
        {/* Star rating with emerald teal stars matching Judge.me */}
        <div className="flex items-center gap-1 mb-1">
          <div className="flex items-center text-[#0F766E]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-3 h-3 fill-[#0F766E] text-[#0F766E]" />
            ))}
          </div>
          <span className="text-[11px] text-neutral-500 font-medium">
            {product.reviewCount || 1} review
          </span>
        </div>

        {/* Product Title */}
        <Link
          href={`/product/${product.slug}`}
          className="text-xs sm:text-[13px] font-semibold text-neutral-900 hover:text-sky-600 transition-colors line-clamp-2 min-h-[36px] max-w-[90%]"
        >
          {product.name}
        </Link>

        {/* Pricing: Strikethrough base + Bold discounted */}
        <div className="mt-1 flex items-center gap-2">
          {product.discountPrice && product.discountPrice < product.basePrice ? (
            <>
              <span className="text-xs text-neutral-400 line-through">
                {formatPrice(product.basePrice)}
              </span>
              <span className="text-sm font-bold text-neutral-900">
                {formatPrice(product.discountPrice)}
              </span>
            </>
          ) : (
            <span className="text-sm font-bold text-neutral-900">
              {formatPrice(product.basePrice)}
            </span>
          )}
        </div>

        {/* Color Swatch Dots */}
        {uniqueColors.length > 0 && (
          <div className="flex items-center justify-center gap-1.5 mt-2">
            {uniqueColors.map(([colorName, hex]) => (
              <span
                key={colorName}
                title={colorName}
                className="w-3 h-3 rounded-full border border-neutral-300 shadow-2xs inline-block"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
