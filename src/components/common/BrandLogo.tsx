import React from 'react';
import Link from 'next/link';

interface BrandLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function BrandLogo({ className = '', size = 'md', showTagline = true }: BrandLogoProps) {
  const isSm = size === 'sm';
  const isLg = size === 'lg';

  return (
    <Link href="/" className={`group inline-flex flex-col items-center select-none ${className}`}>
      <div className="flex items-baseline tracking-tight">
        <span className={`font-black text-neutral-900 ${isSm ? 'text-xl' : isLg ? 'text-3xl' : 'text-2xl'}`}>
          iNK
        </span>
        <span className="relative mx-0.5 inline-block">
          <span className={`font-black text-sky-500 italic ${isSm ? 'text-2xl' : isLg ? 'text-4xl' : 'text-3xl'}`}>
            S
          </span>
          {/* Subtle hanger curve over the S */}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-3 h-2 border-t-2 border-sky-500 rounded-full" />
        </span>
        <span className={`font-black text-neutral-900 tracking-wider ${isSm ? 'text-xl' : isLg ? 'text-3xl' : 'text-2xl'}`}>
          TYLES
        </span>
      </div>

      {showTagline && (
        <span className={`font-serif italic text-neutral-800 tracking-wider -mt-0.5 ${
          isSm ? 'text-[11px]' : isLg ? 'text-sm' : 'text-xs'
        }`}>
          Action of being
        </span>
      )}
    </Link>
  );
}
