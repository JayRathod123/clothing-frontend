import React from 'react';
import type { Metadata } from 'next';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export const metadata: Metadata = {
  title: 'Privacy Policy | Inkstyles',
  description: 'Learn how Inkstyles collects, utilizes, and safeguards your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white py-8 sm:py-12">
      <Container>
        <Breadcrumb items={[{ label: 'Privacy Policy' }]} />

        <div className="max-w-4xl mx-auto pt-6 sm:pt-10 space-y-8">
          {/* Header */}
          <div className="border-b border-neutral-200 pb-6">
            <h1 className="text-3xl sm:text-4xl font-semibold uppercase tracking-tight text-neutral-900">
              Privacy Policy
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-2">
              Effective Date: 10 April 2024
            </p>
          </div>

          {/* Policy Content */}
          <div className="space-y-8 text-sm sm:text-base text-neutral-700 leading-relaxed font-normal">
            {/* Introduction */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-neutral-900">
                Introduction
              </h2>
              <p>
                This privacy statement (the &quot;Policy&quot;) outlines how Inkstyles (also known as &quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) utilizes and safeguards any information you provide to us while using this website or mobile application (collectively, the &quot;Platform&quot;).
              </p>
              <p>
                We at Inkstyles are dedicated to protecting your privacy. You may be certain that any information we request from you on this platform will only be used strictly in compliance with this Policy, should it be necessary for us to identify you.
              </p>
              <p>
                Please be aware that we may not always be able to give you advance notice of changes to our Policy. Please frequently revisit this page to make sure you are informed of any updates to the Policy. Both present and past users of our Platform who are also clients are covered by this Policy. By accessing and/or utilizing our Platform, you agree to the terms and conditions outlined in this Policy.
              </p>
            </section>

            {/* Types of Information We Get and Collect */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-neutral-900">
                Types of Information We Get and Collect
              </h2>
              <p>
                When you use our website, we might gather personal data that you give to us. This could contain your name, phone number, email address, mailing address, and payment details, among other things.
              </p>
              <p>
                When you use our online forms to contact us, register an account, place an order, or sign up for our newsletter, we get this information. Using cookies, web beacons, and related technologies, we also automatically gather certain information about your device and how you use our website. Your IP address, browser type, operating system, referring URLs, and browsing habits are a few examples of this data.
              </p>
            </section>

            {/* SMS Marketing Consent */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-neutral-900">
                SMS Marketing Consent
              </h2>
              <p>
                By providing your phone number on our Platform, you consent to receive marketing and transactional SMS messages from Inkstyles.
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong className="text-neutral-900">Purpose of SMS Marketing:</strong> Messages may include promotional offers, updates, and transactional information about your orders.
                </li>
                <li>
                  <strong className="text-neutral-900">Opt-Out Option:</strong> You can opt out of SMS marketing anytime by replying &quot;STOP&quot; to the received message or contacting us at{' '}
                  <a
                    href="mailto:support@inkstyles.in"
                    className="font-semibold text-neutral-900 underline hover:text-black transition-colors"
                  >
                    support@inkstyles.in
                  </a>
                  .
                </li>
                <li>
                  <strong className="text-neutral-900">Message and Data Rates:</strong> Standard message and data rates may apply based on your mobile carrier’s policies.
                </li>
              </ul>
            </section>

            {/* Revealing of Your Personal Information */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-neutral-900">
                Revealing of Your Personal Information
              </h2>
              <p>
                Under the following situations, we might disclose your personal information to outside parties:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>With vendors who assist us in running our business (such as shipping partners and payment processors);</li>
                <li>With partners in marketing and advertising to supply you with promotional materials (if you have consented to receive them);</li>
                <li>In response to mandates and demands from the law;</li>
                <li>To safeguard our customers&apos; and partners&apos; property, as well as our own rights, privacy, safety, and other assets.</li>
              </ul>
              <p className="pt-2">
                We do not rent or sell your personal information to outside parties for their own marketing purposes unless it is in connection with a merger, acquisition, or sale of all or a portion of our business.
              </p>
            </section>

            {/* Modification to the Privacy Statement */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-neutral-900">
                Modification to the Privacy Statement
              </h2>
              <p>
                There may be periodic updates to the Privacy Policy. The most recent modifications to this Policy are shown by the &quot;Effective Date&quot; at the top of the text. It is recommended that you periodically check this Privacy Policy to be sure nothing has changed.
              </p>
            </section>

            {/* Contact Us */}
            <section className="space-y-3">
              <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide text-neutral-900">
                Contact Us
              </h2>
              <p>
                If you have any questions, concerns, or requests regarding our privacy policy or our data practices, please contact us at the details below:
              </p>
              <div className="bg-neutral-50 border border-neutral-200 p-5 rounded-lg space-y-2 text-sm">
                <p>
                  <strong className="text-neutral-900">Email:</strong>{' '}
                  <a
                    href="mailto:support@inkstyles.in"
                    className="font-semibold text-neutral-900 underline hover:text-black transition-colors"
                  >
                    support@inkstyles.in
                  </a>
                </p>
                <p>
                  <strong className="text-neutral-900">Address:</strong> 274/255/10 A, near Meena Garage, Rajendra Nagar, Lucknow-226004.
                </p>
                <p>
                  <strong className="text-neutral-900">Phone:</strong>{' '}
                  <a
                    href="tel:+919235831306"
                    className="font-semibold text-neutral-900 underline hover:text-black transition-colors"
                  >
                    +91 9235831306
                  </a>
                </p>
              </div>
            </section>

            {/* Agreement Footer Note */}
            <div className="pt-6 border-t border-neutral-200">
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                By using our website, you agree to the terms of this privacy policy.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
