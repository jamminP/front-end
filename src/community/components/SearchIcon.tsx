import { useState } from 'react';
import SearchPopover from './Search';
import searchIcon from '../img/search.png';
import { baseClass } from './CreatePostButton';

export default function SearchIcon() {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button aria-label="검색" className={baseClass} onClick={() => setOpen((v) => !v)}>
        <img src={searchIcon} className="h-5 w-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <SearchPopover onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
