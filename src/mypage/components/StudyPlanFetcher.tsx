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

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
}

interface StudyPlanFetcherProps {
  onEventsGenerated: (events: Event[]) => void;
}

export default function StudyPlanFetcher({ onEventsGenerated }: StudyPlanFetcherProps) {
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

        // 이벤트 생성
        const events: Event[] = [];
        response.data.data.study_plans.forEach((plan: StudyPlanData) => {
          const output = JSON.parse(plan.output_data);

          output.weekly_plans?.forEach((week: WeeklyPlan) => {
            const weekDates = calculateWeeklyDates(plan.start_date, week.week);
            weekDates.forEach((date) => {
              events.push({
                id: `${plan.id}-${week.week}-${date}`,
                title: week.title,
                description: week.goals.join('\n'),
                date,
              });
            });
          });
        });

        onEventsGenerated(events);
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
    return () => clearInterval(intervalId);
  }, []);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러 발생: {error}</div>;
  if (studyPlans.length === 0) return <div>학습 계획이 없습니다.</div>;

  return null; // 이벤트는 캘린더로 바로 전달되므로 화면 렌더링은 없음
}

// startDate 기준으로 weekNumber 주차 날짜 배열 생성 (YYYY-MM-DD)
const calculateWeeklyDates = (startDate: string, weekNumber: number): string[] => {
  const start = new Date(startDate);
  const dates: string[] = [];

  // 각 주차는 7일 단위
  const weekStart = new Date(start);
  weekStart.setDate(start.getDate() + (weekNumber - 1) * 7);

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    dates.push(
      `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}-${('0' + d.getDate()).slice(-2)}`,
    );
  }

  return dates;
};
