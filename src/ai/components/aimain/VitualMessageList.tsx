import { Msg } from '@src/ai/types/types';
import { Virtuoso } from 'react-virtuoso';
import Bubble from './Bubble';
import PlanPreview from './PlanPreview';
import CalendarBubble from './CalendarBubble';

type Props = {
  messages: Msg[];
  onCalendarConfirm?: (start: Date, end: Date) => void;
  onStartReached?: () => void;
};

export default function VirtualMessageList({ messages, onCalendarConfirm, onStartReached }: Props) {
  return (
    <Virtuoso
      style={{ height: '100%' }}
      data={messages}
      followOutput="smooth"
      startReached={onStartReached}
      itemContent={(_, m) => {
        const kind = (m as any).kind;

        const Wrap = ({ children }: { children: React.ReactNode }) => (
          <div className="py-1">{children}</div>
        );

        if (kind === 'plan' && (m as any).plan) {
          return (
            <Wrap>
              <div className="flex justify-start">
                <div className="max-w-[82%] rounded-2xl px-4 py-3 bg-white shadow-sm">
                  <PlanPreview plan={(m as any).plan} />
                </div>
              </div>
            </Wrap>
          );
        }

        if (kind === 'loading') {
          return (
            <Wrap>
              <div className="flex justify-start">
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
            </Wrap>
          );
        }

        if (kind === 'calendar') {
          return (
            <Wrap>
              <div className="flex justify-start">
                <div className="max-w-[82%] rounded-2xl px-4 py-3 bg-white shadow-sm">
                  <CalendarBubble onConfirm={onCalendarConfirm} />
                </div>
              </div>
            </Wrap>
          );
        }

        return (
          <Wrap>
            <Bubble role={(m as any).role} text={(m as any).text || ''} />
          </Wrap>
        );
      }}
    />
  );
}
