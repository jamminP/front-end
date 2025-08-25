import { useMemo, useState } from 'react';
import { useInfiniteCursor } from '../hook/useInfiniteCursor';
import { useIntersection } from '../hook/useIntersection';
import { useNavigate } from 'react-router-dom';

import type { ListItem } from '../api/types';
import { getPostId } from '../api/community';
import PostCard from '../components/Postcard';

import { motion, AnimatePresence, type Variants } from 'framer-motion';

const listVariants = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 120, damping: 16 } as const,
  },
} satisfies Variants;

export default function CommunityFree() {
  const [q] = useState('');
  const navigate = useNavigate();
  const currentUserId = 18;

  // 1) 먼저 데이터 훅 호출
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteCursor('free', q);

  // 2) 이 데이터로 'id'를 주입한 리스트 생성
  type AdaptedItem = ListItem & { id: number };
  const adaptedItems: AdaptedItem[] = useMemo(
    () =>
      (data?.pages.flatMap((p) => p.items) ?? []).map((p) => ({
        ...p,
        id: getPostId(p),
      })),
    [data],
  );

  const sentinelRef = useIntersection(() => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  });

  if (isError) return <div className="p-4 text-red-500">목록을 불러오지 못했어요.</div>;

  return (
    <>
      <AnimatePresence mode="popLayout">
        <ul className="space-y-3">
          {adaptedItems.map((post) => (
            <motion.li
              key={post.id}
              variants={listVariants}
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, y: -6 }}
              layout
              whileHover={{ y: -2, scale: 1.01 }}
              transition={{ layout: { duration: 0.2 } }}
              className="will-change-transform"
            >
              <PostCard
                post={post} // ← id가 주입된 형태
                currentUserId={currentUserId}
                onClick={(id) => navigate(`/community/${id}`)} // ← 그대로 사용
              />
            </motion.li>
          ))}
        </ul>
      </AnimatePresence>

      <div ref={sentinelRef} className="h-12" />
      {isFetchingNextPage && <div className="py-4 text-center">더 불러오는 중…</div>}
      {!hasNextPage && !isLoading && adaptedItems.length > 0 && (
        <div className="py-6 text-center text-gray-500">마지막이에요.</div>
      )}
    </>
  );
}
