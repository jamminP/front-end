import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { mockStudyListCursor } from '../__mock__/dummyPost';
import type { StudyPostResponseDTO } from '../api/types';
import PostCard, { Post } from '../components/Postcard';

type CursorPage<T> = { items: T[]; nextCursor: number | null };
type QK = readonly ['mock', 'study', 'cursor'];

export default function CommunityStudy() {
  const navigate = useNavigate();
  const currentUserId = 1001;

  const q = useInfiniteQuery<
    CursorPage<StudyPostResponseDTO>,
    Error,
    StudyPostResponseDTO[],
    QK,
    number | null
  >({
    queryKey: ['mock', 'study', 'cursor'] as const,
    initialPageParam: null,
    queryFn: ({ pageParam }: QueryFunctionContext<QK, number | null>) =>
      mockStudyListCursor(pageParam),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    select: (data) => data.pages.flatMap((p) => p.items),
  });

  const items = q.data ?? [];

  if (q.status === 'pending') return <div className="p-6">로딩중…</div>;
  if (q.status === 'error') return <div className="p-6 text-red-600">불러오기 실패</div>;

  return (
    <div className="space-y-3">
      {items.map((dto) => {
        const post: Post = {
          postId: dto.id,
          title: dto.title,
          author: `user#${dto.author_id}`,
          authorId: dto.author_id,
          category: 'study',
          content: dto.content,
          createdAt: dto.created_at,
          views: dto.views,
          likes: 0,
          comments: 0,

          recruitStart: dto.study_recruitment.recruit_start,
          recruitEnd: dto.study_recruitment.recruit_end,
          studyStart: dto.study_recruitment.study_start,
          studyEnd: dto.study_recruitment.study_end,
          maxMembers: dto.study_recruitment.max_member,
        };
        return (
          <PostCard
            key={post.postId}
            post={post}
            currentUserId={currentUserId}
            onClick={(id) => navigate(`/community/study/${id}`)}
          />
        );
      })}

      {q.hasNextPage && (
        <button
          onClick={() => q.fetchNextPage()}
          disabled={q.isFetchingNextPage}
          className="block mx-auto mt-2 px-4 py-2 rounded-xl shadow hover:shadow-md"
        >
          {q.isFetchingNextPage ? '불러오는 중…' : '더 불러오기'}
        </button>
      )}
    </div>
  );
}
