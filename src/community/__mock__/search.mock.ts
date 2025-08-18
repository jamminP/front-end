import type {
  Category,
  ListCursorResult,
  ListCursorParams,
  SearchIn,
  SearchPostItem,
} from '../api/types';
import { dummyFree, dummyPosts, dummyShare, dummyStudy } from '../__mock__/dummyPost';

const enc = (i: number) => btoa(String(i));
const dec = (c: string | null | undefined) => (c ? Number(atob(c)) || 0 : 0);

const MAP = (p: any): SearchPostItem => ({
  post_id: p.post_id ?? p.postId ?? p.id,
  title: p.title,
  content: p.content ?? '',
  author_id: p.author_id ?? p.authorId ?? p.author ?? 'user#0000',
  category: p.category,
  created_at: p.created_at ?? p.createdAt ?? new Date().toISOString(),
  badge: p.badge,
});

const POOLS: Record<Category, SearchPostItem[]> = {
  free: dummyFree.map(MAP),
  share: dummyShare.map(MAP),
  study: dummyStudy.map(MAP),
  all: dummyPosts.map(MAP),
};

const norm = (s: string) => (s ?? '').toLowerCase();
const match = (it: SearchPostItem, q: string, where: SearchIn) => {
  const t = norm(it.title);
  const c = norm(it.content);
  const nQ = norm(q);
  if (!nQ) return true;
  if (where === 'title') return t.includes(nQ);
  if (where === 'content') return c.includes(nQ);
  return t.includes(nQ) || c.includes(nQ);
};

export async function mockListCursor(
  category: Category,
  { limit = 20, cursor, search_in, keyword }: ListCursorParams,
): Promise<ListCursorResult<SearchPostItem>> {
  const start = dec(cursor);
  let pool = POOLS[category];

  if (keyword && search_in) {
    pool = pool.filter((it) => match(it, keyword, search_in));
  }

  const slice = pool.slice(start, start + limit);
  const next = start + limit < pool.length ? enc(start + limit) : null;

  await new Promise((r) => setTimeout(r, 200));
  return { count: slice.length, next_cursor: next, items: slice };
}
