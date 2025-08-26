import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchPost } from '../api/community';
import type { PatchPostParams, PatchPostRequest, PostDetailResponse } from '../api/types';
import useAuthStore from '@src/store/authStore';

export function usePatchPost(post_id: number) {
  const qc = useQueryClient();
  const currentUserId = useAuthStore((s) => s.user?.id ?? null);
  const isAdmin = false;

  const patchEverywhere = (updater: (it: any) => void) => {
    const all = qc.getQueryCache().getAll();
    for (const q of all) {
      const key = q.queryKey as any;
      const data = qc.getQueryData<any>(key);
      if (!data) continue;

      if (data?.id === post_id) {
        const clone = { ...data };
        updater(clone);
        qc.setQueryData(key, clone);
        continue;
      }

      if (data?.pages?.length) {
        const cloned = {
          ...data,
          pages: data.pages.map((p: any) => {
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
        qc.setQueryData(key, cloned);
      }
    }
  };

  return useMutation({
    mutationFn: async (vars: { params: PatchPostParams; body: PatchPostRequest }) => {
      if (currentUserId == null) {
        const err = new Error('로그인이 필요합니다.');
        (err as any).code = 'UNAUTHORIZED';
        throw err;
      }

      const detail = qc.getQueryData<PostDetailResponse>(['community', 'post', post_id]);
      const isOwner = detail?.author_id === currentUserId;

      if (!isOwner && !isAdmin) {
        const err = new Error('본인 글만 수정할 수 있어요.');
        (err as any).code = 'FORBIDDEN';
        throw err;
      }

      const params: PatchPostParams = {
        ...vars.params,
        user: vars.params.user ?? currentUserId,
      };

      return patchPost(params, vars.body);
    },

    onMutate: async ({ body }) => {
      const key = ['community', 'post', post_id];
      await qc.cancelQueries({ queryKey: key });

      const prevDetail = qc.getQueryData<PostDetailResponse>(key);

      qc.setQueryData<PostDetailResponse>(key, (old) =>
        old
          ? {
              ...old,
              title: body.title ?? old.title,
              content: body.content ?? old.content,
              study_recruitment: old.study_recruitment
                ? {
                    ...old.study_recruitment,
                    recruit_start: body.recruit_start ?? old.study_recruitment.recruit_start,
                    recruit_end: body.recruit_end ?? old.study_recruitment.recruit_end,
                    study_start: body.study_start ?? old.study_recruitment.study_start,
                    study_end: body.study_end ?? old.study_recruitment.study_end,
                    max_member: body.max_member ?? old.study_recruitment.max_member,
                  }
                : old.study_recruitment,
              recruit_start: body.recruit_start ?? old.recruit_start,
              recruit_end: body.recruit_end ?? old.recruit_end,
              study_start: body.study_start ?? old.study_start,
              study_end: body.study_end ?? old.study_end,
              max_member: body.max_member ?? old.max_member,
            }
          : old,
      );

      patchEverywhere((it) => {
        if (body.title != null) it.title = body.title;
        if (body.content != null) it.content = body.content;
        if (it.study_recruitment) {
          it.study_recruitment = {
            ...it.study_recruitment,
            ...(body.recruit_start != null && { recruit_start: body.recruit_start }),
            ...(body.recruit_end != null && { recruit_end: body.recruit_end }),
            ...(body.study_start != null && { study_start: body.study_start }),
            ...(body.study_end != null && { study_end: body.study_end }),
            ...(body.max_member != null && { max_member: body.max_member }),
          };
        }
        if (body.recruit_start != null) it.recruit_start = body.recruit_start;
        if (body.recruit_end != null) it.recruit_end = body.recruit_end;
        if (body.study_start != null) it.study_start = body.study_start;
        if (body.study_end != null) it.study_end = body.study_end;
        if (body.max_member != null) it.max_member = body.max_member;
      });

      return { prevDetail };
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prevDetail) {
        qc.setQueryData(['community', 'post', post_id], ctx.prevDetail);
      }
    },

    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['community', 'post', post_id] });
    },
  });
}
