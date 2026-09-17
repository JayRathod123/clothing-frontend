import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Container } from '@/components/layout/Container';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { THEME } from '@/constants/theme';
import { ShieldCheck, Sparkles, Feather, ArrowRight, Layers } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Our Brand & Textile Heritage | KINETIC // STUDIO',
  description: 'Learn about KINETIC // STUDIO, our 240 GSM combed cotton fabric philosophy, and our mission to elevate Indian streetwear silhouettes.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Editorial Hero Banner */}
      <div className="relative w-full h-[55vh] min-h-[420px] bg-black text-white flex items-center justify-center overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=85&w=2000&auto=format&fit=crop"
          alt="Streetwear Atelier"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_35%] opacity-45"
        />
        <div className="relative z-10 max-w-3xl text-center px-4 space-y-4">
          <span className="inline-block text-[11px] font-black uppercase tracking-[0.25em] text-red-500 bg-black/60 px-3 py-1 border border-white/20 backdrop-blur-xs">
            BRAND MANIFESTO
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white">
            Quiet Confidence. <br />
            <span className="text-neutral-300 font-light">Architectural Drape.</span>
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto font-normal leading-relaxed">
            Born out of frustration with flimsy fast-fashion tees that shrink and distort after one wash. Engineered for longevity, heavyweight presence, and modern Indian street culture.
          </p>
        </div>
      </div>

      <Container>
        <div className="py-8">
          <Breadcrumb items={[{ label: 'About Us' }]} />
        </div>

        {/* Story Section */}
        <div className="py-12 border-b border-neutral-200">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-red-600 block">
                OUR PHILOSOPHY
              </span>
              <h2 className="text-2xl sm:text-4xl font-black uppercase tracking-tight text-neutral-900 leading-snug">
                Not Just a T-Shirt. <br />
                A Structural Foundation.
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
                <p>
                  At <strong className="text-neutral-900">{THEME.store.name}</strong>, we believe that an everyday t-shirt is the most consequential garment in your rotation. It sets the proportion for everything else you wear.
                </p>
                <p>
                  Most brands cut corners with 160 GSM open-end carded yarns that billow and twist. We formulate our own bespoke knit: <strong>240 GSM 100% super-combed ringspun French Terry cotton</strong>, spun from long-staple fibers that retain their shape and deep color through hundreds of washes.
                </p>
                <p>
                  Every drop is manufactured in limited batches right here in India, pairing traditional mill craftsmanship with modern boxy silhouettes and high-density screen printing.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-neutral-800 transition-colors"
                >
                  <span>Explore The Archive</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="relative h-72 sm:h-96 overflow-hidden border border-neutral-200">
                <Image
                  src="https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop"
                  alt="Fabric Detail"
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>
              <div className="relative h-72 sm:h-96 overflow-hidden border border-neutral-200 mt-8">
                <Image
                  src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop"
                  alt="Pattern Cut"
                  fill
                  sizes="400px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 4 Pillars Grid */}
        <div className="py-16">
          <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-red-600">
              THE 4 PILLARS
            </span>
            <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-neutral-900">
              Engineered Differently
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                240 GSM French Terry
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                Substantial fabric weight that drapes cleanly without clinging. Holds an architectural stance throughout the day.
              </p>
            </div>

            <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                <Feather className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                Pre-Shrunk Bio-Wash
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                Natural enzyme washes buff away surface fuzz, imparting a silk-soft feel with guaranteed zero post-wash shrinkage.
              </p>
            </div>

            <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                1.25" High Rib Collar
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                High-density 1x1 lycra-infused ribbing that never bakes, curls, or sags after machine washes.
              </p>
            </div>

            <div className="p-6 bg-neutral-50 border border-neutral-200 space-y-3">
              <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-black uppercase tracking-wider text-neutral-900">
                Ethical Small Batches
              </h4>
              <p className="text-xs text-neutral-600 leading-relaxed font-normal">
                Produced in verified Indian artisanal facilities adhering to fair wages, safe dye disposal, and zero plastic packaging.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
