import { useState } from 'react';
import { FaPaperPlane } from 'react-icons/fa';

type Props = {
  inputRef: React.Ref<HTMLInputElement>;
  onSend: () => void;
};

export default function InputBar({ inputRef, onSend }: Props) {
  const [hasText, setHasText] = useState(false);

  const fireSend = () => {
    if (!hasText) return;
    onSend();
    setHasText(false);
  };

  return (
    <div className="bg-white p-3 shadow-[0_-10px_20px_-18px_rgba(2,6,23,0.25)]">
      <div className="max-w-screen-md mx-auto flex items-center">
        <div className="relative flex-1">
          <input
            ref={inputRef}
            placeholder="Evi 에게 물어보세요"
            onChange={(e) => setHasText(e.currentTarget.value.trim().length > 0)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && hasText) {
                e.preventDefault();
                fireSend();
              }
            }}
            className="
              w-full h-11 rounded-xl
              bg-white
              ring-1 ring-slate-200        /* 옅은 라인 */
              px-4 pr-14                   /* 내부 버튼 자리 확보 */
              text-[15px] placeholder:text-slate-400
              shadow-sm outline-none
              focus:ring-2 focus:ring-slate-300
              focus:shadow-md transition
            "
          />

          <button
            type="button"
            aria-label="보내기"
            onClick={fireSend}
            disabled={!hasText}
            className={`
              absolute top-1/2 -translate-y-1/2 right-1
              h-9 px-3 rounded-lg inline-flex items-center gap-1 text-sm font-medium transition
              ${
                hasText
                  ? 'bg-[#1B3043] text-white shadow-sm hover:shadow-md'
                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            <span className={hasText ? 'opacity-100' : 'opacity-80'}>보내기</span>
            <FaPaperPlane className="text-[12px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
