import { useMemo, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PostForm, { PostFormValues } from './PostForm';
import { useCreateFree, useCreateShare, useCreateStudy } from '../hook/useCommunityPosts';
import { StudyPostRequest } from '../api/types';

const toISODate = (d?: string) => (d ? new Date(`${d}T00:00:00`).toISOString() : '');

type Cat = 'free' | 'share' | 'study';

export default function CreatePost() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();
  const initialCategory = (sp.get('category') as Cat) ?? 'free';

  const currentUserId = 1001;

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
          const fd = new FormData();
          fd.append('title', v.title);
          fd.append('content', v.content);
          fd.append('user_id', String(currentUserId));
          fd.append('category', 'free');

          (v.freeImages ?? []).forEach((img) => {
            fd.append('images', img, img.name);
          });

          const res = await freeMut.mutateAsync(fd);
          const id = (res as any).id ?? (res as any).post_id;
          navigate(`/community/free/${id}`);
          return;
        }

        if (v.category === 'share') {
          const fd = new FormData();
          fd.append('title', v.title);
          fd.append('content', v.content);
          fd.append('user_id', String(currentUserId));
          fd.append('category', 'share');

          (v.shareFiles ?? []).forEach((f) => {
            fd.append('files', f, f.name);
          });

          const res = await shareMut.mutateAsync(fd);
          const id = (res as any).id ?? (res as any).post_id;
          navigate(`/community/share/${id}`);
          return;
        }

        if (v.category === 'study') {
          const body: StudyPostRequest = {
            title: v.title,
            content: v.content,
            user_id: currentUserId,
            recruit_start: toISODate(v.recruitStart),
            recruit_end: toISODate(v.recruitEnd),
            study_start: toISODate(v.studyStart),
            study_end: toISODate(v.studyEnd),
            max_member: Number(v.maxMembers ?? 0),
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
