import { FaPaperPlane } from 'react-icons/fa';
import { RefObject } from 'react';

type Props = {
  inputRef: React.Ref<HTMLInputElement>;
  onSend: () => void;
};

export default function InputBar({ inputRef, onSend }: Props) {
  return (
    <div className="border-t bg-white p-3">
      <div className="max-w-screen-md mx-auto flex items-center gap-2">
        <input
          ref={inputRef}
          placeholder="Evi 에게 물어보세요"
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
          className="flex-1 h-11 rounded-xl border border-[#1B3043] px-4 outline-none focus:ring-1 focus:ring-[#2a4864]"
        />
        <button
          onClick={onSend}
          className="h-11 px-4 rounded-xl bg-[#1B3043] text-white font-medium hover:opacity-95 active:opacity-90"
        >
          <span className="inline-flex items-center gap-2">
            보내기 <FaPaperPlane />
          </span>
        </button>
      </div>
    </div>
  );
}
