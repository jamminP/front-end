import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import type { Category, ListCursorParams, ListCursorResult, SearchPostItem } from '../api/types';
import { mockListCursor } from '../__mock__/search.mock';
import { useMemo } from 'react';

export function useCategoryListCursor(
  category: Category,
  params: Omit<ListCursorParams, 'cursor'>,
) {
  const { limit = 20, search_in, keyword } = params;

  const query = useInfiniteQuery<
    ListCursorResult<SearchPostItem>,
    Error,
    InfiniteData<ListCursorResult<SearchPostItem>>,
    [string, Category, { limit: number; search_in?: string; keyword?: string }],
    string | null
  >({
    queryKey: ['list-cursor', category, { limit, search_in, keyword }],
    initialPageParam: null,
    queryFn: ({ pageParam }) =>
      mockListCursor(category, { limit, cursor: pageParam, search_in, keyword }),
    getNextPageParam: (last) => last.next_cursor,
  });
  const items = useMemo(() => {
    const pages = query.data?.pages ?? [];
    return pages.reduce<SearchPostItem[]>((acc, p) => acc.concat(p.items), []);
  }, [query.data]);

  return { ...query, items };
}
