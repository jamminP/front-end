import { useEffect, useState } from 'react';
import axios from 'axios';

interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
}

interface StudyPlanFetcherProps {
  planId: string; // AI 채팅 응답으로 받은 plan_id
  onEventsGenerated: (events: Event[]) => void;
}

export default function StudyPlanFetcher({ planId, onEventsGenerated }: StudyPlanFetcherProps) {
  const [status, setStatus] = useState<string>('processing');

  useEffect(() => {
    if (!planId) return;

    const interval = setInterval(async () => {
      try {
        const res = await axios.get(`https://backend.evida.site/api/v1/ai/study_plan/${planId}`, {
          withCredentials: true,
        });

        const { status, data } = res.data;
        setStatus(status);

        // 완료되었을 때만 처리
        if (status === 'completed') {
          clearInterval(interval);

          // output_data 는 JSON 문자열이므로 파싱 필요
          const parsed = JSON.parse(data.output_data);

          // daily_goals 배열을 캘린더 이벤트 형식으로 변환
          const events: Event[] = parsed.daily_goals.map((goal: any) => ({
            id: crypto.randomUUID(),
            title: goal.goal,
            description: goal.details,
            date: goal.date, // 이미 YYYY-MM-DD
          }));

          // 부모 컴포넌트에 전달
          onEventsGenerated(events);
        }
      } catch (err) {
        console.error('study_plan fetch error:', err);
      }
    }, 2000); // 2초마다 폴링

    return () => clearInterval(interval);
  }, [planId, onEventsGenerated]);

  return null;
}
