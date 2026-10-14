'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { useWishlist } from '@/hooks/useWishlist';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/context/UIContext';
import { formatPrice } from '@/utils/formatters';
import { Trash2, ShoppingBag, Heart, Loader2 } from 'lucide-react';

export default function WishlistPage() {
  const { isAuthenticated } = useAuth();
  const { items, totalItems, removeFromWishlist, moveToCart } = useWishlist();
  const { openCart, openAuthModal, showToast } = useUI();
  const [movingItemId, setMovingItemId] = useState<string | null>(null);
  const [removingItemId, setRemovingItemId] = useState<string | null>(null);

  const handleMoveToCart = async (itemId: string, name: string) => {
    setMovingItemId(itemId);
    try {
      await moveToCart(itemId);
      showToast(`Moved ${name} to bag`);
      openCart();
    } catch {
      showToast('Could not move to bag', 'error');
    } finally {
      setMovingItemId(null);
    }
  };

  const handleRemove = async (itemId: string, name: string) => {
    setRemovingItemId(itemId);
    try {
      await removeFromWishlist(itemId);
      showToast(`Removed ${name} from saved pieces`, 'info');
    } catch {
      showToast('Could not remove item', 'error');
    } finally {
      setRemovingItemId(null);
    }
  };

  // Guard: Wishlist API is strictly protected and only available for authenticated customers
  if (!isAuthenticated) {
    return (
      <div className="py-20 md:py-28 bg-[#F8F9FA]">
        <Container size="sm">
          <div className="bg-white border border-neutral-200 p-8 md:p-12 text-center space-y-6 rounded-xl shadow-xs">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-800">
              <Heart className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-tight text-neutral-900">
                Sign in to view your wishlist
              </h1>
              <p className="text-sm text-neutral-500 max-w-sm mx-auto leading-relaxed">
                Wishlist is linked to your customer account so you can save your favorite silhouettes and access them across all your devices.
              </p>
            </div>
            <div className="pt-2">
              <Button variant="primary" size="md" onClick={openAuthModal} className="w-full sm:w-auto px-8">
                Sign In / Register
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 bg-[#F8F9FA]">
      <Container>
        <div className="space-y-10">
          {/* Header */}
          <div className="flex items-end justify-between border-b border-neutral-200 pb-6">
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest font-extrabold text-neutral-500">
                SAVED ARCHIVE
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 uppercase">
                YOUR WISHLIST ({totalItems})
              </h1>
            </div>
            <Link
              href="/shop"
              className="text-xs uppercase tracking-widest font-bold text-neutral-900 hover:text-neutral-600 transition-colors"
            >
              Continue Shopping →
            </Link>
          </div>

          {items.length === 0 ? (
            <div className="bg-white border border-neutral-200 py-20 text-center space-y-4 max-w-md mx-auto p-6 rounded-xl">
              <Heart className="w-10 h-10 text-neutral-400 mx-auto" />
              <div className="space-y-1">
                <h3 className="text-sm uppercase tracking-widest font-bold text-neutral-900">
                  YOUR WISHLIST IS EMPTY
                </h3>
                <p className="text-xs text-neutral-500">
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
                    className="bg-white border border-neutral-200 rounded-xl flex flex-col justify-between overflow-hidden shadow-xs"
                  >
                    <div>
                      {/* Image */}
                      <div className="relative aspect-3/4 w-full bg-neutral-100 overflow-hidden">
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
                          disabled={removingItemId === item.id}
                          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center text-neutral-900 hover:text-red-500 transition-colors shadow-xs cursor-pointer disabled:cursor-not-allowed"
                          aria-label="Remove item"
                        >
                          {removingItemId === item.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-700" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Product Details */}
                      <div className="p-4 space-y-1">
                        <p className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">
                          {product.categoryName || 'Garment'}
                        </p>
                        <Link
                          href={`/product/${product.slug}`}
                          className="block text-sm font-bold text-neutral-900 hover:underline transition-colors truncate"
                        >
                          {product.name}
                        </Link>
                        <p className="text-sm font-black text-neutral-900">
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
                        isLoading={movingItemId === item.id}
                        disabled={movingItemId === item.id || removingItemId === item.id}
                        onClick={() => handleMoveToCart(item.id, product.name)}
                        className="gap-2 text-xs font-bold uppercase tracking-wider"
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
