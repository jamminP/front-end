import type { StudyPlan, SummaryItem } from './types';

export type ChatSummary = { id: string; title: string };
export type UnifiedItem = {
  id: string;
  title: string;
  createdAt: string;
  kind: 'plan' | 'summary';
};

function extractTitle(output_data: string): string | null {
  try {
    const v = JSON.parse(output_data);
    if (v && typeof v === 'object' && typeof v.title === 'string' && v.title.trim()) {
      return v.title.trim();
    }
    if (typeof v === 'string') {
      const v2 = JSON.parse(v);
      if (v2 && typeof v2 === 'object' && typeof v2.title === 'string' && v2.title.trim()) {
        return v2.title.trim();
      }
    }
  } catch (err) {
    console.log(`Error: ${err}`);
  }
  return null;
}

export function toChatSummaries(plans: StudyPlan[]): ChatSummary[] {
  return plans.map((p) => {
    const onlyTitle = extractTitle(p.output_data) ?? '제목 없음';
    return { id: String(p.id), title: onlyTitle };
  });
}

export function toPlanItems(plans: StudyPlan[]): UnifiedItem[] {
  return plans.map((p) => {
    let title = `대화 ${p.id}`;
    try {
      const v = JSON.parse(p.output_data);
      if (v && typeof v === 'object' && typeof v.title === 'string' && v.title.trim()) {
        title = v.title.trim();
      } else if (typeof v === 'string') {
        const v2 = JSON.parse(v);
        if (v2 && typeof v2 === 'object' && typeof v2.title === 'string' && v2.title.trim()) {
          title = v2.title.trim();
        }
      }
    } catch {}
    return { id: String(p.id), title, createdAt: p.created_at, kind: 'plan' as const };
  });
}

export function toSummaryItems(rows: SummaryItem[]): UnifiedItem[] {
  return rows.map((s) => ({
    id: `s-${s.id}`,
    title: s.title?.trim() || `요약 ${s.id}`,
    createdAt: s.created_at,
    kind: 'summary' as const,
  }));
}
