'use client';

import React, { useState } from 'react';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Accordion } from '@/components/ui/Accordion';
import { Tabs } from '@/components/ui/Tabs';
import { HelpCircle, Truck, RefreshCw, Ruler, CreditCard } from 'lucide-react';

const FAQ_CATEGORIES = [
  { id: 'all', label: 'All FAQs' },
  { id: 'sizing', label: 'Fit & Sizing' },
  { id: 'shipping', label: 'Shipping & COD' },
  { id: 'returns', label: 'Returns & Exchanges' },
  { id: 'fabric', label: 'Fabric & GSM' },
];

const FAQ_ITEMS = [
  {
    category: 'sizing',
    title: 'How does your Oversized Fit compare to regular t-shirts?',
    content: 'Our Oversized Fit is intentionally designed with dropped shoulders, a wider chest circumference, and a calibrated length so you look effortlessly stylish without looking like you are wearing an oversized hand-me-down. We recommend ordering your true standard size for the intended boxy streetwear aesthetic. If you prefer a closer, classic fit, size down by one.',
  },
  {
    category: 'sizing',
    title: 'What is the collar width and will it stretch after washing?',
    content: 'All our t-shirts feature a 1.25" thick 1x1 ribbed collar reinforced with high-retention Lycra yarns. Because our fabric is pre-shrunk and bio-washed, the neckline stays snug and will not bacon-curl or sag over time.',
  },
  {
    category: 'shipping',
    title: 'What are your delivery timelines and courier partners?',
    content: 'Metro orders (Mumbai, Delhi NCR, Bangalore, Pune, Hyderabad, Chennai) are typically delivered within 2–4 business days. Non-metro locations take 4–6 business days. We partner with Bluedart, Delhivery, and XpressBees with end-to-end SMS & WhatsApp tracking updates.',
  },
  {
    category: 'shipping',
    title: 'Is Cash on Delivery (COD) available across India?',
    content: 'Yes! COD is available for over 27,000+ Indian postal pincodes for orders up to ₹10,000. You can also verify your pincode serviceability instantly on any product page using our pincode checker.',
  },
  {
    category: 'shipping',
    title: 'What is the free shipping qualification?',
    content: 'All prepaid orders above ₹999 qualify for 100% Free Express Shipping. Orders below ₹999 incur a flat ₹99 logistics fee.',
  },
  {
    category: 'returns',
    title: 'What is your return and exchange policy?',
    content: 'We offer a hassle-free 7-day exchange and return policy starting from the date of delivery. If you need a different size, we arrange a reverse pickup from your doorstep at zero cost. Garments must be unworn with original tags attached.',
  },
  {
    category: 'returns',
    title: 'How long do refunds take to process?',
    content: 'Once the reverse courier inspects the returned piece at our facility, prepaid refunds are initiated immediately back to your original payment method within 48 hours. For COD orders, we transfer directly to your verified UPI ID or bank account.',
  },
  {
    category: 'fabric',
    title: 'What does 240 GSM French Terry feel like?',
    content: '240 GSM (Grams per Square Meter) is substantial and heavyweight without being stifling. It has a smooth combed exterior and soft loopback micro-loops on the interior that wick moisture, making it breathable even in tropical Indian humidity while giving you that unmistakable structural drape.',
  },
  {
    category: 'fabric',
    title: 'How should I wash my streetwear graphic t-shirts?',
    content: 'Machine wash in cold water (below 30°C) with the garment turned inside-out. Do not dry clean or use bleach. Tumble dry on low or hang dry in shade. If ironing, iron on reverse side and avoid direct iron contact on high-density prints.',
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredItems = activeCategory === 'all'
    ? FAQ_ITEMS
    : FAQ_ITEMS.filter((item) => item.category === activeCategory);

  const accordionItems = filteredItems.map((item) => ({
    id: item.title,
    title: item.title,
    content: item.content,
  }));

  return (
    <div className="py-8 min-h-screen bg-neutral-50/50">
      <Container size="md">
        <Breadcrumb items={[{ label: 'FAQ' }]} />

        <div className="pt-4 pb-10 text-center space-y-3">
          <span className="text-[11px] font-black uppercase tracking-[0.25em] text-red-600 block">
            CLIENT ASSISTANCE
          </span>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-neutral-900">
            Frequently Asked Questions
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto font-normal leading-relaxed">
            Everything you need to know about our heavyweight silhouettes, domestic shipping, doorstep exchanges, and wash care.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="pb-8">
          <Tabs
            tabs={FAQ_CATEGORIES}
            activeTab={activeCategory}
            onChange={setActiveCategory}
            variant="pill"
            className="justify-center flex-wrap"
          />
        </div>

        {/* FAQ Accordion List */}
        <div className="bg-white border border-neutral-200 p-6 sm:p-8 shadow-xs">
          <Accordion items={accordionItems} allowMultiple />
        </div>

        {/* Still Need Help Footer */}
        <div className="mt-12 p-8 bg-black text-white text-center space-y-4">
          <HelpCircle className="w-8 h-8 mx-auto text-red-500" />
          <div className="space-y-1">
            <h3 className="text-base font-bold uppercase tracking-wider text-white">
              Still have questions about a drop?
            </h3>
            <p className="text-xs text-neutral-400">
              Our styling and fulfillment team is here to assist you.
            </p>
          </div>
          <div className="pt-2">
            <a
              href="/contact"
              className="inline-block px-6 py-2.5 bg-white text-black text-xs font-bold uppercase tracking-widest hover:bg-neutral-200 transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
}
