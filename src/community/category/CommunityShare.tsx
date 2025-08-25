import { useMemo, useState } from 'react';
import { useInfiniteCursor } from '../hook/useInfiniteCursor';
import { useIntersection } from '../hook/useIntersection';
import { useNavigate } from 'react-router-dom';
import type { ListItem } from '../api/types';
import { getPostId } from '../api/community';
import PostCard, { type Post } from '../components/Postcard';
import { motion, AnimatePresence, type Variants } from 'framer-motion';

const listVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
  exit: { opacity: 0, y: -8 },
};

export default function CommunityStudy() {
  const [q] = useState('');
  const navigate = useNavigate();
  const currentUserId = 18;

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCursor('study', q);

  const items: ListItem[] = useMemo(() => data?.pages.flatMap((p) => p.items ?? []) ?? [], [data]);

  // 안전한 id/key 계산 + 중복 제거
  const rows = useMemo(() => {
    const seen = new Set<string>();
    const out: Array<{ key: string; id: number | null; item: ListItem }> = [];

    const toNumber = (v: unknown) => {
      if (v == null) return null;
      const n = typeof v === 'string' ? Number(v) : (v as number);
      return Number.isFinite(n) ? (n as number) : null;
    };

    items.forEach((it, idx) => {
      if (it.category !== 'study') return;

      const raw =
        (it as any).id ?? (it as any).post_id ?? (it as any).study_post_id ?? getPostId(it);

      const id = toNumber(raw);
      const key =
        id != null ? `study-${id}` : `study-${(it as any).created_at ?? 'no-date'}-${idx}`;

      if (seen.has(key)) return;
      seen.add(key);
      out.push({ key, id, item: it });
    });

    return out;
  }, [items]);

  const toPost = (it: ListItem, id: number): Post => ({
    id,
    title: it.title,
    content: (it as any).content ?? '',
    author_id: it.author_id,
    author_nickname: it.author_nickname ?? '',
    category: it.category,
    created_at: it.created_at,
    views: it.views,
    like_count: it.like_count,
    comment_count: it.comment_count,
    study_recruitment: (it as any).study_recruitment,
  });

  const sentinelRef = useIntersection(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  });

  if (isError) return <div className="p-4 text-red-500">목록을 불러오지 못했어요.</div>;

  return (
    <>
      <AnimatePresence mode="popLayout">
        <ul className="space-y-3">
          {rows.map(({ key, id, item }) => (
            <li key={key}>
              <motion.div
                variants={listVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                layout
                whileHover={{ y: -2, scale: 1.01 }}
                transition={{ layout: { duration: 0.2 } }}
                className="will-change-transform"
              >
                <PostCard
                  post={toPost(item, id ?? -1)}
                  currentUserId={currentUserId}
                  onClick={(clickedId) => {
                    const target = id ?? clickedId;
                    if (typeof target === 'number' && target > 0) {
                      navigate(`/community/share/${target}`, {
                        state: { post: toPost(item, target) },
                      });
                    }
                  }}
                />
              </motion.div>
            </li>
          ))}
        </ul>
      </AnimatePresence>

      <div ref={sentinelRef} className="h-12" />
      {isFetchingNextPage && <div className="py-4 text-center">더 불러오는 중…</div>}
      {!hasNextPage && !isLoading && rows.length > 0 && (
        <div className="py-6 text-center text-gray-500">마지막이에요.</div>
      )}
    </>
  );
}
