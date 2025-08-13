// import { useMemo } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useQuery } from '@tanstack/react-query';

// import {
//   getFreePost,
//   getSharePost,
//   getStudyPost,
//   listComments,
//   deletePost,
// } from '../api/community';
// import type {
//   FreePostResponseDTO,
//   SharePostResponseDTO,
//   StudyPostResponseDTO,
// } from '../api/types';
// import CommentList from './components/CommentList';
// import CommentForm from './components/CommentForm';
// import LikeButton from './components/LikeButton';

// type Cat = 'free' | 'share' | 'study';

// type VM = {
//   id: number;
//   title: string;
//   content: string;
//   authorId: number;
//   authorName: string;
//   createdAt: string;
//   views: number;
//   category: Cat;
//   // optional
//   imageUrl?: string | null;
//   fileUrl?: string | null;
//   recruitStart?: string;
//   recruitEnd?: string;
//   studyStart?: string;
//   studyEnd?: string;
//   maxMembers?: number;
// };

// const currentUserId = 1001; // 로그인 연동 전 임시

// export default function PostDetail() {
//   const nav = useNavigate();
//   const { category, id } = useParams<{ category: Cat; id: string }>();
//   const postId = Number(id);

//   const qPost = useQuery({
//     queryKey: ['post', category, postId] as const,
//     enabled: !!category && Number.isFinite(postId),
//     queryFn: async () => {
//       if (category === 'free') return await getFreePost(postId);
//       if (category === 'share') return await getSharePost(postId);
//       return await getStudyPost(postId);
//     },
//   });

//   const qComments = useQuery({
//     queryKey: ['comments', postId] as const,
//     enabled: Number.isFinite(postId),
//     queryFn: () => listComments(postId),
//   });

//   const vm: VM | null = useMemo(() => {
//     const dto = qPost.data;
//     if (!dto || !category) return null;

//     if (category === 'free') {
//       const d = dto as FreePostResponseDTO;
//       return {
//         id: d.id,
//         title: d.title,
//         content: d.content,
//         authorId: d.author_id,
//         authorName: `user#${d.author_id}`,
//         createdAt: d.created_at,
//         views: d.views,
//         category: 'free',
//         imageUrl: d.free_board?.image_url ?? null,
//       };
//     }
//     if (category === 'share') {
//       const d = dto as SharePostResponseDTO;
//       return {
//         id: d.id,
//         title: d.title,
//         content: d.content,
//         authorId: d.author_id,
//         authorName: `user#${d.author_id}`,
//         createdAt: d.created_at,
//         views: d.views,
//         category: 'share',
//         fileUrl: d.data_share?.file_url ?? null,
//       };
//     }
//     // study
//     const d = dto as StudyPostResponseDTO;
//     return {
//       id: d.id,
//       title: d.title,
//       content: d.content,
//       authorId: d.author_id,
//       authorName: `user#${d.author_id}`,
//       createdAt: d.created_at,
//       views: d.views,
//       category: 'study',
//       recruitStart: d.study_recruitment.recruit_start,
//       recruitEnd: d.study_recruitment.recruit_end,
//       studyStart: d.study_recruitment.study_start,
//       studyEnd: d.study_recruitment.study_end,
//       maxMembers: d.study_recruitment.max_member,
//     };
//   }, [qPost.data, category]);

//   if (qPost.status === 'pending') return <div className="p-6">불러오는 중…</div>;
//   if (qPost.status === 'error' || !vm) return <div className="p-6 text-red-600">글을 불러오지 못했습니다.</div>;

//   const canEdit = vm.authorId === currentUserId;

//   const handleDelete = async () => {
//     if (!confirm('정말 삭제하시겠어요?')) return;
//     try {
//       await deletePost(vm.id, currentUserId);
//       nav('/community');
//     } catch (e) {
//       alert('삭제 실패');
//     }
//   };

//   return (
//     <div className="max-w-[900px] mx-auto p-4">
//       {/* 헤더 */}
//       <div className="bg-gray-100 rounded-2xl shadow px-6 py-5">
//         <div className="flex items-start justify-between">
//           <div>
//             <div className="font-semibold text-gray-800">{vm.authorName}</div>
//             <div className="text-xs text-gray-500">{vm.createdAt}</div>
//           </div>

//           <div className="flex items-center gap-3">
//             <LikeButton postId={vm.id} currentUserId={currentUserId} />
//             {canEdit && (
//               <>
//                 <button
//                   className="text-sm text-gray-700 hover:text-[#0180F5]"
//                   onClick={() => nav(`/community/${vm.category}/${vm.id}/edit`)}
//                 >
//                   수정
//                 </button>
//                 <button
//                   className="text-sm text-gray-700 hover:text-[#0180F5]"
//                   onClick={handleDelete}
//                 >
//                   삭제
//                 </button>
//               </>
//             )}
//           </div>
//         </div>

//         <h1 className="text-2xl font-bold mt-3">{vm.title}</h1>

//         {/* 카테고리별 보조영역 */}
//         {vm.category === 'study' && (
//           <div className="mt-2 text-sm text-gray-700 space-y-1">
//             <div>모집기간: {vm.recruitStart} ~ {vm.recruitEnd}</div>
//             <div>스터디기간: {vm.studyStart} ~ {vm.studyEnd}</div>
//             <div>모집인원: {vm.maxMembers}명</div>
//           </div>
//         )}
//         {vm.category === 'share' && vm.fileUrl && (
//           <div className="mt-2">
//             <a
//               href={vm.fileUrl}
//               className="text-sm text-[#0180F5] underline"
//               target="_blank" rel="noopener noreferrer"
//             >
//               첨부 파일 열기
//             </a>
//           </div>
//         )}
//         {vm.category === 'free' && vm.imageUrl && (
//           <div className="mt-3">
//             {/* eslint-disable-next-line @next/next/no-img-element */}
//             <img src={vm.imageUrl} alt="첨부 이미지" className="rounded-xl max-h-80 object-cover" />
//           </div>
//         )}

//         {/* 본문 */}
//         <div className="mt-4 whitespace-pre-wrap leading-7 text-gray-800">
//           {vm.content}
//         </div>
//       </div>

//       {/* 댓글 */}
//       <section className="mt-6">
//         <CommentForm postId={vm.id} currentUserId={currentUserId} />
//         <CommentList
//           isLoading={qComments.status === 'pending'}
//           items={qComments.data ?? []}
//           postId={vm.id}
//           currentUserId={currentUserId}
//         />
//       </section>
//     </div>
//   );
// }

import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import { mockGetFree, mockGetShare, mockGetStudy, mockListComments } from '../__mock__/dummyPost';
import type { FreePostResponseDTO, SharePostResponseDTO, StudyPostResponseDTO } from '../api/types';

import CommentList from './components/CommentList';
import CommentForm from './components/CommentForm';
import LikeButton from './components/LikeButton';

type Cat = 'free' | 'share' | 'study';

type VM = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  authorName: string;
  createdAt: string;
  views: number;
  category: Cat;
  imageUrl?: string | null;
  fileUrl?: string | null;
  recruitStart?: string;
  recruitEnd?: string;
  studyStart?: string;
  studyEnd?: string;
  maxMembers?: number;
};

const currentUserId = 1001;

export default function PostDetailMock() {
  const nav = useNavigate();
  const { category, id } = useParams<{ category: Cat; id: string }>();
  const postId = Number(id);

  const qPost = useQuery({
    queryKey: ['post', 'mock', category, postId] as const,
    enabled: !!category && Number.isFinite(postId),
    queryFn: async () => {
      if (category === 'free') return await mockGetFree(postId);
      if (category === 'share') return await mockGetShare(postId);
      return await mockGetStudy(postId);
    },
  });

  const qComments = useQuery({
    queryKey: ['comments', 'mock', postId] as const,
    enabled: Number.isFinite(postId),
    queryFn: () => mockListComments(postId),
  });

  const vm: VM | null = useMemo(() => {
    const dto = qPost.data;
    if (!dto || !category) return null;

    if (category === 'free') {
      const d = dto as FreePostResponseDTO;
      return {
        id: d.id,
        title: d.title,
        content: d.content,
        authorId: d.author_id,
        authorName: `user#${d.author_id}`,
        createdAt: d.created_at,
        views: d.views,
        category: 'free',
        imageUrl: d.free_board?.image_url ?? null,
      };
    }
    if (category === 'share') {
      const d = dto as SharePostResponseDTO;
      return {
        id: d.id,
        title: d.title,
        content: d.content,
        authorId: d.author_id,
        authorName: `user#${d.author_id}`,
        createdAt: d.created_at,
        views: d.views,
        category: 'share',
        fileUrl: d.data_share?.file_url ?? null,
      };
    }
    const d = dto as StudyPostResponseDTO;
    return {
      id: d.id,
      title: d.title,
      content: d.content,
      authorId: d.author_id,
      authorName: `user#${d.author_id}`,
      createdAt: d.created_at,
      views: d.views,
      category: 'study',
      recruitStart: d.study_recruitment.recruit_start,
      recruitEnd: d.study_recruitment.recruit_end,
      studyStart: d.study_recruitment.study_start,
      studyEnd: d.study_recruitment.study_end,
      maxMembers: d.study_recruitment.max_member,
    };
  }, [qPost.data, category]);

  if (qPost.status === 'pending') return <div className="p-6">불러오는 중…</div>;
  if (qPost.status === 'error' || !vm)
    return <div className="p-6 text-red-600">글을 불러오지 못했습니다.</div>;

  const canEdit = vm.authorId === currentUserId;

  return (
    <div className="max-w-[900px] mx-auto p-4">
      <div className="bg-gray-100 rounded-2xl shadow px-6 py-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="font-semibold text-gray-800">{vm.authorName}</div>
            <div className="text-xs text-gray-500">{vm.createdAt}</div>
          </div>

          <div className="flex items-center gap-3">
            <LikeButton postId={vm.id} currentUserId={currentUserId} />
            {canEdit && (
              <>
                <button
                  className="text-sm text-gray-700 hover:text-[#0180F5]"
                  onClick={() => nav(`/community/${vm.category}/${vm.id}/edit`)}
                >
                  수정
                </button>
                <button
                  className="text-sm text-gray-700 hover:text-[#0180F5]"
                  onClick={() => alert('모킹: 삭제 구현 위치')}
                >
                  삭제
                </button>
              </>
            )}
          </div>
        </div>

        <h1 className="text-2xl font-bold mt-3">{vm.title}</h1>

        {vm.category === 'study' && (
          <div className="mt-2 text-sm text-gray-700 space-y-1">
            <div>
              모집기간: {vm.recruitStart} ~ {vm.recruitEnd}
            </div>
            <div>
              스터디기간: {vm.studyStart} ~ {vm.studyEnd}
            </div>
            <div>모집인원: {vm.maxMembers}명</div>
          </div>
        )}
        {vm.category === 'share' && vm.fileUrl && (
          <div className="mt-2">
            <a
              href={vm.fileUrl}
              className="text-sm text-[#0180F5] underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              첨부 파일 열기
            </a>
          </div>
        )}
        {vm.category === 'free' && vm.imageUrl && (
          <div className="mt-3">
            <img src={vm.imageUrl} alt="첨부 이미지" className="rounded-xl max-h-80 object-cover" />
          </div>
        )}

        <div className="mt-4 whitespace-pre-wrap leading-7 text-gray-800">{vm.content}</div>
      </div>

      <section className="mt-6">
        <CommentForm postId={vm.id} currentUserId={currentUserId} />
        <CommentList
          isLoading={qComments.status === 'pending'}
          items={qComments.data ?? []}
          postId={vm.id}
          currentUserId={currentUserId}
        />
      </section>
    </div>
  );
}
