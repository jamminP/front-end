import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Challenge() {
  //const userId = useAuthStore((state) => state.user?.id);
  const userId = 30;
  const [myChallenge, setMyChallenge] = useState<StudyPlanData[]>([]);

  type ChallengeStatus = '진행 전' | '진행 중' | '완료';
  interface StudyPlanData {
    id: number;
    user_id: number;
    input_data: string;
    output_data: string;
    is_challenge: boolean;
    start_date: string;
    end_date: string;
    created_at: string;
  }

  const calculateStatus = (plan: StudyPlanData): ChallengeStatus => {
    const today = new Date();
    const start = new Date(plan.start_date);
    const end = new Date(plan.end_date);
    if (today < start) return '진행 전';
    if (today > end) return '완료';
    return '진행 중';
  };

  const fetchChallenge = async () => {
    try {
      const res = await axios.get(`https://backend.evida.site/api/v1/ai/study_plan/`, {
        withCredentials: true,
        params: {
          user_id: userId,
          limit: 10,
          offset: 0,
        },
      });
      const challenges: StudyPlanData[] = res.data.data.study_plans
        .filter((plan: any) => plan.is_challenge)
        .map((plan: any) => {
          return {
            id: plan.id,
            user_id: plan.user_id,
            input_data: plan.input_data,
            output_data: plan.output_data,
            start_date: plan.start_date,
            end_date: plan.end_date,
            is_challenge: plan.is_challenge,
            created_at: plan.created_at,
          };
        });

      setMyChallenge(challenges);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchChallenge();
  }, []);

  return (
    <>
      <h2 className="text-3xl md:text-4xl text-[#242424] tracking-[-.05rem] mb-[30px]">챌린지</h2>
      {myChallenge.length === 0 ? (
        <>
          <p className="text-[1.2rem] text-[#999] font-light tracking-[-0.03rem] mt-5 pl-[5px]">
            등록된 챌린지가 없습니다.
          </p>
        </>
      ) : (
        <>
          <ul>
            {myChallenge.map((c) => {
              const status = calculateStatus(c);
              return (
                <li
                  key={c.id}
                  className="flex justify-between md:items-center flex-col md:flex-row w-[100%] text-[#252525] bg-[#ffffff] rounded-2xl mb-[5%] md:mb-[2%] p-[25px] border-[1px] border-[#e9e9e9] transform transition-transform duration-300 hover:translate-y-[-5px]"
                >
                  <div className="w-full md:w-[80%]">
                    <h4 className="text-[1.1rem] font-bold tracking-[-.03rem] leading-[1.3]">
                      {c.input_data}
                    </h4>
                    <p className="text-[.9rem] text-[#797979] m-[10px_0] truncate">
                      {c.output_data}
                    </p>
                    <span className="text-[.8rem] text-[#c2c2c2]">
                      {c.start_date}~{c.end_date}
                    </span>
                  </div>
                  <div
                    className={`flex justify-center items-center text-[.9rem] mt-[15px] md:mt-[0] p-[3px_10px] md:p-[5px] w-fit md:w-[64px] md:h-[64px] rounded-4xl text-[#ffffff] ${status === '진행 중' ? 'bg-[#f1513c]' : status === '완료' ? 'bg-[#723932]' : 'bg-[#1b3043]'}`}
                  >
                    {status}
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
