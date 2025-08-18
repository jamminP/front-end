import { useInfiniteQuery } from '@tanstack/react-query';
import { Category, ListCursorParams, ListCursorResult, SearchPostItem } from '../api/types';
import { mockListCursor } from '../__mock__/search.mock';

export function useCategoryListCursor(
  category: Category,
  params: Omit<ListCursorParams, 'cursor'>,
) {
  return useInfiniteQuery<
    ListCursorResult<SearchPostItem>,
    Error,
    ListCursorResult<SearchPostItem>,
    any,
    string | null
  >({
    queryKey: [
      'list-cursor',
      category,
      { limit: params.limit ?? 20, search_in: params.search_in, keyword: params.keyword },
    ],
    initialPageParam: null,
    queryFn: ({ pageParam }) => {
      const cursor = typeof pageParam === 'string' ? pageParam : null;
      return mockListCursor(category, { ...params, cursor });
    },
    getNextPageParam: (last) => last.next_cursor,
  });
}
