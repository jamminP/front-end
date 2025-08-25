import { useEffect, useState } from 'react';

interface Applicant {
  id: number;
  user_id: number;
  output_data: string;
  start_date: string;
  end_date: string;
  status: 'approved' | 'rejected' | 'pending';
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
    status: 'approved',
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
    status: 'rejected',
  },
];

export default function MyApplications() {
  const [applicants, setApplicants] = useState<Applicant[]>([]);

  useEffect(() => {
    //fetchApplicantList();
    setApplicants(dummyApplicants);
  }, []);

  return (
    <>
      <h2 className="text-3xl md:text-4xl text-[#242424] tracking-[-.05rem] mb-[30px]">
        스터디 신청 현황
      </h2>
      {applicants.length === 0 ? (
        <>
          <p className="text-[1.2rem] text-[#999] font-light tracking-[-0.03rem] mt-5 pl-[5px]">
            신청한 스터디가 없습니다.
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
                  <div
                    className={`flex justify-center items-center text-[.9rem] mt-[15px] md:mt-[0] p-[3px_10px] md:p-[5px] w-fit md:w-[64px] md:h-[64px] rounded-4xl text-[#ffffff] 
    ${
      c.status === 'approved'
        ? 'bg-[#f1513c]'
        : c.status === 'rejected'
          ? 'bg-[#1b3043]'
          : 'bg-[#9e9e9e]'
    }`}
                  >
                    {c.status === 'approved' ? '승인' : c.status === 'rejected' ? '거절' : '대기중'}
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
