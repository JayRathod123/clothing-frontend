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
            className="block text-xs font-bold tracking-wider uppercase text-neutral-800"
          >
            {label}
          </label>
        ) : null}
        <input
          id={id}
          ref={ref}
          className={twMerge(
            clsx(
              'w-full bg-white text-neutral-900 placeholder:text-neutral-400 text-sm px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors duration-150 font-medium',
              error && 'border-red-500 focus:border-red-500',
              className
            )
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs text-red-500 font-medium">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-neutral-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
