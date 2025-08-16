import { useCallback, useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useDebounceCallback } from '../hook/useDebouncedCallback';
import { getAllPosts } from '../api/community';
import { Post } from './Postcard';

type SearchMode = 'title' | 'title+content' | 'content';

type Props = {
  onResults?: (results: Post[]) => void;
  defaultMode?: SearchMode;
  debounceMs?: number;
  className?: string;
};

export default function Search({
  onResults,
  defaultMode = 'title',
  debounceMs = 3000,
  className = '',
}: Props) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<SearchMode>(defaultMode);
  const [query, setQuery] = useState('');

  const { data: allPosts = [], isLoading } = useQuery({
    queryKey: ['all-posts'],
    queryFn: () => getAllPosts(),
    staleTime: 60_000,
  });

  const filter = useCallback((posts: Post[], q: string, m: SearchMode) => {
    const text = q.trim().toLowerCase();
    if (!text) return [] as Post[];

    return posts.filter((p) => {
      const t = (p.title ?? '').toLowerCase();
      const c = (p.content ?? '').toLowerCase();
      if (m === 'title') return t.includes(text);
      if (m === 'content') return c.includes(text);
      return t.includes(text) || c.includes(text);
    });
  }, []);

  const applySearch = useCallback(
    (text: string) => {
      const results = filter(allPosts, text, mode);
      onResults?.(results);
    },
    [allPosts, mode, filter, onResults],
  );

  const { run: runSearch, flush, cancel, isPending } = useDebounceCallback(applySearch, debounceMs);

  useEffect(() => {
    if (!open) return;
    runSearch(query);
  }, [query, open, runSearch]);

  useEffect(() => {
    if (!open) return;

    applySearch(query);
    cancel();
  }, [mode, open, applySearch, cancel, query]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setQuery('');
    cancel();
    onResults?.([]);
  };

  const runImmediate = () => flush();

  return (
    <div className={`relative ${className}`}>
      {!open ? (
        <button
          aria-label="검색 열기"
          onClick={handleOpen}
          className="flex h-9 w-9 items-center justify-center rounded-full border hover:shadow"
        >
          <SearchIcon />
        </button>
      ) : (
        <div className="flex items-center gap-2">
          <button
            aria-label="검색 닫기"
            onClick={handleClose}
            className="flex h-9 w-9 items-center justify-center rounded-full border hover:shadow"
            title="닫기"
          >
            <CloseIcon />
          </button>

          <div className="flex items-center gap-2 rounded-full border px-3 py-1">
            <SearchIcon className="mr-1" />
            <input
              className="w-[280px] outline-none text-sm"
              placeholder={isLoading ? '전체 글 불러오는 중…' : '검색어를 입력하세요'}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') runImmediate(); // Enter로 즉시 검색
              }}
              disabled={isLoading}
            />

            <select
              className="rounded-md border px-2 py-1 text-sm"
              value={mode}
              onChange={(e) => setMode(e.target.value as SearchMode)}
              disabled={isLoading}
              title="검색 범위"
            >
              <option value="title">제목</option>
              <option value="title+content">제목+게시글</option>
              <option value="content">게시글</option>
            </select>

            <button
              onClick={runImmediate}
              className="ml-1 rounded-md border px-2 py-1 text-xs hover:bg-gray-50 disabled:opacity-60"
              disabled={isLoading}
              title={isPending ? '디바운스 대기 중' : '즉시 검색'}
            >
              검색
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SearchIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 21l-4.3-4.3M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
