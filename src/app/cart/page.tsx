'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { ShippingProgressBar } from '@/components/cart/ShippingProgressBar';
import { QuantitySelector } from '@/components/common/QuantitySelector';
import { ProductCard } from '@/components/product/ProductCard';
import { formatPrice } from '@/utils/formatters';
import { useCart, useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart';
import { useProducts } from '@/hooks/useProducts';
import { cartService } from '@/services/cart.service';
import { useUI } from '@/context/UIContext';
import { Trash2, ArrowRight, Tag, ShieldCheck, Truck, RefreshCw, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const router = useRouter();
  const { showToast } = useUI();
  const { data: cart, isLoading } = useCart();
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  // Recommendations
  const { data: productsData } = useProducts({ limit: 4 });
  const recommendations = productsData?.items?.slice(0, 4) || [];

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = cart?.subtotal || 0;
  const items = cart?.items || [];
  const threshold = 799;
  const shippingCharge = subtotal >= threshold ? 0 : 70;
  const finalTotal = Math.max(0, subtotal - discountAmount + shippingCharge);

  const handleUpdateQty = (itemId: string, nextQty: number) => {
    updateItem.mutate({ itemId, quantity: nextQty });
  };

  const handleRemove = (itemId: string, name: string) => {
    removeItem.mutate(itemId);
    showToast(`Removed ${name} from cart`, 'info');
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

  return (
    <div className="min-h-screen bg-white py-8">
      <Container>
        <Breadcrumb items={[{ label: 'Cart' }]} />

        <div className="pt-4 pb-8 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900">
              Your Cart
            </h1>
            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mt-1">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Link
            href="/shop"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="py-20 text-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-bold uppercase tracking-wide text-neutral-900">
              Your bag is currently empty
            </h2>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Explore our latest 240 GSM heavyweight oversized collection and limited graphic drops.
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => router.push('/shop')}
              >
                Shop New Arrivals
              </Button>
            </div>
          </div>
        ) : (
          <div className="pt-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Cart Items (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-6">
              {/* Shipping Progress */}
              <ShippingProgressBar subtotal={subtotal} />

              {/* Items List */}
              <div className="bg-white border border-neutral-200 divide-y divide-neutral-200">
                {items.map((item) => (
                  <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start">
                    {/* Thumbnail */}
                    <div className="relative w-24 h-32 sm:w-28 sm:h-36 bg-neutral-100 shrink-0 overflow-hidden border border-neutral-200">
                      {item.productImage && (
                        <Image
                          src={item.productImage}
                          alt={item.productName || 'T-Shirt'}
                          fill
                          sizes="120px"
                          className="object-cover object-center"
                        />
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col justify-between self-stretch">
                      <div>
                        <div className="flex items-start justify-between gap-4">
                          <Link
                            href={`/product/${item.productSlug || 'oversized-essential-tee'}`}
                            className="text-sm font-bold text-neutral-900 hover:text-neutral-600 transition-colors uppercase tracking-tight line-clamp-1"
                          >
                            {item.productName}
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleRemove(item.id, item.productName || 'item')}
                            className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center gap-3 mt-1.5 text-xs text-neutral-500 font-medium">
                          <span className="bg-neutral-100 px-2 py-0.5 border border-neutral-200 font-bold text-neutral-700">
                            Size: {item.size}
                          </span>
                          <span>•</span>
                          <span>Color: {item.color}</span>
                        </div>

                        <div className="mt-2 text-xs font-semibold text-neutral-900">
                          {formatPrice(item.currentPrice)} each
                        </div>
                      </div>

                      {/* Bottom row: Stepper & Subtotal */}
                      <div className="pt-4 flex items-center justify-between border-t border-neutral-100 mt-4">
                        <QuantitySelector
                          quantity={item.quantity}
                          min={1}
                          max={item.availableStock || 25}
                          size="sm"
                          onChange={(qty) => handleUpdateQty(item.id, qty)}
                        />

                        <div className="text-right">
                          <span className="text-xs text-neutral-400 block font-normal">Subtotal</span>
                          <span className="text-sm font-bold text-neutral-900">
                            {formatPrice(item.currentPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-white border border-neutral-200 flex items-center gap-3">
                  <Truck className="w-4 h-4 text-neutral-700 shrink-0" />
                  <span className="text-xs text-neutral-700 font-semibold">Fast Pan-India Dispatch</span>
                </div>
                <div className="p-3 bg-white border border-neutral-200 flex items-center gap-3">
                  <RefreshCw className="w-4 h-4 text-neutral-700 shrink-0" />
                  <span className="text-xs text-neutral-700 font-semibold">7 Days Easy Exchange</span>
                </div>
                <div className="p-3 bg-white border border-neutral-200 flex items-center gap-3">
                  <ShieldCheck className="w-4 h-4 text-neutral-700 shrink-0" />
                  <span className="text-xs text-neutral-700 font-semibold">100% Genuine 240 GSM</span>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (4 cols) */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white border border-neutral-200 p-6 space-y-6 sticky top-24">
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900 pb-3 border-b border-neutral-200">
                  Order Summary
                </h3>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="PROMO CODE"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full bg-neutral-50 border border-neutral-200 pl-9 pr-3 py-2 text-xs font-bold uppercase tracking-wider focus:bg-white focus:border-black focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isApplyingCoupon || !couponCode.trim()}
                      className="px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                    >
                      Apply
                    </button>
                  </div>

                  {appliedCoupon && (
                    <div className="flex items-center justify-between text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1.5 border border-emerald-200">
                      <span>Voucher Applied: {appliedCoupon}</span>
                      <span>-{formatPrice(discountAmount)}</span>
                    </div>
                  )}
                </form>

                {/* Calculation Rows */}
                <div className="space-y-2.5 text-xs pt-2">
                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Bag Subtotal</span>
                    <span className="font-semibold text-neutral-900">{formatPrice(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex items-center justify-between text-emerald-700">
                      <span>Promotional Discount</span>
                      <span className="font-bold">-{formatPrice(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Estimated Shipping</span>
                    <span>
                      {shippingCharge === 0 ? (
                        <span className="font-bold text-emerald-600 uppercase">FREE</span>
                      ) : (
                        <span className="font-semibold text-neutral-900">{formatPrice(shippingCharge)}</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-neutral-600">
                    <span>Applicable GST</span>
                    <span className="text-neutral-500 font-medium">Included in MRP</span>
                  </div>

                  <div className="flex items-center justify-between text-base font-black text-neutral-900 pt-3 border-t border-neutral-200">
                    <span>Total Amount</span>
                    <span>{formatPrice(finalTotal)}</span>
                  </div>
                </div>

                {/* Checkout Action */}
                <div className="space-y-2.5 pt-2">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    onClick={() => router.push('/checkout')}
                    className="h-12 text-xs font-extrabold uppercase tracking-widest"
                  >
                    Proceed to Checkout <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>

                  <p className="text-[11px] text-neutral-400 text-center">
                    Taxes calculated • Secure 256-bit encrypted checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* You May Also Like Section */}
        {recommendations.length > 0 && (
          <div className="mt-20 pt-12 border-t border-neutral-200">
            <div className="space-y-1 mb-8">
              <span className="text-[11px] font-black uppercase tracking-[0.2em] text-red-600">
                COMPLETE YOUR FIT
              </span>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-neutral-900">
                You May Also Like
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {recommendations.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
