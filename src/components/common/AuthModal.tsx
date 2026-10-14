'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/hooks/useAuth';
import { useUI } from '@/context/UIContext';

export function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, showToast } = useUI();
  const { user, login, isLoggingIn, register, isRegistering, logout, isLoggingOut, isAuthenticated } = useAuth();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (name: string, value: string): string => {
    const val = (value || '').trim();
    switch (name) {
      case 'email':
        if (!val) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address';
        return '';
      case 'password':
        if (!val) return 'Password is required';
        if (val.length < 6) return 'Password must be at least 6 characters';
        return '';
      case 'phone':
        if (mode === 'register' && val) {
          const digits = val.replace(/\D/g, '');
          if (digits.length < 10) return 'Please enter a valid 10-digit phone number';
        }
        return '';
      default:
        return '';
    }
  };

  const handleBlur = (fieldName: string, value: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    const err = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: err }));
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateField('email', val) }));
    }
  };

  const handlePasswordChange = (val: string) => {
    setPassword(val);
    if (touched.password) {
      setErrors((prev) => ({ ...prev, password: validateField('password', val) }));
    }
  };

  const handlePhoneChange = (val: string) => {
    setPhone(val);
    if (touched.phone) {
      setErrors((prev) => ({ ...prev, phone: validateField('phone', val) }));
    }
  };

  React.useEffect(() => {
    if (authModalMode) {
      setMode(authModalMode);
    }
    setErrors({});
    setTouched({});
  }, [authModalMode, isAuthModalOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailErr = validateField('email', email);
    const passwordErr = validateField('password', password);
    const phoneErr = validateField('phone', phone);

    const newErrors: Record<string, string> = {
      email: emailErr,
      password: passwordErr,
      phone: phoneErr,
    };

    setTouched({ email: true, password: true, phone: true });
    setErrors(newErrors);

    if (emailErr || passwordErr || (mode === 'register' && phoneErr)) {
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
      setErrors({});
      setTouched({});
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Authentication failed. Please try again.';
      showToast(msg, 'error');
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
              isLoading={isLoggingOut}
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

          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              placeholder="e.g. name@domain.com"
              value={email}
              onChange={(e) => handleEmailChange(e.target.value)}
              onBlur={() => handleBlur('email', email)}
              error={touched.email ? errors.email : undefined}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              onBlur={() => handleBlur('password', password)}
              error={touched.password ? errors.password : undefined}
            />

            {mode === 'register' && (
              <Input
                label="Phone Number (Optional)"
                type="tel"
                inputMode="numeric"
                maxLength={10}
                prefixText="+91"
                placeholder="98765 43210"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                onBlur={() => handleBlur('phone', phone)}
                error={touched.phone ? errors.phone : undefined}
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
