'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { orderService } from '@/services/order.service';
import { useQuery } from '@tanstack/react-query';
import { formatPrice, formatDate } from '@/utils/formatters';
import { useUI } from '@/context/UIContext';
import { Package, User as UserIcon, LogOut, ArrowRight } from 'lucide-react';

export default function AccountPage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { openAuthModal } = useUI();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['myOrders'],
    queryFn: () => orderService.getMyOrders(),
  });

  if (!isAuthenticated && !user) {
    return (
      <div className="py-24 md:py-32 bg-[#F7F6F2] text-center">
        <Container size="sm">
          <div className="bg-white border border-[#E6E3DD] p-8 md:p-12 space-y-6">
            <UserIcon className="w-10 h-10 text-[#8A6A45] mx-auto" />
            <div className="space-y-2">
              <span className="editorial-kicker text-[#8A6A45]">CLIENT PORTAL</span>
              <h1 className="text-2xl font-semibold tracking-tight text-[#171717]">
                SIGN IN TO ACCESS YOUR ACCOUNT
              </h1>
              <p className="text-xs text-[#686868] max-w-sm mx-auto">
                Track your active dispatches, view past orders, and manage your shipping preferences.
              </p>
            </div>
            <div className="pt-2">
              <Button variant="primary" size="md" onClick={openAuthModal}>
                Sign In / Join
              </Button>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-12 md:py-20 bg-[#F7F6F2]">
      <Container>
        <div className="space-y-10">
          {/* Top Banner */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E6E3DD] pb-6">
            <div className="space-y-1">
              <span className="editorial-kicker text-[#8A6A45]">CLIENT PROFILE</span>
              <h1 className="text-3xl font-semibold tracking-tight text-[#171717]">
                ORDER HISTORY & ARCHIVE
              </h1>
              <p className="text-xs text-[#686868]">
                Logged in as <strong className="text-[#171717]">{user?.email}</strong>
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => logout()}
              className="gap-2"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>

          {/* Orders Section */}
          <div className="space-y-6">
            <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#171717]">
              Recent Orders ({orders.length})
            </h3>

            {orders.length === 0 ? (
              <div className="bg-white border border-[#E6E3DD] p-12 text-center space-y-3">
                <Package className="w-8 h-8 text-[#929292] mx-auto" />
                <p className="text-xs font-semibold text-[#171717]">NO ORDERS PLACED YET</p>
                <p className="text-xs text-[#686868]">
                  Once you place an order, live dispatch tracking details will appear here.
                </p>
                <div className="pt-2">
                  <Link href="/shop">
                    <Button variant="outline" size="sm">
                      Explore Collection
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="bg-white border border-[#E6E3DD] p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E6E3DD] pb-3 text-xs">
                      <div>
                        <span className="font-bold text-[#171717]">
                          #{order.orderNumber}
                        </span>
                        <span className="text-[#929292] ml-3">
                          Placed on {formatDate(order.placedAt || order.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="surface">
                          {order.status.toUpperCase()}
                        </Badge>
                        <span className="font-semibold text-[#171717]">
                          {formatPrice(order.totalAmount)}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-[#E6E3DD]/60">
                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="py-2.5 flex items-center justify-between text-xs"
                        >
                          <div>
                            <p className="font-semibold text-[#171717]">
                              {item.productName}
                            </p>
                            <p className="text-[11px] text-[#686868]">
                              Size: {item.size} • Qty: {item.quantity}
                            </p>
                          </div>
                          <span className="font-medium text-[#171717]">
                            {formatPrice(item.totalPrice)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 text-[11px] text-[#686868]">
                      <span>
                        Shipping to: {order.shippingAddress.fullName} ({order.shippingAddress.city})
                      </span>
                      <span>Payment: {order.paymentMethod}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}
