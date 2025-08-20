import { useInfiniteQuery, QueryFunctionContext } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { FreePostResponse } from '../api/types';
import PostCard, { Post } from '../components/Postcard';
import { mockFreeListCursor } from '../__mock__/dummyPost';

type CursorPage<T> = { items: T[]; nextCursor: number | null };
type QK = readonly ['mock', 'free', 'cursor'];

export default function CommunityFree() {
  const navigate = useNavigate();
  const currentUserId = 18;

  const q = useInfiniteQuery<
    CursorPage<FreePostResponse>,
    Error,
    FreePostResponse[],
    QK,
    number | null
  >({
    queryKey: ['mock', 'free', 'cursor'] as const,
    initialPageParam: null,
    queryFn: ({ pageParam }: QueryFunctionContext<QK, number | null>) =>
      mockFreeListCursor(pageParam),
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    select: (data) => data.pages.flatMap((p) => p.items),
  });

  const items = q.data ?? [];

  if (q.status === 'pending') return <div className="p-6">로딩중…</div>;
  if (q.status === 'error') return <div className="p-6 text-red-600">불러오기 실패</div>;

  return (
    <div className="space-y-3">
      {items.map((it) => {
        const post: Post = {
          id: it.id,
          title: it.title,
          author_id: `${it.author_id}`,
          category: 'free',
          content: it.content,
          createdAt: it.created_at,
          views: it.views,
          likes: 0,
          comments: 0,
        };
        return (
          <PostCard
            key={post.id}
            post={post}
            currentUserId={currentUserId}
            onClick={(id) => navigate(`/community/free/${id}`)}
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
