import { useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PostForm, { PostFormValues } from './PostForm';
import { useCreateFree, useCreateShare, useCreateStudy } from '../hook/useCommunityPosts';
import { uploadWithPresignedJson } from '../api/presignedJson';
import { PostRequest } from '../api/types';
import useAuthStore from '@src/store/authStore';
import { compact, toISOWithOffset, toNumber } from '../utils/date';

const toISODate = (d?: string) => (d ? new Date(`${d}T00:00:00`).toISOString() : '');

type Cat = 'free' | 'share' | 'study';

export default function CreatePost() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const initialCategory = (sp.get('category') as Cat) ?? 'free';

<<<<<<< HEAD
<<<<<<< HEAD
  const currentUserId = useAuthStore((s) => s.user!.id);
=======
  // TODO: 실제 로그인 유저로 교체
>>>>>>> c808a00 (fix: 유저 쿠키 세션 인증방식으로 변경)
=======
  const currentUserId = useAuthStore((s) => s.user!.id);
>>>>>>> 5c2a18f (또  뭔갈 수정 했음)

  const freeMut = useCreateFree();
  const shareMut = useCreateShare();
  const studyMut = useCreateStudy();

  const isPending = freeMut.isPending || shareMut.isPending || studyMut.isPending;

  const errorMsg =
    (freeMut.error as Error)?.message ||
    (shareMut.error as Error)?.message ||
    (studyMut.error as Error)?.message ||
    '';

  const initialValues: Partial<PostFormValues> = useMemo(
    () => ({ category: initialCategory }),
    [initialCategory],
  );

  const handleSubmit = useCallback(
    async (v: PostFormValues) => {
      try {
        // ───────── 자유 ─────────
        if (v.category === 'free') {
          const created = await freeMut.mutateAsync({
            title: v.title,
            content: v.content,
            user_id: currentUserId,
            category: 'free',
          });

          const postId = (created as any).id ?? (created as any).post_id;
          const imgs = v.freeImages ?? [];

          if (Array.isArray(imgs) && imgs.length > 0) {
            await uploadWithPresignedJson('free', postId, imgs);
          }

          navigate(`/community/free/${postId}`);
          return;
        }

        // ───────── 자료공유 ─────────
        if (v.category === 'share') {
          const created = await shareMut.mutateAsync({
            title: v.title,
            content: v.content,
            user_id: currentUserId,
            category: 'share',
          });

          const postId = (created as any).id ?? (created as any).post_id;
          const files = v.shareFiles ?? [];

          if (Array.isArray(files) && files.length > 0) {
            // 네가 만든 형식: (cat, postId, files)
            await uploadWithPresignedJson('share', postId, files);
          }

          navigate(`/community/share/${postId}`);
          return;
        }

        // ───────── 스터디 ─────────
        if (v.category === 'study') {
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5c2a18f (또  뭔갈 수정 했음)
          const sr = compact({
            recruit_start: toISOWithOffset(v.recruit_start),
            recruit_end: toISOWithOffset(v.recruit_end),
            study_start: toISOWithOffset(v.study_start),
            study_end: toISOWithOffset(v.study_end),
            max_member: toNumber(v.max_members),
          });

          const body: PostRequest = compact({
            title: v.title?.trim(),
            content: v.content?.trim(),
            user_id: currentUserId,
            category: 'study',
            study_recruitment: Object.keys(sr).length ? (sr as any) : undefined,
          });
<<<<<<< HEAD
=======
          const body: PostRequest = {
            title: v.title,
            content: v.content,
            user_id: v.id, // ✅ v.id가 아니라 현재 유저
            study_recruitment: {
              recruit_start: toISODate(v.recruit_start),
              recruit_end: toISODate(v.recruit_end),
              study_start: toISODate(v.study_start),
              study_end: toISODate(v.study_end),
              max_member: Number(v.max_members ?? 0),
            },
          };
>>>>>>> c808a00 (fix: 유저 쿠키 세션 인증방식으로 변경)
=======
>>>>>>> 5c2a18f (또  뭔갈 수정 했음)

          const res = await studyMut.mutateAsync(body);
          const id = (res as any).post_id ?? (res as any).id;
          navigate(`/community/study/${id}`);
          return;
        }
      } catch (e) {
        console.error(e);
        alert((e as Error)?.message || '저장 중 오류가 발생했어요.');
      }
    },
    [currentUserId, freeMut, shareMut, studyMut, navigate],
  );

  return (
    <div className="p-6 max-w-[720px] mx-auto space-y-4">
      <PostForm
        initialValues={initialValues}
        submitLabel={isPending ? '등록 중...' : '등록'}
        disabled={isPending}
        onSubmit={handleSubmit}
      />
      {errorMsg && <div className="text-red-600 text-sm">저장 실패: {errorMsg}</div>}
    </div>
  );
}
