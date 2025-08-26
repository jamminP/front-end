import useAuthStore from '@src/store/authStore';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';

interface Applicant {
  application_id: number;
  applicant_id: number;
  applicant_nickname?: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
  post_title?: string;
  post_id: number;
}

interface ApplicantList {
  count: number;
  next_cursor: number;
  items: Applicant[];
}

interface Post {
  id: number;
  category: string;
  title: string;
  author_id: number;
}

export default function StudyApplicants() {
  const user = useAuthStore((state) => state.user);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [myPosts, setMyPosts] = useState<Post[]>([]);

  // 내 글 가져오기
  const fetchMyPosts = useCallback(async () => {
    if (!user) return;
    try {
      const res = await axios.get<{ items: Post[] }>(
        `https://backend.evida.site/api/v1/community/post/list`,
      );
      const posts = res.data.items.filter((p) => p.author_id === user.id && p.category === 'study');
      setMyPosts(posts);
    } catch (err) {
      console.error('내 글 조회 실패', err);
    }
  }, [user]);

  // 신청자 리스트 가져오기 (페이징)
  const fetchApplicants = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      let newItems: Applicant[] = [];

      for (const post of myPosts) {
        const res = await axios.get<ApplicantList>(
          `https://backend.evida.site/api/v1/users/myinfo/${post.id}/applications?limit=5${
            nextCursor ? `&cursor=${nextCursor}` : ''
          }`,
          { withCredentials: true },
        );

        const itemsWithTitle = res.data.items.map((a) => ({
          ...a,
          post_title: post.title,
          post_id: post.id,
        }));

        newItems = [...newItems, ...itemsWithTitle];

        setNextCursor(res.data.next_cursor || null);
        setHasMore(res.data.next_cursor !== 0);
      }

      // 중복 없이 추가
      setApplicants((prev) => {
        const ids = new Set(prev.map((a) => a.application_id));
        const filteredNew = newItems.filter((a) => !ids.has(a.application_id));
        return [...prev, ...filteredNew];
      });
    } catch (err) {
      console.error('신청자 조회 실패', err);
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  }, [myPosts, nextCursor, hasMore]);

  const handleAction = async (applicationId: number, action: 'approve' | 'reject') => {
    try {
      await axios.post(
        `https://backend.evida.site/api/v1/community/study-application/${applicationId}/${action}`,
        {},
        { withCredentials: true },
      );
      alert('처리되었습니다');
      setApplicants((prev) => prev.filter((a) => a.application_id !== applicationId));
    } catch (err) {
      console.error(err);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  // 초기 로딩
  useEffect(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  // 내 글이 준비되면 신청자 가져오기
  useEffect(() => {
    if (myPosts.length) fetchApplicants();
  }, [myPosts, fetchApplicants]);

  // 스크롤 이벤트로 추가 로딩
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        fetchApplicants();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [fetchApplicants]);

  const pendingApplicants = applicants.filter((c) => c.status === 'pending');

  return (
    <>
      <h2 className="text-3xl md:text-4xl text-[#242424] tracking-[-.05rem] mb-[30px]">
        신청자 목록
      </h2>

      {initialLoading ? (
        <p className="text-gray-500 mt-2">로딩 중...</p>
      ) : pendingApplicants.length === 0 ? (
        <p className="text-[1.2rem] text-[#999] font-light tracking-[-0.03rem] mt-5 pl-[5px]">
          등록된 신청이 없습니다.
        </p>
      ) : (
        <ul>
          {pendingApplicants.map((c) => (
            <li
              key={c.application_id}
              className="flex justify-between md:items-center flex-col md:flex-row w-[100%] text-[#252525] bg-[#ffffff] rounded-2xl mb-[5%] md:mb-[2%] p-[25px] border-[1px] border-[#e9e9e9] transform transition-transform duration-300 hover:translate-y-[-5px]"
            >
              <div className="w-full md:w-[80%]">
                <h4 className="text-[1.1rem] font-bold tracking-[-.03rem] leading-[1.3]">
                  신청자 : {c.applicant_nickname ?? '알 수 없음'}
                </h4>
                <p className="text-[.9rem] text-[#797979] m-[10px_0] truncate">
                  신청한 글: {c.post_title}
                </p>
                <p className="text-[.8rem] text-[#c2c2c2]">
                  신청일 : {new Date(c.applied_at).toLocaleDateString()}
                </p>
              </div>

              <div className="flex">
                <button
                  onClick={() => handleAction(c.application_id, 'approve')}
                  className="flex justify-center items-center text-[.9rem] mr-[5px] mt-[15px] md:mt-[0] p-[3px_10px] md:p-[5px] w-fit md:w-[60px] md:h-[40px] rounded-4xl text-[#ffffff] bg-[#1b3043] cursor-pointer"
                >
                  승인
                </button>
                <button
                  onClick={() => handleAction(c.application_id, 'reject')}
                  className="flex justify-center items-center text-[.9rem] mt-[15px] md:mt-[0] p-[3px_10px] md:p-[5px] w-fit md:w-[60px] md:h-[40px] rounded-4xl text-[#364153] bg-[#ebe6e7] cursor-pointer"
                >
                  거절
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!hasMore && pendingApplicants.length > 0 && (
        <p className="text-gray-500 mt-2">더 이상 신청자가 없습니다.</p>
      )}
    </>
  );
}
