import { Virtuoso } from 'react-virtuoso';
import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import type { Msg, PlanMsg, LoadingMsg, ChallengePromptMsg, TextMsg } from '@src/ai/types/types';
import Bubble from './Bubble';
import PlanPreview from './PlanPreview';
import CalendarBubble from './CalendarBubble';

type Props = {
  messages: Msg[];
  onCalendarConfirm?: (start: Date, end: Date) => void;
  onStartReached?: () => void;
  gapY?: '0' | '0.5' | '1' | '1.5' | '2';
  onChoice?: (value: string, msgId: string) => void;
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
Scroller.displayName = 'Scroller';

export default function VirtualMessageList({
  messages,
  onCalendarConfirm,
  onStartReached,
  gapY = '0.5',
  onChoice,
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
    <Virtuoso<Msg>
      className="h-full w-full"
      style={{ height: '100%' }}
      components={{ Scroller }}
      data={messages}
      computeItemKey={(_i, m) => m.id}
      followOutput="smooth"
      startReached={onStartReached}
      itemContent={(_i, m) => {
        if (m.kind === 'plan') {
          const pm = m as PlanMsg;
          return (
            <RowAnim>
              <div className="flex justify-start">
                <div className="w-full md:w-auto max-w-full md:max-w-none rounded-2xl px-4 py-3 bg-white shadow-sm">
                  <PlanPreview plan={pm.plan} />
                </div>
              </div>
            </RowAnim>
          );
        }

        if (m.kind === 'loading') {
          const lm = m as LoadingMsg;
          return (
            <RowAnim>
              <div className="flex justify-start">
                <div className="w-full md:w-auto rounded-2xl px-4 py-3 bg-white shadow-sm">
                  <div className="text-sm text-gray-700">
                    {lm.text ?? '학습 계획 생성이 생성중입니다.'}
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

        if (m.kind === 'calendar') {
          return (
            <RowAnim>
              <div className="flex justify-start">
                <div className="w-full md:w-auto rounded-2xl px-4 py-3 bg-white shadow-sm">
                  <CalendarBubble locked={m.locked} onConfirm={onCalendarConfirm} />{' '}
                </div>
              </div>
            </RowAnim>
          );
        }

        if (m.kind === 'challenge_prompt') {
          const { info } = m as ChallengePromptMsg;
          return (
            <RowAnim>
              <div className="flex justify-start">
                <div className="w-full md:w-auto rounded-2xl px-4 py-3 bg-white shadow-sm text-sm text-slate-800">
                  <div className="font-medium mb-1">기간을 확인했습니다.</div>
                  <div className="space-y-0.5">
                    <div>
                      <span className="text-slate-500">기간:</span> {info.start} ~ {info.end}
                    </div>
                    <div>
                      <span className="text-slate-500">총 일수:</span> {info.days}일
                    </div>
                  </div>
                </div>
              </div>
            </RowAnim>
          );
        }

        if (m.kind === 'choice') {
          const variant = m.ui?.variant ?? 'pill';
          const disabled = !!m.disabled;

          const baseBtn =
            'transition-all duration-150 active:scale-[0.98] focus:outline-none ' +
            (disabled ? 'opacity-50 cursor-not-allowed ' : '');

          return (
            <RowAnim>
              <div className="flex justify-start mt-1">
                <div className={'flex gap-2 ' + (m.ui?.align === 'center' ? 'justify-center' : '')}>
                  {m.options.map((opt) =>
                    variant === 'ox' ? (
                      <button
                        key={opt.value}
                        type="button"
                        aria-label={opt.label}
                        disabled={disabled}
                        onClick={() => onChoice?.(opt.value, m.id)}
                        className={
                          baseBtn +
                          'h-10 w-10 rounded-full border border-slate-200 hover:bg-slate-50 text-lg'
                        }
                      >
                        {opt.label}
                      </button>
                    ) : (
                      <button
                        key={opt.value}
                        type="button"
                        disabled={disabled}
                        onClick={() => onChoice?.(opt.value, m.id)}
                        className={
                          baseBtn +
                          'px-4 py-2 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50'
                        }
                      >
                        {opt.label}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </RowAnim>
          );
        }

        const tmText = ('text' in m ? (m as TextMsg).text : '') ?? '';
        return (
          <RowAnim>
            <Bubble role={m.role} text={tmText} />
          </RowAnim>
        );
      }}
    />
  );
}
