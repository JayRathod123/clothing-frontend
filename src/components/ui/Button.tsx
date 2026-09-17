import React, { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 uppercase disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none';

    const variants = {
      primary:
        'bg-[#171717] text-white hover:bg-black active:scale-[0.99] border border-[#171717]',
      secondary:
        'bg-[#EFEEE9] text-[#171717] hover:bg-[#E6E3DD] border border-[#E6E3DD]',
      outline:
        'bg-transparent text-[#171717] border border-[#171717] hover:bg-[#171717] hover:text-white',
      ghost:
        'bg-transparent text-[#171717] hover:bg-black/5',
      accent:
        'bg-[#8A6A45] text-white hover:bg-[#785B3A] border border-[#8A6A45]',
    };

    const sizes = {
      sm: 'text-xs px-4 py-2 font-bold tracking-wider gap-2',
      md: 'text-sm px-6 py-3 font-extrabold tracking-wider gap-2.5',
      lg: 'text-sm sm:text-base px-8 py-3.5 font-extrabold tracking-wider gap-3',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={twMerge(
          clsx(
            baseStyles,
            variants[variant],
            sizes[size],
            fullWidth && 'w-full',
            className
          )
        )}
        {...props}
      >
        {isLoading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
