import { useMemo, useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import PostForm, { PostFormValues } from './PostForm';
import { useCreateFree, useCreateShare, useCreateStudy } from '../hook/useCommunityPosts';
import { FreePostRequestDTO, SharePostRequestDTO, StudyPostRequestDTO } from '../api/types';

const toISODate = (d?: string) => (d ? new Date(`${d}T00:00:00`).toISOString() : '');

type Cat = 'free' | 'share' | 'study';

export default function CreatePost() {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const initialCategory = (sp.get('category') as Cat) ?? 'free';

  const [shareFileUrl, setShareFileUrl] = useState<string>('');
  const [shareImgUrl, setshareImgUrl] = useState<string>('');

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
          const body: FreePostRequestDTO = {
            title: v.title,
            content: v.content,
            user_id: currentUserId,
          };
          const res = await freeMut.mutateAsync(body);
          navigate(`/community/free/${res.id}`);
          return;
        }

        if (v.category === 'share') {
          const body: SharePostRequestDTO = {
            title: v.title,
            content: v.content,
            user_id: currentUserId,
            file_url: shareFileUrl || null,
            img_url: shareImgUrl || null,
          };
          const res = await shareMut.mutateAsync(body);
          navigate(`/community/share/${res.id}`);
          return;
        }

        if (v.category === 'study') {
          const body: StudyPostRequestDTO = {
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
          navigate(`/community/study/${res.id}`);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    },
    [currentUserId, freeMut, shareMut, studyMut, navigate, shareFileUrl],
  );

  return (
    <div className="p-6 max-w-[720px] mx-auto space-y-4">
      <h1 className="text-xl font-semibold">새 글 작성</h1>

      <PostForm
        initialValues={initialValues}
        submitLabel="저장"
        disabled={isPending}
        onSubmit={handleSubmit}
      />

      {(initialValues.category ?? 'free') === 'share' && (
        <div className="space-y-2 border-t pt-4 mt-2">
          <label className="block text-sm">첨부 파일 URL (옵션)</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="https://..."
            value={shareFileUrl}
            onChange={(e) => setShareFileUrl(e.target.value)}
            disabled={isPending}
          />
          {errorMsg && <div className="text-red-600 text-sm">저장 실패: {errorMsg}</div>}
        </div>
      )}

      {(initialValues.category ?? 'free') !== 'share' && errorMsg && (
        <div className="text-red-600 text-sm">저장 실패: {errorMsg}</div>
      )}
    </div>
  );
}
