import React, { forwardRef } from 'react';
import { Check } from 'lucide-react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
  description?: string;
  error?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, description, error, className = '', id, checked, ...props }, ref) => {
    const inputId = id || (typeof label === 'string' ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="flex flex-col gap-1 text-left">
        <label htmlFor={inputId} className="inline-flex items-start gap-3 cursor-pointer group select-none">
          <div className="relative flex items-center justify-center mt-0.5">
            <input
              ref={ref}
              type="checkbox"
              id={inputId}
              checked={checked}
              className="peer sr-only"
              {...props}
            />
            <div className="w-4.5 h-4.5 border border-neutral-400 bg-white transition-all peer-checked:bg-black peer-checked:border-black peer-focus-visible:ring-2 peer-focus-visible:ring-black peer-focus-visible:ring-offset-1 group-hover:border-black flex items-center justify-center">
              <Check className="w-3 h-3 text-white stroke-[3] opacity-0 peer-checked:opacity-100 transition-opacity" />
            </div>
          </div>
          {(label || description) && (
            <div className="flex flex-col">
              {label && <span className="text-sm font-medium text-neutral-900 leading-snug">{label}</span>}
              {description && <span className="text-xs text-neutral-500 leading-normal">{description}</span>}
            </div>
          )}
        </label>
        {error && <span className="text-xs text-red-600 font-medium ml-7">{error}</span>}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox';
export default Checkbox;
