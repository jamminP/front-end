import type { StudyPlan } from './types';

export type ChatSummary = { id: string; title: string };

export function toChatSummaries(plans: StudyPlan[]): ChatSummary[] {
  return plans.map((p) => {
    let title = `대화 ${p.id}`;
    try {
      const parsed = JSON.parse(p.output_data);

      if (typeof parsed?.title === 'string' && parsed.title.trim()) {
        title = parsed.title.trim();
      }
    } catch (err) {
      console.log(`error: ${err}`);
    }

    const d = new Date(p.created_at);
    const pad = (n: number) => String(n).padStart(2, '0');
    const head = `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
    return { id: String(p.id), title: `${head} - ${title}` };
  });
}
