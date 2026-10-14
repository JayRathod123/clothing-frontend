'use client';

import React, { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useUI } from '@/context/UIContext';
import { THEME } from '@/constants/theme';
import { Mail, Phone, MapPin, MessageSquare, Clock, Send } from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useUI();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = (fieldName: string, value: string): string => {
    const val = (value || '').trim();
    switch (fieldName) {
      case 'name':
        if (!val) return 'Full name is required';
        if (val.length < 2) return 'Full name must be at least 2 characters';
        return '';
      case 'email':
        if (!val) return 'Email address is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return 'Please enter a valid email address';
        return '';
      case 'message':
        if (!val) return 'Message is required';
        if (val.length < 10) return 'Please provide a message with at least 10 characters';
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

  const handleNameChange = (val: string) => {
    setName(val);
    if (touched.name) {
      setErrors((prev) => ({ ...prev, name: validateField('name', val) }));
    }
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateField('email', val) }));
    }
  };

  const handleMessageChange = (val: string) => {
    setMessage(val);
    if (touched.message) {
      setErrors((prev) => ({ ...prev, message: validateField('message', val) }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const nameErr = validateField('name', name);
    const emailErr = validateField('email', email);
    const messageErr = validateField('message', message);

    const newErrors = { name: nameErr, email: emailErr, message: messageErr };
    setTouched({ name: true, email: true, message: true });
    setErrors(newErrors);

    if (nameErr || emailErr || messageErr) {
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Thank you. Your message has been received by our concierge team.');
      setName('');
      setEmail('');
      setOrderNumber('');
      setMessage('');
      setTouched({});
      setErrors({});
    }, 600);
  };

  return (
    <div className="py-8 min-h-screen bg-neutral-50/50">
      <Container>
        <Breadcrumb items={[{ label: 'Contact Us' }]} />

        <div className="pt-4 pb-8 border-b border-neutral-200">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-red-600 block mb-1">
            CLIENT CONCIERGE
          </span>
          <h1 className="text-2xl sm:text-4xl font-bold uppercase tracking-tight text-neutral-900">
            Get in Touch
          </h1>
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider mt-1">
            We reply to all sizing inquiries and order questions within 12 hours
          </p>
        </div>

        <div className="pt-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Contact Channels */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900 pb-2 border-b border-neutral-200">
                Direct Channels
              </h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3.5 p-4 bg-white border border-neutral-200">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Email Us</span>
                    <a href={`mailto:${THEME.store.supportEmail}`} className="text-xs font-semibold text-neutral-900 hover:underline">
                      {THEME.store.supportEmail}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 bg-white border border-neutral-200">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Phone & WhatsApp</span>
                    <a href={`tel:${THEME.store.supportPhone}`} className="text-xs font-semibold text-neutral-900 hover:underline">
                      {THEME.store.supportPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 bg-white border border-neutral-200">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Design HQ</span>
                    <p className="text-xs font-semibold text-neutral-900 leading-relaxed">
                      {THEME.store.address}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5 p-4 bg-white border border-neutral-200">
                  <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">Operating Hours</span>
                    <p className="text-xs font-semibold text-neutral-900">
                      Monday – Saturday, 10:00 AM – 7:00 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Support Form */}
          <div className="lg:col-span-7">
            <div className="bg-white border border-neutral-200 p-6 sm:p-8 space-y-6">
              <div className="space-y-1 pb-3 border-b border-neutral-200">
                <h3 className="text-sm font-black uppercase tracking-widest text-neutral-900">
                  Send a Message
                </h3>
                <p className="text-xs text-neutral-500">
                  For damage return requests, please include your order number and photos/video of the defect.
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name *"
                    value={name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    onBlur={() => handleBlur('name', name)}
                    error={touched.name ? errors.name : undefined}
                  />
                  <Input
                    label="Email Address *"
                    type="email"
                    value={email}
                    onChange={(e) => handleEmailChange(e.target.value)}
                    onBlur={() => handleBlur('email', email)}
                    error={touched.email ? errors.email : undefined}
                  />
                </div>

                <Input
                  label="Order Number (Optional)"
                  placeholder="e.g. AUR-123456"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                />

                <div className="flex flex-col gap-1.5 text-left">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                    Message *
                  </label>
                  <textarea
                    rows={5}
                    value={message}
                    onChange={(e) => handleMessageChange(e.target.value)}
                    onBlur={() => handleBlur('message', message)}
                    placeholder="How can we assist you with fits, fabric care, or order dispatches?"
                    className={`w-full bg-neutral-50 border p-3 text-xs text-neutral-900 focus:bg-white focus:outline-none transition-colors ${
                      touched.message && errors.message
                        ? 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                        : 'border-neutral-200 focus:border-black'
                    }`}
                  />
                  {touched.message && errors.message && (
                    <p className="text-xs text-red-600 font-semibold">{errors.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isSubmitting}
                  className="w-full sm:w-auto text-xs font-bold uppercase tracking-widest"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
