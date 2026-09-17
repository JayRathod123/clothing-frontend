import React from 'react';
import { Container } from '@/components/layout/Container';

export function BrandStatementBlock() {
  return (
    <section className="py-28 md:py-40 bg-[#F7F6F2] border-b border-[#E6E3DD]">
      <Container size="md">
        <div className="text-center space-y-8">
          <span className="editorial-kicker text-[#8A6A45]">
            PHILOSOPHY // 2026
          </span>

          <h2 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight text-[#171717] leading-[1.08]">
            LESS NOISE. <br />
            <span className="font-semibold">BETTER CLOTHES.</span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-[#686868] font-light max-w-xl mx-auto leading-relaxed">
            “Designed with considered fits, premium fabrics, and everyday versatility. Built to outlast the trend cycle.”
          </p>
        </div>
      </Container>
    </section>
  );
}
