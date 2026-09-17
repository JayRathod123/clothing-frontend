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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      showToast('Thank you. Your message has been received by our concierge team.');
      setName('');
      setEmail('');
      setOrderNumber('');
      setMessage('');
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
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900">
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
                  For exchanges or return requests, please include your order number.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                    Message
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="How can we assist you with fits, fabric care, or order dispatches?"
                    className="w-full bg-neutral-50 border border-neutral-200 p-3 text-xs text-neutral-900 focus:bg-white focus:border-black focus:outline-none transition-colors"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  disabled={isSubmitting}
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
