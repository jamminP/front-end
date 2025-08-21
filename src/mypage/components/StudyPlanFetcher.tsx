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

interface StudyPlanFetcherProps {
  onEventsGenerated: (
    events: { id: string; title: string; description: string; date: string }[],
  ) => void;
}

export default function StudyPlanFetcher({ onEventsGenerated }: StudyPlanFetcherProps) {
  const [studyPlans, setStudyPlans] = useState<StudyPlanData[]>([]);
  const [fetched, setFetched] = useState(false); // 이미 한 번 추가했는지 체크

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

        if (!fetched) {
          // 이벤트 한 번만 추가
          const allEvents: { id: string; title: string; description: string; date: string }[] = [];
          response.data.data.study_plans.forEach((plan: StudyPlanData) => {
            const output = JSON.parse(plan.output_data);
            const startDate = new Date(plan.start_date);
            const totalWeeks = output.total_weeks || 0;
            const weeklyPlans: WeeklyPlan[] = output.weekly_plans || [];

            weeklyPlans.forEach((week) => {
              week.daily_goals?.forEach((goal, idx) => {
                const eventDate = new Date(startDate);
                eventDate.setDate(eventDate.getDate() + (week.week - 1) * 7 + idx);
                allEvents.push({
                  id: `${plan.id}-${week.week}-${idx}`,
                  title: goal,
                  description: `Week ${week.week}: ${week.title}`,
                  date: eventDate.toISOString().slice(0, 10),
                });
              });
            });
          });

          onEventsGenerated(allEvents);
          setFetched(true);
        }
      }
    } catch (err: any) {
      console.error('study_plan fetch error:', err);
    }
  };

  useEffect(() => {
    fetchStudyPlans();
    const intervalId = setInterval(fetchStudyPlans, pollInterval);
    return () => clearInterval(intervalId);
  }, []);

  // UI는 캘린더가 담당하므로 null 반환
  return null;
}
