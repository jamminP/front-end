import { useMemo, useState } from 'react';
import { SearchScope } from '../api/types';
import useDebounce from '../hook/useDebounce';
import { useSearchPosts } from '../hook/useSearchPosts';

interface Props {
  onClose?: () => void;
  defaultScope?: SearchScope;
  category?: 'free' | 'share' | 'study' | 'all';
}

export function SearchPopover({ onClose, defaultScope = 'title', category = 'all' }: Props) {
  const [scope, setScope] = useState<SearchScope>(defaultScope);
  const [q, setQ] = useState('');

  const debouncedQ = useDebounce(q, 5000);

  const { data, isFetching, fetchNextPage, hasNextPage, isLoading, isError } = useSearchPosts({
    q: debouncedQ,
    scope,
    category,
    limit: 20,
  });

  const items = useMemo(() => {
    return data?.pages.flatMap((p) => p.items) ?? [];
  }, [data]);

  return (
    <div className="w-[400px] rounded-xl border-[0.5px] border-gray-300 shadow-lg bg-white pt-1.5 px-1.5">
      <div className="flex gap-2 items-center">
        <select
          value={scope}
          onChange={(e) => setScope(e.target.value as SearchScope)}
          className="border-[0.5px] border-gray-300 rounded-lg px-2 py-1.5 text-sm"
        >
          <option value="title">제목만</option>
          <option value="title_content">제목 + 글</option>
          <option value="content">글만</option>
        </select>

        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="검색어를 입력해주세요"
          className="flex-1 border-[0.5px] border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2"
        />

        <button
          className="px-3 py-1.5 rounded-lg bg-[#1B3043] text-white text-sm"
          onClick={onClose}
        >
          닫기
        </button>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {q && !debouncedQ && <p>입력 중…</p>}
        {isLoading && debouncedQ && <p>검색 중…</p>}
        {isError && <p>검색 중 오류가 발생했습니다.</p>}
        {!isLoading && debouncedQ && items.length === 0 && <p>결과가 없습니다.</p>}
      </div>

      <ul className="mt-2 max-h-72 overflow-auto divide-y">
        {items.map((it) => (
          <li key={`${it.category}-${it.post_id}`} className="py-2">
            <a href={`/community/${it.category}/${it.post_id}`} className="block" onClick={onClose}>
              <div className="text-sm font-medium line-clamp-1">{it.title}</div>
              <div className="text-xs text-gray-500 line-clamp-1">{it.content}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                {it.author_id} · {new Date(it.created_at).toLocaleString()}
              </div>
            </a>
          </li>
        ))}
      </ul>

      {hasNextPage && (
        <div className="mt-2">
          <button
            disabled={isFetching}
            onClick={() => fetchNextPage()}
            className="w-full border rounded-lg py-2 text-sm disabled:opacity-60"
          >
            {isFetching ? '불러오는 중…' : '더 불러오기'}
          </button>
        </div>
      )}
    </div>
  );
}

export default function SearchIcon() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        aria-label="검색"
        className="p-2 rounded-full hover:bg-gray-100"
        onClick={() => setOpen((v) => !v)}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-6 h-6"
        >
          <path
            fillRule="evenodd"
            d="M10.5 3a7.5 7.5 0 105.02 13.19l3.646 3.646a.75.75 0 101.06-1.06l-3.646-3.647A7.5 7.5 0 0010.5 3zm-6 7.5a6 6 0 1112 0 6 6 0 01-12 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 z-50">
          <SearchPopover onClose={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}
