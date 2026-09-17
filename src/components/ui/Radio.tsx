import React, { forwardRef } from 'react';

export interface RadioOption {
  value: string;
  label: React.ReactNode;
  description?: string;
  badge?: string;
  disabled?: boolean;
}

export interface RadioGroupProps {
  name: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  error?: string;
  className?: string;
}

export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(
  ({ name, options, value, onChange, label, error, className = '' }, ref) => {
    return (
      <div ref={ref} className={`flex flex-col gap-2 ${className}`}>
        {label && (
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-700 mb-1">
            {label}
          </span>
        )}
        <div className="flex flex-col gap-2">
          {options.map((opt) => {
            const isSelected = value === opt.value;
            return (
              <label
                key={opt.value}
                className={`relative flex items-start gap-3.5 p-3.5 border transition-all cursor-pointer select-none ${
                  opt.disabled ? 'opacity-50 cursor-not-allowed bg-neutral-50' : ''
                } ${
                  isSelected
                    ? 'border-black bg-neutral-50 shadow-xs'
                    : 'border-neutral-200 bg-white hover:border-neutral-400'
                }`}
              >
                <div className="flex items-center justify-center mt-0.5">
                  <input
                    type="radio"
                    name={name}
                    value={opt.value}
                    checked={isSelected}
                    disabled={opt.disabled}
                    onChange={() => onChange(opt.value)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected ? 'border-black' : 'border-neutral-400'
                  }`}>
                    {isSelected && <div className="w-2 h-2 rounded-full bg-black" />}
                  </div>
                </div>

                <div className="flex-1 flex items-start justify-between gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-neutral-900 leading-snug">
                      {opt.label}
                    </span>
                    {opt.description && (
                      <span className="text-xs text-neutral-500 mt-0.5">{opt.description}</span>
                    )}
                  </div>
                  {opt.badge && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-neutral-900 text-white">
                      {opt.badge}
                    </span>
                  )}
                </div>
              </label>
            );
          })}
        </div>
        {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      </div>
    );
  }
);

RadioGroup.displayName = 'RadioGroup';
export default RadioGroup;
