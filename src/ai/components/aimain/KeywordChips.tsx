import { motion } from 'framer-motion';

export default function KeywordChips({
  keywords,
  onChipClick,
  title = '키워드',
}: {
  keywords: string[];
  onChipClick?: (kw: string) => void;
  title?: string;
}) {
  if (!keywords?.length) return null;

  return (
    <div className="rounded-2xl bg-white ring-1 ring-slate-200 shadow-sm p-3">
      <div className="text-xs font-semibold text-slate-500 mb-2">{title}</div>
      <div className="flex flex-wrap gap-1.5">
        {keywords.map((kw) => (
          <motion.button
            type="button"
            key={kw}
            whileTap={{ scale: 0.97 }}
            onClick={onChipClick ? () => onChipClick(kw) : undefined}
            className="
              rounded-full px-2.5 py-1 text-xs
              bg-slate-100 text-slate-700 ring-1 ring-slate-200
              hover:bg-slate-200 transition
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
            "
            aria-label={`키워드: ${kw}`}
            title={kw}
          >
            #{kw}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
