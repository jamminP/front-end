import { useEffect, useMemo, useRef } from 'react';
import { useUnifiedAiFeed } from '../hook/useUnifiedAiFeed';

export default function ChatList({ collapsed }: { collapsed: boolean }) {
  if (collapsed) return null;
  const userId = 17;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } =
    useUnifiedAiFeed(userId);

  const items = useMemo(() => (data?.pages ?? []).flatMap((p) => p.items), [data]);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!scrollRef.current || !sentinelRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && hasNextPage && !isFetchingNextPage) fetchNextPage();
      },
      { root: scrollRef.current, rootMargin: '200px 0px 200px 0px' },
    );
    obs.observe(sentinelRef.current);
    return () => obs.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isError)
    return <div className="px-2 py-2 text-xs text-red-600">목록을 불러오지 못했습니다.</div>;

  return (
    <div ref={scrollRef} className="h-[56vh] overflow-y-auto">
      <ul className="space-y-1">
        {items.map((it) => (
          <li key={it.id} className="px-2 py-1 rounded hover:bg-gray-50">
            <button className="w-full text-left truncate text-sm text-gray-700" title={it.title}>
              {it.title}
            </button>
          </li>
        ))}
      </ul>
      <div ref={sentinelRef} />
      {(isLoading || isFetchingNextPage) && (
        <div className="py-2 text-center text-xs text-gray-500">불러오는 중…</div>
      )}
      {!hasNextPage && !isLoading && (
        <div className="py-2 text-center text-xs text-gray-400">마지막입니다</div>
      )}
    </div>
  );
}
