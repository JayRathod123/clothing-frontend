'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpenId?: string;
  allowMultiple?: boolean;
}

export function Accordion({ items, defaultOpenId, allowMultiple = false }: AccordionProps) {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggle = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className="divide-y divide-[#E6E3DD] border-y border-[#E6E3DD]">
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div key={item.id} className="py-4">
            <button
              onClick={() => toggle(item.id)}
              className="w-full flex items-center justify-between text-left group focus:outline-none"
              aria-expanded={isOpen}
            >
              <span className="text-xs uppercase tracking-widest font-medium text-[#171717] group-hover:text-[#8A6A45] transition-colors">
                {item.title}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-[#686868] transition-transform duration-200 ${
                  isOpen ? 'transform rotate-180 text-[#171717]' : ''
                }`}
              />
            </button>
            {isOpen ? (
              <div className="pt-3 text-xs leading-relaxed text-[#686868] animate-in fade-in duration-150">
                {item.content}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
