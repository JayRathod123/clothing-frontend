import React, { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  prefixText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, prefixText, id, ...props }, ref) => {
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
        <div className="relative flex items-center">
          {prefixText ? (
            <div
              className={clsx(
                'absolute left-0 top-0 bottom-0 px-3.5 flex items-center justify-center bg-neutral-100 border-r border-neutral-300 text-neutral-700 text-xs font-bold select-none pointer-events-none rounded-l-xs z-10',
                error && 'border-r-red-500 text-red-700 bg-red-50/30'
              )}
            >
              {prefixText}
            </div>
          ) : null}
          <input
            id={id}
            ref={ref}
            className={twMerge(
              clsx(
                'w-full bg-white text-neutral-900 placeholder:text-neutral-400 text-sm px-4 py-3 border border-neutral-300 focus:border-black focus:outline-none transition-colors duration-150 font-medium',
                prefixText && 'pl-16',
                error && 'border-red-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20',
                className
              )
            )}
            {...props}
          />
        </div>
        {error ? (
          <p className="text-xs text-red-600 font-semibold">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-neutral-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';
