'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/context/UIContext';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, showToast } = useUI();
  const { user, login, isLoggingIn, register, isRegistering, logout, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('Please enter your email', 'error');
      return;
    }

    try {
      if (mode === 'login') {
        await login({ email, password });
        showToast('Welcome back to AURA STUDIO');
      } else {
        await register({ email, password, phone });
        showToast('Registration successful. Welcome to the atelier.');
      }
      closeAuthModal();
      setEmail('');
      setPassword('');
      setPhone('');
    } catch {
      showToast('Authentication failed. Please try again.', 'error');
    }
  };

  const handleLogout = async () => {
    await logout();
    showToast('You have been logged out.');
    closeAuthModal();
  };

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      title={isAuthenticated ? 'Customer Account' : mode === 'login' ? 'Sign In' : 'Join Atelier'}
      maxWidth="sm"
    >
      {isAuthenticated && user ? (
        <div className="space-y-6">
          <div className="bg-[#EFEEE9] p-4 border border-[#E6E3DD] space-y-1">
            <p className="text-[10px] uppercase tracking-widest text-[#929292]">Active Session</p>
            <p className="text-xs font-semibold text-[#171717]">{user.email}</p>
            <p className="text-[11px] text-[#686868]">Role: {user.role.toUpperCase()}</p>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => {
                closeAuthModal();
                window.location.href = '/account';
              }}
            >
              View Order History
            </Button>
            <Button
              variant="secondary"
              size="md"
              fullWidth
              onClick={handleLogout}
            >
              Sign Out
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Tab Switcher */}
          <div className="flex border-b border-[#E6E3DD]">
            <button
              onClick={() => setMode('login')}
              className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-widest transition-colors ${
                mode === 'login'
                  ? 'border-b-2 border-[#171717] text-[#171717]'
                  : 'text-[#929292] hover:text-[#171717]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('register')}
              className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-widest transition-colors ${
                mode === 'register'
                  ? 'border-b-2 border-[#171717] text-[#171717]'
                  : 'text-[#929292] hover:text-[#171717]'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="e.g. name@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {mode === 'register' && (
              <Input
                label="Phone Number (Optional)"
                type="tel"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            )}

            <div className="pt-2">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                type="submit"
                isLoading={isLoggingIn || isRegistering}
              >
                {mode === 'login' ? 'Sign In' : 'Create Account'}
              </Button>
            </div>
          </form>

          <p className="text-[10px] text-center text-[#929292] leading-relaxed">
            By accessing your account, you agree to our Terms of Atelier Services and Privacy Policy.
          </p>
        </div>
      )}
    </Modal>
  );
}
