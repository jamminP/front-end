import { useInfiniteQuery } from '@tanstack/react-query';
import { getStudyPlans } from '../api/studyPlan';
import { toChatSummaries, type ChatSummary } from '../api/sidebarTitle';
import { useResolvedUserId } from '../hook/useUserId';

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
      const items = toChatSummaries(res.data?.data?.study_plans ?? []);
      return {
        items,
        nextOffset: items.length === PAGE_SIZE ? offset + PAGE_SIZE : null,
      };
    },
    getNextPageParam: (last) => last.nextOffset,
    staleTime: 30_000,
    retry: 1,
  });
}
