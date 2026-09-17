'use client';

import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
  error?: string;
  badge?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, badge, className = '', id, checked, disabled, ...props }, ref) => {
    const inputId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className={`flex flex-col gap-1 text-left ${className}`}>
        <label
          htmlFor={inputId}
          className={`inline-flex items-start gap-3 select-none group ${
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
          }`}
        >
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              id={inputId}
              checked={checked}
              disabled={disabled}
              className="peer sr-only"
              {...props}
            />
            {/* Custom Box */}
            <div className="w-4 h-4 rounded-none border border-neutral-300 bg-white transition-all duration-150 peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-black peer-focus-visible:ring-offset-2 group-hover:border-black group-active:scale-90 flex items-center justify-center shadow-2xs">
              <Check className="w-3 h-3 text-white stroke-[3] scale-0 peer-checked:scale-100 transition-transform duration-150 ease-out" />
            </div>
          </div>

          {(label || description) && (
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                {label && (
                  <span className="text-xs font-semibold text-neutral-900 group-hover:text-black transition-colors leading-snug">
                    {label}
                  </span>
                )}
                {badge && (
                  <span className="text-[10px] px-1.5 py-0.2 bg-neutral-100 text-neutral-600 font-medium">
                    {badge}
                  </span>
                )}
              </div>
              {description && (
                <span className="text-[11px] text-neutral-500 leading-normal mt-0.5">
                  {description}
                </span>
              )}
            </div>
          )}
        </label>
        {error && <span className="text-[11px] text-red-600 font-medium ml-7">{error}</span>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
