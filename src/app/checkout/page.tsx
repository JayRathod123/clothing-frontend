'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCart } from '@/hooks/useCart';
import { orderService } from '@/services/order.service';
import { shippingService } from '@/services/shipping.service';
import { cartService } from '@/services/cart.service';
import { formatPrice } from '@/utils/formatters';
import { useUI } from '@/context/UIContext';
import { CheckoutDto, Order } from '@/types/order.types';
import { ShieldCheck, ArrowLeft, CheckCircle2, Truck, CreditCard } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: cart, isLoading } = useCart();
  const { showToast } = useUI();

  // Form Fields
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = cart?.subtotal || 0;
  const items = cart?.items || [];
  const shippingCharge = subtotal >= 999 ? 0 : 99;
  const totalAmount = Math.max(0, subtotal + shippingCharge - discountAmount);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    try {
      const res = await cartService.applyCoupon(couponCode, subtotal);
      if (res.valid) {
        setDiscountAmount(res.discountAmount);
        setAppliedCoupon(couponCode.toUpperCase());
        showToast(res.message);
      } else {
        showToast(res.message, 'error');
      }
    } catch {
      showToast('Could not apply voucher', 'error');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName || !formData.email || !formData.phone || !formData.addressLine1 || !formData.city || !formData.state || !formData.pincode) {
      showToast('Please complete all required shipping fields', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const checkoutDto: CheckoutDto = {
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: 'India',
        },
        couponCode: appliedCoupon || undefined,
        notes: formData.notes,
        paymentMethod,
      };

      const order = await orderService.checkout(checkoutDto);
      setCompletedOrder(order);
      showToast('Order confirmed! Dispatch notification sent.', 'success');
    } catch (err) {
      showToast('Failed to place order. Please check inputs.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Order Confirmation View
  if (completedOrder) {
    return (
      <div className="py-20 md:py-28 bg-[#F7F6F2]">
        <Container size="sm">
          <div className="bg-white border border-[#E6E3DD] p-8 md:p-12 text-center space-y-6">
            <CheckCircle2 className="w-12 h-12 text-[#8A6A45] mx-auto" />
            <div className="space-y-2">
              <span className="editorial-kicker text-[#8A6A45]">TRANSACTION CONFIRMED</span>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
                THANK YOU FOR YOUR PATRONAGE
              </h1>
              <p className="text-xs text-[#686868] max-w-md mx-auto">
                Your order <strong className="text-[#171717]">#{completedOrder.orderNumber}</strong> has been logged into our atelier dispatch queue.
              </p>
            </div>

            {/* Order Brief Box */}
            <div className="bg-[#EFEEE9] p-4 text-xs text-left space-y-2 border border-[#E6E3DD]">
              <div className="flex justify-between">
                <span className="text-[#686868]">Deliver To:</span>
                <span className="font-semibold text-[#171717]">{completedOrder.shippingAddress.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#686868]">Destination:</span>
                <span className="text-[#171717]">
                  {completedOrder.shippingAddress.city}, {completedOrder.shippingAddress.state} — {completedOrder.shippingAddress.pincode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#686868]">Payment Mode:</span>
                <span className="font-semibold text-[#171717]">{completedOrder.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-[#E6E3DD] pt-2 font-semibold">
                <span>Total Amount:</span>
                <span>{formatPrice(completedOrder.totalAmount)}</span>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/account">
                <Button variant="primary" size="md">
                  View in My Orders
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="outline" size="md">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (items.length === 0 && !isLoading) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-semibold text-[#171717]">YOUR BAG IS EMPTY</h2>
        <p className="text-xs text-[#686868]">Add pieces before proceeding to checkout.</p>
        <Link href="/shop">
          <Button variant="primary" size="md">
            Explore Collection
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-10 md:py-16 bg-[#F8F9FA]">
      <Container>
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Cart</span>
          </Link>
        </div>

        <form onSubmit={handleSubmitOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Left Column: Shipping & Payment (7 Cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Step 1: Customer Info */}
              <div className="space-y-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-xs">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">1</span>
                  <span>Contact Information</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    required
                    name="fullName"
                    placeholder="e.g. Arjun Kapoor"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    required
                    name="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Contact Phone Number *"
                      type="tel"
                      required
                      name="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Address */}
              <div className="space-y-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-xs">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">2</span>
                  <span>Shipping Address</span>
                </h3>
                <div className="space-y-4">
                  <Input
                    label="Street Address *"
                    required
                    name="addressLine1"
                    placeholder="Flat / Building / Street name"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                  />
                  <Input
                    label="Apartment, Suite, Landmark (Optional)"
                    name="addressLine2"
                    placeholder="Near Tech Park or Landmark"
                    value={formData.addressLine2}
                    onChange={handleInputChange}
                  />
                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      label="City *"
                      required
                      name="city"
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="State *"
                      required
                      name="state"
                      placeholder="e.g. Maharashtra"
                      value={formData.state}
                      onChange={handleInputChange}
                    />
                    <Input
                      label="Pincode *"
                      required
                      name="pincode"
                      maxLength={6}
                      placeholder="400001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>

              {/* Step 3: Payment Method */}
              <div className="space-y-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-xs">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">3</span>
                  <span>Payment Method</span>
                </h3>
                <div className="space-y-2.5">
                  <label
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'razorpay'
                        ? 'border-black bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'razorpay'}
                        onChange={() => setPaymentMethod('razorpay')}
                        className="accent-black"
                      />
                      <div>
                        <p className="text-xs font-bold text-neutral-900">
                          Online Payment (Cards / UPI / NetBanking)
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Instant confirmation • Extra ₹50 off on Prepaid
                        </p>
                      </div>
                    </div>
                    <CreditCard className="w-4 h-4 text-neutral-600" />
                  </label>

                  <label
                    className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-black bg-neutral-50'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-black"
                      />
                      <div>
                        <p className="text-xs font-bold text-neutral-900">
                          Cash on Delivery (COD)
                        </p>
                        <p className="text-[11px] text-[#686868]">
                          Pay in cash or UPI upon doorstep delivery
                        </p>
                      </div>
                    </div>
                    <Truck className="w-4 h-4 text-[#686868]" />
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column: Order Summary (5 Cols) */}
            <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-neutral-200 shadow-xs space-y-6">
              <h3 className="text-sm font-bold text-neutral-900 border-b border-neutral-200 pb-4">
                Order Summary ({items.length} {items.length === 1 ? 'item' : 'items'})
              </h3>

              {/* Items List */}
              <div className="divide-y divide-neutral-200 max-h-72 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.id} className="py-3 flex gap-3 items-center">
                    <div className="relative w-14 h-18 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200">
                      {item.productImage && (
                        <Image
                          src={item.productImage}
                          alt={item.productName || 'Piece'}
                          fill
                          sizes="60px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0 text-xs">
                      <p className="font-semibold text-[#171717] truncate">{item.productName}</p>
                      <p className="text-[11px] text-[#686868]">
                        Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ''}
                      </p>
                      <p className="font-medium text-[#171717] mt-0.5">
                        {formatPrice(item.currentPrice * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Section */}
              <div className="pt-2 border-t border-neutral-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="COUPON (e.g. FIRST10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-neutral-50 border border-neutral-300 rounded-sm px-3 py-2 text-xs uppercase tracking-wider focus:outline-none focus:border-black"
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    className="px-4 py-2 bg-black text-white text-xs font-bold rounded-sm hover:bg-neutral-800"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Totals */}
              <div className="space-y-2 text-xs pt-2 border-t border-neutral-200">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Shipping</span>
                  <span>{shippingCharge === 0 ? 'FREE' : formatPrice(shippingCharge)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold">
                    <span>Coupon ({appliedCoupon})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                  <span>Total Amount</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <div className="space-y-3 pt-2">
                <Button
                  variant="primary"
                  size="lg"
                  fullWidth
                  type="submit"
                  isLoading={isSubmitting}
                  className="h-12 text-xs font-semibold"
                >
                  Confirm & Place Order
                </Button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-[#929292]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8A6A45]" />
                  <span>256-BIT ENCRYPTED ATELIER CHECKOUT</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
