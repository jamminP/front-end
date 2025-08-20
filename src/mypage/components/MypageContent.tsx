import useAuthStore from '@src/store/authStore';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface MyPost {
  id: number;
  title: string;
  content: string;
  date: string;
}

function MyPostCard({ id, title, content, date }: MyPost) {
  const navigate = useNavigate();
  return (
    <li
      className="w-[48%] md:w-[32%] h-[130px] text-[#252525] bg-[#ffffff] rounded-2xl mb-[5%] md:mb-[2%] p-[20px] md:p-[25px] border-[1px] border-[#e9e9e9] transform transition-transform duration-300 hover:translate-y-[-5px]"
      onClick={() => navigate(`/community/post/${id}`)}
    >
      <h4 className="text-[1.1rem] font-bold tracking-[-.03rem] truncate">{title}</h4>
      <p className="text-[.8rem] text-[#c2c2c2] m-[5px_0] truncate">
        {new Date(date).toLocaleDateString()}
      </p>
      <p className="text-[.9rem] truncate text-[#797979]">{content}</p>
    </li>
  );
}

function SkeletonCard() {
  return (
    <li className="w-[48%] md:w-[32%] h-[130px] bg-[#f1f1f1] rounded-2xl mb-[5%] md:mb-[2%] animate-pulse"></li>
  );
}

export default function MypageContent() {
  const [nicknameInput, setNicknameInput] = useState('');
  const [nicknameModal, setNicknameModal] = useState(false);
  const user = useAuthStore((state) => state.user);
  const setAuthData = useAuthStore((state) => state.setAuthData);

  // 작성한 글
  const [myPosts, setMyPosts] = useState<MyPost[]>([]);
  const [myPostsLoading, setMyPostsLoading] = useState(true);
  const [cursor, setCursor] = useState<number | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // 카테고리
  const [category, setCategory] = useState<'all' | 'free' | 'study' | 'share'>('all');

  // 찜한 글
  const [likedPosts, setLikedPosts] = useState<MyPost[]>([]);
  const [likedPostsLoading, setLikedPostsLoading] = useState(true);

  // 닉네임 수정 모달
  const openNicknameModal = () => {
    setNicknameInput(user?.nickname || '');
    setNicknameModal(true);
  };
  const closeNicknameModal = () => setNicknameModal(false);

  const handleNicknameUpdate = async () => {
    if (!nicknameInput.trim()) {
      alert('닉네임을 입력해주세요');
      return;
    }
    try {
      const res = await axios.patch(
        'https://backend.evida.site/api/v1/users/myinfo',
        { nickname: nicknameInput },
        { withCredentials: true },
      );
      if (user) {
        setAuthData({
          ...user,
          nickname: res.data.new_nickname,
        });
        alert('수정되었습니다');
      }
      closeNicknameModal();
    } catch (err) {
      console.error('닉네임 변경 실패', err);
    }
  };

  // 작성한 글 불러오기
  const fetchPosts = async (nextCursor: number | null = null, selectedCategory?: string) => {
    if (!hasMore && nextCursor) return;
    setMyPostsLoading(true);
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
      }));

      setMyPosts((prev) => [...prev, ...posts]);
      setCursor(res.data.next_cursor);
      setHasMore(res.data.next_cursor !== 0);
    } catch (err) {
      console.error('게시글을 불러오지 못했습니다', err);
    } finally {
      setMyPostsLoading(false);
    }
  };

  // 찜한 글 (더미)
  const fetchLikedPosts = async () => {
    try {
      const dummyLikedPosts: MyPost[] = [
        { id: 101, title: '첫 번째 글', content: '내용', date: '2025-08-11' },
        { id: 102, title: '두 번째 글', content: '내용', date: '2025-08-11' },
        { id: 103, title: '세 번째 글', content: '내용', date: '2025-08-11' },
        { id: 104, title: '네 번째 글', content: '내용', date: '2025-08-11' },
      ];
      setTimeout(() => {
        setLikedPosts(dummyLikedPosts);
        setLikedPostsLoading(false);
      }, 1000);
    } catch (err) {
      console.error('찜한 글 불러오기 실패', err);
      setLikedPostsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchLikedPosts();
  }, []);

  return (
    <>
      <h2 className="text-3xl md:text-4xl text-[#242424] tracking-[-.05rem]">마이페이지</h2>

      {/* 유저 정보 */}
      <div className="flex items-center justify-between md:justify-items-start mt-[30px] bg-[#e4ecf3] w-full md:w-fit p-[15px_20px] md:p-[20px_25px] rounded-[20px]">
        <div className="flex items-center">
          <div className="w-[50px] h-[50px] bg-[#ffffff] rounded-[50%]"></div>
          <div className="m-[0_15px] leading-[1.3]">
            <p className="font-bold text-[#1b3043] text-[1.1rem]">{user?.nickname}</p>
            <p className="text-[#5b6b7a] text-[.9rem]">{user?.email}</p>
          </div>
        </div>

        <button
          type="button"
          className="p-[6px_12px] md:p-[10px_15px] bg-[#1b3043] text-[#ffffff] text-[.9rem] rounded-[100px] font-semibold cursor-pointer"
          onClick={openNicknameModal}
        >
          닉네임 수정
        </button>

        {nicknameModal && (
          <div className="modal-overlay" onClick={closeNicknameModal}>
            <div
              className="relative w-full max-w-[380px] bg-[#ffffff] rounded-[20px] p-[30px]"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[1.1rem] text-[#313131] font-bold mb-[10px]">닉네임 수정하기</h2>
              <div className="md:flex items-center justify-between">
                <input
                  type="text"
                  maxLength={10}
                  value={nicknameInput}
                  onChange={(e) => setNicknameInput(e.target.value)}
                  className="w-full md:w-[82%] border-[1px] border-[#d1d1d1] rounded-[10px] p-[10px] mr-[10px] mb-[10px] md:mb-[0px]"
                />
                <div className="modal-button">
                  <button onClick={handleNicknameUpdate}>수정</button>
                </div>
              </div>

              <button className="modal-close" onClick={closeNicknameModal}>
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        )}
      </div>

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

        {myPostsLoading && myPosts.length === 0 ? (
          <ul className="flex flex-wrap gap-[2%] mt-[15px]">
            {Array(6)
              .fill(0)
              .map((_, i) => (
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

      {/* 찜한 글 */}
      <div>
        <h3 className="text-[1.5rem] font-light tracking-[-0.05rem] pl-[5px]">찜한 글 보기</h3>
        {likedPostsLoading ? (
          <ul className="flex flex-wrap gap-[2%] mt-[15px]">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <SkeletonCard key={`liked-skeleton-${i}`} />
              ))}
          </ul>
        ) : (
          <ul className="flex flex-wrap gap-[2%] mt-[15px]">
            {likedPosts.map((post) => (
              <MyPostCard key={post.id} {...post} />
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
