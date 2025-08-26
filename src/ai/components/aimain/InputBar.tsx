import { FaPaperPlane } from 'react-icons/fa';
import type { RefObject } from 'react';
import { minLen, useInputGate } from '@src/ai/hook/useInputGate';

type Props = {
  inputRef: RefObject<HTMLInputElement | null>;
  onSend: () => void;
  summaryMode?: boolean;
  placeholder?: string;
};

export default function InputBar({
  inputRef,
  onSend,
  summaryMode = false,
  placeholder = 'Evi 에게 물어보세요',
}: Props) {
  const { value, onChange, onKeyDown, trySend, reasons, canSend } = useInputGate({
    inputRef,
    onSend,
    validators: summaryMode ? [minLen(10)] : [minLen(1)],
  });

  return (
    <div className="bg-white p-3 shadow-[0_-10px_20px_-18px_rgba(2,6,23,0.25)]">
      <div className="max-w-screen-md mx-auto flex items-center">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            className="w-full h-11 rounded-xl bg-white ring-1 ring-slate-200 px-4 pr-14 text-[15px] placeholder:text-slate-400 shadow-sm outline-none focus:ring-2 focus:ring-slate-300 focus:shadow-md transition"
          />
          <button
            type="button"
            aria-label="보내기"
            onClick={trySend}
            disabled={!canSend}
            className={`absolute top-1/2 -translate-y-1/2 right-1 h-9 px-3 rounded-lg inline-flex items-center gap-1 text-sm font-medium transition ${
              canSend
                ? 'bg-[#1B3043] text-white shadow-sm hover:shadow-md'
                : 'bg-slate-100 text-slate-400 cursor-not-allowed'
            }`}
            title={canSend ? '보내기' : reasons[0] || '입력값이 부족합니다.'}
          >
            <span className={canSend ? 'opacity-100' : 'opacity-80'}>보내기</span>
            <FaPaperPlane className="text-[12px]" />
          </button>
        </div>
      </div>

      {!canSend && reasons.length > 0 && (
        <p className="max-w-screen-md mx-auto mt-1 text-xs text-slate-500">{reasons.join(' ')}</p>
      )}
    </div>
  );
}
