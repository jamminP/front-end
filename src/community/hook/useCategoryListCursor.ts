// /src/Community/hook/useCategoryListCursor.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
// types는 네가 가진 파일 기준으로 맞춰줘
import type { PostCategory as Category, CursorPage, ListItem, SearchIn } from '../api/types';
import { getPostList } from '../api/community';

export interface CategoryListCursorOptions {
  limit?: number;
  // 아래 필터들은 현재 /post/list에 전달하지 않음(스펙: category/cursor/limit만 지원).

  search_in?: SearchIn | 'author_id';
  keyword?: string;
  author_id?: string | number;
  date_from?: string;
  date_to?: string;
  badge?: string;
  cursor?: number | null;
}

const normalizeSearchIn = (v?: CategoryListCursorOptions['search_in']): SearchIn | undefined =>
  v === 'author_id' ? 'author' : (v ?? undefined);

export const categoryListCursorKeys = {
  all: ['community', 'list'] as const,
  list: (category: Category, opts: CategoryListCursorOptions = {}) =>
    [
      ...categoryListCursorKeys.all,
      {
        category,
        search_in: normalizeSearchIn(opts.search_in), // 캐시 키 분리용
        q: opts.keyword ?? '',
        author_id: opts.author_id ?? '',
        date_from: opts.date_from ?? '',
        date_to: opts.date_to ?? '',
        badge: opts.badge ?? '',
        limit: opts.limit ?? 20,
        cursor: opts.cursor ?? null,
      },
    ] as const,
};

export function useCategoryListCursor(category: Category, params: CategoryListCursorOptions = {}) {
  const {
    search_in,
    keyword,
    author_id,
    date_from,
    date_to,
    badge,
    limit = 20,
    cursor = null,
  } = params;

  type PageParam = number | null;

  const query = useInfiniteQuery<CursorPage<ListItem>>({
    queryKey: categoryListCursorKeys.list(category, {
      search_in,
      keyword,
      author_id,
      date_from,
      date_to,
      badge,
      limit,
      cursor,
    }),
    initialPageParam: cursor as PageParam, // 첫 페이지 커서 (기본 null)
    queryFn: ({ pageParam }) =>
      getPostList({
        category,
        cursor: pageParam as PageParam, // 숫자 커서 사용
        limit,
      }),
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined, // null이면 더 없음
    staleTime: 30_000,
  });

  const items: ListItem[] = useMemo(
    () => query.data?.pages.flatMap((p) => p.items ?? []) ?? [],
    [query.data],
  );

  return { ...query, items };
}
