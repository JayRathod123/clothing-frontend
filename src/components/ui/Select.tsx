'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  name?: string;
  id?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  menuClassName?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal' | 'pill';
  align?: 'left' | 'right';
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value: controlledValue,
  defaultValue,
  onChange,
  name,
  id,
  placeholder = 'Select an option',
  error,
  helperText,
  disabled = false,
  className = '',
  triggerClassName = '',
  menuClassName = '',
  size = 'md',
  variant = 'default',
  align = 'left',
}) => {
  const [internalValue, setInternalValue] = useState<string>(
    controlledValue !== undefined ? controlledValue : defaultValue || ''
  );
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledValue !== undefined;
  const selectedValue = isControlled ? controlledValue : internalValue;
  const selectedOption = options.find((opt) => opt.value === selectedValue);

  // Sync internal state if controlledValue changes
  useEffect(() => {
    if (isControlled && controlledValue !== undefined) {
      setInternalValue(controlledValue);
    }
  }, [isControlled, controlledValue]);

  // Handle outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  const handleSelect = useCallback(
    (val: string) => {
      if (!isControlled) {
        setInternalValue(val);
      }
      onChange?.(val);
      setIsOpen(false);
    },
    [isControlled, onChange]
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        const currentIndex = options.findIndex((opt) => opt.value === selectedValue);
        setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
      }
      return;
    }

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => {
          let next = prev + 1;
          while (next < options.length && options[next]?.disabled) {
            next++;
          }
          return next < options.length ? next : prev;
        });
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => {
          let next = prev - 1;
          while (next >= 0 && options[next]?.disabled) {
            next--;
          }
          return next >= 0 ? next : prev;
        });
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < options.length) {
          const opt = options[highlightedIndex];
          if (opt && !opt.disabled) {
            handleSelect(opt.value);
          }
        }
        break;
      case 'Tab':
        setIsOpen(false);
        break;
      default:
        break;
    }
  };

  // Size variations
  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 min-h-[34px] gap-2',
    md: 'text-xs px-3.5 py-2.5 min-h-[42px] gap-2.5',
    lg: 'text-sm px-4 py-3 min-h-[48px] gap-3',
  };

  // Variant variations
  const variantStyles = {
    default:
      'bg-white border border-neutral-300 hover:border-neutral-900 focus:border-black rounded-none shadow-2xs',
    minimal:
      'bg-transparent border-b border-neutral-300 hover:border-black focus:border-black rounded-none px-1 py-1.5 shadow-none',
    pill:
      'bg-neutral-50 border border-neutral-200 hover:border-neutral-400 focus:border-black rounded-full px-4',
  };

  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex flex-col text-left ${className}`}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden input for form integration */}
      {name && <input type="hidden" name={name} value={selectedValue} />}

      {/* Label */}
      {label && (
        <label
          htmlFor={selectId}
          onClick={() => !disabled && setIsOpen((prev) => !prev)}
          className="text-[11px] font-bold uppercase tracking-wider text-neutral-800 mb-1.5 select-none cursor-pointer"
        >
          {label}
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        id={selectId}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`w-full flex items-center justify-between font-semibold tracking-wide text-neutral-900 transition-all cursor-pointer select-none outline-none ${
          sizeStyles[size]
        } ${variantStyles[variant]} ${
          error ? '!border-red-500 ring-1 ring-red-500' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed bg-neutral-100' : ''} ${triggerClassName}`}
      >
        <span className="truncate">
          {selectedOption ? (
            <span className="text-neutral-900 font-medium tracking-wide">
              {selectedOption.label}
            </span>
          ) : (
            <span className="text-neutral-400 font-normal">{placeholder}</span>
          )}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-neutral-500 shrink-0 transition-transform duration-200 ease-out ${
            isOpen ? 'rotate-180 text-black' : ''
          }`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          role="listbox"
          tabIndex={-1}
          className={`absolute z-50 mt-1.5 w-full min-w-[200px] bg-white border border-neutral-200/90 shadow-xl shadow-black/10 py-1 max-h-64 overflow-y-auto outline-none transition-all duration-150 ease-out animate-in fade-in-0 zoom-in-95 ${
            align === 'right' ? 'right-0' : 'left-0'
          } ${menuClassName}`}
          style={{ top: '100%' }}
        >
          {options.map((option, index) => {
            const isSelected = option.value === selectedValue;
            const isHighlighted = highlightedIndex === index;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                disabled={option.disabled}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 text-xs tracking-wide transition-colors cursor-pointer select-none ${
                  option.disabled
                    ? 'opacity-40 cursor-not-allowed text-neutral-400'
                    : isSelected
                    ? 'bg-neutral-50 text-black font-bold'
                    : isHighlighted
                    ? 'bg-neutral-100/70 text-neutral-900 font-medium'
                    : 'text-neutral-700 hover:bg-neutral-100/70'
                }`}
              >
                <div className="flex flex-col truncate pr-2">
                  <span className="truncate">{option.label}</span>
                  {option.sublabel && (
                    <span className="text-[10px] text-neutral-400 font-normal truncate">
                      {option.sublabel}
                    </span>
                  )}
                </div>

                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-black stroke-[2.5] shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Error or Helper text */}
      {error ? (
        <span className="text-[11px] text-red-600 font-medium mt-1">{error}</span>
      ) : helperText ? (
        <span className="text-[11px] text-neutral-500 mt-1">{helperText}</span>
      ) : null}
    </div>
  );
};

export default Select;
