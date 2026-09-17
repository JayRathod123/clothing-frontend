import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'full';
}

export function Container({
  children,
  size = 'lg',
  className,
  ...props
}: ContainerProps) {
  const maxSizes = {
    sm: 'max-w-4xl',
    md: 'max-w-6xl',
    lg: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div
      className={twMerge(
        clsx(
          'w-full mx-auto px-4 sm:px-6 lg:px-8',
          maxSizes[size],
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
