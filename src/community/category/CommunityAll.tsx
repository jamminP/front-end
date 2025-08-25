// /src/Community/Category/CommunityAll.tsx
import { useMemo, useState } from 'react';
import { useInfiniteCursor } from '../hook/useInfiniteCursor';
import { useIntersection } from '../hook/useIntersection';
import type { ListItem } from '../api/types';
import PostCard from '../components/Postcard';
import { useNavigate } from 'react-router-dom';

export default function CommunityAll() {
  const navigate = useNavigate();
  const currentUserId = 18;

  const [q] = useState('');
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCursor('all', q);

  const rawItems: ListItem[] = useMemo(
    () => data?.pages.flatMap((p) => p.items ?? []) ?? [],
    [data],
  );

  const items = useMemo(() => {
    const out: Array<{ item: ListItem; id: number | null; key: string }> = [];
    const seen = new Set<string>();
    rawItems.forEach((it, idx) => {
      const rawId: unknown =
        (it as any).id ??
        (it as any).post_id ??
        (it as any).free_post_id ??
        (it as any).share_post_id ??
        (it as any).study_post_id;
      const n = typeof rawId === 'string' ? Number(rawId) : rawId;
      const id = Number.isFinite(n as number) ? (n as number) : null;

      const key =
        id != null
          ? `${it.category}-${id}`
          : `${it.category}-${(it as any).created_at ?? 'no-date'}-${idx}`;

      if (seen.has(key)) return; // 커서 경계 중복 방지
      seen.add(key);
      out.push({ item: it, id, key });
    });
    return out;
  }, [rawItems]);

  const sentinelRef = useIntersection(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  });

  if (isError) return <div className="p-4 text-red-500">목록을 불러오지 못했어요.</div>;

  return (
    <>
      <ul className="space-y-3">
        {items.map(({ item: post, id, key }) => (
          <li key={key}>
            <PostCard
              post={{
                id: id ?? -1,
                title: post.title,
                content: (post as any).content ?? (post as any).contents ?? '',
                author_id: (post as any).author_id,
                author_nickname: post.author_nickname ?? '',
                category: post.category,
                created_at: (post as any).created_at,
                views: (post as any).views,
                like_count: post.like_count,
                comment_count: post.comment_count,
              }}
              currentUserId={currentUserId}
              onClick={(clickedId) => {
                if (!Number.isFinite(clickedId) || clickedId <= 0) return;
                navigate(`/community/${post.category}/${clickedId}`);
              }}
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
