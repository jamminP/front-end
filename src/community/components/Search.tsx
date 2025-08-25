import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import useDebounce from '../hook/useDebounce';
import { useCategoryListCursor } from '../hook/useCategoryListCursor';
import type { SearchIn, PostCategory } from '../api/types';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';

interface Props {
  onClose?: () => void;
  defaultScope?: SearchIn;
  category?: PostCategory;
}

const getPid = (it: any) =>
  typeof it?.post_id === 'number' ? it.post_id : typeof it?.id === 'number' ? it.id : undefined;
const getCat = (it: any) => it?.category ?? 'unknown';

const scopeOptions: Array<{ label: string; value: SearchIn }> = [
  { label: '제목', value: 'title' },
  { label: '제목+글', value: 'title_content' },
  { label: '글', value: 'content' },
  { label: '작성자', value: 'author' },
];

function ScopeSelect({ value, onChange }: { value: SearchIn; onChange: (v: SearchIn) => void }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const label = scopeOptions.find((o) => o.value === value)?.label ?? '';

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (
        !btnRef.current?.contains(e.target as Node) &&
        !listRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="h-8 px-3 rounded-full border border-gray-200 bg-white text-xs font-medium hover:bg-gray-50 active:bg-gray-100 inline-flex items-center gap-1"
      >
        {label}
        <svg
          viewBox="0 0 20 20"
          className={`h-3.5 w-3.5 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="currentColor"
        >
          <path d="M5.25 7.5 10 12.25 14.75 7.5H5.25z" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          role="listbox"
          aria-label="검색 범위"
          className="absolute z-20 mt-2 min-w-[9rem] rounded-xl border border-gray-200 bg-white shadow-lg py-1 text-sm"
        >
          {scopeOptions.map((opt) => {
            const active = value === opt.value;
            return (
              <li
                key={opt.value}
                role="option"
                tabIndex={0}
                aria-selected={active}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-50 ${active ? 'text-blue-600 font-medium' : 'text-gray-700'}`}
              >
                <span className="inline-flex items-center gap-2">
                  {active && (
                    <svg viewBox="0 0 20 20" className="h-4 w-4" fill="currentColor">
                      <path d="M8 13.5 4.5 10l1.4-1.4L8 10.7l6.1-6.1L15.6 6 8 13.5z" />
                    </svg>
                  )}
                  {opt.label}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default function SearchPopover({
  onClose,
  defaultScope = 'title',
  category = 'all',
}: Props) {
  const [search_in, setSearchIn] = useState<SearchIn>(defaultScope);
  const [keyword, setKeyword] = useState('');
  const debounced = useDebounce(keyword, 350);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const date_from = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
  const date_to = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;
  const keywordQ = debounced.trim();
  const enable = Boolean(keywordQ || date_from || date_to);

  const { items, isFetching, fetchNextPage, hasNextPage, isLoading, isError } =
    useCategoryListCursor(category, {
      limit: 20,
      enabled: enable,
      ...(enable && {
        search_in,
        keyword: keywordQ || undefined,
        date_from,
        date_to,
      }),
    });

  // 무한 스크롤
  const listRef = useRef<HTMLUListElement>(null);
  const sentinelRef = useRef<HTMLLIElement>(null);
  useEffect(() => {
    const rootEl = listRef.current;
    const sentinel = sentinelRef.current;
    if (!rootEl || !sentinel) return;
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting && hasNextPage && !isFetching) fetchNextPage();
        }),
      { root: rootEl, rootMargin: '96px', threshold: 0.01 },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, [hasNextPage, isFetching, fetchNextPage]);

  const emptyState = useMemo(() => {
    if (!enable) return '검색어 또는 날짜를 입력해주세요.';
    if (isLoading) return '검색 중…';
    if (isError) return '검색에 실패했어요.';
    if (items.length === 0) return '결과가 없어요.';
    return '';
  }, [enable, isLoading, isError, items.length]);

  return (
    <div className="w-[92vw] sm:w-[420px] rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur px-3 pt-3 pb-2 shadow-[inset_0_-1px_0_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <svg
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="검색어를 입력해주세요"
              className="w-full h-10 rounded-xl border border-gray-200 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
            />
          </div>
          <button
            type="button"
            onClick={onClose}
            className="h-10 px-3 rounded-xl border border-gray-200 hover:bg-gray-50 active:bg-gray-100 text-sm text-gray-700"
          >
            닫기
          </button>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <ScopeSelect value={search_in} onChange={setSearchIn} />
          <div className="ml-2.5 flex items-center gap-1">
            <DatePicker
              dateFormat="yyyy.MM.dd"
              selected={startDate}
              onChange={setStartDate}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              isClearable
              placeholderText="시작일"
              className="h-8 w-28 rounded-full border border-gray-200 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-200"
            />
            <span className="text-gray-400 text-xs">~</span>
            <DatePicker
              dateFormat="yyyy.MM.dd"
              selected={endDate}
              onChange={setEndDate}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate ?? undefined}
              isClearable
              placeholderText="종료일"
              className="h-8 w-28 rounded-full border border-gray-200 px-3 text-xs outline-none focus:ring-2 focus:ring-blue-200"
            />
          </div>
        </div>
      </div>

      <ul ref={listRef} className="max-h-80 overflow-auto no-scrollbar px-2 py-1">
        {items.map((it, i) => {
          const pid = getPid(it);
          const cat = getCat(it);
          const key = `${cat}-${pid ?? `u-${i}`}`;
          const ItemInner = (
            <div className="rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors">
              <div className="text-sm font-medium line-clamp-1">{it.title}</div>
              <div className="text-xs text-gray-500 line-clamp-1">{it.content}</div>
            </div>
          );
          return (
            <li key={key} className="my-0.5">
              {pid != null ? (
                <Link to={`/community/${cat}/${pid}`} className="block" onClick={onClose}>
                  {ItemInner}
                </Link>
              ) : (
                <div className="opacity-60 cursor-not-allowed">{ItemInner}</div>
              )}
            </li>
          );
        })}

        {(isFetching || emptyState) && (
          <li className="py-3 text-center text-xs text-gray-500">
            {isFetching ? '불러오는 중…' : emptyState}
          </li>
        )}
        <li ref={sentinelRef} aria-hidden className="h-6" />
      </ul>
    </div>
  );
}
