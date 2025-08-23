import { useMemo, useState } from 'react';
import { useInfiniteCursor } from '../hook/useInfiniteCursor';
import { useIntersection } from '../hook/useIntersection';
import { useNavigate } from 'react-router-dom';

import type { ListItem } from '../api/types';
import { getPostId } from '../api/community';
import PostCard from '../components/Postcard';

export default function CommunityFree() {
  const [q] = useState('');
  const navigate = useNavigate();
  const currentUserId = 18;

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCursor('free', q);

  const items: ListItem[] = useMemo(() => data?.pages.flatMap((p) => p.items) ?? [], [data]);

  const sentinelRef = useIntersection(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  });

  if (isError) return <div className="p-4 text-red-500">목록을 불러오지 못했어요.</div>;

  return (
    <>
      <ul className="space-y-3">
        {items.map((post) => {
          if (post.category !== 'free') return null;
          const id = getPostId(post);
          return (
            <li key={id}>
              <PostCard
                post={{
                  id,
                  title: post.title,
                  content: '',
                  author_id: post.author_id,
                  author_nickname: post.author_nickname ?? '',
                  category: post.category,
                  created_at: post.created_at,
                  views: post.views,
                  like_count: post.like_count,
                  comment_count: post.comment_count,
                }}
                currentUserId={currentUserId}
                onClick={() => navigate(`/community/free/${id}`)}
              />
            </li>
          );
        })}
      </ul>

      <div ref={sentinelRef} className="h-12" />
      {isFetchingNextPage && <div className="py-4 text-center">더 불러오는 중…</div>}
      {!hasNextPage && !isLoading && items.length > 0 && (
        <div className="py-6 text-center text-gray-500">마지막이에요.</div>
      )}
    </>
  );
}
