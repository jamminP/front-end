import { useEffect, useState } from 'react';

interface MyPost {
  id: number;
  title: string;
  content: string;
  date: string;
}

function MyPostCard({ title, content, date }: MyPost) {
  return (
    <li className="w-[48%] md:w-[24%] h-[170px] bg-[#d8d8d8] rounded-2xl mb-[1.2%] md:mb-0">
      <h4>{title}</h4>
      <p>{content}</p>
      <p>{new Date(date).toLocaleDateString()}</p>
    </li>
  );
}
function SkeletonCard() {
  return (
    <li className="w-[48%] md:w-[24%] h-[170px] bg-[#d8d8d8] rounded-2xl mb-[1.2%] md:mb-0 animate-pulse"></li>
  );
}

export default function MypageContent() {
  //더미데이터
  const dummyMyPosts: MyPost[] = [
    { id: 1, title: '첫 번째 글', content: '내용', date: '2025-08-11' },
    { id: 2, title: '두 번째 글', content: '내용', date: '2025-08-11' },
    { id: 3, title: '세 번째 글', content: '내용', date: '2025-08-11' },
    { id: 4, title: '네 번째 글', content: '내용', date: '2025-08-11' },
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
      <div className="flex mt-[30px]">
        <div>
          <div className="w-[50px] h-[50px] bg-[#d8d8d8] rounded-[50%] mr-[10px]"></div>
        </div>
        <div className="text-[#555555]">
          <p>홍길동</p>
          <p>abc@aaa.com</p>
          <button
            type="button"
            className="p-[10px_15px] bg-[#e4ecf3] mt-[10px] text-[.9rem] font-semibold"
          >
            닉네임 수정하기
          </button>
        </div>
      </div>
      <div className="m-[50px_0]">
        <h3 className="text-[#242424]">작성한 글 보기</h3>
        <ul className="flex items-center flex-wrap gap-[1.2%] w-full mt-[15px]">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => <SkeletonCard key={`liked-skeleton-${i}`} />)
            : myPosts.map((post) => <MyPostCard key={post.id} {...post} />)}
        </ul>
      </div>
      <div>
        <h3 className="text-[#242424]">좋아요</h3>
        <ul className="flex items-center flex-wrap gap-[1.2%] w-full mt-[15px]">
          {loading
            ? Array(4)
                .fill(0)
                .map((_, i) => <SkeletonCard key={`liked-skeleton-${i}`} />)
            : likedPosts.map((post) => <MyPostCard key={post.id} {...post} />)}
        </ul>
      </div>
    </>
  );
}
