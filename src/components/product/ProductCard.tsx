'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, ProductVariant } from '@/types/product.types';
import { Price } from '@/components/common/Price';
import { useAddToCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useUI } from '@/context/UIContext';
import { Heart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    product.variants[0] || {}
  );
  const [showQuickAddSizes, setShowQuickAddSizes] = useState(false);

  const addToCart = useAddToCart();
  const { isItemInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { openCart, showToast } = useUI();

  const isFavorited = isItemInWishlist(product.id);

  // Determine images
  const primaryImg = product.primaryImage || (product.images && product.images[0]?.url) || '';
  const secondaryImg = product.secondaryImage || (product.images && product.images[1]?.url) || primaryImg;

  // Extract unique colors for color indicators
  const uniqueColors = Array.from(
    new Map(
      product.variants.map((v) => [v.color, v.colorHex || '#171717'])
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
      showToast(`Added ${product.name} (${variant.size}) to bag`);
      openCart();
      setShowQuickAddSizes(false);
    } catch {
      showToast('Could not add to bag', 'error');
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorited) {
      await removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      await addToWishlist({ productId: product.id, variantId: selectedVariant.id });
      showToast('Saved to wishlist');
    }
  };

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickAddSizes(false);
      }}
    >
      {/* Product Image Container */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-[#EFEEE9]">
        <Link href={`/product/${product.slug}`} className="block w-full h-full">
          {/* Primary Image */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ease-out ${
              isHovered && secondaryImg ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {primaryImg ? (
              <Image
                src={primaryImg}
                alt={product.name}
                fill
                priority={priority}
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover object-center transform transition-transform duration-500 ease-out group-hover:scale-103"
              />
            ) : null}
          </div>

          {/* Secondary Editorial Image (Swaps on hover) */}
          {secondaryImg ? (
            <div
              className={`absolute inset-0 transition-opacity duration-300 ease-out ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <Image
                src={secondaryImg}
                alt={`${product.name} view`}
                fill
                sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                className="object-cover object-center transform transition-transform duration-500 ease-out group-hover:scale-103"
              />
            </div>
          ) : null}
        </Link>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center text-[#171717] hover:bg-white transition-all shadow-xs"
          aria-label="Save to Wishlist"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-[#171717] text-[#171717]' : 'text-[#171717]'
            }`}
          />
        </button>

        {/* GSM / Fabric Badge if available */}
        {product.gsm ? (
          <div className="absolute top-3 left-3 z-10 bg-white/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-semibold tracking-wider text-[#171717] uppercase">
            {product.gsm} GSM
          </div>
        ) : null}

        {/* Quick Add Overlay on Hover */}
        <div
          className={`absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-xs border-t border-[#E6E3DD] p-2.5 transition-all duration-300 ease-out ${
            isHovered
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-2 pointer-events-none'
          }`}
        >
          {showQuickAddSizes ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#686868]">
                <span>Select Size</span>
                <button
                  onClick={() => setShowQuickAddSizes(false)}
                  className="hover:text-[#171717]"
                >
                  Close
                </button>
              </div>
              <div className="flex items-center gap-1.5 justify-center">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={(e) => handleQuickAdd(variant, e)}
                    disabled={variant.stockQuantity <= 0}
                    className={`h-7 px-2 text-[10px] font-medium border uppercase transition-colors ${
                      variant.stockQuantity <= 0
                        ? 'border-[#E6E3DD] text-[#929292] opacity-40 cursor-not-allowed'
                        : 'border-[#171717] text-[#171717] hover:bg-[#171717] hover:text-white'
                    }`}
                  >
                    {variant.size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowQuickAddSizes(true)}
              className="w-full py-1.5 text-center text-[10px] uppercase font-semibold tracking-widest text-[#171717] hover:text-[#8A6A45] transition-colors"
            >
              + Quick Add
            </button>
          )}
        </div>
      </div>

      {/* Product Information */}
      <div className="pt-3 pb-1 flex flex-col gap-1">
        <Link
          href={`/product/${product.slug}`}
          className="text-xs font-medium tracking-tight text-[#171717] hover:text-[#8A6A45] transition-colors truncate"
        >
          {product.name}
        </Link>

        {/* Pricing */}
        <Price
          price={product.basePrice}
          discountPrice={product.discountPrice}
          size="sm"
        />

        {/* Color Indicators */}
        {uniqueColors.length > 0 && (
          <div className="flex items-center gap-1 pt-0.5">
            {uniqueColors.map(([colorName, hex]) => (
              <span
                key={colorName}
                title={colorName}
                className="w-2.5 h-2.5 rounded-full border border-black/10"
                style={{ backgroundColor: hex }}
              />
            ))}
            {uniqueColors.length > 1 && (
              <span className="text-[10px] text-[#929292] ml-1">
                {uniqueColors.length} colors
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
