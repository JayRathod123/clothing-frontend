'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  position?: 'right' | 'left';
  width?: string;
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  position = 'right',
  width = 'max-w-md',
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
      document.body.style.overflow = 'hidden';
      return () => cancelAnimationFrame(frame);
    } else {
      setVisible(false);
      // Graceful 480ms exit matching the new smooth luxury duration
      const timer = setTimeout(() => {
        setMounted(false);
      }, 480);
      document.body.style.overflow = '';
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const isRight = position === 'right';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dimming Backdrop with Graceful 500ms Fade */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-500 ease-out will-change-opacity ${
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Slide Drawer Panel with Gentle, Luxurious 520ms Deceleration Curve */}
      <div
        className={`fixed top-0 bottom-0 ${
          isRight ? 'right-0' : 'left-0'
        } z-50 w-full ${width} bg-[#F7F6F2] border-l border-[#E6E3DD] shadow-[-10px_0_40px_rgba(0,0,0,0.12)] flex flex-col transform transition-transform duration-520 ease-[cubic-bezier(0.25,1,0.5,1)] will-change-transform ${
          visible
            ? 'translate-x-0'
            : isRight
            ? 'translate-x-full'
            : '-translate-x-full'
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E6E3DD] bg-white">
          <h2 className="text-xs uppercase tracking-widest font-semibold text-[#171717]">
            {title || ''}
          </h2>
          <button
            onClick={onClose}
            className="text-[#686868] hover:text-[#171717] transition-colors p-1 cursor-pointer"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
