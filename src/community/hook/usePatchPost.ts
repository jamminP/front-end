import { useMutation, useQueryClient } from '@tanstack/react-query';
import { patchPost } from '../api/community';
import type { PatchPostParams, PatchPostRequest, PostDetailResponse } from '../api/types';

export function usePatchPost(post_id: number) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (vars: { params: PatchPostParams; body: PatchPostRequest }) =>
      patchPost(vars.params, vars.body),
    onMutate: async ({ body }) => {
      const key = ['community', 'post', post_id];
      await qc.cancelQueries({ queryKey: key });

      const prev = qc.getQueryData<any>(key);
      qc.setQueryData<PostDetailResponse>(key, (old: PostDetailResponse | undefined) =>
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
              // 평탄화 필드가 있다면 여기서도 반영 (우리 합의의 폴백)
              recruit_start: body.recruit_start ?? old.recruit_start,
              recruit_end: body.recruit_end ?? old.recruit_end,
              study_start: body.study_start ?? old.study_start,
              study_end: body.study_end ?? old.study_end,
              max_member: body.max_member ?? old.max_member,
            }
          : old,
      );

      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      // 롤백
      if (ctx?.prev) {
        qc.setQueryData(['community', 'post', post_id], ctx.prev);
      }
    },
    onSettled: () => {
      // 서버 소스 오브 트루스 동기화
      qc.invalidateQueries({ queryKey: ['community', 'post', post_id] });
    },
  });
}
