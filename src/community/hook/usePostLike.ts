import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { GetLike, PostLike } from '../api/community';

type LikeStatus = { liked: boolean; like_count: number };

export function usePostLike(post_id: number) {
  const qc = useQueryClient();
  const likeKey = ['community', 'post', post_id, 'like'];

  const seedFromCaches = (): LikeStatus | undefined => {
    const all = qc.getQueryCache().getAll();
    for (const q of all) {
      const data = qc.getQueryData<any>(q.queryKey as any);
      if (!data) continue;

      if (data?.id === post_id && typeof data?.like_count === 'number') {
        const liked = !!(data.liked ?? data.is_liked);
        return { liked, like_count: data.like_count };
      }
      if (data?.pages?.length) {
        for (const p of data.pages) {
          const found = p?.items?.find?.((it: any) => it?.id === post_id);
          if (found) {
            const liked = !!(found.liked ?? found.is_liked);
            if (typeof found.like_count === 'number') {
              return { liked, like_count: found.like_count };
            }
          }
        }
      }
    }
    return undefined;
  };

  const { data, isPending: likeLoading } = useQuery({
    queryKey: likeKey,
    queryFn: () => GetLike({ post_id }),
    initialData: seedFromCaches(),
    staleTime: 60_000,
    gcTime: 10 * 60_000,
    refetchOnWindowFocus: false,
    enabled: post_id > 0,
  });

  const patchEverywhere = (post_id: number, updater: (it: any) => void) => {
    const all = qc.getQueryCache().getAll();
    for (const q of all) {
      const key = q.queryKey as any;
      const curr = qc.getQueryData<any>(key);
      if (!curr) continue;

      if (curr?.id === post_id) {
        const clone = { ...curr };
        updater(clone);
        qc.setQueryData(key, clone);
        continue;
      }

      if (curr?.pages?.length) {
        const clone = {
          ...curr,
          pages: curr.pages.map((p: any) => {
            if (!p?.items) return p;
            return {
              ...p,
              items: p.items.map((it: any) => {
                if (it?.id !== post_id) return it;
                const c = { ...it };
                updater(c);
                return c;
              }),
            };
          }),
        };
        qc.setQueryData(key, clone);
      }
    }
  };

  const mutation = useMutation({
    mutationFn: () => PostLike({ post_id }),
    onMutate: async () => {
      await qc.cancelQueries({ queryKey: likeKey });

      const prevLike = qc.getQueryData<LikeStatus>(likeKey);

      qc.setQueryData<LikeStatus>(likeKey, (curr) => {
        const liked = !(curr?.liked ?? prevLike?.liked ?? false);
        const like_count = Math.max(
          0,
          (curr?.like_count ?? prevLike?.like_count ?? 0) + (liked ? 1 : -1),
        );
        return { liked, like_count };
      });

      patchEverywhere(post_id, (it) => {
        const liked = !(it.liked ?? it.is_liked ?? false);
        it.liked = liked;
        it.is_liked = liked;
        it.like_count = Math.max(0, (it.like_count ?? 0) + (liked ? 1 : -1));
      });

      return { prevLike };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prevLike) {
        qc.setQueryData(likeKey, ctx.prevLike);
        patchEverywhere(post_id, (it) => {
          it.liked = ctx.prevLike!.liked;
          it.is_liked = ctx.prevLike!.liked;
          it.like_count = ctx.prevLike!.like_count;
        });
      }
    },
    onSuccess: (server) => {
      qc.setQueryData<LikeStatus>(likeKey, server);
      patchEverywhere(post_id, (it) => {
        it.liked = server.liked;
        it.is_liked = server.liked;
        it.like_count = server.like_count;
      });
    },
  });

  return {
    liked: !!data?.liked,
    like_count: data?.like_count ?? 0,
    isPending: likeLoading || mutation.isPending,
    toggleLike: () => mutation.mutate(),
  };
}
