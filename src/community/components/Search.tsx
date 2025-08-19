import { useState } from 'react';
import { Link } from 'react-router-dom';
import useDebounce from '../hook/useDebounce';
import { useCategoryListCursor } from '../hook/useCategoryListCursor';
import type { SearchIn, Category } from '../api/types';
import { format, startOfDay, startOfWeekYear } from 'date-fns';
import DatePicker from 'react-datepicker';

interface Props {
  onClose?: () => void;
  defaultScope?: SearchIn;
  category?: Category;
}

const dateToTail =
  'text-xs w-36 h-6 mx-1 mt-1 outline-none focus:ring-0 focus:border-transparent border-[0.5px] border-gray-300 rounded-lg pl-0.5';

const dateFromTail =
  'text-xs w-36 h-6 mx-1 mt-1 mr-3 outline-none focus:ring-0 focus:border-transparent border-[0.5px] border-gray-300 rounded-lg pl-0.5';

export function SearchPopover({ onClose, defaultScope = 'title', category = 'all' }: Props) {
  const [search_in, setSearchIn] = useState<SearchIn>(defaultScope);
  const [keyword, setKeyword] = useState('');
  const [author, setAuthor] = useState('');
  const [fromText] = useState('');
  const [toText] = useState('');

  const debounced = useDebounce(keyword, 3000);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const date_from = startDate ? format(startDate, 'yyyy-MM-dd') : undefined;
  const date_to = endDate ? format(endDate, 'yyyy-MM-dd') : undefined;

  const author_id = author.trim() !== '' ? author.trim() : undefined;

  const { items, isFetching, fetchNextPage, hasNextPage, isLoading, isError } =
    useCategoryListCursor(category, {
      limit: 20,
      search_in: debounced ? search_in : undefined,
      keyword: debounced || undefined,
      date_from,
      date_to,
    });

  return (
    <div className="w-[380px] rounded-xl border-[0.5px] border-gray-300 shadow-lg bg-white pt-1.5 px-1.5">
      <div className="flex gap-2 items-center">
        <select
          value={search_in}
          onChange={(e) => setSearchIn(e.target.value as SearchIn)}
          className=" border-[0.5px] border-gray-300 rounded-lg ml-1 px-2 py-1.5 text-sm"
        >
          <option value="title">제목만</option>
          <option value="title_content">제목 + 글</option>
          <option value="content">글만</option>
          <option value="author_id">작성자만</option>
        </select>

        <input
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="검색어를 입력해주세요"
          className="flex-1 border-[0.5px] border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2"
        />

        <button
          type="button"
          className="px-3 py-1.5 rounded-lg bg-[#1B3043] text-white text-sm"
          onClick={() => onClose?.()}
        >
          닫기
        </button>
      </div>

      <div>
        <div className="flex">
          <DatePicker
            dateFormat="yyyy.MM.dd"
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            isClearable
            className={dateToTail}
          />
          <div className="pt-0.5">~</div>
          <DatePicker
            dateFormat="yyyy.MM.dd"
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate ?? undefined}
            isClearable
            className={dateFromTail}
          />
        </div>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        {keyword && !debounced && <p>입력 중…</p>}
        {isLoading && (debounced || author_id || date_from || date_to) && <p>검색 중…</p>}
        {isError && <p></p>}
        {!isLoading && (debounced || author_id || date_from || date_to) && items.length === 0 && (
          <p>결과가 없습니다.</p>
        )}
        {(fromText || toText) && !(date_from || date_to) && <p className="text-red-500"></p>}
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
