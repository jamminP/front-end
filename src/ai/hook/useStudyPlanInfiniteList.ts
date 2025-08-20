import { useInfiniteQuery } from '@tanstack/react-query';
import { getStudyPlans } from '../api/studyPlan';
import { toChatSummaries, type ChatSummary } from '../api/sidebarTitle';
import { useResolvedUserId } from '../hook/useUserId';
import { pickStudyPlans } from '../api/normalize';
import { HttpError } from '../api/http';

const PAGE_SIZE = 20;

export function useStudyPlanInfiniteList() {
  const userId = useResolvedUserId();

  return useInfiniteQuery<{
    items: ChatSummary[];
    nextOffset: number | null;
  }>({
    queryKey: ['ai-studyPlans', userId],
    initialPageParam: 0,
    enabled: !!userId,
    queryFn: async ({ pageParam }) => {
      const offset = pageParam as number;
      const res = await getStudyPlans(userId!, PAGE_SIZE, offset);
      const rows = pickStudyPlans(res);
      const items = toChatSummaries(rows);
      return {
        items,
        nextOffset: items.length === PAGE_SIZE ? offset + PAGE_SIZE : null,
      };
    },
    getNextPageParam: (last) => last.nextOffset,
    staleTime: 30_000,
    retry: (failureCount, error) => {
      const e = error as any;

      if (e instanceof HttpError && (e.status === 404 || e.status === 422 || e.status === 400))
        return false;
      return failureCount < 2;
    },
  });
}
