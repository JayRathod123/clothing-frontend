import React from 'react';

export function AnnouncementBar() {
  return (
    <div className="bg-[#171717] text-[#EFEEE9] text-[10px] tracking-widest uppercase font-medium py-2 px-4 text-center border-b border-black/10 overflow-hidden">
      <div className="flex items-center justify-center gap-3">
        <span>COMPLIMENTARY DOMESTIC SHIPPING ON ORDERS OVER ₹999</span>
        <span className="text-[#8A6A45] hidden sm:inline">•</span>
        <span className="hidden sm:inline">240 GSM SIGNATURE TEXTILES</span>
      </div>
    </div>
  );
}
