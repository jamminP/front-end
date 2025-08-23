import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import { useChat } from '../hook/useChat';
import { StartCommand } from '../types/types';
import ActionGrid from './aimain/ActionGrid';
import { ACTIONS } from '../constants/actions';
import ChatHeader from './aimain/ChatHeader';
import InputBar from './aimain/InputBar';
import { createStudyPlanForMe } from '../api/studyPlan';
import { HttpError } from '../api/http';
import VirtualMessageList from './aimain/VitualMessageList';
import { UNIFIED_AI_FEED_QK } from '../hook/useUnifiedAiFeed';
import { useQueryClient } from '@tanstack/react-query';
import HomeCard from './aimain/HomeCard';

type Step = 'need_input' | 'need_dates' | 'need_challenge' | 'submitting' | 'done';

function parseMaybeNestedJSON(raw?: string | null) {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw);
    return typeof v === 'string' ? JSON.parse(v) : v;
  } catch {
    return null;
  }
}
function toISOWithTimeOfNow(d: Date) {
  const now = new Date();
  const withNow = new Date(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    now.getHours(),
    now.getMinutes(),
    now.getSeconds(),
    now.getMilliseconds(),
  );
  return withNow.toISOString();
}
const fmt = (d: Date) => toISOWithTimeOfNow(d).slice(0, 10);
const daysInclusive = (a: Date, b: Date) => {
  const A = new Date(a.getFullYear(), a.getMonth(), a.getDate()).getTime();
  const B = new Date(b.getFullYear(), b.getMonth(), b.getDate()).getTime();
  return Math.abs(Math.round((B - A) / 86400000)) + 1;
};
function yesNoToBool(text: string): boolean | null {
  const t = text.trim().toLowerCase();
  if (/^(y|yes|true|예|참|참여|참가|한다|해|응|그래)/.test(t)) return true;
  if (/^(n|no|false|아니|미참|안해|안 해|x)/.test(t)) return false;
  return null;
}

export default function AiMain({ externalCommand }: { externalCommand?: StartCommand | null }) {
  const {
    view,
    selectedAction,
    messages,
    inputRef,
    startChat,
    send,
    appendAssistant,
    appendLoading,
    removeMessage,
    appendPlanPreview,
    appendCalendar,
    appendChallengePrompt,
    appendChoice,
    disableChoice,
    lockCalendar,
  } = useChat(externalCommand, planReply);

  const calendarIdRef = useRef<string | null>(null);
  const lastChoiceIdRef = useRef<string | null>(null);
  const queryClient = useQueryClient();

  const afterDatesConfirmed = (start: Date, end: Date) => {
    appendChallengePrompt({
      start: fmt(start),
      end: fmt(end),
      days: daysInclusive(start, end),
    });

    appendAssistant('이 기간 동안 챌린지를 진행하시겠어요?');

    lastChoiceIdRef.current = appendChoice(
      [
        { value: 'yes', label: '예' },
        { value: 'no', label: '아니요' },
      ],
      { variant: 'pill', align: 'left' },
    );
  };

  const onChoice = async (value: string, msgId: string) => {
    if (state.current.step !== 'need_challenge') return;

    disableChoice(msgId);

    const yn = value === 'yes';
    if (!state.current.start || !state.current.end) return;

    state.current.step = 'submitting';
    const payload = {
      input_data: state.current.input_data,
      start_date: toISOWithTimeOfNow(state.current.start!),
      end_date: toISOWithTimeOfNow(state.current.end!),
      is_challenge: yn,
    };

    const loadingId = appendLoading('학습 계획 생성이 생성중입니다.');
    try {
      const res = await createStudyPlanForMe(payload);
      const body = res.data;
      appendAssistant(body?.message || '학습 계획 생성이 완료되었습니다.');
      const parsed = parseMaybeNestedJSON(body?.data?.study_plan?.output_data);
      if (parsed) appendPlanPreview(parsed as any);

      queryClient.invalidateQueries({ queryKey: UNIFIED_AI_FEED_QK, exact: false });
    } catch (e) {
      const msg =
        e instanceof HttpError
          ? e.message
          : ((e as Error)?.message ?? '요청 중 오류가 발생했습니다.');
      appendAssistant(
        msg.includes('요청 시간이 초과')
          ? '응답이 지연되고 있어요. 잠시 후 사이드바에서 생성 여부를 확인해 주세요.'
          : `생성 중 오류가 발생했습니다: ${msg}`,
      );
    } finally {
      removeMessage(loadingId);
      state.current.step = 'done';
    }
  };

  const state = useRef<{ step: Step; input_data: string; start?: Date; end?: Date }>({
    step: 'need_input',
    input_data: '',
  });

  async function planReply(userText: string, action: any) {
    if (action !== 'plan') return `좋아요! “${userText}”에 대해 더 알려주시면 계획을 정교화할게요.`;

    if (state.current.step === 'need_input') {
      state.current.input_data = userText.trim();
      state.current.step = 'need_dates';
      appendAssistant('기간을 알려주세요.');
      setTimeout(() => {
        calendarIdRef.current = appendCalendar();
      }, 0);
      return null;
    }

    if (state.current.step === 'need_dates') {
      const parts = userText.match(/\d{4}-\d{2}-\d{2}/g);
      if (!parts || parts.length < 2) {
        return '날짜는 “YYYY-MM-DD ~ YYYY-MM-DD” 형식으로 입력하거나, 위 캘린더에서 선택해 주세요.';
      }
      const [a, b] = parts as [string, string];
      const s = new Date(a);
      const e = new Date(b);
      const start = s <= e ? s : e;
      const end = s <= e ? e : s;

      state.current.start = start;
      state.current.end = end;
      state.current.step = 'need_challenge';

      if (calendarIdRef.current) lockCalendar(calendarIdRef.current);
      afterDatesConfirmed(start, end);
      return null;
    }

    if (state.current.step === 'need_challenge') {
      const yn = yesNoToBool(userText);
      if (yn === null) return '참여 여부를 예/아니오 로 알려주세요.';
      if (!state.current.start || !state.current.end) {
        state.current.step = 'need_dates';
        appendAssistant('기간을 알려주세요.');
        setTimeout(() => appendCalendar(), 0);
        return null;
      }

      state.current.step = 'submitting';
      const payload = {
        input_data: state.current.input_data,
        start_date: toISOWithTimeOfNow(state.current.start!),
        end_date: toISOWithTimeOfNow(state.current.end!),
        is_challenge: yn,
      };

      const loadingId = appendLoading('학습 계획 생성이 생성중입니다.');
      try {
        const res = await createStudyPlanForMe(payload);
        const body = res.data;
        appendAssistant(body?.message || '학습 계획 생성이 완료되었습니다.');
        const parsed = parseMaybeNestedJSON(body?.data?.study_plan?.output_data);
        if (parsed) appendPlanPreview(parsed as any);
      } catch (e) {
        const msg =
          e instanceof HttpError
            ? e.message
            : ((e as Error)?.message ?? '요청 중 오류가 발생했습니다.');
        appendAssistant(
          typeof msg === 'string' && msg.includes('요청 시간이 초과되었습니다.')
            ? '응답이 지연되고 있어요. 잠시 후 사이드바에서 생성 여부를 확인해 주세요.'
            : `생성 중 오류가 발생했습니다: ${msg}`,
        );
      } finally {
        removeMessage(loadingId);
        state.current.step = 'done';
      }
      return null;
    }

    if (state.current.step === 'done') {
      state.current = { step: 'need_input', input_data: '' };
      return '새로운 학습 계획을 시작해요! 어떤 공부 계획을 원하시나요?';
    }
    return null;
  }

  const onCalendarConfirm = (start: Date, end: Date) => {
    if (state.current.step !== 'need_dates') return;
    state.current.start = start;
    state.current.end = end;
    state.current.step = 'need_challenge';

    if (calendarIdRef.current) lockCalendar(calendarIdRef.current);
    afterDatesConfirmed(start, end);
  };

  return (
    <div className="h-full grid grid-rows-[1fr]">
      <AnimatePresence mode="wait">
        {view === 'home' ? (
          <motion.section
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="overflow-y-auto bg-white rounded-2xl"
          >
            <div className="max-w-screen-xl mx-auto px-4 py-6 md:py-8">
              <ActionGrid
                title="무엇을 도와드릴까요?"
                subtitle="학습 플랜 수립부터 요약까지 한 곳에서 시작하세요."
              >
                {ACTIONS.map((a) => {
                  const Icon = a.icon;
                  return (
                    <HomeCard
                      key={a.id}
                      title={a.title}
                      description={a.desc}
                      icon={Icon}
                      onClick={() => startChat(a.id)}
                    />
                  );
                })}
              </ActionGrid>
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="chat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-full"
          >
            <div className="grid grid-rows-[auto_1fr_auto] h-full bg-white rounded-2xl overflow-hidden">
              <ChatHeader title={selectedAction?.title ?? '대화'} />
              <div className="min-h-0 h-full p-2">
                <VirtualMessageList
                  messages={messages}
                  onCalendarConfirm={onCalendarConfirm}
                  onChoice={onChoice}
                />
              </div>
              <InputBar inputRef={inputRef} onSend={send} />
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
