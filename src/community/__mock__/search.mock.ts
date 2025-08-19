import { CursorListResult, SearchPostItem, SearchQuery } from '../api/types';
import { dummyFree, dummyShare, dummyStudy } from './dummyPost';

const ALL: SearchPostItem[] = [...dummyFree, ...dummyShare, ...dummyStudy].map((p: any) => ({
  post_id: p.post_id ?? p.id,
  title: p.title,
  content: p.content ?? '',
  author_id: p.author ?? p.author_id ?? 'user#0000',
  category: p.category,
  created_at: p.created_at ?? p.created_at ?? new Date().toISOString(),
}));

function normalize(str: string) {
  return (str ?? '').toLowerCase();
}

function matchByScope(item: SearchPostItem, q: string, scope: SearchQuery['scope']): boolean {
  const normalizeQuery = normalize(q);
  if (!normalizeQuery) return false;
  const title = normalize(item.title);
  const content = normalize(item.content);
  switch (scope) {
    case 'title':
      return title.includes(normalizeQuery);
    case 'content':
      return content.includes(normalizeQuery);
    case 'title_content':
      return title.includes(normalizeQuery) || content.includes(normalizeQuery);
    default:
      return false;
  }
}

function encodeCursor(i: number) {
  return Buffer.from(String(i), 'utf-8').toString('base64');
}

function decodeCursor(cursor: string | null | undefined): number {
  if (!cursor) return 0;
  try {
    const v = Buffer.from(cursor, 'base64').toString('utf-8');
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  } catch {
    return 0;
  }
}

export async function mockSearchPosts(
  params: SearchQuery,
): Promise<CursorListResult<SearchPostItem>> {
  const { q, scope, limit = 20, cursor } = params;
  const start = decodeCursor(cursor);
  const pool = ALL.filter((it) => matchByScope(it, q, scope));
  const sliced = pool.slice(start, start + limit);
  const next = start + limit < pool.length ? encodeCursor(start + limit) : null;

  return {
    count: sliced.length,
    next_cursor: next,
    items: sliced,
  };
}
