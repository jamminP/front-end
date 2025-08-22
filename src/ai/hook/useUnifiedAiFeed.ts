import { useInfiniteQuery } from '@tanstack/react-query';
import { getStudyPlans } from '../api/studyPlan';
import { getSummaries } from '../api/summary';
import { toPlanItems, toSummaryItems, type UnifiedItem } from '../api/sidebarTitle';
import { useResolvedUserId } from '../hook/useUserId';
import { pickStudyPlans, pickSummaries } from '../api/normalize';
import { HttpError } from '../api/http';

const PAGE = 20;
type Cursor = { plan: number; summary: number };

export const UNIFIED_AI_FEED_QK = ['ai-unified-feed'] as const;

export function useUnifiedAiFeed() {
  const userId = useResolvedUserId();

  const q = useInfiniteQuery<{
    items: UnifiedItem[];
    next: Cursor | null;
  }>({
    queryKey: [...UNIFIED_AI_FEED_QK, userId],
    initialPageParam: { plan: 0, summary: 0 } as Cursor,
    enabled: !!userId,
    queryFn: async ({ pageParam }) => {
      const { plan, summary } = pageParam as Cursor;

      const [pRes, sRes] = await Promise.all([
        plan >= 0
          ? getStudyPlans(userId!, PAGE, plan)
          : Promise.resolve({ data: { study_plans: [] } } as any),
        summary >= 0
          ? getSummaries(userId!, PAGE, summary)
          : Promise.resolve({ data: { summaries: [] } } as any),
      ]);

      const plans = toPlanItems(pickStudyPlans(pRes));
      const sums = toSummaryItems(pickSummaries(sRes));

      const items = [...plans, ...sums].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      const nextPlan = plans.length === PAGE ? plan + PAGE : -1;
      const nextSummary = sums.length === PAGE ? summary + PAGE : -1;
      const hasMore = nextPlan !== -1 || nextSummary !== -1;

      return { items, next: hasMore ? { plan: nextPlan, summary: nextSummary } : null };
    },
    getNextPageParam: (last) => last.next ?? undefined,
    staleTime: 30_000,
    retry: (failureCount, error) => {
      const e = error as any;
      if (e instanceof HttpError && (e.status === 404 || e.status === 422 || e.status === 400))
        return false;
      return failureCount < 2;
    },
  });

  return { ...q, userIdReady: !!userId };
}
