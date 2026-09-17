import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'accent' | 'outline' | 'surface';
  className?: string;
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default: 'bg-[#171717] text-white',
    accent: 'bg-[#8A6A45] text-white',
    outline: 'bg-transparent text-[#171717] border border-[#E6E3DD]',
    surface: 'bg-[#EFEEE9] text-[#171717]',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center text-[10px] uppercase font-semibold tracking-widest px-2.5 py-1',
          variants[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
}
