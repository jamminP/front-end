import { useInfiniteQuery } from '@tanstack/react-query';
import type { Category, SearchIn } from '../api/types';
import { useMemo } from 'react';
import { AllListCursorResponse, getAllListCursor, ListCursorItem } from '../api/community';

export interface CategoryListCursorOptions {
  limit?: number;
  search_in?: SearchIn | 'author_id';
  keyword?: string;
  cursor?: string | number;
  author_id?: string | number;
  date_from?: string;
  date_to?: string;
  badge?: string;
}

const normalizeSearchIn = (v?: CategoryListCursorOptions['search_in']): SearchIn | undefined => {
  if (!v) return undefined;
  return v === 'author_id' ? 'author' : v;
};

export const categoryListCursorKeys = {
  all: ['community', 'search', 'list-cursor'] as const,
  list: (category: Category, opts: CategoryListCursorOptions) =>
    [
      ...categoryListCursorKeys.all,
      {
        category,
        search_in: normalizeSearchIn(opts.search_in),
        q: opts.keyword ?? '',
        author_id: opts.author_id ?? '',
        date_from: opts.date_from ?? '',
        date_to: opts.date_to ?? '',
        badge: opts.badge ?? '',
        limit: opts.limit ?? 20,
      },
    ] as const,
};

export function useCategoryListCursor(category: Category, params: CategoryListCursorOptions) {
  const { search_in, keyword, author_id, date_from, date_to, badge, limit = 20 } = params;
  const normalized = normalizeSearchIn(search_in);

  type PageParam = string | number | undefined;

  const query = useInfiniteQuery<AllListCursorResponse>({
    queryKey: categoryListCursorKeys.list(category, {
      search_in: normalized,
      keyword,
      author_id,
      date_from,
      date_to,
      badge,
      limit,
    }),
    queryFn: ({ pageParam }) =>
      getAllListCursor({
        q: keyword,
        search_in: normalized,
        cursor: pageParam as PageParam,
        limit,
        author_id,
        date_from,
        date_to,
        badge,
      }),
    initialPageParam: undefined as PageParam,
    getNextPageParam: (lastPage) =>
      lastPage.next_cursor === null ? undefined : String(lastPage.next_cursor),
    staleTime: 1000 * 30,
  });

  const items: ListCursorItem[] = useMemo(
    () => query.data?.pages.flatMap((p) => p.items ?? []) ?? [],
    [query.data],
  );

  return { ...query, items };
}
