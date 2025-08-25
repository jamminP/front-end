import React from 'react';
import { motion } from 'framer-motion';

const ACCENT = '#1B3043';

type IconCmp = React.ComponentType<{ size?: number; className?: string }>;
type BaseBtnProps = Pick<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'disabled' | 'title' | 'aria-label'
>;

type Props = BaseBtnProps & {
  title: string;
  description?: string;
  icon?: IconCmp;
  onClick?: () => void;
};

export default function HomeCard({
  title,
  description,
  icon: Icon,
  onClick,
  disabled,
  title: btnTitle,
  ..._rest // 의도적으로 확장 금지 (framer-motion과 충돌 방지)
}: Props) {
  return (
    <motion.button
      type="button"
      disabled={disabled}
      title={btnTitle}
      onClick={onClick}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      className="
        group w-full text-left
        rounded-2xl bg-white
        ring-1 ring-slate-200 hover:ring-slate-300
        shadow-sm hover:shadow-md
        transition-all duration-200
        p-4 md:p-5
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2
      "
      style={{ outlineColor: ACCENT }}
      aria-label={`시작하기: ${title}`}
    >
      <div className="flex items-start gap-3">
        <div
          className="
            grid place-items-center shrink-0
            h-10 w-10 rounded-xl
            bg-slate-100 text-slate-700
            transition group-hover:bg-[rgba(27,48,67,0.08)] group-hover:text-[var(--accent)]
          "
          style={{ ['--accent' as any]: ACCENT }}
        >
          {Icon ? <Icon size={20} className="text-inherit" /> : <span className="text-sm">🗂️</span>}
        </div>

        <div className="flex-1 min-w-0">
          <div className="text-[15px] md:text-base font-semibold text-slate-900 truncate">
            {title}
          </div>

          {description && <p className="mt-1 text-sm text-slate-500 line-clamp-2">{description}</p>}

          <div
            className="mt-3 inline-flex items-center gap-1 text-sm font-medium"
            style={{ color: ACCENT }}
          >
            시작하기
            <svg
              viewBox="0 0 20 20"
              className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
              fill="currentColor"
              aria-hidden
            >
              <path d="M7.25 3.5a.75.75 0 0 1 0-1.5h8a.75.75 0 0 1 .75.75v8a.75.75 0 0 1-1.5 0V4.56l-9.47 9.47a.75.75 0 0 1-1.06-1.06L13.44 3.5H7.25z" />
            </svg>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
