import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
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
}

const CUSTOMER_REVIEWS: CustomerReview[] = [
  {
    id: 'rev-1',
    name: 'Sachin Kumar',
    location: 'Bengaluru, Karnataka',
    rating: 5,
    date: '2 days ago',
    title: 'Fabric and print quality are unreal!',
    comment: 'The 240 GSM weight is the exact thick streetwear feel I have been looking for. The graphic print does not peel or fade even after multiple machine washes. Will definitely buy again!',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200',
  },
  {
    id: 'rev-2',
    name: 'Priya Sharma',
    location: 'Mumbai, Maharashtra',
    rating: 5,
    date: '1 week ago',
    title: 'Perfect oversized silhouette',
    comment: 'Ordered size M and the boxy drop shoulder fits like a glove. Received so many compliments on the Sneaky Cartoon print at college. Delivery was super fast too!',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200',
  },
  {
    id: 'rev-3',
    name: 'Aman Verma',
    location: 'Delhi NCR',
    rating: 5,
    date: '2 weeks ago',
    title: 'Value for money 100%',
    comment: 'Better quality than international brands charging ₹3000+. The collar rib is tight and structured, zero drooping. InkStyles is my new go-to for graphic tees.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200',
  },
];

export function SocialProofBlock() {
  return (
    <section className="w-full bg-[#FFFFFF] py-16 px-4 sm:px-6 lg:px-8 border-t border-neutral-100">
      <Container>
        <div className="space-y-10">
          {/* Section Header */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Customer Words
            </h2>
            <div className="flex items-center justify-center gap-1.5 pt-1">
              <div className="flex items-center text-[#0F766E]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#0F766E] text-[#0F766E]" />
                ))}
              </div>
              <span className="text-xs font-semibold text-neutral-600">
                Rated 4.9/5 by 1,400+ Streetwear Enthusiasts
              </span>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CUSTOMER_REVIEWS.map((rev) => (
              <div
                key={rev.id}
                className="bg-[#F8F9FA] rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  {/* Stars & Date */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-[#0F766E]">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#0F766E] text-[#0F766E]" />
                      ))}
                    </div>
                    <span className="text-[11px] text-neutral-400 font-medium">
                      {rev.date}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900">
                    &ldquo;{rev.title}&rdquo;
                  </h3>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {rev.comment}
                  </p>
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-3 pt-3 border-t border-neutral-200">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-neutral-200">
                    <Image
                      src={rev.avatar}
                      alt={rev.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-neutral-900">
                      {rev.name}
                    </h4>
                    <p className="text-[10px] text-neutral-500">
                      {rev.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default SocialProofBlock;
