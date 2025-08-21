import type { StudyPlan, SummaryItem } from '../types/types';

export type ChatSummary = { id: string; title: string };
export type UnifiedItem = {
  id: string;
  title: string;
  createdAt: string;
  kind: 'plan' | 'summary';
};

function extractTitle(output_data: string): string | null {
  try {
    const parsedData = JSON.parse(output_data);
    const jsonData = typeof parsedData === 'string' ? JSON.parse(parsedData) : parsedData;
    if (
      jsonData &&
      typeof jsonData === 'object' &&
      typeof jsonData.title === 'string' &&
      jsonData.title.trim()
    ) {
      return jsonData.title.trim();
    }
  } catch (err) {}
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
    const title = extractTitle(p.output_data) ?? `대화 ${p.id}`;
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
