'use client';

import React, { useState } from 'react';
import { Truck, RotateCcw, Headphones, ShieldCheck, PhoneCall } from 'lucide-react';

export function TrustBadgesStrip() {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSent(true);
    setTimeout(() => {
      setShowFeedbackModal(false);
      setFeedbackSent(false);
      setFeedbackText('');
    }, 2000);
  };

  return (
    <section className="w-full bg-[#FFFFFF]">
      {/* 4 HORIZONTAL TRUST BADGES */}
      <div className="border-t border-b border-neutral-200 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Badge 1 */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-neutral-900">
                Free Shipping
              </h4>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                On Prepaid Orders
              </p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-neutral-900">
                Easy Returns
              </h4>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                7-days Returns
              </p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-neutral-900">
                Online Support
              </h4>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                Ensure the product quality
              </p>
            </div>
          </div>

          {/* Badge 4 */}
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-900 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-neutral-900">
                Secure Checkout
              </h4>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">
                100% Payment Secure
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* GIVE YOUR FEEDBACK BANNER */}
      <div className="bg-black text-white py-5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h3 className="text-lg sm:text-2xl font-black tracking-tight text-white font-heading">
            Give your Feedback
          </h3>

          <button
            type="button"
            onClick={() => setShowFeedbackModal(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-black font-extrabold text-sm rounded-full hover:bg-neutral-100 active:scale-95 transition-all shadow-sm cursor-pointer"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Feedback</span>
          </button>
        </div>
      </div>

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setShowFeedbackModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h4 className="text-base font-bold text-neutral-900">Share Your Experience</h4>
              <button
                type="button"
                onClick={() => setShowFeedbackModal(false)}
                className="text-neutral-400 hover:text-black"
              >
                ✕
              </button>
            </div>

            {feedbackSent ? (
              <div className="py-8 text-center text-emerald-600 font-bold text-sm">
                ✓ Thank you for your valuable feedback!
              </div>
            ) : (
              <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                <p className="text-xs text-neutral-500">
                  We constantly refine our streetwear fits, stitch quality, and customer support. Let us know how we can serve you better!
                </p>
                <textarea
                  required
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Type your feedback, fit thoughts, or suggestions here..."
                  className="w-full p-3 border border-neutral-300 rounded-xl text-xs text-neutral-900 focus:outline-none focus:border-black"
                />
                <button
                  type="submit"
                  className="w-full py-2.5 bg-black text-white text-xs font-bold rounded-xl hover:bg-neutral-800 transition-colors"
                >
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

export default TrustBadgesStrip;
