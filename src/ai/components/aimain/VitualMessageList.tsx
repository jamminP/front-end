import { Virtuoso } from 'react-virtuoso';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
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
  gapY = '0.5',
}: Props) {
  const wrapClass = gapToClass[gapY];

  const CenterWrap = ({ children }: { children: React.ReactNode }) => (
    <div className="max-w-screen-md mx-auto px-3">{children}</div>
  );

  const RowAnim = ({ children }: { children: React.ReactNode }) => (
    <motion.div
      initial={{ opacity: 0, y: 6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.18, ease: 'easeOut' }}
      className={wrapClass}
    >
      <CenterWrap>{children}</CenterWrap>
    </motion.div>
  );

  return (
    <Virtuoso
      className="h-full w-full"
      style={{ height: '100%' }}
      components={{ Scroller }}
      data={messages}
      followOutput="smooth"
      startReached={onStartReached}
      itemContent={(_, m) => {
        const kind = (m as any).kind;

        if (kind === 'plan' && (m as any).plan) {
          return (
            <RowAnim>
              <div className="flex justify-start">
                <div className="w-full md:w-auto max-w-full md:max-w-none rounded-2xl px-4 py-3 bg-white shadow-sm">
                  <PlanPreview plan={(m as any).plan} />
                </div>
              </div>
            </RowAnim>
          );
        }

        if (kind === 'loading') {
          return (
            <RowAnim>
              <div className="flex justify-start">
                <div className="w-full md:w-auto rounded-2xl px-4 py-3 bg-white shadow-sm">
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
            </RowAnim>
          );
        }

        if (kind === 'typing') {
          return (
            <RowAnim>
              <div className="flex justify-start">
                <div className="rounded-2xl px-4 py-3 bg-white shadow-sm inline-flex items-center gap-1">
                  <span className="sr-only">타이핑 중…</span>
                  <span className="h-2 w-2 rounded-full bg-gray-400 animate-bounce" />
                  <span
                    className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: '0.12s' }}
                  />
                  <span
                    className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                    style={{ animationDelay: '0.24s' }}
                  />
                </div>
              </div>
            </RowAnim>
          );
        }

        if (kind === 'calendar') {
          return (
            <RowAnim>
              <div className="flex justify-start">
                <div className="w-full md:w-auto rounded-2xl px-4 py-3 bg-white shadow-sm">
                  <CalendarBubble onConfirm={onCalendarConfirm} />
                </div>
              </div>
            </RowAnim>
          );
        }

        return (
          <RowAnim>
            <Bubble role={(m as any).role} text={(m as any).text || ''} />
          </RowAnim>
        );
      }}
    />
  );
}
