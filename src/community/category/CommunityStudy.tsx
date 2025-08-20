// /src/Community/Category/CommunityStudy.tsx
import { useMemo, useState } from 'react';
import { useInfiniteCursor } from '../hook/useInfiniteCursor';
import { useIntersection } from '../hook/useIntersection';
import PostCard from '../components/Postcard';
import { useNavigate } from 'react-router-dom';

type StudyPostResponse = {
  id: number;
  title: string;
  content: string;
  author_id: string;
  category: 'study';
  created_at: string;
  views: number;
  badge?: string;
  remaining?: number;
  max_member?: number;
};

export default function CommunityStudy() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const currentUserId = 0; // TODO: 로그인 상태에서 받아오기

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCursor<StudyPostResponse>('study', q);

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const sentinelRef = useIntersection(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  });

  return (
    <>
      <ul className="space-y-3">
        {items.map((post) => (
          <li key={post.id}>
            <PostCard
              post={post}
              currentUserId={currentUserId}
              onClick={() => navigate(`/community/post/study/${post.id}`)}
            />
            {(post.badge || post.remaining !== undefined) && (
              <div className="mt-1 text-sm text-gray-600">
                {post.badge ? `상태: ${post.badge}` : null}
                {post.remaining !== undefined && post.max_member !== undefined
                  ? ` · ${post.remaining}/${post.max_member} 남음`
                  : null}
              </div>
            )}
          </li>
        ))}
      </ul>

      <div ref={sentinelRef} className="h-12" />
      {isFetchingNextPage && <div className="py-4 text-center">더 불러오는 중…</div>}
      {!hasNextPage && !isLoading && items.length > 0 && (
        <div className="py-6 text-center text-gray-500">마지막이에요.</div>
      )}
    </>
  );
}
