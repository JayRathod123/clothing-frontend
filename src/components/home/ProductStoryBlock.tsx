'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { Button } from '@/components/ui/Button';
import { ArrowRight } from 'lucide-react';

export function ProductStoryBlock() {
  return (
    <section className="py-24 md:py-36 bg-[#F7F6F2] border-b border-[#E6E3DD]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Large Architectural Product Image (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative aspect-4/5 w-full overflow-hidden bg-[#EFEEE9] border border-[#E6E3DD]">
              <Image
                src="https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=85&w=1200&auto=format&fit=crop"
                alt="The Oversized Tee Anatomy"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center"
              />
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs px-3 py-1 text-[10px] uppercase font-bold tracking-widest text-[#171717]">
                CORE ANATOMY
              </div>
            </div>
          </div>

          {/* Right: Typography-driven Storytelling (5 cols) */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-3">
              <span className="editorial-kicker text-[#8A6A45]">
                WHY THIS PIECE
              </span>

              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-[#171717] uppercase">
                THE OVERSIZED TEE
              </h2>

              <p className="text-xs text-[#686868] leading-relaxed">
                Most t-shirts lose their form within months. We engineered a proprietary 240 GSM combed
                cotton interlock that maintains its intentional drape, structural high collar, and crisp
                shoulder drop through countless wear cycles.
              </p>
            </div>

            {/* 3 Technical Pillars */}
            <div className="space-y-4 border-t border-[#E6E3DD] pt-6">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#171717]">
                  <span>240 GSM</span>
                  <span className="text-[#8A6A45]">Density</span>
                </div>
                <p className="text-[11px] text-[#686868]">
                  Ultra-dense knit preventing transparency while providing clean sculptural hang.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#171717]">
                  <span>PREMIUM COMBED COTTON</span>
                  <span className="text-[#8A6A45]">Fiber</span>
                </div>
                <p className="text-[11px] text-[#686868]">
                  Long-staple yarn brushed for silk handfeel with zero synthetic poly blending.
                </p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#171717]">
                  <span>RELAXED BOXY CUT</span>
                  <span className="text-[#8A6A45]">Fit</span>
                </div>
                <p className="text-[11px] text-[#686868]">
                  Subtle 3cm drop on shoulders with relaxed body width and a 2.5cm anti-stretch collar.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/product/oversized-essential-tee">
                <Button variant="primary" size="md" className="gap-2">
                  <span>Explore The Piece</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
