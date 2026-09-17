import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export function FinalCtaBlock() {
  return (
    <section className="relative w-full py-28 md:py-36 overflow-hidden bg-[#171717] text-white">
      {/* Background Image with muted contrast */}
      <div className="absolute inset-0">
        <Image
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
          alt="Explore Collection"
          fill
          sizes="100vw"
          className="object-cover object-center opacity-30"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center space-y-6">
        <span className="editorial-kicker text-[#E6E3DD]">
          DISCOVER THE ARCHIVE
        </span>

        <h2 className="text-3xl sm:text-5xl font-light tracking-tight text-white leading-tight">
          FIND YOUR <br />
          <span className="font-semibold">EVERYDAY.</span>
        </h2>

        <p className="text-xs sm:text-sm text-white/80 font-light max-w-md mx-auto leading-relaxed">
          Explore the full contemporary collection. Thoughtfully designed essentials crafted for longevity.
        </p>

        <div className="pt-4">
          <Link href="/shop">
            <Button
              variant="primary"
              size="lg"
              className="bg-white text-[#171717] hover:bg-neutral-200 border-white font-semibold px-8"
            >
              Shop Now
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
