import { useQuery } from '@tanstack/react-query';
import { getPostDetail } from '../api/community';
import type { ItemCategory, FreeDetail, ShareDetail, StudyDetail } from '../api/types';

type Category = ItemCategory;

interface DetailMap {
  free: FreeDetail;
  share: ShareDetail;
  study: StudyDetail;
}

export function usePostDetail<C extends Category>(category: C, postId: number) {
  return useQuery<DetailMap[C]>({
    queryKey: ['community', 'post', category, postId],
    queryFn: async () => {
      const data = await getPostDetail(postId);
      const normalized = { ...data, category: String(data.category).toLowerCase() as ItemCategory };
      return data as DetailMap[C];
    },
    enabled: Number.isFinite(postId),
    staleTime: 30_000,
  });
}
