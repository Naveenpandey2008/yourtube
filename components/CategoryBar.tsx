'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CATEGORIES } from '@/app/data';

interface CategoryBarProps {
  onSelect?: (category: string) => void;
}

export default function CategoryBar({ onSelect }: CategoryBarProps) {
  const [selected, setSelected] = useState('All');
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'right' ? 300 : -300, behavior: 'smooth' });
  };

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowLeft(el.scrollLeft > 10);
    setShowRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const handleSelect = (cat: string) => {
    setSelected(cat);
    onSelect?.(cat);
  };

  return (
    <div className="relative flex items-center">
      {/* Left fade + button */}
      {showLeft && (
        <div className="absolute left-0 z-10 flex items-center h-full">
          <div className="w-16 h-full bg-gradient-to-r from-yt-bg to-transparent" />
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 w-8 h-8 rounded-full bg-yt-surface border border-yt-border flex items-center justify-center hover:bg-yt-border transition-colors shadow-lg"
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}

      {/* Chips */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-2 overflow-x-auto scrollbar-hide py-3"
      >
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => handleSelect(cat)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
              selected === cat
                ? 'bg-white text-black'
                : 'bg-yt-surface text-yt-text hover:bg-yt-border'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Right fade + button */}
      {showRight && (
        <div className="absolute right-0 z-10 flex items-center h-full justify-end">
          <div className="w-16 h-full bg-gradient-to-l from-yt-bg to-transparent" />
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 w-8 h-8 rounded-full bg-yt-surface border border-yt-border flex items-center justify-center hover:bg-yt-border transition-colors shadow-lg"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
