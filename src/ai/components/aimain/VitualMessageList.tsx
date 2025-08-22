import { Virtuoso } from 'react-virtuoso';
import { forwardRef, useState } from 'react';
import { Msg } from '@src/ai/types/types';
import Bubble from './Bubble';
import PlanPreview from './PlanPreview';
import CalendarBubble from './CalendarBubble';

type Props = {
  messages: Msg[];
  onCalendarConfirm?: (start: Date, end: Date) => void;
  onStartReached?: () => void;
  gapY?: '0' | '0.5' | '1' | '1.5' | '2';
};

const gapToClass = {
  '0': 'py-0',
  '0.5': 'py-0.5',
  '1': 'py-1',
  '1.5': 'py-1.5',
  '2': 'py-2',
  '3': 'py-3',
  '4': 'py-4',
} as const;

const Scroller = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>((props, ref) => (
  <div
    ref={ref}
    {...props}
    className={
      `h-full w-full overflow-y-auto ` +
      `[scrollbar-width:none] ` +
      `[&::-webkit-scrollbar]:w-0 ` +
      (props.className || '')
    }
  />
));

export default function VirtualMessageList({
  messages,
  onCalendarConfirm,
  onStartReached,
  gapY = '2',
}: Props) {
  const wrapClass = gapToClass[gapY];

  const [planOpenState, setPlanOpenState] = useState<Record<string, Record<number, boolean>>>({});

  const CenterWrap = ({ children }: { children: React.ReactNode }) => (
    <div className="max-w-screen-md mx-auto px-3">{children}</div>
  );

  return (
    <Virtuoso
      className="h-full w-full"
      style={{ height: '100%' }}
      components={{ Scroller }}
      data={messages}
      followOutput="smooth"
      startReached={onStartReached}
      computeItemKey={(index, item) => (item as any).id ?? index}
      itemContent={(_, m) => {
        const kind = (m as any).kind;

        const Row = ({ children }: { children: React.ReactNode }) => (
          <div className={wrapClass}>
            <CenterWrap>{children}</CenterWrap>
          </div>
        );

        if (kind === 'plan' && (m as any).plan) {
          const msgId = (m as any).id as string;
          const openMap = planOpenState[msgId] ?? { 0: true };

          return (
            <Row>
              <div className="flex justify-start">
                <div className="w-full md:w-auto max-w-full md:max-w-none rounded-2xl px-4 py-3 bg-white shadow-sm">
                  <PlanPreview
                    plan={(m as any).plan}
                    openMap={openMap}
                    onToggle={(i, next) =>
                      setPlanOpenState((s) => ({
                        ...s,
                        [msgId]: { ...(s[msgId] ?? {}), [i]: next },
                      }))
                    }
                  />
                </div>
              </div>
            </Row>
          );
        }

        if (kind === 'loading') {
          return (
            <Row>
              <div className="flex justify-start">
                <div className="w-full md:w-auto rounded-2xl px-4 py-3 bg-white shadow-sm">
                  <div className="text-sm text-gray-700">
                    {(m as any).text || '학습 계획이 생성중입니다.'}
                  </div>
                  <div className="mt-2 space-y-2 animate-pulse">
                    <div className="h-3 bg-slate-200 rounded" />
                    <div className="h-3 bg-slate-200 rounded w-5/6" />
                    <div className="h-3 bg-slate-200 rounded w-4/6" />
                  </div>
                </div>
              </div>
            </Row>
          );
        }

        if (kind === 'calendar') {
          return (
            <Row>
              <div className="flex justify-start">
                <div className="w-full md:w-auto rounded-2xl px-4 py-3 bg-white shadow-sm">
                  <CalendarBubble onConfirm={onCalendarConfirm} />
                </div>
              </div>
            </Row>
          );
        }

        return (
          <Row>
            <Bubble role={(m as any).role} text={(m as any).text || ''} />
          </Row>
        );
      }}
    />
  );
}
