'use client';

import React from 'react';
import Link from 'next/link';
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
    queryKey: ['myOrders'],
    queryFn: () => orderService.getMyOrders(),
  });

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
                const isConfirmed = order.status === 'confirmed';

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
                          <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-100 text-neutral-800 border border-neutral-200">
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
                      <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-600 mb-2">
                        <span className="flex items-center gap-1.5 text-neutral-900">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Order Placed
                        </span>
                        <span className="flex items-center gap-1.5 text-neutral-900">
                          <Truck className="w-4 h-4 text-blue-600" /> Dispatched
                        </span>
                        <span className="flex items-center gap-1.5 text-neutral-500">
                          <Clock className="w-4 h-4" /> Delivered
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-neutral-200 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            isDelivered ? 'w-full bg-emerald-600' : 'w-2/3 bg-black'
                          }`}
                        />
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="divide-y divide-neutral-100">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="py-3 flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-bold text-neutral-900 uppercase tracking-tight">
                              {item.productName}
                            </p>
                            <p className="text-[11px] text-neutral-500 mt-0.5">
                              Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="font-bold text-neutral-900">
                            {formatPrice(item.totalPrice)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Footer Address & Payment */}
                    <div className="pt-4 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-neutral-500">
                      <div>
                        <strong className="text-neutral-900">Shipping to: </strong>
                        {order.shippingAddress.fullName}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                      </div>
                      <div>
                        <strong className="text-neutral-900">Payment: </strong>
                        {order.paymentMethod}
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
