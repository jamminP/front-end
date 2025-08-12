import { useEffect, useState } from 'react';

interface MyPost {
  id: number;
  title: string;
  content: string;
  date: string;
}

function MyPostCard({ title, content, date }: MyPost) {
  return (
    <li className="w-[48%] md:w-[32%] h-[130px] text-[#252525] bg-[#ffffff] rounded-2xl mb-[2%] p-[25px] border-[1px] border-[#e9e9e9] transform transition-transform duration-300 hover:translate-y-[-5px]">
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
    <li className="w-[48%] md:w-[32%] h-[130px] bg-[#f1f1f1] rounded-2xl mb-[2%] animate-pulse"></li>
  );
}

export default function MypageContent() {
  //더미데이터
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
      <div className="flex items-center mt-[30px] bg-[#e4ecf3] w-fit p-[20px_25px] rounded-[20px]">
        <div>
          <div className="w-[50px] h-[50px] bg-[#ffffff] rounded-[50%]"></div>
        </div>
        <div className="m-[0_15px] leading-[1.3]">
          <p className="font-bold text-[#1b3043] text-[1.1rem]">홍길동</p>
          <p className="text-[#5b6b7a] text-[.9rem]">abc@aaa.com</p>
        </div>
        <button
          type="button"
          className="p-[10px_15px] bg-[#1b3043] text-[#ffffff] text-[.9rem] rounded-[100px] font-semibold"
        >
          닉네임 수정하기
        </button>
      </div>
      <div className="m-[60px_0]">
        <h3 className="text-[1.5rem] font-light tracking-[-0.05rem] pl-[5px]">작성한 글 보기</h3>
        <ul className="flex items-center flex-wrap gap-[2%] w-full mt-[15px]">
          {loading
            ? Array(dummyMyPosts.length)
                .fill(0)
                .map((_, i) => <SkeletonCard key={`liked-skeleton-${i}`} />)
            : myPosts.map((post) => <MyPostCard key={post.id} {...post} />)}
        </ul>
      </div>
      <div>
        <h3 className="text-[1.5rem] font-light tracking-[-0.05rem] pl-[5px]">찜한 글 보기</h3>
        <ul className="flex items-center flex-wrap gap-[2%] w-full mt-[15px]">
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
