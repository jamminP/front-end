import { useInfiniteQuery } from '@tanstack/react-query';
import { mockSearchPosts } from '../__mock__/search.mock';
import type { SearchQuery, CursorListResult, SearchPostItem } from '../api/types';

export function useSearchPosts(params: Omit<SearchQuery, 'cursor'>) {
  const { q, scope, category = 'all', limit = 20 } = params;

  return useInfiniteQuery<CursorListResult<SearchPostItem>>({
    queryKey: ['search', { q, scope, category, limit }],
    enabled: !!q && q.trim().length > 0,
    initialPageParam: null,
    queryFn: ({ pageParam }) => {
      const cursor = typeof pageParam === 'string' ? pageParam : null;
      return mockSearchPosts({ q, scope, limit, cursor });
    },
    getNextPageParam: (lastPage) => lastPage.next_cursor,
  });
}
