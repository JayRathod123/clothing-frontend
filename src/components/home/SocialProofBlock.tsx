import React from 'react';
import Image from 'next/image';
import { Container } from '@/components/layout/Container';
import { RatingStars } from '@/components/common/RatingStars';
import { SOCIAL_PROOF_GALLERY } from '@/constants/mockData';

export function SocialProofBlock() {
  return (
    <section className="py-20 md:py-28 bg-[#F7F6F2]">
      <Container>
        <div className="space-y-12">
          {/* Header & Feature Review */}
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="editorial-kicker text-[#8A6A45]">
              COMMUNITY VOICE
            </span>

            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[#171717]">
              “WORN BY PEOPLE WHO GET IT.”
            </h2>

            <div className="flex justify-center pt-1">
              <RatingStars rating={5.0} showText={false} />
            </div>

            <blockquote className="text-sm sm:text-base text-[#171717] font-medium leading-relaxed italic">
              “The drape on the 240 GSM tee and pleated trousers is incomparable.
              Holds its silhouette after repeated cold cycles. Quiet luxury execution without the artificial luxury markup.”
            </blockquote>

            <p className="text-xs font-semibold uppercase tracking-widest text-[#686868]">
              — Siddharth V., Architect & Creative Director
            </p>
          </div>

          {/* Clean Horizontal Lifestyle/Community Outfits Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-4">
            {SOCIAL_PROOF_GALLERY.map((item) => (
              <div
                key={item.id}
                className="relative aspect-3/4 overflow-hidden bg-[#EFEEE9] border border-[#E6E3DD] group"
              >
                <Image
                  src={item.image}
                  alt={`Patron ${item.author}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover object-center group-hover:scale-103 transition-transform duration-500 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <div className="text-white text-[11px]">
                    <p className="font-semibold">{item.author}</p>
                    <p className="text-[9px] text-white/75">{item.location}</p>
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
