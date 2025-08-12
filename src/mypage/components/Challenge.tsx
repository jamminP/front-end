import { useState } from 'react';

type ChallengeStatus = '진행 완료' | '진행 중' | '실패';
interface UserChallenge {
  planId: number;
  question: string;
  answer: string;
  startDate: string;
  endDate: string;
  status: ChallengeStatus;
}

//더미데이터
const dummyUserChallenges: UserChallenge[] = [
  {
    planId: 101,
    question: '여기에 질문이 들어오는게 맞나?',
    answer: '답변입니다',
    startDate: '25.08.12',
    endDate: '25.08.15',
    status: '진행 중',
  },
  {
    planId: 102,
    question: '여기에 질문이 들어오는게 맞나?',
    answer: '답변입니다',
    startDate: '25.08.12',
    endDate: '25.08.15',
    status: '진행 중',
  },
  {
    planId: 103,
    question: '여기에 질문이 들어오는게 맞나?',
    answer: '답변입니다',
    startDate: '25.08.12',
    endDate: '25.08.15',
    status: '진행 중',
  },
];

export default function Challenge() {
  const [challenges] = useState<UserChallenge[]>(dummyUserChallenges);
  return (
    <>
      <h2 className="text-3xl md:text-4xl text-[#242424] tracking-[-.05rem] mb-[30px]">챌린지</h2>
      <ul>
        {challenges.map((c) => (
          <li
            key={c.planId}
            className="flex justify-between w-[100%] text-[#252525] bg-[#ffffff] rounded-2xl mb-[2%] p-[25px] border-[1px] border-[#e9e9e9] transform transition-transform duration-300 hover:translate-y-[-5px]"
          >
            <div>
              <h4 className="text-[1.1rem] font-bold tracking-[-.03rem] truncate">{c.question}</h4>
              <p className="text-[.9rem] truncate text-[#797979]">{c.answer}</p>
              <span className="text-[.8rem] text-[#c2c2c2] m-[5px_0] truncate">
                {c.startDate}~{c.endDate}
              </span>
            </div>
            <div>{c.status}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
