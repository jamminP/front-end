// src/ai/components/aimain/PlanComposer.tsx
import { useEffect, useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createStudyPlanForMe, CreateStudyPlanReq } from '../../api/studyPlan';
import { HttpError } from '../../api/http';
import type { PlanData } from '../../types/types';

type Props = {
  onSubmitted?: (
    req: CreateStudyPlanReq,
    serverMessage?: string,
    outputDataPretty?: string,
  ) => void;
  chat?: {
    appendUser: (text: string) => void;
    appendAssistant: (text: string) => void;
    appendLoading: (text?: string) => string;
    appendPlanPreview: (plan: PlanData) => void;
  };
};

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

function parseMaybeNestedJSON(raw: unknown) {
  if (typeof raw !== 'string') return raw;
  try {
    const first = JSON.parse(raw);
    return typeof first === 'string' ? JSON.parse(first) : first;
  } catch {
    return raw;
  }
}
function toPrettyJSON(raw: unknown) {
  const parsed = parseMaybeNestedJSON(raw);
  return typeof parsed === 'string' ? parsed : JSON.stringify(parsed, null, 2);
}

export default function PlanComposer({ onSubmitted, chat }: Props) {
  const [text, setText] = useState('');
  const [inputData, setInputData] = useState('');
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [datesAcked, setDatesAcked] = useState(false);
  const [isChallenge, setIsChallenge] = useState(false);

  const step: 1 | 2 | 3 = useMemo(() => {
    if (!inputData.trim()) return 1;
    if (!start || !end) return 2;
    return 3;
  }, [inputData, start, end]) as 1 | 2 | 3;

  const onEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    setInputData(v);
    setText('');
    chat?.appendUser(v);
    chat?.appendAssistant(
      '좋아요! 기간을 선택해 주세요. 시작일과 종료일을 캘린더에서 지정해 주세요.',
    );
  };

  useEffect(() => {
    if (step === 2 || datesAcked) return;
    if (start && end) {
      const s = toISOWithTimeOfNow(start).slice(0, 10);
      const e = toISOWithTimeOfNow(end).slice(0, 10);
      chat?.appendAssistant(
        `기간을 확인했습니다: ${s} ~ ${e}\n챌린지에 참여하시나요? (체크박스를 선택해 주세요)`,
      );
      setDatesAcked(true);
    }
  }, [step, start, end, datesAcked, chat]);

  async function autoSubmit(challenge: boolean) {
    if (step !== 3 || !start || !end) return;

    const payload: CreateStudyPlanReq = {
      input_data: inputData.trim(),
      start_date: toISOWithTimeOfNow(start),
      end_date: toISOWithTimeOfNow(end),
      is_challenge: challenge,
    };

    const loadingId = chat?.appendLoading('학습 계획 생성이 생성중입니다.');

    try {
      const res = await createStudyPlanForMe(payload);
      const body = res.data;

      const outputRaw = body?.data?.study_plan?.output_data;
      const pretty = outputRaw ? toPrettyJSON(outputRaw) : undefined;

      chat?.appendAssistant(body?.message || '학습 계획 생성이 완료되었습니다.');
      const parsed = outputRaw ? (parseMaybeNestedJSON(outputRaw) as any) : null;
      if (parsed) chat?.appendPlanPreview(parsed);

      onSubmitted?.(payload, body?.message, pretty);
    } catch (e) {
      const msg =
        e instanceof HttpError
          ? e.message
          : ((e as Error)?.message ?? '요청 중 오류가 발생했습니다.');
      if (typeof msg === 'string' && msg.includes('요청 시간이 초과되었습니다.')) {
        chat?.appendAssistant(
          '응답이 지연되고 있어요. 잠시 후 사이드바에서 생성 여부를 확인해 주세요.',
        );
        onSubmitted?.(payload, '요청 시간 초과(서버에서 처리 중일 수 있어요).');
        return;
      }
      chat?.appendAssistant(`생성 중 오류가 발생했습니다: ${msg}`);
    } finally {
    }
  }

  return (
    <div className="bg-white p-4">
      <div className="max-w-screen-md mx-auto space-y-4">
        <div className="p-4 border rounded-2xl">
          <div className="font-medium mb-2">1. 어떤 공부 계획을 원하시나요?</div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onEnter}
            placeholder="예) 파이썬을 4주 동안, 하루 3~4시간... (Enter로 전송)"
            className="w-full min-h-28 rounded-xl border px-3 py-2 outline-none focus:ring-1 focus:ring-[#2a4864]"
          />
          {inputData && <div className="mt-2 text-xs text-gray-500">입력됨: “{inputData}”</div>}
        </div>

        <div
          className={`p-4 border rounded-2xl ${!inputData.trim() ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <div className="font-medium mb-2">2. 기간은 어느 정도로 할까요?</div>
          <div className="text-sm text-gray-600 mb-2">
            날짜만 선택하세요. 시간은 현재 시각으로 자동 설정됩니다.
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-semibold mb-1">시작일</div>
              <DatePicker
                selected={start}
                onChange={(d) => setStart(d)}
                selectsStart
                startDate={start}
                endDate={end}
                dateFormat="yyyy-MM-dd"
                inline
              />
            </div>
            <div>
              <div className="text-xs font-semibold mb-1">종료일</div>
              <DatePicker
                selected={end}
                onChange={(d) => setEnd(d)}
                selectsEnd
                startDate={start}
                endDate={end}
                minDate={start || undefined}
                dateFormat="yyyy-MM-dd"
                inline
              />
            </div>
          </div>
        </div>

        <div
          className={`p-4 border rounded-2xl ${step !== 3 ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <div className="font-medium mb-2">3. 챌린지에 참여하시나요?</div>
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isChallenge}
              onChange={async (e) => {
                const next = e.target.checked;
                setIsChallenge(next);
                await autoSubmit(next);
              }}
              className="h-4 w-4"
            />
            <span>참여합니다 (is_challenge: {String(isChallenge)})</span>
          </label>
        </div>
      </div>
    </div>
  );
}
