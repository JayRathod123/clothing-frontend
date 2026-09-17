'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface DropdownItem {
  id: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  danger?: boolean;
  disabled?: boolean;
  divider?: boolean;
}

export interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
  menuWidth?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className = '',
  menuWidth = 'w-52',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className={`relative inline-block text-left ${className}`}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer select-none">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 ${menuWidth} bg-white border border-neutral-200/90 shadow-2xl shadow-black/10 py-1.5 text-sm transition-all duration-150 ease-out animate-in fade-in-0 zoom-in-95 ${
            align === 'right' ? 'right-0' : 'left-0'
          }`}
        >
          {items.map((item) => (
            <React.Fragment key={item.id}>
              {item.divider && <div className="my-1 border-t border-neutral-100" />}
              <button
                type="button"
                disabled={item.disabled}
                onClick={() => {
                  item.onClick?.();
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2.5 flex items-center gap-2.5 transition-colors cursor-pointer select-none ${
                  item.disabled
                    ? 'opacity-40 cursor-not-allowed text-neutral-400'
                    : item.danger
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-neutral-800 hover:bg-neutral-100/80 hover:text-black font-medium'
                }`}
              >
                {item.icon && <span className="w-4 h-4 text-neutral-500 shrink-0">{item.icon}</span>}
                <span className="text-xs uppercase tracking-wider font-semibold">{item.label}</span>
              </button>
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
