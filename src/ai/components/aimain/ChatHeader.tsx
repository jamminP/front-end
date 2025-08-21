import { FaChevronLeft } from 'react-icons/fa';

export default function ChatHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="h-12 flex items-center gap-2 px-4 border-b bg-[#1B3043]">
      <button
        onClick={onBack}
        className="inline-flex items-center justify-center w-8 h-8 rounded hover:bg-[#2a4864]"
      >
        <FaChevronLeft color="white" />
      </button>
      <div className="font-semibold text-white">{title || '대화'}</div>
    </div>
  );
}
