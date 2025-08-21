import { useInfiniteQuery } from '@tanstack/react-query';
import type { CursorPage } from '../api/community';
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
      return getAllListCursor as Fetcher<T>;
  }
}

export function useInfiniteCursor<T>(category: Category, q?: string, limit = 20) {
  const fetcher = fetcherFor<T>(category);

  return useInfiniteQuery({
    queryKey: ['community', 'list-cursor', category, q ?? '', limit],
    queryFn: ({ pageParam }) => fetcher(pageParam ?? null, q, limit),
    initialPageParam: null as number | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  });
}
