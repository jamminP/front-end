import { useQueries, useQuery } from '@tanstack/react-query';
import { TopCategory, TopWeeklyResponse } from '../api/types';
import { getTopWeekly } from '../api/community';

//쿼리키 규칙 표준화
export const topWeeklyKeys = {
  all: ['community', 'topWeekly'] as const,
  list: (category: TopCategory, limit: number) =>
    [...topWeeklyKeys.all, { category, limit }] as const,
};

//단일
export function useTopWeekly(category: TopCategory, limit = 5) {
  return useQuery<TopWeeklyResponse>({
    queryKey: topWeeklyKeys.list(category, limit),
    queryFn: () => getTopWeekly(category, limit),
    staleTime: 1000 * 60,
  });
}

//각 카테고리 동시
export function useTopWeeklyAll(limit = 5) {
  const categories: TopCategory[] = ['study', 'free', 'share'];
  const results = useQueries({
    queries: categories.map((c) => ({
      queryKey: topWeeklyKeys.list(c, limit),
      queryFn: () => getTopWeekly(c, limit),
      staleTime: 1000 * 60,
    })),
  });
  const map: Record<TopCategory, ReturnType<typeof useQuery<TopWeeklyResponse>>> = {
    study: results[0] as any,
    free: results[1] as any,
    share: results[2] as any,
  };
  const isLoading = results.some((r) => r.isLoading);
  const isError = results.some((r) => r.isError);

  return { ...map, isLoading, isError } as const;
}
