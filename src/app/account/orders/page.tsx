'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { orderService } from '@/services/order.service';
import { useQuery } from '@tanstack/react-query';
import { formatPrice, formatDate } from '@/utils/formatters';
import { useUI } from '@/context/UIContext';
import { Package, Truck, ArrowLeft, CheckCircle2, Clock } from 'lucide-react';

export default function OrdersPage() {
  const { user, isAuthenticated } = useAuth();
  const { openAuthModal } = useUI();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['myOrders', isAuthenticated],
    queryFn: () => orderService.getMyOrders(),
    enabled: Boolean(isAuthenticated),
  });

  if (!isAuthenticated) {
    return (
      <div className="py-24 md:py-32 bg-neutral-50/60 text-center">
        <Container size="sm">
          <div className="bg-white border border-neutral-200 p-8 md:p-12 space-y-6 rounded-xl shadow-xs">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-800">
              <Package className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 uppercase">
                Sign in to view your orders
              </h1>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto leading-relaxed">
                Log in to your account to view past purchases, invoice downloads, and live courier tracking.
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
    <div className="py-8 min-h-screen bg-neutral-50/60">
      <Container>
        <Breadcrumb items={[{ label: 'Account', href: '/account' }, { label: 'Orders' }]} />

        <div className="pt-4 pb-8 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900">
              My Orders & Dispatches
            </h1>
            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mt-1">
              Live fulfillment status, order history, and courier tracking
            </p>
          </div>
          <Link
            href="/account"
            className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-neutral-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Account</span>
          </Link>
        </div>

        {/* Orders Content */}
        <div className="pt-8 max-w-4xl">
          {isLoading ? (
            <div className="py-20 text-center">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-white border border-neutral-200 p-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
                <Package className="w-8 h-8" />
              </div>
              <h2 className="text-lg font-bold uppercase tracking-wide text-neutral-900">
                No orders placed yet
              </h2>
              <p className="text-xs text-neutral-500 max-w-md mx-auto leading-relaxed">
                When you place an order, live tracking, courier AWB details, and invoice download will appear right here.
              </p>
              <div className="pt-2">
                <Button variant="primary" size="md" onClick={() => window.location.href = '/shop'}>
                  Shop The Drop
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const isDelivered = order.status === 'delivered';
                const isShipped = order.status === 'shipped';
                const isConfirmed = order.status === 'confirmed';
                const isPending = order.status === 'pending';

                return (
                  <div
                    key={order.id}
                    className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-6 shadow-xs"
                  >
                    {/* Header */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-neutral-200">
                      <div>
                        <div className="flex items-center gap-3">
                          <span className="font-black text-sm uppercase text-neutral-900 tracking-wider">
                            #{order.orderNumber}
                          </span>
                          <span className={`inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 border ${
                            isDelivered
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : isShipped
                              ? 'bg-blue-50 text-blue-800 border-blue-200'
                              : isConfirmed
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-neutral-100 text-neutral-800 border-neutral-200'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          Placed on {formatDate(order.placedAt || order.createdAt)}
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-xs text-neutral-400 block font-medium">Total Paid</span>
                        <span className="text-base font-black text-neutral-900">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    {/* Tracking Progress Timeline */}
                    <div className="bg-neutral-50 p-4 border border-neutral-200/80">
                      <div className="grid grid-cols-4 text-[11px] font-bold uppercase tracking-wider text-center mb-2">
                        <span className={`flex items-center justify-center gap-1 ${isPending || isConfirmed || isShipped || isDelivered ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Placed
                        </span>
                        <span className={`flex items-center justify-center gap-1 ${isConfirmed || isShipped || isDelivered ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          <CheckCircle2 className={`w-3.5 h-3.5 ${isConfirmed || isShipped || isDelivered ? 'text-emerald-600' : 'text-neutral-300'}`} /> Confirmed
                        </span>
                        <span className={`flex items-center justify-center gap-1 ${isShipped || isDelivered ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          <Truck className={`w-3.5 h-3.5 ${isShipped || isDelivered ? 'text-blue-600' : 'text-neutral-300'}`} /> Dispatched
                        </span>
                        <span className={`flex items-center justify-center gap-1 ${isDelivered ? 'text-neutral-900' : 'text-neutral-400'}`}>
                          <Clock className={`w-3.5 h-3.5 ${isDelivered ? 'text-emerald-600' : 'text-neutral-300'}`} /> Delivered
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-200 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isDelivered ? 'w-full bg-emerald-600' : isShipped ? 'w-3/4 bg-blue-600' : isConfirmed ? 'w-1/2 bg-neutral-900' : 'w-1/4 bg-amber-500'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="divide-y divide-neutral-100">
                      {(order.items || []).map((item) => (
                        <div
                          key={item.id}
                          className="py-3.5 flex items-center justify-between gap-4 text-xs"
                        >
                          <div className="flex items-center gap-3.5">
                            {item.productImage ? (
                              <div className="relative w-14 h-18 bg-neutral-100 rounded-lg border border-neutral-200 shrink-0 overflow-hidden">
                                <Image
                                  src={item.productImage}
                                  alt={item.productName}
                                  fill
                                  sizes="60px"
                                  className="object-cover"
                                />
                              </div>
                            ) : (
                              <div className="w-14 h-18 bg-neutral-100 rounded-lg border border-neutral-200 shrink-0 flex items-center justify-center text-neutral-400">
                                <Package className="w-6 h-6" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-neutral-900 uppercase tracking-tight">
                                {item.productName}
                              </p>
                              <p className="text-[11px] text-neutral-500 mt-0.5">
                                {item.size ? `Size: ${item.size} • ` : ''}
                                {item.sku ? `SKU: ${item.sku} • ` : ''}
                                {item.color ? `Color: ${item.color} • ` : ''}
                                Qty: {item.quantity}
                              </p>
                            </div>
                          </div>
                          <span className="font-bold text-neutral-900 shrink-0">
                            {formatPrice(item.totalPrice)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer Address & Payment */}
                    <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-500">
                      <div>
                        <strong className="text-neutral-900">Shipping to: </strong>
                        {order.shippingAddress?.fullName || 'Customer'}
                        {order.shippingAddress?.city ? `, ${order.shippingAddress.city}` : ''}
                        {order.shippingAddress?.state ? `, ${order.shippingAddress.state}` : ''}
                        {order.shippingAddress?.pincode ? ` - ${order.shippingAddress.pincode}` : ''}
                      </div>
                      <div>
                        <strong className="text-neutral-900">Payment: </strong>
                        {order.paymentMethod || 'Prepaid'}
                      </div>
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
