import { useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PostForm, { PostFormValues } from './PostForm';
import { useCreateFree, useCreateShare, useCreateStudy } from '../hook/useCommunityPosts';
import { uploadWithPresignedJson } from '../api/presignedJson';
import { PostRequest, StudyDetail } from '../api/types';

const toISODate = (d?: string) => (d ? new Date(`${d}T00:00:00`).toISOString() : '');

type Cat = 'free' | 'share' | 'study';

export default function CreatePost() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const initialCategory = (sp.get('category') as Cat) ?? 'free';

  const currentUserId = 18;

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
        if (v.category === 'free') {
          const created = await freeMut.mutateAsync({
            title: v.title,
            content: v.content,
            user_id: currentUserId,
            category: 'free',
          });
          const postId = (created as any).id ?? (created as any).post_id;
          const imgs = v.freeImages ?? [];
          if (imgs.length) {
            await uploadWithPresignedJson('free', postId, imgs);
          }

          navigate(`/community/free/${postId}`);
          return;
        }

        if (v.category === 'share') {
          const created = await shareMut.mutateAsync({
            title: v.title,
            content: v.content,
            user_id: currentUserId,
            category: 'share',
          });
          const postId = (created as any).id ?? (created as any).post_id;

          const files = v.shareFiles ?? [];
          if (files.length) {
            await uploadWithPresignedJson('share', postId, files);
          }

          navigate(`/community/share/${postId}`);
          return;
        }

        if (v.category === 'study') {
          const body: PostRequest = {
            title: v.title,
            content: v.content,
            user_id: v.id,
            study_recruitment: {
              recruit_start: toISODate(v.recruit_start),
              recruit_end: toISODate(v.recruit_end),
              study_start: toISODate(v.study_start),
              study_end: toISODate(v.study_end),
              max_member: Number(v.max_members ?? 0),
            },
          };
          const res = await studyMut.mutateAsync(body);
          const id = (res as any).id ?? (res as any).post_id;
          navigate(`/community/study/${id}`);
          return;
        }
      } catch (e) {
        console.error(e);
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
