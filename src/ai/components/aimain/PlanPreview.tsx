import { useState, useCallback } from 'react';
import type { PlanData } from '@src/ai/types/types';

type Controlled = {
  openMap?: Record<number, boolean>;
  onToggle?: (index: number, next: boolean) => void;
};

const stripWeekPrefix = (raw?: string) => {
  let t = (raw ?? '').trim();
  t = t.replace(/^\s*\d+\s*주\s*차?\s*[:\-–·.]?\s*/i, '');
  t = t.replace(/^\s*\d+\s*주\s*과정\s*/i, '');
  t = t.replace(/^\s*week\s*\d+\s*[:\-–·.]?\s*/i, '');
  return t.trim();
};

const getWeekNumber = (raw: unknown, fallback: number) => {
  if (typeof raw === 'number' && Number.isFinite(raw)) return raw;
  const n = parseInt(String(raw ?? '').replace(/[^\d]/g, ''), 10);
  return Number.isFinite(n) ? n : fallback;
};

export default function PlanPreview({ plan, openMap, onToggle }: { plan: PlanData } & Controlled) {
  const [localOpen, setLocalOpen] = useState<Record<number, boolean>>({ 0: true });

  const getOpen = (i: number) => (openMap ? openMap[i] : localOpen[i]) ?? i === 0;

  const setOpen = useCallback(
    (i: number, next: boolean) => {
      if (onToggle) onToggle(i, next);
      else setLocalOpen((m) => ({ ...m, [i]: next }));
    },
    [onToggle],
  );

  return (
    <div className="space-y-4">
      {plan.title && <h3 className="text-base font-semibold">{plan.title}</h3>}
      {plan.description && <p className="text-sm text-gray-700">{plan.description}</p>}

      {Array.isArray(plan.weekly_plans) && plan.weekly_plans.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">주차별 계획</div>

          <div className="space-y-2">
            {plan.weekly_plans.map((w: any, i: number) => {
              const open = getOpen(i);

              const weekNum = getWeekNumber(w?.week, i + 1);
              const weekLabel = `${weekNum}주차`;
              const cleanedTitle = stripWeekPrefix(String(w?.title ?? ''));
              const title = `${weekLabel}${cleanedTitle ? `: ${cleanedTitle}` : ''}`;

              return (
                <div
                  key={i}
                  className="rounded-2xl ring-1 ring-slate-200/6 bg-white shadow-sm transition hover:ring-slate-300 overflow-hidden"
                >
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={open}
                    onClick={() => setOpen(i, !open)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setOpen(i, !open);
                      }
                    }}
                    className={`mb-3 cursor-pointer select-none px-4 py-3 flex items-center justify-between bg-white hover:bg-slate-50 ${open ? 'border-b border-slate-100/80' : ''}`}
                  >
                    <div className="font-semibold text-slate-800">{title}</div>
                    <div className="text-xs text-slate-400">{open ? '접기' : '펼치기'}</div>
                  </div>

                  <div className={`px-4 pb-4 ${open ? 'block' : 'hidden'}`}>
                    <div className="grid gap-3">
                      {Array.isArray(w?.topics) && w.topics.length > 0 && (
                        <div className="text-sm">
                          <div className="font-medium mb-1">Topics</div>
                          <ul className="list-disc ml-5 space-y-1">
                            {w.topics.map((t: any, idx: number) => (
                              <li key={idx}>{String(t)}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {Array.isArray(w?.goals) && w.goals.length > 0 && (
                        <div className="text-sm">
                          <div className="font-medium mb-1">Goals</div>
                          <ul className="list-disc ml-5 space-y-1">
                            {w.goals.map((t: any, idx: number) => (
                              <li key={idx}>{String(t)}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {Array.isArray(w?.daily_goals) && w.daily_goals.length > 0 && (
                        <div className="text-sm">
                          <div className="font-medium mb-1">Daily</div>
                          <ul className="list-disc ml-5 space-y-1">
                            {w.daily_goals.map((t: any, idx: number) => (
                              <li key={idx}>{String(t)}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
