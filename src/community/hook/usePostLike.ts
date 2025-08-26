import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { GetLike, PostLike } from '../api/community';

type LikeStatus = { liked: boolean; like_count: number };

export function usePostLike(post_id: number) {
  const qc = useQueryClient();
  const likeKey = ['community', 'like', post_id] as const;
  const postKey = ['community', 'post', post_id] as const;

  const q = useQuery<LikeStatus>({
    queryKey: likeKey,
    queryFn: () => GetLike({ post_id }),
    staleTime: 30_000,
  });

  const { mutate: toggleLike, isPending } = useMutation({
    mutationFn: () => PostLike({ post_id }),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: likeKey });

      const prevLike = qc.getQueryData<LikeStatus>(likeKey);
      const prevPost = qc.getQueryData<any>(postKey);

      const base: LikeStatus = prevLike ?? {
        liked: false,
        like_count: Number(prevPost?.like_count ?? 0),
      };

      const next: LikeStatus = {
        liked: !base.liked,
        like_count: base.like_count + (base.liked ? -1 : 1),
      };

      qc.setQueryData(likeKey, next);
      if (prevPost) qc.setQueryData(postKey, { ...prevPost, like_count: next.like_count });

      return { prevLike, prevPost };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prevLike) qc.setQueryData(likeKey, ctx.prevLike);
      if (ctx?.prevPost) qc.setQueryData(postKey, ctx.prevPost);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: likeKey });
    },
  });

  return {
    liked: q.data?.liked ?? false,
    like_count: q.data?.like_count ?? Number(qc.getQueryData<any>(postKey)?.like_count ?? 0),
    isPending,
    toggleLike,
  };
}
