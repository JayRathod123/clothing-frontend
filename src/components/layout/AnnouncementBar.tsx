'use client';

import React, { useState, useEffect } from 'react';
import { THEME } from '@/constants/theme';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function AnnouncementBar() {
  const announcements = THEME.store.announcements;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [isPaused, announcements.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  return (
    <div
      className="bg-black text-white text-[11px] tracking-widest uppercase font-bold py-2 px-3 border-b border-neutral-800 relative z-40 select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Previous announcement"
          className="text-neutral-500 hover:text-white transition-colors p-0.5"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <div className="overflow-hidden flex-1 text-center py-0.5">
          <p className="transition-all duration-300 transform inline-block text-neutral-100 font-semibold tracking-wider">
            {announcements[currentIndex]}
          </p>
        </div>

        <button
          type="button"
          onClick={handleNext}
          aria-label="Next announcement"
          className="text-neutral-500 hover:text-white transition-colors p-0.5"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

export default AnnouncementBar;
