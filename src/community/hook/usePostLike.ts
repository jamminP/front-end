import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GetLike, PostLike } from '../api/community';
import type { LikeStatus } from '../api/types';

export function usePostLike(post_id: number, currentUserId: number) {
  const qc = useQueryClient();

  const key = ['community', 'like', post_id] as const;
  const postKey = ['community', 'post', post_id] as const;

  const { data, isLoading, isError } = useQuery<LikeStatus>({
    queryKey: key,
    queryFn: () => GetLike({ post_id }),
  });

  const { mutate: toggleLike, isPending } = useMutation({
    mutationFn: () => PostLike({ post_id, user: currentUserId }),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: key });
      const prev = qc.getQueryData<LikeStatus>(key);
      const next =
        prev != null
          ? { liked: !prev.liked, like_count: prev.like_count + (prev.liked ? -1 : 1) }
          : undefined;

      if (next) qc.setQueryData<LikeStatus>(key, next);

      const prevPost = qc.getQueryData<any>(postKey);
      if (prevPost && next) {
        qc.setQueryData<any>(postKey, { ...prevPost, like_count: next.like_count });
      }
      return { prev, prevPost };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData<LikeStatus>(key, ctx.prev);
      if (ctx?.prevPost) qc.setQueryData<any>(postKey, ctx.prevPost);
    },
    onSuccess: (res: any) => {
      // 응답에 최신 상태가 함께 오면 반영
      const next = (res as LikeStatus) ?? qc.getQueryData<LikeStatus>(key);
      if (next) qc.setQueryData<LikeStatus>(key, next);

      const prevPost = qc.getQueryData<any>(postKey);
      if (prevPost && next)
        qc.setQueryData<any>(postKey, { ...prevPost, like_count: next.like_count });
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: key });
    },
  });

  return {
    liked: data?.liked ?? false,
    like_count: data?.like_count ?? 0,
    isLoading,
    isError,
    toggleLike,
    isPending,
  };
}
