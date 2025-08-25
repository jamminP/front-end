import { FaChevronDown } from 'react-icons/fa';

export default function ChatHeader({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="h-14 max-w-screen-2xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl font-semibold tracking-tight text-slate-900">Evi</span>
          <span className="px-2 py-[2px] rounded-full text-xs font-medium bg-slate-100 text-slate-700">
            v0
          </span>
          <span className="text-sm font-medium text-slate-500">
            <button>Thinking</button>
          </span>
          <FaChevronDown className="ml-0.5 h-4 w-4 text-slate-400" />
        </div>

        {title && (
          <div className="hidden sm:block max-w-[55%] truncate text-sm text-slate-500">{title}</div>
        )}
      </div>
    </header>
  );
}
