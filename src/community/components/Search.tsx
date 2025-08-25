import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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

/** ⚠️ TS 에러가 났던 'author_id' 대신 실제 타입인 'author'를 씁니다. */
const scopeOptions: Array<{ label: string; value: SearchIn }> = [
  { label: '제목', value: 'title' },
  { label: '제목+글', value: 'title_content' },
  { label: '글', value: 'content' },
  { label: '작성자', value: 'author' },
];

/** 드롭다운(토글 버튼 → 옵션 리스트) */
function ScopeSelect({ value, onChange }: { value: SearchIn; onChange: (v: SearchIn) => void }) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const label = scopeOptions.find((o) => o.value === value)?.label ?? '';

  // 바깥 클릭 시 닫기
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

  // 키보드 탐색
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => {
        const first = listRef.current?.querySelector('[role="option"]') as HTMLElement | null;
        first?.focus();
      });
      return;
    }
    if (open) {
      const items = Array.from(
        listRef.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? [],
      );
      const idx = items.findIndex((el) => el === document.activeElement);
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        items[Math.min(idx + 1, items.length - 1)]?.focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        items[Math.max(idx - 1, 0)]?.focus();
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    }
  };

  return (
    <div className="relative">
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        className="
          h-8 px-3 rounded-full border border-gray-200 bg-white
          text-xs font-medium hover:bg-gray-50 active:bg-gray-100
          inline-flex items-center gap-1
        "
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
          className="
            absolute z-20 mt-2 min-w-[9rem] rounded-xl border border-gray-200 bg-white
            shadow-lg py-1 text-sm focus:outline-none
          "
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
                className={`
                  px-3 py-2 cursor-pointer outline-none
                  hover:bg-gray-50 focus:bg-gray-50
                  ${active ? 'text-blue-600 font-medium' : 'text-gray-700'}
                `}
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

  const { items, isFetching, fetchNextPage, hasNextPage, isLoading, isError } =
    useCategoryListCursor(category, {
      limit: 20,
      search_in: debounced ? search_in : undefined,
      keyword: debounced || undefined,
      date_from,
      date_to,
    });

  /** 무한스크롤: 리스트가 스크롤 끝에 가까워지면 자동 fetch */
  const listRef = useRef<HTMLUListElement>(null);
  const onScroll = useCallback(() => {
    const ul = listRef.current;
    if (!ul) return;
    const nearBottom = ul.scrollTop + ul.clientHeight >= ul.scrollHeight - 48;
    if (nearBottom && hasNextPage && !isFetching) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetching, fetchNextPage]);

  const emptyState = useMemo(() => {
    if (isLoading) return '검색 중…';
    if (isError) return '검색에 실패했어요.';
    if (debounced || date_from || date_to) {
      if (items.length === 0) return '결과가 없어요.';
    }
    return '';
  }, [isLoading, isError, debounced, date_from, date_to, items.length]);

  return (
    <div
      className="
        w-[92vw] sm:w-[420px]
        rounded-2xl bg-white shadow-xl ring-1 ring-black/5 overflow-hidden
      "
    >
      {/* 헤더(스티키) */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur px-3 pt-3 pb-2 border-b">
        {/* 검색 인풋 */}
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
              className="
                w-full h-10 rounded-xl border border-gray-200 pl-9 pr-3
                text-sm outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300
              "
            />
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              h-10 px-3 rounded-xl
              border border-gray-200 hover:bg-gray-50 active:bg-gray-100
              text-sm text-gray-700
            "
          >
            닫기
          </button>
        </div>

        {/* 스코프(드롭다운) + 날짜 범위 */}
        <div className="mt-2 flex items-center gap-2">
          <ScopeSelect value={search_in} onChange={setSearchIn} />

          <div className="ml-2.5 flex items-center gap-1">
            <DatePicker
              dateFormat="yyyy.MM.dd"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
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
              onChange={(date) => setEndDate(date)}
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

      {/* 결과 리스트 */}
      <ul
        ref={listRef}
        onScroll={onScroll}
        className="max-h-80 overflow-auto divide-y no-scrollbar"
      >
        {items.map((it, i) => {
          const pid = getPid(it);
          const cat = getCat(it);
          const key = `${cat}-${pid ?? `u-${i}`}`;

          const ItemInner = (
            <div className="px-3 py-2 hover:bg-gray-50 transition-colors">
              <div className="text-sm font-medium line-clamp-1">{it.title}</div>
              <div className="text-xs text-gray-500 line-clamp-1">{it.content}</div>
            </div>
          );

          return (
            <li key={key}>
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
      </ul>

      {hasNextPage && (
        <div className="p-3 border-t">
          <button
            disabled={isFetching}
            onClick={() => fetchNextPage()}
            className="w-full h-9 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 disabled:opacity-60"
          >
            {isFetching ? '불러오는 중…' : '더 불러오기'}
          </button>
        </div>
      )}
    </div>
  );
}
