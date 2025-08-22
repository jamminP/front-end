import { useQuery } from '@tanstack/react-query';
import { getFreePost, getSharePost, getStudyPost } from '../api/community';
import { FreePostResponse, SharePostResponse, StudyPostResponse } from '../api/types';

type Category = 'free' | 'share' | 'study';

interface DetailMap {
  free: FreePostResponse;
  share: SharePostResponse;
  study: StudyPostResponse;
}

function getDetailFetcher<C extends Category>(category: C, postId: number) {
  switch (category) {
    case 'free':
      return () => getFreePost(postId) as Promise<DetailMap[C]>;
    case 'share':
      return () => getSharePost(postId) as Promise<DetailMap[C]>;
    case 'study':
      return () => getStudyPost(postId) as Promise<DetailMap[C]>;
  }
}

export function usePostDetail<C extends Category>(category: C, postId: number) {
  return useQuery<DetailMap[C]>({
    queryKey: ['community', 'post', category, postId],
    queryFn: getDetailFetcher(category, postId),
    enabled: Number.isFinite(postId),
    staleTime: 30_000,
  });
}
