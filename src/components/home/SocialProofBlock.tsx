'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Quote, ThumbsUp, ShieldCheck, Shirt, Award, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Container } from '@/components/layout/Container';

interface CustomerReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  comment: string;
  avatar: string;
  product: string;
  size: string;
  tag: 'all' | 'fabric' | 'fit' | 'print';
  helpfulCount: number;
}

const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Sachin Kumar',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    date: '2 days ago',
    title: 'Fabric and print quality are unreal!',
    comment:
      'The 240 GSM weight is the exact thick streetwear feel I have been looking for. The graphic print does not peel or fade even after multiple machine washes. Will definitely buy again!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
    product: 'Sneaky Cartoon Graphic Unisex Oversized Tee',
    size: 'Size L',
    tag: 'print',
    helpfulCount: 42,
  },
  {
    id: 'rev-2',
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    date: '1 week ago',
    title: 'Perfect oversized silhouette',
    comment:
      'Ordered size M and the boxy drop shoulder fits like a glove. Received so many compliments on the Sneaky Cartoon print at college. Delivery was super fast too!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
    product: 'Nimbus Night Flight Cute Wizard Graphic Tee',
    size: 'Size M',
    tag: 'fit',
    helpfulCount: 35,
  },
  {
    id: 'rev-3',
    name: 'Aman Verma',
    location: 'Delhi NCR',
    rating: 5,
    date: '2 weeks ago',
    title: 'Value for money 100%',
    comment:
      'Better quality than international brands charging ₹3000+. The collar rib is tight and structured, zero drooping. InkStyles is my new go-to for graphic tees.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
    product: 'GOAT Streetwear Graphic Heavyweight Tee',
    size: 'Size XL',
    tag: 'fabric',
    helpfulCount: 51,
  },
  {
    id: 'rev-4',
    name: 'Rohan Deshmukh',
    location: 'Pune, Maharashtra',
    rating: 5,
    date: '3 weeks ago',
    title: 'Heavyweight drape is unmatched',
    comment:
      'Most brands claim heavyweight but it feels flimsy. This 240 GSM combed cotton holds its shape even after full day wear. Collar rib does not bacon or stretch out!',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=200',
    product: 'FIFA 10 Energy Graphic Oversized T-shirt',
    size: 'Size L',
    tag: 'fabric',
    helpfulCount: 28,
  },
  {
    id: 'rev-5',
    name: 'Kavya Nair',
    location: 'Kochi, Kerala',
    rating: 5,
    date: '1 month ago',
    title: 'Best graphic print finish',
    comment:
      'High-density screen printing without that sticky rubbery feel. Super breathable even in humid weather. Ordered two more for my brother!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    product: 'Seeker 07 Jersey-Style Unisex Tee',
    size: 'Size S',
    tag: 'print',
    helpfulCount: 39,
  },
  {
    id: 'rev-6',
    name: 'Arjun Mehta',
    location: 'Ahmedabad, Gujarat',
    rating: 5,
    date: '1 month ago',
    title: 'Boxy drop shoulder fits true to size',
    comment:
      'Length is balanced perfectly with the chest width. Looks amazing paired with cargo pants and chunky sneakers. 10/10 purchase.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200',
    product: 'Minimalist Architecture Heavyweight Tee',
    size: 'Size M',
    tag: 'fit',
    helpfulCount: 24,
  },
];

export function SocialProofBlock() {
  const [likedReviews, setLikedReviews] = useState<Record<string, boolean>>({});
  const [helpfulCounts, setHelpfulCounts] = useState<Record<string, number>>(
    CUSTOMER_REVIEWS.reduce((acc, r) => ({ ...acc, [r.id]: r.helpfulCount }), {})
  );

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 45;

  // Auto-slide every 4 seconds on mobile
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % CUSTOMER_REVIEWS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      setCurrentSlide((prev) => (prev + 1) % CUSTOMER_REVIEWS.length);
    } else if (isRightSwipe) {
      setCurrentSlide((prev) => (prev - 1 + CUSTOMER_REVIEWS.length) % CUSTOMER_REVIEWS.length);
    }
  };

  const toggleHelpful = (id: string) => {
    setLikedReviews((prev) => {
      const isLiked = !prev[id];
      setHelpfulCounts((counts) => ({
        ...counts,
        [id]: counts[id] + (isLiked ? 1 : -1),
      }));
      return { ...prev, [id]: isLiked };
    });
  };

  const renderReviewCard = (rev: CustomerReview) => (
    <div
      key={rev.id}
      className="group relative bg-white rounded-2xl p-6 sm:p-7 border border-neutral-200 shadow-xs hover:shadow-xl hover:border-black/30 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full min-h-[330px]"
    >
      {/* Decorative Background Quote Watermark */}
      <Quote className="absolute right-5 bottom-20 w-16 h-16 text-neutral-100 pointer-events-none -z-0 transition-transform group-hover:scale-110 duration-300" />

      <div className="space-y-4 relative z-10">
        {/* Top Row: Stars & Date */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <div className="flex items-center text-amber-400">
              {[...Array(rev.rating)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <span className="text-xs font-extrabold text-neutral-800 ml-0.5">5.0</span>
          </div>

          <span className="text-[11px] text-neutral-400 font-medium">
            {rev.date}
          </span>
        </div>

        {/* Review Title */}
        <h3 className="text-base font-bold text-neutral-900 tracking-tight leading-snug group-hover:text-black transition-colors">
          &ldquo;{rev.title}&rdquo;
        </h3>

        {/* Review Text */}
        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
          {rev.comment}
        </p>

        {/* Product Tag */}
        <div className="pt-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-50 border border-neutral-200/80 text-[11px] text-neutral-700 font-medium">
            <Shirt className="w-3 h-3 text-neutral-500 shrink-0" />
            <span className="truncate max-w-[200px]">{rev.product}</span>
            <span className="text-neutral-400">•</span>
            <span className="font-bold text-neutral-900">{rev.size}</span>
          </div>
        </div>
      </div>

      {/* Bottom Row: Customer Avatar & Helpful Action */}
      <div className="flex items-center justify-between pt-5 mt-5 border-t border-neutral-100 relative z-10">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-100 ring-2 ring-neutral-200 shrink-0">
            <Image
              src={rev.avatar}
              alt={rev.name}
              fill
              sizes="40px"
              className="object-cover"
            />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-neutral-900 leading-tight">
              {rev.name}
            </h4>
            <p className="text-[11px] text-neutral-500 font-medium">
              {rev.location}
            </p>
          </div>
        </div>

        {/* Interactive Helpful Upvote */}
        <button
          type="button"
          onClick={() => toggleHelpful(rev.id)}
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer ${
            likedReviews[rev.id]
              ? 'bg-black text-white'
              : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100 hover:text-black border border-neutral-200'
          }`}
          title="Mark review as helpful"
        >
          <ThumbsUp className={`w-3 h-3 ${likedReviews[rev.id] ? 'fill-white' : ''}`} />
          <span>{helpfulCounts[rev.id]}</span>
        </button>
      </div>
    </div>
  );

  return (
    <section className="w-full bg-white py-16 sm:py-20 border-t border-neutral-200">
      <Container>
        <div className="space-y-10">
          {/* Section Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-neutral-900 tracking-tight font-heading">
              Customer Words
            </h2>
          </div>

          {/* Testimonial Cards Desktop Grid (md and up) */}
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CUSTOMER_REVIEWS.map((rev) => renderReviewCard(rev))}
          </div>

          {/* Testimonial Mobile Auto Slider (Only 1 card visible at a time) */}
          <div
            className="md:hidden relative"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {CUSTOMER_REVIEWS.map((rev) => (
                  <div key={rev.id} className="w-full shrink-0">
                    {renderReviewCard(rev)}
                  </div>
                ))}
              </div>
            </div>

            {/* Slider Navigation & Indicators */}
            <div className="flex items-center justify-between pt-4 px-1">
              <button
                type="button"
                onClick={() =>
                  setCurrentSlide((prev) => (prev - 1 + CUSTOMER_REVIEWS.length) % CUSTOMER_REVIEWS.length)
                }
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-800 transition-all cursor-pointer active:scale-95 shadow-2xs"
                aria-label="Previous review"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1.5">
                {CUSTOMER_REVIEWS.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentSlide(i)}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === i
                        ? 'w-6 bg-neutral-900 shadow-2xs'
                        : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                    }`}
                    aria-label={`Go to review ${i + 1}`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => setCurrentSlide((prev) => (prev + 1) % CUSTOMER_REVIEWS.length)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-800 transition-all cursor-pointer active:scale-95 shadow-2xs"
                aria-label="Next review"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Value Props Trust Banner */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6 border-t border-neutral-200">
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                <Shirt className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  240 GSM French Terry
                </h5>
                <p className="text-[11px] text-neutral-500 font-medium">
                  Heavyweight boxy architectural drape
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Zero Crack Prints
                </h5>
                <p className="text-[11px] text-neutral-500 font-medium">
                  High-density durable screen prints
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Bio-Washed Cotton
                </h5>
                <p className="text-[11px] text-neutral-500 font-medium">
                  Pre-shrunk, soft touch & long-lasting
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div>
                <h5 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">
                  Damage Product Returns
                </h5>
                <p className="text-[11px] text-neutral-500 font-medium">
                  Hassle-free replacement for damaged items
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default SocialProofBlock;
