'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, ProductVariant } from '@/types/product.types';
import { formatPrice } from '@/utils/formatters';
import { useAddToCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/context/UIContext';
import { isUserLoggedIn } from '@/utils/storage';
import { Heart, Star, ShoppingCart, Loader2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [addingVariantId, setAddingVariantId] = useState<string | null>(null);
  const [isWishlisting, setIsWishlisting] = useState(false);

  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const { isItemInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { openCart, openAuthModal, showToast } = useUI();

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

  const handleQuickAdd = async (variant: ProductVariant, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    setAddingVariantId(variant.id);
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
    } finally {
      setAddingVariantId(null);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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
        const variantId = product.variants?.[0]?.id;
        await addToWishlist({ productId: product.id, variantId });
        showToast('Added to wishlist', 'success');
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

  return (
    <div
      className="group relative flex flex-col bg-white rounded-2xl p-2 border border-neutral-200/70 shadow-2xs hover:shadow-md hover:border-neutral-300 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickAdd(false);
      }}
    >
      {/* Product Image Container */}
      <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-neutral-100">
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

        {/* Top Badges (Modern Pill Style) */}
        <div className="absolute top-2.5 right-2.5 z-10 pointer-events-none">
          {isSoldOut ? (
            <span className="bg-neutral-900/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs uppercase tracking-wider backdrop-blur-xs">
              Sold Out
            </span>
          ) : discountPercent ? (
            <span className="bg-rose-600 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-xs tracking-wide">
              -{discountPercent}%
            </span>
          ) : null}
        </div>

        {/* Wishlist Toggle Button (Top-Left) */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          disabled={isWishlisting}
          className="absolute top-2.5 left-2.5 z-20 w-8.5 h-8.5 rounded-full bg-white/95 backdrop-blur-xs flex items-center justify-center text-neutral-700 hover:bg-white hover:scale-110 active:scale-95 transition-all shadow-xs cursor-pointer border border-neutral-100 disabled:opacity-80 disabled:cursor-not-allowed"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {isWishlisting ? (
            <Loader2 className="w-4 h-4 animate-spin text-neutral-800" />
          ) : (
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFavorited ? 'fill-rose-600 text-rose-600' : 'text-neutral-700'
              }`}
            />
          )}
        </button>

        {/* Quick Add Overlay on Hover (Desktop only) */}
        {!isSoldOut && (
          <div
            className={`hidden lg:block absolute bottom-2 left-2 right-2 z-20 transition-all duration-300 ${
              isHovered
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}
          >
            {showQuickAdd ? (
              <div className="bg-white/95 backdrop-blur-md border border-neutral-200/90 rounded-xl p-2.5 shadow-lg space-y-2">
                <div className="flex items-center justify-between text-[11px] uppercase font-extrabold text-neutral-600 px-1">
                  <span>Select Size</span>
                  <button
                    type="button"
                    onClick={() => setShowQuickAdd(false)}
                    className="hover:text-black font-bold text-xs p-0.5"
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
                      disabled={variant.stockQuantity <= 0 || addingVariantId !== null}
                      className={`h-8 min-w-[34px] px-2.5 text-xs font-bold border transition-all rounded-lg cursor-pointer ${
                        variant.stockQuantity <= 0
                          ? 'border-neutral-200 text-neutral-300 opacity-40 cursor-not-allowed'
                          : addingVariantId === variant.id
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-300 text-neutral-900 hover:bg-black hover:text-white hover:border-black active:scale-95'
                      }`}
                    >
                      {addingVariantId === variant.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mx-auto" />
                      ) : (
                        variant.size
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  if (product.variants.length === 1 && product.variants[0].stockQuantity > 0) {
                    handleQuickAdd(product.variants[0]);
                  } else {
                    setShowQuickAdd(true);
                  }
                }}
                disabled={addingVariantId !== null}
                className="w-full h-9 bg-neutral-950/90 hover:bg-black text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 backdrop-blur-xs shadow-md transition-all active:scale-98 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {addingVariantId ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="pt-2.5 pb-1 px-1 flex flex-col items-center text-center">
        {/* Rating Line: Golden Stars + Score + Count from API */}
        <div className="flex items-center justify-center gap-1.5 mb-1 min-h-[1.25rem]">
          {product.reviewCount && product.reviewCount > 0 ? (
            <>
              <div className="flex items-center gap-0.5 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.round(product.rating || 0)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-neutral-100 text-neutral-200'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-neutral-800">
                {(product.rating || 0).toFixed(1)}
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">
                ({product.reviewCount})
              </span>
            </>
          ) : (
            <div className="flex items-center gap-1 text-[11px] text-neutral-400 font-medium">
              <div className="flex items-center gap-0.5 text-neutral-200">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-neutral-100 text-neutral-200" />
                ))}
              </div>
              <span className="text-[11px] text-neutral-400 font-medium">(0)</span>
            </div>
          )}
        </div>

        {/* Product Title */}
        <Link
          href={`/product/${product.slug}`}
          className="min-h-[2rem] flex items-center justify-center text-center text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-black transition-colors line-clamp-2 px-1 leading-snug"
          title={product.name}
        >
          {product.name}
        </Link>

        {/* Pricing */}
        <div className="mt-0.5 flex items-center justify-center gap-2 whitespace-nowrap">
          {product.discountPrice && product.discountPrice < product.basePrice ? (
            <>
              <span className="text-xs sm:text-[13px] text-neutral-400 line-through font-normal whitespace-nowrap">
                {formatPrice(product.basePrice)}
              </span>
              <span className="text-sm sm:text-base font-extrabold text-neutral-950 whitespace-nowrap">
                {formatPrice(product.discountPrice)}
              </span>
            </>
          ) : (
            <span className="text-sm sm:text-base font-extrabold text-neutral-950 whitespace-nowrap">
              {formatPrice(product.basePrice)}
            </span>
          )}
        </div>

        {/* Color Swatches */}
        {uniqueColors.length > 1 && (
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            {uniqueColors.map(([colorName, hex]) => (
              <span
                key={colorName}
                title={colorName}
                className="w-2.5 h-2.5 rounded-full border border-neutral-300 shadow-2xs inline-block transition-transform hover:scale-125 cursor-pointer"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        )}

        {/* Mobile & Tablet Quick Add Button (Always accessible at bottom of card) */}
        {!isSoldOut && (
          <div className="w-full mt-2.5 lg:hidden">
            {showQuickAdd ? (
              <div className="w-full bg-neutral-50 border border-neutral-200/90 rounded-xl p-2 space-y-1.5 shadow-xs animate-fadeIn">
                <div className="flex items-center justify-between text-[10px] uppercase font-extrabold text-neutral-500 px-1">
                  <span>Select Size</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setShowQuickAdd(false);
                    }}
                    className="text-neutral-400 hover:text-black font-bold p-0.5"
                    aria-label="Close size selector"
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
                      disabled={variant.stockQuantity <= 0 || addingVariantId !== null}
                      className={`h-7.5 min-w-[32px] px-2 text-[11px] font-bold border rounded-lg transition-all active:scale-95 cursor-pointer ${
                        variant.stockQuantity <= 0
                          ? 'border-neutral-200 text-neutral-300 opacity-40 cursor-not-allowed'
                          : addingVariantId === variant.id
                          ? 'border-black bg-black text-white'
                          : 'border-neutral-300 bg-white text-neutral-900 active:bg-black active:text-white'
                      }`}
                    >
                      {addingVariantId === variant.id ? (
                        <Loader2 className="w-3 h-3 animate-spin mx-auto" />
                      ) : (
                        variant.size
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <button
                type="button"
                disabled={addingVariantId !== null}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (product.variants.length === 1 && product.variants[0].stockQuantity > 0) {
                    handleQuickAdd(product.variants[0], e);
                  } else {
                    setShowQuickAdd(true);
                  }
                }}
                className="w-full h-8 sm:h-9 bg-neutral-950 active:bg-neutral-800 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-2xs transition-all active:scale-98 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed"
              >
                {addingVariantId ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Adding...</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Quick Add</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCard;
