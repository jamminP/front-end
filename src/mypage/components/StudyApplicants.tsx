import useAuthStore from '@src/store/authStore';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface Applicant {
  id: number;
  user_id: number;
  output_data: string;
  start_date: string;
  end_date: string;
}

//더미데이터
const dummyApplicants: Applicant[] = [
  {
    id: 1,
    user_id: 101,
    output_data: JSON.stringify({
      title: '리액트 스터디 모집',
      description: '초보자 환영! 매주 토요일 온라인 진행',
    }),
    start_date: '2025-09-01',
    end_date: '2025-09-30',
  },
  {
    id: 2,
    user_id: 102,
    output_data: JSON.stringify({
      title: '알고리즘 스터디',
      description: '백준 골드 목표, 디스코드 진행',
    }),
    start_date: '2025-09-05',
    end_date: '2025-10-05',
  },
];

export default function StudyApplicants() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  // const fetchApplicantList = async () => {
  //   try {
  //     const res = await axios.get(`/api/v1/community/post/주소바꿔야됑`, {
  //       withCredentials: true,
  //     });
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  useEffect(() => {
    //fetchApplicantList();
    setApplicants(dummyApplicants);
  }, []);

  // 무한스크롤: 스크롤 이벤트 감지 (나중에 API 연결 시 교체)
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
        document.documentElement.scrollHeight
      ) {
        // 👇 여기서 다음 5개 API 호출 예정
        console.log('스크롤 바닥 → 다음 데이터 가져오기');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAction = async (
    applicationId: number,
    userId: number,
    action: 'approve' | 'reject',
  ) => {
    try {
      await axios.post(
        `/api/v1/community/study-application/${applicationId}/${action}?user=${userId}`,
        {},
        { withCredentials: true },
      );

      // 성공 시 목록에서 제거
      setApplicants((prev) => prev.filter((a) => a.id !== applicationId));
    } catch (err) {
      console.error(err);
      alert('처리 중 오류가 발생했습니다.');
    }
  };

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
              const parsedOutput = (() => {
                try {
                  return JSON.parse(c.output_data);
                } catch {
                  return '데이터 오류';
                }
              })();
              return (
                <li
                  key={c.id}
                  className="flex justify-between md:items-center flex-col md:flex-row w-[100%] text-[#252525] bg-[#ffffff] rounded-2xl mb-[5%] md:mb-[2%] p-[25px] border-[1px] border-[#e9e9e9] transform transition-transform duration-300 hover:translate-y-[-5px]"
                >
                  <div className="w-full md:w-[80%]">
                    <h4 className="text-[1.1rem] font-bold tracking-[-.03rem] leading-[1.3]">
                      {parsedOutput.title}
                    </h4>
                    <p className="text-[.9rem] text-[#797979] m-[10px_0] truncate">
                      {parsedOutput.description}
                    </p>
                    <span className="text-[.8rem] text-[#c2c2c2]">
                      {c.start_date.slice(0, 10)}~{c.end_date.slice(0, 10)}
                    </span>
                  </div>
                  <div>
                    <button
                      onClick={() => handleAction(c.id, c.user_id, 'approve')}
                      className="flex justify-center items-center text-[.9rem] mt-[15px] md:mt-[0] p-[3px_10px] md:p-[5px] w-fit md:w-[64px] md:h-[64px] rounded-4xl text-[#ffffff] bg-[#f1513c]"
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleAction(c.id, c.user_id, 'reject')}
                      className="flex justify-center items-center text-[.9rem] mt-[15px] md:mt-[0] p-[3px_10px] md:p-[5px] w-fit md:w-[64px] md:h-[64px] rounded-4xl text-[#ffffff] bg-[#1b3043]"
                    >
                      거절
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
