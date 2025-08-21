import { useInfiniteQuery } from '@tanstack/react-query';
import type { AllListCursorResponse, CursorPage } from '../api/community';
import {
  getAllListCursor,
  getFreeListCursor,
  getShareListCursor,
  getStudyListCursor,
} from '../api/community';

type Category = 'all' | 'free' | 'share' | 'study';

type Fetcher<T> = (
  cursor: number | null | undefined,
  q?: string,
  limit?: number,
) => Promise<CursorPage<T>>;

//래핑화 같은 인자를 받아서 내가 쓰는 표준 타입으로 바꿔줌
const wrapAll = <T>(
  api: (
    cursor: string | number | null | undefined,
    q?: string,
    limit?: number,
  ) => Promise<AllListCursorResponse>,
): Fetcher<T> => {
  return async (cursor, q, limit) => {
    const r = await api(cursor ?? undefined, q, limit);
    // next_cursor가 string일 수도 있으니 숫자로 보정
    const next =
      r.next_cursor == null
        ? null
        : typeof r.next_cursor === 'number'
          ? r.next_cursor
          : Number(r.next_cursor) || null;

    return {
      items: (r.items ?? []) as unknown as T[],
      next_cursor: next,
    };
  };
};

function fetcherFor<T>(category: Category): Fetcher<T> {
  switch (category) {
    case 'free':
      return getFreeListCursor as Fetcher<T>;
    case 'share':
      return getShareListCursor as Fetcher<T>;
    case 'study':
      return getStudyListCursor as Fetcher<T>;
    case 'all':
    default:
      return wrapAll<T>(getAllListCursor) as Fetcher<T>;
  }
}

export function useInfiniteCursor<T>(category: Category, q?: string, limit = 20) {
  const fetcher = fetcherFor<T>(category);

  return useInfiniteQuery({
    queryKey: ['community', 'list-cursor', category, q ?? '', limit],
    queryFn: ({ pageParam }) => fetcher(pageParam ?? null, q, limit),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
  });
}
