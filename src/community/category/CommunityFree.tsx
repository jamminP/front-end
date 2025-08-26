import { useMemo, useState } from 'react';
import { useInfiniteCursor } from '../hook/useInfiniteCursor';
import { useIntersection } from '../hook/useIntersection';
import { useNavigate } from 'react-router-dom';

import type { ListItem } from '../api/types';
import PostCard, { type Post } from '../components/Postcard';

import { motion, AnimatePresence, type Variants } from 'framer-motion';

const listVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.18 } },
  exit: { opacity: 0, y: -8 },
};

const resolveId = (it: any): number | null => {
  const raw = it?.id ?? it?.post_id ?? it?.free_post_id ?? it?.share_post_id ?? it?.study_post_id;
  const n = typeof raw === 'string' ? Number(raw) : raw;
  return Number.isFinite(n) ? (n as number) : null;
};

export default function CommunityFree() {
  const [q] = useState('');
  const navigate = useNavigate();

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCursor('free', q);

  const items: ListItem[] = useMemo(() => data?.pages.flatMap((p) => p.items ?? []) ?? [], [data]);

  const rows = useMemo(() => {
    const seen = new Set<string>();
    const out: Array<{ key: string; id: number | null; item: ListItem }> = [];

    items.forEach((it, idx) => {
      if (it.category !== 'free') return;
      const id = resolveId(it);
      const key = id != null ? `free-${id}` : `free-${(it as any)?.created_at ?? 'no-date'}-${idx}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ key, id, item: it });
    });

    return out;
  }, [items]);

  const toPost = (it: ListItem, id: number): Post => ({
    id,
    title: it.title,
    content: (it as any).content ?? (it as any).contents ?? '',
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
                  onClick={(clickedId) => {
                    const target = id ?? clickedId;
                    if (typeof target === 'number' && target > 0) {
                      navigate(`/community/free/${target}`, {
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
