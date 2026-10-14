import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Monvico',
  description: 'Read the official Terms and Conditions for purchasing on monvico.com.',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: 'Terms & Conditions' }]} />

        <div className="max-w-4xl mx-auto pt-6 sm:pt-10 space-y-8">
          {/* Header */}
          <div className="border-b border-neutral-200 pb-6">
            <h1 className="text-3xl sm:text-4xl font-semibold uppercase tracking-tight text-neutral-900">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-2">
              Last updated: March 2025
            </p>
          </div>

          {/* Text Content */}
          <div className="space-y-8 text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or placing an order on monvico.com, you agree to be bound by these Terms and Conditions. Please read them carefully before using our website or making a purchase.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                2. Products &amp; Pricing
              </h2>
              <p>
                All prices are listed in Indian Rupees (INR) and are inclusive of GST unless stated otherwise. We reserve the right to modify prices at any time without prior notice. Product images are for representation purposes; actual colour may vary slightly due to screen settings.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                3. Orders &amp; Payment
              </h2>
              <p>
                Orders are confirmed only upon successful payment. We accept all major credit/debit cards, UPI, net banking, and wallets via our secure payment gateway. Monvico reserves the right to cancel any order in cases of pricing errors, stock unavailability, or suspected fraud.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                4. Shipping &amp; Delivery
              </h2>
              <p>
                We ship across India. Standard delivery takes 4-7 business days; express delivery (where available) takes 1-2 business days. Delivery timelines are estimates and may vary due to courier delays or unforeseen circumstances. Shipping charges, if applicable, are displayed at checkout.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                5. Returns &amp; Exchanges
              </h2>
              <p>
                We offer hassle-free returns within 7 days of delivery, provided the item is unworn, unwashed, and has all original tags attached. To initiate a return, please contact us at the email listed in our footer. Exchanges are subject to stock availability. Refunds are processed within 5-7 business days to the original payment method.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                6. Intellectual Property
              </h2>
              <p>
                All content on this website — including text, images, logos, and design — is the exclusive property of Monvico and is protected under applicable intellectual property laws. Unauthorised use, reproduction, or distribution is strictly prohibited.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                7. Limitation of Liability
              </h2>
              <p>
                Monvico shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or website. Our total liability, in any case, shall not exceed the amount paid for the specific order in question.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                8. Governing Law
              </h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts located in India.
              </p>
            </section>

            <section className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold text-neutral-900">
                9. Contact Us
              </h2>
              <p>
                For any questions regarding these Terms, please contact us{' '}
                <a
                  href="mailto:support.sarthak@gmail.com"
                  className="font-semibold text-neutral-900 underline hover:text-black transition-colors"
                >
                  support.sarthak@gmail.com
                </a>
                . We aim to respond within 24-48 business hours.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
}
