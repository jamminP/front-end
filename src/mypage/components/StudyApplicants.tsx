import axios from 'axios';
import { useEffect, useState } from 'react';

interface Applicant {
  application_id: number;
  applicant_id: number;
  applicant_nickname?: string;
  status: 'pending' | 'approved' | 'rejected';
  applied_at: string;
}
interface ApplicantList {
  count: number;
  next_cursor: number;
  items: Applicant[];
}

export default function StudyApplicants({ postId }: { postId: number }) {
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchApplicantList = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await axios.get<ApplicantList>(
        `https://backend.evida.site/api/v1/users/myinfo/${postId}/applications?limit=5${
          nextCursor ? `&cursor=${nextCursor}` : ''
        }`,
        { withCredentials: true },
      );

      setApplicants((prev) => [...prev, ...res.data.items]);
      setNextCursor(res.data.next_cursor || null);
      if (res.data.next_cursor === 0)
        setHasMore(res.data.next_cursor != null && res.data.next_cursor !== 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (
    applicationId: number,
    applicantId: number,
    action: 'approve' | 'reject',
  ) => {
    try {
      await axios.post(
        `https://backend.evida.site/api/v1/community/study-application/${applicationId}/${action}?user=${applicantId}`,
        {},
        { withCredentials: true },
      );
      setApplicants((prev) => prev.filter((a) => a.application_id !== applicationId));
    } catch (err) {
      console.error(err);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

  useEffect(() => {
    fetchApplicantList();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        fetchApplicantList();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [nextCursor, loading, hasMore]);

  useEffect(() => {
    setApplicants([]);
    setNextCursor(null);
    setHasMore(true);
    fetchApplicantList();
  }, [postId]);

  return (
    <>
      <h2 className="text-3xl md:text-4xl text-[#242424] tracking-[-.05rem] mb-[30px]">
        신청자 목록
      </h2>
      {applicants.length === 0 ? (
        <>
          <p className="text-[1.2rem] text-[#999] font-light tracking-[-0.03rem] mt-5 pl-[5px]">
            등록된 신청이 없습니다.
          </p>
        </>
      ) : (
        <>
          <ul>
            {applicants.map((c) => {
              return (
                <li
                  key={c.application_id}
                  className="flex justify-between md:items-center flex-col md:flex-row w-[100%] text-[#252525] bg-[#ffffff] rounded-2xl mb-[5%] md:mb-[2%] p-[25px] border-[1px] border-[#e9e9e9] transform transition-transform duration-300 hover:translate-y-[-5px]"
                >
                  <div className="w-full md:w-[80%]">
                    <h4 className="text-[1.1rem] font-bold tracking-[-.03rem] leading-[1.3]">
                      {c.applicant_nickname ?? '알 수 없음'}
                    </h4>
                    <p className="text-[.9rem] text-[#797979] m-[10px_0] truncate">
                      신청일 : {new Date(c.applied_at).toLocaleDateString()}
                    </p>
                    <span className="text-[.8rem] text-[#c2c2c2]">상태 : {c.status}</span>
                  </div>
                  {c.status === 'pending' && (
                    <div className="flex">
                      <button
                        onClick={() => handleAction(c.application_id, c.applicant_id, 'approve')}
                        className="flex justify-center items-center text-[.9rem] mr-[5px] mt-[15px] md:mt-[0] p-[3px_10px] md:p-[5px] w-fit md:w-[60px] md:h-[40px] rounded-4xl text-[#ffffff] bg-[#1b3043] cursor-pointer"
                      >
                        승인
                      </button>
                      <button
                        onClick={() => handleAction(c.application_id, c.applicant_id, 'reject')}
                        className="flex justify-center items-center text-[.9rem] mt-[15px] md:mt-[0] p-[3px_10px] md:p-[5px] w-fit md:w-[60px] md:h-[40px] rounded-4xl text-[#364153] bg-[#ebe6e7] cursor-pointer"
                      >
                        거절
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {loading && <p className="text-gray-500 mt-2">로딩 중...</p>}
          {!hasMore && <p className="text-gray-500 mt-2">더 이상 신청자가 없습니다.</p>}
        </>
      )}
    </>
  );
}
