import { Msg } from '@src/ai/types/types';
import Bubble from './Bubble';
import PlanPreview from './PlanPreview';
import CalendarBubble from './CalendarBubble';

export default function MessageList({
  messages,
  onCalendarConfirm,
}: {
  messages: Msg[];
  onCalendarConfirm?: (start: Date, end: Date) => void;
}) {
  return (
    <div className="overflow-y-auto p-4 bg-white/50">
      <div className="max-w-screen-md mx-auto space-y-3">
        {messages.map((m) => {
          if ((m as any).kind === 'plan' && (m as any).plan) {
            return (
              <div key={m.id} className="flex justify-start">
                <div className="max-w-[82%] rounded-2xl px-4 py-3 bg-white shadow-sm">
                  <PlanPreview plan={(m as any).plan} />
                </div>
              </div>
            );
          }

          if ((m as any).kind === 'loading') {
            return (
              <div key={m.id} className="flex justify-start">
                <div className="max-w-[82%] rounded-2xl px-4 py-3 bg-white shadow-sm">
                  <div className="text-sm text-gray-700">
                    {(m as any).text || '학습 계획 생성이 생성중입니다.'}
                  </div>
                  <div className="mt-2 space-y-2 animate-pulse">
                    <div className="h-3 bg-slate-200 rounded" />
                    <div className="h-3 bg-slate-200 rounded w-5/6" />
                    <div className="h-3 bg-slate-200 rounded w-4/6" />
                  </div>
                </div>
              </div>
            );
          }

          if ((m as any).kind === 'calendar') {
            return (
              <div key={m.id} className="flex justify-start">
                <div className="max-w-[82%] rounded-2xl px-4 py-3 bg-white shadow-sm">
                  <CalendarBubble onConfirm={onCalendarConfirm} />
                </div>
              </div>
            );
          }

          return <Bubble key={m.id} role={m.role} text={(m as any).text || ''} />;
        })}
      </div>
    </div>
  );
}
