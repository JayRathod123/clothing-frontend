import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={twMerge(
        clsx(
          'animate-pulse bg-[#E6E3DD]/70 rounded-none',
          className
        )
      )}
      {...props}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-2 border border-neutral-200/70 space-y-2.5">
      <Skeleton className="aspect-4/5 w-full rounded-xl" />
      <div className="space-y-1.5 py-1 px-1 flex flex-col items-center">
        <Skeleton className="h-3 w-20 rounded-full" />
        <Skeleton className="h-3.5 w-32 rounded-md" />
        <Skeleton className="h-4 w-24 rounded-md" />
      </div>
    </div>
  );
}
