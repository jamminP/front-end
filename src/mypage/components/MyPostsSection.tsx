import { useEffect, useState } from 'react';
import axios from 'axios';
import { MyPostCard, SkeletonCard } from './MyPostCard';

interface MyPost {
  id: number;
  title: string;
  content: string;
  date: string;
  category: 'free' | 'study' | 'share';
}

export default function MyPostsSection() {
  const [myPosts, setMyPosts] = useState<MyPost[]>([]);
  const [category, setCategory] = useState<'all' | 'free' | 'study' | 'share'>('all');
  const [loading, setLoading] = useState(true);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [skeletonCount, setSkeletonCount] = useState(6);

  const fetchPosts = async (
    nextCursor: number | null = null,
    selectedCategory: string = category,
  ) => {
    if (!hasMore && nextCursor) return;

    setLoading(true);
    try {
      const params: any = { limit: 6 };
      if (nextCursor) params.cursor = nextCursor;
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;

      const res = await axios.get('https://backend.evida.site/api/v1/users/myinfo/posts', {
        params,
        withCredentials: true,
      });

      const posts: MyPost[] = res.data.items.map((item: any) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        date: item.created_at,
        category: item.category,
      }));

      setSkeletonCount(res.data.items.length || 6);

      // nextCursor 없으면 새로 덮어쓰기, 있으면 이어붙이기
      setMyPosts((prev) => (nextCursor ? [...prev, ...posts] : posts));
      setCursor(res.data.next_cursor);
      setHasMore(res.data.next_cursor !== 0);
    } catch (err) {
      console.error('게시글을 불러오지 못했습니다', err);
    } finally {
      setLoading(false);
    }
  };

  // 마운트 시 전체 글 로딩
  useEffect(() => {
    fetchPosts(null, 'all');
  }, []);

  return (
    <>
      {/* 작성한 글 */}
      <div className="m-[60px_0]">
        <h3 className="text-[1.5rem] font-light tracking-[-0.05rem] pl-[5px]">작성한 글 보기</h3>

        {/* 카테고리 버튼 */}
        <div className="flex md:gap-3 gap-2 mt-2">
          {['all', 'share', 'free', 'study'].map((cat) => (
            <button
              key={cat}
              className={`md:px-4 md:py-2 px-3 py-2 rounded-full font-medium md:text-[1rem] text-[.9rem] ${
                category === cat ? 'bg-[#1b3043] text-white' : 'bg-gray-200 text-gray-700'
              }`}
              onClick={() => {
                setCategory(cat as any);
                setMyPosts([]);
                setCursor(null);
                setHasMore(true);
                fetchPosts(null, cat as any);
              }}
            >
              {cat === 'all'
                ? '전체'
                : cat === 'share'
                  ? '자료공유'
                  : cat === 'free'
                    ? '자유'
                    : '스터디'}
            </button>
          ))}
        </div>

        {loading && myPosts.length === 0 ? (
          <ul className="flex flex-wrap gap-[2%] mt-[15px]">
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <SkeletonCard key={`my-skeleton-${i}`} />
            ))}
          </ul>
        ) : myPosts.length > 0 ? (
          <>
            <ul className="flex flex-wrap gap-[2%] mt-[15px]">
              {myPosts.map((post) => (
                <MyPostCard key={post.id} {...post} />
              ))}
            </ul>
            {hasMore && (
              <div className="flex justify-center mt-5">
                <button
                  className="px-5 py-2 bg-[#1b3043] text-white rounded-full"
                  onClick={() => fetchPosts(cursor, category)}
                >
                  더보기
                </button>
              </div>
            )}
          </>
        ) : (
          <p className="text-[1.2rem] text-[#999] font-light tracking-[-0.03rem] mt-5 pl-[5px]">
            아직 작성한 글이 없습니다
          </p>
        )}
      </div>
    </>
  );
}
