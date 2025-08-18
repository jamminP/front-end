import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import useDebounce from '../hook/useDebounce';
import { useCategoryListCursor } from '../hook/useCategoryListCursor';
import type { SearchIn, Category, SearchPostItem } from '../api/types';

interface Props {
  onClose?: () => void;
  defaultScope?: SearchIn;
  category?: Category;
}

export function SearchPopover({ onClose, defaultScope = 'title', category = 'all' }: Props) {
  const [search_in, setSearchIn] = useState<SearchIn>(defaultScope);
  const [keyword, setKeyword] = useState('');

  const debounced = useDebounce(keyword, 3000);

  const { data, isFetching, fetchNextPage, hasNextPage, isLoading, isError } =
    useCategoryListCursor(category, {
      limit: 20,
      search_in: debounced ? search_in : undefined,
      keyword: debounced || undefined,
    });

  const items = useMemo(() => {
    const pages = data?.pages ?? [];
    return pages.reduce<SearchPostItem[]>((acc, p) => acc.concat(p.items), []);
  }, [data]);

  return (
    <div className="w-[400px] rounded-xl border-[0.5px] border-gray-300 shadow-lg bg-white pt-1.5 px-1.5">
      <div className="flex gap-2 items-center">
        <select
          value={search_in}
          onChange={(e) => setSearchIn(e.target.value as SearchIn)}
          className="border-[0.5px] border-gray-300 rounded-lg px-2 py-1.5 text-sm"
        >
          <option value="title">제목만</option>
          <option value="title_content">제목 + 글</option>
          <option value="content">글만</option>
        </select>

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
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
        {keyword && !debounced && <p>입력 중…</p>}
        {isLoading && debounced && <p>검색 중…</p>}
        {isError && <p></p>}
        {!isLoading && debounced && items.length === 0 && <p>결과가 없습니다.</p>}
      </div>

      <ul className="mt-2 max-h-72 overflow-auto divide-y">
        {items.map((it) => (
          <li key={`${it.category}-${it.post_id}`} className="py-2">
            <Link
              to={`/community/${it.category}/${it.post_id}`}
              className="block"
              onClick={onClose}
            >
              <div className="text-sm font-medium line-clamp-1">{it.title}</div>
              <div className="text-xs text-gray-500 line-clamp-1">{it.content}</div>
              <div className="text-[11px] text-gray-400 mt-0.5">
                {it.author_id} · {new Date(it.created_at).toLocaleString()}
              </div>
            </Link>
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

export default SearchPopover;
