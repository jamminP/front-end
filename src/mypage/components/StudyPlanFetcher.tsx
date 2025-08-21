import { useEffect, useState } from 'react';
import axios from 'axios';

interface WeeklyPlan {
  week: number;
  title: string;
  topics: string[];
  goals: string[];
  daily_goals?: string[];
  challenge_tasks?: string[];
  checkpoints?: string[];
  estimated_hours?: number;
  intensity?: string;
}

interface StudyPlanData {
  id: number;
  user_id: number;
  input_data: string;
  output_data: string; // JSON string
  is_challenge: boolean;
  start_date: string;
  end_date: string;
  created_at: string;
}

export default function StudyPlanFetcher() {
  const [studyPlans, setStudyPlans] = useState<StudyPlanData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const userId = 17; // 테스트용 user_id
  const pollInterval = 5000; // 5초마다 자동 폴링

  const fetchStudyPlans = async () => {
    try {
      const response = await axios.get(`https://backend.evida.site/api/v1/ai/study_plan/`, {
        params: {
          user_id: userId,
          limit: 10,
          offset: 0,
        },
      });

      if (response.data.success) {
        setStudyPlans(response.data.data.study_plans);
        setError(null);
      } else {
        setError('학습 계획을 가져오는 데 실패했습니다.');
      }
    } catch (err: any) {
      console.error('study_plan fetch error:', err);
      setError(err.message || '알 수 없는 에러');
    } finally {
      setLoading(false);
    }
  };

  // 페이지 로드 시 및 interval 폴링
  useEffect(() => {
    fetchStudyPlans(); // 처음 로드 시

    const intervalId = setInterval(fetchStudyPlans, pollInterval);

    return () => clearInterval(intervalId); // 언마운트 시 폴링 종료
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;
  if (studyPlans.length === 0) return <div>학습 계획이 없습니다.</div>;

  return (
    <div>
      {studyPlans.map((plan) => {
        const output = JSON.parse(plan.output_data); // string → JSON
        return (
          <div key={plan.id} className="border p-4 mb-4 rounded shadow">
            <h2 className="text-lg font-bold">{output.title}</h2>
            <p>
              기간: {new Date(plan.start_date).toLocaleDateString()} ~{' '}
              {new Date(plan.end_date).toLocaleDateString()}
            </p>
            <p>난이도: {output.difficulty}</p>
            <p>총 주 수: {output.total_weeks}</p>
            <p>챌린지 모드: {plan.is_challenge ? 'O' : 'X'}</p>

            <div className="mt-2">
              {output.weekly_plans?.map((week: WeeklyPlan) => (
                <div key={week.week} className="border-t mt-2 pt-2">
                  <h3 className="font-semibold">
                    Week {week.week}: {week.title}
                  </h3>
                  <ul className="list-disc list-inside">
                    {week.topics.map((topic, idx) => (
                      <li key={idx}>{topic}</li>
                    ))}
                  </ul>
                  <ul className="list-decimal list-inside ml-4 mt-1">
                    {week.goals.map((goal, idx) => (
                      <li key={idx}>{goal}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
