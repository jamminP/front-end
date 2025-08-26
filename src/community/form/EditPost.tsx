import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';

import PostForm, { PostFormValues } from './PostForm';
import { getPostDetail, patchPost } from '../api/community';

const fromISOToYMD = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};
const toISODate = (d?: string) => (d ? new Date(`${d}T00:00:00`).toISOString() : '');

type Cat = 'free' | 'share' | 'study';

export default function EditPost() {
  const navigate = useNavigate();
  const { category, id, postId } = useParams<{ category?: Cat; id?: string; postId?: string }>();

  const numericId = Number(id ?? postId);
  if (!category || !['free', 'share', 'study'].includes(category) || !Number.isFinite(numericId)) {
    return <div className="p-6 text-red-600">잘못된 경로입니다.</div>;
  }

  const {
    data: post,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['community', 'post', numericId],
    queryFn: () => getPostDetail(numericId),
  });
  const [saving, setSaving] = useState(false);

  const initialValues: Partial<PostFormValues> | undefined = useMemo(() => {
    if (!post) return undefined;

    const base: Partial<PostFormValues> = {
      category: (post as any).category as Cat,
      title: (post as any).title ?? '',
      content: (post as any).content ?? '',
    };

    if ((post as any).category === 'study') {
      const sr = (post as any).study_recruitment ?? {};
      return {
        ...base,
        recruit_start: fromISOToYMD(sr.recruit_start),
        recruit_end: fromISOToYMD(sr.recruit_end),
        study_start: fromISOToYMD(sr.study_start),
        study_end: fromISOToYMD(sr.study_end),
        max_members: typeof sr.max_member === 'number' ? sr.max_member : undefined,
      };
    }

    return base;
  }, [post]);

  const qc = useQueryClient();

  const handleSubmit = useCallback(
    async (v: PostFormValues) => {
      setSaving(true);
      const body: any = {
        title: v.title,
        content: v.content,
      };

      if (v.category === 'study') {
        body.recruit_start = toISODate(v.recruit_start);
        body.recruit_end = toISODate(v.recruit_end);
        body.study_start = toISODate(v.study_start);
        body.study_end = toISODate(v.study_end);
        body.max_member = typeof v.max_members === 'number' ? v.max_members : undefined;
      }
      try {
        await patchPost({ post_id: numericId }, body);

        qc.invalidateQueries({ queryKey: ['community', 'post', numericId] });

        navigate(`/community/${v.category}/${numericId}`);

        await patchPost({ post_id: numericId }, body);
        navigate(`/community/${v.category}/${numericId}`);
      } catch (e: any) {
        if (e?.status === 403 || /403/.test(String(e?.message))) {
          alert('수정 권한이 없어요.');
          return;
        }
        alert('수정에 실패했어요.');
      } finally {
        setSaving(false);
      }
    },
    [numericId, navigate],
  );

  if (isLoading) return <div className="p-6">불러오는 중…</div>;
  if (error || !post) return <div className="p-6 text-red-600">게시물을 불러오지 못했어요.</div>;

  return (
    <div className="p-6 max-w-[720px] mx-auto space-y-4">
      <PostForm
        initialValues={initialValues}
        submitLabel="수정 저장"
        onSubmit={handleSubmit}
        disabled={isLoading || saving}
      />
    </div>
  );
}
