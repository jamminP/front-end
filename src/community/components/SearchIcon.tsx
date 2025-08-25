import { useState } from 'react';
import SearchPopover from './Search';
import { baseClass } from './CreatePostButton';
import type { PostCategory } from '../api/types';

export default function SearchIcon({ category = 'all' }: { category?: PostCategory }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button aria-label="검색" className={baseClass} onClick={() => setOpen((v) => !v)}>
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
        >
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <SearchPopover category={category} onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
