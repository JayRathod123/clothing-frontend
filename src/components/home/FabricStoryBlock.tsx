import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';

export function FabricStoryBlock() {
  const attributes = [
    {
      num: '01',
      title: 'Premium Fabric',
      desc: '100% long-staple combed ringspun cotton selected for tactile breathability and pure natural drape.',
    },
    {
      num: '02',
      title: 'Considered Fit',
      desc: 'Tested and refined pattern cuts with engineered shoulder drop and tailored body proportions.',
    },
    {
      num: '03',
      title: 'Durable Construction',
      desc: 'Twin-needle lock stitching, bar-tacked stress points, and anti-stretch collars that hold shape.',
    },
    {
      num: '04',
      title: 'Made for Everyday',
      desc: 'Pre-shrunk and enzyme-washed to seamlessly integrate into high-rotation daily wear.',
    },
  ];

  return (
    <section className="py-24 md:py-36 bg-white border-y border-[#E6E3DD]">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left: Close-up textile weave macro photography (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-square w-full overflow-hidden bg-[#EFEEE9] border border-[#E6E3DD]">
              <Image
                src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1000&auto=format&fit=crop"
                alt="240 GSM Heavyweight Cotton Macro Texture"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-xs text-white p-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#E6E3DD]">
                  MACRO WEAVE INSPECTION
                </p>
                <p className="text-xs font-light text-white/90">
                  Dense single-jersey 240 GSM knit
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between text-[11px] text-[#686868] uppercase tracking-wider">
              <span>ZERO SYNTHETIC FILLERS</span>
              <span>100% COMBED COTTON</span>
            </div>
          </div>

          {/* Right: Editorial Material Narrative & Attributes (7 cols) */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <span className="editorial-kicker text-[#8A6A45]">
                MATERIAL STORY // STANDARDS
              </span>
              <h2 className="text-3xl sm:text-4xl font-light tracking-tight text-[#171717]">
                240 GSM <br />
                <span className="font-semibold">HEAVYWEIGHT COTTON</span>
              </h2>
              <p className="text-xs sm:text-sm text-[#686868] leading-relaxed max-w-lg">
                We believe true quiet luxury begins at yarn level. By utilizing heavy yarn counts without
                coarse stiffness, our garments achieve an elevated architectural silhouette.
              </p>
            </div>

            {/* 4 Quality Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-[#E6E3DD]">
              {attributes.map((attr) => (
                <div key={attr.num} className="space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-[#8A6A45]">
                    {attr.num}
                  </span>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-[#171717]">
                    {attr.title}
                  </h4>
                  <p className="text-xs text-[#686868] leading-relaxed">
                    {attr.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
