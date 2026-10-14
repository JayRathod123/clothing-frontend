'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { orderService } from '@/services/order.service';
import { paymentService, loadRazorpayScript } from '@/services/payment.service';
import { cartService } from '@/services/cart.service';
import { shippingService } from '@/services/shipping.service';
import { settingsService, StoreSettings } from '@/services/settings.service';
import { formatPrice } from '@/utils/formatters';
import { useUI } from '@/context/UIContext';
import { CheckoutDto, Order } from '@/types/order.types';
import { ShieldCheck, ArrowLeft, CheckCircle2, Truck, CreditCard, Lock, UserCheck, Loader2, AlertCircle, Check } from 'lucide-react';
import { PhonePeIcon, GooglePayIcon, PaytmIcon } from '@/components/common/PaymentIcons';

export default function CheckoutPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: cart, isLoading } = useCart();
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { showToast, openAuthModal } = useUI();

  // Public Store Settings (Payment gateways, COD limits, Shipping thresholds)
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);

  useEffect(() => {
    settingsService.getPublicSettings().then((s) => {
      if (s) setStoreSettings(s);
    });
  }, []);

  // Form Fields (Shipping)
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

  // Billing Address State (deselected by default, form open by default)
  const [billingSameAsShipping, setBillingSameAsShipping] = useState<boolean>(false);
  const [billingData, setBillingData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    country: 'India',
  });

  // Check if all required shipping & contact fields are filled
  const isShippingAddressComplete = Boolean(
    formData.fullName.trim() &&
    formData.phone.trim() &&
    formData.addressLine1.trim() &&
    formData.city.trim() &&
    formData.state.trim() &&
    formData.pincode.trim()
  );

  // If shipping fields become incomplete, auto-uncheck "same as shipping"
  useEffect(() => {
    if (!isShippingAddressComplete && billingSameAsShipping) {
      setBillingSameAsShipping(false);
    }
  }, [isShippingAddressComplete, billingSameAsShipping]);


  // Pincode Serviceability & Live Shipping Calculation State
  const [pincodeStatus, setPincodeStatus] = useState<{
    isChecking: boolean;
    checkedPincode: string;
    isServiceable: boolean | null;
    codAvailable: boolean;
    estimatedDays: number | null;
    message: string;
  }>({
    isChecking: false,
    checkedPincode: '',
    isServiceable: null,
    codAvailable: true,
    estimatedDays: null,
    message: '',
  });
  const [calculatedShipping, setCalculatedShipping] = useState<number | null>(null);

  // Autofill user details when authenticated
  useEffect(() => {
    if (user) {
      const rawPhone = (user.phone || '').replace(/\D/g, '');
      const cleanPhone = rawPhone.length > 10 ? rawPhone.slice(-10) : rawPhone;
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        email: prev.email || user.email || '',
        phone: prev.phone || cleanPhone,
      }));
    }
  }, [user]);

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const subtotal = cart?.subtotal || 0;
  const items = cart?.items || [];

  // Shipping Calculation (dynamic based on live check or store settings)
  const freeShippingThreshold = storeSettings?.shipping_settings?.defaultFreeShippingThreshold ?? 999;
  const defaultFlatRate = storeSettings?.shipping_settings?.defaultFlatRate ?? 99;
  const shippingCharge =
    calculatedShipping !== null
      ? calculatedShipping
      : subtotal >= freeShippingThreshold
        ? 0
        : defaultFlatRate;

  // 5% Discount on Online Payment (Prepaid / Razorpay)
  const baseForOnlineDiscount = Math.max(0, subtotal - discountAmount);
  const onlineDiscount = paymentMethod === 'razorpay' ? Math.round(baseForOnlineDiscount * 0.05) : 0;
  const totalAmount = Math.max(0, subtotal + shippingCharge - discountAmount - onlineDiscount);

  // Gateways configuration from store settings
  const enabledGateways = storeSettings?.payment_settings?.enabledGateways || ['razorpay', 'cod'];
  const isCodGloballyAvailable = storeSettings?.payment_settings?.codAvailable ?? true;
  const minCodValue = storeSettings?.payment_settings?.minCodOrderValue ?? 0;
  const maxCodValue = storeSettings?.payment_settings?.maxCodOrderValue ?? 50000;
  const isCodAmountEligible = subtotal >= minCodValue && subtotal <= maxCodValue;
  const isCodAllowed =
    enabledGateways.includes('cod') &&
    isCodGloballyAvailable &&
    isCodAmountEligible &&
    (pincodeStatus.isServiceable === null || pincodeStatus.codAvailable);

  // Trigger pincode serviceability check & live shipping calculation when 6 digits entered
  useEffect(() => {
    const pin = formData.pincode.trim();
    if (pin.length === 6 && /^\d{6}$/.test(pin)) {
      setPincodeStatus((prev) => ({ ...prev, isChecking: true, checkedPincode: pin }));
      Promise.all([
        shippingService.checkPincode(pin),
        shippingService.calculateShipping(subtotal, pin),
      ])
        .then(([serviceability, calc]) => {
          setPincodeStatus({
            isChecking: false,
            checkedPincode: pin,
            isServiceable: serviceability.isServiceable,
            codAvailable: serviceability.codAvailable,
            estimatedDays: serviceability.estimatedDays ?? null,
            message: serviceability.message || '',
          });
          setCalculatedShipping(calc.shippingCharge);
        })
        .catch(() => {
          setPincodeStatus((prev) => ({ ...prev, isChecking: false }));
        });
    } else {
      setPincodeStatus({
        isChecking: false,
        checkedPincode: '',
        isServiceable: null,
        codAvailable: true,
        estimatedDays: null,
        message: '',
      });
      setCalculatedShipping(null);
    }
  }, [formData.pincode, subtotal]);

  // Form Validation & Focus Tracking
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string => {
    const val = (value || '').trim();
    switch (name) {
      case 'fullName':
      case 'billing_fullName':
        if (!val) return 'Full name is required';
        if (val.length < 2) return 'Full name must be at least 2 characters';
        return '';

      case 'email':
        if (!val) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address';
        return '';

      case 'phone':
      case 'billing_phone':
        if (!val) return 'Contact phone number is required';
        const digits = val.replace(/\D/g, '');
        if (digits.length !== 10) return 'Please enter a valid 10-digit phone number';
        return '';

      case 'addressLine1':
      case 'billing_addressLine1':
        if (!val) return 'Street address is required';
        return '';

      case 'city':
      case 'billing_city':
        if (!val) return 'City is required';
        return '';

      case 'state':
      case 'billing_state':
        if (!val) return 'State is required';
        return '';

      case 'pincode':
      case 'billing_pincode':
        if (!val) return 'Pincode is required';
        if (!/^\d{6}$/.test(val)) return 'Please enter a valid 6-digit pincode';
        return '';

      default:
        return '';
    }
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const val = (formData as any)[fieldName] || '';
    const err = validateField(fieldName, val);
    setErrors((prev) => ({ ...prev, [fieldName]: err }));
  };

  const handleBillingBlur = (fieldName: string, rawKey: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const val = (billingData as any)[rawKey] || '';
    const err = validateField(fieldName, val);
    setErrors((prev) => ({ ...prev, [fieldName]: err }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const cleanValue = name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    if (touched[name]) {
      const err = validateField(name, cleanValue);
      setErrors((prev) => ({ ...prev, [name]: err }));
    }
  };

  const handleBillingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const cleanValue = name === 'phone' ? value.replace(/\D/g, '').slice(0, 10) : value;
    setBillingData((prev) => ({ ...prev, [name]: cleanValue }));
    const errorKey = `billing_${name}`;
    if (touched[errorKey]) {
      const err = validateField(errorKey, cleanValue);
      setErrors((prev) => ({ ...prev, [errorKey]: err }));
    }
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
    } catch {
      showToast('Could not apply voucher', 'error');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enforce Authentication Check
    if (!isAuthenticated) {
      showToast('Please sign in or create an account to complete your checkout', 'error');
      openAuthModal();
      return;
    }

    if (items.length === 0) {
      showToast('Your cart is empty. Please add items before checking out.', 'error');
      return;
    }

    // Full form validation check
    const newErrors: Record<string, string> = {
      fullName: validateField('fullName', formData.fullName),
      email: validateField('email', formData.email),
      phone: validateField('phone', formData.phone),
      addressLine1: validateField('addressLine1', formData.addressLine1),
      city: validateField('city', formData.city),
      state: validateField('state', formData.state),
      pincode: validateField('pincode', formData.pincode),
    };

    if (!billingSameAsShipping) {
      newErrors.billing_fullName = validateField('billing_fullName', billingData.fullName);
      newErrors.billing_phone = validateField('billing_phone', billingData.phone);
      newErrors.billing_addressLine1 = validateField('billing_addressLine1', billingData.addressLine1);
      newErrors.billing_city = validateField('billing_city', billingData.city);
      newErrors.billing_state = validateField('billing_state', billingData.state);
      newErrors.billing_pincode = validateField('billing_pincode', billingData.pincode);
    }

    const allTouched: Record<string, boolean> = {};
    Object.keys(newErrors).forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) {
      showToast('Please complete all required fields correctly', 'error');
      return;
    }

    if (pincodeStatus.isServiceable === false) {
      showToast(pincodeStatus.message || `Delivery is not currently available for pincode '${formData.pincode}'`, 'error');
      return;
    }

    if (paymentMethod === 'cod' && !isCodAllowed) {
      showToast('Cash on Delivery is not available for this order or destination', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const resolvedBilling = billingSameAsShipping
        ? {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2 || undefined,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: 'India',
        }
        : {
          fullName: billingData.fullName,
          phone: billingData.phone,
          addressLine1: billingData.addressLine1,
          addressLine2: billingData.addressLine2 || undefined,
          city: billingData.city,
          state: billingData.state,
          pincode: billingData.pincode,
          country: 'India',
        };

      const checkoutDto: CheckoutDto = {
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine1: formData.addressLine1,
          addressLine2: formData.addressLine2 || undefined,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          country: 'India',
        },
        billingAddress: resolvedBilling,
        couponCode: appliedCoupon || undefined,
        notes: formData.notes || undefined,
        paymentMethod,
      };

      // 1. Create order on backend (requires Bearer token, deducts stock atomically, clears cart)
      const order = await orderService.checkout(checkoutDto);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });

      // 2. Handle Payment Flow
      if (paymentMethod === 'razorpay') {
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          showToast('Failed to load secure payment gateway. Please check your network.', 'error');
          setIsSubmitting(false);
          return;
        }

        try {
          // Initialize Razorpay order on backend
          const paymentData = await paymentService.createPaymentOrder(order.id);
          const rzpKey = paymentData.keyId || paymentData.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_51eFzT3L8W7H0b';
          const rzpOrderId = paymentData.razorpayOrderId || paymentData.id;
          const rzpAmount = paymentData.amount || Math.round(order.totalAmount * 100);

          const options = {
            key: rzpKey,
            amount: rzpAmount,
            currency: paymentData.currency || 'INR',
            name: storeSettings?.store_info?.name || 'AURA // ATELIER',
            description: `Order #${order.orderNumber || order.id.slice(-8)}`,
            order_id: rzpOrderId,
            prefill: {
              name: formData.fullName,
              email: formData.email,
              contact: formData.phone,
            },
            notes: {
              orderId: order.id,
              orderNumber: order.orderNumber,
            },
            theme: {
              color: '#171717',
            },
            handler: async function (response: any) {
              try {
                setIsSubmitting(true);
                await paymentService.verifyPayment({
                  orderId: order.id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                });
                order.paymentStatus = 'paid';
                setCompletedOrder(order);
                queryClient.invalidateQueries({ queryKey: ['cart'] });
                queryClient.invalidateQueries({ queryKey: ['orders'] });
                showToast('Payment successful! Your order has been placed.', 'success');
              } catch (err: any) {
                console.error('Payment verification failed:', err);
                showToast(err.message || 'Payment signature verification failed', 'error');
                setCompletedOrder(order);
              } finally {
                setIsSubmitting(false);
              }
            },
            modal: {
              ondismiss: function () {
                setIsSubmitting(false);
                showToast('Payment window closed. Your order was logged and can be viewed in My Orders.', 'info');
                setCompletedOrder(order);
              },
            },
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.on('payment.failed', function (resp: any) {
            console.error('Razorpay payment failed:', resp.error);
            showToast(resp.error?.description || 'Payment was unsuccessful', 'error');
            setIsSubmitting(false);
            setCompletedOrder(order);
          });
          rzp.open();
        } catch (payErr: any) {
          console.error('Payment initiation error:', payErr);
          showToast(payErr.message || 'Failed to initialize payment gateway', 'error');
          setCompletedOrder(order);
          setIsSubmitting(false);
        }
      } else {
        // Cash on Delivery
        setCompletedOrder(order);
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        queryClient.invalidateQueries({ queryKey: ['orders'] });
        showToast('Order confirmed! Dispatch notification sent.', 'success');
        setIsSubmitting(false);
      }
    } catch (err: any) {
      console.error('Order submission error:', err);
      showToast(err.message || 'Failed to place order. Please check inputs.', 'error');
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
              <span className="editorial-kicker text-[#8A6A45]">TRANSACTION LOGGED</span>
              <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
                THANK YOU FOR YOUR ORDER
              </h1>
              <p className="text-xs text-[#686868] max-w-md mx-auto">
                Your order <strong className="text-[#171717]">#{completedOrder.orderNumber}</strong> has been saved to your account.
              </p>
            </div>

            {/* Order Brief Box */}
            <div className="bg-[#EFEEE9] p-4 text-xs text-left space-y-2 border border-[#E6E3DD]">
              <div className="flex justify-between">
                <span className="text-[#686868]">Deliver To:</span>
                <span className="font-semibold text-[#171717]">{completedOrder.shippingAddress?.fullName || formData.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#686868]">Destination:</span>
                <span className="text-[#171717]">
                  {completedOrder.shippingAddress?.city || formData.city}, {completedOrder.shippingAddress?.state || formData.state} — {completedOrder.shippingAddress?.pincode || formData.pincode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#686868]">Payment Mode:</span>
                <span className="font-semibold text-[#171717]">
                  {completedOrder.paymentMethod === 'razorpay' ? 'Prepaid (Online)' : 'Cash on Delivery (COD)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#686868]">Payment Status:</span>
                <span className={`font-bold ${completedOrder.paymentStatus === 'paid' ? 'text-emerald-700' : 'text-amber-800'}`}>
                  {completedOrder.paymentStatus === 'paid' ? 'PAID (Verified)' : 'PENDING'}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#E6E3DD] pt-2 font-semibold">
                <span>Total Amount:</span>
                <span>{formatPrice(completedOrder.totalAmount || totalAmount)}</span>
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

        {/* Authentication Notice Banner if Not Authenticated */}
        {!isAuthenticated && (
          <div className="mb-8 p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0 mt-0.5">
                <Lock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-neutral-900 tracking-tight">
                  Login Required to Place Order
                </h4>
                <p className="text-xs text-neutral-600 mt-0.5 max-w-xl">
                  Checkout requires an active customer session for stock allocation, invoice generation, and delivery tracking.
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={openAuthModal}
              className="shrink-0 text-xs font-bold uppercase tracking-wider"
            >
              Sign In / Register
            </Button>
          </div>
        )}

        {/* Authenticated User Status */}
        {isAuthenticated && user && (
          <div className="mb-6 p-4 bg-emerald-50/90 border border-emerald-200 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-emerald-950">Logged in as {user.email}</p>
                <p className="text-[11px] text-emerald-700">Order will be attached to your customer profile</p>
              </div>
            </div>
            <button
              type="button"
              onClick={openAuthModal}
              className="text-xs font-semibold text-emerald-900 underline hover:text-black cursor-pointer"
            >
              Account Details
            </button>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} noValidate>
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
                    name="fullName"
                    placeholder="e.g. Arjun Kapoor"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('fullName')}
                    error={touched.fullName ? errors.fullName : undefined}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    name="email"
                    placeholder="name@domain.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('email')}
                    error={touched.email ? errors.email : undefined}
                  />
                  <div className="sm:col-span-2">
                    <Input
                      label="Contact Phone Number *"
                      type="tel"
                      name="phone"
                      maxLength={10}
                      inputMode="numeric"
                      prefixText="+91"
                      placeholder="98765 43210"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('phone')}
                      error={touched.phone ? errors.phone : undefined}
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
                    name="addressLine1"
                    placeholder="Flat / Building / Street name"
                    value={formData.addressLine1}
                    onChange={handleInputChange}
                    onBlur={() => handleBlur('addressLine1')}
                    error={touched.addressLine1 ? errors.addressLine1 : undefined}
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
                      name="city"
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('city')}
                      error={touched.city ? errors.city : undefined}
                    />
                    <Input
                      label="State *"
                      name="state"
                      placeholder="e.g. Maharashtra"
                      value={formData.state}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('state')}
                      error={touched.state ? errors.state : undefined}
                    />
                    <Input
                      label="Pincode *"
                      name="pincode"
                      maxLength={6}
                      placeholder="400001"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      onBlur={() => handleBlur('pincode')}
                      error={
                        touched.pincode
                          ? errors.pincode || (pincodeStatus.isServiceable === false ? (pincodeStatus.message || `Pincode '${formData.pincode}' is not serviceable`) : undefined)
                          : (pincodeStatus.isServiceable === false ? (pincodeStatus.message || `Pincode '${formData.pincode}' is not serviceable`) : undefined)
                      }
                    />
                  </div>

                  {/* Pincode Serviceability Indicator */}
                  {pincodeStatus.isChecking && (
                    <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-neutral-800" />
                      <span>Checking delivery serviceability with logistics network...</span>
                    </div>
                  )}
                  {pincodeStatus.checkedPincode && !pincodeStatus.isChecking && pincodeStatus.isServiceable === true && (
                    <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg p-3">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-semibold">Delivery Available: </span>
                        <span>
                          Expected in {pincodeStatus.estimatedDays ? `~${pincodeStatus.estimatedDays} business days` : '3–4 business days'}{' '}
                          {pincodeStatus.codAvailable ? '• Cash on Delivery available' : '• Prepaid payment only'}
                        </span>
                      </div>
                    </div>
                  )}
                  {pincodeStatus.checkedPincode && !pincodeStatus.isChecking && pincodeStatus.isServiceable === false && (
                    <div className="flex items-start gap-2 text-xs text-rose-800 bg-rose-50 border border-rose-200 rounded-lg p-3">
                      <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">Unserviceable Pincode: </span>
                        <span>{pincodeStatus.message || `Delivery is not currently available for pincode '${formData.pincode}'`}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Billing Address */}
              <div className="space-y-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-xs">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">3</span>
                  <span>Billing Address</span>
                </h3>

                {/* Checkbox: Same as shipping address */}
                <label
                  className={`flex items-center gap-3 p-3.5 border rounded-xl select-none transition-colors ${!isShippingAddressComplete
                    ? 'bg-neutral-100/60 border-neutral-200 opacity-60 cursor-not-allowed'
                    : 'bg-neutral-50 border-neutral-200 cursor-pointer hover:bg-neutral-100/70'
                    }`}
                >
                  <input
                    type="checkbox"
                    disabled={!isShippingAddressComplete}
                    checked={billingSameAsShipping}
                    onChange={(e) => {
                      if (!isShippingAddressComplete) return;
                      const isSame = e.target.checked;
                      setBillingSameAsShipping(isSame);
                      if (isSame) {
                        setBillingData({
                          fullName: formData.fullName,
                          phone: formData.phone,
                          addressLine1: formData.addressLine1,
                          addressLine2: formData.addressLine2,
                          city: formData.city,
                          state: formData.state,
                          pincode: formData.pincode,
                          country: 'India',
                        });
                      }
                    }}
                    className="w-4 h-4 rounded border-neutral-300 text-black focus:ring-black accent-black cursor-pointer disabled:cursor-not-allowed"
                  />
                  <div>
                    <span className="text-xs font-bold text-neutral-900 block">
                      Billing address is the same as shipping address
                    </span>
                    <span className="text-[11px] text-neutral-500 block">
                      {!isShippingAddressComplete
                        ? 'Fill in all shipping address fields above to enable this option'
                        : 'Tax invoices and financial records will mirror your shipping destination'}
                    </span>
                  </div>
                </label>

                {/* Expanded Billing Address Form if not same */}
                {!billingSameAsShipping && (
                  <div className="space-y-4 pt-3 border-t border-neutral-100">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        label="Full Name *"
                        name="fullName"
                        placeholder="e.g. Arjun Kapoor"
                        value={billingData.fullName}
                        onChange={handleBillingInputChange}
                        onBlur={() => handleBillingBlur('billing_fullName', 'fullName')}
                        error={touched.billing_fullName ? errors.billing_fullName : undefined}
                      />
                      <Input
                        label="Contact Phone Number *"
                        type="tel"
                        name="phone"
                        maxLength={10}
                        inputMode="numeric"
                        prefixText="+91"
                        placeholder="98765 43210"
                        value={billingData.phone}
                        onChange={handleBillingInputChange}
                        onBlur={() => handleBillingBlur('billing_phone', 'phone')}
                        error={touched.billing_phone ? errors.billing_phone : undefined}
                      />
                    </div>

                    <Input
                      label="Street Address *"
                      name="addressLine1"
                      placeholder="Flat / Building / Street name"
                      value={billingData.addressLine1}
                      onChange={handleBillingInputChange}
                      onBlur={() => handleBillingBlur('billing_addressLine1', 'addressLine1')}
                      error={touched.billing_addressLine1 ? errors.billing_addressLine1 : undefined}
                    />
                    <Input
                      label="Apartment, Suite, Landmark (Optional)"
                      name="addressLine2"
                      placeholder="Near Tech Park or Landmark"
                      value={billingData.addressLine2}
                      onChange={handleBillingInputChange}
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <Input
                        label="City *"
                        name="city"
                        placeholder="e.g. Mumbai"
                        value={billingData.city}
                        onChange={handleBillingInputChange}
                        onBlur={() => handleBillingBlur('billing_city', 'city')}
                        error={touched.billing_city ? errors.billing_city : undefined}
                      />
                      <Input
                        label="State *"
                        name="state"
                        placeholder="e.g. Maharashtra"
                        value={billingData.state}
                        onChange={handleBillingInputChange}
                        onBlur={() => handleBillingBlur('billing_state', 'state')}
                        error={touched.billing_state ? errors.billing_state : undefined}
                      />
                      <Input
                        label="Pincode *"
                        name="pincode"
                        maxLength={6}
                        placeholder="400001"
                        value={billingData.pincode}
                        onChange={handleBillingInputChange}
                        onBlur={() => handleBillingBlur('billing_pincode', 'pincode')}
                        error={touched.billing_pincode ? errors.billing_pincode : undefined}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Step 4: Payment Method */}
              <div className="space-y-4 bg-white p-6 rounded-xl border border-neutral-200 shadow-xs">
                <h3 className="text-sm font-bold text-neutral-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-black text-white text-xs flex items-center justify-center font-bold">4</span>
                  <span>Payment Method</span>
                </h3>
                <div className="space-y-2.5">
                  {enabledGateways.includes('razorpay') && (
                    <label
                      className={`flex items-center justify-between p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'razorpay'
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
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-xs font-bold text-neutral-900">
                              Pay Prepaid
                            </p>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wider">
                              Extra 5% OFF
                            </span>
                            <div className="inline-flex items-center gap-2">
                              <PhonePeIcon className="w-6 h-6" />
                              <GooglePayIcon className="w-6 h-6" />
                              <PaytmIcon className="w-6 h-6" />
                            </div>
                          </div>
                          <p className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                            Instant 5% discount applied • UPI, Cards, NetBanking & Wallets
                          </p>
                        </div>
                      </div>
                      <CreditCard className="w-4 h-4 text-neutral-600" />
                    </label>
                  )}

                  {enabledGateways.includes('cod') && isCodGloballyAvailable && (
                    <label
                      className={`flex items-center justify-between p-4 border rounded-lg transition-colors ${!isCodAllowed
                        ? 'opacity-60 bg-neutral-50/50 cursor-not-allowed border-neutral-200'
                        : paymentMethod === 'cod'
                          ? 'border-black bg-neutral-50 cursor-pointer'
                          : 'border-neutral-200 hover:border-neutral-400 cursor-pointer'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="payment"
                          disabled={!isCodAllowed}
                          checked={paymentMethod === 'cod'}
                          onChange={() => isCodAllowed && setPaymentMethod('cod')}
                          className="accent-black"
                        />
                        <div>
                          <p className="text-xs font-bold text-neutral-900">
                            Cash on Delivery (COD)
                          </p>
                          <p className="text-[11px] text-[#686868]">
                            {!isCodAmountEligible
                              ? `Available for orders between ${formatPrice(minCodValue)} and ${formatPrice(maxCodValue)}`
                              : pincodeStatus.isServiceable && !pincodeStatus.codAvailable
                                ? `COD not available for pincode ${formData.pincode}`
                                : 'Pay in cash or UPI upon doorstep delivery (No online discount)'}
                          </p>
                        </div>
                      </div>
                      <Truck className="w-4 h-4 text-[#686868]" />
                    </label>
                  )}
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
                        Qty: {item.quantity} {item.size ? ` • Size: ${item.size}` : ''}
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
                    disabled={isApplyingCoupon || !couponCode.trim()}
                    className="px-4 py-2 bg-black text-white text-xs font-bold rounded-sm hover:bg-neutral-800 disabled:opacity-50 transition-colors flex items-center gap-1.5 min-w-[70px] justify-center cursor-pointer"
                  >
                    {isApplyingCoupon ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Applying...</span>
                      </>
                    ) : (
                      'Apply'
                    )}
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
                {onlineDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-bold bg-emerald-50/80 px-2.5 py-1.5 rounded-md border border-emerald-200/80">
                    <span>Online Payment Discount (5%)</span>
                    <span>-{formatPrice(onlineDiscount)}</span>
                  </div>
                )}
                {paymentMethod === 'cod' && baseForOnlineDiscount > 0 && (
                  <div className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded-md border border-amber-200 flex items-center justify-between">
                    <span>Save {formatPrice(Math.round(baseForOnlineDiscount * 0.05))} with online payment</span>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('razorpay')}
                      className="font-bold underline cursor-pointer text-neutral-900 hover:text-black"
                    >
                      Pay Online
                    </button>
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
                  disabled={pincodeStatus.isServiceable === false}
                  className="h-12 text-xs font-semibold tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {!isAuthenticated ? (
                    <span className="flex items-center justify-center gap-2">
                      <Lock className="w-4 h-4" />
                      Sign In to Complete Order
                    </span>
                  ) : pincodeStatus.isServiceable === false ? (
                    'Pincode Not Serviceable'
                  ) : paymentMethod === 'razorpay' ? (
                    `Pay Prepaid ${formatPrice(totalAmount)}`
                  ) : (
                    'Confirm & Place Order (COD)'
                  )}
                </Button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-[#929292]">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#8A6A45]" />
                  <span>256-BIT ENCRYPTED PREPAID & COD CHECKOUT</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </Container>
    </div>
  );
}
