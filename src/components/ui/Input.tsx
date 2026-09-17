import React, { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label ? (
          <label
            htmlFor={id}
            className="block text-[11px] font-medium tracking-wider uppercase text-[#686868]"
          >
            {label}
          </label>
        ) : null}
        <input
          id={id}
          ref={ref}
          className={twMerge(
            clsx(
              'w-full bg-white text-[#171717] placeholder:text-[#929292] text-xs px-3.5 py-3 border border-[#E6E3DD] focus:border-[#171717] focus:outline-none transition-colors duration-150',
              error && 'border-red-500 focus:border-red-500',
              className
            )
          )}
          {...props}
        />
        {error ? (
          <p className="text-[11px] text-red-500">{error}</p>
        ) : helperText ? (
          <p className="text-[11px] text-[#929292]">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
