'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/context/UIContext';
import { User, MapPin, ArrowLeft, Check, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth();
  const { showToast, openAuthModal } = useUI();

  const [fullName, setFullName] = useState('Urban Collector');
  const [email, setEmail] = useState(user?.email || 'customer@kineticstudio.in');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [addressLine1, setAddressLine1] = useState('402, Urban Loft, Linking Road');
  const [city, setCity] = useState('Mumbai');
  const [state, setState] = useState('Maharashtra');
  const [pincode, setPincode] = useState('400050');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile & delivery preferences updated successfully');
  };

  return (
    <div className="py-8 min-h-screen bg-neutral-50/60">
      <Container>
        <Breadcrumb items={[{ label: 'Account', href: '/account' }, { label: 'Profile' }]} />

        <div className="pt-4 pb-8 border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900">
              Customer Profile & Addresses
            </h1>
            <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mt-1">
              Manage personal details, contact number, and default delivery address
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

        <div className="pt-8 max-w-2xl">
          <form onSubmit={handleSave} className="space-y-8 bg-white border border-neutral-200 p-6 sm:p-8 shadow-xs">
            {/* Personal Details */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
                <User className="w-4 h-4 text-neutral-700" />
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900">
                  Personal Information
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                <Input
                  label="Phone Number (for Courier Updates)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Default Shipping Address */}
            <div className="space-y-4 pt-4 border-t border-neutral-200">
              <div className="flex items-center gap-2 pb-2 border-b border-neutral-200">
                <MapPin className="w-4 h-4 text-neutral-700" />
                <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900">
                  Default Delivery Address
                </h3>
              </div>

              <Input
                label="Flat / Building / Street Address"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Input
                  label="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
                <Input
                  label="State"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
                <Input
                  label="Pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  maxLength={6}
                  required
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-4 flex items-center justify-between">
              <span className="text-xs text-neutral-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-neutral-500" /> Data securely protected
              </span>
              <Button type="submit" variant="primary" size="md">
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </Container>
    </div>
  );
}
