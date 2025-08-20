import { useMemo, useState } from 'react';
import { useInfiniteCursor } from '../hook/useInfiniteCursor';
import { useIntersection } from '../hook/useIntersection';
import { AllPostItem } from '../api/types';
import PostCard from '../components/Postcard';
import { useNavigate } from 'react-router-dom';

export default function CommunityAll() {
  const navigate = useNavigate();
  const currentUserId = 18;

  const [q, setQ] = useState('');
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCursor<AllPostItem>('all', q);

  const items = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const sentinelRef = useIntersection(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  });

  return (
    <>
      <ul className="space-y-3">
        {items.map((post) => (
          <li key={`${post.category}-${post.id}`}>
            <PostCard
              post={{
                id: post.id,
                title: post.title,
                content: post.contents,
                author_id: post.author_id,
                category: post.category,
                created_at: post.created_at,
                views: post.views,
              }}
              currentUserId={currentUserId}
              onClick={() => navigate(`/community/post/${post.id}`)}
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
