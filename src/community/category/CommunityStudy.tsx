import { useMemo, useState } from 'react';
import { useInfiniteCursor } from '../hook/useInfiniteCursor';
import { useIntersection } from '../hook/useIntersection';
import { useNavigate } from 'react-router-dom';
import type { ListItem } from '../api/types';
import PostCard from '../components/Postcard';

import { motion, AnimatePresence, type Variants } from 'framer-motion';

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 16 },
  },
};

export default function CommunityShare() {
  const [q] = useState('');
  const navigate = useNavigate();
  const currentUserId = 18;

  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCursor('study', q);

  const items: ListItem[] = useMemo(() => data?.pages.flatMap((p) => p.items ?? []) ?? [], [data]);

  const toNumber = (v: unknown) => {
    if (v == null) return null;
    const n = typeof v === 'string' ? Number(v) : (v as number);
    return Number.isFinite(n) ? (n as number) : null;
  };

  const detailIdOf = (it: any) =>
    toNumber(it.id) ??
    toNumber(it.post_id) ??
    toNumber(it.share_post_id) ??
    toNumber(it.study_post_id);

  const sentinelRef = useIntersection(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  });

  if (isError) return <div className="p-4 text-red-500">목록을 불러오지 못했어요.</div>;

  return (
    <>
      <AnimatePresence mode="popLayout">
        <ul className="space-y-3">
          {items.map((post, idx) => {
            if (post.category !== 'study') return null;

            const detailId = detailIdOf(post);
            const key =
              detailId != null
                ? `study-${detailId}`
                : `study-${(post as any).created_at ?? 'no-date'}-${idx}`;

            return (
              <li key={key}>
                <motion.div
                  variants={cardVariants}
                  initial="hidden"
                  animate="show"
                  exit={{ opacity: 0, y: -6 }}
                  layout
                  whileHover={{ y: -2, scale: 1.01 }}
                  transition={{ layout: { duration: 0.2 } }}
                  className="will-change-transform"
                >
                  <PostCard
                    post={{
                      id: detailId ?? -1, // PostCard가 요구하는 id 채워주기
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
                    onClick={(clickedId) => {
                      if (!Number.isFinite(clickedId) || clickedId <= 0) return;
                      navigate(`/community/study/${clickedId}`);
                    }}
                  />
                </motion.div>
              </li>
            );
          })}
        </ul>
      </AnimatePresence>

      <div ref={sentinelRef} className="h-12" />
      {isFetchingNextPage && <div className="py-4 text-center">더 불러오는 중…</div>}
      {!hasNextPage && !isLoading && items.length > 0 && (
        <div className="py-6 text-center text-gray-500">마지막이에요.</div>
      )}
    </>
  );
}
