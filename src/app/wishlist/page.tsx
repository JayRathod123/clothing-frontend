'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useWishlist } from '@/hooks/useWishlist';
import { useUI } from '@/context/UIContext';
import { formatPrice } from '@/utils/formatters';
import { Trash2, ShoppingBag, Heart } from 'lucide-react';

export default function WishlistPage() {
  const { items, totalItems, removeFromWishlist, moveToCart } = useWishlist();
  const { openCart, showToast } = useUI();

  const handleMoveToCart = async (itemId: string, name: string) => {
    try {
      await moveToCart(itemId);
      showToast(`Moved ${name} to bag`);
      openCart();
    } catch {
      showToast('Could not move to bag', 'error');
    }
  };

  const handleRemove = async (itemId: string, name: string) => {
    await removeFromWishlist(itemId);
    showToast(`Removed ${name} from saved pieces`, 'info');
  };

  return (
    <div className="py-12 md:py-20 bg-[#F7F6F2]">
      <Container>
        <div className="space-y-10">
          {/* Header */}
          <div className="flex items-end justify-between border-b border-[#E6E3DD] pb-6">
            <div className="space-y-1">
              <span className="editorial-kicker text-[#8A6A45]">SAVED ARCHIVE</span>
              <h1 className="text-3xl font-semibold tracking-tight text-[#171717]">
                YOUR WISHLIST ({totalItems})
              </h1>
            </div>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-widest font-semibold text-[#171717] hover:text-[#8A6A45] transition-colors"
            >
              Continue Shopping →
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="bg-white border border-[#E6E3DD] py-20 text-center space-y-4 max-w-md mx-auto p-6">
              <Heart className="w-10 h-10 text-[#B6B1A6] mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm uppercase tracking-widest font-semibold text-[#171717]">
                  YOUR WISHLIST IS EMPTY
                </h3>
                <p className="text-xs text-[#686868]">
                  Save your favorite silhouettes to review or purchase later.
                </p>
              </div>
              <div className="pt-2">
                <Link href="/shop">
                  <Button variant="primary" size="md">
                    Explore Collection
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {items.map((item) => {
                const product = item.product;
                const price = item.variant?.price || product.discountPrice || product.basePrice;

                return (
                  <div
                    key={item.id}
                    className="bg-white border border-[#E6E3DD] flex flex-col justify-between overflow-hidden"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-3/4 w-full bg-[#EFEEE9] overflow-hidden">
                        {product.primaryImage && (
                          <Image
                            src={product.primaryImage}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, 25vw"
                            className="object-cover"
                          />
                        )}
                        <button
                          onClick={() => handleRemove(item.id, product.name)}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-[#171717] hover:text-red-500 transition-colors shadow-xs"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Product Details */}
                      <div className="p-4 space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-[#929292]">
                          {product.categoryName || 'Garment'}
                        </p>
                        <Link
                          href={`/product/${product.slug}`}
                          className="block text-xs font-semibold text-[#171717] hover:text-[#8A6A45] transition-colors truncate"
                        >
                          {product.name}
                        </Link>
                        <p className="text-xs font-medium text-[#171717]">
                          {formatPrice(price)}
                        </p>
                      </div>
                    </div>

                    {/* Move to Bag Action */}
                    <div className="p-4 pt-0">
                      <Button
                        variant="secondary"
                        size="sm"
                        fullWidth
                        onClick={() => handleMoveToCart(item.id, product.name)}
                        className="gap-2 text-[10px]"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Move to Bag</span>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
