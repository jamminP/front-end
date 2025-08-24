// /src/Community/hook/usePatchComment.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchComment } from '../api/community';
import type { PatchCommentsParams, PatchCommentsRequest } from '../api/types';

export function usePatchComment(post_id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { params: PatchCommentsParams; body: PatchCommentsRequest }) =>
      patchComment(post_id, vars.params, vars.body),

    onMutate: async ({ params, body }) => {
      const key = ['community', 'comments', post_id];
      await qc.cancelQueries({ queryKey: key });

      const prev = qc.getQueryData<{ items: any[] }>(key);

      // 낙관적 업데이트: 루트+1뎁스 트리라고 했으니 평면 items에서 찾아 바꾸고,
      // 트리로 만드는건 뷰/훅(useComments)에서 하니까 여기선 content만 교체
      qc.setQueryData<{ items: any[] }>(key, (old) => {
        if (!old) return old;
        return {
          ...old,
          items: old.items.map((c) =>
            c.comment_id === params.comment_id ? { ...c, content: body.content } : c,
          ),
        };
      });

      return { prev };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData(['community', 'comments', post_id], ctx.prev);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['community', 'comments', post_id] });
    },
  });
}
