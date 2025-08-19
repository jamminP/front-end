// import { useCallback, useMemo, useState } from 'react';
// import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
// import { useMutation, useQuery, useQueryClient, QueryFunctionContext } from '@tanstack/react-query';

// import PostForm, { PostFormValues } from './PostForm';
// import {
//   getFreePost,
//   getSharePost,
//   getStudyPost,
//   patchFreePost,
//   patchSharePost,
//   patchStudyPost,
// } from '../api/community';

// import type {
//   FreePostResponse,
//   SharePostResponse,
//   StudyPostResponse,
//   FreePostUpdateRequest,
//   SharePostUpdateRequest,
//   StudyPostUpdateRequest,
// } from '../api/types';

// type Cat = 'free' | 'share' | 'study';

// const toISODate = (d?: string) => (d ? new Date(`${d}T00:00:00`).toISOString() : undefined);

// const toInputDate = (iso?: string | null) => {
//   if (!iso) return '';
//   const s = String(iso);
//   const i = s.indexOf('T');
//   return i > 0 ? s.slice(0, i) : s.slice(0, 10);
// };

// export default function EditPost() {
//   const navigate = useNavigate();
//   const qc = useQueryClient();

//   const { category: catFromParams, id: idParam } = useParams<{ category?: Cat; id?: string }>();
//   const [sp] = useSearchParams();
//   const cat: Cat = (catFromParams as Cat) ?? ((sp.get('category') as Cat) || 'free');
//   const postId = Number(idParam ?? sp.get('id') ?? NaN);

//   const currentUserId = 1001;

//   type QK = readonly ['post', Cat, number];

//   const q = useQuery<
//     FreePostResponse | SharePostResponse | StudyPostResponse,
//     Error,
//     FreePostResponse | SharePostResponse | StudyPostResponse,
//     QK
//   >({
//     queryKey: ['post', cat, postId] as const,
//     enabled: Number.isFinite(postId),
//     queryFn: ({ queryKey }: QueryFunctionContext<QK>) => {
//       const [, category, id] = queryKey;
//       if (category === 'free') return getFreePost(id);
//       if (category === 'share') return getSharePost(id);
//       return getStudyPost(id);
//     },
//   });

//   const initialValues: Partial<PostFormValues> | undefined = useMemo(() => {
//     const data = q.data;
//     if (!data) return undefined;

//     if (cat === 'free') {
//       const d = data as FreePostResponse;
//       return {
//         category: 'free',
//         title: d.title,
//         content: d.content,
//       };
//     }
//     if (cat === 'share') {
//       const d = data as SharePostResponse;
//       return {
//         category: 'share',
//         title: d.title,
//         content: d.content,
//       };
//     }

//     const d = data as StudyPostResponse;
//     return {
//       category: 'study',
//       title: d.title,
//       content: d.content,
//       recruitStart: toInputDate(d.study_recruitment.recruit_start),
//       recruitEnd: toInputDate(d.study_recruitment.recruit_end),
//       studyStart: toInputDate(d.study_recruitment.study_start),
//       studyEnd: toInputDate(d.study_recruitment.study_end),
//       maxMembers: d.study_recruitment.max_member,
//     };
//   }, [q.data, cat]);

//   const [shareFileUrl, setShareFileUrl] = useState<string>('');
//   const [freeImageUrl, setFreeImageUrl] = useState<string>('');

//   useMemo(() => {
//     if (!q.data) return;
//     if (cat === 'share') {
//       const d = q.data as SharePostResponse;
//       setShareFileUrl(d.data_share?.file_url ?? '');
//     } else if (cat === 'free') {
//       const d = q.data as FreePostResponse;
//       setFreeImageUrl(d.free_board?.image_url ?? '');
//     }
//   }, [q.data, cat]);

//   const mut = useMutation({
//     mutationFn: async (v: PostFormValues) => {
//       if (cat === 'free') {
//         const body: FreePostUpdateRequest = {
//           title: v.title,
//           content: v.content,
//         };
//         return await patchFreePost(postId, body, currentUserId);
//       }
//       if (cat === 'share') {
//         const body: SharePostUpdateRequest = {
//           title: v.title,
//           content: v.content,
//           file_url: shareFileUrl || null,
//         };
//         return await patchSharePost(postId, body, currentUserId);
//       }
//       const body: StudyPostUpdateRequest = {
//         title: v.title,
//         content: v.content,
//         recruit_start: toISODate(v.recruitStart),
//         recruit_end: toISODate(v.recruitEnd),
//         study_start: toISODate(v.studyStart),
//         study_end: toISODate(v.studyEnd),
//         max_member: v.maxMembers,
//       };
//       return await patchStudyPost(postId, body, currentUserId);
//     },
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ['post', cat, postId] });
//       navigate(`/community/${cat}/${postId}`);
//     },
//   });

//   const handleSubmit = useCallback(
//     async (v: PostFormValues) => {
//       const fixed: PostFormValues = { ...v, category: cat };
//       try {
//         await mut.mutateAsync(fixed);
//       } catch (e) {
//         console.error(e);
//       }
//     },
//     [mut, cat],
//   );

//   if (!Number.isFinite(postId)) {
//     return <div className="p-6 text-red-600">잘못된 주소입니다. (id 누락)</div>;
//   }
//   if (q.status === 'pending') {
//     return <div className="p-6">불러오는 중…</div>;
//   }
//   if (q.status === 'error') {
//     return <div className="p-6 text-red-600">게시글을 불러오지 못했습니다.</div>;
//   }

//   const errorMsg = (mut.error as Error)?.message ?? '';

//   return (
//     <div className="p-6 max-w-[720px] mx-auto space-y-4">
//       <h1 className="text-xl font-semibold">글 수정</h1>

//       <PostForm
//         initialValues={initialValues}
//         submitLabel={mut.isPending ? '저장 중…' : '저장'}
//         disabled={mut.isPending}
//         onSubmit={handleSubmit}
//       />

//       {cat === 'share' && (
//         <div className="space-y-2 border-t pt-4 mt-2">
//           <label className="block text-sm">첨부 파일 URL (옵션)</label>
//           <input
//             className="w-full border rounded-lg px-3 py-2"
//             placeholder="https://..."
//             value={shareFileUrl}
//             onChange={(e) => setShareFileUrl(e.target.value)}
//             disabled={mut.isPending}
//           />
//         </div>
//       )}

//       {cat === 'free' && (
//         <div className="space-y-2 border-t pt-4 mt-2">
//           <label className="block text-sm">이미지 URL (옵션)</label>
//           <input
//             className="w-full border rounded-lg px-3 py-2"
//             placeholder="https://..."
//             value={freeImageUrl}
//             onChange={(e) => setFreeImageUrl(e.target.value)}
//             disabled={mut.isPending}
//           />
//         </div>
//       )}

//       {errorMsg && <div className="text-red-600 text-sm">저장 실패: {errorMsg}</div>}
//     </div>
//   );
// }

//목 코드
import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient, QueryFunctionContext } from '@tanstack/react-query';

import PostForm, { PostFormValues } from './PostForm';
import {
  mockGetFree,
  mockGetShare,
  mockGetStudy,
  mockPatchFree,
  mockPatchShare,
  mockPatchStudy,
} from '../__mock__/dummyPost';
import type {
  FreePostResponse,
  SharePostResponse,
  StudyPostResponse,
  FreePostUpdateRequest,
  SharePostUpdateRequest,
  StudyPostUpdateRequest,
} from '../api/types';

type Cat = 'free' | 'share' | 'study';
const toISODate = (d?: string) => (d ? new Date(`${d}T00:00:00`).toISOString() : undefined);
const toInputDate = (iso?: string | null) => (iso ? String(iso).slice(0, 10) : '');

export default function EditPostMock() {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { category: catFromParams, id: idParam } = useParams<{ category?: Cat; id?: string }>();
  const [sp] = useSearchParams();
  const cat: Cat = (catFromParams as Cat) ?? ((sp.get('category') as Cat) || 'free');
  const postId = Number(idParam ?? sp.get('id') ?? NaN);
  const currentUserId = 1001;

  type QK = readonly ['post', 'mock', Cat, number];
  const q = useQuery<
    FreePostResponse | SharePostResponse | StudyPostResponse,
    Error,
    FreePostResponse | SharePostResponse | StudyPostResponse,
    QK
  >({
    queryKey: ['post', 'mock', cat, postId] as const,
    enabled: Number.isFinite(postId),
    queryFn: ({ queryKey }: QueryFunctionContext<QK>) => {
      const [, , category, id] = queryKey;
      if (category === 'free') return mockGetFree(id);
      if (category === 'share') return mockGetShare(id);
      return mockGetStudy(id);
    },
  });

  // 초기 폼 값
  const initialValues: Partial<PostFormValues> | undefined = useMemo(() => {
    const data = q.data;
    if (!data) return undefined;

    if (cat === 'free') {
      const d = data as FreePostResponse;
      return { category: 'free', title: d.title, content: d.content };
    }
    if (cat === 'share') {
      const d = data as SharePostResponse;
      return { category: 'share', title: d.title, content: d.content };
    }
    const d = data as StudyPostResponse;
    return {
      category: 'study',
      title: d.title,
      content: d.content,
      recruitStart: toInputDate(d.study_recruitment.recruit_start),
      recruitEnd: toInputDate(d.study_recruitment.recruit_end),
      studyStart: toInputDate(d.study_recruitment.study_start),
      studyEnd: toInputDate(d.study_recruitment.study_end),
      maxMembers: d.study_recruitment.max_member,
    };
  }, [q.data, cat]);

  const [shareFileUrl, setShareFileUrl] = useState<string>('');
  const [freeImageUrl, setFreeImageUrl] = useState<string>('');

  useMemo(() => {
    if (!q.data) return;
    if (cat === 'share') {
      const d = q.data as SharePostResponse;
      setShareFileUrl(d.data_share?.file_url ?? '');
    } else if (cat === 'free') {
      const d = q.data as FreePostResponse;
      setFreeImageUrl(d.free_board?.image_url ?? '');
    }
  }, [q.data, cat]);

  const mut = useMutation({
    mutationFn: async (v: PostFormValues) => {
      if (cat === 'free') {
        const body: FreePostUpdateRequest = {
          title: v.title,
          content: v.content,
        };
        return await mockPatchFree(postId, body);
      }
      if (cat === 'share') {
        const body: SharePostUpdateRequest = {
          title: v.title,
          content: v.content,
          file_url: shareFileUrl || null,
        };
        return await mockPatchShare(postId, body);
      }
      const body: StudyPostUpdateRequest = {
        title: v.title,
        content: v.content,
        recruit_start: toISODate(v.recruitStart),
        recruit_end: toISODate(v.recruitEnd),
        study_start: toISODate(v.studyStart),
        study_end: toISODate(v.studyEnd),
        max_member: v.maxMembers,
      };
      return await mockPatchStudy(postId, body);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['post', 'mock', cat, postId] });
      qc.invalidateQueries({ queryKey: ['mock', cat, 'cursor'] });
      navigate(`/community/${cat}/${postId}`);
    },
  });

  const handleSubmit = useCallback(
    async (v: PostFormValues) => {
      try {
        await mut.mutateAsync({ ...v, category: cat });
      } catch (e) {
        console.error(e);
      }
    },
    [mut, cat],
  );

  if (!Number.isFinite(postId)) return <div className="p-6 text-red-600">잘못된 주소(id)</div>;
  if (q.status === 'pending') return <div className="p-6">불러오는 중…</div>;
  if (q.status === 'error')
    return <div className="p-6 text-red-600">게시글을 불러오지 못했습니다.</div>;

  const errorMsg = (mut.error as Error)?.message ?? '';

  return (
    <div className="p-6 max-w-[720px] mx-auto space-y-4">
      <h1 className="text-xl font-semibold">글 수정 (mock)</h1>

      <PostForm
        initialValues={initialValues}
        submitLabel={mut.isPending ? '저장 중…' : '저장'}
        disabled={mut.isPending}
        onSubmit={handleSubmit}
      />

      {cat === 'share' && (
        <div className="space-y-2 border-t pt-4 mt-2">
          <label className="block text-sm">첨부 파일 URL (옵션)</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="https://..."
            value={shareFileUrl}
            onChange={(e) => setShareFileUrl(e.target.value)}
            disabled={mut.isPending}
          />
        </div>
      )}

      {cat === 'free' && (
        <div className="space-y-2 border-t pt-4 mt-2">
          <label className="block text-sm">이미지 URL (옵션)</label>
          <input
            className="w-full border rounded-lg px-3 py-2"
            placeholder="https://..."
            value={freeImageUrl}
            onChange={(e) => setFreeImageUrl(e.target.value)}
            disabled={mut.isPending}
          />
        </div>
      )}

      {errorMsg && <div className="text-red-600 text-sm">저장 실패: {errorMsg}</div>}
    </div>
  );
}
