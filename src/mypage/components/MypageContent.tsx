import useAuthStore from '@src/store/authStore';
import { useEffect, useState } from 'react';
import axios from 'axios';

interface MyPost {
  id: number;
  title: string;
  content: string;
  date: string;
}

function MyPostCard({ title, content, date }: MyPost) {
  return (
    <li className="w-[48%] md:w-[32%] h-[130px] text-[#252525] bg-[#ffffff] rounded-2xl mb-[5%] md:mb-[2%] p-[20px] md:p-[25px] border-[1px] border-[#e9e9e9] transform transition-transform duration-300 hover:translate-y-[-5px]">
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
  const openNicknameModal = () => {
    setNicknameInput(user?.nickname || '');
    setNicknameModal(true);
  };
  const closeNicknameModal = () => {
    setNicknameModal(false);
  };

  //닉네임 수정
  const handleNicknameUpdate = async () => {
    if (!nicknameInput.trim()) {
      alert('닉네임을 입력해주세요');
      return;
    } //공백 방지
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

  //게시글 불러오기
  const fetchPosts = async (cursor?: number) => {
    try {
      const params: any = { limit: 6 };
      if (cursor) params.cursor = cursor;
      const res = await axios.get('https://backend.evida.site/api/v1/users/myinfo/posts', {
        params,
        withCredentials: true,
      });
      console.log(res.data);
      return res.data;
    } catch (err) {
      console.error('게시글을 불러오지 못했습니다');
    }
  };
  useEffect(() => {
    fetchPosts();
  }, []);

  const dummyMyPosts: MyPost[] = [
    {
      id: 1,
      title: '첫 번째 글',
      content:
        '내용테스트내용테스트내용테스트내용테스트내용테스트내용테스트내용테스트내용테스트내용테스트내용테스트내용테스트내용테스트내용테스트내용테스트내용테스트내용테스트내용테스트',
      date: '2025-08-11',
    },
    { id: 2, title: '오늘 저녁은 순대먹을거야', content: '내용', date: '2025-08-11' },
    { id: 3, title: '세 번째 글', content: '내용', date: '2025-08-11' },
    {
      id: 4,
      title: '여진족(女眞族)은 중국 동북부와 만주 일대에서 기원한 툰구스계 민족이에요',
      content: '현재의 중국 헤이룽장성·지린성, 러시아 연해주 일대가 그들의 주 거주지였죠.',
      date: '2025-08-11',
    },
    { id: 5, title: '다섯 번째 글', content: '내용', date: '2025-08-11' },
    { id: 6, title: '여섯 번째 글', content: '내용', date: '2025-08-11' },
  ];
  const dummyLikedPosts: MyPost[] = [
    { id: 101, title: '첫 번째 글', content: '내용', date: '2025-08-11' },
    { id: 102, title: '두 번째 글', content: '내용', date: '2025-08-11' },
    { id: 103, title: '세 번째 글', content: '내용', date: '2025-08-11' },
    { id: 104, title: '네 번째 글', content: '내용', date: '2025-08-11' },
  ];

  const [myPosts, setMyPosts] = useState<MyPost[]>([]);
  const [likedPosts, setLikedPosts] = useState<MyPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => {
      setMyPosts(dummyMyPosts);
      setLikedPosts(dummyLikedPosts);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <>
      <h2 className="text-3xl md:text-4xl text-[#242424] tracking-[-.05rem]">마이페이지</h2>
      <div className="flex items-center justify-between md:justify-items-start mt-[30px] bg-[#e4ecf3] w-full md:w-fit p-[15px_20px] md:p-[20px_25px] rounded-[20px]">
        <div className="flex items-center">
          <div>
            <div className="w-[50px] h-[50px] bg-[#ffffff] rounded-[50%]"></div>
          </div>
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
                {' '}
                <span></span>
                <span></span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="m-[60px_0]">
        <h3 className="text-[1.5rem] font-light tracking-[-0.05rem] pl-[5px]">작성한 글 보기</h3>
        <ul className="flex items-center justify-between md:justify-start gap-[2%] flex-wrap w-full mt-[15px]">
          {loading
            ? Array(dummyMyPosts.length)
                .fill(0)
                .map((_, i) => <SkeletonCard key={`liked-skeleton-${i}`} />)
            : myPosts.map((post) => <MyPostCard key={post.id} {...post} />)}
        </ul>
      </div>
      <div>
        <h3 className="text-[1.5rem] font-light tracking-[-0.05rem] pl-[5px]">찜한 글 보기</h3>
        <ul className="flex items-center flex-wrap justify-between md:justify-start gap-[2%] w-full mt-[15px]">
          {loading
            ? Array(dummyLikedPosts.length)
                .fill(0)
                .map((_, i) => <SkeletonCard key={`liked-skeleton-${i}`} />)
            : likedPosts.map((post) => <MyPostCard key={post.id} {...post} />)}
        </ul>
      </div>
    </>
  );
}
