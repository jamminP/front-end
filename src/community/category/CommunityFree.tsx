import { useMemo, useState } from 'react';
import { useInfiniteCursor } from '../hook/useInfiniteCursor';
import { useIntersection } from '../hook/useIntersection';
import PostCard from '../components/Postcard';
import { useNavigate } from 'react-router-dom';

type FreePostResponse = {
  id: number;
  title: string;
  content: string;
  author_id: string;
  category: 'free';
  created_at: string;
  views: number;
};

export default function CommunityFree() {
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const currentUserId = 18;

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCursor<FreePostResponse>('free', q);

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
              onClick={() => navigate(`/community/post/free/${post.id}`)}
            />
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
