'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Drawer } from '@/components/ui/Drawer';
import { Button } from '@/components/ui/Button';
import { ShippingProgressBar } from './ShippingProgressBar';
import { formatPrice } from '@/utils/formatters';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart';
import { cartService } from '@/services/cart.service';
import { useUI } from '@/context/UIContext';
import { Trash2, ArrowRight, Tag } from 'lucide-react';

export function CartDrawer() {
  const router = useRouter();
  const { isCartOpen, closeCart, showToast } = useUI();
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = cart?.subtotal || 0;
  const items = cart?.items || [];
  const finalTotal = Math.max(0, subtotal - discountAmount);

  const handleUpdateQty = (itemId: string, currentQty: number, delta: number) => {
    const next = currentQty + delta;
    updateItem.mutate({ itemId, quantity: next });
  };

  const handleRemove = (itemId: string, name: string) => {
    removeItem.mutate(itemId);
    showToast(`Removed ${name} from bag`, 'info');
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    try {
      const res = await cartService.applyCoupon(couponCode, subtotal);
      if (res.valid) {
        setDiscountAmount(res.discountAmount);
        setAppliedCoupon(couponCode.toUpperCase());
        showToast(res.message);
      } else {
        showToast(res.message, 'error');
      }
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleCheckout = () => {
    closeCart();
    router.push('/checkout');
  };

  return (
    <Drawer
      isOpen={isCartOpen}
      onClose={closeCart}
      title={`Your Cart (${items.reduce((s, i) => s + i.quantity, 0)})`}
      width="max-w-md"
    >
      <div className="flex flex-col h-full justify-between -mx-6 -my-6">
        {/* Top Progress Indicator */}
        <div className="p-6 pb-4">
          <ShippingProgressBar subtotal={subtotal} />
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto px-6 divide-y divide-[#E6E3DD]">
          {items.length === 0 ? (
            <div className="py-20 text-center space-y-4">
              <p className="text-xs uppercase tracking-widest font-medium text-[#171717]">
                Your shopping bag is empty
              </p>
              <p className="text-xs text-[#686868]">
                Discover our signature 240 GSM tees and tailoring.
              </p>
              <div className="pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    closeCart();
                    router.push('/shop');
                  }}
                >
                  Explore Collection
                </Button>
              </div>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="py-4 flex gap-4">
                {/* Thumbnail */}
                <div className="relative w-20 h-26 bg-white shrink-0 overflow-hidden border border-[#E6E3DD]">
                  {item.productImage ? (
                    <Image
                      src={item.productImage}
                      alt={item.productName || 'Garment'}
                      fill
                      sizes="90px"
                      className="object-cover object-center"
                    />
                  ) : null}
                </div>

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        href={`/product/${item.productSlug || 'oversized-essential-tee'}`}
                        onClick={closeCart}
                        className="text-xs font-semibold text-[#171717] hover:text-[#8A6A45] transition-colors leading-snug line-clamp-2"
                      >
                        {item.productName}
                      </Link>
                      <button
                        onClick={() => handleRemove(item.id, item.productName || 'item')}
                        className="text-[#929292] hover:text-red-500 transition-colors p-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mt-1 text-[11px] text-[#686868]">
                      {item.size ? <span>Size: {item.size}</span> : null}
                      {item.size && item.color ? <span>•</span> : null}
                      {item.color ? <span>Color: {item.color}</span> : null}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3">
                    {/* Stepper */}
                    <div className="inline-flex items-center border border-[#E6E3DD] bg-white h-7">
                      <button
                        onClick={() => handleUpdateQty(item.id, item.quantity, -1)}
                        className="w-7 h-full flex items-center justify-center text-xs hover:bg-[#EFEEE9] transition-colors"
                      >
                        –
                      </button>
                      <span className="w-6 text-center text-xs font-semibold select-none">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQty(item.id, item.quantity, 1)}
                        className="w-7 h-full flex items-center justify-center text-xs hover:bg-[#EFEEE9] transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Item Subtotal */}
                    <span className="text-xs font-semibold text-[#171717]">
                      {formatPrice(item.currentPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Subtotal & Checkout CTA */}
        {items.length > 0 && (
          <div className="border-t border-[#E6E3DD] bg-white p-6 space-y-4">
            {/* Promo Code Input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#929292]" />
                <input
                  type="text"
                  placeholder="PROMO CODE (e.g. AURA10)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#E6E3DD] pl-8 pr-3 py-2 text-[11px] tracking-wider uppercase focus:border-[#171717] focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={isApplyingCoupon || !couponCode.trim()}
                className="px-3 py-2 bg-[#171717] text-white text-[10px] uppercase tracking-widest font-semibold hover:bg-black disabled:opacity-50 transition-colors"
              >
                Apply
              </button>
            </form>

            {appliedCoupon ? (
              <div className="flex items-center justify-between text-xs text-[#8A6A45] font-medium">
                <span>Voucher ({appliedCoupon})</span>
                <span>-{formatPrice(discountAmount)}</span>
              </div>
            ) : null}

            {/* Price Calculations */}
            <div className="space-y-1.5 pt-1 text-xs">
              <div className="flex items-center justify-between text-[#686868]">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[#686868]">
                <span>Estimated Shipping</span>
                <span>{subtotal >= 999 ? 'COMPLIMENTARY' : '₹99'}</span>
              </div>
              <div className="flex items-center justify-between text-sm font-semibold text-[#171717] pt-2 border-t border-[#E6E3DD]">
                <span>Total</span>
                <span>{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {/* Checkout CTA */}
            <div className="space-y-2 pt-1">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCheckout}
                className="h-12 text-xs"
              >
                Checkout Now <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <button
                onClick={closeCart}
                className="w-full text-center text-[11px] uppercase tracking-widest text-[#686868] hover:text-[#171717] transition-colors py-1"
              >
                Continue Browsing
              </button>
            </div>
          </div>
        )}
      </div>
    </Drawer>
  );
}
