import { useEffect, useMemo, useRef, useState } from 'react';
import { MdChatBubbleOutline } from 'react-icons/md';

type ChatSummary = { id: string; title: string };

export default function ChatList({ collapsed }: { collapsed: boolean }) {
  if (collapsed) {
    return null;
  }

  const [items, setItems] = useState<ChatSummary[]>([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchChats = async (p: number): Promise<{ data: ChatSummary[]; hasMore: boolean }> => {
    const PAGE_SIZE = 20;
    const TOTAL = 100;
    await new Promise((r) => setTimeout(r, 300));
    const start = p * PAGE_SIZE;
    const end = Math.min(start + PAGE_SIZE, TOTAL);
    const data = Array.from({ length: Math.max(0, end - start) }).map((_, i) => {
      const n = start + i + 1;
      return {
        id: `chat-${n}`,
        title: `2025/08/0${(n % 9) + 1} 15:${(n % 59).toString().padStart(2, '0')} - 대화 ${n}`,
      };
    });
    return { data, hasMore: end < TOTAL };
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      const res = await fetchChats(0);
      setItems(res.data);
      setHasMore(res.hasMore);
      setLoading(false);
      setPage(1);
    })();
  }, []);

  useEffect(() => {
    if (!sentinelRef.current || !scrollRef.current) return;
    const rootEl = scrollRef.current;
    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          setLoading(true);
          const res = await fetchChats(page);
          setItems((prev) => [...prev, ...res.data]);
          setHasMore(res.hasMore);
          setLoading(false);
          setPage((prev) => prev + 1);
        }
      },
      { root: rootEl, rootMargin: '200px 0px 200px 0px', threshold: 0 },
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [page, hasMore, loading]);

  const content = useMemo(
    () =>
      items.map((item) =>
        collapsed ? (
          <li key={item.id} className="flex justify-center">
            <button
              className="my-1 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              title={item.title}
              aria-label={item.title}
            >
              <MdChatBubbleOutline size={14} />
            </button>
          </li>
        ) : (
          <li
            key={item.id}
            className="group flex items-center justify-between rounded px-2 py-1 hover:bg-gray-50"
          >
            <button className="truncate text-sm text-gray-700 text-left w-full" title={item.title}>
              {item.title}
            </button>
          </li>
        ),
      ),
    [items, collapsed],
  );

  return (
    <div
      ref={scrollRef}
      className={collapsed ? 'h-[40vh] overflow-y-auto' : 'h-[44vh] overflow-y-auto'}
    >
      <ul className={collapsed ? 'space-y-0.5' : 'space-y-1'}>{content}</ul>
      <div ref={sentinelRef} />
      {loading && !collapsed && (
        <div className="py-2 text-center text-xs text-gray-500">불러오는 중…</div>
      )}
      {!hasMore && !collapsed && (
        <div className="py-2 text-center text-xs text-gray-400">마지막입니다</div>
      )}
    </div>
  );
}
