import type { StudyPlan, SummaryItem } from '../types/types';

export type ChatSummary = { id: string; title: string };

export type UnifiedItem = {
  id: string;
  rid: number;
  title: string;
  createdAt: string;
  kind: 'plan' | 'summary';
};

function extractTitle(output_data: string): string | null {
  try {
    const parsed = JSON.parse(output_data);
    const j = typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
    if (j && typeof j.title === 'string' && j.title.trim()) return j.title.trim();
  } catch {}
  return null;
}

export function toChatSummaries(plans: StudyPlan[]): ChatSummary[] {
  return plans.map((p) => ({
    id: String(p.id),
    title: extractTitle(p.output_data) ?? '제목 없음',
  }));
}

export function toPlanItems(plans: StudyPlan[]): UnifiedItem[] {
  return plans.map((p) => ({
    id: `plan-${p.id}`,
    rid: p.id,
    title: extractTitle(p.output_data) ?? `대화 ${p.id}`,
    createdAt: p.created_at,
    kind: 'plan' as const,
  }));
}

export function toSummaryItems(rows: SummaryItem[]): UnifiedItem[] {
  return rows.map((s) => ({
    id: `summary-${s.id}`,
    rid: s.id,
    title: s.title?.trim() || `요약 ${s.id}`,
    createdAt: s.created_at,
    kind: 'summary' as const,
  }));
}
