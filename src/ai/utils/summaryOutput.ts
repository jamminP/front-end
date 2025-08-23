export type ParsedSummary = {
  title?: string;
  summary?: string;
  keyPoints?: string[];
  keywords?: string[];
};

function safeParseNestedJSON(raw: unknown): any | null {
  if (typeof raw !== 'string') return null;
  try {
    const first = JSON.parse(raw);
    return typeof first === 'string' ? JSON.parse(first) : first;
  } catch {
    return null;
  }
}

function toStringArray(v: unknown): string[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v === 'string')
    return v
      .split(/\r?\n|,|·|•/g)
      .map((s) => s.replace(/^[•\-\–\d\.\)\s]+/, '').trim())
      .filter(Boolean);
  return [];
}

export function parseSummaryOutput(raw: unknown): ParsedSummary {
  const obj = typeof raw === 'object' && raw !== null ? (raw as any) : safeParseNestedJSON(raw);

  if (obj && typeof obj === 'object') {
    const summary = obj.summary ?? obj.result ?? obj.text ?? obj.body ?? obj['요약'] ?? obj['본문'];
    const keyPoints =
      obj.key_points ?? obj.keyPoints ?? obj.points ?? obj.bullets ?? obj['핵심요약'];
    const keywords = obj.keywords ?? obj.key_words ?? obj['키워드'];
    const title = obj.title ?? obj['제목'];

    return {
      title: typeof title === 'string' ? title.trim() : undefined,
      summary: typeof summary === 'string' ? summary.trim() : undefined,
      keyPoints: toStringArray(keyPoints),
      keywords: toStringArray(keywords).map((k) => k.replace(/^#/, '')),
    };
  }

  const text = String(raw ?? '').trim();
  const kwLine = text.match(/키워드\s*[:：]\s*(.+)$/im);
  const keywords = kwLine ? toStringArray(kwLine[1]) : [];
  const body = kwLine ? text.replace(kwLine[0], '').trim() : text;

  const keyPoints = body
    .split(/\r?\n/)
    .filter((ln) => /^[•\-\–\d]+\s+/.test(ln))
    .map((ln) => ln.replace(/^[•\-\–\d\.\)\s]+/, '').trim());

  return { summary: body, keyPoints, keywords };
}

export function splitSummaryForChat(p: ParsedSummary) {
  return {
    mainText: p.summary?.trim() || '',
    points: p.keyPoints && p.keyPoints.length ? p.keyPoints : undefined,
    keywords: p.keywords && p.keywords.length ? p.keywords : undefined,
    title: p.title,
  };
}
