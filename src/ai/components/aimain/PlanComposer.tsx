import { useMemo, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { createStudyPlanForMe, CreateStudyPlanReq } from '../../api/studyPlan';
import { HttpError } from '../../api/http';

type Props = {
  onSubmitted?: (
    req: CreateStudyPlanReq,
    serverMessage?: string,
    outputDataPretty?: string,
  ) => void;
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

export default function PlanComposer({ onSubmitted }: Props) {
  const [inputData, setInputData] = useState('');
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [selecting, setSelecting] = useState<'start' | 'end'>('start');
  const [isChallenge, setIsChallenge] = useState<boolean>(false);

  const step: 1 | 2 | 3 | 4 = useMemo(() => {
    if (!inputData.trim()) return 1;
    if (!start || !end) return 2;
    return 3;
  }, [inputData, start, end]) as 1 | 2 | 3 | 4;

  const canSubmit = step === 3;

  async function handleSubmit() {
    if (!canSubmit || !start || !end) return;

    const payload: CreateStudyPlanReq = {
      input_data: inputData.trim(),
      start_date: toISOWithTimeOfNow(start),
      end_date: toISOWithTimeOfNow(end),
      is_challenge: isChallenge,
    };

    try {
      const res = await createStudyPlanForMe(payload);
      const body = res.data;

      const outputRaw = body?.data?.study_plan?.output_data;
      const outputPretty = outputRaw ? toPrettyJSON(outputRaw) : undefined;

      onSubmitted?.(payload, body?.message, outputPretty);

      alert('학습 계획 생성이 완료되었습니다.');
      setInputData('');
      setStart(null);
      setEnd(null);
      setIsChallenge(false);
      setSelecting('start');
    } catch (e) {
      const msg =
        e instanceof HttpError
          ? e.message
          : ((e as Error)?.message ?? '요청 중 오류가 발생했습니다.');

      if (typeof msg === 'string' && msg.includes('요청 시간이 초과되었습니다.')) {
        onSubmitted?.(payload, '요청 시간 초과(서버에서 처리 중일 수 있어요).');
        return;
      }

      alert(msg);
    }
  }

  return (
    <div className="bg-white p-4">
      <div className="max-w-screen-md mx-auto space-y-4">
        <div className="p-4 border rounded-2xl">
          <div className="font-medium mb-2">1. 어떤 공부 계획을 원하시나요?</div>
          <textarea
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            placeholder="예) 파이썬을 4주 동안, 하루 3~4시간... (input_data)"
            className="w-full min-h-28 rounded-xl border px-3 py-2 outline-none focus:ring-1 focus:ring-[#2a4864]"
          />
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
                onChange={(d) => {
                  setStart(d);
                  setSelecting('end');
                }}
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
          <div className="text-xs text-gray-500 mt-2">
            현재 선택 중: <b>{selecting === 'start' ? '시작일' : '종료일'}</b>
          </div>
        </div>

        <div
          className={`p-4 border rounded-2xl ${!start || !end ? 'opacity-60 pointer-events-none' : ''}`}
        >
          <div className="font-medium mb-2">3. 챌린지에 참여하시나요?</div>
          <label className="inline-flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isChallenge}
              onChange={(e) => setIsChallenge(e.target.checked)}
              className="h-4 w-4"
            />
            <span>참여합니다 (is_challenge: {String(isChallenge)})</span>
          </label>
        </div>

        <div className="p-4 border rounded-2xl">
          <div className="font-medium mb-2">4. 전송할 JSON 미리보기</div>
          <pre className="text-xs bg-slate-50 p-3 rounded-xl overflow-x-auto">
            {JSON.stringify(
              {
                input_data: inputData.trim() || '<빈 값>',
                start_date: start ? toISOWithTimeOfNow(start) : '<미선택>',
                end_date: end ? toISOWithTimeOfNow(end) : '<미선택>',
                is_challenge: isChallenge,
              },
              null,
              2,
            )}
          </pre>

          <div className="mt-3 flex justify-end">
            <button
              disabled={!canSubmit}
              onClick={handleSubmit}
              className={`h-11 px-5 rounded-xl text-white font-medium ${
                canSubmit ? 'bg-[#1B3043] hover:opacity-95 active:opacity-90' : 'bg-gray-400'
              }`}
            >
              서버로 전송하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
