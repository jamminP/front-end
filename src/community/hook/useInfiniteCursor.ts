import { useInfiniteQuery } from '@tanstack/react-query';
import { getPostList } from '../api/community';
import type { PostCategory, CursorPage, ListItem } from '../api/types';

export function useInfiniteCursor(category: PostCategory, q?: string, limit = 20) {
  return useInfiniteQuery<CursorPage<ListItem>>({
    queryKey: ['community', 'list', category, q ?? '', limit],
    initialPageParam: null as number | null,
    queryFn: ({ pageParam }) =>
      getPostList({
        category,
        cursor: (pageParam ?? null) as number | null,
        limit,
      }),
    getNextPageParam: (last) => last.next_cursor ?? undefined,
    staleTime: 30_000,
  });
}
